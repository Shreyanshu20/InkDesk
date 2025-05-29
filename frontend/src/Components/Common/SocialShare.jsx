import React from "react";

function SocialShare({ url, title }) {
  const socialPlatforms = [
    { name: 'facebook', icon: 'facebook-f' },
    { name: 'twitter', icon: 'twitter' },
    { name: 'instagram', icon: 'instagram' },
    { name: 'pinterest', icon: 'pinterest-p' }
  ];
  
  return (
    <div className="flex items-center">
      <span className="text-sm text-text/70 mr-4">Share:</span>
      <div className="flex space-x-3">
        {socialPlatforms.map((platform) => (
          <button 
            key={platform.name}
            className="h-9 w-9 rounded-full bg-primary/10 text-text flex items-center justify-center hover:bg-primary/40 transition-all duration-300"
            aria-label={`Share on ${platform.name}`}
          >
            <i className={`fab fa-${platform.icon}`}></i>
          </button>
        ))}
      </div>
    </div>
  );
}

export default SocialShare;