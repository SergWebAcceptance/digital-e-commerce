import React, { useState, useEffect } from "react";
import { getOrdersByUser } from "../../api/orders";
import { useAuth } from "@/src/contexts/AuthContext";
import Link from "next/link";
import { ArrowDownToLine } from "lucide-react";

function Orders() {
  const { currentUser, fetchCurrentUser } = useAuth();
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) return;

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const ordersData = await getOrdersByUser(currentUser.email);
        console.log(currentUser);
        setOrders(ordersData);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  return (
    <>
      <div>
        <h2 className="text-xl font-bold text-gray-900">Your orders</h2>
        {loading && <p className="mt-4 text-gray-600">Loading orders...</p>}
        {error && <p className="mt-4 text-red-600">{error}</p>}
        {orders && (
          <div className="mt-8">
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Products
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.attributes.status == "cancelled" ? (
                          <div className="inline-block bg-red-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                            Cancelled
                          </div>
                        ) : (
                          <div className="inline-block bg-green-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                            Completed
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.attributes.createdAt}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-500">
                        {order.attributes.products.data.map((product) => (
                          <Link
                            key={product.id}
                            target="_blank"
                            href={
                              product.attributes.files.data[0].attributes.url
                            }
                            className="gap-2 inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                          >
                            {product.attributes.title}
                            <ArrowDownToLine width={16} />
                          </Link>
                        ))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">
                        $ {order.attributes.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Orders;
