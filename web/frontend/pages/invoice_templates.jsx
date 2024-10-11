import { Layout, Page} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import { MediaCardExample } from "../components/MediaCard";
import { Divider } from "@shopify/polaris";



export default function Orders() {
  const { t } = useTranslation();
  return (
    <Page>
      <TitleBar title={t("InvoiceTemplates.title")}>
        <button variant="primary" onClick={() => console.log("Primary action")}>
          {t("InvoiceTemplates.primaryAction")}
        </button>
      </TitleBar>
      <Layout >
        <p style={{paddingTop: '20px', textAlign: 'start', width: '90%', fontWeight: '600'}}>Selected invoice template</p>
        <div style={{paddingTop: '20px', display: 'flex', gap: '10px', justifyContent: 'space-between', width : '90%'}}>
            <MediaCardExample />
        
</div>
    </Layout>
    <div style={{padding: '20px',}}>
    <Divider />
        
</div>
    
      
      

    </Page>
  );
}
