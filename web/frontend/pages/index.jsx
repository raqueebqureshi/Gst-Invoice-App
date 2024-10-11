import { Page, FooterHelp, Link, Layout, AlphaCard, VerticalStack } from '@shopify/polaris';
import { BannerEx } from "../components/Banner";
import { IndexTableEx } from "../components/IndexTable.jsx";
import "@shopify/polaris/build/esm/styles.css";
import '../styles.css';




export default function HomePage() {
  return (
    <Page fullWidth >
     <VerticalStack gap="4">
  <BannerEx />

  <Layout>
    <Layout.Section>
      <AlphaCard><p style={{ textAlign: 'center', fontWeight: '600', fontSize: '20px' }}>
        Style Aroma Dashboard
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
