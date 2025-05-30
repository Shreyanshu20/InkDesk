const Product = require('../models/product.model');
const Category = require('../models/category.model');

// Process voice search command
const processVoiceCommand = async (req, res) => {
  try {
    const { transcript, command_type = 'search' } = req.body;

    if (!transcript || transcript.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Transcript is required'
      });
    }

    const processedCommand = transcript.toLowerCase().trim();
    console.log('🎤 Processing voice command:', processedCommand);

    let response = {};

    switch (command_type) {
      case 'search':
        response = await handleVoiceSearch(processedCommand);
        break;
      case 'navigation':
        response = await handleVoiceNavigation(processedCommand);
        break;
      case 'auto':
      default:
        response = await handleAutoCommand(processedCommand);
        break;
    }

    res.json({
      success: true,
      ...response,
      originalTranscript: transcript
    });

  } catch (error) {
    console.error('Voice command processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process voice command',
      error: error.message
    });
  }
};

// Handle voice search
const handleVoiceSearch = async (command) => {
  try {
    // Extract search terms from command
    const searchTerm = extractSearchTerm(command);
    
    if (!searchTerm) {
      return {
        type: 'search',
        message: 'No search term found in command',
        searchTerm: command,
        suggestions: await getSearchSuggestions(command)
      };
    }

    // Search for products
    const products = await Product.find({
      $or: [
        { product_name: { $regex: searchTerm, $options: 'i' } },
        { product_description: { $regex: searchTerm, $options: 'i' } },
        { product_brand: { $regex: searchTerm, $options: 'i' } },
        { product_category: { $regex: searchTerm, $options: 'i' } },
        { product_subcategory: { $regex: searchTerm, $options: 'i' } }
      ]
    }).populate('category', 'category_name')
      .limit(10);

    return {
      type: 'search',
      searchTerm,
      message: `Found ${products.length} products`,
      products,
      redirectUrl: `/shop?search=${encodeURIComponent(searchTerm)}`
    };

  } catch (error) {
    console.error('Voice search error:', error);
    throw error;
  }
};

// Handle voice navigation
const handleVoiceNavigation = async (command) => {
  const navigationMap = {
    'home': { url: '/', message: 'Navigating to home page' },
    'shop': { url: '/shop', message: 'Navigating to shop' },
    'cart': { url: '/cart', message: 'Navigating to shopping cart' },
    'wishlist': { url: '/wishlist', message: 'Navigating to wishlist' },
    'about': { url: '/about', message: 'Navigating to about page' },
    'contact': { url: '/contact', message: 'Navigating to contact page' },
    'account': { url: '/account', message: 'Navigating to account page' },
    'orders': { url: '/orders', message: 'Navigating to orders page' },
    'stationery': { url: '/shop/category/stationery', message: 'Navigating to stationery category' },
    'office supplies': { url: '/shop/category/office-supplies', message: 'Navigating to office supplies' },
    'art supplies': { url: '/shop/category/art-supplies', message: 'Navigating to art supplies' },
    'craft materials': { url: '/shop/category/craft-materials', message: 'Navigating to craft materials' },
  };

  for (const [key, nav] of Object.entries(navigationMap)) {
    if (command.includes(key)) {
      return {
        type: 'navigation',
        redirectUrl: nav.url,
        message: nav.message
      };
    }
  }

  return {
    type: 'navigation',
    message: 'Navigation command not recognized',
    suggestions: Object.keys(navigationMap)
  };
};

// Handle auto-detection of command type
const handleAutoCommand = async (command) => {
  // Check for navigation keywords
  const navigationKeywords = ['go to', 'navigate to', 'open', 'show me', 'take me to'];
  const isNavigation = navigationKeywords.some(keyword => command.includes(keyword));

  if (isNavigation) {
    return await handleVoiceNavigation(command);
  }

  // Default to search
  return await handleVoiceSearch(command);
};

// Extract search term from voice command
const extractSearchTerm = (command) => {
  const searchPatterns = [
    /search for (.+)/i,
    /find (.+)/i,
    /look for (.+)/i,
    /show me (.+)/i,
    /i want (.+)/i,
    /i need (.+)/i,
  ];

  for (const pattern of searchPatterns) {
    const match = command.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  // If no pattern matches, return the entire command as search term
  return command;
};

// Get search suggestions
const getSearchSuggestions = async (query) => {
  try {
    const suggestions = await Product.aggregate([
      {
        $match: {
          $or: [
            { product_name: { $regex: query, $options: 'i' } },
            { product_brand: { $regex: query, $options: 'i' } },
            { product_category: { $regex: query, $options: 'i' } }
          ]
        }
      },
      {
        $group: {
          _id: null,
          names: { $addToSet: '$product_name' },
          brands: { $addToSet: '$product_brand' },
          categories: { $addToSet: '$product_category' }
        }
      },
      {
        $project: {
          suggestions: {
            $slice: [
              { $setUnion: ['$names', '$brands', '$categories'] },
              5
            ]
          }
        }
      }
    ]);

    return suggestions.length > 0 ? suggestions[0].suggestions : [];
  } catch (error) {
    console.error('Error getting suggestions:', error);
    return [];
  }
};

// Log voice search analytics
const logVoiceSearch = async (req, res) => {
  try {
    const { transcript, command_type, success, user_id } = req.body;

    // You can implement analytics logging here
    console.log('🎤 Voice Search Analytics:', {
      transcript,
      command_type,
      success,
      user_id,
      timestamp: new Date(),
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: 'Analytics logged successfully'
    });

  } catch (error) {
    console.error('Voice search analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to log analytics'
    });
  }
};

module.exports = {
  processVoiceCommand,
  logVoiceSearch
};