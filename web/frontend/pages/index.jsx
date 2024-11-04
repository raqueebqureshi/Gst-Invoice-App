import {Avatar, Page, FooterHelp, Link, Layout, AlphaCard, VerticalStack, Spinner } from '@shopify/polaris';
import { BannerEx } from "../components/Banner";
import { IndexTableEx } from "../components/IndexTable.jsx";
import "@shopify/polaris/build/esm/styles.css";
import '../styles.css';
import { useEffect, useState } from 'react';
import { InvoiceTemplate2 } from '../invoiceTemplates/invoice-template2.jsx';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [storeName, setStoreName] = useState("GST app pro");

  const [shopDetails, setShopDetails] = useState([]);


  // Fetch all products
  useEffect(() => {
    fetch("/api/products/all", {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
    .then(request => request.json())
    .then(response => {
      // console.log("all products", response);
      setLoading(false);  // Stop loading when data is fetched
    })
    .catch(error => {
      console.log(error);
      setLoading(false);  // Stop loading on error
    });
  }, []);

  // Fetch store details
  useEffect(() => {
    fetch("/api/shop/all", {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
    .then(request => request.json())
    .then(response => {
      if (response.data.length > 0) {
        console.log("Store Details ",response.data[0]);
        setShopDetails(response.data[0]);
        setStoreName(response.data[0].name); 
      }
    })
    .catch(error => console.log(error));
  }, []);

  return (
    <>
    <div >
   
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <Spinner accessibilityLabel="Loading Spinner" size="large" />
        </div>
      ) : (
        <Page fullWidth>
          <VerticalStack gap="10">
          <Layout>
              <Layout.Section>
               
                  <p style={{ display:"flex", gap:"20px", cursor: "pointer", float: 'right', textAlign: 'center', fontWeight: '600', fontSize: '20px' }}>
                    {storeName}
                    <Avatar customer name="Farrah" />
                  </p>
                
              </Layout.Section>
            </Layout>
            
            <BannerEx />

           
          </VerticalStack>
          
          <IndexTableEx value={1} fullWidth shopdetails={shopDetails} />
          {/* <InvoiceTemplate2 shopdetails={shopDetails} orders={[]} /> */}

          <FooterHelp>
            Need Help{' '}
            <Link url="" removeUnderline>
              please click here
            </Link>
          </FooterHelp>
        </Page>
      )}
      </div>
    </>
  );
}
