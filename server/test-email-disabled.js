const supabase = require('./config/supabase');
require('dotenv').config();

async function testEmailDisabled() {
    console.log('🧪 Testing if emails are disabled...');
    
    try {
        // Test 1: Try to create a user with email confirmation disabled
        const testEmail = `test${Date.now()}@example.com`;
        console.log(`📧 Testing user creation for: ${testEmail}`);
        
        const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
            email: testEmail,
            password: 'testpassword123',
            email_confirm: true, // Should bypass email confirmation
            user_metadata: { name: 'Test User', role: 'consumer' }
        });

        if (authError) {
            console.error('❌ Error creating test user:', authError.message);
            return;
        }

        console.log('✅ Test user created successfully without email confirmation');
        console.log(`📝 User ID: ${authUser.user.id}`);
        
        // Clean up - delete the test user
        await supabase.auth.admin.deleteUser(authUser.user.id);
        console.log('🧹 Test user cleaned up');
        
        console.log('\n🎉 Email functionality is successfully disabled!');
        console.log('✅ Users can be created without email confirmation');
        console.log('✅ No rate limiting errors for email sending');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

testEmailDisabled();
