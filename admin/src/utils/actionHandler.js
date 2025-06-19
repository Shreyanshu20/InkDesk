import { toast } from 'react-toastify';

export const withPermissionCheck = (action, adminContext) => {
  return (...args) => {
    if (!adminContext.canPerformAction()) {
      adminContext.showPermissionDenied();
      return;
    }
    return action(...args);
  };
};

export const createProtectedHandler = (handler, { canPerformAction, showPermissionDenied }) => {
    return (...args) => {
        if (!canPerformAction()) {
            showPermissionDenied();
            return;
        }
        return handler(...args);
    };
};