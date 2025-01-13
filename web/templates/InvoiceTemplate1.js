export function renderInvoiceTemplate1(orderDetails,shopDetails) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${invoiceSettings.overview.documentTitle || "Invoice"}</title>
          <style>
            body { font-family: ${invoiceSettings.branding.fontFamily || "Arial, sans-serif"}; }
            .primary-color { color: ${invoiceSettings.branding.primaryColor || "#000"}; }
          </style>
        </head>
        <body>
          <h1 class="primary-color">${invoiceSettings.overview.documentTitle || "Invoice"}</h1>
          ${
            invoiceSettings.supplier.showSupplier
              ? `
                <div>
                  <h2>${invoiceSettings.supplier.heading}</h2>
                  <p>${invoiceSettings.supplier.showBusinessName ? orderDetails.shop_name : ""}</p>
                  <p>${invoiceSettings.supplier.showAddress ? orderDetails.shop_address : ""}</p>
                </div>
              `
              : ""
          }
          <div>
            ${
              invoiceSettings.overview.showInvoiceNumber
                ? `<p>Invoice Number: ${orderDetails.order_number}</p>`
                : ""
            }
            ${
              invoiceSettings.overview.issueDate
                ? `<p>Date: ${new Date(orderDetails.created_at).toLocaleDateString()}</p>`
                : ""
            }
          </div>
          ${
            invoiceSettings.lineItems.showProductImage
              ? `
                <img src="${orderDetails.line_items[0]?.image_url || ""}" alt="Product Image" />
              `
              : ""
          }
          ${
            invoiceSettings.lineItems.showQuantity
              ? `<p>Quantity: ${orderDetails.line_items[0]?.quantity || 0}</p>`
              : ""
          }
          ${
            invoiceSettings.lineItems.showTotalPrice
              ? `<p>Total Price: ${orderDetails.total_price || "0.00"}</p>`
              : ""
          }
          <p>${invoiceSettings.footer.thankYouNote || "Thank you for your business!"}</p>
  
          <div style="text-align: center; margin-top: 20px;">
            <button onclick="window.print()" style="padding: 10px 20px; font-size: 16px;">Download Invoice</button>
          </div>
        </body>
      </html>
    `;
  }
  