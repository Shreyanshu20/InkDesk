import React from 'react';
import { useAdmin } from '../../Context/AdminContext';

const ReadOnlyBanner = () => {
    const { isReadOnly, adminData } = useAdmin();

    if (!isReadOnly()) return null;

    return (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 shadow-sm">
            <div className="flex items-center justify-center space-x-2 text-sm">
                <i className="fas fa-eye text-blue-200"></i>
                <span className="font-medium">
                    Read-Only Mode - Welcome {adminData?.first_name}!
                </span>
                <span className="text-blue-200">
                    You can view all data but cannot make changes.
                </span>
            </div>
        </div>
    );
};

export default ReadOnlyBanner;