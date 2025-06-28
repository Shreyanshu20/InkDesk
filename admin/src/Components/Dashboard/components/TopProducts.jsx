import { Link } from "react-router-dom";

function TopProducts({ products }) {
  return (
    <div className="bg-background p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg border border-gray-200 dark:border-gray-800">
      <h2 className="text-lg font-medium text-text mb-6">
        Top Selling Products
      </h2>
      <div className="space-y-5">
        {products.map((product, index) => (
          <div key={product.id} className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium mr-3">
                {index + 1}
              </span>
              <div>
                <p className="text-sm font-medium text-text">{product.name}</p>
                <p className="text-xs text-text/60">
                  {product.sales} units sold
                </p>
              </div>
            </div>
            <p className="text-sm font-semibold text-text">
              ₹{product.revenue.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <Link
          to="/admin/products"
          className="inline-flex items-center text-sm text-primary hover:underline transition-all duration-300"
        >
          View all products
          <i className="fas fa-arrow-right text-xs ml-1"></i>
        </Link>
      </div>
    </div>
  );
}

export default TopProducts;
