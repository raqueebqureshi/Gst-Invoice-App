// export default function Component() {
//   return (
//     <div style={{
//       fontFamily: 'Arial, sans-serif',
//       maxWidth: '800px',
//       margin: '0 auto',
//       padding: '20px',
//       border: '1px solid #ccc',
//       backgroundColor: '#fff'
//     }}>
//       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
//         <div>
//           <h1 style={{ color: '#4a5568', marginBottom: '5px' }}>Company Name</h1>
//           <p style={{ margin: '0', color: '#718096' }}>[Street Address]</p>
//           <p style={{ margin: '0', color: '#718096' }}>[City, ST ZIP]</p>
//           <p style={{ margin: '0', color: '#718096' }}>Phone: [000-000-0000]</p>
//           <p style={{ margin: '0', color: '#718096' }}>Fax: [000-000-0000]</p>
//           <p style={{ margin: '0', color: '#718096' }}>Website: somedomain.com</p>
//         </div>
//         <div style={{ textAlign: 'right' }}>
//           <h2 style={{ color: '#4299e1', fontSize: '2.5em', marginBottom: '10px' }}>INVOICE</h2>
//           <table style={{ borderCollapse: 'collapse' }}>
//             <tbody>
//               <tr>
//                 <td style={{ padding: '5px 10px', border: '1px solid #e2e8f0', backgroundColor: '#edf2f7' }}>DATE</td>
//                 <td style={{ padding: '5px 10px', border: '1px solid #e2e8f0' }}>12/9/2019</td>
//               </tr>
//               <tr>
//                 <td style={{ padding: '5px 10px', border: '1px solid #e2e8f0', backgroundColor: '#edf2f7' }}>INVOICE #</td>
//                 <td style={{ padding: '5px 10px', border: '1px solid #e2e8f0' }}>[123456]</td>
//               </tr>
//               <tr>
//                 <td style={{ padding: '5px 10px', border: '1px solid #e2e8f0', backgroundColor: '#edf2f7' }}>CUSTOMER ID</td>
//                 <td style={{ padding: '5px 10px', border: '1px solid #e2e8f0' }}>[123]</td>
//               </tr>
//               <tr>
//                 <td style={{ padding: '5px 10px', border: '1px solid #e2e8f0', backgroundColor: '#edf2f7' }}>DUE DATE</td>
//                 <td style={{ padding: '5px 10px', border: '1px solid #e2e8f0' }}>1/8/2020</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <div style={{ marginBottom: '20px' }}>
//         <h3 style={{ backgroundColor: '#4a5568', color: 'white', padding: '5px 10px' }}>BILL TO</h3>
//         <p style={{ margin: '5px 0' }}>[Name]</p>
//         <p style={{ margin: '5px 0' }}>[Company Name]</p>
//         <p style={{ margin: '5px 0' }}>[Street Address]</p>
//         <p style={{ margin: '5px 0' }}>[City, ST ZIP]</p>
//         <p style={{ margin: '5px 0' }}>[Phone]</p>
//       </div>

//       <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
//         <thead>
//           <tr style={{ backgroundColor: '#4a5568', color: 'white' }}>
//             <th style={{ padding: '10px', textAlign: 'left' }}>DESCRIPTION</th>
//             <th style={{ padding: '10px', width: '100px' }}>TAXED</th>
//             <th style={{ padding: '10px', width: '100px' }}>AMOUNT</th>
//           </tr>
//         </thead>
//         <tbody>
//           <tr>
//             <td style={{ padding: '10px', border: '1px solid #e2e8f0' }}>[Service Fee]</td>
//             <td style={{ padding: '10px', border: '1px solid #e2e8f0' }}></td>
//             <td style={{ padding: '10px', border: '1px solid #e2e8f0', textAlign: 'right' }}>230.00</td>
//           </tr>
//           <tr>
//             <td style={{ padding: '10px', border: '1px solid #e2e8f0' }}>[Labor: 5 hours at $75/hr]</td>
//             <td style={{ padding: '10px', border: '1px solid #e2e8f0' }}></td>
//             <td style={{ padding: '10px', border: '1px solid #e2e8f0', textAlign: 'right' }}>375.00</td>
//           </tr>
//           <tr>
//             <td style={{ padding: '10px', border: '1px solid #e2e8f0' }}>[Parts]</td>
//             <td style={{ padding: '10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>X</td>
//             <td style={{ padding: '10px', border: '1px solid #e2e8f0', textAlign: 'right' }}>345.00</td>
//           </tr>
//         </tbody>
//       </table>

//       <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//         <div style={{ width: '50%' }}>
//           <h3 style={{ backgroundColor: '#4a5568', color: 'white', padding: '5px 10px' }}>OTHER COMMENTS</h3>
//           <ol style={{ paddingLeft: '20px' }}>
//             <li>Total payment due in 30 days</li>
//             <li>Please include the invoice number on your check</li>
//           </ol>
//         </div>
//         <div style={{ width: '30%' }}>
//           <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//             <tbody>
//               <tr>
//                 <td style={{ padding: '5px' }}>Subtotal</td>
//                 <td style={{ padding: '5px', textAlign: 'right' }}>950.00</td>
//               </tr>
//               <tr>
//                 <td style={{ padding: '5px' }}>Taxable</td>
//                 <td style={{ padding: '5px', textAlign: 'right' }}>345.00</td>
//               </tr>
//               <tr>
//                 <td style={{ padding: '5px' }}>Tax rate</td>
//                 <td style={{ padding: '5px', textAlign: 'right' }}>6.250%</td>
//               </tr>
//               <tr>
//                 <td style={{ padding: '5px' }}>Tax due</td>
//                 <td style={{ padding: '5px', textAlign: 'right' }}>21.56</td>
//               </tr>
//               <tr>
//                 <td style={{ padding: '5px' }}>Other</td>
//                 <td style={{ padding: '5px', textAlign: 'right' }}></td>
//               </tr>
//               <tr style={{ fontWeight: 'bold' }}>
//                 <td style={{ padding: '5px' }}>TOTAL</td>
//                 <td style={{ padding: '5px', textAlign: 'right' }}>$ 971.56</td>
//               </tr>
//             </tbody>
//           </table>
//           <p style={{ marginTop: '10px', fontSize: '0.9em' }}>Make all checks payable to<br />[Your Company Name]</p>
//         </div>
//       </div>

//       <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9em' }}>
//         If you have any questions about this invoice, please contact<br />
//         [Name, Phone #, E-mail]
//       </p>
//       <p style={{ textAlign: 'center', fontWeight: 'bold' }}>Thank You For Your Business!</p>
//     </div>
//   )
// }