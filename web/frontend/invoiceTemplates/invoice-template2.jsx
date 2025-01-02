import convertAmountToWords from "../components/ConvertAmount";
import React from "react";

export function InvoiceTemplate2({ shopdetails, orders }) {
  console.log("orders - InvoiceTemplate2", orders[0]);
  console.log("store - details I2", shopdetails[0]);

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

      <div style={{ marginTop: "20px" }}>
        <h2 style={{ margin: 0, fontSize: "20px" }}>
          {shopdetails[0].name !== null ? shopdetails.name : "Shop Name"}
        </h2>
        <p style={{ margin: "5px 0" }}>
          {shopdetails[0].address1 !== null ? shopdetails[0].address1 : "N/A"},
          {shopdetails[0].city !== null ? shopdetails[0].city : "N/A"},
          {shopdetails[0].state !== null ? shopdetails[0].state : "N/A"},
          {shopdetails[0].zip !== null ? shopdetails[0].zip : "N/A"}
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
