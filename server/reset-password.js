const supabase = require('./config/supabase');
require('dotenv').config();

async function resetPassword(email, newPassword) {
    try {
        console.log(`🔄 Resetting password for: ${email}`);

        // Get user by email
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

        if (listError) {
            console.error('❌ Error listing users:', listError);
            return;
        }

        const user = users.find(u => u.email === email);

        if (!user) {
            console.error(`❌ User not found: ${email}`);
            return;
        }

        console.log(`✅ Found user: ${user.id}`);

        // Update password using Admin API
        const { error: updateError } = await supabase.auth.admin.updateUserById(
            user.id,
            { password: newPassword }
        );

        if (updateError) {
            console.error('❌ Error updating password:', updateError.message);
            return;
        }

        console.log(`✅ Password updated successfully for ${email}`);
        console.log(`📝 New password: ${newPassword}`);
        console.log('\n🎉 You can now log in with the new password!');
    } catch (error) {
        console.error('❌ Script error:', error);
    }
}

// Usage: node reset-password.js
const email = 'mohanprasath563@gmail.com';
const newPassword = 'password123'; // Change this to your desired password

resetPassword(email, newPassword);
