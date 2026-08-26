const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Sample data with realistic Indian agricultural context
const users = [
  // Farmers
  {
    email: 'rajesh.kumar@farm.com',
    name: 'Rajesh Kumar',
    role: 'farmer',
    phone: '+919876543210',
    address: {
      village: 'Anandpur',
      district: 'Punjab',
      state: 'Punjab',
      pincode: '140401'
    },
    farmer_details: {
      farm_size: '15 acres',
      farming_experience: '12 years',
      organic_certified: true,
      preferred_crops: ['wheat', 'rice', 'vegetables']
    }
  },
  {
    email: 'sita.devi@farm.com',
    name: 'Sita Devi',
    role: 'farmer',
    phone: '+919876543211',
    address: {
      village: 'Madhubani',
      district: 'Darbhanga',
      state: 'Bihar',
      pincode: '847211'
    },
    farmer_details: {
      farm_size: '8 acres',
      farming_experience: '8 years',
      organic_certified: false,
      preferred_crops: ['mango', 'litchi', 'vegetables']
    }
  },
  {
    email: 'ram.singh@farm.com',
    name: 'Ram Singh',
    role: 'farmer',
    phone: '+919876543212',
    address: {
      village: 'Nashik',
      district: 'Nashik',
      state: 'Maharashtra',
      pincode: '422001'
    },
    farmer_details: {
      farm_size: '20 acres',
      farming_experience: '15 years',
      organic_certified: true,
      preferred_crops: ['grapes', 'onions', 'tomatoes']
    }
  },
  // Aggregators
  {
    email: 'amit.agro@collect.com',
    name: 'Amit Agro Services',
    role: 'aggregator',
    phone: '+919876543213',
    address: {
      area: 'Mandi Gobindgarh',
      district: 'Fatehgarh Sahib',
      state: 'Punjab',
      pincode: '147301'
    }
  },
  {
    email: 'green.harvest@collect.com',
    name: 'Green Harvest Collectors',
    role: 'aggregator',
    phone: '+919876543214',
    address: {
      area: 'Kalyan',
      district: 'Thane',
      state: 'Maharashtra',
      pincode: '421301'
    }
  },
  // Retailers
  {
    email: 'fresh.mart@retail.com',
    name: 'Fresh Mart Supermarket',
    role: 'retailer',
    phone: '+919876543215',
    address: {
      area: 'Connaught Place',
      district: 'New Delhi',
      state: 'Delhi',
      pincode: '110001'
    }
  },
  {
    email: 'organic.store@retail.com',
    name: 'Organic Food Store',
    role: 'retailer',
    phone: '+919876543216',
    address: {
      area: 'Koramangala',
      district: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560034'
    }
  },
  // Consumers
  {
    email: 'priya.sharma@email.com',
    name: 'Priya Sharma',
    role: 'consumer',
    phone: '+919876543217',
    address: {
      area: 'Gurgaon',
      district: 'Gurgaon',
      state: 'Haryana',
      pincode: '122001'
    }
  },
  {
    email: 'rahul.verma@email.com',
    name: 'Rahul Verma',
    role: 'consumer',
    phone: '+919876543218',
    address: {
      area: 'Powai',
      district: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400076'
    }
  }
];

const crops = [
  {
    name: 'Basmati Rice',
    variety: 'Pusa Basmati 1121',
    category: 'Grains',
    quantity: 500,
    unit: 'kg',
    price_per_unit: 85.50,
    farm_location: {
      village: 'Anandpur',
      district: 'Punjab',
      coordinates: [30.8333, 76.3833]
    },
    quality: {
      grade: 'A+',
      moisture_content: '12%',
      purity: '98%',
      broken_grains: '2%'
    },
    is_organic: true,
    certifications: ['Organic India', 'FSSAI'],
    harvest_date: '2024-10-15',
    sowing_date: '2024-07-01',
    images: [
      'https://images.unsplash.com/photo-1586201375761-8386502374a3?w=400',
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400'
    ],
    description: 'Premium quality Basmati rice with excellent aroma and long grains. Grown using organic farming methods.',
    ai_analysis: {
      quality_score: 92,
      predicted_shelf_life: '12 months',
      market_price_range: '80-90 INR/kg',
      recommendations: 'Store in airtight containers to maintain quality'
    }
  },
  {
    name: 'Mango',
    variety: 'Alphonso',
    category: 'Fruits',
    quantity: 200,
    unit: 'kg',
    price_per_unit: 250.00,
    farm_location: {
      village: 'Madhubani',
      district: 'Darbhanga',
      coordinates: [26.3747, 86.2775]
    },
    quality: {
      grade: 'A',
      sweetness: 'Brix 18',
      size: 'Large',
      color: 'Golden yellow'
    },
    is_organic: false,
    certifications: ['FSSAI'],
    harvest_date: '2024-05-20',
    sowing_date: '2023-08-15',
    images: [
      'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400',
      'https://images.unsplash.com/photo-1596404643764-2a2b4c148d6b?w=400'
    ],
    description: 'Sweet and juicy Alphonso mangoes from Bihar. Known for their rich flavor and buttery texture.',
    ai_analysis: {
      quality_score: 88,
      predicted_shelf_life: '7 days (room temp)',
      market_price_range: '240-260 INR/kg',
      recommendations: 'Refrigerate immediately after purchase'
    }
  },
  {
    name: 'Tomatoes',
    variety: 'Hybrid Tomato-135',
    category: 'Vegetables',
    quantity: 300,
    unit: 'kg',
    price_per_unit: 35.00,
    farm_location: {
      village: 'Nashik',
      district: 'Nashik',
      coordinates: [19.9975, 73.7898]
    },
    quality: {
      grade: 'A',
      firmness: 'Firm',
      color: 'Deep red',
      size: 'Medium'
    },
    is_organic: true,
    certifications: ['Organic India'],
    harvest_date: '2024-11-10',
    sowing_date: '2024-09-01',
    images: [
      'https://images.unsplash.com/photo-1546470427-e92b2c9c09d6?w=400',
      'https://images.unsplash.com/photo-1527324678467-f7c4f793c4a2?w=400'
    ],
    description: 'Fresh, ripe tomatoes grown without pesticides. Perfect for cooking and salads.',
    ai_analysis: {
      quality_score: 85,
      predicted_shelf_life: '5 days (room temp)',
      market_price_range: '30-40 INR/kg',
      recommendations: 'Store at room temperature, avoid refrigeration'
    }
  },
  {
    name: 'Wheat',
    variety: 'HD 2967',
    category: 'Grains',
    quantity: 800,
    unit: 'kg',
    price_per_unit: 28.00,
    farm_location: {
      village: 'Anandpur',
      district: 'Punjab',
      coordinates: [30.8333, 76.3833]
    },
    quality: {
      grade: 'A',
      protein_content: '12%',
      gluten_content: 'Strong',
      test_weight: '78 kg/hl'
    },
    is_organic: true,
    certifications: ['Organic India', 'FSSAI'],
    harvest_date: '2024-04-10',
    sowing_date: '2023-11-15',
    images: [
      'https://images.unsplash.com/photo-1598301166524-05359c4e5e0b?w=400',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'
    ],
    description: 'High-quality wheat grains suitable for making chapatis and other Indian breads.',
    ai_analysis: {
      quality_score: 90,
      predicted_shelf_life: '18 months',
      market_price_range: '25-30 INR/kg',
      recommendations: 'Store in cool, dry place away from moisture'
    }
  },
  {
    name: 'Grapes',
    variety: 'Thompson Seedless',
    category: 'Fruits',
    quantity: 150,
    unit: 'kg',
    price_per_unit: 120.00,
    farm_location: {
      village: 'Nashik',
      district: 'Nashik',
      coordinates: [19.9975, 73.7898]
    },
    quality: {
      grade: 'A+',
      sweetness: 'Brix 16',
      size: 'Medium-large',
      color: 'Green'
    },
    is_organic: true,
    certifications: ['Organic India', 'GlobalGAP'],
    harvest_date: '2024-02-15',
    sowing_date: '2023-06-01',
    images: [
      'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400',
      'https://images.unsplash.com/photo-1506764685-c8b735a8ca44?w=400'
    ],
    description: 'Sweet and seedless grapes, perfect for fresh consumption and wine making.',
    ai_analysis: {
      quality_score: 94,
      predicted_shelf_life: '10 days (refrigerated)',
      market_price_range: '110-130 INR/kg',
      recommendations: 'Refrigerate and wash before consumption'
    }
  },
  {
    name: 'Onions',
    variety: 'Nasik Red',
    category: 'Vegetables',
    quantity: 400,
    unit: 'kg',
    price_per_unit: 25.00,
    farm_location: {
      village: 'Nashik',
      district: 'Nashik',
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
    harvest_date: '2024-09-20',
    sowing_date: '2024-05-15',
    images: [
      'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400',
      'https://images.unsplash.com/photo-1582734143769-5ae123b03ed9?w=400'
    ],
    description: 'Fresh red onions with good storage quality. Essential ingredient in Indian cooking.',
    ai_analysis: {
      quality_score: 87,
      predicted_shelf_life: '2 months (proper storage)',
      market_price_range: '20-30 INR/kg',
      recommendations: 'Store in cool, dry, well-ventilated area'
    }
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding (direct method)...');

    // First, clear existing data to avoid conflicts
    console.log('🧹 Cleaning existing data...');
    await supabase.from('collections').delete().neq('id', '');
    await supabase.from('orders').delete().neq('id', '');
    await supabase.from('crops').delete().neq('id', '');
    await supabase.from('profiles').delete().neq('id', '');

    // Create users directly (bypassing auth for seeding)
    console.log('👥 Creating users...');
    const createdUsers = [];

    for (const userData of users) {
      try {
        const userId = uuidv4();
        
        // Create profile directly
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            email: userData.email,
            name: userData.name,
            role: userData.role,
            phone: userData.phone,
            address: userData.address,
            farmer_details: userData.farmer_details || null,
            is_active: true
          })
          .select()
          .single();

        if (profileError) {
          console.error(`Error creating profile for ${userData.email}:`, profileError);
          continue;
        }

        createdUsers.push({ ...profileData, email: userData.email });
        console.log(`✅ Created user: ${userData.name} (${userData.role})`);

      } catch (error) {
        console.error(`Error with user ${userData.email}:`, error);
      }
    }

    // Create crops for farmers
    console.log('🌾 Creating crops...');
    const farmers = createdUsers.filter(user => user.role === 'farmer');
    
    if (farmers.length === 0) {
      console.log('❌ No farmers created, skipping crop creation');
      return;
    }

    for (let i = 0; i < crops.length; i++) {
      const cropData = crops[i];
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
            sowing_date: cropData.sowing_date,
            images: cropData.images,
            description: cropData.description,
            ai_analysis: cropData.ai_analysis,
            traceability_id: `TRK${Date.now()}${Math.floor(Math.random() * 1000)}`,
            status: 'listed',
            availability: 'available',
            is_verified: true,
            is_active: true
          })
          .select()
          .single();

        if (cropError) {
          console.error(`Error creating crop ${cropData.name}:`, cropError);
          continue;
        }

        console.log(`✅ Created crop: ${cropData.name} for farmer ${farmer.name}`);

      } catch (error) {
        console.error(`Error with crop ${cropData.name}:`, error);
      }
    }

    // Create some sample orders
    console.log('📦 Creating sample orders...');
    const retailers = createdUsers.filter(user => user.role === 'retailer');
    const availableCrops = await supabase.from('crops').select('*').eq('status', 'listed');

    if (availableCrops.data && retailers.length > 0) {
      for (let i = 0; i < Math.min(3, availableCrops.data.length); i++) {
        const crop = availableCrops.data[i];
        const retailer = retailers[i % retailers.length];
        const quantity = Math.min(crop.quantity, 50); // Order smaller quantities

        try {
          const { error: orderError } = await supabase
            .from('orders')
            .insert({
              order_id: `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`,
              crop_id: crop.id,
              farmer_id: crop.farmer_id,
              buyer_id: retailer.id,
              quantity: quantity,
              unit: crop.unit,
              price_per_unit: crop.price_per_unit,
              total_amount: quantity * crop.price_per_unit,
              status: 'confirmed',
              payment_status: 'paid',
              payment_method: 'online',
              order_date: new Date().toISOString(),
              expected_delivery_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              delivery_address: retailer.address
            });

          if (orderError) {
            console.error(`Error creating order:`, orderError);
          } else {
            console.log(`✅ Created order for ${crop.name} to ${retailer.name}`);
          }
        } catch (error) {
          console.error(`Error with order creation:`, error);
        }
      }
    }

    // Create some sample collections for aggregators
    console.log('🚚 Creating sample collections...');
    const aggregators = createdUsers.filter(user => user.role === 'aggregator');

    if (aggregators.length > 0 && availableCrops.data) {
      for (let i = 0; i < Math.min(2, availableCrops.data.length); i++) {
        const crop = availableCrops.data[i];
        const aggregator = aggregators[i % aggregators.length];
        const collectedQuantity = Math.min(crop.quantity, 100);

        try {
          const { error: collectionError } = await supabase
            .from('collections')
            .insert({
              collection_id: `COL${Date.now()}${Math.floor(Math.random() * 1000)}`,
              aggregator_id: aggregator.id,
              source_crop_id: crop.id,
              farmer_id: crop.farmer_id,
              collected_quantity: collectedQuantity,
              collected_unit: crop.unit,
              collection_location: crop.farm_location,
              quality_assessment: {
                visual_quality: 'Good',
                moisture_content: 'Optimal',
                packaging: 'Proper',
                overall_grade: 'A'
              },
              status: 'collected',
              is_active: true
            });

          if (collectionError) {
            console.error(`Error creating collection:`, collectionError);
          } else {
            console.log(`✅ Created collection for ${crop.name} by ${aggregator.name}`);
          }
        } catch (error) {
          console.error(`Error with collection creation:`, error);
        }
      }
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Users created: ${createdUsers.length}`);
    console.log(`- Farmers: ${createdUsers.filter(u => u.role === 'farmer').length}`);
    console.log(`- Aggregators: ${createdUsers.filter(u => u.role === 'aggregator').length}`);
    console.log(`- Retailers: ${createdUsers.filter(u => u.role === 'retailer').length}`);
    console.log(`- Consumers: ${createdUsers.filter(u => u.role === 'consumer').length}`);
    console.log(`- Crops created: ${crops.length}`);
    
    console.log('\n🔑 Login Credentials:');
    console.log('Note: These users were created directly in the database');
    console.log('You may need to implement password reset or admin approval for login');
    console.log('\nFarmers:');
    createdUsers.filter(u => u.role === 'farmer').forEach(user => {
      console.log(`- ${user.name}: ${user.email}`);
    });
    console.log('\nAggregators:');
    createdUsers.filter(u => u.role === 'aggregator').forEach(user => {
      console.log(`- ${user.name}: ${user.email}`);
    });
    console.log('\nRetailers:');
    createdUsers.filter(u => u.role === 'retailer').forEach(user => {
      console.log(`- ${user.name}: ${user.email}`);
    });
    console.log('\nConsumers:');
    createdUsers.filter(u => u.role === 'consumer').forEach(user => {
      console.log(`- ${user.name}: ${user.email}`);
    });

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedDatabase().then(() => {
  console.log('\n✨ Seeding completed. You can now test the application with sample data!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});
