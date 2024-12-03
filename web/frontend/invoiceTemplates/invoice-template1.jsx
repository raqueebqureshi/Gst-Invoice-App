import React from "react";


export function InvoiceTemplate1({ shopdetails, orders }) {
  
  
  
  // console.log("billing_address - InvoiceTemplate1", orders[0].billing_address);
  console.log("orders - InvoiceTemplate1", orders[0]);
  console.log("store - details I", shopdetails[0]);
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(date);
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        border: "1px solid #ccc",
        backgroundColor: "#fff",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <div>
          <h1 style={{ color: "#4a5568", marginBottom: "5px" }}>
            {shopdetails[0].name !== null ? shopdetails[0].name : "Shop Name"}
          </h1>
          <p style={{ margin: "0", color: "#718096" }}>
            {shopdetails[0].address1 !== null ? shopdetails[0].address1 : "N/A"},
          </p>
          <p style={{ margin: "0", color: "#718096" }}>
            {shopdetails[0].city !== null ? shopdetails[0].city : "N/A"},
             {shopdetails[0].zip !== null ? shopdetails[0].zip : "N/A"},
          </p>
          <p style={{ margin: "0", color: "#718096" }}>
            Phone: {shopdetails[0].phone !== null ? shopdetails[0].phone : "N/A"}
          </p>
          {/* <p style={{ margin: '0', color: '#718096' }}>Fax: [000-000-0000]</p> */}
          <p style={{ margin: "0", color: "#718096" }}>
            Website: {shopdetails.domain !== null ? shopdetails.domain : "N/A"}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <h2
            style={{
              color: "#4299e1",
              fontSize: "2.5em",
              marginBottom: "10px",
            }}
          >
            INVOICE
          </h2>
          <table style={{ borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td
                  style={{
                    padding: "5px 10px",
                    border: "1px solid #e2e8f0",
                    backgroundColor: "#edf2f7",
                  }}
                >
                  DATE
                </td>
                <td
                  style={{ padding: "5px 10px", border: "1px solid #e2e8f0" }}
                >
                  {/* {formatDateTime(orders[0].processed_at)} */}{orders[0].processed_at}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "5px 10px",
                    border: "1px solid #e2e8f0",
                    backgroundColor: "#edf2f7",
                  }}
                >
                  INVOICE #
                </td>
                <td
                  style={{ padding: "5px 10px", border: "1px solid #e2e8f0" }}
                >
                  {orders[0].order_number !== null
                    ? orders[0].order_number
                    : "N/A"}
                </td>
              </tr>
              
            </tbody>
          </table>
        </div>
      </div>

      
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "20px",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#4a5568", color: "white" }}>
            <th style={{ padding: "10px", textAlign: "left", width: "50%" }}>
              BILL TO
            </th>
            <th style={{ padding: "10px", textAlign: "left", width: "50%" }}>
              SHIP TO
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              style={{
                padding: "10px",
                border: "1px solid #e2e8f0",
                width: "50%",
              }}
            >
              {orders[0].billing_address.name !== null
                ? orders[0].billing_address.name
                : "N/A"},<br />
              {orders[0].billing_address.address1 !== null
                ? orders[0].billing_address.address1
                : "N/A"}
              ,{" "}
              {orders[0].billing_address.address2 !== null
                ? orders[0].billing_address.address2
                : ""}
              ,{" "}
              {orders[0].billing_address.city !== null
                ? orders[0].billing_address.city
                : ""}
              ,{" "}
              {orders[0].billing_address.province !== null
                ? orders[0].billing_address.province
                : ""}
              ,{" "}
              {orders[0].billing_address.country !== null
                ? orders[0].billing_address.country
                : ""}
              ,{" "}
              {orders[0].billing_address.zip !== null
                ? orders[0].billing_address.zip
                : ""}
              
            </td>
            <td
              style={{
                padding: "10px",
                border: "1px solid #e2e8f0",
                width: "50%",
              }}
            >{orders[0].shipping_address.name !== null
              ? orders[0].shipping_address.name
              : "N/A"},<br />
              {orders[0].shipping_address.address1 !== null
                ? orders[0].shipping_address.address1
                : "N/A"}
              ,{" "}
              {orders[0].shipping_address.address2 !== null
                ? orders[0].shipping_address.address2
                : ""}
              ,{" "}
              {orders[0].shipping_address.city !== null
                ? orders[0].shipping_address.city
                : ""}
              ,{" "}
              {orders[0].shipping_address.province !== null
                ? orders[0].shipping_address.province
                : ""}
              ,{" "}
              {orders[0].shipping_address.country !== null
                ? orders[0].shipping_address.country
                : ""}
              ,{" "}
              {orders[0].shipping_address.zip !== null
                ? orders[0].shipping_address.zip
                : ""}
              
            </td>
          </tr>
        </tbody>
      </table>
      {/* console.log("orders", {orders.line_items.map((item) => item.name)}); */}
     
      <table
  style={{
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px",
  }}
>
  <thead>
    <tr style={{ backgroundColor: "#4a5568", color: "white" }}>
      <th style={{ padding: "10px", textAlign: "left" }}>ITEMS</th>
      <th style={{ padding: "10px", width: "100px" }}>QTY</th>
      <th style={{ padding: "10px", width: "100px" }}>TAX</th>
      <th style={{ padding: "10px", width: "100px" }}>AMOUNT</th>
    </tr>
  </thead>
  <tbody>
    {
      orders[0].line_items?.map((item) => (
        <tr key={item.id}>
          <td style={{ padding: "10px", border: "1px solid #e2e8f0" }}>
            {item.name}
          </td>
          <td style={{ padding: "10px", border: "1px solid #e2e8f0", textAlign: "center" }}>
            {item.quantity || "N/A"}
          </td>
          <td style={{ padding: "10px", border: "1px solid #e2e8f0", textAlign: "center" }}>
          ₹ {item.total_tax|| "0"}
          </td>
          <td
            style={{
              padding: "10px",
              border: "1px solid #e2e8f0",
              textAlign: "right",
            }}
          >
            ₹ {(item.price || 0)}
          </td>
        </tr>
      ))
   }
  </tbody>
</table>



      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ width: "50%" }}>
          <h3
            style={{
              backgroundColor: "#4a5568",
              color: "white",
              padding: "5px 10px",
            }}
          >
            OTHER COMMENTS
          </h3>
          <ol style={{ paddingLeft: "10px ", paddingTop: "10px" }}>
            {/* <li>Total payment due in 30 days</li> */}
            <li>Please include the invoice number on your check</li>
          </ol>
        </div>
        <div style={{ width: "30%" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td style={{ padding: "5px" }}>Subtotal</td>
                <td style={{ padding: "5px", textAlign: "right" }}>₹ {orders[0].subtotal_price !== null 
                ? orders[0].subtotal_price : "0.00"}</td>
              </tr>
              <tr>
                <td style={{ padding: "5px" }}>Taxable</td>
                <td style={{ padding: "5px", textAlign: "right" }}>₹ {orders[0].total_tax !== null 
                ? orders[0].total_tax : "0.00"}</td>
              </tr>
              {/* <tr>
                <td style={{ padding: "5px" }}>Tax rate</td>
                <td style={{ padding: "5px", textAlign: "right" }}>6.250%</td>
              </tr>
              <tr>
                <td style={{ padding: "5px" }}>Tax due</td>
                <td style={{ padding: "5px", textAlign: "right" }}>21.56</td>
              </tr> */}
              {/* <tr>
                <td style={{ padding: "5px" }}>Other</td>
                <td style={{ padding: "5px", textAlign: "right" }}></td>
              </tr> */}
              <tr style={{ fontWeight: "bold" }}>
                <td style={{ padding: "5px" }}>TOTAL</td>
                <td style={{ padding: "5px", textAlign: "right" }}>₹ {orders[0].total_price !== null ? orders[0].total_price : "0.00"}</td>
              </tr>
            </tbody>
          </table>
          <p style={{ marginTop: "10px", fontSize: "0.9em" }}>
            Make all checks payable to
            <br />
            {shopdetails[0].name}
          </p>
        </div>
      </div>
      <div style={{ height: "300px" }}></div>
      <p style={{ textAlign: "center", marginTop: "20px", fontSize: "0.9em" }}>
        If you have any questions about this invoice, please contact
        <br />
        Name: {shopdetails[0].name !== null ? shopdetails[0].name : "N/A"} <br />
        Phone: {shopdetails[0].phone !== null ? shopdetails[0].phone : "N/A"} <br />
        E-mail: {shopdetails[0].email !== null ? shopdetails[0].email : "N/A"}
      </p>
      <p style={{ textAlign: "center", fontWeight: "bold" }}>
        Thank You For Choosing Us!
      </p>
    </div>
  );
}
