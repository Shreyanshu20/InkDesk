import { getStatusColor } from "../Orders/components/utils";
import ActionGroup from "./ActionGroup";

// Order Table Configuration
export const getOrderTableConfig = (
  handleViewOrder,
  handleDeleteOrder,
  openStatusModal
) => ({
  columns: [
    {
      key: "id",
      label: "Order ID",
      sortable: true,
      customRenderer: (order) => (
        <div className="font-mono text-sm">
          <div className="font-semibold text-gray-900 dark:text-gray-100">
            #{order.order_number || order.id.slice(-8).toUpperCase()}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {order.items?.length || 0} items
          </div>
        </div>
      ),
    },
    {
      key: "customer",
      label: "Customer",
      sortable: true,
      customRenderer: (order) => (
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
            <span className="text-primary font-semibold text-sm">
              {order.customer.name.charAt(0).toUpperCase()}
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
      label: "Order Date",
      sortable: true,
      customRenderer: (order) => (
        <div className="text-sm">
          <div className="text-gray-900 dark:text-gray-100">
            {new Date(order.date).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(order.date).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      ),
    },
    {
      key: "total",
      label: "Total Amount",
      sortable: true,
      customRenderer: (order) => (
        <div className="text-sm font-semibold">
          <div className="text-gray-900 dark:text-gray-100">
            ₹{(order.total || 0).toLocaleString("en-IN")}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      customRenderer: (order) => (
        <button
          onClick={(e) => openStatusModal(order, e)}
          className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all hover:opacity-80 ${getStatusColor(
            order.status
          )}`}
          title="Click to update status"
        >
          <span className="capitalize">{order.status}</span>
          <i className="fas fa-edit ml-1 text-xs"></i>
        </button>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      customRenderer: (order) => {
        const actions = [
          {
            onClick: (item) => handleViewOrder(item.id),
            icon: "fas fa-eye",
            title: "View order details",
            variant: "view",
          },
          {
            onClick: (item, e) => {
              e?.stopPropagation();
              openStatusModal(item, e);
            },
            icon: "fas fa-edit",
            title: "Update status",
            variant: "status",
          },
          {
            onClick: (item, e) => {
              e?.stopPropagation();
              handleDeleteOrder(item.id);
            },
            icon: "fas fa-trash",
            title: "Delete order",
            variant: "delete",
          },
        ];

        return <ActionGroup actions={actions} item={order} />;
      },
    },
  ],
});

// Product Table Configuration - Updated
export const getProductTableConfig = (
  handleViewProduct,
  handleEditProduct,
  handleDeleteProduct,
  isAdmin = true // Keep this parameter for consistency
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
      customRenderer: (product) => {
        const actions = [
          {
            onClick: (item) => handleViewProduct(item.id),
            icon: "fas fa-eye",
            title: "View Product",
            variant: "view",
          },
          {
            onClick: (item) => handleEditProduct(item.id),
            icon: "fas fa-edit", 
            title: "Edit Product",
            variant: "edit"
          },
          {
            onClick: (item) => handleDeleteProduct(item.id),
            icon: "fas fa-trash",
            title: "Delete Product", 
            variant: "delete"
          }
        ];

        return <ActionGroup actions={actions} item={product} />;
      },
    },
  ],
});

// User Table Configuration
export const getUserTableConfig = ({ onView, onEdit, onDelete }) => ({
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
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
      customRenderer: (user) => (
        <div>
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {user.name || "N/A"}
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
      sortable: true,
      customRenderer: (user) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            user.role === "admin"
              ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
              : user.role === "manager"
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
              : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
          }`}
        >
          {user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || "Customer"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      customRenderer: (user) => (
        <button
          onClick={() => onUpdateStatus(user.id, user.status === "active" ? "inactive" : "active")}
          className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
            user.status === "active"
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200"
              : user.status === "inactive"
              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200"
              : user.status === "suspended"
              ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 hover:bg-orange-200"
              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 hover:bg-yellow-200"
          }`}
        >
          {user.status?.charAt(0).toUpperCase() + user.status?.slice(1) || "Active"}
        </button>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      sortable: false,
      customRenderer: (user) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {user.phone || "N/A"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Joined",
      sortable: true,
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
      customRenderer: (user) => {
        const actions = [
          {
            onClick: (item) => onView(item.id),
            icon: "fas fa-eye",
            title: "View User",
            variant: "view",
          },
          {
            onClick: (item) => onEdit(item.id),
            icon: "fas fa-edit",
            title: "Edit User",
            variant: "edit",
          },
          {
            onClick: (item) => onDelete(item.id),
            icon: "fas fa-trash",
            title: "Delete User",
            variant: "delete",
          },
        ];

        return <ActionGroup actions={actions} item={user} />;
      },
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

// Reviews Table Configuration - Updated with reduced column widths but keeping text-sm
export const getReviewsTableConfig = ({ onView, onDelete }) => ({
  columns: [
    {
      key: "customer",
      label: "Customer",
      sortable: false,
      customRenderer: (review) => (
        <div className="flex items-center w-32">
          <div className="h-6 w-6 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 mr-2 flex-shrink-0">
            {review.customer.avatar ? (
              <img
                src={review.customer.avatar}
                alt={review.customer.name}
                className="h-6 w-6 object-cover"
              />
            ) : (
              <div className="h-6 w-6 flex items-center justify-center bg-primary/10">
                <span className="text-primary font-semibold text-sm">
                  {review.customer.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {review.customer.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {review.customer.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "product",
      label: "Product",
      sortable: false,
      customRenderer: (review) => (
        <div className="flex items-center w-28">
          <div className="h-6 w-6 rounded-md overflow-hidden bg-gray-200 dark:bg-gray-700 mr-2 flex-shrink-0">
            {review.product.image ? (
              <img
                src={review.product.image}
                alt={review.product.name}
                className="h-6 w-6 object-cover"
              />
            ) : (
              <div className="h-6 w-6 flex items-center justify-center">
                <i className="fas fa-box text-gray-400 text-sm"></i>
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-gray-900 dark:text-white truncate" title={review.product.name}>
              {review.product.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {review.product.category}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "rating",
      label: "Rating",
      sortable: true,
      customRenderer: (review) => (
        <div className="flex items-center w-16">
          <span className="text-sm font-medium mr-1">{review.rating}</span>
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
      key: "content",
      label: "Review",
      sortable: false,
      customRenderer: (review) => (
        <div className="w-32">
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2" title={review.content}>
            {review.content && review.content.length > 50 
              ? `${review.content.substring(0, 50)}...` 
              : review.content || 'No content'}
          </p>
        </div>
      ),
    },
    {
      key: "date",
      label: "Date",
      sortable: true,
      customRenderer: (review) => (
        <div className="text-sm w-20">
          <div className="text-gray-900 dark:text-gray-100">
            {new Date(review.date).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short'
            })}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(review.date).toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      customRenderer: (review) => (
        <div className="flex items-center justify-end space-x-1 w-16">
          <button
            onClick={() => onView(review)}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1"
            title="View Review"
          >
            <i className="fas fa-eye text-sm"></i>
          </button>
          <button
            onClick={() => onDelete(review.id)}
            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1"
            title="Delete Review"
          >
            <i className="fas fa-trash text-sm"></i>
          </button>
        </div>
      ),
    },
  ],
});