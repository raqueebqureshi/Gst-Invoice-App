import React from 'react';
import convertAmountToWords from '../components/ConvertAmount';
import { useState, useEffect } from "react";


export function InvoiceTemplate3({ shopdetails, orders, invoiceSettings, GSTHSNCodes  }) {

  console.log("orders - InvoiceTemplate3", orders[0]);
  console.log("store - details 3", shopdetails[0]);
  console.log("invoiceSettings - InvoiceTemplate3", invoiceSettings);
  console.log("GSTHSNCodes - InvoiceTemplate3", GSTHSNCodes);


  const [storeDomain, setStoreDomain] = useState(null);
  const [email, setEmail] = useState(null);
  // const [GSTHSNCodes, setGSTHSNCodes] = useState([]);
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
            throw new Error(errorText || `HTTP error! Status: ${response.status}`);
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

  // const fetchGSTHSNValues = async (products) => {
  //   try {
  //     if (!storeDomain || !email) {
  //       console.error("Missing storeDomain or email:", {
  //         storeDomain,
  //         email: email,
  //       });
  //       throw new Error("Invalid storeDomain or email.");
  //     }

  //     const url = `/api/products/gsthsn?storeDomain=${encodeURIComponent(storeDomain)}&email=${encodeURIComponent(
  //       email
  //     )}`;
  //     console.log("Fetching GST HSN Values with URL:", url);

  //     const response = await fetch(url);

  //     if (!response.ok) {
  //       throw new Error(`Failed to fetch GST values. Status: ${response.status}`);
  //     }

  //     const data = await response.json();
  //     console.log("Fetched GST Values:", data.gstValues);

  //     setGSTHSNCodes(data.gstValues);
  //   } catch (error) {
  //     console.error("Error fetching GST values:", error);
  //   }
  // };

  useEffect(() => {
    if (storeDomain && email) {
      fetchInvoiceSettings();
      // fetchGSTHSNValues();
    }
  }, [storeDomain, email]);

  // console.log("billing_address - InvoiceTemplate2", orders[0].billing_address);
  // console.log("orders - InvoiceTemplate2", orders);
  // // console.log("orders - InvoiceTemplate2", JSON.stringify(orders));
  // console.log("store - details I", shopdetails[0]);
  useEffect(() => {
    setInvoiceHeading(invoiceSettings.overview.documentTitle || "invoice");
    setBillHeading(invoiceSettings.billing.heading || "Bill To");
    setShipHeading(invoiceSettings.shipping.heading || "Ship To");
  }, [orders, shopdetails, invoiceSettings]);


  return (
    <>
      <style>
        {`
          .invoice-container {
            max-width: 900px;
            margin: 0 auto;
            padding: 0px;
            background-color: white;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
          }

          .invoice-border {
            border: 1px solid #000;
            padding: 12px;
          }

          .invoice-header, .invoice-section, .invoice-footer {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            border-bottom: 1px solid #d1d5db;
            padding-bottom: 8px;
          }

          .invoice-header .invoice-info, .invoice-header .invoice-logo, .invoice-header .invoice-right {
            padding: 8px;
          }

          .invoice-info p, .invoice-right p, .invoice-center h1, .invoice-center h2 {
            text-align: center;
            font-size: 1rem;
          }

          .invoice-center h1 {
            font-size: 1.25rem;
            font-weight: bold;
          }

          .invoice-center h2, .invoice-section h3 {
            font-size: 1rem;
            font-weight: 600;
          }

          .invoice-section .invoice-content, .invoice-content-right {
            padding-bottom: 8px;
          }

          .invoice-content p {
            margin: 4px 0;
          }

          .invoice-table {
            width: 100%;
            border-bottom: 1px solid #d1d5db;
          }

          .invoice-table th, .invoice-table td {
            padding-top: 12px;
            padding-bottom: 12px;
            padding-left: 6px;
            padding-right: 6px;
            text-align: center;
            border: 1px solid #d1d5db;
          }

          .invoice-table th {
            background-color: #f3f4f6;
            font-weight: 600;
            text-align: center;
          }

          .invoice-table-footer td {
            font-weight: 600;
          }

          .invoice-terms {
            display: grid;
            grid-template-columns: 1fr 1fr;
            padding: 8px;
          }

          .invoice-terms p {
            margin: 4px 0;
          }

          .invoice-summary-table {
            width: 100%;
            padding-bottom: 6px;
          }

          .invoice-summary-table td {
            padding: 4px 8px 8px 0px;
            text-align: right;
          }

          .invoice-summary-table .total td {
            font-weight: bold;
            border-top: 1px solid #d1d5db;
            
          }

          .invoice-signature, .invoice-powered-by {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 18px;
          }

          .invoice-powered-by {
            text-align: center;
          }

          .invoice-powered-by p {
            font-size: 0.875rem;
            margin-top: 8px;
          }

          .invoice-signature img {
            height: 48px;
          }

          @media screen and (max-width: 768px) {
            .invoice-header, .invoice-section, .invoice-footer {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>

      <div className="invoice-container">
        <div className="invoice-border">
          <div className="invoice-header">
            <div className="invoice-info">
              {/* <p>GSTIN: 07AACCM0437C1Z1</p> */}
            </div>
            <div className="invoice-center">
              <h1>{InvoiceHeading}</h1>
            </div>
            <div className="invoice-right">
              <p>Original</p>
            </div>
          </div>
          {invoiceSettings.supplier.showSupplier ? (<>
          <div className="invoice-center">
          {invoiceSettings.supplier.showHeading ? ( 
            <h2>{shopdetails[0].name !== null ? shopdetails[0].name: "Store Invoice"}</h2>) : (
            <></>
          )}
            <p>Email: {shopdetails[0].email !== null ? shopdetails[0].email: "N/A"}</p>
            <p>Website: {shopdetails[0].domain !== null ? shopdetails[0].domain: "N/A"}</p>
            <p>PH: {shopdetails[0].phone !== null ? shopdetails[0].phone: "N/A"}</p>
          </div>

          <div className="invoice-section">
            <div className="invoice-content">
            {invoiceSettings.overview.showInvoiceNumber ? ( <p><strong>Invoice No:</strong> {orders[0].order_number !== null 
              ? orders[0].order_number: "N/A"}</p>) : (
                <></>
              )}
              {/* <p><strong>Order Id:</strong> 1020</p> */}
              {invoiceSettings.overview.issueDate ? ( <p><strong>Invoice Date:</strong> {formatDateTime(orders[0].processed_at)}</p>) : (
            <></>
          )}
              {/* <p><strong>Payment:</strong> UPI</p> */}
            </div>
            <div className="invoice-content-right">
              <p><strong>Place of Supply</strong></p>
              <p>{shopdetails[0].city !== null ? shopdetails[0].city: "N/A"},  
                {shopdetails[0].province !== null ? shopdetails[0].province: "N/A"}</p>
              <p><strong>State Code: </strong> {shopdetails[0].province_code !== null 
              ? shopdetails[0].province_code: "N/A"}</p>
            </div>
          </div></>
) : (
  <></>
)}
          <div className="invoice-section">
            <div className="invoice-content">
              <h3>BILLED TO</h3>
              
              {orders[0].billing_address !== null ?(<>
                <p>{orders[0].billing_address.name !== null 
          ? orders[0].billing_address.name : "N/A"}</p>
              <p>{orders[0].billing_address.address1 !== null 
          ? orders[0].billing_address.address1 : "N/A"}</p>
              <p>{orders[0].billing_address.city !== null 
          ? orders[0].billing_address.city : "N/A"}, 
          Pin: {orders[0].billing_address.zip !== null 
            ? orders[0].billing_address.zip : "N/A"}, 
            {orders[0].billing_address.province !== null 
              ? orders[0].province : "N/A"}, {orders[0].billing_address.country !== null 
                ? orders[0].billing_address.country : "N/A"}</p>
              <p><strong>Tel:</strong> {orders[0].billing_address.phone !== null 
                ? orders[0].billing_address.phone : "N/A"}</p>
                <p><strong>Email:</strong>{orders[0].email !== null 
                ? orders[0].email : "N/A"}</p>
              </>):(<>
              Address not available
              </>)}
              
              
            </div>
            <div className="invoice-content">
              <h3>SHIP TO</h3>
              {orders[0].billing_address !== null ?(<>
                <p>{orders[0].shipping_address.name !== null 
          ? orders[0].shipping_address.name : "N/A"}</p>
              <p>{orders[0].shipping_address.address1 !== null 
          ? orders[0].shipping_address.address1 : "N/A"}</p>
              <p>{orders[0].shipping_address.city !== null 
          ? orders[0].shipping_address.city : "N/A"}, 
          Pin: {orders[0].shipping_address.zip !== null 
            ? orders[0].shipping_address.zip : "N/A"}, 
            {orders[0].shipping_address.province !== null 
              ? orders[0].province : "N/A"}, 
              {orders[0].shipping_address.country !== null 
                ? orders[0].shipping_address.country : "N/A"}</p>
              <p><strong>Tel:</strong> {orders[0].shipping_address.phone !== null 
                ? orders[0].shipping_address.phone : "N/A"}</p></>):(<>Address not available</>)}
             
              {/* <p><strong>Email:</strong> dikshathakur721@gmail.com</p> */}
            </div>
            <div className="invoice-content">
              <h3>SUPPLIER</h3>
              <p>{shopdetails[0].name !== null ? shopdetails[0].name: "Store Invoice"}</p>
              <p>{shopdetails[0].address1 !== null ? shopdetails[0].address1: "N/A"}, 
              {shopdetails[0].city !== null ? shopdetails[0].city: "N/A"}, 
              {shopdetails[0].province !== null ? shopdetails[0].province: "N/A"},
              {shopdetails[0].zip !== null ? shopdetails[0].zip: "N/A"}</p>
              <p><strong>Tel:</strong>{shopdetails[0].phone !== null ? shopdetails[0].phone: "N/A"}</p>
              <p><strong>Email:</strong> {shopdetails[0].email !== null ? shopdetails[0].email: "N/A"}</p>
              {/* <p><strong>GSTIN:</strong> 07AACCM0437C1Z1</p> */}
            </div>
          </div>

          <table className="invoice-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Taxable Val</th>
                {/* <th>HSN</th> */}
                {/* <th>GST</th> */}
                {/* <th>IGST</th> */}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
    {
      orders[0].line_items?.map((item) => (
        <tr key={item.id}>
          <td >
            {item.name}
          </td>
          <td >
            {item.quantity || "N/A"}
          </td>
          <td >
            {item.price || 0}
          </td>
          <td >
            {item.tax_lines?.[0]?.price ? item.tax_lines[0].price : "0"}
          </td>
          <td
          >
            ₹ {item.price || 0}
          </td>
        </tr>
      ))
   }
  </tbody>
            <tfoot className="invoice-table-footer">
              <tr>
                <td>Total</td>
                <td></td>
                <td>₹ {orders[0].total_price || 0}</td>
                <td>₹ {orders[0].total_tax || 0}</td>
                {/* <td></td>
                <td></td>
                <td>₹ 172.30</td> */}
                <td>₹ {orders[0].total_price || 0}</td>
              </tr>
            </tfoot>
          </table>

          <div className="invoice-terms">
            <div>
              <p>Terms and Conditions apply</p>
              <p>Amount in words:</p>
              <p>{convertAmountToWords(orders[0].total_price)}</p>
              
            </div>
            <div>
              <table className="invoice-summary-table">
                <tbody>
                  {/* <tr><td>Total Discount:</td><td>₹ 125.50 DIWALI10</td></tr> */}
                  <tr><td>Total Amount before Tax:</td><td>₹ {orders[0].subtotal_price||0}</td></tr>
                  <tr><td>Total Tax Amount:</td><td>₹ {orders[0].total_tax||0}</td></tr>
                  <tr><td>Total Amount After Tax:</td><td>₹ {orders[0].total_price ||0}</td></tr>
                  {/* <tr><td>Shipping Amount:</td><td>₹ 0.00</td></tr> */}
                  <tr className="total"><td>Total</td><td>₹ {orders[0].total_price ||0}</td></tr>
                </tbody>
              </table>
            </div>
          </div>

<div style={{ height: "120px" }}></div>

          <div className="invoice-signature">
            <p>Signature</p>
            {/* <img src="/placeholder.svg?height=50&width=150" alt="Style AromaTherapy Logo" /> */}
          </div>

          
        </div>
      </div>
    </>
  );
}
