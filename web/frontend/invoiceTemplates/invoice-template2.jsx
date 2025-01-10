import convertAmountToWords from "../components/ConvertAmount";
import React from "react";
import { useState, useEffect } from "react";


export function InvoiceTemplate2({ shopdetails, orders, invoiceSettings }) {
  console.log("orders - InvoiceTemplate2", orders[0]);
  console.log("store - details I2", shopdetails[0]);
  console.log("invoiceSettings - InvoiceTemplate2", invoiceSettings);

  const [storeDomain, setStoreDomain] = useState(null);
  const [email, setEmail] = useState(null);
  const [GSTHSNCodes, setGSTHSNCodes] = useState([]);
  const [InvoiceHeading, setInvoiceHeading] = useState("");
  const [BillHeading, setBillHeading] = useState("");
  const [ShipHeading, setShipHeading] = useState("");
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(date);
  };

  useEffect(() => {
    fetch("/api/2024-10/shop.json", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((request) => request.json())
      .then((response) => {
        console.log("Store Details---!", response.data);
        if (response.data.data.length > 0) {
          console.log("Store Details---", response.data.data[0]);

          setStoreDomain(response.data.data[0].domain);
          setEmail(response.data.data[0].email);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  const fetchInvoiceSettings = async () => {
    console.log("Sending request to fetch invoice settings");

    return fetch("/api/fetch-invoice-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, storeDomain: storeDomain }), // Replace with actual data
    })
      .then(async (response) => {
        if (!response.ok) {
          return response.text().then((errorText) => {
            throw new Error(
              errorText || `HTTP error! Status: ${response.status}`
            );
          });
        }
        return response.json();
      })
      .then((data) => {
        // setInvoiceSettings(data);
        const settings = data;
        console.log("Received response:", settings);
        
        // console.log("Received response:", JSON.stringify(settings));
      })
      .catch((error) => {
        console.error("Error fetching invoice settings:", error.message);
      });
  };

  const fetchGSTHSNValues = async (products) => {
    try {
      if (!storeDomain || !email) {
        console.error("Missing storeDomain or email:", {
          storeDomain,
          email: email,
        });
        throw new Error("Invalid storeDomain or email.");
      }

      const url = `/api/products/gsthsn?storeDomain=${encodeURIComponent(
        storeDomain
      )}&email=${encodeURIComponent(email)}`;
      console.log("Fetching GST HSN Values with URL:", url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch GST values. Status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("Fetched GST Values:", data.gstValues);

      setGSTHSNCodes(data.gstValues);
    } catch (error) {
      console.error("Error fetching GST values:", error);
    }
  };

  useEffect(() => {
    if (storeDomain && email) {
      fetchInvoiceSettings();
      fetchGSTHSNValues();
    }
  }, [storeDomain, email]);

  // console.log("billing_address - InvoiceTemplate2", orders[0].billing_address);
  // console.log("orders - InvoiceTemplate2", orders);
  // // console.log("orders - InvoiceTemplate2", JSON.stringify(orders));
  // console.log("store - details I", shopdetails[0]);
  useEffect(() => {
    setInvoiceHeading(invoiceSettings.overview.documentTitle || "invoice");
        setBillHeading(invoiceSettings.billing.heading|| "Bill To");
        setShipHeading(invoiceSettings.shipping.heading|| "Ship To");
  }, [orders, shopdetails, invoiceSettings]);

  

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
        border: "1px solid #000",
        padding: "10px",
      }}
    >
      <div
        style={{
          backgroundColor: "#1e3a8a",
          color: "white",
          padding: "10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "24px" }}>TAX INVOICE</h1>
        <div>
          <p style={{ margin: 0 }}>INVOICE NO : {orders[0].name}</p>
          <p style={{ margin: 0 }}>DATE : 04-03-2022</p>
        </div>
      </div>

      <div style={{ marginTop: "20px",  visibility: invoiceSettings.supplier.showSupplier
              ? "visible"
              : "hidden"}}>
        <h2 style={{ margin: 0, fontSize: "20px" }}>
        {invoiceSettings.supplier.showHeading ? (
              shopdetails[0].name !== null ? (
                shopdetails[0].name
              ) : (
                "N/A"
              )
            ) : (
              <td></td>
            )}
        </h2>
        <p style={{ margin: "5px 0" }}>
        {invoiceSettings.supplier.showAddress ? (
              shopdetails[0].address1 !== null ? (
                shopdetails[0].address1
              ) : (
                "N/A"
              )
            ) : (
              <td></td>
            )}
          {invoiceSettings.supplier.showCity ? (
              shopdetails[0].city !== null ? (
                shopdetails[0].city + ", "
              ) : (
                "N/A"
              )
            ) : (
              <td></td>
            )}
            
          {/* {shopdetails[0].state !== null ? shopdetails[0].state : "N/A"} */}
          {invoiceSettings.supplier.showZipPinCode ? (
              shopdetails[0].zip !== null ? (
                shopdetails[0].zip + ", "
              ) : (
                "N/A"
              )
            ) : (
              <td></td>
            )}
        </p>
        {/* <p style={{ margin: '5px 0' }}>GSTIN: AAA21345</p> */}
        <p style={{ margin: "5px 0" }}>
          Email ID:{" "}
          {shopdetails[0].email !== null ? shopdetails[0].email : "N/A"}
        </p>
        {/* <p style={{ margin: '5px 0' }}>PAN NO: AAA123456</p> */}
      </div>
      <div style={{ height: "20px" }}></div>

      <div
        style={{
          display: "flex",
          marginTop: "20px",
          border: "1px solid #000",
        }}
      >
        <div style={{ flex: 1, padding: "10px", backgroundColor: "#e6f2ff" }}>
          <h3 style={{ margin: 0, fontSize: "16px" }}>Bill To:</h3>
          {orders[0].billing_address !== null ? (
            <>
              <p style={{ margin: "5px 0" }}>
                {orders[0].billing_address.name !== null
                  ? orders[0].billing_address.name
                  : "N/A"}{" "}
              </p>
              <p style={{ margin: "5px 0" }}>
                ADDRESS:{" "}
                {orders[0].billing_address.address1 !== null
                  ? orders[0].billing_address.address1
                  : "N/A"}
              </p>
              <p style={{ margin: "5px 0" }}>
                {orders[0].billing_address.city !== null
                  ? orders[0].billing_address.city
                  : "N/A"}
                ,{" "}
                {orders[0].billing_address.province !== null
                  ? orders[0].billing_address.province
                  : "N/A"}{" "}
                -{" "}
                {orders[0].billing_address.zip !== null
                  ? orders[0].billing_address.zip
                  : "N/A"}
              </p>
            </>
          ) : (
            <>
            <p style={{ margin: "5px 0" }}>
                Address not available
              </p>
            </>
          )}

          <p style={{ margin: "5px 0" }}>
            Email ID: {orders[0].email !== null ? orders[0].email : "N/A"}
          </p>
          {/* <p style={{ margin: '5px 0' }}>GSTIN: 07AAFCD5862R1Z8</p> */}
        </div>
        <div style={{ flex: 1, padding: "10px", backgroundColor: "#e6f2ff" }}>
          <h3 style={{ margin: 0, fontSize: "16px" }}>Ship To:</h3>
          {orders[0].shipping_address !== null ? (
            <>
            <p style={{ margin: "5px 0" }}>
            {orders[0].shipping_address.name !== null
              ? orders[0].shipping_address.name
              : "N/A"}{" "}
          </p>
          <p style={{ margin: "5px 0" }}>
            ADDRESS:{" "}
            {orders[0].shipping_address.address1 !== null
              ? orders[0].shipping_address.address1
              : "N/A"}
          </p>
          <p style={{ margin: "5px 0" }}>
            {orders[0].shipping_address.city !== null
              ? orders[0].shipping_address.city
              : "N/A"}
            ,{" "}
            {orders[0].shipping_address.province !== null
              ? orders[0].shipping_address.province
              : "N/A"}{" "}
            -{" "}
            {orders[0].shipping_address.zip !== null
              ? orders[0].shipping_address.zip
              : "N/A"}
          </p>
            </>
          ) : (
            <>
            <p style={{ margin: "5px 0" }}>
                Address not available
              </p>
            </>
          )}
          
          <p style={{ margin: "5px 0" }}>
            Email ID: {orders[0].email !== null ? orders[0].email : "N/A"}
          </p>
          {/* <p style={{ margin: '5px 0' }}>GSTIN: 07AAFCD5862R1Z8</p> */}
        </div>
        {/* <div style={{ flex: 1, padding: '10px', backgroundColor: '#e6f2ff' }}>
          <p style={{ margin: '5px 0' }}>Payment Due Date:</p>
          <p style={{ margin: '5px 0' }}>Payment Mode:</p>
        </div> */}
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#e6f2ff" }}>
            <th style={{ border: "1px solid #000", padding: "8px" }}>
              Description
            </th>
            {/* <th style={{ border: '1px solid #000', padding: '8px' }}>HSN Code</th> */}
            <th style={{ border: "1px solid #000", padding: "8px" }}>Qty</th>
            <th style={{ border: "1px solid #000", padding: "8px" }}>Rate</th>
            <th style={{ border: "1px solid #000", padding: "8px" }}>Amount</th>
          </tr>
        </thead>

        {/* <td style={{ border: '1px solid #000', padding: '8px' }}></td>
            {/* <td style={{ border: '1px solid #000', padding: '8px' }}></td> */}
        {/* <td style={{ border: '1px solid #000', padding: '8px' }}></td> */}
        {/* <td style={{ border: '1px solid #000', padding: '8px' }}></td> */}
        {/* <td style={{ border: '1px solid #000', padding: '8px' }}></td> */}

        <tbody>
          {orders[0].line_items?.map((item) => (
            <tr key={item.id}>
              <td style={{ padding: "10px", border: "1px solid #000" }}>
                {item.name}
              </td>
              <td
                style={{
                  padding: "10px",
                  border: "1px solid #000",
                  textAlign: "center",
                }}
              >
                {item.quantity || "N/A"}
              </td>
              <td
                style={{
                  padding: "10px",
                  border: "1px solid #000",
                  textAlign: "center",
                }}
              >
                ₹ {item.price || 0}
              </td>
              <td
                style={{
                  padding: "10px",
                  border: "1px solid #000",
                  textAlign: "right",
                }}
              >
                ₹ {item.price || 0}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{
          display: "flex",
          marginTop: "20px",
        }}
      >
        <div style={{ flex: 1, backgroundColor: "#e6f2ff", padding: "10px" }}>
          <h3 style={{ margin: 0, fontSize: "16px" }}>Terms & conditions</h3>
          <ul style={{ paddingLeft: "0px", margin: "10px 0" }}>
            <li>Please include the invoice number on your check</li>
            {/* <li>Term 2</li>
            <li>Term 3</li>
            <li>Term 4</li>
            <li>Term 5</li> */}
          </ul>
        </div>
        <div style={{ flex: 1 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td style={{ border: "1px solid #000", padding: "8px" }}>
                  Total
                </td>
                <td style={{ border: "1px solid #000", padding: "8px" }}>
                  {orders[0].subtotal_price}
                </td>
              </tr>
              {/* <tr>
                <td style={{ border: '1px solid #000', padding: '8px' }}>Add : CGST @ 14%</td>
                <td style={{ border: '1px solid #000', padding: '8px' }}></td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #000', padding: '8px' }}>Add : SGST @ 14%</td>
                <td style={{ border: '1px solid #000', padding: '8px' }}></td>
              </tr> */}
              <tr>
                <td style={{ border: "1px solid #000", padding: "8px" }}>
                  Tax :
                </td>
                <td style={{ border: "1px solid #000", padding: "8px" }}>
                  {" "}
                  {orders[0].total_tax}
                </td>
              </tr>
              <tr>
                <td style={{ border: "1px solid #000", padding: "8px" }}>
                  Balance Due :
                </td>
                <td style={{ border: "1px solid #000", padding: "8px" }}>
                  {orders[0].total_outstanding}
                </td>
              </tr>
              <tr style={{ backgroundColor: "#1e3a8a", color: "white" }}>
                <td style={{ border: "1px solid #000", padding: "8px" }}>
                  Grand Total
                </td>
                <td style={{ border: "1px solid #000", padding: "8px" }}>
                  {orders[0].total_price}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <p>Total Amount (₹ - In Words) :</p>
        <p>{convertAmountToWords(orders[0].total_price)}</p>
      </div>
      <div style={{ height: "120px" }}></div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "40px",
        }}
      >
        <div>
          {/* <p>For : {shopdetails[0].name !== null ? shopdetails[0].name : "N/A"}</p> */}
          <p
            style={{ textAlign: "left", marginTop: "20px", fontSize: "0.9em" }}
          >
            If you have any questions about this invoice, please contact
            <br />
            Name: {shopdetails[0].name !== null
              ? shopdetails[0].name
              : "N/A"}{" "}
            <br />
            Phone:{" "}
            {shopdetails[0].phone !== null ? shopdetails[0].phone : "N/A"}{" "}
            <br />
            E-mail:{" "}
            {shopdetails[0].email !== null ? shopdetails[0].email : "N/A"}
          </p>
        </div>
        <div>
          <p
            style={{ textAlign: "right", marginTop: "20px", fontSize: "0.9em" }}
          >
            Authorised Signatory
          </p>
        </div>
      </div>
    </div>
  );
}
