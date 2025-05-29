// Shared pricing configuration for consistency across all pages
export const PRICING_CONFIG = {
    currency: "INR",
    locale: "en-IN",
    taxRate: 0.18, // 18% GST
    freeShippingThreshold: 99,
    shippingCost: 50,

    formatPrice: (price) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(price || 0);
    },

    calculateShipping: (subtotal) => {
        return subtotal >= PRICING_CONFIG.freeShippingThreshold ? 0 : PRICING_CONFIG.shippingCost;
    },

    calculateTax: (subtotal) => {
        return Math.round(subtotal * PRICING_CONFIG.taxRate * 100) / 100;
    },

    calculateTotal: (subtotal) => {
        const shipping = PRICING_CONFIG.calculateShipping(subtotal);
        const tax = PRICING_CONFIG.calculateTax(subtotal);
        return subtotal + shipping + tax;
    },

    getAmountForFreeShipping: (subtotal) => {
        return Math.max(0, PRICING_CONFIG.freeShippingThreshold - subtotal);
    }
};