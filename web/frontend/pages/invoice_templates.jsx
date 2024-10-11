import { Layout, Page,FooterHelp, Link} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import { MediaCardExample, MediaCardExample2 } from "../components/MediaCard";
import { Divider } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";
import '../styles.css';




export default function Orders() {
  const { t } = useTranslation();
  return (
    <Page fullWidth>
      <TitleBar title={t("InvoiceTemplates.title")}>
        {/* <button variant="primary" onClick={() => console.log("Primary action")}>
          {t("InvoiceTemplates.primaryAction")}
        </button> */}
      </TitleBar>
      <Layout >
        <p style={{paddingTop: '20px', textAlign: 'start', width: '90%', fontWeight: '600'}}>Selected invoice template</p>
        <div style={{paddingTop: '20px', display: 'flex', gap: '10px', justifyContent: 'space-between', width : '90%'}}>
            <MediaCardExample />
        
</div>
    </Layout>
    <div style={{padding: '30px 30px 20px 10px',}}>
    <Divider />
</div>
<Layout >
        <p style={{paddingTop: '20px', textAlign: 'start', width: '90%', fontWeight: '600'}}>Available invoice template</p>
        <div style={{paddingTop: '20px', width : '90%'}}>
            <MediaCardExample2 imageSrc="assets/invoice2.png" 
            title="Celestial" primaryAction="Preview and Customize" 
            secondaryAction="Select" 
            description="Our elegant invoice showcases a simple design, 
            allowing the spotlight to shine on your business." />
            <MediaCardExample2 imageSrc="assets/invoice3.png" 
            title="Orbix" primaryAction="Preview and Customize" 
            secondaryAction="Select" 
            description="Make a statement without overwhelming your clients. 
            Our elegant invoice features a simple design that put the focus on your business." />
            <MediaCardExample2 imageSrc="assets/invoice4.png" 
            title="Sharp" primaryAction="Preview and Customize" 
            secondaryAction="Select" 
            description="Designed for professionals, this sleek invoice exudes 
            competence and confidence, leaving a lasting impression." />
</div>
    </Layout>
    <FooterHelp  >
    Didn't find anything you were looking for? We got you covered. Reach out to us at support{' '}
      <Link url="" removeUnderline>
       @delhidigital.co
      </Link>
    </FooterHelp>
      

    </Page>
  );
}
