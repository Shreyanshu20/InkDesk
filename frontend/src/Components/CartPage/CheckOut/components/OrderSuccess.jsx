import React from "react";
import { Link } from "react-router-dom";

const OrderSuccess = ({ orderData, formatPrice }) => {
  if (!orderData) {
    return (
      <div className="bg-background min-h-screen py-8 md:py-10 flex items-center justify-center">
        <div className="text-center px-4">
          <i className="fas fa-box-open text-4xl md:text-6xl text-gray-300 mb-3 md:mb-4"></i>
          <p className="text-gray-500 text-sm md:text-base">No order data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg md:rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-800">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 md:p-8 text-center">
            <div className="flex justify-center">
              <div className="w-12 h-12 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center mb-3 md:mb-4">
                <i className="fas fa-check-circle text-green-500 text-2xl md:text-4xl"></i>
              </div>
            </div>
            <h1 className="text-xl md:text-3xl font-bold mb-2">
              Order Placed Successfully!
            </h1>
            <p className="text-white/90 text-sm md:text-base">
              Thank you for your purchase. Your order is being processed.
            </p>
          </div>

          <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 rounded-lg md:rounded-xl p-4 md:p-6 mb-6 md:mb-8 border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div className="text-center md:text-left">
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Order Number
                  </p>
                  <p className="font-bold text-base md:text-lg text-text">
                    {orderData.orderNumber}
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Order Date
                  </p>
                  <p className="font-bold text-base md:text-lg text-text">
                    {new Date(orderData.orderDate).toLocaleDateString("en-IN")}
                  </p>
                </div>

                <div className="text-center md:text-right">
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Total Amount
                  </p>
                  <p className="font-bold text-lg md:text-xl text-primary">
                    {formatPrice(orderData.total)}
                  </p>
                </div>
              </div>
            </div>

            {orderData.giftMessage && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 md:p-5 rounded-lg md:rounded-xl mb-4 md:mb-6 border border-yellow-200 dark:border-yellow-800/30">
                <div className="flex items-start">
                  <div className="bg-yellow-100 dark:bg-yellow-800 p-2 rounded-full mr-3 md:mr-4">
                    <i className="fas fa-gift text-yellow-600 dark:text-yellow-300"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1 text-sm md:text-base">
                      Gift Message Included
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 italic text-xs md:text-sm">
                      "{orderData.giftMessage}"
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-6 md:mb-8">
              <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-gray-800 dark:text-gray-200">
                Order Items ({orderData.cartItems.length}{" "}
                {orderData.cartItems.length === 1 ? "item" : "items"})
              </h3>

              <div className="bg-white dark:bg-gray-800 rounded-lg md:rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="hidden md:block">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-4 md:px-6 py-3 md:py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-4 md:px-6 py-3 md:py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Qty
                        </th>
                        <th className="px-4 md:px-6 py-3 md:py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Total
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {orderData.cartItems.map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-900/50"
                        >
                          <td className="px-4 md:px-6 py-3 md:py-4">
                            <div className="flex items-center">
                              <div className="w-12 h-16 md:w-16 md:h-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100 mr-3 md:mr-4">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
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
                                  {item.brand || item.author}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 md:px-6 py-3 md:py-4 text-center">
                            <span className="font-medium text-text text-sm md:text-base">
                              {formatPrice(item.price)}
                            </span>
                          </td>

                          <td className="px-4 md:px-6 py-3 md:py-4 text-center">
                            <span className="inline-flex items-center justify-center w-10 h-6 md:w-12 md:h-8 bg-gray-100 dark:bg-gray-700 rounded-md font-medium text-text text-xs md:text-sm">
                              {item.quantity}
                            </span>
                          </td>

                          <td className="px-4 md:px-6 py-3 md:py-4 text-right">
                            <span className="font-semibold text-primary text-base md:text-lg">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>

                    <tfoot className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <td
                          colSpan="2"
                          className="px-4 md:px-6 py-3 md:py-4 font-medium text-gray-800 dark:text-gray-200 text-sm md:text-base"
                        >
                          Total Items:{" "}
                          {orderData.cartItems.reduce(
                            (sum, item) => sum + item.quantity,
                            0
                          )}
                        </td>
                        <td
                          className="px-4 md:px-6 py-3 md:py-4 text-right font-bold text-primary text-base md:text-lg"
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

                <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
                  {orderData.cartItems.map((item) => (
                    <div key={item.id} className="p-3 md:p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-16 h-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = "https://placehold.co/120x160?text=No+Image";
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-text text-sm mb-1">
                            {item.name}
                          </h4>
                          <p className="text-xs text-text/60 mb-2">{item.brand || item.author}</p>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-xs text-text/70">
                                {formatPrice(item.price)} × {item.quantity}
                              </span>
                            </div>
                            <span className="font-semibold text-primary">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg md:rounded-xl p-4 md:p-6 mb-6 md:mb-8 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 md:mb-4 text-sm md:text-base">
                Order Summary
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                    Subtotal
                  </span>
                  <span className="text-gray-700 dark:text-gray-300 text-sm md:text-base">
                    {formatPrice(orderData.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                    Shipping
                  </span>
                  <span className="text-green-600 dark:text-green-400 text-sm md:text-base">
                    {orderData.shipping === 0
                      ? "Free"
                      : formatPrice(orderData.shipping)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                    GST (18%)
                  </span>
                  <span className="text-gray-700 dark:text-gray-300 text-sm md:text-base">
                    {formatPrice(orderData.tax)}
                  </span>
                </div>
                {orderData.paymentMethod === "cod" && orderData.codFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                      COD Fee
                    </span>
                    <span className="text-gray-700 dark:text-gray-300 text-sm md:text-base">
                      {formatPrice(orderData.codFee)}
                    </span>
                  </div>
                )}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-4">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-800 dark:text-gray-200 text-sm md:text-base">
                      Total
                    </span>
                    <span className="font-bold text-lg md:text-xl text-primary">
                      {formatPrice(orderData.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg md:rounded-xl p-4 md:p-6 mb-6 md:mb-8 border border-blue-200 dark:border-blue-800/30">
              <div className="flex items-center mb-3 md:mb-4">
                <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-full mr-2 md:mr-3">
                  <i className="fas fa-truck text-blue-600 dark:text-blue-300"></i>
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm md:text-base">
                  Delivery Information
                </h3>
              </div>
              <div className="grid md:grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4">
                <div>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Estimated Delivery
                  </p>
                  <p className="font-medium text-gray-800 dark:text-gray-200 text-sm md:text-base">
                    {orderData.estimatedDelivery.start} -{" "}
                    {orderData.estimatedDelivery.end}
                  </p>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Delivery Address
                  </p>
                  <p className="font-medium text-gray-800 dark:text-gray-200 text-sm md:text-base">
                    {orderData.shippingDetails.firstName}{" "}
                    {orderData.shippingDetails.lastName}
                  </p>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                    {orderData.shippingDetails.city},{" "}
                    {orderData.shippingDetails.state}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center p-2 md:p-3 bg-blue-100 dark:bg-blue-800/50 rounded-lg">
                <i className="fas fa-box-open text-blue-600 dark:text-blue-400 mr-2"></i>
                <p className="text-xs md:text-sm text-blue-700 dark:text-blue-300 font-medium">
                  Your order is being processed and will be shipped soon
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:gap-4 justify-center">
              <Link
                to="/shop"
                className="bg-primary hover:bg-primary/90 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl transition-colors flex items-center justify-center shadow-md font-medium text-sm md:text-base"
              >
                <i className="fas fa-store mr-2"></i>
                Continue Shopping
              </Link>

              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl transition-colors flex items-center justify-center shadow-md font-medium text-sm md:text-base">
                <i className="fas fa-shipping-fast mr-2"></i>
                Track Order
              </button>

              <button className="bg-green-600 hover:bg-green-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl transition-colors flex items-center justify-center shadow-md font-medium text-sm md:text-base">
                <i className="fas fa-file-pdf mr-2"></i>
                Download Receipt
              </button>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 p-4 md:p-6 border-t border-gray-200 dark:border-gray-800 text-center">
            <div className="flex flex-col items-center space-y-2">
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                Thank you for shopping with InkDesk!
              </p>
              <div className="flex flex-wrap justify-center gap-3 md:gap-4 text-xs text-gray-500 dark:text-gray-500">
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
