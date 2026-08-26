const express = require('express');
const supabase = require('../config/supabase');
const router = express.Router();

// @route   POST /api/v1/auth/register
// @desc    Register a new user and bypass email confirmation
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, address } = req.body;
    console.log('Registration attempt:', { name, email, role, phone });

    // Basic validation
    if (!name || !email || !password || !role || !phone) {
      console.warn('Registration failed validation:', {
        hasName: !!name,
        hasEmail: !!email,
        hasPassword: !!password,
        hasRole: !!role,
        hasPhone: !!phone
      });
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if user already exists in profiles table
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', email)
      .single();

    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists. Please login instead.'
      });
    }

    // 1. Create user in Supabase Auth using Admin API to bypass email confirmation
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // This bypasses email confirmation
      user_metadata: { name, role }
    });

    if (authError) {
      // Check if it's a duplicate email error
      if (authError.message.includes('already registered') || authError.message.includes('already exists')) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists. Please login instead.'
        });
      }
      return res.status(400).json({
        success: false,
        message: authError.message
      });
    }

    // 2. Create the user profile in the public 'profiles' table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert([{
        id: authUser.user.id,
        name,
        email,
        phone,
        role,
        address,
        created_at: new Date()
      }])
      .select()
      .single();

    if (profileError) {
      // Cleanup: if profile creation fails, delete the auth user
      await supabase.auth.admin.deleteUser(authUser.user.id);

      // Check if it's a duplicate key error
      if (profileError.code === '23505') {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists. Please login instead.'
        });
      }

      throw profileError;
    }

    // 3. Automatically log the user in to get a session
    const { createClient } = require('@supabase/supabase-js');
    const tempClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    const { data: loginData } = await tempClient.auth.signInWithPassword({
      email,
      password
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      session: loginData.session,
      user: profile
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration. Please try again.'
    });
  }
});

// @route   POST /api/v1/auth/login
// @desc    Login user and return session
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Note: In backend with service role, we can't 'sign in' as a user to get a session 
    // to pass back easily if using createClient with service key (it doesn't maintain state).
    // However, we can use a fresh client for the login attempt.
    const { createClient } = require('@supabase/supabase-js');
    const tempClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY || 'dummy');

    const { data, error: loginError } = await tempClient.auth.signInWithPassword({
      email,
      password
    });

    if (loginError) {
      return res.status(400).json({
        success: false,
        message: loginError.message
      });
    }

    // Fetch profile to return along with session
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    res.json({
      success: true,
      message: 'Login successful',
      session: data.session,
      user: profile || data.user
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login: ' + error.message
    });
  }
});

module.exports = router;
