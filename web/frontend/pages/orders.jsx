import { AlphaCard, Page, Layout, TextContainer, Text, FooterHelp, Link } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import { BannerEx } from "../components/Banner";
import { IndexTableEx } from "../components/IndexTable.jsx";
import "@shopify/polaris/build/esm/styles.css";
import '../styles.css';


export default function Orders() {
  const { t } = useTranslation();
  return (
    <Page fullWidth>
      <TitleBar title={t("Orders.title")}>
        <button variant="primary" onClick={() => console.log("Primary action")}>
          {t("Orders.primaryAction")}
        </button>
      </TitleBar>

      <BannerEx />
      <Layout >
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



      </Layout>
      <IndexTableEx value={2} fullWidth />

      <FooterHelp >
        Need Help{' '}
        <Link url="" removeUnderline>
          please click here
        </Link>
      </FooterHelp>
    </Page>
  );
}
