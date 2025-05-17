import React, { useState, useEffect } from 'react';
import { useEvent } from '../../store/eventContext';

const MyOrders = ({ eventId }) => {
  const { getOrdered, OrderedProduct } = useEvent();
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [uniqueVendors, setUniqueVendors] = useState([]);

  useEffect(() => {
    if (eventId) {
      getOrdered(eventId);
    }
  }, [eventId]);

  // Extract unique vendors when orders data changes
  useEffect(() => {
    if (OrderedProduct && OrderedProduct.length > 0) {
      const vendorsMap = OrderedProduct.reduce((acc, order) => {
        const vendor = order.vendor;
        if (!acc[vendor._id]) {
          acc[vendor._id] = {
            id: vendor._id,
            name: vendor.ShopName,
            category: vendor.ShopCategory
          };
        }
        return acc;
      }, {});
      
      setUniqueVendors(Object.values(vendorsMap));
    }
  }, [OrderedProduct]);

  // Get filtered orders for selected vendor
  const vendorOrders = OrderedProduct?.filter(order => 
    order.vendor._id === selectedVendor
  ) || [];

  return (
    <div className="w-full p-6">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>
      
      <div className="flex gap-6">
        {/* Vendor List */}
        <div className="w-1/4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Vendors</h3>
          {uniqueVendors.map(vendor => (
            <div
              key={vendor.id}
              onClick={() => setSelectedVendor(vendor.id)}
              className={`p-3 mb-2 rounded cursor-pointer transition-colors
                ${selectedVendor === vendor.id 
                  ? 'bg-blue-100 dark:bg-blue-900' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <h4 className="font-medium">{vendor.name}</h4>
              <p className="text-sm text-gray-500">{vendor.category}</p>
            </div>
          ))}
        </div>

        {/* Orders List */}
        <div className="flex-1">
          {selectedVendor ? (
            <div className="space-y-4">
              {vendorOrders.map(order => (
                <div key={order._id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                  <div className="flex items-start gap-4">
                    <img 
                      src={order.product.productImage} 
                      alt={order.product.productName}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{order.product.productName}</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Price: ₹{order.product.productPrice}
                      </p>
                      <div className="flex justify-between mt-2">
                        <p>Quantity: {order.quantity}</p>
                        <span className={`px-2 py-1 rounded ${
                          order.status === 'Pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Ordered on: {new Date(order.orderedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 h-full flex items-center justify-center">
              Select a vendor to view orders
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;