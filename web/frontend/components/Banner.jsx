import { Banner } from "@shopify/polaris";
import { ButtonGroup, Button } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";
import { useState } from "react";

export function BannerEx() {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false); // Hide the banner by setting display to none
    // console.log("Banner dismissed");
  };

  return (
    <div
      style={{
        display: isVisible ? "block" : "none",
        width: "",
        justifyContent: "center",
      }}
    >
      <Banner
        title="Welcome to Indian GST Invoice"
        status="info"
        onDismiss={handleDismiss}
      >
        <p style={{ marginBottom: "15px" }}>
          This is where you can find your recent orders. Click on the print
          button to export your PDFs. Questions? Read our FAQ or book a free
          demo with us.
        </p>
        <ButtonGroup>
          // <Button primary>Complete setup</Button>
          //{" "}
        </ButtonGroup>
      </Banner>
    </div>
  );
}
