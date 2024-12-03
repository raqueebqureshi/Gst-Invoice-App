import { Layout, Page, AlphaCard, Divider,FooterHelp, Link } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import { TextFieldExample } from "../components/TextField";
import "@shopify/polaris/build/esm/styles.css";
import { SelectPostal } from "../components/SelectPostal";
import { useEffect, useState } from 'react';


export default function Settings() {

  const [shopDetails, setShopDetails] = useState([]);
  const [storeName, setStoreName] = useState();




   // Fetch store details
   useEffect(() => {
    fetch("/api/2024-10/shop.json", {
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



  const { t } = useTranslation();
  return (
    <Page fullWidth>
      <TitleBar title={t("Settings.title")} style={{ fontweight: "bold" }}>
        {/* <button variant="primary" onClick={() => console.log("Primary action")}>
          {t("InvoiceTemplates.primaryAction")}
        </button> */}
      </TitleBar>

      <Layout>
        <Layout.Section oneThird>
          <p
            style={{
              paddingTop: "20px",
              paddingBottom: "5px",
              textAlign: "start",
              width: "100%",
              fontWeight: "600",
            }}
          >
            Store details
          </p>
          <p
            style={{
              color: "grey",
              textAlign: "start",
              width: "100%",
              fontWeight: "400",
            }}
          >
            The details about your store will appear on your invoices
          </p>
        </Layout.Section>
        <Layout.Section>
          <AlphaCard>
            <TextFieldExample label="Legal name of business" />
            <TextFieldExample label="Phone" />
            <Layout fullWidth>
              <div fullWidth style={{ display: "flex", width: "100%" }}>
                <Layout.Section oneHalf>
                  <TextFieldExample label="Sale email" />
                </Layout.Section>
                <Layout.Section oneHalf>
                  <TextFieldExample label="Contact email" />
                </Layout.Section>
              </div>
            </Layout>
            <TextFieldExample label="Website" />
            <TextFieldExample label="VAT number" />
            <TextFieldExample label="Registered number" />
          </AlphaCard>
        </Layout.Section>
      </Layout>
      <div style={{ padding: "30px 0px 30px 0px" }}>
        <Divider />
      </div>
      <Layout>
        <Layout.Section oneThird>
          <p
            style={{
              paddingTop: "20px",
              paddingBottom: "5px",
              textAlign: "start",
              width: "100%",
              fontWeight: "600",
            }}
          >
            Store address
          </p>
          <p
            style={{
              color: "grey",
              textAlign: "start",
              width: "100%",
              fontWeight: "400",
            }}
          >
            The physical store address will appear on your invoices
          </p>
        </Layout.Section>
        <Layout.Section>
          <AlphaCard>
            <TextFieldExample label="Address" />
            <TextFieldExample label="Apartment" />
            <Layout fullWidth>
              <div fullWidth style={{ display: "flex", width: "100%" }}>
                <Layout.Section oneHalf>
                  <TextFieldExample label="City" />
                </Layout.Section>
                <Layout.Section oneHalf>
                  <TextFieldExample label="Postal/ZIP code" />
                </Layout.Section>
              </div>
            </Layout>
            <SelectPostal />
          </AlphaCard>
        </Layout.Section>
      </Layout>
      <div style={{ padding: "30px 0px 30px 0px" }}>
        <Divider />
      </div>
      <Layout>
        <Layout.Section oneThird>
          <p
            style={{
              paddingTop: "20px",
              paddingBottom: "5px",
              textAlign: "start",
              width: "100%",
              fontWeight: "600",
            }}
          >
            Social networking
          </p>
          <p
            style={{
              color: "grey",
              textAlign: "start",
              width: "100%",
              fontWeight: "400",
            }}
          >
            Social networking information that your store used in the internet
          </p>
        </Layout.Section>
        <Layout.Section>
          <AlphaCard>
            <TextFieldExample label="Facebook" />
            <TextFieldExample label="Twitter" />
            <TextFieldExample label="Instagram" />
            <TextFieldExample label="Pinterest" />
            <TextFieldExample label="Youtube" />
          </AlphaCard>
        </Layout.Section>
      </Layout>
      <div style={{ padding: "60px 0px 60px 0px" }}></div>
      <FooterHelp >
      Need Help{' '}
      <Link url="" removeUnderline>
        please click here
      </Link>
    </FooterHelp>
    </Page>
  );
}


 
