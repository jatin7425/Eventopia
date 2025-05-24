import React, { useState, useEffect } from "react";
import { useEvent } from "../../store/eventContext";
import { BASE_URL } from "../../config/urls";

const MyOrders = ({ eventId }) => {
  const { getOrdered, OrderedProduct } = useEvent();
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [uniqueVendors, setUniqueVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (eventId) {
      setIsLoading(true);
      getOrdered(eventId).finally(() => setIsLoading(false));
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
            category: vendor.ShopCategory,
            image: vendor.ShopImage || "/default-vendor.jpg",
          };
        }
        return acc;
      }, {});

      setUniqueVendors(Object.values(vendorsMap));
    }
  }, [OrderedProduct]);

  // Get filtered orders for selected vendor
  const vendorOrders =
    OrderedProduct?.filter((order) =>
      selectedVendor ? order.vendor._id === selectedVendor : true
    ).filter(
      (order) =>
        order.product.productName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        order.vendor.ShopName.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      case "Shipped":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-zinc-100 text-zinc-800";
    }
  };

  const calculateTotal = (orders) => {
    return orders.reduce((sum, order) => {
      return sum + order.product.productPrice * order.quantity;
    }, 0);
  };

  return (
    <div className="pt-5 h-screen bg-white dark:bg-[#1a1a1a] ">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-zinc-800 dark:text-white">
              My Orders
            </h2>
            <p className="text-zinc-600 dark:text-zinc-300">
              {selectedVendor
                ? `Viewing orders from ${
                    uniqueVendors.find((v) => v.id === selectedVendor)?.name ||
                    "vendor"
                  }`
                : "All your orders in one place"}
            </p>
          </div>

          <div className="relative w-full md:w-64 mt-4 md:mt-0">
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {isLoading ? (
          <div className=" flex-1 flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0 max-h-full ">
            {/* Vendor List */}
            <div className="w-full lg:w-1/4 h-full overflow-y-auto bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 flex flex-col ">
              <div className="flex justify-between items-center mb-4 sticky top-0 dark:bg-zinc-800 bg-white rounded-xl p-4">
                <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">
                  Vendors
                </h3>
                <button
                  onClick={() => setSelectedVendor(null)}
                  className={`text-sm px-3 py-1 rounded-full ${
                    !selectedVendor
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      : "hover:bg-zinc-100 dark:hover:bg-zinc-700"
                  }`}
                >
                  All
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-6 px-4 pb-4 ">
                {uniqueVendors.length > 0 ? (
                  <div className="space-y-2">
                    {uniqueVendors.map((vendor) => (
                      <div
                        key={vendor.id}
                        onClick={() => setSelectedVendor(vendor.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all
                          ${
                            selectedVendor === vendor.id
                              ? "bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800"
                              : "hover:bg-zinc-50 dark:hover:bg-zinc-700 border border-transparent"
                          }`}
                      >
                        <div>
                          <h4 className="font-medium text-zinc-800 dark:text-white">
                            {vendor.name}
                          </h4>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            {vendor.category}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-zinc-500 text-center py-4">
                      No vendors found
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Orders List */}
            <div className="flex-1 flex flex-col min-h-0 max-h-[100%] w-full overflow-y-auto ">
              <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 flex-1 flex flex-col">
                {vendorOrders.length > 0 ? (
                  <div className="flex-1 flex flex-col ">
                    <div className="flex justify-between items-center  p-4 sticky top-0 bg-zinc-800 rounded-xl ">
                      <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">
                        {selectedVendor
                          ? `Orders (${vendorOrders.length})`
                          : `All Orders (${vendorOrders.length})`}
                      </h3>
                      {vendorOrders.length > 0 && (
                        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                          <span className="text-blue-500">Total &nbsp;</span>: ₹
                          {calculateTotal(vendorOrders).toFixed(2)}
                        </p>
                      )}
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 pb-4">
                      <div className="space-y-4 pb-2">
                        {vendorOrders.map((order) => (
                          <div
                            key={order._id}
                            className="bg-zinc-50 dark:bg-zinc-700/50 p-4 rounded-lg border border-zinc-200 dark:border-zinc-600 hover:shadow-md transition-shadow"
                          >
                            <div className="flex flex-col sm:flex-row gap-4">
                              <div className="flex-shrink-0">
                                <img
                                  src={`${BASE_URL}${order.product.productImage}`}
                                  alt={order.product.productName}
                                  className="w-24 h-24 object-cover rounded-lg"
                                  loading="lazy"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:justify-between">
                                  <div>
                                    <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">
                                      {order.product.productName}
                                    </h3>
                                    <p className="text-zinc-600 dark:text-zinc-300">
                                      <span className="font-medium">
                                        ₹{order.product.productPrice}
                                      </span>{" "}
                                      × {order.quantity}
                                    </p>
                                  </div>
                                  <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 sm:mt-0 ${getStatusColor(
                                      order.status
                                    )}`}
                                  >
                                    {order.status}
                                  </span>
                                </div>

                                <div className="mt-2 flex flex-wrap gap-2 text-sm">
                                  <p className="text-zinc-500 dark:text-zinc-400">
                                    <span className="font-medium">Vendor:</span>{" "}
                                    {order.vendor.ShopName}
                                  </p>
                                  <p className="text-zinc-500 dark:text-zinc-400">
                                    <span className="font-medium">
                                      Ordered:
                                    </span>{" "}
                                    {new Date(
                                      order.orderedAt
                                    ).toLocaleDateString("en-IN", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                </div>

                                {order.deliveryDate && (
                                  <div className="mt-2">
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                      <span className="font-medium">
                                        Expected Delivery:
                                      </span>{" "}
                                      {new Date(
                                        order.deliveryDate
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center py-12">
                      <svg
                        className="mx-auto h-12 w-12 text-zinc-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      <h3 className="mt-2 text-lg font-medium text-zinc-900 dark:text-white">
                        No orders found
                      </h3>
                      <p className="mt-1 text-zinc-500 dark:text-zinc-400">
                        {searchTerm
                          ? "No orders match your search criteria"
                          : selectedVendor
                          ? "This vendor has no orders yet"
                          : "You haven't placed any orders yet"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
