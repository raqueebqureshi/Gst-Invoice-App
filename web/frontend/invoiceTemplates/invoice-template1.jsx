import React from "react";
import { useState, useEffect } from "react";
import SocialMediaIcons from "../components/GlobalSocialIcons";

export function InvoiceTemplate1({ shopdetails, orders, invoiceSettings, GSTHSNCodes }) {
  console.log("orders - InvoiceTemplate1", orders);
  console.log("invoiceSettings - InvoiceTemplate1", invoiceSettings);
  console.log("GSTHSNCodes - InvoiceTemplate1", GSTHSNCodes.gstcodes);

  const [storeDomain, setStoreDomain] = useState(null);
  const [email, setEmail] = useState(null);
  const [shopId, setshopId] = useState("");
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
          setshopId(response.data.data[0].id || "");
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

  // const fetchGSTHSNValues = async () => {
  //   try {
  //     if (!storeDomain || !email) {
  //       console.error("Missing storeDomain or email:", {
  //         storeDomain,
  //         email: email,
  //       });
  //       throw new Error("Invalid storeDomain or email.");
  //     }

  //     const url = `/api/products/gsthsn?storeDomain=${encodeURIComponent(
  //       storeDomain
  //     )}&email=${encodeURIComponent(email)}`;
  //     console.log("Fetching GST HSN Values with URL:", url);

  //     const response = await fetch(url);

  //     if (!response.ok) {
  //       throw new Error(
  //         `Failed to fetch GST values. Status: ${response.status}`
  //       );
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

  // useEffect(() => {
  //   console.log("GSTHSNCodes -", GSTHSNCodes);
  // }, [GSTHSNCodes]);

    // console.log("billing_address - InvoiceTemplate1", orders[0].billing_address);
    // console.log("orders - InvoiceTemplate1", orders);
    // // console.log("orders - InvoiceTemplate1", JSON.stringify(orders));
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
          marginTop: "20px",
        }}
      >
        <div
          style={{
            visibility: invoiceSettings.supplier.showSupplier
              ? "visible"
              : "hidden",
          }}
        >
          <h1
            style={{
              color: "#4a5568",
              marginBottom: "5px",
              fontWeight: 600,
              fontSize: "20px",
            }}
          >
            {invoiceSettings.supplier.showHeading ? (
              shopdetails[0].name !== null ? (
                shopdetails[0].name
              ) : (
                "Shop Name"
              )
            ) : (
              <></>
            )}
          </h1>
          <p style={{ margin: "0", color: "#718096" }}>
            {invoiceSettings.supplier.showAddress ? (
              shopdetails[0].address1 !== null ? (
                shopdetails[0].address1
              ) : (
                "N/A"
              )
            ) : (
              <></>
            )}
          </p>
          <p style={{ margin: "0", color: "#718096" }}>
            {invoiceSettings.supplier.showCity ? (
              shopdetails[0].city !== null ? (
                shopdetails[0].city + " "
              ) : (
                "N/A"
              )
            ) : (
              <></>
            )}
            {invoiceSettings.supplier.showZipPinCode ? (
              shopdetails[0].zip !== null ? (
                shopdetails[0].zip + ", "
              ) : (
                "N/A"
              )
            ) : (
              <></>
            )}
          </p>
          <p style={{ margin: "0", color: "#718096" }}>
            {invoiceSettings.supplier.showPhone ? (
              <>
                <strong>Phone: </strong>
                {shopdetails[0]?.phone ? shopdetails[0].phone : "N/A"}
              </>
            ) : (
              <></>
            )}
          </p>
          {/* <p style={{ margin: '0', color: '#718096' }}>Fax: [000-000-0000]</p> */}
          <p style={{ margin: "0", color: "#718096" }}>
          {invoiceSettings.supplier.showEmail ? (
              <>
               <strong>Email: </strong>
               {shopdetails[0].email !== null ? shopdetails[0].email : "N/A"}
              </>
            ) : (
              <></>
            )}
            
          </p>
          <p style={{ margin: "0", color: "#718096" }}>
          {invoiceSettings.supplier.showGSTIN ? (
              <>
               <strong>GSTIN: </strong>
               {456789009876}
              </>
            ) : (
              <></>
            )}
            
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <h2
            style={{
              color: "#4299e1",
              fontSize: "2.5em",
              marginBottom: "20px",
            }}
          >
            {InvoiceHeading}
          </h2>
          <table style={{ borderCollapse: "collapse" }}>
            <tbody>
              {invoiceSettings.overview.issueDate ? (
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
                    {/* {formatDateTime(orders[0].processed_at)} */}
                    {formatDateTime(orders[0].created_at)}
                  </td>
                </tr>
              ) : (
                <></>
              )}

              {invoiceSettings.overview.showInvoiceNumber ? (
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
              ) : (
                <></>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "20px",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#4a5568", color: "white" }}>
          {invoiceSettings.billing.showBilling ? (
              <th style={{ padding: "10px", textAlign: "left", width: "50%", visibility: invoiceSettings.billing.showHeading ? "visible" :"hidden" }}>
              {BillHeading.toUpperCase()}
            </th>):(<></>)}
            
            {invoiceSettings.shipping.showShipping ? (
              <th style={{ padding: "10px", textAlign: "left", width: "50%", visibility: invoiceSettings.shipping.showHeading ? "visible" :"hidden" }}>
              {ShipHeading.toUpperCase()}
            </th>):(<></>)}
          </tr>
        </thead>
        <tbody>
          <tr>
          {invoiceSettings.billing.showBilling ? (
            <td
              style={{
                padding: "10px",
                border: "1px solid #e2e8f0",
                width: "50%",
              }}
            >
              {orders[0].billing_address !== null ? (
                <>
                {invoiceSettings.billing.showFullName?( orders[0].billing_address.name !== null
                    ? orders[0].billing_address.name
                    : "N/A") : (<></>)}
                  
                  <br />
                  {invoiceSettings.billing.showAddress1 ? (orders[0].billing_address.address1 !== null
                    ? orders[0].billing_address.address1 +', '
                    : "N/A"):(<></>)}
                  
                  
                  {/* {orders[0].billing_address.address2 !== null
                    ? orders[0].billing_address.address2
                    : ""}
                  ,{" "} */}
                  {invoiceSettings.billing.showCity ? (orders[0].billing_address.city !== null
                    ? orders[0].billing_address.city +', '
                    : ""):(<></>)}
                  
                  {invoiceSettings.billing.showState ? (orders[0].billing_address.province !== null
                    ? orders[0].billing_address.province +', '
                    : ""):(<></>)}
                  
                  {invoiceSettings.billing.showCountry ? (orders[0].billing_address.country !== null
                    ? orders[0].billing_address.country +', '
                    : ""):(<></>)}
                 {invoiceSettings.billing.showZipPinCode ? (orders[0].billing_address.zip !== null
                    ? orders[0].billing_address.zip 
                    : ""):(<></>)}
                  
                </>
              ) : (
                <>Address not available</>
              )}
            </td>):(<></>)}
            
            {invoiceSettings.shipping.showShipping ? (<td
              style={{
                padding: "10px",
                border: "1px solid #e2e8f0",
                width: "50%",
              }}
            >
              {orders[0].shipping_address !== null ? (
                <>
                {invoiceSettings.shipping.showFullName ?(orders[0].shipping_address.name !== null
                    ? orders[0].shipping_address.name 
                    : "N/A"):(<></>)} {" "}
                {invoiceSettings.shipping.showCompany ? (
                  `(${orders[0].billing_address.company !== null ? orders[0].billing_address.company : "N/A"})`
                ) : (
                  <></>
                )}
                  
                  <br />
                  {invoiceSettings.shipping.showAddress1 ?(orders[0].shipping_address.address1 !== null
                    ? orders[0].shipping_address.address1 + ', '
                    : "N/A"):(<></>)}
                 
                  {/* {orders[0].shipping_address.address2 !== null
                    ? orders[0].shipping_address.address2
                    : ""}
                  ,{" "} */}
                  {invoiceSettings.shipping.showCity ?(orders[0].shipping_address.city !== null
                    ? orders[0].shipping_address.city + ', '
                    : ""):(<></>)}
                  
                {invoiceSettings.shipping.showState ?(orders[0].shipping_address.province !== null
                    ? orders[0].shipping_address.province + ', '
                    : ""):(<></>)}
                  
                  {invoiceSettings.shipping.showCountry ?(orders[0].shipping_address.country !== null
                    ? orders[0].shipping_address.country + ', '
                    : ""):(<></>)}
                 
                  {invoiceSettings.shipping.showZipPinCode ?(orders[0].shipping_address.zip !== null
                    ? orders[0].shipping_address.zip 
                    : ""):(<></>)}
                  
                </>
              ) : (
                <>Address not availble</>
              )}
            </td>):(<></>)}
            
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
          <tr
            style={{
              backgroundColor: "#4a5568",
              color: "white",
              textAlign: "center",
            }}
          >
            {invoiceSettings.lineItems.showVariantTitle ? (<th style={{ padding: "10px", textAlign: "left" }}>ITEMS</th>):(<></>)}
            {invoiceSettings.lineItems.showQuantity ? (<th style={{ padding: "10px", width: "100px" }}>QTY</th>):(<></>)}
            {invoiceSettings.lineItems.showUnitRate ? (<th style={{ padding: "10px", width: "100px" }}>RATE</th>):(<></>)}
            {invoiceSettings.lineItems.showHSN ? (<th style={{ padding: "10px", textAlign: "left" }}>HSN</th>):(<></>)}
            {invoiceSettings.lineItems.showTaxAmount ? (<th style={{ padding: "10px", textAlign: "left" }}>GST</th>):(<></>)}
            {invoiceSettings.lineItems.showTaxAmount ? (<th style={{ padding: "10px", width: "100px" }}>TAX</th>):(<></>)}
            {invoiceSettings.lineItems.showTotalPrice ? (<th style={{ padding: "10px", width: "100px" }}>AMOUNT</th>):(<></>)}
            
          </tr>
        </thead>
        <tbody style={{ textAlign: "center" }}>
          {orders[0].line_items?.map((item, index) => {
            // console.log('GSTHSNCodes-------',GSTHSNCodes[0].productId);
            console.log('item-------',item.product_id);
            
            const matchedGSTItem = GSTHSNCodes.gstcodes ? GSTHSNCodes.gstcodes.find(
              (gstItem) => Number(gstItem.productId) === item.product_id
              ) : GSTHSNCodes.find(
                (gstItem) => Number(gstItem.productId) === item.product_id
                );
            
            const price = parseFloat(item.price) || 0; // Convert to a number and default to 0 if NaN
            const lineAmount =
              item.quantity * price + (item.total_tax || 0) || 0;
            return (
              <tr key={item.id}>
                {invoiceSettings.lineItems.showVariantTitle ? (<td style={{ padding: "10px", border: "1px solid #e2e8f0" }}>
                  {item.name}
                </td>):(<></>)}
                {invoiceSettings.lineItems.showQuantity ? (<td
                  style={{
                    padding: "10px",
                    border: "1px solid #e2e8f0",
                    textAlign: "center",
                  }}
                >
                  {item.quantity || "N/A"}
                </td>):(<></>)}
                
                {invoiceSettings.lineItems.showUnitRate ? (<td
                  style={{
                    padding: "10px",
                    border: "1px solid #e2e8f0",
                    textAlign: "center",
                  }}
                >
                  ₹{price || "N/A"}
                </td>):(<></>) }
                
                {invoiceSettings.lineItems.showHSN ? (<td style={{ padding: "10px", border: "1px solid #e2e8f0" }}>
                  {matchedGSTItem?.hsn || "-"}
                </td>):(<></>)}
                {invoiceSettings.lineItems.showTaxAmount ? (<td style={{ padding: "10px", border: "1px solid #e2e8f0" }}>
                  {matchedGSTItem?.gst || "-"}
                </td>):(<></>)}
                {invoiceSettings.lineItems.showTaxAmount ? (
                <td
                  style={{
                    padding: "10px",
                    border: "1px solid #e2e8f0",
                    textAlign: "center",
                  }}
                >
                  ₹{item.total_tax || "0"}
                </td>):(<></>)}
                {invoiceSettings.lineItems.showTotalPrice ? (
                <td
                  style={{
                    padding: "10px",
                    border: "1px solid #e2e8f0",
                    textAlign: "right",
                  }}
                >
                  ₹{lineAmount}
                </td>):(<></>)}
              </tr>
            );
          })}
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
          <ul style={{ paddingLeft: "14px ", paddingTop: "10px" }}>
            {/* <li>Total payment due in 30 days</li> */}
            {/* <li>Please include the invoice number on your check</li> */}
            <li>{invoiceSettings.footer.footerNote}</li>
          </ul>
        </div>
        <div style={{ width: "30%" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
            {invoiceSettings.total.showSubtotal ? (
              <tr>
                <td style={{ padding: "5px" }}>Subtotal</td>
                <td style={{ padding: "5px", textAlign: "right" }}>
                  ₹{" "}
                  {orders[0].subtotal_price !== null
                    ? Number(orders[0].subtotal_price)
                    : "0"}
                </td>
              </tr>
              ):(<></>)}
              {invoiceSettings.total.showTax ? (
              <tr>
              <td style={{ padding: "5px" }}>Taxable</td>
              <td style={{ padding: "5px", textAlign: "right" }}>
                ₹{" "}
                {orders[0].total_tax !== null ? Number(orders[0].total_tax) : "0"}
              </td>
            </tr>
            ):(<></>)}
              
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
              {invoiceSettings.total.showTotal ? (
              <tr style={{ fontWeight: "bold" }}>
                <td style={{ padding: "5px" }}>TOTAL</td>
                <td style={{ padding: "5px", textAlign: "right" }}>
                  ₹{" "}
                  {orders[0].total_price !== null
                    ? Number(orders[0].total_price)
                    : "0"}
                </td>
              </tr>
            ):(<></>)}
              
            </tbody>
          </table>
          <p style={{ marginTop: "10px", fontSize: "0.9em" }}>
            Make all checks payable to
            <br />
            {shopdetails[0].name}
          </p>
        </div>
      </div>

      
      <p style={{ textAlign: "center", marginTop: "150px", fontSize: "0.9em", borderTop: "1px solid #e2e8f0" }}>
        If you have any questions about this invoice, please contact
        <br />
        {invoiceSettings.supplier.showPhone ? (
              <><strong>Phone:</strong> {shopdetails[0].phone !== null
          ? shopdetails[0].phone
          : "N/A"}{" "}</>
            ):(<></>)}
        
        {' | '}
        {invoiceSettings.supplier.showEmail ? (
              <><strong>E-mail:</strong> {shopdetails[0].email !== null ? shopdetails[0].email : "N/A"}</>
            ):(<></>)}
        
      </p>
      <p style={{ textAlign: "center", fontWeight: "bold" }}>
        Thank You For Choosing Us!
      </p>
      <SocialMediaIcons shopId={shopId} invoiceSetting={invoiceSettings}/>
    </div>
    

  );
}
