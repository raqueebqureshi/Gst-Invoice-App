import { Page } from "@shopify/polaris";

import { useTranslation } from "react-i18next";

import { IndexTableEx } from "../components/IndexTable.jsx";
import "@shopify/polaris/build/esm/styles.css";
import { useEffect, useState } from 'react';

import '../styles.css';


export default function Orders() {
  const { t } = useTranslation();

  const [shopDetails, setShopDetails] = useState([]);

  // Fetch store details
  useEffect(() => {
    fetch("/api/2024-10/shop.json", {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
    .then(request => request.json())
    .then(response => {
      console.log("Store Details---!",response.data);
      if (response.data.data.length > 0) {
        console.log("Store Details---",response.data.data[0]);
        setShopDetails(response.data.data[0]);
    
      }
    })
    .catch(error => console.log(error));
  }, []);



  
  return (
    <Page fullWidth>
  
      <IndexTableEx value={1} fullWidth shopdetails={shopDetails} />

      
    </Page>
  );
}
