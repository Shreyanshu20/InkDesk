import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useVoiceSearch = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const processVoiceCommand = useCallback(async (transcript) => {
    if (!transcript || transcript.trim().length === 0) {
      return;
    }

    setIsProcessing(true);
    
    try {
      const command = transcript.toLowerCase().trim();
      
      // Process navigation commands
      if (command.includes('go to') || command.includes('navigate to') || command.includes('open')) {
        handleNavigationCommand(command);
        return;
      }

      // Process search commands
      if (command.includes('search for') || command.includes('find') || command.includes('look for')) {
        const searchTerm = extractSearchTerm(command);
        if (searchTerm) {
          handleSearch(searchTerm);
          return;
        }
      }

      // Default: treat entire command as search term
      handleSearch(transcript.trim());
      
    } catch (error) {
      console.error('Voice command processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [navigate]);

  const handleNavigationCommand = (command) => {
    const navigationMap = {
      'home': '/',
      'shop': '/shop',
      'cart': '/cart',
      'wishlist': '/wishlist',
      'about': '/about',
      'contact': '/contact',
      'account': '/account',
      'orders': '/orders',
      'stationery': '/shop/category/stationery',
      'office supplies': '/shop/category/office-supplies',
      'art supplies': '/shop/category/art-supplies',
      'craft materials': '/shop/category/craft-materials',
    };

    for (const [key, path] of Object.entries(navigationMap)) {
      if (command.includes(key)) {
        navigate(path);
        return;
      }
    }
  };

  const extractSearchTerm = (command) => {
    const patterns = [
      /search for (.+)/i,
      /find (.+)/i,
      /look for (.+)/i,
      /show me (.+)/i,
    ];

    for (const pattern of patterns) {
      const match = command.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    return null;
  };

  const handleSearch = (searchTerm) => {
    if (searchTerm && searchTerm.length > 0) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return {
    processVoiceCommand,
    isProcessing,
  };
};