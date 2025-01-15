import React from "react";
import convertAmountToWords from "../components/ConvertAmount";
import { useState, useEffect } from "react";
import { hexToRgba } from "../components/hex";
import SocialMediaIcons from "../components/GlobalSocialIcons";


export function InvoiceTemplate3({ shopdetails, orders, invoiceSettings, GSTHSNCodes }) {
  console.log("orders - InvoiceTemplate3", orders[0]);
  console.log("store - details I3", shopdetails[0]);
  console.log("invoiceSettings - InvoiceTemplate3", invoiceSettings);
  console.log("GSTHSNCodes - InvoiceTemplate3", GSTHSNCodes);

  const [storeDomain, setStoreDomain] = useState(null);
  const [email, setEmail] = useState(null);
  // const [GSTHSNCodes, setGSTHSNCodes] = useState([]);
  const [InvoiceHeading, setInvoiceHeading] = useState("");
  const [BillHeading, setBillHeading] = useState("");
  const [ShipHeading, setShipHeading] = useState("");
  const [shopId, setshopId] = useState("");
  const [shopProfile, setShopProfile] = useState({});
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
          setshopId(response.data.data[0].id || "");
        }
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    fetch(`/api/fetch-store-profile?shopId=${shopId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.profile) {
          const profileData = data.profile;
          // console.log("profileData", profileData);
          setShopProfile(profileData || {});
        }
      })
      .catch((error) => {
        console.error("Error fetching store profile:", error);
      });
  }, [shopId]);

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
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "0px",
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
              {shopdetails[0].name || "Store Invoice"}
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
                <strong>Invoice No:</strong> {orders[0].order_number || "N/A"}
              </p>
            )}
            {invoiceSettings.overview.issueDate && (
              <p style={{ margin: "4px 0" }}>
                <strong>Invoice Date:</strong> {formatDateTime(orders[0].processed_at)}
              </p>
            )}
          </div>
          {invoiceSettings.supplier.showAddress ? (
            <div style={{ padding: "8px" }}>
              <p style={{ margin: "4px 0" }}>
                <strong>Place of Supply:</strong> {shopdetails[0].city || "N/A"}, {shopdetails[0].province || "N/A"}
              </p>
              <p style={{ margin: "4px 0" }}>
                <strong>State Code:</strong> {shopdetails[0].province_code || "N/A"}
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

              {orders[0].billing_address ? (
                <>
                  <p>
                    {invoiceSettings.billing.showFullName ? (
                      orders[0].billing_address.name !== null ? (
                        orders[0].billing_address.name
                      ) : (
                        "N/A"
                      )
                    ) : (
                      <></>
                    )}{" "}
                    {invoiceSettings.billing.showCompany ? (
                      `(${orders[0].billing_address.company !== null ? orders[0].billing_address.company : "N/A"})`
                    ) : (
                      <></>
                    )}
                  </p>
                  <p>
                    {invoiceSettings.billing.showAddress1 ? (
                      orders[0].billing_address.address1 !== null ? (
                        orders[0].billing_address.address1 + ", "
                      ) : (
                        "N/A"
                      )
                    ) : (
                      <></>
                    )}
                  </p>
                  <p>
                    {invoiceSettings.billing.showCity ? (
                      orders[0].billing_address.city !== null ? (
                        orders[0].billing_address.city + ", "
                      ) : (
                        ""
                      )
                    ) : (
                      <></>
                    )}
                    {invoiceSettings.billing.showState ? (
                      orders[0].billing_address.province !== null ? (
                        orders[0].billing_address.province + ", "
                      ) : (
                        ""
                      )
                    ) : (
                      <></>
                    )}{" "}
                    Pin:{" "}
                    {invoiceSettings.billing.showZipPinCode ? (
                      orders[0].billing_address.zip !== null ? (
                        orders[0].billing_address.zip + ", "
                      ) : (
                        ""
                      )
                    ) : (
                      <></>
                    )}
                    {invoiceSettings.billing.showCountry ? (
                      orders[0].billing_address.country !== null ? (
                        orders[0].billing_address.country
                      ) : (
                        ""
                      )
                    ) : (
                      <></>
                    )}
                  </p>
                  {invoiceSettings.billing.showEmail ? (
                    <p>
                      <strong>Email:</strong> {orders[0].email || "N/A"}
                    </p>
                  ) : (
                    <></>
                  )}
                  {invoiceSettings.billing.showPhone ? (
                    <p>
                      <strong>Tel:</strong> {orders[0].billing_address.phone || "N/A"}
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
              {orders[0].shipping_address ? (
                <>
                  <p>
                    {invoiceSettings.shipping.showFullName ? (
                      orders[0].shipping_address.name !== null ? (
                        orders[0].shipping_address.name
                      ) : (
                        "N/A"
                      )
                    ) : (
                      <></>
                    )}{" "}
                    {invoiceSettings.shipping.showCompany ? (
                      `(${orders[0].shipping_address.company !== null ? orders[0].shipping_address.company : "N/A"})`
                    ) : (
                      <></>
                    )}
                  </p>
                  <p>
                    {invoiceSettings.shipping.showAddress1 ? (
                      orders[0].shipping_address.address1 !== null ? (
                        orders[0].shipping_address.address1 + ", "
                      ) : (
                        "N/A"
                      )
                    ) : (
                      <></>
                    )}
                  </p>
                  <p>
                    {invoiceSettings.shipping.showCity ? (
                      orders[0].shipping_address.city !== null ? (
                        orders[0].shipping_address.city + ", "
                      ) : (
                        ""
                      )
                    ) : (
                      <></>
                    )}
                    {invoiceSettings.shipping.showState ? (
                      orders[0].shipping_address.province !== null ? (
                        orders[0].shipping_address.province + ", "
                      ) : (
                        ""
                      )
                    ) : (
                      <></>
                    )}{" "}
                    Pin:{" "}
                    {invoiceSettings.shipping.showZipPinCode ? (
                      orders[0].shipping_address.zip !== null ? (
                        orders[0].shipping_address.zip + ", "
                      ) : (
                        ""
                      )
                    ) : (
                      <></>
                    )}
                    {invoiceSettings.shipping.showCountry ? (
                      orders[0].shipping_address.country !== null ? (
                        orders[0].shipping_address.country
                      ) : (
                        ""
                      )
                    ) : (
                      <></>
                    )}
                  </p>

                  {invoiceSettings.shipping.showEmail ? (
                    <p>
                      <strong>Email:</strong> {orders[0].email || "N/A"}
                    </p>
                  ) : (
                    <></>
                  )}
                  {invoiceSettings.shipping.showPhone ? (
                    <p>
                      <strong>Tel:</strong> {orders[0].shipping_address.phone || "N/A"}
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
                  shopdetails[0].name !== null ? (
                    shopdetails[0].name
                  ) : (
                    "Shop Name"
                  )
                ) : (
                  <></>
                )}
              </p>
              <p>
                {invoiceSettings.supplier.showAddress ? (
                  shopdetails[0].address1 !== null ? (
                    shopdetails[0].address1 + ", "
                  ) : (
                    "N/A"
                  )
                ) : (
                  <></>
                )}{" "}
                {invoiceSettings.supplier.showCity ? shopdetails[0].city !== null ? shopdetails[0].city : "N/A" : <></>}
              </p>
              <p>
                {invoiceSettings.supplier.showEmail ? (
                  <>
                    <strong>Email: </strong>
                    {shopdetails[0].email !== null ? shopdetails[0].email : "N/A"}
                  </>
                ) : (
                  <></>
                )}
              </p>
              <p>
                {invoiceSettings.supplier.showPhone ? (
                  <>
                    <strong>Phone: </strong>
                    {shopdetails[0]?.phone ? shopdetails[0].phone : "N/A"}
                  </>
                ) : (
                  <></>
                )}
              </p>

              <p>
                {invoiceSettings.supplier.showGSTIN ? (
                  <>
                    <strong>GST: </strong>
                    {shopProfile?.storeProfile?.gstNumber || "N/A"}
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
              // console.log('GSTHSNCodes-------',GSTHSNCodes[0].productId);
              console.log("item-------", item.product_id);

              const matchedGSTItem = GSTHSNCodes.gstcodes
                ? GSTHSNCodes.gstcodes.find((gstItem) => Number(gstItem.productId) === item.product_id)
                : GSTHSNCodes.find((gstItem) => Number(gstItem.productId) === item.product_id);

              const price = parseFloat(item.price) || 0; // Convert to a number and default to 0 if NaN
              const lineAmount = item.quantity * price + (item.total_tax || 0) || 0;
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
                      {item.quantity || "N/A"}
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
                      ₹{price || "N/A"}
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
                      {matchedGSTItem?.gst || "-"}
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
                      ₹{item.total_tax || "0"}
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
                      ₹{lineAmount}
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
                  {convertAmountToWords(orders[0].total_price || 0)}
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
                      ₹ {orders[0].subtotal_price !== null ? Number(orders[0].subtotal_price).toFixed(2) : "0.00"}
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
                      Taxable
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
                      ₹ {orders[0].total_tax !== null ? Number(orders[0].total_tax).toFixed(2) : "0.00"}
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
                      ₹ {orders[0].total_price !== null ? Number(orders[0].total_price).toFixed(2) : "0.00"}
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
            marginTop: "150px",
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

      </div>
    </div>
  );
}
