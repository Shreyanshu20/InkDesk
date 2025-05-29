const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Category = require('../models/category.model');
const SubCategory = require('../models/subCategory.model');
const Product = require('../models/product.model');
const User = require('../models/User.model');
const Review = require('../models/review.model'); 
const Banner = require('../models/banner.model');
const Order = require('../models/order.model');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('MongoDB connected for initialization...'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Add sample users data
const sampleUsers = [
    {
        first_name: 'Rajesh',
        last_name: 'Kumar',
        email: 'rajesh.kumar@email.com',
        password: 'password123',
        phone: '+91-9876543210',
        isAccountVerified: true,
        role: 'user'
    },
    {
        first_name: 'Priya',
        last_name: 'Sharma',
        email: 'priya.sharma@email.com',
        password: 'password123',
        phone: '+91-9876543211',
        isAccountVerified: true,
        role: 'user'
    },
    {
        first_name: 'Amit',
        last_name: 'Patel',
        email: 'amit.patel@email.com',
        password: 'password123',
        phone: '+91-9876543212',
        isAccountVerified: true,
        role: 'user'
    },
    {
        first_name: 'Sneha',
        last_name: 'Gupta',
        email: 'sneha.gupta@email.com',
        password: 'password123',
        phone: '+91-9876543213',
        isAccountVerified: true,
        role: 'user'
    },
    {
        first_name: 'Vikram',
        last_name: 'Singh',
        email: 'vikram.singh@email.com',
        password: 'password123',
        phone: '+91-9876543214',
        isAccountVerified: true,
        role: 'user'
    },
    {
        first_name: 'Anita',
        last_name: 'Verma',
        email: 'anita.verma@email.com',
        password: 'password123',
        phone: '+91-9876543215',
        isAccountVerified: true,
        role: 'user'
    },
    {
        first_name: 'Rohit',
        last_name: 'Joshi',
        email: 'rohit.joshi@email.com',
        password: 'password123',
        phone: '+91-9876543216',
        isAccountVerified: true,
        role: 'user'
    },
    {
        first_name: 'Kavita',
        last_name: 'Nair',
        email: 'kavita.nair@email.com',
        password: 'password123',
        phone: '+91-9876543217',
        isAccountVerified: true,
        role: 'user'
    },
    {
        first_name: 'Suresh',
        last_name: 'Reddy',
        email: 'suresh.reddy@email.com',
        password: 'password123',
        phone: '+91-9876543218',
        isAccountVerified: true,
        role: 'user'
    },
    {
        first_name: 'Meera',
        last_name: 'Iyer',
        email: 'meera.iyer@email.com',
        password: 'password123',
        phone: '+91-9876543219',
        isAccountVerified: true,
        role: 'user'
    }
];

// Define the exact categories you want
const categories = [
    {
        category_name: 'Stationery',
        category_image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=200&fit=crop'
    },
    {
        category_name: 'Office Supplies',
        category_image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=300&h=200&fit=crop'
    },
    {
        category_name: 'Art Supplies',
        category_image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=200&fit=crop'
    },
    {
        category_name: 'Craft Materials',
        category_image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=300&h=200&fit=crop'
    }
];

const subcategoriesData = {
    'Stationery': [
        'Erasers',
        'Highlighters',
        'Journals',
        'Notebooks',
        'Pencils',
        'Pens',
        'Sharpeners',
        'Sticky Notes',
        'To-Do Lists'
    ],
    'Office Supplies': [
        'Calculators',
        'Cutters',
        'Folders and Filing',
        'Glue and Adhesives',
        'Magnifiers',
        'Organizers',
        'Paperclips and Rubber Bands',
        'Punches',
        'Scissors and Paper Trimmers',
        'Staplers and Pins',
        'Whiteboards and Markers'
    ],
    'Craft Materials': [
        'Craft Glue and Adhesives',
        'Craft Paper',
        'Masking and Decoration Tapes',
        'Stamps and Pads',
        'Stickers'
    ],
    'Art Supplies': [
        'Art Pencils',
        'Artist Sketch Pads and Sheets',
        'Crayons and Oil Pastels',
        'Drawing Books',
        'Markers and Pens',
        'Paint Brushes and Palette Knives',
        'Paints'
    ]
};

// Define the owner ID for all products
const OWNER_ID = '68305f1aa480b5a7f4317b48';

const createReviewsForProduct = (productId, users) => {
    const reviews = [];
    const numReviews = Math.floor(Math.random() * 8) + 3; // 3-10 reviews per product

    // Sample review comments for different ratings
    const reviewComments = {
        5: [
            "Excellent quality! Highly recommended. The product exceeded my expectations and arrived quickly.",
            "Perfect product, exactly what I needed. Great value for money and fantastic customer service.",
            "Outstanding quality and fast delivery. Will definitely buy again from this seller.",
            "Amazing product, will definitely buy again. Top-notch quality and packaging.",
            "Top-notch quality, exceeded expectations. Best purchase I've made in a while."
        ],
        4: [
            "Very good product, minor issues but overall satisfied. Would recommend to others.",
            "Good quality, worth the price. Shipping was fast and packaging was secure.",
            "Nice product, fast shipping. Only minor complaint is the packaging could be better.",
            "Pretty good, would recommend. Quality is solid for the price point.",
            "Solid product, good value for money. Happy with my purchase overall."
        ],
        3: [
            "Average product, nothing special. Does the job but nothing extraordinary.",
            "Okay quality, as expected. Price is fair for what you get.",
            "Fair product for the price. Meets basic expectations but room for improvement.",
            "Decent quality, could be better. Average experience, nothing to complain about.",
            "Average, neither good nor bad. Does what it's supposed to do."
        ],
        2: [
            "Below expectations, poor quality. Product feels cheap and flimsy.",
            "Not satisfied with the quality. Had issues right out of the box.",
            "Product didn't meet expectations. Quality control seems lacking.",
            "Quality issues, wouldn't recommend. Better options available elsewhere.",
            "Disappointing product quality. Not worth the money spent."
        ],
        1: [
            "Very poor quality, waste of money. Product broke within days of use.",
            "Terrible product, completely unsatisfied. Requesting immediate refund.",
            "Worst purchase ever made. Product doesn't work as advertised.",
            "Extremely poor quality, avoid this. Complete waste of time and money.",
            "Complete waste of money. Product is defective and unusable."
        ]
    };

    // Create a more realistic rating distribution (higher ratings more common)
    const ratingWeights = [1, 2, 4, 6, 8]; // Weights for ratings 1-5

    const selectedUsers = users.sort(() => 0.5 - Math.random()).slice(0, numReviews);

    selectedUsers.forEach(user => {
        // Weighted random rating selection
        const totalWeight = ratingWeights.reduce((sum, weight) => sum + weight, 0);
        let random = Math.random() * totalWeight;
        let rating = 5;

        for (let i = 0; i < ratingWeights.length; i++) {
            random -= ratingWeights[i];
            if (random <= 0) {
                rating = i + 1;
                break;
            }
        }

        // Select random review comment for this rating
        const commentOptions = reviewComments[rating];
        const comment = commentOptions[Math.floor(Math.random() * commentOptions.length)];

        reviews.push({
            user_id: user._id,
            product_id: productId,
            rating: rating,
            comment: comment // Use 'comment' to match Review model
        });
    });

    return reviews;
};

// Function to calculate product ratings from reviews
const calculateProductRatings = async (productId) => {
    const reviews = await Review.find({ product_id: productId });

    if (reviews.length === 0) {
        return {
            product_rating: 0,
            review_count: 0
        };
    }

    const totalReviews = reviews.length;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    const average = Math.round((sum / totalReviews) * 10) / 10; // Round to 1 decimal

    return {
        product_rating: average,
        review_count: totalReviews
    };
};

// Create sample products for each subcategory
const createSampleProducts = (categoryName, subcategoryName, categoryId) => {


    // Create 2-3 products per subcategory with realistic data
    const productTemplates = {
        // Stationery products
        'Erasers': [
            {
                product_name: 'Faber-Castell Dust-Free Eraser',
                product_brand: 'Faber-Castell',
                product_description: 'Premium dust-free eraser that removes pencil marks cleanly without leaving residue. Perfect for precise erasing in technical drawings and writing.',
                product_price: 25,
                product_discount: 10,
                product_image: 'https://images.unsplash.com/photo-1606721977440-1806c7a85969?w=400&h=400&fit=crop&auto=format',
                product_stock: 150
            },
            {
                product_name: 'Apsara Non-Dust Eraser',
                product_brand: 'Apsara',
                product_description: 'Traditional white eraser by Apsara, trusted by students for generations. Soft texture that erases smoothly without tearing paper.',
                product_price: 5,
                product_discount: 0,
                product_image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&auto=format',
                product_stock: 8  // Low stock
            },
            {
                product_name: 'Staedtler Mars Plastic Eraser',
                product_brand: 'Staedtler',
                product_description: 'High-quality plastic eraser ideal for erasing on paper and drafting film. Minimal crumbling and excellent erasing performance.',
                product_price: 35,
                product_discount: 15,
                product_image: 'https://images.unsplash.com/photo-1553649084-4d4ba9a52e8d?w=400&h=400&fit=crop&auto=format',
                product_stock: 0  // Out of stock
            },
            {
                product_name: 'Camlin Kokuyo Eraser Pack of 5',
                product_brand: 'Camlin',
                product_description: 'Pack of 5 premium erasers with excellent erasing quality. Long-lasting and perfect for school and office use.',
                product_price: 40,
                product_discount: 5,
                product_image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400&h=400&fit=crop&auto=format',
                product_stock: 75
            },
            {
                product_name: 'Pilot Foam Eraser For Ink',
                product_brand: 'Pilot',
                product_description: 'Specialized foam eraser designed to erase ink from ballpoint pens and gel pens. Unique formula that works on most ink types.',
                product_price: 60,
                product_discount: 20,
                product_image: 'https://images.unsplash.com/photo-1594736797933-d0f8bfbd3e2c?w=400&h=400&fit=crop&auto=format',
                product_stock: 45
            }
        ],
        'Highlighters': [
            {
                product_name: 'Stabilo Boss Original Highlighters Set of 6',
                product_brand: 'Stabilo',
                product_description: 'Premium highlighters with fluorescent ink and anti-dry out technology. Set includes 6 vibrant colors perfect for studying and office work.',
                product_price: 120,
                product_discount: 15,
                product_image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=400&fit=crop&auto=format',
                product_stock: 85
            },
            {
                product_name: 'Faber-Castell Textliner 46 Highlighter',
                product_brand: 'Faber-Castell',
                product_description: 'High-quality highlighter with chisel tip for both broad and fine highlighting. Water-based ink that does not bleed through paper.',
                product_price: 35,
                product_discount: 10,
                product_image: 'https://images.unsplash.com/photo-1565106500876-29103faccd44?w=400&h=400&fit=crop&auto=format',
                product_stock: 6  // Low stock
            },
            {
                product_name: 'Camlin Highlighter Marker Set',
                product_brand: 'Camlin',
                product_description: 'Bright fluorescent highlighters with broad chisel tip. Set of 4 colors - yellow, pink, green, and orange. Perfect for students.',
                product_price: 80,
                product_discount: 5,
                product_image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&auto=format',
                product_stock: 0  // Out of stock
            },
            {
                product_name: 'Pilot Frixion Light Erasable Highlighter',
                product_brand: 'Pilot',
                product_description: 'Revolutionary erasable highlighter that can be removed with heat. Perfect for textbooks and important documents you want to keep clean.',
                product_price: 150,
                product_discount: 20,
                product_image: 'https://images.unsplash.com/photo-1594736797933-d0f8bfbd3e2c?w=400&h=400&fit=crop&auto=format',
                product_stock: 45
            },
            {
                product_name: 'Luxor Hi-Liter Fluorescent Markers Pack of 10',
                product_brand: 'Luxor',
                product_description: 'Economy pack of 10 fluorescent highlighters in assorted colors. Water-based ink with long-lasting performance for everyday use.',
                product_price: 60,
                product_discount: 0,
                product_image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400&h=400&fit=crop&auto=format',
                product_stock: 120
            }
        ],
        'Journals': [
            {
                product_name: 'Moleskine Classic Hardcover Notebook',
                product_brand: 'Moleskine',
                product_description: 'Iconic hardcover notebook with dotted pages, elastic closure, and bookmark ribbon. Premium quality paper perfect for writing, sketching, and planning.',
                product_price: 450,
                product_discount: 15,
                product_image: 'https://images.unsplash.com/photo-1517971129774-39b2d1c1fa4e?w=400&h=400&fit=crop&auto=format',
                product_stock: 85
            },
            {
                product_name: 'Leuchtturm1917 Medium Ruled Journal',
                product_brand: 'Leuchtturm1917',
                product_description: 'German-engineered journal with numbered pages, index, and high-quality paper. Ideal for bullet journaling and professional note-taking.',
                product_price: 380,
                product_discount: 10,
                product_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop&auto=format',
                product_stock: 7  // Low stock
            },
            {
                product_name: 'Rhodia Webnotebook A5 Dot Grid',
                product_brand: 'Rhodia',
                product_description: 'French-made premium journal with ivory Clairefontaine paper and dot grid layout. Excellent for fountain pens and detailed work.',
                product_price: 520,
                product_discount: 20,
                product_image: 'https://images.unsplash.com/photo-1517971129774-39b2d1c1fa4e?w=400&h=400&fit=crop&auto=format',
                product_stock: 0  // Out of stock
            },
            {
                product_name: 'Classmate Pulse Notebook 240 Pages',
                product_brand: 'Classmate',
                product_description: 'Student-friendly ruled notebook with smooth paper quality. Durable binding and attractive cover designs perfect for daily school use.',
                product_price: 60,
                product_discount: 5,
                product_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop&auto=format',
                product_stock: 120
            },
            {
                product_name: 'Paperblanks Embellished Manuscripts Journal',
                product_brand: 'Paperblanks',
                product_description: 'Luxurious hardcover journal with artistic cover designs and premium quality paper. Features elastic band closure and inner pocket.',
                product_price: 650,
                product_discount: 25,
                product_image: 'https://images.unsplash.com/photo-1517971129774-39b2d1c1fa4e?w=400&h=400&fit=crop&auto=format',
                product_stock: 45
            }
        ],
        'Notebooks': [
            {
                product_name: 'Classmate 6 Subject Notebook Pack',
                product_brand: 'Classmate',
                product_description: 'Pack of 6 subject notebooks with 200 pages each. Single line ruling with margin. Perfect for students with multiple subjects.',
                product_price: 180,
                product_discount: 10,
                product_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop&auto=format',
                product_stock: 95
            },
            {
                product_name: 'Navneet Youva Spiral Notebook A4',
                product_brand: 'Navneet',
                product_description: 'A4 size spiral notebook with 300 pages. Smooth quality paper with perforated sheets for easy tearing. Ideal for college students.',
                product_price: 85,
                product_discount: 5,
                product_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop&auto=format',
                product_stock: 9  // Low stock
            },
            {
                product_name: 'Oxford Campus Wirebound Notebook',
                product_brand: 'Oxford',
                product_description: 'Premium wirebound notebook with Optik Paper technology. 240 pages with micro-perforated edges and organized layout.',
                product_price: 120,
                product_discount: 15,
                product_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop&auto=format',
                product_stock: 0  // Out of stock
            },
            {
                product_name: 'Sundaram Winner Brown Cover Notebook',
                product_brand: 'Sundaram',
                product_description: 'Traditional brown cover notebook with 172 pages. Four line ruling perfect for primary and secondary school students.',
                product_price: 25,
                product_discount: 0,
                product_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop&auto=format',
                product_stock: 200
            },
            {
                product_name: 'Camlin Kokuyo Campus Notebook B5',
                product_brand: 'Camlin',
                product_description: 'Japanese-style campus notebook with dotted ruling. 80 GSM paper quality with smooth writing experience. B5 size with 100 sheets.',
                product_price: 65,
                product_discount: 8,
                product_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop&auto=format',
                product_stock: 75
            }
        ],
        'Pencils': [
            {
                product_name: 'Faber-Castell 2B Pencils Pack of 10',
                product_brand: 'Faber-Castell',
                product_description: 'Premium quality 2B pencils with smooth graphite core. Perfect for writing and sketching. Hexagonal shape prevents rolling.',
                product_price: 120,
                product_discount: 10,
                product_image: 'https://images.unsplash.com/photo-1597058712635-3182d1345ba0?w=400&h=400&fit=crop&auto=format',
                product_stock: 85
            },
            {
                product_name: 'Apsara Platinum Extra Dark Pencils',
                product_brand: 'Apsara',
                product_description: 'Extra dark graphite pencils with eraser tip. Pack of 10 pencils ideal for students and professionals.',
                product_price: 40,
                product_discount: 5,
                product_image: 'https://images.unsplash.com/photo-1597058712635-3182d1345ba0?w=400&h=400&fit=crop&auto=format',
                product_stock: 8
            },
            {
                product_name: 'Staedtler Mars Lumograph Drawing Pencils',
                product_brand: 'Staedtler',
                product_description: 'Professional drawing pencils set from 2H to 8B. Premium quality graphite for artists and designers.',
                product_price: 280,
                product_discount: 15,
                product_image: 'https://images.unsplash.com/photo-1597058712635-3182d1345ba0?w=400&h=400&fit=crop&auto=format',
                product_stock: 0
            },
            {
                product_name: 'Natraj 621 Bold Dark Pencils Box of 20',
                product_brand: 'Natraj',
                product_description: 'Classic Indian pencils with bold dark lead. Smooth writing experience. Box of 20 pencils perfect for schools.',
                product_price: 60,
                product_discount: 0,
                product_image: 'https://images.unsplash.com/photo-1597058712635-3182d1345ba0?w=400&h=400&fit=crop&auto=format',
                product_stock: 150
            },
            {
                product_name: 'Pilot Mechanical Pencil 0.5mm with Lead',
                product_brand: 'Pilot',
                product_description: 'Precision mechanical pencil with 0.5mm lead. Comfortable grip and refillable. Includes lead refills and eraser.',
                product_price: 180,
                product_discount: 20,
                product_image: 'https://images.unsplash.com/photo-1597058712635-3182d1345ba0?w=400&h=400&fit=crop&auto=format',
                product_stock: 45
            }
        ],
        'Pens': [
            {
                product_name: 'Parker Jotter Ballpoint Pen Blue',
                product_brand: 'Parker',
                product_description: 'Classic Parker Jotter with stainless steel body and blue ink. Smooth writing experience with click-action mechanism. Reliable pen for professional use.',
                product_price: 250,
                product_discount: 15,
                product_image: 'https://images.unsplash.com/photo-1565106500876-29103faccd44?w=400&h=400&fit=crop&auto=format',
                product_stock: 95
            },
            {
                product_name: 'Pilot V5 Hi-Tecpoint Pen Pack of 10',
                product_brand: 'Pilot',
                product_description: 'Premium liquid ink pen with unique Hi-Tecpoint technology. Smooth writing with consistent ink flow. Pack of 10 pens in blue ink.',
                product_price: 180,
                product_discount: 10,
                product_image: 'https://images.unsplash.com/photo-1565106500876-29103faccd44?w=400&h=400&fit=crop&auto=format',
                product_stock: 8
            },
            {
                product_name: 'Reynolds 045 Fine Carbure Blue Pen',
                product_brand: 'Reynolds',
                product_description: 'Popular Indian ballpoint pen with carbure tip for fine writing. Smooth ink flow and comfortable grip. Ideal for students and office use.',
                product_price: 15,
                product_discount: 0,
                product_image: 'https://images.unsplash.com/photo-1565106500876-29103faccd44?w=400&h=400&fit=crop&auto=format',
                product_stock: 0
            },
            {
                product_name: 'Cello Butterflow Gel Pen Set of 12',
                product_brand: 'Cello',
                product_description: 'Smooth gel pens with comfortable rubber grip. Set of 12 assorted colors perfect for note-taking, highlighting, and creative work.',
                product_price: 120,
                product_discount: 8,
                product_image: 'https://images.unsplash.com/photo-1565106500876-29103faccd44?w=400&h=400&fit=crop&auto=format',
                product_stock: 85
            },
            {
                product_name: 'Luxor Glidr Roller Ball Pen Black',
                product_brand: 'Luxor',
                product_description: 'Premium roller ball pen with water-based ink. Extra smooth writing experience with ergonomic design. Perfect for signatures and formal writing.',
                product_price: 75,
                product_discount: 12,
                product_image: 'https://images.unsplash.com/photo-1565106500876-29103faccd44?w=400&h=400&fit=crop&auto=format',
                product_stock: 45
            }
        ],
        'Sharpeners': [
            {
                product_name: 'Staedtler Metal Double Hole Sharpener',
                product_brand: 'Staedtler',
                product_description: 'Premium metal sharpener with two holes for standard and jumbo pencils. German engineering ensures precise sharpening and long-lasting durability.',
                product_price: 45,
                product_discount: 10,
                product_image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=400&fit=crop&auto=format',
                product_stock: 120
            },
            {
                product_name: 'Faber-Castell Sleeve Sharpener with Eraser',
                product_brand: 'Faber-Castell',
                product_description: 'Compact sleeve sharpener with built-in eraser and shavings compartment. Perfect for school and office use with leak-proof design.',
                product_price: 25,
                product_discount: 5,
                product_image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=400&fit=crop&auto=format',
                product_stock: 8
            },
            {
                product_name: 'Maped Boogy Pencil Sharpener',
                product_brand: 'Maped',
                product_description: 'Fun and colorful pencil sharpener with waste collector. Ergonomic design and sharp steel blade for smooth sharpening experience.',
                product_price: 15,
                product_discount: 0,
                product_image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=400&fit=crop&auto=format',
                product_stock: 0
            },
            {
                product_name: 'Camlin Single Hole Sharpener Pack of 5',
                product_brand: 'Camlin',
                product_description: 'Value pack of 5 basic single hole sharpeners. Reliable plastic construction perfect for students and everyday use.',
                product_price: 20,
                product_discount: 15,
                product_image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=400&fit=crop&auto=format',
                product_stock: 95
            },
            {
                product_name: 'Pilot Electric Desktop Sharpener',
                product_brand: 'Pilot',
                product_description: 'Heavy-duty electric sharpener for office use. Automatic feed mechanism and large shavings tray. Sharpens pencils to perfect point every time.',
                product_price: 850,
                product_discount: 20,
                product_image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=400&fit=crop&auto=format',
                product_stock: 35
            }
        ],
        'Sticky Notes': [
            {
                product_name: '3M Post-it Super Sticky Notes 3x3',
                product_brand: '3M',
                product_description: 'Original Post-it Super Sticky Notes with 2x the sticking power. Pack of 12 pads in bright colors. Perfect for vertical surfaces and hard-to-stick surfaces.',
                product_price: 180,
                product_discount: 15,
                product_image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=400&fit=crop&auto=format',
                product_stock: 120
            },
            {
                product_name: 'Scotch-Brite Page Markers Transparent',
                product_brand: '3M',
                product_description: 'Transparent page flags in 5 bright colors. 100 flags per dispenser. Perfect for marking important pages without covering text.',
                product_price: 85,
                product_discount: 10,
                product_image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=400&fit=crop&auto=format',
                product_stock: 8
            },
            {
                product_name: 'Classmate Sticky Notes Cube 400 Sheets',
                product_brand: 'Classmate',
                product_description: 'Economy sticky notes cube with 400 sheets. Four bright neon colors for easy organization. Budget-friendly option for students.',
                product_price: 45,
                product_discount: 5,
                product_image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=400&fit=crop&auto=format',
                product_stock: 0
            },
            {
                product_name: 'Kangaroo Repositionable Sticky Notes',
                product_brand: 'Kangaroo',
                product_description: 'High-quality repositionable sticky notes in assorted sizes. Pack includes 3x3, 1.5x2, and arrow flags. Made in India.',
                product_price: 60,
                product_discount: 0,
                product_image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=400&fit=crop&auto=format',
                product_stock: 95
            },
            {
                product_name: 'Redi-Tag Write-On Index Tabs',
                product_brand: 'Redi-Tag',
                product_description: 'Durable plastic index tabs that you can write on. Repositionable and reusable. Pack of 104 tabs in 4 colors.',
                product_price: 120,
                product_discount: 20,
                product_image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=400&fit=crop&auto=format',
                product_stock: 75
            }
        ],
        'To-Do Lists': [
            {
                product_name: 'Moleskine Daily Planner Pad A4',
                product_brand: 'Moleskine',
                product_description: 'Premium daily planner sheets with to-do sections, priority lists, and note space. 50 tear-off sheets with elegant design.',
                product_price: 280,
                product_discount: 15,
                product_image: 'https://images.unsplash.com/photo-1517971129774-39b2d1c1fa4e?w=400&h=400&fit=crop&auto=format',
                product_stock: 65
            },
            {
                product_name: 'Rocketbook Smart To-Do List Pad',
                product_brand: 'Rocketbook',
                product_description: 'Reusable to-do list pad that syncs to cloud services. Erasable with included pen. Eco-friendly and tech-enabled productivity.',
                product_price: 450,
                product_discount: 10,
                product_image: 'https://images.unsplash.com/photo-1517971129774-39b2d1c1fa4e?w=400&h=400&fit=crop&auto=format',
                product_stock: 7
            },
            {
                product_name: 'Classmate Goal Tracker Notebook',
                product_brand: 'Classmate',
                product_description: 'Student-friendly goal tracking notebook with weekly and monthly layouts. Habit tracker, study planner, and to-do sections included.',
                product_price: 85,
                product_discount: 5,
                product_image: 'https://images.unsplash.com/photo-1517971129774-39b2d1c1fa4e?w=400&h=400&fit=crop&auto=format',
                product_stock: 0
            },
            {
                product_name: 'Oxford My To-Do List Pad 100 Sheets',
                product_brand: 'Oxford',
                product_description: 'Professional to-do list pad with priority sections and check boxes. Perforated sheets for easy tearing. Perfect for office use.',
                product_price: 120,
                product_discount: 0,
                product_image: 'https://images.unsplash.com/photo-1517971129774-39b2d1c1fa4e?w=400&h=400&fit=crop&auto=format',
                product_stock: 140
            },
            {
                product_name: 'Bullet Journal Dot Grid To-Do Planner',
                product_brand: 'Leuchtturm1917',
                product_description: 'Dot grid notebook specifically designed for bullet journaling and to-do tracking. Premium paper quality with numbered pages and index.',
                product_price: 380,
                product_discount: 25,
                product_image: 'https://images.unsplash.com/photo-1517971129774-39b2d1c1fa4e?w=400&h=400&fit=crop&auto=format',
                product_stock: 45
            }
        ],

        // Office Supplies products
        'Calculators': [
            {
                product_name: 'Casio MX-12B Basic Calculator',
                product_brand: 'Casio',
                product_description: 'Desktop calculator with large 12-digit display, dual power (solar and battery), and basic arithmetic functions. Perfect for office and home use.',
                product_price: 450,
                product_discount: 15,
                product_image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=400&fit=crop&auto=format',
                product_stock: 85
            },
            {
                product_name: 'Citizen SDC-868L Desktop Calculator',
                product_brand: 'Citizen',
                product_description: 'Professional desktop calculator with 8-digit display, check and correct function, and automatic power off. Ideal for accounting and business.',
                product_price: 320,
                product_discount: 10,
                product_image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=400&fit=crop&auto=format',
                product_stock: 8
            },
            {
                product_name: 'Sharp EL-233S Scientific Calculator',
                product_brand: 'Sharp',
                product_description: 'Scientific calculator with 236 functions, 2-line display, and statistics mode. Perfect for students and engineers.',
                product_price: 650,
                product_discount: 20,
                product_image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=400&fit=crop&auto=format',
                product_stock: 0
            },
            {
                product_name: 'Orpat OT-512GT Basic Calculator',
                product_brand: 'Orpat',
                product_description: 'Affordable 12-digit calculator with large keys and clear display. Dual power source with auto power off feature.',
                product_price: 180,
                product_discount: 5,
                product_image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=400&fit=crop&auto=format',
                product_stock: 120
            },
            {
                product_name: 'Texas Instruments BA II Plus Financial Calculator',
                product_brand: 'Texas Instruments',
                product_description: 'Professional financial calculator for business analysis, cash flow calculations, and financial planning. CFA exam approved.',
                product_price: 2850,
                product_discount: 12,
                product_image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=400&fit=crop&auto=format',
                product_stock: 35
            }
        ],
        'Cutters': [
            {
                product_name: 'OLFA L-1 Cutter with Safety Lock',
                product_brand: 'OLFA',
                product_description: 'Professional snap-off cutter with safety lock mechanism. Sharp stainless steel blade perfect for cardboard, paper, and plastic cutting.',
                product_price: 85,
                product_discount: 10,
                product_image: 'https://images.unsplash.com/photo-1516627145497-ae4ca7d70af5?w=400&h=400&fit=crop&auto=format',
                product_stock: 95
            },
            {
                product_name: 'Stanley FatMax Retractable Knife',
                product_brand: 'Stanley',
                product_description: 'Heavy-duty retractable knife with ergonomic grip and quick blade change. Ideal for professional cutting tasks.',
                product_price: 145,
                product_discount: 15,
                product_image: 'https://images.unsplash.com/photo-1516627145497-ae4ca7d70af5?w=400&h=400&fit=crop&auto=format',
                product_stock: 7
            },
            {
                product_name: 'Maped Universal Paper Cutter',
                product_brand: 'Maped',
                product_description: 'Precision paper cutter with metal ruler and safety guard. Perfect for cutting multiple sheets of paper cleanly.',
                product_price: 320,
                product_discount: 20,
                product_image: 'https://images.unsplash.com/photo-1516627145497-ae4ca7d70af5?w=400&h=400&fit=crop&auto=format',
                product_stock: 0
            },
            {
                product_name: 'Deli Small Utility Cutter',
                product_brand: 'Deli',
                product_description: 'Compact utility cutter with auto-lock feature. Perfect for everyday office and home cutting needs.',
                product_price: 25,
                product_discount: 0,
                product_image: 'https://images.unsplash.com/photo-1516627145497-ae4ca7d70af5?w=400&h=400&fit=crop&auto=format',
                product_stock: 150
            },
            {
                product_name: 'Fiskars Circle Cutter',
                product_brand: 'Fiskars',
                product_description: 'Precision circle cutter for creating perfect circles from 1 to 6 inches. Adjustable compass design with sharp cutting blade.',
                product_price: 280,
                product_discount: 8,
                product_image: 'https://images.unsplash.com/photo-1516627145497-ae4ca7d70af5?w=400&h=400&fit=crop&auto=format',
                product_stock: 45
            }
        ],
        'Folders and Filing': [
            {
                product_name: 'Bantex Lever Arch File A4',
                product_brand: 'Bantex',
                product_description: 'Premium quality lever arch file with 70mm spine capacity. Durable board construction with metal fittings for long-term filing.',
                product_price: 185,
                product_discount: 12,
                product_image: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=400&h=400&fit=crop&auto=format',
                product_stock: 75
            },
            {
                product_name: 'Kokuyo Box File Cardboard',
                product_brand: 'Kokuyo',
                product_description: 'Sturdy cardboard box file with elastic closure and label holder. Perfect for organizing documents and papers.',
                product_price: 120,
                product_discount: 8,
                product_image: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=400&h=400&fit=crop&auto=format',
                product_stock: 9
            },
            {
                product_name: 'Solo Ring Binder 4D 25mm',
                product_brand: 'Solo',
                product_description: 'Professional 4D ring binder with 25mm capacity. Clear overlay pocket on front cover for easy customization.',
                product_price: 95,
                product_discount: 5,
                product_image: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=400&h=400&fit=crop&auto=format',
                product_stock: 0
            },
            {
                product_name: 'Deli Expanding File 13 Pockets',
                product_brand: 'Deli',
                product_description: 'Expanding file organizer with 13 pockets and elastic closure. Color-coded tabs for easy document sorting.',
                product_price: 165,
                product_discount: 15,
                product_image: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=400&h=400&fit=crop&auto=format',
                product_stock: 85
            },
            {
                product_name: 'Classmate Document Wallet Pack of 5',
                product_brand: 'Classmate',
                product_description: 'Set of 5 document wallets in assorted colors. Button closure and label area for easy identification.',
                product_price: 80,
                product_discount: 10,
                product_image: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=400&h=400&fit=crop&auto=format',
                product_stock: 110
            }
        ],
        'Glue and Adhesives': [
            {
                product_name: 'Fevicol MR Multipurpose Adhesive 200g',
                product_brand: 'Fevicol',
                product_description: 'Premium white adhesive perfect for paper, cardboard, fabric, and wood. Non-toxic formula with strong bonding properties.',
                product_price: 95,
                product_discount: 8,
                product_image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400&h=400&fit=crop&auto=format',
                product_stock: 120
            },
            {
                product_name: 'UHU Glue Stick 21g',
                product_brand: 'UHU',
                product_description: 'German-made glue stick that applies purple and dries clear. Washable, non-toxic formula perfect for paper crafts.',
                product_price: 45,
                product_discount: 12,
                product_image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400&h=400&fit=crop&auto=format',
                product_stock: 8
            },
            {
                product_name: '3M Double Sided Tape 12mm',
                product_brand: '3M',
                product_description: 'Clear double-sided mounting tape for permanent bonding. Ideal for photos, posters, and lightweight objects.',
                product_price: 85,
                product_discount: 15,
                product_image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400&h=400&fit=crop&auto=format',
                product_stock: 0
            },
            {
                product_name: 'Camel Gum Arabic 50ml',
                product_brand: 'Camel',
                product_description: 'Natural gum arabic adhesive for art and craft applications. Suitable for watercolor painting and paper bonding.',
                product_price: 35,
                product_discount: 5,
                product_image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400&h=400&fit=crop&auto=format',
                product_stock: 95
            },
            {
                product_name: 'Pidilite M-Seal Epoxy Compound',
                product_brand: 'Pidilite',
                product_description: 'Multipurpose epoxy putty for repairing metal, wood, ceramic, and plastic. Waterproof and heat resistant formula.',
                product_price: 65,
                product_discount: 0,
                product_image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400&h=400&fit=crop&auto=format',
                product_stock: 75
            }
        ],
        'Magnifiers': [
            {
                product_name: 'Carson MagniFlex LED Magnifier',
                product_brand: 'Carson',
                product_description: 'Flexible neck magnifier with 2x magnification and bright LED light. Perfect for reading small text and detailed work.',
                product_price: 850,
                product_discount: 18,
                product_image: 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=400&h=400&fit=crop&auto=format',
                product_stock: 35
            },
            {
                product_name: 'Fiskars Handheld Magnifying Glass',
                product_brand: 'Fiskars',
                product_description: 'High-quality handheld magnifier with 3x magnification and ergonomic handle. Scratch-resistant lens for clear viewing.',
                product_price: 320,
                product_discount: 10,
                product_image: 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=400&h=400&fit=crop&auto=format',
                product_stock: 7
            },
            {
                product_name: 'Deli Desktop Magnifier with Stand',
                product_brand: 'Deli',
                product_description: 'Desktop magnifying glass with adjustable stand and 2.5x magnification. Ideal for reading documents and detailed inspection.',
                product_price: 450,
                product_discount: 15,
                product_image: 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=400&h=400&fit=crop&auto=format',
                product_stock: 0
            },
            {
                product_name: 'Silverline Pocket Magnifier 10x',
                product_brand: 'Silverline',
                product_description: 'Compact pocket magnifier with 10x magnification and protective case. Perfect for examining stamps, coins, and small details.',
                product_price: 185,
                product_discount: 12,
                product_image: 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=400&h=400&fit=crop&auto=format',
                product_stock: 65
            },
            {
                product_name: 'Bausch & Lomb Reading Magnifier',
                product_brand: 'Bausch & Lomb',
                product_description: 'Professional reading magnifier with 2x magnification and anti-reflective coating. Comfortable grip for extended use.',
                product_price: 650,
                product_discount: 8,
                product_image: 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=400&h=400&fit=crop&auto=format',
                product_stock: 45
            }
        ],
        'Organizers': [
            {
                product_name: 'IKEA KVISSLE Letter Tray Set',
                product_brand: 'IKEA',
                product_description: 'Set of 2 stackable letter trays in white. Perfect for organizing papers, documents, and mail on your desk.',
                product_price: 280,
                product_discount: 10,
                product_image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&h=400&fit=crop&auto=format',
                product_stock: 85
            },
            {
                product_name: 'Deli Mesh Pen Holder with 6 Compartments',
                product_brand: 'Deli',
                product_description: 'Metal mesh desk organizer with 6 compartments for pens, pencils, and small office supplies. Durable black finish.',
                product_price: 165,
                product_discount: 8,
                product_image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&h=400&fit=crop&auto=format',
                product_stock: 9
            },
            {
                product_name: 'Steelbird Desktop Organizer with Drawer',
                product_brand: 'Steelbird',
                product_description: 'Multi-compartment desktop organizer with drawer and pen holders. Wooden construction with elegant finish.',
                product_price: 450,
                product_discount: 20,
                product_image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&h=400&fit=crop&auto=format',
                product_stock: 0
            },
            {
                product_name: 'Classmate Pencil Box with Compartments',
                product_brand: 'Classmate',
                product_description: 'Student pencil box with multiple compartments and magnetic closure. Perfect for organizing stationery items.',
                product_price: 85,
                product_discount: 5,
                product_image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&h=400&fit=crop&auto=format',
                product_stock: 150
            },
            {
                product_name: 'Rexel Choices Desk Tidy',
                product_brand: 'Rexel',
                product_description: 'Modern desk tidy with 5 compartments for organizing pens, clips, and small accessories. Stylish charcoal finish.',
                product_price: 320,
                product_discount: 15,
                product_image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&h=400&fit=crop&auto=format',
                product_stock: 65
            }
        ],
        'Paperclips and Rubber Bands': [
            {
                product_name: 'Deli Paper Clips 50mm Pack of 100',
                product_brand: 'Deli',
                product_description: 'Premium quality steel paper clips with anti-rust coating. Large 50mm size perfect for thick documents.',
                product_price: 45,
                product_discount: 8,
                product_image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400&h=400&fit=crop&auto=format',
                product_stock: 200
            },
            {
                product_name: 'Alliance Rubber Bands Assorted Sizes',
                product_brand: 'Alliance',
                product_description: 'Natural rubber bands in assorted sizes. Strong and durable for bundling papers and organizing items.',
                product_price: 35,
                product_discount: 5,
                product_image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400&h=400&fit=crop&auto=format',
                product_stock: 8
            },
            {
                product_name: 'Butterfly Clips 32mm Pack of 24',
                product_brand: 'Maped',
                product_description: 'Strong butterfly clips for holding multiple sheets together. Easy-grip handles and secure clamping action.',
                product_price: 65,
                product_discount: 12,
                product_image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400&h=400&fit=crop&auto=format',
                product_stock: 0
            },
            {
                product_name: 'Colored Paper Clips 28mm Pack of 200',
                product_brand: 'Kangaroo',
                product_description: 'Bright colored paper clips in assorted colors. Vinyl-coated steel for rust resistance and color coding.',
                product_price: 55,
                product_discount: 10,
                product_image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400&h=400&fit=crop&auto=format',
                product_stock: 120
            },
            {
                product_name: 'Heavy Duty Rubber Bands 6inch',
                product_brand: 'Silverline',
                product_description: 'Extra strong 6-inch rubber bands for heavy-duty applications. Weather-resistant natural rubber construction.',
                product_price: 85,
                product_discount: 0,
                product_image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400&h=400&fit=crop&auto=format',
                product_stock: 75
            }
        ],
        'Punches': [
            {
                product_name: 'Kangaro DP-520 Heavy Duty Punch',
                product_brand: 'Kangaro',
                product_description: 'Professional 2-hole punch with 20-sheet capacity. Adjustable paper guide and chip tray for clean operation.',
                product_price: 385,
                product_discount: 15,
                product_image: 'https://images.unsplash.com/photo-1597058712635-3182d1345ba0?w=400&h=400&fit=crop&auto=format',
                product_stock: 65
            },
            {
                product_name: 'Deli Single Hole Punch',
                product_brand: 'Deli',
                product_description: 'Compact single hole punch for binding and filing. Sharp cutting edge and comfortable grip handle.',
                product_price: 85,
                product_discount: 8,
                product_image: 'https://images.unsplash.com/photo-1597058712635-3182d1345ba0?w=400&h=400&fit=crop&auto=format',
                product_stock: 7
            },
            {
                product_name: 'Maped 4-Hole Punch Heavy Duty',
                product_brand: 'Maped',
                product_description: 'Industrial-grade 4-hole punch for European filing systems. 30-sheet capacity with precision guides.',
                product_price: 650,
                product_discount: 20,
                product_image: 'https://images.unsplash.com/photo-1597058712635-3182d1345ba0?w=400&h=400&fit=crop&auto=format',
                product_stock: 0
            },
            {
                product_name: 'Solo Paper Punch 2-Hole 10 Sheets',
                product_brand: 'Solo',
                product_description: 'Standard 2-hole punch with 10-sheet capacity. Built-in ruler and paper alignment guide for accurate punching.',
                product_price: 125,
                product_discount: 5,
                product_image: 'https://images.unsplash.com/photo-1597058712635-3182d1345ba0?w=400&h=400&fit=crop&auto=format',
                product_stock: 95
            },
            {
                product_name: 'Craft Circle Punch Set 3 Sizes',
                product_brand: 'Fiskars',
                product_description: 'Set of 3 circle punches in different sizes for craft projects. Clean cutting action for perfect circles.',
                product_price: 280,
                product_discount: 12,
                product_image: 'https://images.unsplash.com/photo-1597058712635-3182d1345ba0?w=400&h=400&fit=crop&auto=format',
                product_stock: 45
            }
        ],
        'Scissors and Paper Trimmers': [
            {
                product_name: 'Fiskars Classic Scissors 8 Inch',
                product_brand: 'Fiskars',
                product_description: 'Professional-grade scissors with stainless steel blades and ergonomic handles. Perfect for office and craft use.',
                product_price: 185,
                product_discount: 12,
                product_image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=400&fit=crop&auto=format',
                product_stock: 85
            },
            {
                product_name: 'Kangaro SS-1042 Paper Trimmer A4',
                product_brand: 'Kangaro',
                product_description: 'A4 size paper trimmer with self-sharpening blade and safety guard. Cuts up to 10 sheets at once with precision.',
                product_price: 450,
                product_discount: 18,
                product_image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=400&fit=crop&auto=format',
                product_stock: 6
            },
            {
                product_name: 'Maped Zenoa Soft Grip Scissors',
                product_brand: 'Maped',
                product_description: 'Ergonomic scissors with soft-grip handles and titanium-coated blades. 3x harder than steel for long-lasting sharpness.',
                product_price: 125,
                product_discount: 8,
                product_image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=400&fit=crop&auto=format',
                product_stock: 0
            },
            {
                product_name: 'Deli Student Safety Scissors 5 Inch',
                product_brand: 'Deli',
                product_description: 'Child-safe scissors with rounded tips and comfortable grip. Ideal for school and home use by young students.',
                product_price: 45,
                product_discount: 5,
                product_image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=400&fit=crop&auto=format',
                product_stock: 150
            },
            {
                product_name: 'Dahle Personal Rolling Trimmer',
                product_brand: 'Dahle',
                product_description: 'Precision rolling trimmer for straight, clean cuts. Self-sharpening blade and measuring guide for accurate cutting.',
                product_price: 850,
                product_discount: 15,
                product_image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=400&fit=crop&auto=format',
                product_stock: 25
            }
        ],
        'Staplers and Pins': [
            {
                product_name: 'Kangaro HD-10 Stapler',
                product_brand: 'Kangaro',
                product_description: 'Heavy-duty desktop stapler with 20-sheet capacity. Durable metal construction with anti-slip base.',
                product_price: 185,
                product_discount: 10,
                product_image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400&h=400&fit=crop&auto=format',
                product_stock: 95
            },
            {
                product_name: 'Deli Staple Pins 10/5 Pack of 1000',
                product_brand: 'Deli',
                product_description: 'Standard staple pins 10/5 size for most desktop staplers. Galvanized steel construction for rust resistance.',
                product_price: 25,
                product_discount: 0,
                product_image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400&h=400&fit=crop&auto=format',
                product_stock: 8
            },
            {
                product_name: 'Maped Mini Stapler with Pins',
                product_brand: 'Maped',
                product_description: 'Compact mini stapler perfect for travel and small tasks. Includes 1000 staple pins and can staple up to 8 sheets.',
                product_price: 65,
                product_discount: 15,
                product_image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400&h=400&fit=crop&auto=format',
                product_stock: 0
            },
            {
                product_name: 'Solo Electric Stapler ES-2020',
                product_brand: 'Solo',
                product_description: 'Electric stapler with automatic feeding and 25-sheet capacity. Push-button operation for effortless stapling.',
                product_price: 2850,
                product_discount: 20,
                product_image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400&h=400&fit=crop&auto=format',
                product_stock: 15
            },
            {
                product_name: 'Heavy Duty Staple Remover',
                product_brand: 'Silverline',
                product_description: 'Professional staple remover with comfortable grip handles. Removes staples cleanly without tearing paper.',
                product_price: 45,
                product_discount: 8,
                product_image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400&h=400&fit=crop&auto=format',
                product_stock: 120
            }
        ],
        'Whiteboards and Markers': [
            {
                product_name: 'Luxor Non-Magnetic Whiteboard 2x3 Feet',
                product_brand: 'Luxor',
                product_description: 'High-quality melamine whiteboard with aluminum frame. Smooth writing surface with easy erase capability.',
                product_price: 850,
                product_discount: 15,
                product_image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=400&fit=crop&auto=format',
                product_stock: 35
            },
            {
                product_name: 'Pilot Board Master Marker Set of 4',
                product_brand: 'Pilot',
                product_description: 'Whiteboard markers with bullet tip in 4 colors. Quick-drying ink that erases cleanly without staining.',
                product_price: 120,
                product_discount: 10,
                product_image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=400&fit=crop&auto=format',
                product_stock: 8
            },
            {
                product_name: 'Magnetic Whiteboard Eraser with Magnets',
                product_brand: 'Maped',
                product_description: 'Magnetic whiteboard eraser with built-in marker holder. Strong magnets keep it attached to any magnetic surface.',
                product_price: 85,
                product_discount: 12,
                product_image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=400&fit=crop&auto=format',
                product_stock: 0
            },
            {
                product_name: 'Faber-Castell Whiteboard Markers Pack of 6',
                product_brand: 'Faber-Castell',
                product_description: 'Professional whiteboard markers with chisel tip. Low-odor ink in 6 vibrant colors with cap-off protection.',
                product_price: 165,
                product_discount: 8,
                product_image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=400&fit=crop&auto=format',
                product_stock: 75
            },
            {
                product_name: 'Portable Magnetic Whiteboard A3 Size',
                product_brand: 'Deli',
                product_description: 'Compact A3 magnetic whiteboard perfect for desktop use. Includes marker and eraser with magnetic backing.',
                product_price: 320,
                product_discount: 18,
                product_image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=400&fit=crop&auto=format',
                product_stock: 55
            }
        ],

        // Art Supplies products
        'Art Pencils': [
            {
                product_name: 'Faber-Castell Castell 9000 Drawing Pencils Set',
                product_brand: 'Faber-Castell',
                product_description: 'Professional drawing pencils from 8B to 2H. Premium quality graphite for artists and designers. Set of 12 pencils in metal tin.',
                product_price: 450,
                product_discount: 18,
                product_image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop&auto=format',
                product_stock: 75
            },
            {
                product_name: 'Staedtler Mars Lumograph Art Pencils',
                product_brand: 'Staedtler',
                product_description: 'Premium art pencils with break-resistant leads. Complete range from 6H to 8B for all drawing techniques.',
                product_price: 380,
                product_discount: 15,
                product_image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop&auto=format',
                product_stock: 8
            },
            {
                product_name: 'Prismacolor Premier Colored Pencils 72-Pack',
                product_brand: 'Prismacolor',
                product_description: 'Professional colored pencils with soft, thick cores for smooth color laydown. 72 vibrant colors in sturdy tin case.',
                product_price: 2850,
                product_discount: 25,
                product_image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop&auto=format',
                product_stock: 0
            },
            {
                product_name: 'Camel Artist Sketching Pencils Set of 6',
                product_brand: 'Camel',
                product_description: 'Basic sketching pencil set with grades 2H, HB, 2B, 4B, 6B, and 8B. Perfect for beginners and students.',
                product_price: 85,
                product_discount: 10,
                product_image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop&auto=format',
                product_stock: 150
            },
            {
                product_name: 'Derwent Graphic Drawing Pencils Complete Set',
                product_brand: 'Derwent',
                product_description: 'Complete range of 20 drawing pencils from 9H to 9B. Ideal for detailed illustration work and fine art.',
                product_price: 650,
                product_discount: 12,
                product_image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop&auto=format',
                product_stock: 45
            }
        ],
        'Artist Sketch Pads and Sheets': [
            {
                product_name: 'Strathmore 400 Series Sketch Pad 11x14',
                product_brand: 'Strathmore',
                product_description: 'Medium weight paper perfect for pencil, charcoal, and light washes. 100 sheets of acid-free paper.',
                product_price: 320,
                product_discount: 15,
                product_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop&auto=format',
                product_stock: 85
            },
            {
                product_name: 'Canson XL Drawing Paper Pad A4',
                product_brand: 'Canson',
                product_description: 'Heavy-weight drawing paper suitable for all dry media. Micro-perforated for easy sheet removal. 50 sheets.',
                product_price: 180,
                product_discount: 10,
                product_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop&auto=format',
                product_stock: 9
            },
            {
                product_name: 'Fabriano Academia Drawing Paper 200gsm',
                product_brand: 'Fabriano',
                product_description: 'Premium Italian drawing paper with fine grain texture. 200gsm weight perfect for charcoal and graphite.',
                product_price: 450,
                product_discount: 20,
                product_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop&auto=format',
                product_stock: 0
            },
            {
                product_name: 'Camel Artist Sketch Book A5 Size',
                product_brand: 'Camel',
                product_description: 'Spiral-bound sketch book with 40 sheets of quality paper. Portable size perfect for outdoor sketching.',
                product_price: 95,
                product_discount: 5,
                product_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop&auto=format',
                product_stock: 120
            },
            {
                product_name: 'Khadi Handmade Paper Sheets Pack of 20',
                product_brand: 'Khadi',
                product_description: 'Handmade cotton paper with natural texture. 140gsm weight suitable for watercolors and mixed media.',
                product_price: 280,
                product_discount: 8,
                product_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop&auto=format',
                product_stock: 65
            }
        ],
        'Crayons and Oil Pastels': [
            {
                product_name: 'Sakura Cray-Pas Oil Pastels 25 Colors',
                product_brand: 'Sakura',
                product_description: 'Professional oil pastels with rich, vibrant colors. Smooth application and excellent blending properties.',
                product_price: 450,
                product_discount: 18,
                product_image: 'https://images.unsplash.com/photo-1606721977440-1806c7a85969?w=400&h=400&fit=crop&auto=format',
                product_stock: 75
            },
            {
                product_name: 'Camel Oil Pastels 50 Shades Student Set',
                product_brand: 'Camel',
                product_description: 'Student-grade oil pastels in 50 vibrant colors. Non-toxic formula perfect for beginners and children.',
                product_price: 180,
                product_discount: 12,
                product_image: 'https://images.unsplash.com/photo-1606721977440-1806c7a85969?w=400&h=400&fit=crop&auto=format',
                product_stock: 8
            },
            {
                product_name: 'Faber-Castell Creative Studio Oil Pastels',
                product_brand: 'Faber-Castell',
                product_description: 'High-quality oil pastels with excellent color intensity. Set of 36 colors with blending tool included.',
                product_price: 320,
                product_discount: 15,
                product_image: 'https://images.unsplash.com/photo-1606721977440-1806c7a85969?w=400&h=400&fit=crop&auto=format',
                product_stock: 0
            },
            {
                product_name: 'Camlin Wax Crayons 24 Colors',
                product_brand: 'Camlin',
                product_description: 'Premium wax crayons with smooth texture and bright colors. Break-resistant and easy to blend.',
                product_price: 65,
                product_discount: 8,
                product_image: 'https://images.unsplash.com/photo-1606721977440-1806c7a85969?w=400&h=400&fit=crop&auto=format',
                product_stock: 200
            },
            {
                product_name: 'Pentel Oil Pastels PHN Series 12 Colors',
                product_brand: 'Pentel',
                product_description: 'Artist-quality oil pastels with superior color saturation. Smooth consistency for professional artwork.',
                product_price: 285,
                product_discount: 10,
                product_image: 'https://images.unsplash.com/photo-1606721977440-1806c7a85969?w=400&h=400&fit=crop&auto=format',
                product_stock: 55
            }
        ],
        'Drawing Books': [
            {
                product_name: 'How to Draw Everything Book by Walter Foster',
                product_brand: 'Walter Foster',
                product_description: 'Comprehensive drawing guide covering basic techniques to advanced subjects. Step-by-step instructions with illustrations.',
                product_price: 650,
                product_discount: 20,
                product_image: 'https://images.unsplash.com/photo-1517971129774-39b2d1c1fa4e?w=400&h=400&fit=crop&auto=format',
                product_stock: 45
            },
            {
                product_name: 'Drawing on the Right Side of the Brain',
                product_brand: 'Jeremy P. Tarcher',
                product_description: 'Classic drawing instruction book focusing on perception and technique. Includes exercises and practice sheets.',
                product_price: 480,
                product_discount: 15,
                product_image: 'https://images.unsplash.com/photo-1517971129774-39b2d1c1fa4e?w=400&h=400&fit=crop&auto=format',
                product_stock: 7
            },
            {
                product_name: 'Learn to Draw Animals Step by Step',
                product_brand: 'Art Class Books',
                product_description: 'Beginner-friendly guide to drawing various animals. Clear instructions with practice pages included.',
                product_price: 285,
                product_discount: 12,
                product_image: 'https://images.unsplash.com/photo-1517971129774-39b2d1c1fa4e?w=400&h=400&fit=crop&auto=format',
                product_stock: 0
            },
            {
                product_name: 'Figure Drawing for Artists by Steve Huston',
                product_brand: 'Steve Huston',
                product_description: 'Advanced figure drawing techniques from professional artist. Anatomy, proportions, and gesture drawing.',
                product_price: 850,
                product_discount: 25,
                product_image: 'https://images.unsplash.com/photo-1517971129774-39b2d1c1fa4e?w=400&h=400&fit=crop&auto=format',
                product_stock: 85
            },
            {
                product_name: 'Complete Guide to Drawing Manga',
                product_brand: 'Manga Art Books',
                product_description: 'Comprehensive manga drawing tutorial covering characters, expressions, and storytelling techniques.',
                product_price: 395,
                product_discount: 10,
                product_image: 'https://images.unsplash.com/photo-1517971129774-39b2d1c1fa4e?w=400&h=400&fit=crop&auto=format',
                product_stock: 65
            }
        ],
        'Markers and Pens': [
            {
                product_name: 'Copic Sketch Markers Set of 12',
                product_brand: 'Copic',
                product_description: 'Professional alcohol-based markers with brush and chisel nibs. Refillable and replaceable nibs for longevity.',
                product_price: 1850,
                product_discount: 22,
                product_image: 'https://images.unsplash.com/photo-1565106500876-29103faccd44?w=400&h=400&fit=crop&auto=format',
                product_stock: 35
            },
            {
                product_name: 'Sakura Pigma Micron Fine Liners Set',
                product_brand: 'Sakura',
                product_description: 'Archival quality pigment ink pens in various line widths. Perfect for detailed illustration and inking.',
                product_price: 320,
                product_discount: 15,
                product_image: 'https://images.unsplash.com/photo-1565106500876-29103faccd44?w=400&h=400&fit=crop&auto=format',
                product_stock: 8
            },
            {
                product_name: 'Prismacolor Premier Art Markers 24-Pack',
                product_brand: 'Prismacolor',
                product_description: 'Double-ended markers with fine and broad tips. Alcohol-based ink for smooth blending and layering.',
                product_price: 1250,
                product_discount: 20,
                product_image: 'https://images.unsplash.com/photo-1565106500876-29103faccd44?w=400&h=400&fit=crop&auto=format',
                product_stock: 0
            },
            {
                product_name: 'Faber-Castell Pitt Artist Brush Pens',
                product_brand: 'Faber-Castell',
                product_description: 'India ink brush pens with flexible brush tips. Waterproof and lightfast for professional artwork.',
                product_price: 450,
                product_discount: 18,
                product_image: 'https://images.unsplash.com/photo-1565106500876-29103faccd44?w=400&h=400&fit=crop&auto=format',
                product_stock: 95
            },
            {
                product_name: 'Camlin Fine Line Markers 0.4mm Pack of 10',
                product_brand: 'Camlin',
                product_description: 'Precision fine line markers for technical drawing and illustration. Water-based ink in assorted colors.',
                product_price: 185,
                product_discount: 8,
                product_image: 'https://images.unsplash.com/photo-1565106500876-29103faccd44?w=400&h=400&fit=crop&auto=format',
                product_stock: 120
            }
        ],
        'Paint Brushes and Palette Knives': [
            {
                product_name: 'Da Vinci Watercolor Brush Set Series 36',
                product_brand: 'Da Vinci',
                product_description: 'Professional Kolinsky red sable brushes for watercolor painting. Set of 6 round brushes in various sizes.',
                product_price: 1450,
                product_discount: 25,
                product_image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop&auto=format',
                product_stock: 25
            },
            {
                product_name: 'Winsor & Newton Cotman Brush Set',
                product_brand: 'Winsor & Newton',
                product_description: 'Synthetic brushes perfect for watercolor and gouache. Set includes round, flat, and detail brushes.',
                product_price: 650,
                product_discount: 18,
                product_image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop&auto=format',
                product_stock: 7
            },
            {
                product_name: 'Camel Hair Paint Brushes Set of 12',
                product_brand: 'Camel',
                product_description: 'Natural camel hair brushes for oil and acrylic painting. Various sizes from fine detail to broad washes.',
                product_price: 285,
                product_discount: 12,
                product_image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop&auto=format',
                product_stock: 0
            },
            {
                product_name: 'Palette Knife Set Steel Blades 5-Piece',
                product_brand: 'Artist Tools',
                product_description: 'Flexible steel palette knives for mixing colors and applying paint. Various shapes for different techniques.',
                product_price: 180,
                product_discount: 10,
                product_image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop&auto=format',
                product_stock: 85
            },
            {
                product_name: 'Flat Synthetic Brushes for Acrylic Set of 8',
                product_brand: 'Princeton',
                product_description: 'Durable synthetic brushes designed for acrylic painting. Maintains sharp edges and holds paint well.',
                product_price: 395,
                product_discount: 15,
                product_image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop&auto=format',
                product_stock: 65
            }
        ],
        'Paints': [
            {
                product_name: 'Winsor & Newton Cotman Watercolor Set 24 Colors',
                product_brand: 'Winsor & Newton',
                product_description: 'Professional quality watercolors with excellent transparency and color brilliance. Complete set with mixing palette.',
                product_price: 850,
                product_discount: 20,
                product_image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop&auto=format',
                product_stock: 55
            },
            {
                product_name: 'Liquitex Basics Acrylic Paint Set 12 Colors',
                product_brand: 'Liquitex',
                product_description: 'Student-quality acrylic paints with good color strength and consistency. 75ml tubes in essential colors.',
                product_price: 650,
                product_discount: 18,
                product_image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop&auto=format',
                product_stock: 8
            },
            {
                product_name: 'Camel Student Watercolor Cakes 18 Colors',
                product_brand: 'Camel',
                product_description: 'Affordable watercolor cakes perfect for beginners and students. Includes brush and mixing tray.',
                product_price: 185,
                product_discount: 15,
                product_image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop&auto=format',
                product_stock: 0
            },
            {
                product_name: 'Golden Heavy Body Acrylic Primary Set',
                product_brand: 'Golden',
                product_description: 'Professional acrylic paints with thick consistency and high pigment load. Primary colors for color mixing.',
                product_price: 1250,
                product_discount: 25,
                product_image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop&auto=format',
                product_stock: 35
            },
            {
                product_name: 'Marie\'s Gouache Paint Set 24 Colors',
                product_brand: 'Marie\'s',
                product_description: 'Opaque watercolor paints with matte finish. 12ml tubes with good coverage and color intensity.',
                product_price: 450,
                product_discount: 12,
                product_image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop&auto=format',
                product_stock: 95
            }
        ],

        // Craft Materials products

        'Craft Glue and Adhesives': [
            {
                product_name: 'E6000 Craft Adhesive Industrial Strength',
                product_brand: 'E6000',
                product_description: 'Professional-grade adhesive for crafts, jewelry, and repairs. Bonds to glass, metal, fabric, and plastic. Waterproof and flexible.',
                product_price: 185,
                product_discount: 12,
                product_image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400&h=400&fit=crop&auto=format',
                product_stock: 95
            },
            {
                product_name: 'Mod Podge Matte Finish 473ml',
                product_brand: 'Mod Podge',
                product_description: 'All-in-one glue, sealer, and finish for decoupage projects. Dries clear with matte finish. Perfect for paper crafts.',
                product_price: 280,
                product_discount: 15,
                product_image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400&h=400&fit=crop&auto=format',
                product_stock: 8
            },
            {
                product_name: 'Hot Glue Gun with Glue Sticks Set',
                product_brand: 'Stanley',
                product_description: 'Dual temperature hot glue gun with 20 glue sticks. Perfect for fabric, wood, and general crafting. Safety stand included.',
                product_price: 320,
                product_discount: 18,
                product_image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400&h=400&fit=crop&auto=format',
                product_stock: 0
            },
            {
                product_name: 'Craft Glue Stick Pack of 6',
                product_brand: 'UHU',
                product_description: 'Non-toxic washable glue sticks perfect for children and school projects. Goes on purple, dries clear. 21g each.',
                product_price: 120,
                product_discount: 5,
                product_image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400&h=400&fit=crop&auto=format',
                product_stock: 180
            },
            {
                product_name: 'Double-Sided Foam Tape Squares 500 Pieces',
                product_brand: '3M',
                product_description: 'Permanent double-sided foam mounting squares. Various sizes for scrapbooking and card making. Strong adhesion.',
                product_price: 165,
                product_discount: 10,
                product_image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400&h=400&fit=crop&auto=format',
                product_stock: 85
            }
        ],
        'Craft Paper': [
            {
                product_name: 'Origami Paper 1000 Sheets Assorted Colors',
                product_brand: 'Yasutomo',
                product_description: 'High-quality origami paper in 20 vibrant colors. 6-inch squares, perfect weight for folding. Includes instruction booklet.',
                product_price: 450,
                product_discount: 20,
                product_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop&auto=format',
                product_stock: 65
            },
            {
                product_name: 'Scrapbook Paper Pack 12x12 inch 100 Sheets',
                product_brand: 'DCWV',
                product_description: 'Double-sided patterned scrapbook paper in coordinating designs. Acid-free and lignin-free for lasting projects.',
                product_price: 380,
                product_discount: 15,
                product_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop&auto=format',
                product_stock: 7
            },
            {
                product_name: 'Tissue Paper Rainbow Pack 50 Sheets',
                product_brand: 'Creativity Street',
                product_description: 'Lightweight tissue paper in 10 bright colors. Perfect for gift wrapping, party decorations, and art projects.',
                product_price: 120,
                product_discount: 8,
                product_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop&auto=format',
                product_stock: 0
            },
            {
                product_name: 'Cardstock Paper A4 Size 250gsm 100 Sheets',
                product_brand: 'Canson',
                product_description: 'Heavy-weight cardstock in white. Perfect for card making, invitations, and sturdy craft projects. Smooth finish.',
                product_price: 185,
                product_discount: 12,
                product_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop&auto=format',
                product_stock: 150
            },
            {
                product_name: 'Metallic Foil Paper Sheets 20 Colors',
                product_brand: 'Craft Smart',
                product_description: 'Shimmery metallic foil paper for special occasions. 8.5x11 inch sheets, includes gold, silver, and rainbow colors.',
                product_price: 280,
                product_discount: 10,
                product_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop&auto=format',
                product_stock: 95
            }
        ],
        'Masking and Decoration Tapes': [
            {
                product_name: 'Washi Tape Set 30 Rolls Assorted Patterns',
                product_brand: 'MT Masking Tape',
                product_description: 'Japanese washi tape collection with floral, geometric, and solid patterns. 15mm width, perfect for bullet journaling.',
                product_price: 650,
                product_discount: 25,
                product_image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=400&fit=crop&auto=format',
                product_stock: 45
            },
            {
                product_name: 'Decorative Duct Tape 6 Pack Glitter Finish',
                product_brand: 'Duck Brand',
                product_description: 'Sparkly decorative duct tape in 6 glitter colors. 1.88 inch width, perfect for fashion crafts and repairs.',
                product_price: 320,
                product_discount: 18,
                product_image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=400&fit=crop&auto=format',
                product_stock: 8
            },
            {
                product_name: 'Artist Masking Tape Low Tack 25mm',
                product_brand: 'Scotch',
                product_description: 'Professional artist tape that removes cleanly without residue. Perfect for watercolor borders and mixed media.',
                product_price: 145,
                product_discount: 10,
                product_image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=400&fit=crop&auto=format',
                product_stock: 0
            },
            {
                product_name: 'Foil Tape Gold and Silver Pack',
                product_brand: 'Craft Essentials',
                product_description: 'Metallic foil tape for gift wrapping and decorations. Self-adhesive, 2 rolls each of gold and silver.',
                product_price: 185,
                product_discount: 15,
                product_image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=400&fit=crop&auto=format',
                product_stock: 85
            },
            {
                product_name: 'Fabric Tape Polka Dot Design 5 Pack',
                product_brand: 'Creative Converting',
                product_description: 'Fabric-textured decorative tape with polka dot patterns. Easy tear, residue-free removal. Various colors included.',
                product_price: 220,
                product_discount: 12,
                product_image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=400&fit=crop&auto=format',
                product_stock: 120
            }
        ],
        'Stamps and Pads': [
            {
                product_name: 'Clear Acrylic Stamp Set Alphabet and Numbers',
                product_brand: 'Hero Arts',
                product_description: 'Clear photopolymer stamps with complete alphabet and numbers. Perfect for card making and scrapbooking. Includes storage case.',
                product_price: 450,
                product_discount: 20,
                product_image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&h=400&fit=crop&auto=format',
                product_stock: 55
            },
            {
                product_name: 'Ink Pad Set Rainbow Colors 12 Pack',
                product_brand: 'Tsukineko',
                product_description: 'Premium dye ink pads in vibrant rainbow colors. Fast-drying, fade-resistant ink perfect for paper stamping.',
                product_price: 850,
                product_discount: 22,
                product_image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&h=400&fit=crop&auto=format',
                product_stock: 8
            },
            {
                product_name: 'Rubber Stamp Set Garden Flowers',
                product_brand: 'Stampin\' Up!',
                product_description: 'Beautiful floral rubber stamps mounted on wood blocks. Set includes 8 different flower designs for nature crafts.',
                product_price: 380,
                product_discount: 15,
                product_image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&h=400&fit=crop&auto=format',
                product_stock: 0
            },
            {
                product_name: 'Embossing Powder Metallic Set 6 Colors',
                product_brand: 'Ranger',
                product_description: 'Heat embossing powders in metallic finishes. Includes gold, silver, copper, and pearl. Works with embossing ink.',
                product_price: 320,
                product_discount: 18,
                product_image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&h=400&fit=crop&auto=format',
                product_stock: 75
            },
            {
                product_name: 'Date Stamp Self-Inking with Changeable Bands',
                product_brand: 'Trodat',
                product_description: 'Self-inking date stamp with easily changeable month, day, and year bands. Perfect for office and craft organization.',
                product_price: 280,
                product_discount: 10,
                product_image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&h=400&fit=crop&auto=format',
                product_stock: 95
            }
        ],
        'Stickers': [
            {
                product_name: 'Planner Sticker Collection 1000+ Pieces',
                product_brand: 'Erin Condren',
                product_description: 'Over 1000 decorative stickers for planners and journals. Includes holidays, weather, activities, and motivational quotes.',
                product_price: 450,
                product_discount: 15,
                product_image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&h=400&fit=crop&auto=format',
                product_stock: 150
            },
            {
                product_name: 'Holographic Stickers Unicorn and Rainbow Theme',
                product_brand: 'Creative Converting',
                product_description: 'Shimmering holographic stickers with unicorn and rainbow designs. Perfect for kids\' crafts and party decorations.',
                product_price: 185,
                product_discount: 12,
                product_image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&h=400&fit=crop&auto=format',
                product_stock: 8
            },
            {
                product_name: 'Alphabet Stickers Glitter Finish 5 Sets',
                product_brand: 'American Crafts',
                product_description: 'Sparkly alphabet stickers in 5 different colors. Self-adhesive letters perfect for scrapbooking and card making.',
                product_price: 220,
                product_discount: 8,
                product_image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&h=400&fit=crop&auto=format',
                product_stock: 0
            },
            {
                product_name: 'Emoji Stickers Mega Pack 500 Pieces',
                product_brand: 'Fun Express',
                product_description: 'Popular emoji stickers featuring all favorite expressions. Various sizes, perfect for phone cases and laptops.',
                product_price: 120,
                product_discount: 10,
                product_image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&h=400&fit=crop&auto=format',
                product_stock: 200
            },
            {
                product_name: 'Vintage Travel Stickers Luggage Label Style',
                product_brand: 'Cavallini & Co.',
                product_description: 'Vintage-inspired travel stickers with classic luggage label designs. 100 assorted stickers from around the world.',
                product_price: 165,
                product_discount: 5,
                product_image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&h=400&fit=crop&auto=format',
                product_stock: 85
            }
        ],
    };

    const products = [];
    const templates = productTemplates[subcategoryName];

    if (templates) {
        templates.forEach(template => {
            products.push({
                ...template,
                product_category: categoryName,
                product_subcategory: subcategoryName,
                category: categoryId,
                owner: OWNER_ID
            });
        });
    }

    return products;
};

const initializeDatabase = async () => {
    try {
        console.log('🗑️  Clearing existing data...');

        // Clear existing data
        await Category.deleteMany({});
        await SubCategory.deleteMany({});
        await Product.deleteMany({});
        await Review.deleteMany({}); // Clear reviews, not ratings
        // Remove: await Rating.deleteMany({});

        console.log('✅ Cleared existing data (preserved users)');

        // Create users only if they don't exist
        console.log('👥 Creating sample users (if not exists)...');
        let userDocs = [];

        for (const userData of sampleUsers) {
            const existingUser = await User.findOne({ email: userData.email });

            if (!existingUser) {
                const hashedPassword = await bcrypt.hash(userData.password, 10);
                const newUser = await User.create({
                    ...userData,
                    password: hashedPassword
                });
                userDocs.push(newUser);
                console.log(`   Created user: ${userData.email}`);
            } else {
                userDocs.push(existingUser);
                console.log(`   User exists: ${userData.email}`);
            }
        }

        // Get all existing users for review creation
        const allUsers = await User.find({});
        console.log(`✅ Total users in database: ${allUsers.length}`);

        // Insert categories
        console.log('📂 Creating categories...');
        const categoryDocs = await Category.insertMany(categories);
        console.log(`✅ Inserted ${categoryDocs.length} categories`);

        // Create category mapping
        const categoryMap = {};
        categoryDocs.forEach(cat => {
            categoryMap[cat.category_name] = cat._id;
        });

        // Create subcategories
        console.log('📋 Creating subcategories...');
        const allSubcategories = [];

        Object.keys(subcategoriesData).forEach(categoryName => {
            const categoryId = categoryMap[categoryName];
            subcategoriesData[categoryName].forEach(subcategoryName => {
                allSubcategories.push({
                    subcategory_name: subcategoryName,
                    category_id: categoryId
                });
            });
        });

        const subcategoryDocs = await SubCategory.insertMany(allSubcategories);
        console.log(`✅ Inserted ${subcategoryDocs.length} subcategories`);

        // Update categories with subcategory references
        console.log('🔗 Linking subcategories to categories...');
        for (const category of categoryDocs) {
            const relatedSubcats = subcategoryDocs
                .filter(sub => sub.category_id.toString() === category._id.toString())
                .map(sub => sub._id);

            await Category.findByIdAndUpdate(category._id, {
                sub_category: relatedSubcats
            });
        }

        // Create products (you'll need to add your product templates here)
        console.log('🛍️  Creating products...');
        let allProducts = [];

        subcategoryDocs.forEach(subcat => {
            const category = categoryDocs.find(cat =>
                cat._id.toString() === subcat.category_id.toString()
            );

            if (category) {
                const products = createSampleProducts(
                    category.category_name,
                    subcat.subcategory_name,
                    category._id
                );
                allProducts = [...allProducts, ...products];
            }
        });

        const productDocs = await Product.insertMany(allProducts);
        console.log(`✅ Inserted ${productDocs.length} products`);

        // Create reviews for products
        console.log('⭐ Creating product reviews...');
        let allReviews = [];

        productDocs.forEach(product => {
            const productReviews = createReviewsForProduct(product._id, allUsers);
            allReviews = [...allReviews, ...productReviews];
        });

        const reviewDocs = await Review.insertMany(allReviews);
        console.log(`✅ Inserted ${reviewDocs.length} reviews`);

        // Calculate and update product ratings
        console.log('📊 Calculating product rating statistics...');

        for (const product of productDocs) {
            const ratingStats = await calculateProductRatings(product._id);
            await Product.findByIdAndUpdate(product._id, {
                product_rating: ratingStats.product_rating,
                review_count: ratingStats.review_count
            });
        }

        console.log('✅ Updated product rating statistics');

        // Summary
        console.log('\n🎉 Database initialization complete!');
        console.log('📊 Summary:');
        console.log(`   Users: ${allUsers.length}`);
        console.log(`   Categories: ${categoryDocs.length}`);
        console.log(`   Subcategories: ${subcategoryDocs.length}`);
        console.log(`   Products: ${productDocs.length}`);
        console.log(`   Reviews: ${reviewDocs.length}`);

        // Show average rating
        const avgRating = reviewDocs.reduce((sum, review) => sum + review.rating, 0) / reviewDocs.length;
        console.log(`\n⭐ Average rating across all products: ${avgRating.toFixed(2)}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error initializing database:', error);
        process.exit(1);
    }
};

// Sample banners data
const sampleBanners = [
    // Homepage Carousel Banners
    {
        title: "Summer Reading Collection",
        subtitle: "Adventure Awaits in Every Page",
        description: "Discover thrilling tales and captivating stories perfect for your summer adventures. From mystery to romance, find your next favorite book.",
        tagline: "NEW ARRIVALS",
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=600&fit=crop&auto=format",
        url: "/shop/books",
        buttonText: "Explore Collection",
        location: "homepage-carousel",
        position: 1,
        textPosition: "left",
        isActive: true,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31')
    },
    {
        title: "Back to School Essentials",
        subtitle: "Get Ready for Academic Success",
        description: "Complete your study setup with premium stationery, notebooks, and art supplies. Quality products for students of all ages.",
        tagline: "BACK TO SCHOOL",
        image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=1200&h=600&fit=crop&auto=format",
        url: "/shop/stationery",
        buttonText: "Shop Now",
        location: "homepage-carousel",
        position: 2,
        textPosition: "center",
        isActive: true,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31')
    },
    {
        title: "Artist's Creative Corner",
        subtitle: "Unleash Your Imagination",
        description: "Professional art supplies for artists and hobbyists. Premium brushes, paints, and drawing materials to bring your vision to life.",
        tagline: "ARTIST COLLECTION",
        image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1200&h=600&fit=crop&auto=format",
        url: "/shop/art-supplies",
        buttonText: "Create Art",
        location: "homepage-carousel",
        position: 3,
        textPosition: "right",
        isActive: true,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31')
    },
    // Homepage Banner
    {
        title: "Get 20% Off Your First Order!",
        subtitle: "Join our newsletter and receive an exclusive discount code plus early access to new arrivals and special offers.",
        description: "Subscribe now and save on your next purchase. Plus get insider tips on the latest stationery trends and office organization hacks.",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop&auto=format",
        url: "/signup",
        buttonText: "Get My Discount",
        location: "homepage",
        position: 1,
        textPosition: "center",
        isActive: true,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31')
    },
    // Newsletter Banner
    {
        title: "Stay Creative, Stay Informed",
        subtitle: "Get the latest updates on new products, exclusive deals, and creative inspiration delivered straight to your inbox.",
        description: "Join thousands of creative minds who never miss out on the latest trends in stationery, art supplies, and office essentials.",
        image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=600&fit=crop&auto=format",
        location: "newsletter",
        position: 1,
        textPosition: "center",
        isActive: true,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31')
    },
    // Advertisement Banners
    {
        title: "Premium Pen Collection Sale",
        subtitle: "Luxury Writing Instruments",
        description: "Discover our exclusive collection of premium pens from world-renowned brands. Limited time offer - up to 40% off.",
        tagline: "LIMITED OFFER",
        image: "https://images.unsplash.com/photo-1565106500876-29103faccd44?w=800&h=600&fit=crop&auto=format",
        url: "/shop/pens",
        buttonText: "Shop Pens",
        location: "advertisement",
        position: 1,
        textPosition: "left",
        isActive: true,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31')
    },
    {
        title: "Professional Art Workshop",
        subtitle: "Learn from the Masters",
        description: "Join our monthly art workshop and learn professional techniques. All skill levels welcome. Materials included.",
        tagline: "WORKSHOP",
        image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=600&fit=crop&auto=format",
        url: "/workshops",
        buttonText: "Register Now",
        location: "advertisement",
        position: 2,
        textPosition: "center",
        isActive: true,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31')
    },
    {
        title: "Office Organization Made Easy",
        subtitle: "Productivity Essentials",
        description: "Transform your workspace with our organizational tools and office supplies. Create a productive environment that inspires success.",
        tagline: "ORGANIZE",
        image: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=600&fit=crop&auto=format",
        url: "/shop/office-supplies",
        buttonText: "Get Organized",
        location: "advertisement",
        position: 3,
        textPosition: "right",
        isActive: true,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31')
    }
];

// Sample orders data generator
const createSampleOrders = (users, products) => {
    const orders = [];
    const orderStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    const paymentMethods = ['credit_card', 'debit_card', 'upi', 'net_banking', 'cash_on_delivery'];
    const paymentStatuses = ['pending', 'completed', 'failed', 'refunded'];

    // Create 15 sample orders
    for (let i = 0; i < 15; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const numItems = Math.floor(Math.random() * 4) + 1; // 1-4 items per order
        const orderItems = [];
        let subtotal = 0;

        // Generate order items
        for (let j = 0; j < numItems; j++) {
            const randomProduct = products[Math.floor(Math.random() * products.length)];
            const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 quantity
            const price = randomProduct.product_price - (randomProduct.product_price * (randomProduct.product_discount || 0) / 100);
            const itemTotal = price * quantity;

            orderItems.push({
                product_id: randomProduct._id,
                quantity: quantity,
                price: Math.round(price)
            });

            subtotal += itemTotal;
        }

        const shipping = subtotal > 500 ? 0 : 50; // Free shipping over ₹500
        const tax = Math.round(subtotal * 0.18); // 18% GST
        const total = Math.round(subtotal + shipping + tax);

        // Random date within last 3 months
        const orderDate = new Date();
        orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 90));

        // Delivery date (for completed orders)
        const deliveryDate = new Date(orderDate);
        deliveryDate.setDate(deliveryDate.getDate() + Math.floor(Math.random() * 7) + 1);

        const status = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
        const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
        
        // Payment status logic
        let paymentStatus;
        if (status === 'cancelled') {
            paymentStatus = Math.random() > 0.5 ? 'failed' : 'refunded';
        } else if (status === 'delivered') {
            paymentStatus = 'completed';
        } else if (paymentMethod === 'cash_on_delivery') {
            paymentStatus = status === 'delivered' ? 'completed' : 'pending';
        } else {
            paymentStatus = Math.random() > 0.1 ? 'completed' : 'pending';
        }

        // Create order with User.model.js compatible schema
        orders.push({
            user_id: randomUser._id,
            order_number: `ORD${Date.now()}${i}`.slice(-12),
            items: orderItems,
            total_amount: total,
            status: status,
            shipping_address: {
                name: `${randomUser.first_name} ${randomUser.last_name}`,
                address: `${Math.floor(Math.random() * 999) + 1}, ${['MG Road', 'Park Street', 'Brigade Road', 'Commercial Street', 'Residency Road'][Math.floor(Math.random() * 5)]}, ${['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune'][Math.floor(Math.random() * 7)]}`,
                city: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune'][Math.floor(Math.random() * 7)],
                phone: randomUser.phone
            },
            createdAt: orderDate,
            updatedAt: orderDate
        });
    }

    return orders;
};

const initializeBannersAndOrders = async () => {
    try {
        console.log('🎯 Initializing Banners and Orders only...');

        // Get existing users and products
        console.log('📋 Fetching existing users and products...');
        const existingUsers = await User.find({});
        const existingProducts = await Product.find({});

        if (existingUsers.length === 0) {
            console.log('❌ No users found in database. Please add users first.');
            process.exit(1);
        }

        if (existingProducts.length === 0) {
            console.log('❌ No products found in database. Please add products first.');
            process.exit(1);
        }

        console.log(`✅ Found ${existingUsers.length} users and ${existingProducts.length} products`);

        // Clear only banners and orders
        console.log('🗑️  Clearing existing banners and orders...');
        await Banner.deleteMany({});
        await Order.deleteMany({});
        console.log('✅ Cleared existing banners and orders');

        // Create banners
        console.log('🎨 Creating sample banners...');
        const bannerDocs = await Banner.insertMany(sampleBanners);
        console.log(`✅ Inserted ${bannerDocs.length} banners`);

        // Create orders with existing users and products
        console.log('🛒 Creating sample orders...');
        const sampleOrdersData = createSampleOrders(existingUsers, existingProducts);
        const orderDocs = await Order.insertMany(sampleOrdersData);
        console.log(`✅ Inserted ${orderDocs.length} orders`);

        // Summary
        console.log('\n🎉 Banners and Orders initialization complete!');
        console.log('📊 Summary:');
        console.log(`   Existing Users: ${existingUsers.length}`);
        console.log(`   Existing Products: ${existingProducts.length}`);
        console.log(`   New Banners: ${bannerDocs.length}`);
        console.log(`   New Orders: ${orderDocs.length}`);

        // Statistics
        const totalOrderValue = orderDocs.reduce((sum, order) => sum + order.total_amount, 0);
        const deliveredOrders = orderDocs.filter(order => order.status === 'delivered').length;

        console.log(`\n📈 Order Statistics:`);
        console.log(`   Total order value: ₹${totalOrderValue.toLocaleString()}`);
        console.log(`   Delivered orders: ${deliveredOrders}/${orderDocs.length}`);
        console.log(`   Success rate: ${((deliveredOrders/orderDocs.length)*100).toFixed(1)}%`);

        // Banner breakdown
        const bannersByLocation = bannerDocs.reduce((acc, banner) => {
            acc[banner.location] = (acc[banner.location] || 0) + 1;
            return acc;
        }, {});

        console.log(`\n🎨 Banner breakdown:`);
        Object.entries(bannersByLocation).forEach(([location, count]) => {
            console.log(`   ${location}: ${count} banners`);
        });

        console.log('\n✅ All existing data preserved, only banners and orders added!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error initializing banners and orders:', error);
        process.exit(1);
    }
};

// Run the initialization
initializeBannersAndOrders();