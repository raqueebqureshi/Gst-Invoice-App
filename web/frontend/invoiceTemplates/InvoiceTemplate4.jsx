import React from "react";
import ReusableFunctions from "../ReusableFunctions";

const CreativeInvoiceTemplate = ({ invoiceData, userData }) => {
  // console.log("invoiceData:",invoiceData);
  // console.log("userData:",userData);
  // const logo = userData?.brandLogoUrl || invoiceData?.brandLogoUrl || "";

  return (
    <div className="p-10  mx-auto">
      {/* Header Section */}
      <div className="bg-gray-800 text-white p-6 rounded-t-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{userData.companyName}</h2>
            <p className="text-sm">
              {userData.companyFullAddress}, {userData.city}, {userData.pincode}
              , {userData.country}
            </p>

            <p className="text-sm">PH: {userData.phone}</p>
            <p className="text-sm">GST: {userData.GST}</p>
          </div>

          {/* <img className="h-12 rounded-md " src={logo} alt="logo" /> */}
          <div className="text-right">
            <h1 className="text-3xl font-bold tracking-wide">INVOICE</h1>
            <p className="text-sm mt-1 ">
              Invoice #:{" "}
              <span>{userData.invoice_Prefix + invoiceData.invoiceNumber}</span>
            </p>
            <p className="text-sm">
              Date:{" "}
              <span>
                {ReusableFunctions.formatDate(invoiceData.invoiceDate)}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Customer & Invoice Details */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        {/* Bill To */}
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50  text-gray-600">
          <h3 className="text-lg font-bold text-gray-800">Bill To</h3>
          <p className="mt-2 font-medium">
            {invoiceData.billTo.customerName} ({invoiceData.billTo.companyName})
          </p>
          <p>
            Address: {invoiceData.billTo.address}, {invoiceData.billTo.city},
            <br />
            {invoiceData.billTo.pincode}
          </p>
          <p>Email: {invoiceData.billTo.email}</p>
          <p>Phone: {invoiceData.billTo.phone}</p>
        </div>
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50  text-gray-600">
          <h3 className="text-lg font-bold text-gray-800">Ship To</h3>
          <p className="mt-2 ">
            Address: {invoiceData.shipTo.address}, {invoiceData.shipTo.city},
            <br />
            {invoiceData.shipTo.pincode}
          </p>
        </div>
        {/* Payment Info */}
      </div>

      {/* Items Section */}
      <div className="mt-6">
        <table className="w-full border-collapse border border-gray-300 rounded-lg">
          <thead className="bg-gray-200 text-center">
            <tr>
              <th className="border border-gray-300 px-2 py-2 text-sm font-semibold">
                Item
              </th>
              <th className="border border-gray-300 px-2 py-2 text-sm font-semibold">
                HSN/SAC
              </th>
              <th className="border border-gray-300 px-2 py-2 text-sm font-semibold">
                Quantity
              </th>
              <th className="border border-gray-300 px-2 py-2 text-sm font-semibold">
                Unit Price
              </th>
              <th className="border border-gray-300 px-2 py-2 text-sm font-semibold">
                Tax<span className="text-[10px] "> (%)</span>
              </th>
              <th className="border border-gray-300 px-2 py-2 text-sm font-semibold">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.products.map((item, index) => (
              <tr
              key={index}
              className={`hover:bg-gray-100 ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } text-center`}
            >
                <td className="border border-gray-300 px-2 py-2">
                  {item.name}
                </td>
                <td className="border border-gray-300 px-2 py-2">
                  {item.hsnCode}
                </td>
                <td className="border border-gray-300 px-2 py-2 ">
                  {item.quantity}
                </td>
                <td className="border border-gray-300 px-2 py-2 ">
                  ₹{item.price}
                </td>
                {ReusableFunctions.getTaxType(
                  invoiceData.state,
                  invoiceData.billTo.state
                ) === true && (
                  <>
                    <td className="border border-gray-300 px-2 py-2 ">
                      {Number(item.tax.cgst) + Number(item.tax.sgst)}
                    </td>
                  </>
                )}
                {ReusableFunctions.getTaxType(
                  invoiceData.state,
                  invoiceData.billTo.state
                ) === false && (
                  <>
                    <td className="border border-gray-300 px-2 py-2 ">
                      {item.tax.igst}
                    </td>
                  </>
                )}
                <td className="border border-gray-300 px-2 py-2 ">
                  ₹{item.price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Payment Info - Left Column */}
        <div className="border border-gray-300 text-md rounded-lg p-4 bg-gray-50">
          <h3 className=" font-bold text-gray-700 ">Payment Info</h3>
          <p className="mt-2 text-gray-600">
            Payment Due:{" "}
            <span className="font-semibold">
              {ReusableFunctions.formatDate(invoiceData.invoiceDueDate)}
            </span>
          </p>
          {/* <p className="text-gray-600">
      Account: <span className="font-semibold">123456789</span>
    </p>
    <p className="text-gray-600">
      IFSC: <span className="font-semibold">ABC123456</span>
    </p>
    <p className="text-gray-600">
      Bank: <span className="font-semibold">Creative Bank</span>
    </p> */}
        </div>

        {/* Total Section - Right Column */}
        <div className="flex justify-end">
          <div className="w-full bg-gray-50 border border-gray-300 p-4 rounded-lg text-sm">
            <div className="flex justify-between py-1">
              <span className="text-gray-600 font-semibold">Subtotal:</span>
              <span className="text-gray-700 font-semibold">
                ₹{" "}
                {invoiceData.payment.grandTotal -
                  invoiceData.payment.tax -
                  invoiceData.payment.discount || 0}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-600 font-semibold">Discount:</span>
              <span className="text-gray-700 font-semibold">
                ₹ (-{invoiceData.payment.discount || 0})
              </span>
            </div>
            {ReusableFunctions.getTaxType(
              invoiceData.state,
              invoiceData.billTo.state
            ) === true && (
              <>
                <div className="flex justify-between py-1 border-b border-gray-300">
                  <span className="text-gray-600 font-semibold text-[12px]">
                    CGST :
                    <br />
                    SGST :
                  </span>
                  <span className="text-gray-700 font-semibold text-[13px]">
                    ₹ {invoiceData.payment.tax / 2 || 0} <br /> ₹{" "}
                    {invoiceData.payment.tax / 2 || 0}
                  </span>
                </div>
              </>
            )}
            {ReusableFunctions.getTaxType(
              invoiceData.state,
              invoiceData.billTo.state
            ) === false && (
              <>
                <div className="flex justify-between py-1 border-b border-gray-300">
                  <span className="text-gray-600 font-semibold text-[13px]">
                    IGST :
                  </span>
                  <span className="text-gray-700 font-semibold text-[13px]">
                    ₹ {invoiceData.payment.tax || 0}
                  </span>
                </div>
              </>
            )}

            <div className="flex justify-between py-1">
              <span className="text-gray-600 font-semibold">
               Total Tax :
              </span>
              <span className="text-gray-700 font-semibold">
                ₹ {invoiceData.payment.tax || 0}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-300 mt-1">
              <span className="text-gray-800 font-bold text-[15px]">Total:</span>
              <span className="text-gray-800 font-bold text-[15px]">
                ₹{invoiceData.payment.grandTotal || 0}
              </span>
            </div>
          
            <span className="text-gray-800 font-bold text-[11px]">
              In Words: (
              {ReusableFunctions.numberToWords(invoiceData.payment.grandTotal)})
            </span>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="mt-10">
        <h3 className="text-lg font-bold text-gray-700">Terms & Notes</h3>
        <ul className="list-disc text-gray-600 pt-2 pl-6">
          <li className="mb-2">{invoiceData.termsAndCondition}</li>
          <li className="mb-2">{invoiceData.customerInvoiceNote}</li>
        </ul>
      </div>

      {/* Footer Section */}
      <div className="bg-gray-800 text-white text-center py-4 rounded-b-lg mt-6">
        <p className="text-sm">For inquiries, contact us at {userData.email}</p>
        <p className="text-sm">Phone: {userData.phone}</p>
      </div>
    </div>
  );
};

export default CreativeInvoiceTemplate;
