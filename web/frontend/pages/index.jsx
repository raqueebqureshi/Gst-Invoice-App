import { Page, FooterHelp, Link, Layout, AlphaCard, VerticalStack } from '@shopify/polaris';
import { BannerEx } from "../components/Banner";
import { IndexTableEx } from "../components/IndexTable.jsx";
import "@shopify/polaris/build/esm/styles.css";
import '../styles.css';
import { useEffect, useTransition , useState} from 'react';




export default function HomePage() {
  // const {t} = useTransition();
//fetch all products
  useEffect(()=>{
    fetch ("/api/products/all", {
      method: "GET",
      headers: {"Content-Type" : "application/json"}
    })
    .then(request => request.json())
    .then(response => console.log("all products", response))
    .catch(error => console.log(error));
    
  });

//fetch store details
  useEffect(()=>{
    fetch ("/api/orders/all", {
      method: "GET",
      headers: {"Content-Type" : "application/json"}
    })
    .then(request => request.json())
    .then(response => console.log("orders details", response))
    .catch(error => console.log(error));
    
  });

  
  const [storeName, setStoreName] = useState("GST app pro");

  useEffect(() => {
    fetch("/api/shop/all", {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
    .then(request => request.json())
    .then(response => {
      // Access the first element of the array and set the store name
      if (response.data.length > 0) {
        setStoreName(response.data[0].name); // Set store name
      }
    })
    .catch(error => console.log(error));
  }, []);


  return (
    <Page fullWidth >
     <VerticalStack gap="4">
  <BannerEx />

  <Layout>
    <Layout.Section>
      <AlphaCard><p style={{ textAlign: 'center', fontWeight: '600', fontSize: '20px' }}>
       {storeName}
        </p></AlphaCard>
      
    </Layout.Section>
  </Layout>
</VerticalStack>
      <IndexTableEx value={1} fullWidth/>
      <FooterHelp >
      Need Help{' '}
      <Link url="" removeUnderline>
        please click here
      </Link>
    </FooterHelp>
    </Page>
  );
}
