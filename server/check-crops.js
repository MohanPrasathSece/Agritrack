const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkCrops() {
    try {
        const { data, error } = await supabase
            .from('crops')
            .select('name, variety, category, quantity, price_per_unit, images');

        if (error) {
            console.error('Error:', error);
            return;
        }

        console.log('🌾 Current crops in database:');
        console.log('================================');
        data.forEach((crop, i) => {
            console.log(`${i+1}. ${crop.name} (${crop.variety})`);
            console.log(`   Category: ${crop.category}`);
            console.log(`   Quantity: ${crop.quantity} ${crop.unit}`);
            console.log(`   Price: ₹${crop.price_per_unit}/${crop.unit}`);
            console.log(`   Images: ${crop.images ? crop.images.length : 0} images`);
            console.log('');
        });

        console.log(`📊 Total crops: ${data.length}`);

    } catch (error) {
        console.error('Error checking crops:', error);
    }
}

checkCrops();
