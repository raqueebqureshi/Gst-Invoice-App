import React, { useState, useEffect } from 'react';
import { Page, Layout, FooterHelp, Link ,Spinner} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { MediaCardExample2 } from "../components/MediaCard";
import invoice1 from '../assets/invoice.png'
import invoice2 from '../assets/invoice2.png'
import invoice3 from '../assets/invoice3.png'




export default function Orders() {
  const [storeDomain, setStoreDomain] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedTemplate, setSelectedTemplate] = useState(); // Default to template 1

  // Fetch the store domain
  useEffect(() => {
    console.log("Fetching store details...");
    fetch("/api/shop/all", {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(data => {
      console.log("Store data fetched:", data);
      if (data.data && data.data.length > 0) {
        // Access the domain from the correct property
        setStoreDomain(data.data[0].domain); 
        console.log("Store domain set:", data.data[0].domain);
      }
    })
    .catch(error => console.log("Error fetching store details:", error));
  }, []);

  useEffect(() => {
    if (storeDomain) {
      fetch(`/api/get-invoice-template?storeDomain=${storeDomain}`)
        .then(response => response.json())
        .then(data => {
          if (data.storeInvoiceTemplate) {
            console.log("Fetched template ID from DB:", data.storeInvoiceTemplate);
            setSelectedTemplate(data.storeInvoiceTemplate); // Store template ID for comparison or other use
            setLoading(false);  
          }
        })
        .catch(error => console.error("Error fetching template ID:", error));
        
    }
  }, [storeDomain]);

  // Function to handle invoice template selection
  const handleSelectTemplate = (templateId) => {
    console.log("Selected template:", templateId);
    if (storeDomain) {
      fetch("/api/update-invoice-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeDomain,
          invoiceTemplate: templateId
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log("API response for updating template:", data);
        setSelectedTemplate(data.storeInvoiceTemplate); // Update selected template state

      })
      .catch(error => console.error("Error updating template:", error));
    } else {
      console.log("Store domain not available; cannot update template");
    }
  };

 
  return (
    <>
    {loading ? (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Spinner accessibilityLabel="Loading Spinner" size="large" />
      </div>
    ) :
    <Page fullWidth>
      <TitleBar title="Invoice Templates" />
      <Layout>

        <p style={{ paddingTop: '20px', textAlign: 'start', width: '90%', fontWeight: '600' }}>Available Invoice Templates</p>
        <div style={{ paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px', width: '90%' }}>
          <MediaCardExample2
            // imageSrc="assets/invoice.png"
            imageSrc={invoice1}
            title="Pain"
            primaryAction=" Customize available soon.."
            isSelected={selectedTemplate === "1"} // Set isSelected based on selectedTemplate
            onSelect={() => {
              console.log("Bold template select button clicked");
              if (selectedTemplate !== "1") handleSelectTemplate("1");
            }}
            description="Make a statement without overwhelming your clients. Elegant invoice design."
          />
          <MediaCardExample2
           imageSrc={invoice2}
            // imageSrc="assets/invoice2.png"
            title="Classic"
            primaryAction=" Customize available soon.."
            isSelected={selectedTemplate === "2"} // Set isSelected based on selectedTemplate
            onSelect={() => {
              console.log("Celestial template select button clicked");
              if (selectedTemplate !== "2") handleSelectTemplate("2");
            }}
            description="Our elegant invoice showcases a simple design."
          />
          <MediaCardExample2
           imageSrc={invoice3}
            // imageSrc="assets/invoice3.png"
            title="Decent"
            primaryAction=" Customize available soon.."
            isSelected={selectedTemplate === "3"} // Set isSelected based on selectedTemplate
            onSelect={() => {
              console.log("Celestial template select button clicked");
              if (selectedTemplate !== "3") handleSelectTemplate("3");
            }}
            description="Designed for professionals, this sleek invoice exudes competence and confidence, leaving a lasting impression."
          />
        </div>
      </Layout>
      <FooterHelp style={{ marginTop: '40px' }}>
        Didn't find what you were looking for? Reach out to support at{' '}
        <Link url="mailto:support@delhidigital.co">support@delhidigital.co</Link>
      </FooterHelp>
    </Page>
    }
    </>
  );
}
