import React, { useEffect, useState } from "react";

export default function OrderTableEx() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextPageInfo, setNextPageInfo] = useState(null);
  const [prevPageInfo, setPrevPageInfo] = useState(null);
  const [storeDomain, setStoreDomain] = useState(null);
  const [error, setError] = useState(null);

  // ✅ Fetch store domain first
  useEffect(() => {
    fetch("/api/2024-10/shop.json", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.data?.data?.length > 0) {
          setStoreDomain(data.data.data[0].domain);
        } else {
          setError("Store domain not found.");
        }
      })
      .catch((err) => {
        console.error("Error fetching store details:", err);
        setError("Failed to fetch store domain.");
      });
  }, []);

  // ✅ Function to fetch orders
  const fetchOrders = async (pageInfo = null) => {
    if (!storeDomain) return; // Ensure storeDomain is set before fetching

    setLoading(true);
    try {
      let url = `/api/fetch-orders?shop=${storeDomain}`;
      if (pageInfo) {
        url += `&page_info=${pageInfo}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.message) {
        setError(data.message); // Handle error message from API
      } else {
        setOrders(data.orders);
        setNextPageInfo(data.nextPageInfo);
        setPrevPageInfo(data.prevPageInfo);
        setError(null); // Clear errors on success
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to fetch orders.");
    }
    setLoading(false);
  };

  // ✅ Fetch orders only after storeDomain is set
  useEffect(() => {
    if (storeDomain) {
      fetchOrders();
    }
  }, [storeDomain]);

  return (
    <div>
      <h1>All Orders</h1>

      {/* Error Message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Loading State */}
      {loading ? <p>Loading...</p> : (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              Order #{order.order_number} - {order.total_price}
            </li>
          ))}
        </ul>
      )}

      {/* Pagination Buttons */}
      <div>
        {prevPageInfo && <button onClick={() => fetchOrders(prevPageInfo)}>Previous</button>}
        {nextPageInfo && <button onClick={() => fetchOrders(nextPageInfo)}>Next</button>}
      </div>
    </div>
  );
}
