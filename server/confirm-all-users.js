const supabase = require('./config/supabase');
const { grantBlockchainRole } = require('./config/blockchain');
require('dotenv').config();

async function confirmAllUsers() {
    try {
        console.log('🔄 Fetching all users from Supabase Auth...');

        // Get all users using Admin API
        const { data: { users }, error } = await supabase.auth.admin.listUsers();

        if (error) {
            console.error('❌ Error fetching users:', error);
            return;
        }

        console.log(`📊 Found ${users.length} users`);

        // Confirm each unconfirmed user
        for (const user of users) {
            // 1. Confirm Email in Auth
            if (!user.email_confirmed_at) {
                console.log(`✉️  Confirming user: ${user.email}`);

                const { error: updateError } = await supabase.auth.admin.updateUserById(
                    user.id,
                    { email_confirm: true }
                );

                if (updateError) {
                    console.error(`❌ Error confirming ${user.email}:`, updateError.message);
                } else {
                    console.log(`✅ Confirmed: ${user.email}`);
                }
            } else {
                console.log(`✓ Already confirmed: ${user.email}`);
            }

            // 2. Sync Blockchain Role
            // Fetch profile to get role and wallet_address
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('role, wallet_address')
                .eq('id', user.id)
                .single();

            if (profileError) {
                console.warn(`⚠️  Profile not found for ${user.email}, skipping blockchain role sync.`);
                continue;
            }

            if (profile.wallet_address && profile.role) {
                console.log(`⛓️  Syncing blockchain role for ${user.email} (${profile.role})...`);
                const bcResult = await grantBlockchainRole(profile.role, profile.wallet_address);
                if (bcResult.success) {
                    console.log(`✅ Blockchain role granted: ${bcResult.txHash}`);
                } else {
                    console.log(`⚠️  Blockchain role grant failed: ${bcResult.error}`);
                }
            } else {
                console.log(`ℹ️  No wallet address for ${user.email}, skipping blockchain sync.`);
            }
        }

        console.log('\n🎉 All users have been processed and synced with Blockchain!');
    } catch (error) {
        console.error('❌ Script error:', error);
    }
}

confirmAllUsers();

