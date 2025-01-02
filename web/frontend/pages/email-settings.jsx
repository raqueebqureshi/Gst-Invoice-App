import React, { useState } from "react";
import { Page, Layout, Card, TextField, Button, Banner } from "@shopify/polaris";

const SMTPForm = () => {
  const [smtpConfig, setSmtpConfig] = useState({
    host: "",
    port: "",
    username: "",
    password: "",
    fromEmail: "",
    fromName: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (field) => (value) => {
    setSmtpConfig({ ...smtpConfig, [field]: value });
  };

  const handleTestConfiguration = async () => {
    try {
      // Simulate a test configuration API call
      const response = await fetch("/test-smtp-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(smtpConfig),
      });

      if (response.ok) {
        setSuccessMessage("SMTP Configuration is successful!");
        setErrorMessage("");
      } else {
        setErrorMessage("Failed to validate SMTP Configuration.");
        setSuccessMessage("");
      }
    } catch (error) {
      setErrorMessage("Error testing SMTP Configuration.");
      setSuccessMessage("");
    }
  };

  const handleSaveConfiguration = async () => {
    try {
      // Simulate a save configuration API call
      const response = await fetch("/save-smtp-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(smtpConfig),
      });

      if (response.ok) {
        setSuccessMessage("SMTP Configuration saved successfully!");
        setErrorMessage("");
      } else {
        setErrorMessage("Failed to save SMTP Configuration.");
        setSuccessMessage("");
      }
    } catch (error) {
      setErrorMessage("Error saving SMTP Configuration.");
      setSuccessMessage("");
    }
  };

  return (
    <Page title="SMTP Configuration">
      <Layout>
        <Layout.Section>
          {successMessage && (
            <Banner status="success" title={successMessage} onDismiss={() => setSuccessMessage("")} />
          )}
          {errorMessage && (
            <Banner status="critical" title={errorMessage} onDismiss={() => setErrorMessage("")} />
          )}
          <Card sectioned>
            <TextField
              label="Host"
              value={smtpConfig.host}
              onChange={handleChange("host")}
              placeholder="e.g., smtp.gmail.com"
            />
            <TextField
              label="Port"
              value={smtpConfig.port}
              onChange={handleChange("port")}
              placeholder="e.g., 587"
            />
            <TextField
              label="Username"
              value={smtpConfig.username}
              onChange={handleChange("username")}
              placeholder="Your SMTP username"
            />
            <TextField
              label="Password"
              value={smtpConfig.password}
              onChange={handleChange("password")}
              placeholder="Your SMTP password"
              type="password"
            />
            <TextField
              label="From Email"
              value={smtpConfig.fromEmail}
              onChange={handleChange("fromEmail")}
              placeholder="e.g., youremail@example.com"
            />
            <TextField
              label="From Name"
              value={smtpConfig.fromName}
              onChange={handleChange("fromName")}
              placeholder="e.g., Your Company Name"
            />
            <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
              <Button onClick={handleTestConfiguration}>Test Configuration</Button>
              <Button primary onClick={handleSaveConfiguration}>
                Save Configuration
              </Button>
            </div>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default SMTPForm;
