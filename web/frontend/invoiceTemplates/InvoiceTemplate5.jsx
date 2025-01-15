import React from 'react';
import ReusableFunctions from "../ReusableFunctions";

const InvoiceTemplate = ({invoiceData, userData}) => {
  

    // console.log("invoiceData:",invoiceData);
    // console.log("userData:",userData);

  return (
    <div className="max-w-4xl mx-auto p-4 shadow-lg">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 mb-8 rounded-t-md flex justify-between items-center">
  {/* Left Column */}
  <div>
    <h1 className="text-3xl font-bold">INVOICE</h1>
    <p className="text-2xl font-bold mt-1">
      {userData.invoice_Prefix}
      {invoiceData.invoiceNumber}
    </p>
  </div>

  {/* Right Column */}
  <div className="text-right text-2xl font-semibold self-end">
    Amount Due: ₹ {invoiceData.payment.grandTotal}
    <span className='text-[15px] m-0 p-0'>
    <p>Invoice Date: {ReusableFunctions.formatDate(invoiceData.invoiceDate)}</p>
    <p>Payment Due: {ReusableFunctions.formatDate(invoiceData.invoiceDueDate)}</p>
    </span>
  </div>
</div>
<div className="flex flex-wrap md:flex-nowrap justify-between items-start gap-6 mb-8">
  {/* Bill To Section */}
  <div className="w-full md:w-1/2 bg-gray-50 p-4 rounded-lg border flex flex-col">
    <h2 className="text-lg font-semibold text-blue-600 mb-3">Bill To:</h2>
    <p className="text-gray-800 text-sm font-medium">
      {invoiceData.billTo.customerName}{" "}
      <span className="text-gray-500">
        ({invoiceData.billTo.companyName || "N/A"})
      </span>
    </p>
    <p className="text-gray-600 text-sm mt-1">
      <span className="font-semibold">Address:</span> {invoiceData.billTo.address}, {invoiceData.billTo.city}, {invoiceData.billTo.pincode}
    </p>
    <p className="text-gray-600 text-sm mt-1">
      <span className="font-semibold">Email:</span> {invoiceData.billTo.email}
    </p>
    <p className="text-gray-600 text-sm mt-1">
      <span className="font-semibold">Phone:</span> {invoiceData.billTo.phone}
    </p>
    <p className="text-gray-600 text-sm mt-1">
      <span className="font-semibold">GST:</span> {invoiceData.billTo.gstNumber}
    </p>
  </div>

  {/* Ship To Section */}
  <div className="w-full md:w-1/2 bg-gray-50 p-4 rounded-lg border flex flex-col">
    <h2 className="text-lg font-semibold text-blue-600 mb-3">Ship To:</h2>
    <div className="flex-grow">
      <p className="text-gray-600 text-sm mt-1">
        <span className="font-semibold">Address:</span> {invoiceData.shipTo.address}, {invoiceData.shipTo.city},<br />
        {invoiceData.shipTo.pincode}
      </p>
      <p>‎ </p>
      <p>‎ </p>
      <p>‎ </p>
    </div>
  </div>
</div>



<table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
    <thead>
    <tr className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm">
      <th className="px-4 py-3 text-left">Item Description</th>
      <th className="px-4 py-3 text-center">HSN/SAC</th>
      <th className="px-4 py-3 text-center">Quantity</th>
      <th className="px-4 py-3 text-center">Price</th>
      <th className="px-4 py-3 text-center">Tax<span className="text-[10px]"> (%)</span></th>
      <th className="px-4 py-3 text-right">Amount</th>
    </tr>
  </thead>
  <tbody>
    {invoiceData.products.map((item, index) => (
      <tr
        key={index}
        className={`${
          index % 2 !== 0 ? "bg-gray-50" : "bg-white"
        } hover:bg-gray-100 transition-colors`}
      >
        <td className="px-4 py-3 text-gray-800 text-sm font-medium">{item.name}</td>
        <td className="px-4 py-3 text-gray-600 text-center">{item.hsnCode}</td>
        <td className="px-4 py-3 text-gray-600 text-center">{item.quantity}</td>
        <td className="px-4 py-3 text-gray-800 text-center">₹{item.price}</td>
        <td className="px-4 py-3 text-gray-600 text-center">{item.tax.igst}</td>
        <td className="px-4 py-3 text-gray-800 text-right">₹{item.price}</td>
      </tr>
    ))}
  </tbody>
  
</table>


      <div className="mt-4 p-4 bg-gray-100 rounded-lg border">
  {/* Sub Total, Discount, Tax, Total */}

    <div className="flex justify-between items-center border-b pb-2">
      <span className="text-gray-600 text-lg font-medium">Sub Total:</span>
      <span className="text-gray-800 text-lg font-semibold">
        ₹ {invoiceData.payment.grandTotal - invoiceData.payment.tax - invoiceData.payment.discount || 0}
      </span>
    </div>
    <div className="flex justify-between items-center border-b py-2">
      <span className="text-gray-600 text-lg font-medium">Discount:</span>
      <span className="text-red-500 text-lg font-semibold">
        -₹ {invoiceData.payment.discount || 0}
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
    <div className="flex justify-between items-center border-b py-2">
      <span className="text-gray-600 text-lg font-medium">Total Tax:</span>
      <span className="text-gray-800 text-lg font-semibold">
        ₹ {invoiceData.payment.tax || 0}
      </span>
    </div>
    <div className="flex justify-between items-center pt-2">
      <span className="text-gray-900 text-xl font-bold">Grand Total:</span>
      <span className="text-blue-600 text-2xl font-bold">
        ₹ {invoiceData.payment.grandTotal || 0}
      </span>
    </div>
  


</div>

      <div className="mt-8 p-4 border border-blue-300 rounded-md bg-blue-50">
        <h3 className="text-lg font-bold">Notes</h3>
        <p>{invoiceData.customerInvoiceNote}</p>
        <h3 className="text-lg font-bold">Terms & Conditions</h3>
        <p>{invoiceData.termsAndCondition}</p>
       
      </div>

      {/* <div className="mt-8 p-4 border border-gray-300 rounded-md">
        <h3 className="text-lg font-bold">Payment Details</h3>
        <p>Bank Name: {invoiceData.paymentDetails.bankName}</p>
        <p>Account Number: {invoiceData.paymentDetails.accountNumber}</p>
        <p>IFSC Code: {invoiceData.paymentDetails.ifscCode}</p>
      </div> */}

      <div className="mt-8 p-4 bg-gray-800 text-white rounded-md">
        <h3 className="text-lg font-bold">{userData.companyName}</h3>
        <p>{userData.companyFullAddress}, {userData.city}, {userData.pincode}, {userData.country}</p>
        <p>Phone: {userData.phone}</p>
        <p>Email: {userData.email}</p>
        <p>GST: {userData.GST}</p>
      </div>
    </div>
  );
};

export default InvoiceTemplate;
