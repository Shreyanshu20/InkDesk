import { getStatusColor } from "../Orders/components/utils";

// Order Table Configuration
export const getOrderTableConfig = (
  handleViewOrder,
  handleDelete,
  openStatusModal
) => ({
  columns: [
    {
      key: "id",
      label: "Order ID",
      sortable: true,
      customRenderer: (order) => (
        <span className="font-mono text-sm">
          #{order.order_number || order.id}
        </span>
      ),
    },
    {
      key: "customer",
      label: "Customer",
      sortable: true,
      customRenderer: (order) => (
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
            <span className="text-primary font-semibold text-sm">
              {order.customer.name.charAt(0)}
            </span>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {order.customer.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {order.customer.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "date",
      label: "Date",
      sortable: true,
      customRenderer: (order) => (
        <div className="text-sm">
          <div className="text-gray-900 dark:text-gray-100">
            {new Date(order.date).toLocaleDateString()}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(order.date).toLocaleTimeString()}
          </div>
        </div>
      ),
    },
    {
      key: "total",
      label: "Total",
      sortable: true,
      type: "currency",
    },
    {
      key: "status",
      label: "Status",
      sortable: false,
      type: "status",
      getStatusColor: (status) => {
        switch (status) {
          case "pending":
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
          case "processing":
            return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
          case "completed":
            return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
          case "cancelled":
            return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
          default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
        }
      },
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      customRenderer: (order) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleViewOrder(order.id)}
            className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
            title="View order"
          >
            <i className="fas fa-eye"></i>
          </button>
          <button
            onClick={(e) => openStatusModal(order, e)}
            className="text-primary hover:text-primary/80 p-1 rounded transition-colors"
            title="Update status"
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            onClick={() => handleDelete([order.id])}
            className="text-red-600 hover:text-red-700 p-1 rounded transition-colors"
            title="Delete order"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      ),
    },
  ],
});

// Product Table Configuration
export const getProductTableConfig = (
  handleViewProduct,
  handleEditProduct,
  handleDeleteProduct
) => ({
  columns: [
    {
      key: "name",
      label: "Product Name",
      sortable: true,
      customRenderer: (product) => (
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            {product.images && product.images[0] ? (
              <img
                className="h-10 w-10 rounded-md object-cover"
                src={product.images[0]}
                alt={product.name}
              />
            ) : (
              <div className="h-10 w-10 rounded-md bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                <i className="fas fa-image text-gray-400"></i>
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {product.name}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {product.brand}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "price",
      label: "Price",
      sortable: true,
      type: "currency",
    },
    {
      key: "inventory",
      label: "Stock",
      sortable: true,
    },
    {
      key: "category",
      label: "Category",
      sortable: true,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      type: "status",
      getStatusColor: (status) =>
        status === "active"
          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      customRenderer: (product) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleViewProduct(product.id)}
            className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
            title="View product"
          >
            <i className="fas fa-eye"></i>
          </button>
          <button
            onClick={() => handleEditProduct(product.id)}
            className="text-primary hover:text-primary/80 p-1 rounded transition-colors"
            title="Edit product"
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            onClick={() => handleDeleteProduct(product.id)}
            className="text-red-600 hover:text-red-700 p-1 rounded transition-colors"
            title="Delete product"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      ),
    },
  ],
});

// User Table Configuration
export const getUserTableConfig = (handlers) => ({
  columns: [
    {
      key: "avatar",
      label: "",
      sortable: false,
      customRenderer: (user) => (
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <span className="text-primary font-semibold text-sm">
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "name",
      label: "Name",
      sortable: true, // ✅ Make sortable
      customRenderer: (user) => (
        <div>
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {user.name || 'N/A'}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {user.email}
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      sortable: true, // ✅ Make sortable
      customRenderer: (user) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          user.role === 'admin' 
            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
            : user.role === 'manager'
            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
        }`}>
          {user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || 'Customer'}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true, // ✅ Make sortable
      customRenderer: (user) => (
        <button
          onClick={() => {
            const newStatus = user.status === 'active' ? 'inactive' : 'active';
            handlers.onUpdateStatus(user.id, newStatus);
          }}
          className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
            user.status === 'active'
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200'
              : user.status === 'inactive'
              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200'
              : user.status === 'suspended'
              ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 hover:bg-orange-200'
              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 hover:bg-yellow-200'
          }`}
        >
          {user.status?.charAt(0).toUpperCase() + user.status?.slice(1) || 'Active'}
        </button>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      sortable: false,
      customRenderer: (user) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {user.phone || 'N/A'}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Joined",
      sortable: true, // ✅ Make sortable
      customRenderer: (user) => (
        <div className="text-sm">
          <div className="text-gray-900 dark:text-gray-100">
            {new Date(user.createdAt).toLocaleDateString()}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(user.createdAt).toLocaleTimeString()}
          </div>
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      customRenderer: (user) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlers.onView(user.id)}
            className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
            title="View user"
          >
            <i className="fas fa-eye"></i>
          </button>
          <button
            onClick={() => handlers.onEdit(user.id)}
            className="text-primary hover:text-primary/80 p-1 rounded transition-colors"
            title="Edit user"
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            onClick={() => handlers.onDelete(user.id)}
            className="text-red-600 hover:text-red-700 p-1 rounded transition-colors"
            title="Delete user"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      ),
    },
  ],
});

// Banner Table Configuration 
export const getBannerTableConfig = (
  handleViewBanner,
  handleEditBanner,
  handleDeleteBanner,
  handleToggleStatus
) => {
  return {
    columns: [
      {
        key: "banner",
        label: "BANNER",
        type: "custom",
        sortable: false
      },
      {
        key: "position",
        label: "POSITION",
        type: "text",
        sortable: true
      },
      {
        key: "location",
        label: "LOCATION",
        type: "text",
        sortable: true
      },
      {
        key: "period",
        label: "ACTIVE PERIOD",
        type: "custom",
        sortable: true
      },
      {
        key: "status",
        label: "STATUS",
        type: "toggle",
        sortable: false,
        toggleHandler: handleToggleStatus
      },
      {
        key: "actions",
        label: "ACTIONS",
        type: "actions",
        sortable: false,
        actions: [
          {
            icon: "fas fa-eye",
            onClick: handleViewBanner,
            className: "text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-3",
            title: "View Banner"
          },
          {
            icon: "fas fa-edit",
            onClick: handleEditBanner,
            className: "text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-3",
            title: "Edit Banner"
          },
          {
            icon: "fas fa-trash",
            onClick: handleDeleteBanner,
            className: "text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300",
            title: "Delete Banner"
          }
        ]
      }
    ],
    itemKey: "id",
    tableType: "banners",
    renderConfigs: {
      banner: {
        renderer: "bannerRenderer"
      },
      location: {
        renderer: "locationRenderer",
        className: "px-2 py-1 rounded-full text-xs font-medium",
        specialClasses: {
          "homepage-carousel": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
          "default": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
        },
        displayTransform: {
          "homepage-carousel": "Home Carousel"
        }
      },
      period: {
        renderer: "periodRenderer"
      },
      status: {
        renderer: "toggleRenderer",
        activeClass: "bg-green-600 dark:bg-green-500",
        inactiveClass: "bg-gray-300 dark:bg-gray-600"
      }
    }
  };
};

// Reviews Table Configuration
export const getReviewsTableConfig = (handlers) => ({
  columns: [
    {
      key: "id",
      label: "ID",
      sortable: false,
      customRenderer: (review) => (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          RW-{review.id.slice(-6).toUpperCase()}
        </div>
      ),
    },
    {
      key: "customer_review",
      label: "CUSTOMER REVIEW",
      sortable: false,
      customRenderer: (review) => (
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
            {review.customer.avatar ? (
              <img
                src={review.customer.avatar}
                alt={review.customer.name}
                className="h-10 w-10 object-cover"
              />
            ) : (
              <div className="h-10 w-10 flex items-center justify-center bg-primary/10">
                <span className="text-primary font-semibold text-sm">
                  {review.customer.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
            )}
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              By {review.customer.name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 max-w-md">
              {review.content}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "rating",
      label: "RATING",
      sortable: true, // ✅ Make sortable
      customRenderer: (review) => (
        <div className="flex items-center">
          <span className="text-lg font-medium mr-2">{review.rating}</span>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-sm ${
                  star <= review.rating ? "text-yellow-400" : "text-gray-300"
                }`}
              >
                ★
              </span>
            ))}
          </div>
        </div>
      ),
    },
    {
      key: "product",
      label: "PRODUCT",
      sortable: false,
      customRenderer: (review) => (
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            {review.product.image ? (
              <img
                src={review.product.image}
                alt={review.product.name}
                className="h-10 w-10 rounded-md object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <i className="fas fa-box text-gray-400"></i>
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {review.product.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {review.product.category}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "date",
      label: "CREATED",
      sortable: true, // ✅ Make sortable
      customRenderer: (review) => {
        const date = new Date(review.date);
        const formattedDate = date.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
        const formattedTime = date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        });

        return (
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {formattedDate}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {formattedTime}
            </div>
          </div>
        );
      },
    },
    {
      key: "actions",
      label: "ACTIONS",
      sortable: false,
      customRenderer: (review) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlers.onView(review)}
            className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
            title="View Review"
          >
            <i className="fas fa-eye"></i>
          </button>
          <button
            onClick={() => handlers.onDelete(review.id)}
            className="text-red-600 hover:text-red-700 p-1 rounded transition-colors"
            title="Delete Review"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      ),
    },
  ],
});