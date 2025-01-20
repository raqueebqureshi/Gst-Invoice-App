import convertAmountToWords from "../components/ConvertAmount";
import React from "react";
import { useState, useEffect } from "react";
import SocialMediaIcons from "../components/GlobalSocialIcons";
import { hexToRgba } from "../components/hex";

export function InvoiceTemplate2({ shopdetails, orders, invoiceSettings, GSTHSNCodes }) {
  console.log("orders - InvoiceTemplate2", orders[0]);
  console.log("store - details I2", shopdetails[0]);
  console.log("invoiceSettings - InvoiceTemplate2", invoiceSettings);
  console.log("GSTHSNCodes - InvoiceTemplate2", GSTHSNCodes);

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
        console.error("Error fetching invoice settings:", error.message);
      });
  });

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
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        width: "54vw", // Full viewport width
        margin: "0 auto",
        padding: "20px",
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
            <p style={{ margin: 0 }}>INVOICE NO : {orders[0].name}</p>
          ) : (
            <></>
          )}
          {invoiceSettings.overview.issueDate ? (
            <p style={{ margin: 0 }}>DATE : {formatDateTime(orders[0].created_at)}</p>
          ) : (
            <></>
          )}
        </div>
      </div>
      {invoiceSettings.supplier.showSupplier ? (
        <div style={{ marginTop: "20px", visibility: invoiceSettings.supplier.showSupplier ? "visible" : "hidden" }}>
          <h2 style={{ margin: 0, fontSize: "20px" }}>
            {invoiceSettings.supplier.showHeading ? shopdetails[0].name !== null ? shopdetails[0].name : "N/A" : <></>}
          </h2>
          <p style={{ margin: "5px 0" }}>
            {invoiceSettings.supplier.showAddress ? (
              shopdetails[0].address1 !== null ? (
                shopdetails[0].address1 + ", "
              ) : (
                "N/A"
              )
            ) : (
              <></>
            )}
            {invoiceSettings.supplier.showCity ? (
              shopdetails[0].city !== null ? (
                shopdetails[0].city + " "
              ) : (
                "N/A"
              )
            ) : (
              <></>
            )}

            {/* {shopdetails[0].state !== null ? shopdetails[0].state : "N/A"} */}
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
          {/* <p style={{ margin: '5px 0' }}>GSTIN: AAA21345</p> */}
          <p style={{ margin: "5px 0" }}>
            {invoiceSettings.supplier.showPhone ? (
              <>
                Phone:
                {shopdetails[0]?.phone ? " " + shopdetails[0].phone : " N/A"}
              </>
            ) : (
              <></>
            )}
          </p>
          <p style={{ margin: "5px 0" }}>
            {invoiceSettings.supplier.showEmail ? (
              <>Email ID: {shopdetails[0].email !== null ? shopdetails[0].email : "N/A"}</>
            ) : (
              <></>
            )}
          </p>
          <p style={{ margin: "0px 0" }}>
            {invoiceSettings.supplier.showGSTIN ? (
              <>
                GSTIN: {shopProfile?.storeProfile?.gstNumber || "N/A"}
              </>
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
              {invoiceSettings.billing.showAddress1 ? (
                <p style={{ margin: "5px 0" }}>
                  ADDRESS:
                  {orders[0].billing_address.address1 !== null ? orders[0].billing_address.address1 + ", " : "N/A"}
                </p>
              ) : (
                <></>
              )}
              <p style={{ margin: "5px 0" }}>
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
                )}
                {invoiceSettings.billing.showZipPinCode ? (
                  orders[0].billing_address.zip !== null ? (
                    orders[0].billing_address.zip
                  ) : (
                    ""
                  )
                ) : (
                  <></>
                )}
                <br />
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
                <p style={{ margin: "5px 0" }}>Email ID: {orders[0].email !== null ? orders[0].email : "N/A"}</p>
              ) : (
                <></>
              )}
              {invoiceSettings.billing.showPhone ? (
                <p style={{ margin: "5px 0" }}>PH: {orders[0].billing_address.phone !== null ? orders[0].billing_address.phone : "N/A"}</p>
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
            orders[0].shipping_address !== null ? (
              <>
                <p style={{ margin: "5px 0" }}>
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
                    `(${orders[0].billing_address.company !== null ? orders[0].billing_address.company : "N/A"})`
                  ) : (
                    <></>
                  )}
                </p>
                <p style={{ margin: "5px 0" }}>
                  {invoiceSettings.shipping.showAddress1 ? (
                    <>
                      ADDRESS:{" "}
                      {orders[0].shipping_address.address1 !== null ? orders[0].shipping_address.address1 : "N/A"},
                    </>
                  ) : (
                    <></>
                  )}
                </p>
                <p style={{ margin: "5px 0" }}>
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
                  )}
                  {invoiceSettings.shipping.showZipPinCode ? (
                    orders[0].shipping_address.zip !== null ? (
                      orders[0].shipping_address.zip
                    ) : (
                      ""
                    )
                  ) : (
                    <></>
                  )}
                  <br />
                  {invoiceSettings.shipping.showCountry ? (
                    orders[0].shipping_address.country !== null ? (
                      orders[0].shipping_address.country + " "
                    ) : (
                      ""
                    )
                  ) : (
                    <></>
                  )}
                </p>
                {invoiceSettings.shipping.showEmail ? (
                  <p style={{ margin: "5px 0" }}>Email ID: {orders[0].email !== null ? orders[0].email : "N/A"}</p>
                ) : (
                  <></>
                )}
                {invoiceSettings.shipping.showPhone ? (
                <p style={{ margin: "5px 0" }}>PH: {orders[0].shipping_address.phone !== null ? orders[0].shipping_address.phone : "N/A"}</p>
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

        <tbody>
        {orders[0].line_items?.map((item, index) => {
            // console.log('GSTHSNCodes-------',GSTHSNCodes[0].productId);
            console.log('item-------',item.product_id);
            
            const matchedGSTItem = GSTHSNCodes.find(
              (gstItem) => Number(gstItem.productId) === item.product_id
            );
            
            const price = parseFloat(item.price) || 0; // Convert to a number and default to 0 if NaN
            const lineAmount = item.quantity * price + (item.total_tax || 0) || 0;
            return (
              <tr key={item.id}>
                {invoiceSettings.lineItems.showVariantTitle ? (
                  <td
                    style={{
                      padding: "10px",
                      border: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.2) || "#e2e8f0"}`,
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
                      border: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.2) || "#e2e8f0"}`,
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
                      border: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.2) || "#e2e8f0"}`,
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
                      border: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.2) || "#e2e8f0"}`,
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
                      border: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.2) || "#e2e8f0"}`,
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
                      border: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.2) || "#e2e8f0"}`,
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
                      border: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.2) || "#e2e8f0"}`,
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
                {convertAmountToWords(orders[0].total_price || 0)}
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
                      border: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.2) || "#e2e8f0"}`,
                      padding: "10px",
                      backgroundColor: hexToRgba(invoiceSettings.branding.primaryColor, 0.07),
                      fontWeight: "bold",
                    }}
                  >
                    Sub Total
                  </td>
                  <td
                    style={{
                      border: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.2) || "#e2e8f0"}`,
                      padding: "10px",
                      textAlign: "right",
                    }}
                  >
                    ₹{orders[0].subtotal_price}
                  </td>
                </tr>
              ) : (
                <></>
              )}
              {invoiceSettings.total.showTax ? (
                <tr>
                  <td
                    style={{
                      border: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.2) || "#e2e8f0"}`,
                      padding: "10px",
                      backgroundColor: hexToRgba(invoiceSettings.branding.primaryColor, 0.07),
                      fontWeight: "bold",
                    }}
                  >
                    Tax
                  </td>
                  <td
                    style={{
                      border: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.2) || "#e2e8f0"}`,
                      padding: "10px",
                      textAlign: "right",
                    }}
                  >
                    ₹{orders[0].total_tax}
                  </td>
                </tr>
              ) : (
                <></>
              )}
              {invoiceSettings.total.showTotal ? (
                <tr style={{ backgroundColor: invoiceSettings.branding.primaryColor, color: "white" }}>
                  <td
                    style={{
                      border: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.2) || "#e2e8f0"}`,
                      padding: "10px",
                      fontWeight: "bold",
                    }}
                  >
                    Grand Total
                  </td>
                  <td
                    style={{
                      border: `1px solid ${hexToRgba(invoiceSettings.branding.primaryColor, 0.2) || "#e2e8f0"}`,
                      padding: "10px",
                      textAlign: "right",
                      fontWeight: "bold",
                    }}
                  >
                    ₹{orders[0].total_price}
                  </td>
                </tr>
              ) : (
                <></>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ height: "120px" }}></div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "40px",
          borderTop: "1px solid #e2e8f0",
        }}
      >
        <div>
          {/* <p>For : {shopdetails[0].name !== null ? shopdetails[0].name : "N/A"}</p> */}
          <p style={{ textAlign: "left", marginTop: "20px", fontSize: "0.9em" }}>
            If you have any questions about this invoice, please contact
            <br />
            {invoiceSettings.supplier.showPhone ? (
              <>Phone: {shopdetails[0].phone !== null ? shopdetails[0].phone : "N/A"} </>
            ) : (
              <></>
            )}{" "}
            <br />
            {invoiceSettings.supplier.showEmail ? (
              <>E-mail: {shopdetails[0].email !== null ? shopdetails[0].email : "N/A"}</>
            ) : (
              <></>
            )}
          </p>
          <p style={{ textAlign: "left", fontWeight: "bold" }}>
            {invoiceSettings.footer.thankYouNote || "Thank You For Choosing Us!"}
          </p>
        </div>
        {invoiceSettings.branding.showSignature ? (<>
        { shopProfile?.images?.signatureURL &&(<div
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
</div>)}
</>
      ):(<><div
        style={{
          display: "flex",
          justifyContent: "flex-end", // Aligns the content to the right
          marginTop: "150px",
        }}
      ></div></>)}
        

      </div>
      
      <div>
        {shopProfile.socialLinks && (
          <SocialMediaIcons socialLink={shopProfile.socialLinks} invoiceSetting={invoiceSettings} />
        )}
        {/* <SocialMediaIcons socialLink={shopProfile.socialLinks} invoiceSetting={invoiceSettings} /> */}
      </div>
    </div>
  );
}
