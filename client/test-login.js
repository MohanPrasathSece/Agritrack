// Test script to verify login endpoint
const testLogin = async () => {
    try {
        console.log('🔄 Testing login endpoint...');
        console.log('API URL:', process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1');

        const response = await fetch('http://localhost:5000/api/v1/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'mohanprasath563@gmail.com',
                password: 'your_password_here' // Replace with actual password
            })
        });

        const data = await response.json();
        console.log('Response status:', response.status);
        console.log('Response data:', data);

        if (data.success) {
            console.log('✅ Login successful!');
            console.log('Session:', data.session);
            console.log('User:', data.user);
        } else {
            console.log('❌ Login failed:', data.message);
        }
    } catch (error) {
        console.error('❌ Error:', error);
    }
};

// Run the test
testLogin();
