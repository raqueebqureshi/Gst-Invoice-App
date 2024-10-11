import { AlphaCard, Page, Layout, TextContainer, Text } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import { BannerEx } from "../components/Banner";
import { IndexTableEx } from "../components/IndexTable.jsx";


export default function Orders() {
  const { t } = useTranslation();
  return (
    <Page>
      <TitleBar title={t("Orders.title")}>
        <button variant="primary" onClick={() => console.log("Primary action")}>
          {t("Orders.primaryAction")}
        </button>
      </TitleBar>

      <BannerEx />
      <Layout >
        
          <div style={{paddingTop: '20px', display: 'flex', gap: '10px', justifyContent: 'space-between', width : '100%'}}>
            <Layout.Section oneThird> 
          <AlphaCard >
            <Text variant="headingMd" as="h2">
              Total Orders
            </Text>
            <TextContainer>
              <p>1</p>
            </TextContainer>
          </AlphaCard>
          </Layout.Section>

          <Layout.Section oneThird> 
          <AlphaCard >
            <Text variant="headingMd" as="h2">
              Pending Orders
            </Text>
            <TextContainer>
              <p>2</p>
            </TextContainer>
          </AlphaCard>
          </Layout.Section>

          <Layout.Section oneThird> 
          <AlphaCard >
            <Text variant="headingMd" as="h2">
              Completed Orders  
            </Text>
            <TextContainer>
              <p>3</p>
            </TextContainer>
          </AlphaCard>
          </Layout.Section>
          </div>
       
        
          
      </Layout>
      <IndexTableEx value={2} fullWidth/>

    </Page>
  );
}
