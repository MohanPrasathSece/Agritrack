const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const newCrops = [
  {
    name: 'Organic Turmeric',
    variety: 'Prabhat',
    category: 'Spices',
    quantity: 150,
    unit: 'kg',
    price_per_unit: 180.00,
    farm_location: {
      village: 'Erode',
      district: 'Erode',
      state: 'Tamil Nadu',
      coordinates: [11.3410, 77.7332]
    },
    quality: {
      grade: 'A+',
      curcumin_content: '4.5%',
      moisture: '10%',
      purity: '99%'
    },
    is_organic: true,
    certifications: ['Organic India', 'FSSAI', 'Agmark'],
    harvest_date: '2024-12-01',
    images: [
      'https://images.unsplash.com/photo-1585059895524-72359e06133a?w=400',
      'https://images.unsplash.com/photo-1577186557243-2e3b9717c527?w=400'
    ],
    description: 'Premium organic turmeric with high curcumin content. Perfect for medicinal and culinary use.',
    ai_analysis: {
      quality_score: 95,
      predicted_shelf_life: '8 months',
      market_price_range: '170-190 INR/kg',
      recommendations: 'Store in cool, dry place away from direct sunlight'
    }
  },
  {
    name: 'Fresh Spinach',
    variety: 'All Green',
    category: 'Leafy Vegetables',
    quantity: 80,
    unit: 'kg',
    price_per_unit: 45.00,
    farm_location: {
      village: 'Ooty',
      district: 'Nilgiris',
      state: 'Tamil Nadu',
      coordinates: [11.4102, 76.6953]
    },
    quality: {
      grade: 'A',
      leaf_size: 'Medium-large',
      color: 'Deep green',
      freshness: 'Excellent'
    },
    is_organic: true,
    certifications: ['Organic India'],
    harvest_date: '2024-11-25',
    images: [
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400',
      'https://images.unsplash.com/photo-1574384288658-8d4b8c0b9e2e?w=400'
    ],
    description: 'Fresh, tender spinach leaves grown in the cool climate of Ooty. Rich in iron and vitamins.',
    ai_analysis: {
      quality_score: 88,
      predicted_shelf_life: '3 days (refrigerated)',
      market_price_range: '40-50 INR/kg',
      recommendations: 'Refrigerate immediately and consume within 3 days'
    }
  },
  {
    name: 'Pomegranate',
    variety: 'Bhagawa',
    category: 'Fruits',
    quantity: 120,
    unit: 'kg',
    price_per_unit: 280.00,
    farm_location: {
      village: 'Nashik',
      district: 'Nashik',
      state: 'Maharashtra',
      coordinates: [19.9975, 73.7898]
    },
    quality: {
      grade: 'A+',
      aril_percentage: '85%',
      sweetness: 'Brix 16',
      seed_hardness: 'Soft'
    },
    is_organic: false,
    certifications: ['FSSAI', 'GlobalGAP'],
    harvest_date: '2024-09-15',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400',
      'https://images.unsplash.com/photo-1581375321224-79da6fd32f6e?w=400'
    ],
    description: 'Sweet and juicy pomegranates with deep red arils. Excellent source of antioxidants.',
    ai_analysis: {
      quality_score: 92,
      predicted_shelf_life: '2 weeks (refrigerated)',
      market_price_range: '270-290 INR/kg',
      recommendations: 'Store in refrigerator for best shelf life'
    }
  },
  {
    name: 'Chili Peppers',
    variety: 'Guntur Sannam',
    category: 'Spices',
    quantity: 200,
    unit: 'kg',
    price_per_unit: 160.00,
    farm_location: {
      village: 'Guntur',
      district: 'Guntur',
      state: 'Andhra Pradesh',
      coordinates: [16.3067, 80.4366]
    },
    quality: {
      grade: 'A',
      capsaicin_content: '0.32%',
      color_value: '120 ASTA',
      moisture: '12%'
    },
    is_organic: false,
    certifications: ['FSSAI', 'Agmark'],
    harvest_date: '2024-11-20',
    images: [
      'https://images.unsplash.com/photo-1597800866393-4e5e3db96281?w=400',
      'https://images.unsplash.com/photo-1584224244906-0e2b9772c8d9?w=400'
    ],
    description: 'Hot and flavorful Guntur chilies, perfect for Indian cuisine and spice exports.',
    ai_analysis: {
      quality_score: 89,
      predicted_shelf_life: '6 months (dried)',
      market_price_range: '150-170 INR/kg',
      recommendations: 'Store in airtight containers to maintain pungency'
    }
  },
  {
    name: 'Cauliflower',
    variety: 'Snowball',
    category: 'Vegetables',
    quantity: 180,
    unit: 'kg',
    price_per_unit: 55.00,
    farm_location: {
      village: 'Solan',
      district: 'Solan',
      state: 'Himachal Pradesh',
      coordinates: [30.9045, 77.0996]
    },
    quality: {
      grade: 'A',
      curd_size: 'Medium-large',
      color: 'Creamy white',
      compactness: 'Firm'
    },
    is_organic: true,
    certifications: ['Organic India'],
    harvest_date: '2024-11-18',
    images: [
      'https://images.unsplash.com/photo-1598173832813-9f75d2e9e5b1?w=400',
      'https://images.unsplash.com/photo-1568907348850-1167063e13b8?w=400'
    ],
    description: 'Fresh and firm cauliflower heads grown in the cool climate of Himachal Pradesh.',
    ai_analysis: {
      quality_score: 86,
      predicted_shelf_life: '7 days (refrigerated)',
      market_price_range: '50-60 INR/kg',
      recommendations: 'Refrigerate and use within a week for best quality'
    }
  },
  {
    name: 'Coconut',
    variety: 'Tall x Dwarf',
    category: 'Fruits',
    quantity: 300,
    unit: 'pieces',
    price_per_unit: 35.00,
    farm_location: {
      village: 'Kozhikode',
      district: 'Kozhikode',
      state: 'Kerala',
      coordinates: [11.2588, 75.7804]
    },
    quality: {
      grade: 'A',
      water_content: '250ml',
      copra_content: '200g',
      maturity: 'Fully mature'
    },
    is_organic: true,
    certifications: ['Organic India'],
    harvest_date: '2024-11-22',
    images: [
      'https://images.unsplash.com/photo-1581375321224-79da6fd32f6e?w=400',
      'https://images.unsplash.com/photo-1546630392-0600a2e531c8?w=400'
    ],
    description: 'Fresh coconuts from Kerala with sweet water and thick kernel. Multipurpose for cooking and religious use.',
    ai_analysis: {
      quality_score: 90,
      predicted_shelf_life: '2 months (room temp)',
      market_price_range: '30-40 INR/piece',
      recommendations: 'Store in cool, dry place. Check for cracks before purchase'
    }
  },
  {
    name: 'Coriander Leaves',
    variety: 'Green',
    category: 'Leafy Vegetables',
    quantity: 60,
    unit: 'kg',
    price_per_unit: 80.00,
    farm_location: {
      village: 'Hosur',
      district: 'Krishnagiri',
      state: 'Tamil Nadu',
      coordinates: [12.7409, 77.8207]
    },
    quality: {
      grade: 'A',
      leaf_size: 'Medium',
      aroma: 'Strong',
      color: 'Bright green'
    },
    is_organic: true,
    certifications: ['Organic India'],
    harvest_date: '2024-11-26',
    images: [
      'https://images.unsplash.com/photo-1598495271503-7b632d50b761?w=400',
      'https://images.unsplash.com/photo-1574384288658-8d4b8c0b9e2e?w=400'
    ],
    description: 'Aromatic coriander leaves essential for Indian cooking. Fresh and flavorful.',
    ai_analysis: {
      quality_score: 87,
      predicted_shelf_life: '4 days (refrigerated)',
      market_price_range: '70-90 INR/kg',
      recommendations: 'Store in refrigerator with stems in water'
    }
  },
  {
    name: 'Banana',
    variety: 'Robusta',
    category: 'Fruits',
    quantity: 250,
    unit: 'dozen',
    price_per_unit: 45.00,
    farm_location: {
      village: 'Tiruchirappalli',
      district: 'Tiruchirappalli',
      state: 'Tamil Nadu',
      coordinates: [10.7905, 78.7047]
    },
    quality: {
      grade: 'A',
      size: 'Medium-large',
      sweetness: 'Brix 20',
      ripeness: 'Partially ripe'
    },
    is_organic: false,
    certifications: ['FSSAI'],
    harvest_date: '2024-11-24',
    images: [
      'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400',
      'https://images.unsplash.com/photo-1563241521-1a5d1e6b4c6c?w=400'
    ],
    description: 'Fresh Robusta bananas, perfect for direct consumption and cooking applications.',
    ai_analysis: {
      quality_score: 91,
      predicted_shelf_life: '5 days (room temp)',
      market_price_range: '40-50 INR/dozen',
      recommendations: 'Keep at room temperature, avoid refrigeration'
    }
  }
];

async function seedCrops() {
  try {
    console.log('🌱 Starting crop seeding (corrected schema)...');

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

    console.log('🎉 Crop seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- New crops added: ${createdCrops.length}`);
    console.log(`- Total users in system: ${existingUsers.length}`);
    console.log(`- Farmers: ${existingUsers.filter(u => u.role === 'farmer').length}`);
    console.log(`- Aggregators: ${existingUsers.filter(u => u.role === 'aggregator').length}`);
    console.log(`- Retailers: ${existingUsers.filter(u => u.role === 'retailer').length}`);
    console.log(`- Consumers: ${existingUsers.filter(u => u.role === 'consumer').length}`);
    
    console.log('\n🌾 New Crops Added:');
    createdCrops.forEach(crop => {
      console.log(`- ${crop.name} (${crop.variety}) - ₹${crop.price_per_unit}/${crop.unit}`);
    });

    console.log('\n✨ Database is now populated with diverse crop data!');
    console.log('All crops include real images from Unsplash and comprehensive details.');

  } catch (error) {
    console.error('❌ Error seeding crops:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedCrops().then(() => {
  console.log('\n🎉 Crop seeding completed successfully!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Crop seeding failed:', error);
  process.exit(1);
});
