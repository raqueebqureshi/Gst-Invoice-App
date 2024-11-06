import { AlphaCard, Page, Layout, TextContainer, Text, FooterHelp, Link } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import { BannerEx } from "../components/Banner";
import { IndexTableEx } from "../components/IndexTable.jsx";
import "@shopify/polaris/build/esm/styles.css";
import { useEffect, useState } from 'react';

import '../styles.css';


export default function Orders() {
  const { t } = useTranslation();

  const [shopDetails, setShopDetails] = useState([]);

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
    <Page fullWidth>
      <TitleBar title={t("Orders.title")}>
        <button variant="primary" onClick={() => console.log("Primary action")}>
          {t("Orders.primaryAction")}
        </button>
      </TitleBar>

      <BannerEx />
      {/* <Layout >
        <div style={{ paddingTop: '20px', display: 'flex', gap: '10px', justifyContent: 'space-between', width: '100%' }}>
          <Layout.Section oneThird>
            <AlphaCard >
              <Text variant="headingMd" as="h2">
                Total Orders
              </Text>

              <p>1</p>

            </AlphaCard>
          </Layout.Section>

          <Layout.Section oneThird>
            <AlphaCard >
              <Text variant="headingMd" as="h2">
                Pending Orders
              </Text>

              <p>2</p>

            </AlphaCard>
          </Layout.Section>

          <Layout.Section oneThird>
            <AlphaCard >
              <Text variant="headingMd" as="h2">
                Completed Orders
              </Text>

              <p>3</p>

            </AlphaCard>
          </Layout.Section>
        </div>



      </Layout> */}
      {/* <IndexTableEx value={2} fullWidth /> */}
      <IndexTableEx value={1} fullWidth shopdetails={shopDetails} />

      <FooterHelp >
        Need Help{' '}
        <Link url="" removeUnderline>
          please click here
        </Link>
      </FooterHelp>
    </Page>
  );
}
