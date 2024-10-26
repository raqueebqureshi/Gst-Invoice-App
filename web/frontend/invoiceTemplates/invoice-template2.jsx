// export default function TaxInvoiceTemplate() {
//   return (
//     <div style={{
//       fontFamily: 'Arial, sans-serif',
//       maxWidth: '800px',
//       margin: '0 auto',
//       border: '1px solid #000',
//       padding: '10px',
//     }}>
//       <div style={{
//         backgroundColor: '#1e3a8a',
//         color: 'white',
//         padding: '10px',
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//       }}>
//         <h1 style={{ margin: 0, fontSize: '24px' }}>TAX INVOICE</h1>
//         <div>
//           <p style={{ margin: 0 }}>INVOICE NO : 1234</p>
//           <p style={{ margin: 0 }}>DATE : 04-03-2022</p>
//         </div>
//       </div>

//       <div style={{ marginTop: '20px' }}>
//         <h2 style={{ margin: 0, fontSize: '20px' }}>BUSINESS NAME</h2>
//         <p style={{ margin: '5px 0' }}>132 Street, City, State, PIN</p>
//         <p style={{ margin: '5px 0' }}>GSTIN: AAA21345</p>
//         <p style={{ margin: '5px 0' }}>Email ID: 123@gmail.com</p>
//         <p style={{ margin: '5px 0' }}>PAN NO: AAA123456</p>
//       </div>

//       <div style={{
//         display: 'flex',
//         marginTop: '20px',
//         border: '1px solid #000',
//       }}>
//         <div style={{ flex: 1, padding: '10px', backgroundColor: '#e6f2ff' }}>
//           <h3 style={{ margin: 0, fontSize: '16px' }}>Bill To:</h3>
//           <p style={{ margin: '5px 0' }}>PARTY'S NAME -</p>
//           <p style={{ margin: '5px 0' }}>ADDRESS:</p>
//           <p style={{ margin: '5px 0' }}>132 STREET, CITY, STATE - 132456</p>
//           <p style={{ margin: '5px 0' }}>Email ID: abc@gmail.com</p>
//           <p style={{ margin: '5px 0' }}>GSTIN: 07AAFCD5862R1Z8</p>
//         </div>
//         <div style={{ flex: 1, padding: '10px', backgroundColor: '#e6f2ff' }}>
//           <p style={{ margin: '5px 0' }}>Payment Due Date:</p>
//           <p style={{ margin: '5px 0' }}>Payment Mode:</p>
//         </div>
//       </div>

//       <table style={{
//         width: '100%',
//         borderCollapse: 'collapse',
//         marginTop: '20px',
//       }}>
//         <thead>
//           <tr style={{ backgroundColor: '#e6f2ff' }}>
//             <th style={{ border: '1px solid #000', padding: '8px' }}>Description</th>
//             <th style={{ border: '1px solid #000', padding: '8px' }}>HSN Code</th>
//             <th style={{ border: '1px solid #000', padding: '8px' }}>Qty</th>
//             <th style={{ border: '1px solid #000', padding: '8px' }}>Rate</th>
//             <th style={{ border: '1px solid #000', padding: '8px' }}>Amount</th>
//           </tr>
//         </thead>
//         <tbody>
//           <tr>
//             <td style={{ border: '1px solid #000', padding: '8px' }}></td>
//             <td style={{ border: '1px solid #000', padding: '8px' }}></td>
//             <td style={{ border: '1px solid #000', padding: '8px' }}></td>
//             <td style={{ border: '1px solid #000', padding: '8px' }}></td>
//             <td style={{ border: '1px solid #000', padding: '8px' }}></td>
//           </tr>
//           <tr>
//             <td style={{ border: '1px solid #000', padding: '8px' }}></td>
//             <td style={{ border: '1px solid #000', padding: '8px' }}></td>
//             <td style={{ border: '1px solid #000', padding: '8px' }}></td>
//             <td style={{ border: '1px solid #000', padding: '8px' }}></td>
//             <td style={{ border: '1px solid #000', padding: '8px' }}></td>
//           </tr>
//         </tbody>
//       </table>

//       <div style={{
//         display: 'flex',
//         marginTop: '20px',
//       }}>
//         <div style={{ flex: 1, backgroundColor: '#e6f2ff', padding: '10px' }}>
//           <h3 style={{ margin: 0, fontSize: '16px' }}>Terms & conditions</h3>
//           <ol style={{ paddingLeft: '20px', margin: '10px 0' }}>
//             <li>Term 1</li>
//             <li>Term 2</li>
//             <li>Term 3</li>
//             <li>Term 4</li>
//             <li>Term 5</li>
//           </ol>
//         </div>
//         <div style={{ flex: 1 }}>
//           <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//             <tbody>
//               <tr>
//                 <td style={{ border: '1px solid #000', padding: '8px' }}>Total</td>
//                 <td style={{ border: '1px solid #000', padding: '8px' }}></td>
//               </tr>
//               <tr>
//                 <td style={{ border: '1px solid #000', padding: '8px' }}>Add : CGST @ 14%</td>
//                 <td style={{ border: '1px solid #000', padding: '8px' }}></td>
//               </tr>
//               <tr>
//                 <td style={{ border: '1px solid #000', padding: '8px' }}>Add : SGST @ 14%</td>
//                 <td style={{ border: '1px solid #000', padding: '8px' }}></td>
//               </tr>
//               <tr>
//                 <td style={{ border: '1px solid #000', padding: '8px' }}>Balance Received :</td>
//                 <td style={{ border: '1px solid #000', padding: '8px' }}></td>
//               </tr>
//               <tr>
//                 <td style={{ border: '1px solid #000', padding: '8px' }}>Balance Due :</td>
//                 <td style={{ border: '1px solid #000', padding: '8px' }}></td>
//               </tr>
//               <tr style={{ backgroundColor: '#1e3a8a', color: 'white' }}>
//                 <td style={{ border: '1px solid #000', padding: '8px' }}>Grand Total</td>
//                 <td style={{ border: '1px solid #000', padding: '8px' }}></td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <div style={{ marginTop: '20px' }}>
//         <p>Total Amount (₹ - In Words) :</p>
//       </div>

//       <div style={{
//         display: 'flex',
//         justifyContent: 'space-between',
//         marginTop: '40px',
//       }}>
//         <div>
//           <p>For : Business Name</p>
//         </div>
//         <div>
//           <p>Authorised Signatory</p>
//         </div>
//       </div>
//     </div>
//   );
// }