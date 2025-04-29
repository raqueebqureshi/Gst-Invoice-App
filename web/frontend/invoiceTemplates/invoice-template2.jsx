import convertAmountToWords from "../components/ConvertAmount";
import React from "react";
import { useState, useEffect } from "react";
import SocialMediaIcons from "../components/GlobalSocialIcons";
import { hexToRgba } from "../components/hex";
import ReusableFunctions from "../components/ReusableFunctions";


export function InvoiceTemplate2({ shopdetails, orders, invoiceSettings, GSTHSNCodes, shopProfile, isShopifyTax}) {
  // console.log("orders - InvoiceTemplate2", orders[0]);
  // console.log("store - details I2", shopdetails[0]);
  // console.log("invoiceSettings - InvoiceTemplate2", invoiceSettings);
  // console.log("GSTHSNCodes - InvoiceTemplate2", GSTHSNCodes);
  // console.log("shopProfile", shopProfile);

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
    subTotal = Number(orders[0].subtotal_price !== null ? orders[0].subtotal_price : 0)|| 0;
    grandTotal =
      subTotal +
      Number(totalTaxAmount) +
      // (orders[0]?.shipping_lines[0]?.price ? Number(orders[0]?.shipping_lines[0]?.price || 0) : 0);
      ( Number(orders[0]?.shipping_lines[0]?.price || 0));
    }

  useEffect(() => {
    setInvoiceHeading(invoiceSettings.overview.documentTitle || "invoice");
    setBillHeading(invoiceSettings.billing.heading || "Bill To");
    setShipHeading(invoiceSettings.shipping.heading || "Ship To");
    setSelectedFont(invoiceSettings.branding.fontFamily);
    // console.log("invoiceSettings.branding.fontFamily", invoiceSettings.branding.fontFamily);
    // console.log("selectedFont", selectedFont);
  }, [orders, shopdetails, invoiceSettings, selectedFont]);

  return (
    <div
      style={{
        fontFamily: selectedFont,
        maxWidth: "900px",
        margin: "0 auto",
        padding: `20px`,
        border: "1px solid #ccc",
        backgroundColor: "#fff",
      }}
    >
      <div
        style={{
          backgroundColor: invoiceSettings.branding.primaryColor,
          color: "white",
          padding: "5px 10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {invoiceSettings.branding.showLogo ? (
            <img
              src={
                shopProfile?.images?.logoURL ||
                "https://www.matkaklubi.ee/wp-content/uploads/2016/12/logo-placeholder-generic.200x200.png"
              }
              alt={""}
              style={{
                maxWidth: "35px",
                maxHeight: "35px",
                objectFit: "contain",
                borderRadius: "4px",
              }}
            />
          ) : (
            <></>
          )}
          <h1 style={{ margin: 0, fontSize: "24px" }}>{InvoiceHeading}</h1>
        </div>
        <div>
          {invoiceSettings.overview.showInvoiceNumber ? (
            <p style={{ margin: 0 }}>INVOICE NO : {orders[0]?.name}</p>
          ) : (
            <></>
          )}
          {invoiceSettings.overview.issueDate ? (
            <p style={{ margin: 0 }}>DATE : {formatDateTime(orders[0]?.created_at)}</p>
          ) : (
            <></>
          )}
        </div>
      </div>
      {invoiceSettings.supplier.showSupplier ? (
        <div style={{ marginTop: "20px", visibility: invoiceSettings.supplier.showSupplier ? "visible" : "hidden" }}>
          <h2 style={{ margin: 0, fontSize: "20px" }}>
            {invoiceSettings.supplier.showHeading ? (
              shopdetails[0]?.name !== null ? (
                shopdetails[0]?.name
              ) : (
                "Not Available"
              )
            ) : (
              <></>
            )}
          </h2>
          <p style={{ margin: "5px 0" }}>
            {invoiceSettings.supplier.showAddress ? (
              shopdetails[0]?.address1 !== null ? (
                shopdetails[0]?.address1 + ", "
              ) : (
                "Not Available"
              )
            ) : (
              <></>
            )}
            {invoiceSettings.supplier.showCity ? (
              shopdetails[0]?.city !== null ? (
                shopdetails[0]?.city + " "
              ) : (
                "Not Available"
              )
            ) : (
              <></>
            )}

            {/* {shopdetails[0].state !== null ? shopdetails[0].state : "Not Available"} */}
            {invoiceSettings.supplier.showZipPinCode ? (
              shopdetails[0]?.zip !== null ? (
                shopdetails[0]?.zip + ", "
              ) : (
                "Not Available"
              )
            ) : (
              <></>
            )}
          </p>
          {/* <p style={{ margin: '5px 0' }}>GSTIN: AAA21345</p> */}
          <p style={{ margin: "5px 0" }}>
            {invoiceSettings.supplier.showPhone ? (
              <>
                Phone:
                {shopdetails[0]?.phone ? " " + shopdetails[0]?.phone : " Not Available"}
              </>
            ) : (
              <></>
            )}
          </p>
          <p style={{ margin: "5px 0" }}>
            {invoiceSettings.supplier.showEmail ? (
              <>Email ID: {shopdetails[0]?.email !== null ? shopdetails[0]?.email : "Not Available"}</>
            ) : (
              <></>
            )}
          </p>
          <p style={{ margin: "0px 0" }}>
            {invoiceSettings.supplier.showGSTIN ? (
              <>GSTIN: {shopProfile?.storeProfile?.gstNumber || "Not Available"}</>
            ) : (
              <></>
            )}
          </p>
          {/* <p style={{ margin: '5px 0' }}>PAN NO: AAA123456</p> */}
        </div>
      ) : (
        <></>
      )}

      <div style={{ height: "0px" }}></div>

      <div
        style={{
          display: "flex",
          marginTop: "20px",
          border: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.2) || "#000"}`,
        }}
      >
        <div
          style={{
            flex: 1,
            padding: "10px",
            backgroundColor: hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e6f2ff",
          }}
        >
          {invoiceSettings.billing.showBilling ? (
            <h3
              style={{
                margin: 0,
                fontSize: "16px",
                visibility: invoiceSettings.billing.showHeading ? "visible" : "hidden",
              }}
            >
              {BillHeading.toUpperCase()}
            </h3>
          ) : (
            <></>
          )}
          {orders[0].billing_address !== null ? (
            <>
              <p style={{ margin: "5px 0" }}>
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
              {invoiceSettings.billing.showAddress1 ? (
                <p style={{ margin: "5px 0" }}>
                  ADDRESS:
                  {orders[0]?.billing_address?.address1 !== null
                    ? orders[0]?.billing_address?.address1 + ", "
                    : "Not Available"}
                </p>
              ) : (
                <></>
              )}
              <p style={{ margin: "5px 0" }}>
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
                )}
                {invoiceSettings.billing.showZipPinCode ? (
                  orders[0]?.billing_address?.zip !== null ? (
                    orders[0]?.billing_address?.zip
                  ) : (
                    ""
                  )
                ) : (
                  <></>
                )}
                <br />
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
                <p style={{ margin: "5px 0" }}>
                  Email ID: {orders[0]?.email !== null ? orders[0]?.email : "Not Available"}
                </p>
              ) : (
                <></>
              )}
              {invoiceSettings.billing.showPhone ? (
                <p style={{ margin: "5px 0" }}>
                  PH: {orders[0]?.billing_address?.phone !== null ? orders[0]?.billing_address?.phone : "Not Available"}
                </p>
              ) : (
                <></>
              )}
            </>
          ) : (
            <>
              <p style={{ margin: "5px 0" }}>Address not available</p>
            </>
          )}

          {/* <p style={{ margin: '5px 0' }}>GSTIN: 07AAFCD5862R1Z8</p> */}
        </div>
        <div
          style={{
            flex: 1,
            padding: "10px",
            backgroundColor: hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e6f2ff",
          }}
        >
          {invoiceSettings.shipping.showShipping ? (
            <h3
              style={{
                margin: 0,
                fontSize: "16px",
                visibility: invoiceSettings.shipping.showHeading ? "visible" : "hidden",
              }}
            >
              {ShipHeading.toUpperCase()}
            </h3>
          ) : (
            <></>
          )}
          {invoiceSettings.shipping.showShipping ? (
            orders[0]?.shipping_address !== null ? (
              <>
                <p style={{ margin: "5px 0" }}>
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
                <p style={{ margin: "5px 0" }}>
                  {invoiceSettings.shipping.showAddress1 ? (
                    <>
                      ADDRESS:{" "}
                      {orders[0]?.shipping_address?.address1 !== null
                        ? orders[0]?.shipping_address?.address1
                        : "Not Available"}
                      ,
                    </>
                  ) : (
                    <></>
                  )}
                </p>
                <p style={{ margin: "5px 0" }}>
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
                  )}
                  {invoiceSettings.shipping.showZipPinCode ? (
                    orders[0]?.shipping_address?.zip !== null ? (
                      orders[0]?.shipping_address?.zip
                    ) : (
                      ""
                    )
                  ) : (
                    <></>
                  )}
                  <br />
                  {invoiceSettings.shipping.showCountry ? (
                    orders[0]?.shipping_address?.country !== null ? (
                      orders[0]?.shipping_address?.country + " "
                    ) : (
                      ""
                    )
                  ) : (
                    <></>
                  )}
                </p>
                {invoiceSettings.shipping.showEmail ? (
                  <p style={{ margin: "5px 0" }}>
                    Email ID: {orders[0]?.email !== null ? orders[0]?.email : "Not Available"}
                  </p>
                ) : (
                  <></>
                )}
                {invoiceSettings.shipping.showPhone ? (
                  <p style={{ margin: "5px 0" }}>
                    PH:{" "}
                    {orders[0]?.shipping_address?.phone !== null ? orders[0]?.shipping_address?.phone : "Not Available"}
                  </p>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <>
                <p style={{ margin: "5px 0" }}>Address not available</p>
              </>
            )
          ) : (
            <></>
          )}

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
          <tr
            style={{
              backgroundColor: hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e6f2ff",
              border: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.2) || "#000"}`,
            }}
          >
            {invoiceSettings.lineItems.showVariantTitle ? (
              <th
                style={{
                  padding: "10px",
                  border: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.2) || "#e2e8f0"}`,
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
                  border: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.2) || "#e2e8f0"}`,
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
                  border: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.2) || "#e2e8f0"}`,
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
                  border: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.2) || "#e2e8f0"}`,
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
                  border: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.2) || "#e2e8f0"}`,
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
                  border: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.2) || "#e2e8f0"}`,
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
                  border: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.2) || "#e2e8f0"}`,
                }}
              >
                AMOUNT
              </th>
            ) : (
              <></>
            )}
          </tr>
        </thead>

        {/* <td style={{ border: '1px solid #000', padding: '8px' }}></td>
            {/* <td style={{ border: '1px solid #000', padding: '8px' }}></td> */}
        {/* <td style={{ border: '1px solid #000', padding: '8px' }}></td> */}
        {/* <td style={{ border: '1px solid #000', padding: '8px' }}></td> */}
        {/* <td style={{ border: '1px solid #000', padding: '8px' }}></td> */}

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
              price = parseFloat(item?.price || 0);
              lineAmount = Number(price * item.quantity + taxPrice).toFixed(2);

              // console.log("➤ EXCLUSIVE Shopify Tax:");
              // console.log("Tax Price:", taxPrice);
              // console.log("Unit Price (Excl. Tax):", price);
              // console.log("Line Amount:", lineAmount);
            } else {
              // 🧾 Shopify Tax - Inclusive
              taxPrice =  item?.tax_lines ? parseFloat(item?.tax_lines[0]?.price || 0) : 0 ;
              price = parseFloat(item?.price || 0);
              lineAmount = Number(price * item.quantity + taxPrice).toFixed(2);

              // console.log("➤ INCLUSIVE Shopify Tax:");
              // console.log("Tax Price:", taxPrice);
              // console.log("Unit Price (Incl. Tax):", price);
              // console.log("Line Amount:", lineAmount);
            }
          } else {
            const gst = matchedGSTItem?.gst ? parseFloat(matchedGSTItem.gst) : 0;

            // console.log("App GST %:", gst);

            const inclusiveTotal =
            parseFloat(item?.price || 0) * item.quantity + parseFloat(item?.tax_lines ? parseFloat(item?.tax_lines[0]?.price || 0) : 0) || 0;
            const baseTotal = inclusiveTotal / (1 + gst / 100);
            taxPrice = inclusiveTotal - baseTotal;
            price = baseTotal / item.quantity;
            lineAmount = inclusiveTotal.toFixed(2);

            subTotal = subTotal + Number(price) * item.quantity;

            grandTotal = grandTotal + Number(lineAmount);

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
                     {!isShopifyTax
                    //  ? ReusableFunctions.calculateTaxRate(item?.price || 0, taxPrice, item.quantity) 
                    ? Number(item?.tax_lines[0]?.rate * 100 || 0)
                     : matchedGSTItem?.gst || "0"}%
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

      <div
        style={{
          display: "flex",
          marginTop: "20px",
        }}
      >
        <div
          style={{
            flex: 1,
            backgroundColor: hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e6f2ff",
            padding: "10px",
          }}
        >
          <h3 style={{ margin: 0, fontSize: "16px" }}>Terms & conditions</h3>
          <ul style={{ paddingLeft: "10px", margin: "10px 0" }}>
            <li>{invoiceSettings.footer.footerNote}</li>
            {/* <li>Term 2</li>
            <li>Term 3</li>
            <li>Term 4</li>
            <li>Term 5</li> */}
          </ul>
          {invoiceSettings.total.showTotal ? (
            <div style={{ marginTop: "20px", marginLeft: "0px" }}>
              <p style={{ margin: "0", fontWeight: "bold" }}>Total Amount (₹ - In Words):</p>
              <p style={{ fontStyle: "italic", color: "#4a5568", marginLeft: "10px" }}>
                {convertAmountToWords(grandTotal || 0)}
              </p>
            </div>
          ) : null}
        </div>
        <div style={{ flex: 1 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "0px" }}>
            <thead>
              <tr>
                <th
                  colSpan="2"
                  style={{
                    backgroundColor: invoiceSettings.branding.primaryColor || "#4a5568",
                    color: "white",
                    padding: "10px",
                    textAlign: "left",
                    fontSize: "1.2em",
                    // borderRadius: "8px 8px 0 0",
                  }}
                >
                  Payment Summary
                </th>
              </tr>
            </thead>
            <tbody>
              {invoiceSettings.total.showSubtotal ? (
                <tr>
                  <td
                    style={{
                      padding: "10px",
                      fontWeight: "bold",
                      backgroundColor: hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#edf2f7",
                      borderBottom: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"}`,
                    }}
                  >
                    Subtotal
                  </td>
                  <td
                    style={{
                      padding: "10px",
                      textAlign: "right",
                      borderBottom: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"}`,
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
                      borderBottom: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"}`,
                    }}
                  >
                    Discount
                  </td>
                  <td
                    style={{
                      padding: "10px",
                      textAlign: "right",
                      borderBottom: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"}`,
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
                      borderBottom: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"}`,
                    }}
                  >
                    Total Tax
                  </td>
                  <td
                    style={{
                      padding: "10px",
                      textAlign: "right",
                      borderBottom: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"}`,
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
                      borderBottom: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"}`,
                    }}
                  >
                    Shipping
                  </td>
                  <td
                    style={{
                      padding: "10px",
                      textAlign: "right",
                      borderBottom: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.07) || "#e2e8f0"}`,
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

      <div style={{ height: "40px" }}></div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "40px",
          borderTop: "1px solid #e2e8f0",
        }}
      >
        <div>
          {/* <p>For : {shopdetails[0].name !== null ? shopdetails[0].name : "Not Available"}</p> */}
          <p style={{ textAlign: "left", marginTop: "20px", fontSize: "0.9em" }}>
            If you have any questions about this invoice, please contact
            <br />
            {invoiceSettings.supplier.showPhone ? (
              <>Phone: {shopdetails[0].phone !== null ? shopdetails[0].phone : "Not Available"} </>
            ) : (
              <></>
            )}{" "}
            <br />
            {invoiceSettings.supplier.showEmail ? (
              <>E-mail: {shopdetails[0].email !== null ? shopdetails[0].email : "Not Available"}</>
            ) : (
              <></>
            )}
          </p>
          <p style={{ textAlign: "left", fontWeight: "bold" }}>
            {invoiceSettings.footer.thankYouNote || "Thank You For Choosing Us!"}
          </p>
        </div>
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
                    // marginTop: "px",
                    fontSize: "0.9em",
                  }}
                >
                  Authorised Signatory
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            {/* <div
              style={{
                display: "flex",
                justifyContent: "flex-end", // Aligns the content to the right
                marginTop: "0px",
              }}
            ></div> */}
          </>
        )}
      </div>

      <div>
        {shopProfile.socialLinks && (
          <SocialMediaIcons socialLink={shopProfile.socialLinks} invoiceSetting={invoiceSettings} />
        )}
        {/* <SocialMediaIcons socialLink={shopProfile.socialLinks} invoiceSetting={invoiceSettings} /> */}
      </div>
      <div style={{ textAlign: "right" }}>
        <span>Powered by Indian GST Invoice</span>
      </div>
    </div>
  );
}
