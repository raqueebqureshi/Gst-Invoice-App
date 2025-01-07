import React from 'react';
import ReusableFunctions from "../ReusableFunctions";

const CreativeInvoice = ({invoiceData, userData}) => {

    // console.log("invoiceData:",invoiceData);
    // console.log("userData:",userData);
    // console.log("customerData:",customerData);
  

  const calculateTotal = () => {
    return invoiceData.items.reduce((total, item) => total + item.quantity * item.price, 0);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-10 border border-gray-300 shadow-lg mt-10">
    <div className="border-b-4 border-blue-500 pb-4 mb-6"   >
    {/* style={{ borderColor: userData.brandColor || "#3B82F6" }}  */}
      <h1 className="text-3xl font-bold text-gray-800">INVOICE</h1>
      <div className="flex justify-between items-center mt-4">
        <div>
          <h2 className="text-lg font-semibold">{invoiceData.companyName}</h2>
          <p>{userData.companyFullAddress}, {userData.city}, {userData.pincode}</p>
          <p>Contact: {userData.phone}</p>
          <p>GST: {userData.GST}</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-semibold">Invoice #: { userData.invoice_Prefix+invoiceData.invoiceNumber}</h2>
          <p>Invoice Date: {ReusableFunctions.formatDate(invoiceData.invoiceDate, "DD/MM/YYYY")}</p>
          <p>Payment Due: {invoiceData.invoiceDueDate}</p>
        </div>
      </div>
    </div>

    <div className="bg-blue-50 p-6 mb-6 rounded-lg border border-blue-300 grid grid-cols-1 sm:grid-cols-2 gap-6"> 
    {/* style={{ borderColor: userData?.brandColor || "#3B82F6" }} */}
      {/* Bill To Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-700">Bill To:</h2>
        <p className="mt-2 font-medium text-gray-800">{invoiceData.billTo.customerName} ({invoiceData.billTo.companyName})</p>
        <p>Address: {invoiceData.billTo.address}, {invoiceData.billTo.city}, {invoiceData.billTo.pincode}</p>
        <p>Email: {invoiceData.billTo.email}</p>
        <p>Phone: {invoiceData.billTo.phone}</p>
      </div>

      {/* Ship To Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-700">Ship To:</h2>
        {/* <p className="mt-2 font-medium text-gray-800">{invoiceData.shipTo.customerName} ({invoiceData.shipTo.companyName})</p> */}
        <p>Address: {invoiceData.shipTo.address}, {invoiceData.shipTo.city}, {invoiceData.shipTo.pincode}</p>
        {/* <p>Email: {invoiceData.shipTo.email}</p>
        <p>Phone: {invoiceData.shipTo.phone}</p> */}
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-400 text-center">
        <thead>
          <tr className="bg-blue-200">
            <th className="border px-3 py-2 ">Item</th>
            <th className="border px-1 py-2 ">HSN/SAC</th>
            <th className="border px-1 py-2 ">Quantity</th>
            <th className="border px-1 py-2 ">Price</th>
            <th className="border px-1 py-2 ">Tax
                <span className="text-[10px] "> (%)</span></th>
            <th className="border px-1 py-2 ">Amount</th>
          </tr>
        </thead>
        <tbody>
  {invoiceData.products.map((item, index) => (
    <tr key={index} className="odd:bg-white even:bg-gray-100">
      <td className="border px-3 py-2">{item.name}</td>
      <td className="border px-3 py-2">{item.hsnCode}</td>
      <td className="border px-1 py-2">{item.quantity}</td>
      <td className="border px-1 py-2">₹{item.price}</td>
      <td className="border px-1 py-2">{item.tax.igst}</td>
      <td className="border px-1 py-2">₹{(item.subTotalAmount)}</td>
    </tr>
  ))}
</tbody>

      </table>
    </div>

    <div className="flex justify-end mt-6">
      <div className="text-right">
      <div className="mt-8 text-right text-1xl font-semibold mr-2">
       Sub Total: ₹ {invoiceData.payment.grandTotal - invoiceData.payment.tax -invoiceData.payment.discount||0}
      </div>
      
      <div className="mt-1 text-right text-1xl font-semibold mr-2">
        Discount: ₹ (-{invoiceData.payment.discount||0})
      </div>
     
      <div className="mt-1 text-right text-1xl font-semibold mr-2">
        Total Tax: ₹ {invoiceData.payment.tax||0}
      </div>
        <h3 className="text-[20px] font-bold">Total Amount Due: ₹{invoiceData.payment.grandTotal}</h3>
        <p className="text-[12px]">(Amount in Words: {ReusableFunctions.numberToWords(invoiceData.payment.grandTotal)})</p>
      </div>
    </div>

    <div className="mt-6 p-4 border-t-2 border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800">Payment Details</h3>
      <p>Bank Name: Design Bank</p>
      <p>Account Number: 123456789</p>
      <p>IFSC Code: DESIGN001</p>
    </div>

    <div className="mt-6">
      <h3 className="text-lg font-semibold">Terms & Conditions:</h3>
      <p className="text-gray-600">{invoiceData.termsAndCondition}</p>
    </div>
    <div className="mt-6">
      <h3 className="text-lg font-semibold">Notes:</h3>
      <p className="text-gray-600">{invoiceData.customerInvoiceNote}</p>
    </div>

    {/* Footer Section */}
    <div className="mt-10 flex justify-between items-center border-t-4 border-blue-500 pt-6">
      <div className="flex items-center">
        <img
          src="https://via.placeholder.com/100"
          alt="Company Logo"
          className="h-16 w-16 mr-4"
        />
        <div>
          <p className="text-lg font-semibold">{invoiceData.companyName}</p>
          {/* <p className="text-gray-600">Thank you for your business!</p> */}
        </div>
      </div>
      <div className="text-right ">
        <p className="text-gray-800">Authorized Signature</p>
        
      </div>
    </div>
  </div>
  );
};

export default CreativeInvoice;
