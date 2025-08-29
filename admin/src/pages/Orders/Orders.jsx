import React, { useState, useEffect } from "react";
import "./Orders.css";
import { toast } from "react-toastify";
import axios from "axios";
import { assets } from "../../assets/assets";

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  // --- HELPER FUNCTION TO GET HEADERS WITH TOKEN ---
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication token not found. Please log in again.");
      return null;
    }
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    const fetchRevenue = async () => {
      const authHeaders = getAuthHeaders();
      if (!authHeaders) return;

      try {
        const response = await axios.get(url + "/api/order/list", authHeaders);
        if (response.data.success) {
          const orders = response.data.data;
          const revenue = orders.reduce(
            (sum, order) => sum + Number(order.amount),
            0
          );
          setTotalRevenue(revenue);
        } else {
          setTotalRevenue(0);
        }
      } catch (error) {
        console.error("Error fetching orders for revenue:", error);
        toast.error(error.response?.data?.message || "Error fetching revenue.");
        setTotalRevenue(0);
      }
    };

    fetchRevenue();
  }, [url]);

  const fetchAllOrders = async () => {
    const authHeaders = getAuthHeaders();
    if (!authHeaders) return;

    try {
      const response = await axios.get(url + "/api/order/list", authHeaders);
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error("Error fetching orders");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching orders");
      console.error("Fetch orders error:", error);
    }
  };

  const statusHandler = async (event, orderId) => {
    const authHeaders = getAuthHeaders();
    if (!authHeaders) return;

    try {
      const response = await axios.post(
        url + "/api/order/status",
        {
          orderId,
          status: event.target.value,
        },
        authHeaders
      );
      if (response.data.success) {
        await fetchAllOrders();
        toast.success("Order status updated");
      } else {
        toast.error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error(error.response?.data?.message || "Error updating order status");
    }
  };

  const deleteOrder = async (orderId, orderStatus) => {
    if (orderStatus !== "Delivered") {
      toast.error("Only delivered orders can be deleted");
      return;
    }
    
    const authHeaders = getAuthHeaders();
    if (!authHeaders) return;

    try {
      const response = await axios.delete(
        url + `/api/order/delete/${orderId}`,
        authHeaders
      );
      if (response.data.success) {
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== orderId)
        );
        toast.success("Order deleted successfully");
      } else {
        toast.error("Failed to delete order");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error(error.response?.data?.message || "Error deleting order");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="order add">
      <h1>Order Page</h1>
      <div className="order-item-revenue-option">
        <p>
          <strong>Total Orders = {orders.length}</strong>
        </p>
        <p>
          <strong>Total Revenue = ${totalRevenue}</strong>
        </p>
      </div>
      <div className="order-list">
        {orders.map((order) => (
          <div key={order._id} className="order-item">
            <img src={assets.parcel_icon} alt="Parcel Icon" />
            <div>
              <p className="order-item-food">
                {order.items.map((item, i) =>
                  i === order.items.length - 1
                    ? `${item.name} x${item.quantity}`
                    : `${item.name} x${item.quantity}, `
                )}
              </p>
              <p className="order-item-name">
                {order.address.firstName + " " + order.address.lastName}
              </p>
              <div className="order-item-address">
                <p>{order.address.street + ","}</p>
                <p>{`${order.address.city}, ${order.address.state}, ${order.address.country}, ${order.address.zipcode}`}</p>
              </div>
              <p className="order-item-phone">{order.address.phone}</p>
            </div>
            <p>Items: {order.items.length}</p>
            <p>${order.amount}</p>
            <select
              onChange={(event) => statusHandler(event, order._id)}
              value={order.status}
            >
              <option value="Food Processing">Food Processing</option>
              <option value="Out For Delivery">Out For Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
