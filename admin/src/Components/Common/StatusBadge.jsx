function StatusBadge({ status }) {
  const getStatusStyles = () => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-primary/20 text-primary";
      case "low-stock":
        return "bg-secondary/20 text-secondary";
      case "out-of-stock":
        return "bg-accent/20 text-accent";
      case "draft":
        return "bg-text/10 text-text/70";
      case "pending":
        return "bg-secondary/20 text-secondary";
      case "shipped":
        return "bg-primary/20 text-primary";
      case "delivered":
        return "bg-primary/30 text-primary";
      case "canceled":
        return "bg-accent/20 text-accent";
      default:
        return "bg-text/10 text-text/70";
    }
  };

  const getStatusText = () => {
    switch (status.toLowerCase()) {
      case "active":
        return "Active";
      case "low-stock":
        return "Low Stock";
      case "out-of-stock":
        return "Out of Stock";
      case "draft":
        return "Draft";
      case "pending":
        return "Pending";
      case "shipped":
        return "Shipped";
      case "delivered":
        return "Delivered";
      case "canceled":
        return "Canceled";
      default:
        return status;
    }
  };

  return (
    <span
      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full transition-all duration-300 hover:shadow-sm ${getStatusStyles()}`}
      role="status"
      aria-label={`Status: ${getStatusText()}`}
    >
      {getStatusText()}
    </span>
  );
}

export default StatusBadge;