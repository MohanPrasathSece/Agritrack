const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Use existing categories from the database
const newCrops = [
  {
    name: 'Premium Wheat',
    variety: 'HD 3086',
    category: 'grains',
    quantity: 500,
    unit: 'kg',
    price_per_unit: 32.00,
    farm_location: {
      village: 'Ludhiana',
      district: 'Punjab',
      state: 'Punjab',
      coordinates: [30.9010, 75.8573]
    },
    quality: {
      grade: 'A+',
      protein_content: '13%',
      moisture: '11%',
      test_weight: '80 kg/hl'
    },
    is_organic: true,
    certifications: ['Organic India', 'FSSAI'],
    harvest_date: '2024-04-15',
    images: [
      'https://images.unsplash.com/photo-1598301166524-05359c4e5e0b?w=400',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'
    ],
    description: 'Premium quality wheat grains with high protein content. Perfect for making chapatis and flour.',
    ai_analysis: {
      quality_score: 94,
      predicted_shelf_life: '24 months',
      market_price_range: '30-35 INR/kg',
      recommendations: 'Store in cool, dry place with proper ventilation'
    }
  },
  {
    name: 'Fresh Tomatoes',
    variety: 'Hybrid 4411',
    category: 'vegetables',
    quantity: 200,
    unit: 'kg',
    price_per_unit: 42.00,
    farm_location: {
      village: 'Kolar',
      district: 'Kolar',
      state: 'Karnataka',
      coordinates: [13.1355, 78.1314]
    },
    quality: {
      grade: 'A',
      firmness: 'Firm',
      color: 'Deep red',
      size: 'Medium-large'
    },
    is_organic: false,
    certifications: ['FSSAI'],
    harvest_date: '2024-11-28',
    images: [
      'https://images.unsplash.com/photo-1546470427-e92b2c9c09d6?w=400',
      'https://images.unsplash.com/photo-1527324678467-f7c4f793c4a2?w=400'
    ],
    description: 'Fresh, ripe tomatoes perfect for cooking and salads. Grown using sustainable farming practices.',
    ai_analysis: {
      quality_score: 87,
      predicted_shelf_life: '6 days (room temp)',
      market_price_range: '40-45 INR/kg',
      recommendations: 'Store at room temperature, avoid refrigeration for best flavor'
    }
  },
  {
    name: 'Organic Spinach',
    variety: 'Palak',
    category: 'vegetables',
    quantity: 80,
    unit: 'kg',
    price_per_unit: 48.00,
    farm_location: {
      village: 'Ooty',
      district: 'Nilgiris',
      state: 'Tamil Nadu',
      coordinates: [11.4102, 76.6953]
    },
    quality: {
      grade: 'A+',
      leaf_size: 'Large',
      color: 'Dark green',
      freshness: 'Excellent'
    },
    is_organic: true,
    certifications: ['Organic India', 'FSSAI'],
    harvest_date: '2024-11-27',
    images: [
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400',
      'https://images.unsplash.com/photo-1574384288658-8d4b8c0b9e2e?w=400'
    ],
    description: 'Premium organic spinach leaves, rich in iron and vitamins. Perfect for healthy cooking.',
    ai_analysis: {
      quality_score: 91,
      predicted_shelf_life: '4 days (refrigerated)',
      market_price_range: '45-50 INR/kg',
      recommendations: 'Refrigerate immediately and consume within 4 days'
    }
  },
  {
    name: 'Sweet Corn',
    variety: 'Sugar 75',
    category: 'vegetables',
    quantity: 150,
    unit: 'kg',
    price_per_unit: 55.00,
    farm_location: {
      village: 'Sangli',
      district: 'Sangli',
      state: 'Maharashtra',
      coordinates: [16.8524, 74.5811]
    },
    quality: {
      grade: 'A',
      kernel_size: 'Large',
      sweetness: 'Brix 18',
      tenderness: 'Tender'
    },
    is_organic: false,
    certifications: ['FSSAI'],
    harvest_date: '2024-11-25',
    images: [
      'https://images.unsplash.com/photo-1595901224831-2a3b5b4c8b2f?w=400',
      'https://images.unsplash.com/photo-1574384288658-8d4b8c0b9e2e?w=400'
    ],
    description: 'Sweet and tender corn kernels, perfect for roasting, boiling, or making corn flour.',
    ai_analysis: {
      quality_score: 88,
      predicted_shelf_life: '5 days (refrigerated)',
      market_price_range: '50-60 INR/kg',
      recommendations: 'Refrigerate and use within 5 days for best sweetness'
    }
  },
  {
    name: 'Basmati Rice',
    variety: 'Pusa 1121',
    category: 'grains',
    quantity: 300,
    unit: 'kg',
    price_per_unit: 95.00,
    farm_location: {
      village: 'Karnal',
      district: 'Karnal',
      state: 'Haryana',
      coordinates: [29.6860, 76.9905]
    },
    quality: {
      grade: 'A+',
      grain_length: '7.2mm',
      aroma: 'Strong',
      broken_grains: '1.5%'
    },
    is_organic: true,
    certifications: ['Organic India', 'FSSAI', 'Agmark'],
    harvest_date: '2024-10-20',
    images: [
      'https://images.unsplash.com/photo-1586201375761-8386502374a3?w=400',
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400'
    ],
    description: 'Premium Basmati rice with extra-long grains and excellent aroma. Aged for 12 months for enhanced flavor.',
    ai_analysis: {
      quality_score: 96,
      predicted_shelf_life: '18 months',
      market_price_range: '90-100 INR/kg',
      recommendations: 'Store in airtight containers away from moisture'
    }
  },
  {
    name: 'Fresh Onions',
    variety: 'Nasik Red',
    category: 'vegetables',
    quantity: 400,
    unit: 'kg',
    price_per_unit: 28.00,
    farm_location: {
      village: 'Nashik',
      district: 'Nashik',
      state: 'Maharashtra',
      coordinates: [19.9975, 73.7898]
    },
    quality: {
      grade: 'A',
      size: 'Medium',
      pungency: 'Medium',
      color: 'Deep red'
    },
    is_organic: false,
    certifications: ['FSSAI'],
    harvest_date: '2024-11-22',
    images: [
      'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400',
      'https://images.unsplash.com/photo-1582734143769-5ae123b03ed9?w=400'
    ],
    description: 'Fresh red onions with good storage quality and medium pungency. Essential for Indian cooking.',
    ai_analysis: {
      quality_score: 85,
      predicted_shelf_life: '3 months (proper storage)',
      market_price_range: '25-30 INR/kg',
      recommendations: 'Store in cool, dry, well-ventilated area'
    }
  },
  {
    name: 'Green Chilies',
    variety: 'Jwala',
    category: 'vegetables',
    quantity: 60,
    unit: 'kg',
    price_per_unit: 85.00,
    farm_location: {
      village: 'Jamnagar',
      district: 'Jamnagar',
      state: 'Gujarat',
      coordinates: [22.4707, 70.0577]
    },
    quality: {
      grade: 'A',
      heat_level: 'Medium',
      color: 'Dark green',
      length: '6-8 cm'
    },
    is_organic: false,
    certifications: ['FSSAI'],
    harvest_date: '2024-11-26',
    images: [
      'https://images.unsplash.com/photo-1597800866393-4e5e3db96281?w=400',
      'https://images.unsplash.com/photo-1584224244906-0e2b9772c8d9?w=400'
    ],
    description: 'Medium-hot green chilies perfect for Indian cuisine. Fresh and flavorful with good shelf life.',
    ai_analysis: {
      quality_score: 86,
      predicted_shelf_life: '7 days (refrigerated)',
      market_price_range: '80-90 INR/kg',
      recommendations: 'Refrigerate for extended shelf life'
    }
  },
  {
    name: 'Coconut',
    variety: 'Tall',
    category: 'vegetables',
    quantity: 200,
    unit: 'pieces',
    price_per_unit: 38.00,
    farm_location: {
      village: 'Kozhikode',
      district: 'Kozhikode',
      state: 'Kerala',
      coordinates: [11.2588, 75.7804]
    },
    quality: {
      grade: 'A',
      water_content: '300ml',
      copra_thickness: '12mm',
      maturity: 'Fully mature'
    },
    is_organic: true,
    certifications: ['Organic India'],
    harvest_date: '2024-11-24',
    images: [
      'https://images.unsplash.com/photo-1581375321224-79da6fd32f6e?w=400',
      'https://images.unsplash.com/photo-1546630392-0600a2e531c8?w=400'
    ],
    description: 'Fresh tall coconuts with sweet water and thick kernel. Multipurpose for cooking and religious use.',
    ai_analysis: {
      quality_score: 89,
      predicted_shelf_life: '2 months (room temp)',
      market_price_range: '35-40 INR/piece',
      recommendations: 'Store in cool, dry place. Check for cracks before purchase'
    }
  }
];

async function seedFinalCrops() {
    try {
        console.log('🌱 Starting final crop seeding...');

        // Get existing users
        const { data: existingUsers, error: usersError } = await supabase
            .from('profiles')
            .select('*');

        if (usersError) {
            console.error('Error fetching existing users:', usersError);
            return;
        }

        console.log(`👥 Found ${existingUsers.length} existing users`);

        // Get existing crops to avoid duplicates
        const { data: existingCrops, error: cropsError } = await supabase
            .from('crops')
            .select('name, variety');

        if (cropsError) {
            console.error('Error fetching existing crops:', cropsError);
            return;
        }

        const existingCropNames = new Set(existingCrops?.map(crop => `${crop.name}-${crop.variety}`) || []);
        console.log(`🌾 Found ${existingCropNames.size} existing crop varieties`);

        // Filter out crops that already exist
        const cropsToAdd = newCrops.filter(crop => 
            !existingCropNames.has(`${crop.name}-${crop.variety}`)
        );

        console.log(`🌾 Adding ${cropsToAdd.length} new crop varieties`);

        // Create crops for existing farmers
        const farmers = existingUsers.filter(user => user.role === 'farmer');
        console.log(`👨‍🌾 Found ${farmers.length} existing farmers`);

        if (farmers.length === 0) {
            console.log('❌ No farmers found, cannot create crops');
            return;
        }

        const createdCrops = [];
        for (let i = 0; i < cropsToAdd.length; i++) {
            const cropData = cropsToAdd[i];
            const farmer = farmers[i % farmers.length]; // Distribute crops among farmers

            try {
                const { data: cropDataResult, error: cropError } = await supabase
                    .from('crops')
                    .insert({
                        farmer_id: farmer.id,
                        name: cropData.name,
                        variety: cropData.variety,
                        category: cropData.category,
                        quantity: cropData.quantity,
                        unit: cropData.unit,
                        price_per_unit: cropData.price_per_unit,
                        farm_location: cropData.farm_location,
                        quality: cropData.quality,
                        is_organic: cropData.is_organic,
                        certifications: cropData.certifications,
                        harvest_date: cropData.harvest_date,
                        images: cropData.images,
                        description: cropData.description,
                        ai_analysis: cropData.ai_analysis,
                        traceability_id: `TRK${Date.now()}${Math.floor(Math.random() * 1000)}`,
                        status: 'listed',
                        is_verified: true
                    })
                    .select()
                    .single();

                if (cropError) {
                    console.error(`Error creating crop ${cropData.name}:`, cropError);
                    continue;
                }

                createdCrops.push(cropDataResult);
                console.log(`✅ Created crop: ${cropData.name} for farmer ${farmer.name}`);

            } catch (error) {
                console.error(`Error with crop ${cropData.name}:`, error);
            }
        }

        console.log('🎉 Final crop seeding completed!');
        console.log('\n📊 Summary:');
        console.log(`- New crops added: ${createdCrops.length}`);
        console.log(`- Total users in system: ${existingUsers.length}`);
        console.log(`- Farmers: ${existingUsers.filter(u => u.role === 'farmer').length}`);
        
        console.log('\n🌾 New Crops Added:');
        createdCrops.forEach(crop => {
            console.log(`- ${crop.name} (${crop.variety}) - ₹${crop.price_per_unit}/${crop.unit} - ${crop.images?.length || 0} images`);
        });

        console.log('\n✨ Database now has diverse crop data with real images!');

    } catch (error) {
        console.error('❌ Error seeding final crops:', error);
        process.exit(1);
    }
}

// Run the seeding function
seedFinalCrops().then(() => {
    console.log('\n🎉 Final crop seeding completed successfully!');
    process.exit(0);
}).catch(error => {
    console.error('❌ Final crop seeding failed:', error);
    process.exit(1);
});
