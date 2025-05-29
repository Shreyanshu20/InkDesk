import React from "react";
import { Link } from "react-router-dom";

const OrderSuccess = ({ orderData, formatPrice }) => {
  if (!orderData) {
    return (
      <div className="bg-background min-h-screen py-10 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-box-open text-6xl text-gray-300 mb-4"></i>
          <p className="text-gray-500">No order data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-background rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-800">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-8 text-center">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-check-circle text-green-500 text-4xl"></i>
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">
              Order Placed Successfully!
            </h1>
            <p className="text-white/90">
              Thank you for your purchase. Your order is being processed.
            </p>
          </div>

          {/* Order Details */}
          <div className="p-8 bg-gray-100 dark:bg-gray-900">
            {/* Order Info Grid */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-8 border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center md:text-left">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Order Number
                  </p>
                  <p className="font-bold text-lg text-text">
                    {orderData.orderNumber}
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Order Date
                  </p>
                  <p className="font-bold text-lg text-text">
                    {new Date(orderData.orderDate).toLocaleDateString("en-IN")}
                  </p>
                </div>

                <div className="text-center md:text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Total Amount
                  </p>
                  <p className="font-bold text-xl text-primary">
                    {formatPrice(orderData.total)}
                  </p>
                </div>
              </div>
            </div>

            {/* Gift Message */}
            {orderData.giftMessage && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-5 rounded-xl mb-6 border border-yellow-200 dark:border-yellow-800/30">
                <div className="flex items-start">
                  <div className="bg-yellow-100 dark:bg-yellow-800 p-2 rounded-full mr-4">
                    <i className="fas fa-gift text-yellow-600 dark:text-yellow-300"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                      Gift Message Included
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 italic">
                      "{orderData.giftMessage}"
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Order Items ({orderData.cartItems.length}{" "}
                {orderData.cartItems.length === 1 ? "item" : "items"})
              </h3>

              <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <table className="w-full">
                  {/* Table Header */}
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                        Price
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Qty
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {orderData.cartItems.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-900/50"
                      >
                        {/* Product Info */}
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-16 h-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100 mr-4">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  e.target.src =
                                    "https://placehold.co/120x160?text=No+Image";
                                }}
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-text text-sm md:text-base">
                                {item.name}
                              </h4>
                              <p className="text-xs md:text-sm text-text/60 mt-1">
                                {item.author}
                              </p>
                              {/* Show price on mobile */}
                              <p className="text-xs text-text/70 mt-1 md:hidden">
                                {formatPrice(item.price)} each
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Price (Desktop only) */}
                        <td className="px-6 py-4 text-center hidden md:table-cell">
                          <span className="font-medium text-text">
                            {formatPrice(item.price)}
                          </span>
                        </td>

                        {/* Quantity */}
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center justify-center w-12 h-8 bg-gray-100 dark:bg-gray-700 rounded-md font-medium text-text text-sm">
                            {item.quantity}
                          </span>
                        </td>

                        {/* Total */}
                        <td className="px-6 py-4 text-right">
                          <span className="font-semibold text-primary text-lg">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  {/* Table Footer with Summary */}
                  <tfoot className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <td
                        colSpan="2"
                        className="px-6 py-4 font-medium text-gray-800 dark:text-gray-200"
                      >
                        Total Items:{" "}
                        {orderData.cartItems.reduce(
                          (sum, item) => sum + item.quantity,
                          0
                        )}
                      </td>
                      <td
                        className="px-6 py-4 text-right font-bold text-primary text-lg"
                        colSpan="2"
                      >
                        Items Subtotal:{" "}
                        {formatPrice(
                          orderData.cartItems.reduce(
                            (sum, item) => sum + item.price * item.quantity,
                            0
                          )
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-8 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Order Summary
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Subtotal
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {formatPrice(orderData.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Shipping
                  </span>
                  <span className="text-green-600 dark:text-green-400">
                    {orderData.shipping === 0
                      ? "Free"
                      : formatPrice(orderData.shipping)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    GST (18%)
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {formatPrice(orderData.tax)}
                  </span>
                </div>
                {orderData.paymentMethod === "cod" && orderData.codFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      COD Fee
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {formatPrice(orderData.codFee)}
                    </span>
                  </div>
                )}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-4">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-800 dark:text-gray-200">
                      Total
                    </span>
                    <span className="font-bold text-xl text-primary">
                      {formatPrice(orderData.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-8 border border-blue-200 dark:border-blue-800/30">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-full mr-3">
                  <i className="fas fa-truck text-blue-600 dark:text-blue-300"></i>
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                  Delivery Information
                </h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Estimated Delivery
                  </p>
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {orderData.estimatedDelivery.start} -{" "}
                    {orderData.estimatedDelivery.end}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Delivery Address
                  </p>
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {orderData.shippingDetails.firstName}{" "}
                    {orderData.shippingDetails.lastName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {orderData.shippingDetails.city},{" "}
                    {orderData.shippingDetails.state}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-800/50 rounded-lg">
                <i className="fas fa-box-open text-blue-600 dark:text-blue-400 mr-2"></i>
                <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                  Your order is being processed and will be shipped soon
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/shop"
                className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl transition-colors flex items-center justify-center shadow-md font-medium"
              >
                <i className="fas fa-store mr-2"></i>
                Continue Shopping
              </Link>

              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors flex items-center justify-center shadow-md font-medium">
                <i className="fas fa-shipping-fast mr-2"></i>
                Track Order
              </button>

              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition-colors flex items-center justify-center shadow-md font-medium">
                <i className="fas fa-file-pdf mr-2"></i>
                Download Receipt
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-900 p-6 border-t border-gray-200 dark:border-gray-800 text-center">
            <div className="flex flex-col items-center space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Thank you for shopping with InkDesk!
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                <span className="flex items-center">
                  <i className="fas fa-envelope mr-1"></i>
                  support@inkdesk.com
                </span>
                <span className="flex items-center">
                  <i className="fas fa-phone mr-1"></i>
                  +91 98765 43210
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
