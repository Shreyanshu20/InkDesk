const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  mobileImage: {  // ADD THIS FIELD
    type: String,
    trim: true
  },
  location: {
    type: String,
    required: true,
    enum: ['homepage-carousel', 'homepage', 'newsletter', 'advertisement']
  },
  position: {
    type: Number,
    default: 1
  },
  url: {
    type: String,
    trim: true
  },
  buttonText: {
    type: String,
    trim: true
  },
  textPosition: {
    type: String,
    enum: ['left', 'center', 'right'],
    default: 'center'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
bannerSchema.index({ location: 1, isActive: 1, position: 1 });

module.exports = mongoose.model('Banner', bannerSchema);