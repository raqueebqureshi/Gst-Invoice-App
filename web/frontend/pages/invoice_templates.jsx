import React, { useState, useEffect } from 'react';
import { Page, Layout, FooterHelp, Link } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { MediaCardExample2 } from "../components/MediaCard";

export default function Orders() {
  const [storeDomain, setStoreDomain] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState("1"); // Default to template 1

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
        setSelectedTemplate(templateId); // Update selected template state
      })
      .catch(error => console.error("Error updating template:", error));
    } else {
      console.log("Store domain not available; cannot update template");
    }
  };

  return (
    <Page fullWidth>
      <TitleBar title="Invoice Templates" />
      <Layout>
        <p style={{ paddingTop: '20px', textAlign: 'start', width: '90%', fontWeight: '600' }}>Available Invoice Templates</p>
        <div style={{ paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px', width: '90%' }}>
          <MediaCardExample2
            imageSrc="assets/invoice.png"
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
            imageSrc="assets/invoice2.png"
            title="Classic"
            primaryAction=" Customize available soon.."
            isSelected={selectedTemplate === "2"} // Set isSelected based on selectedTemplate
            onSelect={() => {
              console.log("Celestial template select button clicked");
              if (selectedTemplate !== "2") handleSelectTemplate("2");
            }}
            description="Our elegant invoice showcases a simple design."
          />
        </div>
      </Layout>
      <FooterHelp style={{ marginTop: '40px' }}>
        Didn't find what you were looking for? Reach out to support at{' '}
        <Link url="mailto:support@delhidigital.co">support@delhidigital.co</Link>
      </FooterHelp>
    </Page>
  );
}
