// import React from "react";
// import convertAmountToWords from "../components/ConvertAmount";
// import { useState, useEffect } from "react";
// import { hexToRgba } from "../components/hex";
// import SocialMediaIcons from "../components/GlobalSocialIcons";
// import ReusableFunctions from "../components/ReusableFunctions";

// export function InvoiceTemplate3({ shopdetails, orders, invoiceSettings, GSTHSNCodes, shopProfile, isShopifyTax }) {
//   // console.log("isShopifyTax - ", isShopifyTax);
//   // console.log("orders - InvoiceTemplate3", orders[0]);
//   // console.log("store - details I3", shopdetails[0]);
//   // console.log("store - profile I3", shopProfile);
//   // console.log("invoiceSettings - InvoiceTemplate3", invoiceSettings);
//   // console.log("GSTHSNCodes - InvoiceTemplate3", GSTHSNCodes);

//   const [storeDomain, setStoreDomain] = useState(null);
//   const [email, setEmail] = useState(null);
//   // const [GSTHSNCodes, setGSTHSNCodes] = useState([]);
//   const [InvoiceHeading, setInvoiceHeading] = useState("INVOICE");
//   const [BillHeading, setBillHeading] = useState("BILL TO");
//   const [ShipHeading, setShipHeading] = useState("SHIP To");
//   const [shopId, setshopId] = useState("");
//   // const [shopProfile, setShopProfile] = useState({});
//   const [selectedFont, setSelectedFont] = useState("Roboto, sans-serif");
//   const formatDateTime = (dateString) => {
//     const date = new Date(dateString);
//     return new Intl.DateTimeFormat("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "2-digit",
//     }).format(date);
//   };

//   useEffect(() => {
//     fetch("/api/2024-10/shop.json", {
//       method: "GET",
//       headers: { "Content-Type": "application/json" },
//     })
//       .then((request) => request.json())
//       .then((response) => {
//         // console.log("Store Details---!", response.data);
//         if (response.data.data.length > 0) {
//           // console.log("Store Details---", response.data.data[0]);

//           setStoreDomain(response.data.data[0].domain);
//           setEmail(response.data.data[0].email);
//           setshopId(response.data.data[0].id || "");
//         }
//       })
//       .catch((error) => console.log(error));
//   }, []);

//   // // Compute total tax across all line items
//   const totalTaxAmount = orders[0].line_items?.reduce((acc, item) => {
//     const matchedGSTItem = GSTHSNCodes.gstcodes
//       ? GSTHSNCodes.gstcodes.find((gstItem) => Number(gstItem.productId) === item.product_id)
//       : GSTHSNCodes.find((gstItem) => Number(gstItem.productId) === item.product_id);

//     let taxPrice = 0;

//     if (!isShopifyTax.isAppTax) {
//       taxPrice = item?.tax_lines ? parseFloat(item?.tax_lines[0]?.price || 0) : 0 ;
//     } else {
//       const gst = matchedGSTItem?.gst ? parseFloat(matchedGSTItem.gst) : 0;
//       const inclusiveTotal = parseFloat(item?.price || 0) * item.quantity + parseFloat(item?.tax_lines[0]?.price || 0) || 0;
//       const baseTotal = inclusiveTotal / (1 + gst / 100);
//       taxPrice = taxPrice + inclusiveTotal - baseTotal;
//       // taxPrice = matchedGSTItem?.gst
//       //   ? ((parseFloat(item.price) * parseFloat(matchedGSTItem.gst)) / 100) * item.quantity
//       //   : 0;
//     }

//     return acc + taxPrice;
//   }, 0); // Convert to 2 decimal places

//   let subTotal = 0;
//   let grandTotal = 0;

//   if (!isShopifyTax.isAppTax) {
//     subTotal = Number(orders[0].subtotal_price !== null ? orders[0].subtotal_price : 0) || 0;
//     grandTotal =
//       subTotal +
//       Number(totalTaxAmount) +
//       // (orders[0]?.shipping_lines[0]?.price ? Number(orders[0]?.shipping_lines[0]?.price || 0) : 0);
//       ( Number(orders[0]?.shipping_lines[0]?.price || 0));
//     }

//   useEffect(() => {
//     setInvoiceHeading(invoiceSettings.overview.documentTitle || "invoice");
//     setBillHeading(invoiceSettings.billing.heading || "Bill To");
//     setShipHeading(invoiceSettings.shipping.heading || "Ship To");
//     setSelectedFont(invoiceSettings.branding.fontFamily);
//     // console.log('invoiceSettings.branding.fontFamily', invoiceSettings.branding.fontFamily);
//     // console.log("selectedFont", selectedFont);
//   }, [orders, shopdetails, invoiceSettings, selectedFont]);

//   return (
//     <div
//       style={{
//         maxWidth: "900px",
//         margin: "0 auto",
//         padding: "0px",
//         fontFamily: selectedFont,
//         backgroundColor: "white",
//         boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
//         border: "1px solid #000",
//       }}
//     >
//       <div style={{ padding: "12px" }}>
//         {/* Header Section */}
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(3, 1fr)",
//             borderBottom: "1px solid #d1d5db",
//             paddingBottom: "8px",
//           }}
//         >
//           <div style={{ padding: "0px 5px" }}>
//             {invoiceSettings.branding.showLogo ? (
//               <img
//                 src={
//                   shopProfile?.images?.logoURL ||
//                   "https://www.matkaklubi.ee/wp-content/uploads/2016/12/logo-placeholder-generic.200x200.png"
//                 }
//                 alt=""
//                 style={{
//                   maxWidth: "35px",
//                   maxHeight: "35px",
//                   objectFit: "contain",
//                   borderRadius: "4px",
//                 }}
//               />
//             ) : null}
//           </div>
//           <div style={{ padding: "8px", textAlign: "center" }}>
//             <h1 style={{ fontSize: "1.25rem", fontWeight: "bold", margin: 0 }}>{InvoiceHeading}</h1>
//           </div>
//         </div>

//         {/* Supplier Information Section */}
//         {invoiceSettings.supplier.showHeading ? (
//           <div style={{ textAlign: "center", padding: "8px" }}>
//             <h2
//               style={{
//                 fontSize: "1rem",
//                 fontWeight: 600,
//                 marginBottom: "4px",
//               }}
//             >
//               {shopdetails[0]?.name || "Store Invoice"}
//             </h2>
//           </div>
//         ) : null}

//         {/* Invoice Information Section */}
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "1fr 1fr",
//             borderBottom: "1px solid #d1d5db",
//             paddingBottom: "8px",
//           }}
//         >
//           <div style={{ padding: "8px" }}>
//             {invoiceSettings.overview.showInvoiceNumber && (
//               <p style={{ margin: "4px 0" }}>
//                 <strong>Invoice No:</strong> {orders[0]?.order_number || "Not Available"}
//               </p>
//             )}
//             {invoiceSettings.overview.issueDate && (
//               <p style={{ margin: "4px 0" }}>
//                 <strong>Invoice Date:</strong> {formatDateTime(orders[0]?.processed_at)}
//               </p>
//             )}
//           </div>
//           {invoiceSettings.supplier.showAddress ? (
//             <div style={{ padding: "8px" }}>
//               <p style={{ margin: "4px 0" }}>
//                 <strong>Place of Supply:</strong> {shopdetails[0]?.city || "Not Available"},{" "}
//                 {shopdetails[0]?.province || "Not Available"}
//               </p>
//               <p style={{ margin: "4px 0" }}>
//                 <strong>State Code:</strong> {shopdetails[0]?.province_code || "Not Available"}
//               </p>
//             </div>
//           ) : (
//             <></>
//           )}
//         </div>

//         {/* Billing and Shipping Section */}
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(3, 1fr)",
//             borderBottom: "1px solid #d1d5db",
//             paddingBottom: "8px",
//           }}
//         >
//           {invoiceSettings.billing.showBilling ? (
//             <div style={{ padding: "8px" }}>
//               {invoiceSettings.billing.showHeading ? (
//                 <h3 style={{ fontSize: "1rem", fontWeight: 600, margin: 0 }}>{BillHeading.toUpperCase()}</h3>
//               ) : (
//                 <></>
//               )}

//               {orders[0]?.billing_address ? (
//                 <>
//                   <p>
//                     {invoiceSettings.billing.showFullName ? (
//                       orders[0]?.billing_address?.name !== null ? (
//                         orders[0]?.billing_address?.name
//                       ) : (
//                         "Not Available"
//                       )
//                     ) : (
//                       <></>
//                     )}{" "}
//                     {invoiceSettings.billing.showCompany && orders[0]?.billing_address?.company && (
//                       <span> ({orders[0].billing_address.company})</span>
//                     )}
//                   </p>
//                   <p>
//                     {invoiceSettings.billing.showAddress1 ? (
//                       orders[0]?.billing_address?.address1 !== null ? (
//                         orders[0]?.billing_address?.address1 + ", "
//                       ) : (
//                         "Not Available"
//                       )
//                     ) : (
//                       <></>
//                     )}
//                   </p>
//                   <p>
//                     {invoiceSettings.billing.showCity ? (
//                       orders[0]?.billing_address?.city !== null ? (
//                         orders[0]?.billing_address?.city + ", "
//                       ) : (
//                         ""
//                       )
//                     ) : (
//                       <></>
//                     )}
//                     {invoiceSettings.billing.showState ? (
//                       orders[0]?.billing_address?.province !== null ? (
//                         orders[0]?.billing_address?.province + ", "
//                       ) : (
//                         ""
//                       )
//                     ) : (
//                       <></>
//                     )}{" "}
//                     Pin:{" "}
//                     {invoiceSettings.billing.showZipPinCode ? (
//                       orders[0]?.billing_address?.zip !== null ? (
//                         orders[0]?.billing_address?.zip + ", "
//                       ) : (
//                         ""
//                       )
//                     ) : (
//                       <></>
//                     )}
//                     {invoiceSettings.billing.showCountry ? (
//                       orders[0]?.billing_address?.country !== null ? (
//                         orders[0]?.billing_address?.country
//                       ) : (
//                         ""
//                       )
//                     ) : (
//                       <></>
//                     )}
//                   </p>
//                   {invoiceSettings.billing.showEmail ? (
//                     <p>
//                       <strong>Email:</strong> {orders[0]?.email || "Not Available"}
//                     </p>
//                   ) : (
//                     <></>
//                   )}
//                   {invoiceSettings.billing.showPhone ? (
//                     <p>
//                       <strong>Tel:</strong> {orders[0]?.billing_address?.phone || "Not Available"}
//                     </p>
//                   ) : (
//                     <></>
//                   )}
//                 </>
//               ) : (
//                 <p>Address not available</p>
//               )}
//             </div>
//           ) : (
//             <></>
//           )}
//           {invoiceSettings.shipping.showShipping ? (
//             <div style={{ padding: "8px" }}>
//               {invoiceSettings.shipping.showHeading ? (
//                 <h3 style={{ fontSize: "1rem", fontWeight: 600, margin: 0 }}>{ShipHeading.toUpperCase()}</h3>
//               ) : (
//                 <></>
//               )}
//               {orders[0]?.shipping_address ? (
//                 <>
//                   <p>
//                     {invoiceSettings.shipping.showFullName ? (
//                       orders[0]?.shipping_address?.name !== null ? (
//                         orders[0]?.shipping_address?.name
//                       ) : (
//                         "Not Available"
//                       )
//                     ) : (
//                       <></>
//                     )}{" "}
//                     {invoiceSettings.shipping.showCompany && orders[0]?.shipping_address?.company && (
//                       <span> ({orders[0].shipping_address.company})</span>
//                     )}
//                   </p>
//                   <p>
//                     {invoiceSettings.shipping.showAddress1 ? (
//                       orders[0]?.shipping_address?.address1 !== null ? (
//                         orders[0]?.shipping_address?.address1 + ", "
//                       ) : (
//                         "Not Available"
//                       )
//                     ) : (
//                       <></>
//                     )}
//                   </p>
//                   <p>
//                     {invoiceSettings.shipping.showCity ? (
//                       orders[0]?.shipping_address?.city !== null ? (
//                         orders[0]?.shipping_address?.city + ", "
//                       ) : (
//                         ""
//                       )
//                     ) : (
//                       <></>
//                     )}
//                     {invoiceSettings.shipping.showState ? (
//                       orders[0]?.shipping_address?.province !== null ? (
//                         orders[0]?.shipping_address?.province + ", "
//                       ) : (
//                         ""
//                       )
//                     ) : (
//                       <></>
//                     )}{" "}
//                     Pin:{" "}
//                     {invoiceSettings.shipping.showZipPinCode ? (
//                       orders[0]?.shipping_address?.zip !== null ? (
//                         orders[0]?.shipping_address?.zip + ", "
//                       ) : (
//                         ""
//                       )
//                     ) : (
//                       <></>
//                     )}
//                     {invoiceSettings.shipping.showCountry ? (
//                       orders[0]?.shipping_address?.country !== null ? (
//                         orders[0]?.shipping_address?.country
//                       ) : (
//                         ""
//                       )
//                     ) : (
//                       <></>
//                     )}
//                   </p>

//                   {invoiceSettings.shipping.showEmail ? (
//                     <p>
//                       <strong>Email:</strong> {orders[0]?.email || "Not Available"}
//                     </p>
//                   ) : (
//                     <></>
//                   )}
//                   {invoiceSettings.shipping.showPhone ? (
//                     <p>
//                       <strong>Tel:</strong> {orders[0]?.shipping_address?.phone || "Not Available"}
//                     </p>
//                   ) : (
//                     <></>
//                   )}
//                 </>
//               ) : (
//                 <p>Address not available</p>
//               )}
//             </div>
//           ) : (
//             <></>
//           )}

//           {invoiceSettings.supplier.showSupplier ? (
//             <div style={{ padding: "8px" }}>
//               <h3 style={{ fontSize: "1rem", fontWeight: 600, margin: 0 }}>SUPPLIER</h3>
//               <p>
//                 {invoiceSettings.supplier.showHeading ? (
//                   shopdetails[0]?.name !== null ? (
//                     shopdetails[0]?.name
//                   ) : (
//                     "Shop Name"
//                   )
//                 ) : (
//                   <></>
//                 )}
//               </p>
//               <p>
//                 {invoiceSettings.supplier.showAddress ? (
//                   shopdetails[0]?.address1 !== null ? (
//                     shopdetails[0]?.address1 + ", "
//                   ) : (
//                     "Not Available"
//                   )
//                 ) : (
//                   <></>
//                 )}{" "}
//                 {invoiceSettings.supplier.showCity ? (
//                   shopdetails[0]?.city !== null ? (
//                     shopdetails[0]?.city
//                   ) : (
//                     "Not Available"
//                   )
//                 ) : (
//                   <></>
//                 )}
//               </p>
//               <p>
//                 {invoiceSettings.supplier.showEmail ? (
//                   <>
//                     <strong>Email: </strong>
//                     {shopdetails[0]?.email !== null ? shopdetails[0]?.email : "Not Available"}
//                   </>
//                 ) : (
//                   <></>
//                 )}
//               </p>
//               <p>
//                 {invoiceSettings.supplier.showPhone ? (
//                   <>
//                     <strong>Phone: </strong>
//                     {shopdetails[0]?.phone ? shopdetails[0]?.phone : "Not Available"}
//                   </>
//                 ) : (
//                   <></>
//                 )}
//               </p>

//               <p>
//                 {invoiceSettings.supplier.showGSTIN ? (
//                   <>
//                     <strong>GST: </strong>
//                     {shopProfile?.storeProfile?.gstNumber || "Not Available"}
//                   </>
//                 ) : (
//                   <></>
//                 )}
//               </p>
//             </div>
//           ) : (
//             <></>
//           )}
//         </div>

//         {/* Items Table */}
//         <table
//           style={{
//             width: "100%",
//             borderCollapse: "collapse",
//             marginBottom: "20px",
//             marginTop: "20px",
//           }}
//         >
//           <thead>
//             <tr style={{ backgroundColor: invoiceSettings.branding.primaryColor || "#4a5568", color: "white" }}>
//               {invoiceSettings.lineItems.showVariantTitle ? (
//                 <th
//                   style={{
//                     padding: "10px",
//                     border: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"}`,
//                   }}
//                 >
//                   ITEMS
//                 </th>
//               ) : (
//                 <></>
//               )}
//               {invoiceSettings.lineItems.showQuantity ? (
//                 <th
//                   style={{
//                     padding: "10px",
//                     border: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"}`,
//                   }}
//                 >
//                   QTY
//                 </th>
//               ) : (
//                 <></>
//               )}
//               {invoiceSettings.lineItems.showUnitRate ? (
//                 <th
//                   style={{
//                     padding: "10px",
//                     border: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"}`,
//                   }}
//                 >
//                   RATE
//                 </th>
//               ) : (
//                 <></>
//               )}
//               {invoiceSettings.lineItems.showHSN ? (
//                 <th
//                   style={{
//                     padding: "10px",
//                     border: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"}`,
//                   }}
//                 >
//                   HSN
//                 </th>
//               ) : (
//                 <></>
//               )}
//               {invoiceSettings.lineItems.showTaxAmount ? (
//                 <th
//                   style={{
//                     padding: "10px",
//                     border: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"}`,
//                   }}
//                 >
//                   GST
//                 </th>
//               ) : (
//                 <></>
//               )}
//               {invoiceSettings.lineItems.showTaxAmount ? (
//                 <th
//                   style={{
//                     padding: "10px",
//                     border: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"}`,
//                   }}
//                 >
//                   TAX
//                 </th>
//               ) : (
//                 <></>
//               )}
//               {invoiceSettings.lineItems.showTotalPrice ? (
//                 <th
//                   style={{
//                     padding: "10px",
//                     border: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"}`,
//                   }}
//                 >
//                   AMOUNT
//                 </th>
//               ) : (
//                 <></>
//               )}
//             </tr>
//           </thead>
//           <tbody style={{ textAlign: "center" }}>
//             {orders[0].line_items?.map((item, index) => {
              
//               const matchedGSTItem = GSTHSNCodes.gstcodes
//                 ? GSTHSNCodes.gstcodes.find((gstItem) => Number(gstItem.productId) === item.product_id)
//                 : GSTHSNCodes.find((gstItem) => Number(gstItem.productId) === item.product_id);

//               let taxPrice = 0;
//               let price = 0;
//               let lineAmount = 0;

//               // console.log("GST Item:", matchedGSTItem);
//               // console.log("Item Price:", item.price);
//               // console.log("Item Quantity:", item.quantity);
//               // console.log("Using App Tax:", isShopifyTax.isAppTax);
//               // console.log("Taxes Included:", shopdetails[0].taxes_included);

//               if (!isShopifyTax.isAppTax) {
//                 if (!shopdetails[0].taxes_included) {
//                   taxPrice =  item?.tax_lines ? parseFloat(item?.tax_lines[0]?.price || 0) : 0 ;
//                   price = parseFloat(item.price || 0);
//                   lineAmount = Number(price * item.quantity + taxPrice).toFixed(2);

//                   // console.log("➤ EXCLUSIVE Shopify Tax:");
//                   // console.log("Tax Price:", taxPrice);
//                   // console.log("Unit Price (Excl. Tax):", price);
//                   // console.log("Line Amount:", lineAmount);
//                 } else {
//                   // 🧾 Shopify Tax - Inclusive
//               //     taxPrice = item?.tax_lines?.[0]?.rate ? parseFloat(item.tax_lines[0].rate) || 0 : 0;
//               // price = parseFloat(item.price);
//               // console.log('taxxx', (price * item.quantity * (taxPrice*100) /100))
//               // lineAmount = (price * item.quantity + (price * item.quantity * (taxPrice*100) /100)).toFixed(2);
//               taxPrice =  item?.tax_lines ? parseFloat(item?.tax_lines[0]?.price || 0) : 0 ;
//                   price = parseFloat(item.price || 0);
//                   lineAmount = Number(price * item.quantity + taxPrice).toFixed(2);

//                   // console.log("➤ INCLUSIVE Shopify Tax:");
//                   // console.log("Tax Price:", taxPrice);
//                   // console.log("Unit Price (Incl. Tax):", price);
//                   // console.log("Line Amount:", lineAmount);
//                 }
//               } else {
//                 const gst = matchedGSTItem?.gst ? parseFloat(matchedGSTItem.gst) : 0;

//                 // console.log("App GST %:", gst);

//                 const inclusiveTotal =
//               parseFloat(item?.price || 0) * item.quantity + parseFloat(item?.tax_lines ? parseFloat(item?.tax_lines[0]?.price || 0) : 0) || 0;
//             const baseTotal = inclusiveTotal / (1 + gst / 100);
//                 taxPrice = inclusiveTotal - baseTotal;
//                 price = baseTotal / item.quantity;
//                 lineAmount = inclusiveTotal.toFixed(2);

//                 subTotal = subTotal + Number(price) * item.quantity ;

//                 grandTotal = grandTotal + Number(lineAmount) ;

//                 // console.log("➤ INCLUSIVE App Tax (Accurate):");
//                 // console.log("Base Total:", baseTotal.toFixed(2));
//                 // console.log("Base Unit Price:", price.toFixed(2));
//                 // console.log("Tax Price:", taxPrice.toFixed(2));
//                 // console.log("Line Amount:", lineAmount);
//               }

//               return (
//                 <tr key={item.id}>
//                   {invoiceSettings.lineItems.showVariantTitle ? (
//                     <td
//                       style={{
//                         padding: "10px",
//                         border: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"}`,
//                       }}
//                     >
//                       {item.name}
//                     </td>
//                   ) : (
//                     <></>
//                   )}
//                   {invoiceSettings.lineItems.showQuantity ? (
//                     <td
//                       style={{
//                         padding: "10px",
//                         border: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"}`,
//                         textAlign: "center",
//                       }}
//                     >
//                       {item.quantity || "Not Available"}
//                     </td>
//                   ) : (
//                     <></>
//                   )}

//                   {invoiceSettings.lineItems.showUnitRate ? (
//                     <td
//                       style={{
//                         padding: "10px",
//                         border: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"}`,
//                         textAlign: "center",
//                       }}
//                     >
//                       ₹{price.toFixed(2) || "0"}
//                     </td>
//                   ) : (
//                     <></>
//                   )}

//                   {invoiceSettings.lineItems.showHSN ? (
//                     <td
//                       style={{
//                         padding: "10px",
//                         border: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"}`,
//                       }}
//                     >
//                       {matchedGSTItem?.hsn || "-"}
//                     </td>
//                   ) : (
//                     <></>
//                   )}
//                   {invoiceSettings.lineItems.showTaxAmount ? (
//                     <td
//                       style={{
//                         padding: "10px",
//                         border: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"}`,
//                       }}
//                     >
//                       {!isShopifyTax.isAppTax
//                         // ? ReusableFunctions.calculateTaxRate(item?.price || 0, taxPrice, item.quantity)
//                         ? Number(item?.tax_lines[0]?.rate * 100 || 0)
//                         : matchedGSTItem?.gst || "0"}
//                       %
//                     </td>
//                   ) : (
//                     <></>
//                   )}
//                   {invoiceSettings.lineItems.showTaxAmount ? (
//                     <td
//                       style={{
//                         padding: "10px",
//                         border: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"}`,
//                         textAlign: "center",
//                       }}
//                     >
//                       ₹
//                       {taxPrice
//                         ? Number(parseFloat(taxPrice)).toFixed(2) // Converts to 2 decimal places
//                         : // : item?.tax_lines[0]?.price
//                           // ? parseFloat(item.tax_lines[0].price).toFixed(2)
//                           "0"}
//                       {/* ₹{item?.tax_lines[0]?.price 
//     ? parseFloat(item.tax_lines[0].price).toFixed(2)  // Converts to 2 decimal places
//     : (taxPrice ? parseFloat(taxPrice).toFixed(2) : "0")} */}
//                     </td>
//                   ) : (
//                     <></>
//                   )}
//                   {invoiceSettings.lineItems.showTotalPrice ? (
//                     <td
//                       style={{
//                         padding: "10px",
//                         border: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"}`,
//                         textAlign: "center",
//                       }}
//                     >
//                       ₹{lineAmount || "0"}
//                     </td>
//                   ) : (
//                     <></>
//                   )}
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>

//         <div style={{ display: "flex", justifyContent: "space-between" }}>
//           <div style={{ width: "50%" }}>
//             <h3
//               style={{
//                 backgroundColor: invoiceSettings.branding.primaryColor || "#4a5568",
//                 color: "white",
//                 padding: "5px 10px",
//               }}
//             >
//               OTHER COMMENTS
//             </h3>
//             <ul style={{ paddingLeft: "14px ", paddingTop: "10px" }}>
//               {/* <li>Total payment due in 30 days</li> */}
//               {/* <li>Please include the invoice number on your check</li> */}
//               <li>{invoiceSettings.footer.footerNote}</li>
//             </ul>
//             {invoiceSettings.total.showTotal ? (
//               <div style={{ marginTop: "20px", marginLeft: "10px" }}>
//                 <p style={{ margin: "0", fontWeight: "bold" }}>Total Amount (₹ - In Words):</p>
//                 <p style={{ fontStyle: "italic", color: "#4a5568" }}>
//                   {convertAmountToWords(
//                     grandTotal ||
//                       // orders[0].total_price
//                       0
//                   )}
//                 </p>
//               </div>
//             ) : null}
//             {invoiceSettings.supplier.showHeading ? (
//               <p
//                 style={{
//                   marginTop: "10px",
//                   fontSize: "0.9em",
//                   padding: "10px",
//                   backgroundColor: hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#f7fafc",
//                   // borderRadius: "4px",
//                 }}
//               >
//                 Make all checks payable to:
//                 <br />
//                 <strong>{shopdetails[0].name}</strong>
//               </p>
//             ) : (
//               <></>
//             )}
//           </div>
//           <div style={{ width: "40%" }}>
//             <h3
//               style={{
//                 backgroundColor: invoiceSettings.branding.primaryColor || "#4a5568",
//                 color: "white",
//                 padding: "6px 10px",
//                 marginBottom: "0px",
//               }}
//             >
//               PAYMENT SUMMARY
//             </h3>
//             <table
//               style={{
//                 width: "100%",
//                 borderCollapse: "collapse",
//                 backgroundColor: "#f7fafc",
//                 // borderRadius: "8px",
//                 overflow: "hidden",
//               }}
//             >
//               <tbody>
//                 {invoiceSettings.total.showSubtotal ? (
//                   <tr>
//                     <td
//                       style={{
//                         padding: "10px",
//                         fontWeight: "bold",
//                         backgroundColor: hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#edf2f7",
//                         borderBottom: `1px solid ${
//                           hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"
//                         }`,
//                       }}
//                     >
//                       Subtotal
//                     </td>
//                     <td
//                       style={{
//                         padding: "10px",
//                         textAlign: "right",
//                         borderBottom: `1px solid ${
//                           hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"
//                         }`,
//                       }}
//                     >
//                       ₹{" "}
//                       {subTotal
//                         ? !isShopifyTax.isAppTax ? subTotal.toFixed(2) : subTotal.toFixed(2) 
//                         - Number(orders[0]?.discount_codes[0]?.amount || 0).toFixed(2)
//                         : // :orders[0].subtotal_price !== null
//                           //   ? Number(orders[0].subtotal_price).toFixed(2)
//                           "0"}
//                     </td>
//                   </tr>
//                 ) : null}
//                 {invoiceSettings.total.showDiscount ? (
//                   <tr>
//                     <td
//                       style={{
//                         padding: "10px",
//                         fontWeight: "bold",
//                         backgroundColor: hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#edf2f7",
//                         borderBottom: `1px solid ${
//                           hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"
//                         }`,
//                       }}
//                     >
//                       Discount
//                     </td>
//                     <td
//                       style={{
//                         padding: "10px",
//                         textAlign: "right",
//                         borderBottom: `1px solid ${
//                           hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"
//                         }`,
//                       }}
//                     >
//                       ₹ (
//                       {orders[0]?.discount_codes
//                         ? orders[0]?.discount_codes[0]?.amount
//                           ? Number(orders[0]?.discount_codes[0]?.amount).toFixed(2)
//                           : "0"
//                         : "0"}
//                       )
//                     </td>
//                   </tr>
//                 ) : null}

//                 {invoiceSettings.total.showTax ? (
//                   <tr>
//                     <td
//                       style={{
//                         padding: "10px",
//                         fontWeight: "bold",
//                         backgroundColor: hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#edf2f7",
//                         borderBottom: `1px solid ${
//                           hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"
//                         }`,
//                       }}
//                     >
//                       Total Tax
//                     </td>
//                     <td
//                       style={{
//                         padding: "10px",
//                         textAlign: "right",
//                         borderBottom: `1px solid ${
//                           hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"
//                         }`,
//                       }}
//                     >
//                       ₹{" "}
//                       {/* {orders[0].total_tax !== null
//                                       ? Number(orders[0].total_tax).toFixed(2)
//                                       : "0"} */}
//                       {totalTaxAmount.toFixed(2)}
//                     </td>
//                   </tr>
//                 ) : null}

//                 {invoiceSettings.total.showShipping ? (
//                   <tr>
//                     <td
//                       style={{
//                         padding: "10px",
//                         fontWeight: "bold",
//                         backgroundColor: hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#edf2f7",
//                         borderBottom: `1px solid ${
//                           hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"
//                         }`,
//                       }}
//                     >
//                       Shipping
//                     </td>
//                     <td
//                       style={{
//                         padding: "10px",
//                         textAlign: "right",
//                         borderBottom: `1px solid ${
//                           hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"
//                         }`,
//                       }}
//                     >
//                       ₹{" "}
//                       {/* {orders[0]?.shipping_lines
//                         ? orders[0]?.shipping_lines[0]?.price
//                           ? Number(orders[0]?.shipping_lines[0]?.price || 0).toFixed(2)
//                           : "0"
//                         : "0"} */}
//                         {orders[0]?.shipping_lines
//                       ? Number(orders[0]?.shipping_lines[0]?.price || 0).toFixed(2)
//                       : "0"}
//                     </td>
//                   </tr>
//                 ) : null}
//                 {invoiceSettings.total.showTotal ? (
//                   <tr>
//                     <td
//                       style={{
//                         padding: "10px",
//                         fontWeight: "bold",
//                         backgroundColor: invoiceSettings.branding.primaryColor || "#4a5568",
//                         color: "white",
//                         borderTop: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"}`,
//                       }}
//                     >
//                       TOTAL
//                     </td>
//                     <td
//                       style={{
//                         padding: "10px",
//                         textAlign: "right",
//                         fontWeight: "bold",
//                         backgroundColor: invoiceSettings.branding.primaryColor || "#4a5568",
//                         color: "white",
//                       }}
//                     >
//                       {/* ₹ {orders[0].total_price !== null ? Number(orders[0].total_price).toFixed(2) : "0.00"} */}₹{" "}
//                       {grandTotal
//                       ? !isShopifyTax.isAppTax ? grandTotal.toFixed(2) : Number(grandTotal - (orders[0]?.discount_codes[0]?.amount || 0)  + 
//                       ( Number(orders[0]?.shipping_lines[0]?.price|| 0))).toFixed(2)
//                       // (orders[0]?.shipping_lines[0]?.price ? Number(orders[0]?.shipping_lines[0]?.price|| 0) : 0) ).toFixed(2)
//                       : // :orders[0].total_price !== null
//                         //   ? Number(orders[0].total_price).toFixed(2)
//                         "0"}
//                     </td>
//                   </tr>
//                 ) : null}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         <div
//           style={{
//             display: "flex",
//             justifyContent: "flex-end", // Aligns the content to the right
//             marginTop: orders[0].line_items.length > 3 ? "40px" : "120px",
//             borderBottom: "1px solid #e2e8f0",
//           }}
//         ></div>
//         {/* Footer */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "flex-end",
//           }}
//         >
//           {/* Signature Section */}
//           {invoiceSettings.branding.showSignature ? (
//             <>
//               {shopProfile?.images?.signatureURL && (
//                 <div
//                   style={{
//                     display: "flex",
//                     flexDirection: "column",
//                     alignItems: "center",
//                     justifyContent: "center",
//                   }}
//                 >
//                   <img
//                     src={
//                       shopProfile?.images?.signatureURL ||
//                       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxBsiydbUVBWJUaBP_GVwmkNpZX-eUkOrn1Q&s"
//                     }
//                     alt={""}
//                     style={{
//                       maxWidth: "55px",
//                       maxHeight: "55px",
//                       objectFit: "contain",
//                       borderRadius: "4px",
//                     }}
//                   />
//                   <p
//                     style={{
//                       textAlign: "center",
//                       fontSize: "0.9em",
//                       marginTop: "8px",
//                     }}
//                   >
//                     Authorised Signatory
//                   </p>
//                 </div>
//               )}
//             </>
//           ) : (
//             <></>
//           )}

//           {/* Thank You Note */}
//           <div
//             style={{
//               flex: 1,
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "flex-end",
//             }}
//           >
//             {/* Social Media Icons */}
//             {shopProfile.socialLinks && (
//               <div
//                 style={{
//                   marginBottom: "10px", // Adds some spacing between icons and the note
//                 }}
//               >
//                 <SocialMediaIcons socialLink={shopProfile.socialLinks} invoiceSetting={invoiceSettings} />
//               </div>
//             )}

//             {/* Thank You Note */}
//             <p
//               style={{
//                 fontWeight: "bold",
//                 fontSize: "1.1em",
//                 textAlign: "right", // Ensures the text is aligned to the right
//               }}
//             >
//               {invoiceSettings.footer.thankYouNote || "Thank You For Choosing Us!"}
//             </p>
//           </div>
//         </div>
//         <div style={{ textAlign: "center" }}>
//           <span>Powered by Indian GST Invoice</span>
//         </div>
//       </div>
//     </div>
//   );
// }







import React from "react";
import convertAmountToWords from "../components/ConvertAmount";
import { useState, useEffect } from "react";
import { hexToRgba } from "../components/hex";
import SocialMediaIcons from "../components/GlobalSocialIcons";
import ReusableFunctions from "../components/ReusableFunctions";


export function InvoiceTemplate3({ shopdetails, orders, invoiceSettings, GSTHSNCodes, shopProfile, isShopifyTax }) {
 console.log("isShopifyTax - ", isShopifyTax);
 console.log("orders - InvoiceTemplate3", orders[0]);
 console.log("store - details I3", shopdetails[0]);
 console.log("store - profile I3", shopProfile);
 // console.log("invoiceSettings - InvoiceTemplate3", invoiceSettings);
 // console.log("GSTHSNCodes - InvoiceTemplate3", GSTHSNCodes);


 const [storeDomain, setStoreDomain] = useState(null);
 const [email, setEmail] = useState(null);
 // const [GSTHSNCodes, setGSTHSNCodes] = useState([]);
 const [InvoiceHeading, setInvoiceHeading] = useState("INVOICE");
 const [BillHeading, setBillHeading] = useState("BILL TO");
 const [ShipHeading, setShipHeading] = useState("SHIP To");
 const [shopId, setshopId] = useState("");
 // const [shopProfile, setShopProfile] = useState({});
 const [selectedFont, setSelectedFont] = useState("Roboto, sans-serif");
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
       // console.log("Store Details---!", response.data);
       if (response.data.data.length > 0) {
         // console.log("Store Details---", response.data.data[0]);


         setStoreDomain(response.data.data[0].domain);
         setEmail(response.data.data[0].email);
         setshopId(response.data.data[0].id || "");
       }
     })
     .catch((error) => console.log(error));
 }, []);


 // // Compute total tax across all line items
 const totalTaxAmount = orders[0].line_items?.reduce((acc, item) => {
   const matchedGSTItem = GSTHSNCodes.gstcodes
     ? GSTHSNCodes.gstcodes.find((gstItem) => Number(gstItem.productId) === item.product_id)
     : GSTHSNCodes.find((gstItem) => Number(gstItem.productId) === item.product_id);


   let taxPrice = 0;


   if (!isShopifyTax.isAppTax) {
     taxPrice = item?.tax_lines ? parseFloat(item?.tax_lines[0]?.price || 0) : 0 ;
   } else {
     const gst = matchedGSTItem?.gst ? parseFloat(matchedGSTItem.gst) : 0;
     const inclusiveTotal = parseFloat(item?.price || 0) * item.quantity + parseFloat(item?.tax_lines[0]?.price || 0) || 0;
     const baseTotal = inclusiveTotal / (1 + gst / 100);
     taxPrice = taxPrice + inclusiveTotal - baseTotal;
     // taxPrice = matchedGSTItem?.gst
     //   ? ((parseFloat(item.price) * parseFloat(matchedGSTItem.gst)) / 100) * item.quantity
     //   : 0;
   }


   return acc + taxPrice;
 }, 0); // Convert to 2 decimal places


 let subTotal = 0;
 let grandTotal = 0;


 if (!isShopifyTax.isAppTax) {
   subTotal = Number(orders[0].subtotal_price !== null ? orders[0].subtotal_price : 0) || 0;
   grandTotal =
     subTotal +
     // Number(totalTaxAmount) +
     // (orders[0]?.shipping_lines[0]?.price ? Number(orders[0]?.shipping_lines[0]?.price || 0) : 0);
     ( Number(orders[0]?.shipping_lines[0]?.price || 0));
   }


 useEffect(() => {
   setInvoiceHeading(invoiceSettings.overview.documentTitle || "invoice");
   setBillHeading(invoiceSettings.billing.heading || "Bill To");
   setShipHeading(invoiceSettings.shipping.heading || "Ship To");
   setSelectedFont(invoiceSettings.branding.fontFamily);
   // console.log('invoiceSettings.branding.fontFamily', invoiceSettings.branding.fontFamily);
   // console.log("selectedFont", selectedFont);
 }, [orders, shopdetails, invoiceSettings, selectedFont]);


 return (
   <div
     style={{
       maxWidth: "900px",
       margin: "0 auto",
       padding: "0px",
       fontFamily: selectedFont,
       backgroundColor: "white",
       boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
       border: "1px solid #000",
     }}
   >
     <div style={{ padding: "12px" }}>
       {/* Header Section */}
       <div
         style={{
           display: "grid",
           gridTemplateColumns: "repeat(3, 1fr)",
           borderBottom: "1px solid #d1d5db",
           paddingBottom: "8px",
         }}
       >
         <div style={{ padding: "0px 5px" }}>
           {invoiceSettings.branding.showLogo ? (
             <img
               src={
                 shopProfile?.images?.logoURL ||
                 "https://www.matkaklubi.ee/wp-content/uploads/2016/12/logo-placeholder-generic.200x200.png"
               }
               alt=""
               style={{
                 maxWidth: "35px",
                 maxHeight: "35px",
                 objectFit: "contain",
                 borderRadius: "4px",
               }}
             />
           ) : null}
         </div>
         <div style={{ padding: "8px", textAlign: "center" }}>
           <h1 style={{ fontSize: "1.25rem", fontWeight: "bold", margin: 0 }}>{InvoiceHeading}</h1>
         </div>
       </div>


       {/* Supplier Information Section */}
       {invoiceSettings.supplier.showHeading ? (
         <div style={{ textAlign: "center", padding: "8px" }}>
           <h2
             style={{
               fontSize: "1rem",
               fontWeight: 600,
               marginBottom: "4px",
             }}
           >
             {shopdetails[0]?.name || "Store Invoice"}
           </h2>
         </div>
       ) : null}


       {/* Invoice Information Section */}
       <div
         style={{
           display: "grid",
           gridTemplateColumns: "1fr 1fr",
           borderBottom: "1px solid #d1d5db",
           paddingBottom: "8px",
         }}
       >
         <div style={{ padding: "8px" }}>
           {invoiceSettings.overview.showInvoiceNumber && (
             <p style={{ margin: "4px 0" }}>
               <strong>Invoice No:</strong> {orders[0]?.order_number || "Not Available"}
             </p>
           )}
           {invoiceSettings.overview.issueDate && (
             <p style={{ margin: "4px 0" }}>
               <strong>Invoice Date:</strong> {formatDateTime(orders[0]?.processed_at)}
             </p>
           )}
         </div>
         {invoiceSettings.supplier.showAddress ? (
           <div style={{ padding: "8px" }}>
             <p style={{ margin: "4px 0" }}>
               <strong>Place of Supply:</strong> {shopdetails[0]?.city || "Not Available"},{" "}
               {shopdetails[0]?.province || "Not Available"}
             </p>
             <p style={{ margin: "4px 0" }}>
               <strong>State Code:</strong> {shopdetails[0]?.province_code || "Not Available"}
             </p>
           </div>
         ) : (
           <></>
         )}
       </div>


       {/* Billing and Shipping Section */}
       <div
         style={{
           display: "grid",
           gridTemplateColumns: "repeat(3, 1fr)",
           borderBottom: "1px solid #d1d5db",
           paddingBottom: "8px",
         }}
       >
         {invoiceSettings.billing.showBilling ? (
           <div style={{ padding: "8px" }}>
             {invoiceSettings.billing.showHeading ? (
               <h3 style={{ fontSize: "1rem", fontWeight: 600, margin: 0 }}>{BillHeading.toUpperCase()}</h3>
             ) : (
               <></>
             )}


             {orders[0]?.billing_address ? (
               <>
                 <p>
                   {invoiceSettings.billing.showFullName ? (
                     orders[0]?.billing_address?.name !== null ? (
                       orders[0]?.billing_address?.name
                     ) : (
                       "Not Available"
                     )
                   ) : (
                     <></>
                   )}{" "}
                   {invoiceSettings.billing.showCompany && orders[0]?.billing_address?.company && (
                     <span> ({orders[0].billing_address.company})</span>
                   )}
                 </p>
                 <p>
                   {invoiceSettings.billing.showAddress1 ? (
                     orders[0]?.billing_address?.address1 !== null ? (
                       orders[0]?.billing_address?.address1 + ", "
                     ) : (
                       "Not Available"
                     )
                   ) : (
                     <></>
                   )}
                 </p>
                 <p>
                   {invoiceSettings.billing.showCity ? (
                     orders[0]?.billing_address?.city !== null ? (
                       orders[0]?.billing_address?.city + ", "
                     ) : (
                       ""
                     )
                   ) : (
                     <></>
                   )}
                   {invoiceSettings.billing.showState ? (
                     orders[0]?.billing_address?.province !== null ? (
                       orders[0]?.billing_address?.province + ", "
                     ) : (
                       ""
                     )
                   ) : (
                     <></>
                   )}{" "}
                   Pin:{" "}
                   {invoiceSettings.billing.showZipPinCode ? (
                     orders[0]?.billing_address?.zip !== null ? (
                       orders[0]?.billing_address?.zip + ", "
                     ) : (
                       ""
                     )
                   ) : (
                     <></>
                   )}
                   {invoiceSettings.billing.showCountry ? (
                     orders[0]?.billing_address?.country !== null ? (
                       orders[0]?.billing_address?.country
                     ) : (
                       ""
                     )
                   ) : (
                     <></>
                   )}
                 </p>
                 {invoiceSettings.billing.showEmail ? (
                   <p>
                     <strong>Email:</strong> {orders[0]?.email || "Not Available"}
                   </p>
                 ) : (
                   <></>
                 )}
                 {invoiceSettings.billing.showPhone ? (
                   <p>
                     <strong>Tel:</strong> {orders[0]?.billing_address?.phone || "Not Available"}
                   </p>
                 ) : (
                   <></>
                 )}
               </>
             ) : (
               <p>Address not available</p>
             )}
           </div>
         ) : (
           <></>
         )}
         {invoiceSettings.shipping.showShipping ? (
           <div style={{ padding: "8px" }}>
             {invoiceSettings.shipping.showHeading ? (
               <h3 style={{ fontSize: "1rem", fontWeight: 600, margin: 0 }}>{ShipHeading.toUpperCase()}</h3>
             ) : (
               <></>
             )}
             {orders[0]?.shipping_address ? (
               <>
                 <p>
                   {invoiceSettings.shipping.showFullName ? (
                     orders[0]?.shipping_address?.name !== null ? (
                       orders[0]?.shipping_address?.name
                     ) : (
                       "Not Available"
                     )
                   ) : (
                     <></>
                   )}{" "}
                   {invoiceSettings.shipping.showCompany && orders[0]?.shipping_address?.company && (
                     <span> ({orders[0].shipping_address.company})</span>
                   )}
                 </p>
                 <p>
                   {invoiceSettings.shipping.showAddress1 ? (
                     orders[0]?.shipping_address?.address1 !== null ? (
                       orders[0]?.shipping_address?.address1 + ", "
                     ) : (
                       "Not Available"
                     )
                   ) : (
                     <></>
                   )}
                 </p>
                 <p>
                   {invoiceSettings.shipping.showCity ? (
                     orders[0]?.shipping_address?.city !== null ? (
                       orders[0]?.shipping_address?.city + ", "
                     ) : (
                       ""
                     )
                   ) : (
                     <></>
                   )}
                   {invoiceSettings.shipping.showState ? (
                     orders[0]?.shipping_address?.province !== null ? (
                       orders[0]?.shipping_address?.province + ", "
                     ) : (
                       ""
                     )
                   ) : (
                     <></>
                   )}{" "}
                   Pin:{" "}
                   {invoiceSettings.shipping.showZipPinCode ? (
                     orders[0]?.shipping_address?.zip !== null ? (
                       orders[0]?.shipping_address?.zip + ", "
                     ) : (
                       ""
                     )
                   ) : (
                     <></>
                   )}
                   {invoiceSettings.shipping.showCountry ? (
                     orders[0]?.shipping_address?.country !== null ? (
                       orders[0]?.shipping_address?.country
                     ) : (
                       ""
                     )
                   ) : (
                     <></>
                   )}
                 </p>


                 {invoiceSettings.shipping.showEmail ? (
                   <p>
                     <strong>Email:</strong> {orders[0]?.email || "Not Available"}
                   </p>
                 ) : (
                   <></>
                 )}
                 {invoiceSettings.shipping.showPhone ? (
                   <p>
                     <strong>Tel:</strong> {orders[0]?.shipping_address?.phone || "Not Available"}
                   </p>
                 ) : (
                   <></>
                 )}
               </>
             ) : (
               <p>Address not available</p>
             )}
           </div>
         ) : (
           <></>
         )}


         {invoiceSettings.supplier.showSupplier ? (
           <div style={{ padding: "8px" }}>
             <h3 style={{ fontSize: "1rem", fontWeight: 600, margin: 0 }}>SUPPLIER</h3>
             <p>
               {invoiceSettings.supplier.showHeading ? (
                 shopdetails[0]?.name !== null ? (
                   shopdetails[0]?.name
                 ) : (
                   "Shop Name"
                 )
               ) : (
                 <></>
               )}
             </p>
             <p>
               {invoiceSettings.supplier.showAddress ? (
                 shopdetails[0]?.address1 !== null ? (
                   shopdetails[0]?.address1 + ", "
                 ) : (
                   "Not Available"
                 )
               ) : (
                 <></>
               )}{" "}
               {invoiceSettings.supplier.showCity ? (
                 shopdetails[0]?.city !== null ? (
                   shopdetails[0]?.city
                 ) : (
                   "Not Available"
                 )
               ) : (
                 <></>
               )}
             </p>
             <p>
               {invoiceSettings.supplier.showEmail ? (
                 <>
                   <strong>Email: </strong>
                   {shopdetails[0]?.email !== null ? shopdetails[0]?.email : "Not Available"}
                 </>
               ) : (
                 <></>
               )}
             </p>
             <p>
               {invoiceSettings.supplier.showPhone ? (
                 <>
                   <strong>Phone: </strong>
                   {shopdetails[0]?.phone ? shopdetails[0]?.phone : "Not Available"}
                 </>
               ) : (
                 <></>
               )}
             </p>


             <p>
               {invoiceSettings.supplier.showGSTIN ? (
                 <>
                   <strong>GST: </strong>
                   {shopProfile?.storeProfile?.gstNumber || "Not Available"}
                 </>
               ) : (
                 <></>
               )}
             </p>
           </div>
         ) : (
           <></>
         )}
       </div>


       {/* Items Table */}
       <table
         style={{
           width: "100%",
           borderCollapse: "collapse",
           marginBottom: "20px",
           marginTop: "20px",
         }}
       >
         <thead>
           <tr style={{ backgroundColor: invoiceSettings.branding.primaryColor || "#4a5568", color: "white" }}>
             {invoiceSettings.lineItems.showVariantTitle ? (
               <th
                 style={{
                   padding: "10px",
                   border: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"}`,
                 }}
               >
                 ITEMS
               </th>
             ) : (
               <></>
             )}
             {invoiceSettings.lineItems.showQuantity ? (
               <th
                 style={{
                   padding: "10px",
                   border: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"}`,
                 }}
               >
                 QTY
               </th>
             ) : (
               <></>
             )}
             {invoiceSettings.lineItems.showUnitRate ? (
               <th
                 style={{
                   padding: "10px",
                   border: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"}`,
                 }}
               >
                 RATE
               </th>
             ) : (
               <></>
             )}
             {invoiceSettings.lineItems.showHSN ? (
               <th
                 style={{
                   padding: "10px",
                   border: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"}`,
                 }}
               >
                 HSN
               </th>
             ) : (
               <></>
             )}
             {invoiceSettings.lineItems.showTaxAmount ? (
               <th
                 style={{
                   padding: "10px",
                   border: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"}`,
                 }}
               >
                 GST
               </th>
             ) : (
               <></>
             )}
             {invoiceSettings.lineItems.showTaxAmount ? (
               <th
                 style={{
                   padding: "10px",
                   border: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"}`,
                 }}
               >
                 TAX
               </th>
             ) : (
               <></>
             )}
             {invoiceSettings.lineItems.showTotalPrice ? (
               <th
                 style={{
                   padding: "10px",
                   border: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"}`,
                 }}
               >
                 AMOUNT
               </th>
             ) : (
               <></>
             )}
           </tr>
         </thead>
         <tbody style={{ textAlign: "center" }}>
           {orders[0].line_items?.map((item, index) => {
            
             const matchedGSTItem = GSTHSNCodes.gstcodes
               ? GSTHSNCodes.gstcodes.find((gstItem) => Number(gstItem.productId) === item.product_id)
               : GSTHSNCodes.find((gstItem) => Number(gstItem.productId) === item.product_id);


             let taxPrice = 0;
             let price = 0;
             let lineAmount = 0;


             // console.log("GST Item:", matchedGSTItem);
             // console.log("Item Price:", item.price);
             // console.log("Item Quantity:", item.quantity);
             // console.log("Using App Tax:", isShopifyTax.isAppTax);
             // console.log("Taxes Included:", shopdetails[0].taxes_included);


             if (!isShopifyTax.isAppTax) {
               if (!shopdetails[0].taxes_included) {
                 taxPrice =  item?.tax_lines ? parseFloat(item?.tax_lines[0]?.price || 0) : 0 ;
                 price = parseFloat(item.price || 0);
                 lineAmount = Number(price * item.quantity + taxPrice).toFixed(2);
                 // lineAmount = Number(price * item.quantity ).toFixed(2);


                 // console.log("➤ EXCLUSIVE Shopify Tax:");
                 // console.log("Tax Price:", taxPrice);
                 // console.log("Unit Price (Excl. Tax):", price);
                 // console.log("Line Amount:", lineAmount);
               } else {
             // 🧾 Shopify Tax - Inclusive
             //     taxPrice = item?.tax_lines?.[0]?.rate ? parseFloat(item.tax_lines[0].rate) || 0 : 0;
             // price = parseFloat(item.price);
             // console.log('taxxx', (price * item.quantity * (taxPrice*100) /100))
             // lineAmount = (price * item.quantity + (price * item.quantity * (taxPrice*100) /100)).toFixed(2);
             taxPrice =  item?.tax_lines ? parseFloat(item?.tax_lines[0]?.price || 0) : 0 ;
                 const tempPrice = parseFloat(item.price || 0);
                 console.log('tempPrice', tempPrice);
                 const tempRate = parseFloat(item?.tax_lines ? item?.tax_lines[0]?.rate * 100  : 0 || 0);
                 console.log('tempRate', tempRate);
                 price = tempPrice / (1 + tempRate / 100);
                 lineAmount = Number(price * item.quantity + taxPrice).toFixed(2);
                 // lineAmount = Number(price * item.quantity ).toFixed(2);


                 // console.log("➤ INCLUSIVE Shopify Tax:");
                 // console.log("Tax Price:", taxPrice);
                 // console.log("Unit Price (Incl. Tax):", price);
                 console.log("Line Amount:", lineAmount);
               }
             } else {
               const gst = matchedGSTItem?.gst ? parseFloat(matchedGSTItem.gst) : 0;


               // console.log("App GST %:", gst);


               const inclusiveTotal = parseFloat(item?.price || 0) * item.quantity
               + parseFloat(item?.tax_lines ? parseFloat(item?.tax_lines[0]?.price || 0) : 0) || 0;
              
           const baseTotal = inclusiveTotal / (1 + gst / 100);
               taxPrice = inclusiveTotal - baseTotal;
               price = baseTotal / item.quantity;
               lineAmount = inclusiveTotal.toFixed(2);


               subTotal = subTotal + Number(price) * item.quantity ;


               grandTotal = grandTotal + Number(lineAmount) ;


               // console.log("➤ INCLUSIVE App Tax (Accurate):");
               // console.log("Base Total:", baseTotal.toFixed(2));
               // console.log("Base Unit Price:", price.toFixed(2));
               // console.log("Tax Price:", taxPrice.toFixed(2));
               // console.log("Line Amount:", lineAmount);
             }


             return (
               <tr key={item.id}>
                 {invoiceSettings.lineItems.showVariantTitle ? (
                   <td
                     style={{
                       padding: "10px",
                       border: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"}`,
                     }}
                   >
                     {item.name}
                   </td>
                 ) : (
                   <></>
                 )}
                 {invoiceSettings.lineItems.showQuantity ? (
                   <td
                     style={{
                       padding: "10px",
                       border: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"}`,
                       textAlign: "center",
                     }}
                   >
                     {item.quantity || "Not Available"}
                   </td>
                 ) : (
                   <></>
                 )}


                 {invoiceSettings.lineItems.showUnitRate ? (
                   <td
                     style={{
                       padding: "10px",
                       border: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"}`,
                       textAlign: "center",
                     }}
                   >
                     ₹{price.toFixed(2) || "0"}
                   </td>
                 ) : (
                   <></>
                 )}


                 {invoiceSettings.lineItems.showHSN ? (
                   <td
                     style={{
                       padding: "10px",
                       border: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"}`,
                     }}
                   >
                     {matchedGSTItem?.hsn || "-"}
                   </td>
                 ) : (
                   <></>
                 )}
                 {invoiceSettings.lineItems.showTaxAmount ? (
                   <td
                     style={{
                       padding: "10px",
                       border: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"}`,
                     }}
                   >
                     {!isShopifyTax.isAppTax
                       ? Number(item?.tax_lines[0]?.rate * 100 || 0)
                       : matchedGSTItem?.gst || "0"}
                     %
                   </td>
                 ) : (
                   <></>
                 )}
                 {invoiceSettings.lineItems.showTaxAmount ? (
                   <td
                     style={{
                       padding: "10px",
                       border: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"}`,
                       textAlign: "center",
                     }}
                   >
                     ₹
                     {taxPrice
                       ? Number(parseFloat(taxPrice)).toFixed(2) // Converts to 2 decimal places
                       : // : item?.tax_lines[0]?.price
                         // ? parseFloat(item.tax_lines[0].price).toFixed(2)
                         "0"}
                     {/* ₹{item?.tax_lines[0]?.price
   ? parseFloat(item.tax_lines[0].price).toFixed(2)  // Converts to 2 decimal places
   : (taxPrice ? parseFloat(taxPrice).toFixed(2) : "0")} */}
                   </td>
                 ) : (
                   <></>
                 )}
                 {invoiceSettings.lineItems.showTotalPrice ? (
                   <td
                     style={{
                       padding: "10px",
                       border: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"}`,
                       textAlign: "center",
                     }}
                   >
                     ₹{lineAmount || "0"}
                   </td>
                 ) : (
                   <></>
                 )}
               </tr>
             );
           })}
         </tbody>
       </table>


       <div style={{ display: "flex", justifyContent: "space-between" }}>
         <div style={{ width: "50%" }}>
           <h3
             style={{
               backgroundColor: invoiceSettings.branding.primaryColor || "#4a5568",
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
           {invoiceSettings.total.showTotal ? (
             <div style={{ marginTop: "20px", marginLeft: "10px" }}>
               <p style={{ margin: "0", fontWeight: "bold" }}>Total Amount (₹ - In Words):</p>
               <p style={{ fontStyle: "italic", color: "#4a5568" }}>
                 {convertAmountToWords(
                   grandTotal ||
                     // orders[0].total_price
                     0
                 )}
               </p>
             </div>
           ) : null}
           {invoiceSettings.supplier.showHeading ? (
             <p
               style={{
                 marginTop: "10px",
                 fontSize: "0.9em",
                 padding: "10px",
                 backgroundColor: hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#f7fafc",
                 // borderRadius: "4px",
               }}
             >
               Make all checks payable to:
               <br />
               <strong>{shopdetails[0].name}</strong>
             </p>
           ) : (
             <></>
           )}
         </div>
         <div style={{ width: "40%" }}>
           <h3
             style={{
               backgroundColor: invoiceSettings.branding.primaryColor || "#4a5568",
               color: "white",
               padding: "6px 10px",
               marginBottom: "0px",
             }}
           >
             PAYMENT SUMMARY
           </h3>
           <table
             style={{
               width: "100%",
               borderCollapse: "collapse",
               backgroundColor: "#f7fafc",
               // borderRadius: "8px",
               overflow: "hidden",
             }}
           >
             <tbody>
               {invoiceSettings.total.showSubtotal ? (
                 <tr>
                   <td
                     style={{
                       padding: "10px",
                       fontWeight: "bold",
                       backgroundColor: hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#edf2f7",
                       borderBottom: `1px solid ${
                         hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"
                       }`,
                     }}
                   >
                     Subtotal
                   </td>
                   <td
                     style={{
                       padding: "10px",
                       textAlign: "right",
                       borderBottom: `1px solid ${
                         hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"
                       }`,
                     }}
                   >
                     ₹{" "}
                     {subTotal
                       ? !isShopifyTax.isAppTax ? subTotal.toFixed(2) : subTotal.toFixed(2)
                       - Number(orders[0]?.discount_codes[0]?.amount || 0).toFixed(2)
                       : // :orders[0].subtotal_price !== null
                         //   ? Number(orders[0].subtotal_price).toFixed(2)
                         "0"}
                   </td>
                 </tr>
               ) : null}
               {invoiceSettings.total.showDiscount ? (
                 <tr>
                   <td
                     style={{
                       padding: "10px",
                       fontWeight: "bold",
                       backgroundColor: hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#edf2f7",
                       borderBottom: `1px solid ${
                         hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"
                       }`,
                     }}
                   >
                     Discount
                   </td>
                   <td
                     style={{
                       padding: "10px",
                       textAlign: "right",
                       borderBottom: `1px solid ${
                         hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"
                       }`,
                     }}
                   >
                     ₹ (
                     {orders[0]?.discount_codes
                       ? orders[0]?.discount_codes[0]?.amount
                         ? Number(orders[0]?.discount_codes[0]?.amount).toFixed(2)
                         : "0"
                       : "0"}
                     )
                   </td>
                 </tr>
               ) : null}


               {invoiceSettings.total.showTax ? (
                 <tr>
                   <td
                     style={{
                       padding: "10px",
                       fontWeight: "bold",
                       backgroundColor: hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#edf2f7",
                       borderBottom: `1px solid ${
                         hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"
                       }`,
                     }}
                   >
                     Total Tax
                   </td>
                   <td
                     style={{
                       padding: "10px",
                       textAlign: "right",
                       borderBottom: `1px solid ${
                         hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"
                       }`,
                     }}
                   >
                     ₹{" "}
                     {/* {orders[0].total_tax !== null
                                     ? Number(orders[0].total_tax).toFixed(2)
                                     : "0"} */}
                     {totalTaxAmount.toFixed(2)}
                   </td>
                 </tr>
               ) : null}


               {invoiceSettings.total.showShipping ? (
                 <tr>
                   <td
                     style={{
                       padding: "10px",
                       fontWeight: "bold",
                       backgroundColor: hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#edf2f7",
                       borderBottom: `1px solid ${
                         hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"
                       }`,
                     }}
                   >
                     Shipping
                   </td>
                   <td
                     style={{
                       padding: "10px",
                       textAlign: "right",
                       borderBottom: `1px solid ${
                         hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"
                       }`,
                     }}
                   >
                     ₹{" "}
                     {/* {orders[0]?.shipping_lines
                       ? orders[0]?.shipping_lines[0]?.price
                         ? Number(orders[0]?.shipping_lines[0]?.price || 0).toFixed(2)
                         : "0"
                       : "0"} */}
                       {orders[0]?.shipping_lines
                     ? Number(orders[0]?.shipping_lines[0]?.price || 0).toFixed(2)
                     : "0"}
                   </td>
                 </tr>
               ) : null}
               {invoiceSettings.total.showTotal ? (
                 <tr>
                   <td
                     style={{
                       padding: "10px",
                       fontWeight: "bold",
                       backgroundColor: invoiceSettings.branding.primaryColor || "#4a5568",
                       color: "white",
                       borderTop: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"}`,
                     }}
                   >
                     TOTAL
                   </td>
                   <td
                     style={{
                       padding: "10px",
                       textAlign: "right",
                       fontWeight: "bold",
                       backgroundColor: invoiceSettings.branding.primaryColor || "#4a5568",
                       color: "white",
                     }}
                   >
                     {/* ₹ {orders[0].total_price !== null ? Number(orders[0].total_price).toFixed(2) : "0.00"} */}₹{" "}
                     {grandTotal
                     ? !isShopifyTax.isAppTax ? grandTotal.toFixed(2) : Number(grandTotal - (orders[0]?.discount_codes[0]?.amount || 0)  +
                     ( Number(orders[0]?.shipping_lines[0]?.price|| 0))).toFixed(2)
                     // (orders[0]?.shipping_lines[0]?.price ? Number(orders[0]?.shipping_lines[0]?.price|| 0) : 0) ).toFixed(2)
                     : // :orders[0].total_price !== null
                       //   ? Number(orders[0].total_price).toFixed(2)
                       "0"}
                   </td>
                 </tr>
               ) : null}
             </tbody>
           </table>
         </div>
       </div>


       <div
         style={{
           display: "flex",
           justifyContent: "flex-end", // Aligns the content to the right
           marginTop: orders[0].line_items.length > 3 ? "40px" : "120px",
           borderBottom: "1px solid #e2e8f0",
         }}
       ></div>
       {/* Footer */}
       <div
         style={{
           display: "flex",
           justifyContent: "space-between",
           alignItems: "flex-end",
         }}
       >
         {/* Signature Section */}
         {invoiceSettings.branding.showSignature ? (
           <>
             {shopProfile?.images?.signatureURL && (
               <div
                 style={{
                   display: "flex",
                   flexDirection: "column",
                   alignItems: "center",
                   justifyContent: "center",
                 }}
               >
                 <img
                   src={
                     shopProfile?.images?.signatureURL ||
                     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxBsiydbUVBWJUaBP_GVwmkNpZX-eUkOrn1Q&s"
                   }
                   alt={""}
                   style={{
                     maxWidth: "55px",
                     maxHeight: "55px",
                     objectFit: "contain",
                     borderRadius: "4px",
                   }}
                 />
                 <p
                   style={{
                     textAlign: "center",
                     fontSize: "0.9em",
                     marginTop: "8px",
                   }}
                 >
                   Authorised Signatory
                 </p>
               </div>
             )}
           </>
         ) : (
           <></>
         )}


         {/* Thank You Note */}
         <div
           style={{
             flex: 1,
             display: "flex",
             flexDirection: "column",
             alignItems: "flex-end",
           }}
         >
           {/* Social Media Icons */}
           {shopProfile.socialLinks && (
             <div
               style={{
                 marginBottom: "10px", // Adds some spacing between icons and the note
               }}
             >
               <SocialMediaIcons socialLink={shopProfile.socialLinks} invoiceSetting={invoiceSettings} />
             </div>
           )}


           {/* Thank You Note */}
           <p
             style={{
               fontWeight: "bold",
               fontSize: "1.1em",
               textAlign: "right", // Ensures the text is aligned to the right
             }}
           >
             {invoiceSettings.footer.thankYouNote || "Thank You For Choosing Us!"}
           </p>
         </div>
       </div>
       <div style={{ textAlign: "center" }}>
         <span>Powered by Indian GST Invoice</span>
       </div>
     </div>
   </div>
 );
}



