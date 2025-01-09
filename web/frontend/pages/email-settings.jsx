import React, { useState, useCallback, useEffect, use } from "react";
import {
  AlphaCard,
  Page,
  Button,
  Collapsible,
  FormLayout,
  TextField,
  Icon,
  VerticalStack,
  HorizontalStack,
  Badge,
  Box,
  Modal,
  Link,
  Tabs,
  LegacyStack,
  Text,
} from "@shopify/polaris";
import {
  CheckCircleIcon,
  SettingsIcon,
  InfoIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  EmailFollowUpIcon,
} from "@shopify/polaris-icons";
import { CustomPasswordInput } from "../components/CustomPasswordInput";

const EmailSetting = () => {
  const [isConnected, setIsConnected] = useState(true); // Mock connection status
  const [open, setOpen] = useState(false);
  const [popoverActive, setPopoverActive] = useState(false);
  const [emailSettings, setEmailSettings] = useState({
    host: "",
    port: "",
    username: "",
    password: "",
    fromEmail: "",
    fromName: "",
  });
  

  const [selectedTab, setSelectedTab] = useState(0);
  const [active, setActive] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isEnabledByApp, setIsEnabledByApp] = useState(false);
  const [sendEmailOnOrderPlaced, setsendEmailOnOrderPlaced] = useState();

  const [shopId, setShopId] = useState("");

  const handleButtonToggle = () => {
    setIsEnabled((prev) => !prev);
    if (isEnabled) {
      setOpen(false);
    } else {
      setOpen(true);
    }
    if(isEnabled){
      updateToggleSetting(shopId, !isEnabled);
    }else{
      updateToggleSetting(shopId, !isEnabled);
    }
  };

  const handleButtonByAppToggle = () => {
    setIsEnabledByApp((prev) => !prev);
    if(isEnabledByApp){
      updateToggleSettingbyApp(shopId, !isEnabledByApp);
    }else{
      updateToggleSettingbyApp(shopId, !isEnabledByApp);
    }
  };

  const handleButtonSendAuto = () => {
    setsendEmailOnOrderPlaced((prev) => !prev);
    if(sendEmailOnOrderPlaced){
      updateToggleSettingonOrderPlaced(shopId, !sendEmailOnOrderPlaced);
    }else{
      updateToggleSettingonOrderPlaced(shopId, !sendEmailOnOrderPlaced);
    }
  };

  const handleToggle = useCallback(() => setOpen((open) => !open), []);

  const handleChange = (field) => (value) => {
    setEmailSettings((prevSettings) => ({
      ...prevSettings,
      [field]: value,
    }));
  };

  const handleTestConfiguration = () => {
    console.log("Testing SMTP Configuration...", emailSettings);
  };

  const handleSave = () => {
    console.log("Saving Email Settings...", emailSettings);
    if (!shopId) {
      console.error("Missing shopId:", shopId);
      throw new Error("Invalid shopId.");
    }
    if (
      !emailSettings.host ||
      !emailSettings.port ||
      !emailSettings.username ||
      !emailSettings.password ||
      !emailSettings.fromEmail ||
      !emailSettings.fromName
    ) {
      console.error("Missing email settings:", emailSettings);
      throw new Error("Invalid email settings.");
    }
    saveSMTPConfiguration(shopId, emailSettings);
  };

  const handleTabChange = useCallback((selectedIndex) => {
    setSelectedTab(selectedIndex);
  }, []);

  const toggleModal = () => setActive(!active);

  const tabs = [
    {
      id: "gmail",
      content: "Gmail",
      panelID: "gmail-panel",
      contentDetails: (
        <VerticalStack>
          {/* <h3>Gmail</h3> */}
          <ol>
            <li>
              Go to your{" "}
              <Link url="https://myaccount.google.com/security" external>
                Google Account settings
              </Link>{" "}
              and navigate to the "Security" tab.
            </li>
            <li>Enable "2-Step Verification" if not already enabled.</li>
            <li>Under "2-Step Verification", click on "App passwords".</li>
            <li>Create a new app-specific password. Enter a name for the app (e.g., "Indian GST Invoice").</li>
            <li>Click "Generate" to get your 16-character app password.</li>
            <li>Use this password in the SMTP configuration.</li>
            <li>SMTP Server: "smtp.gmail.com".</li>
            <li>Port: "465".</li>
            <li>Your Username is your full Gmail address.</li>
            <li>The "From Email" can be the same as your username or another email you've set up.</li>
            <li>
              Still not connecting? <Link url="mailto:support@example.com">Contact us</Link>.
            </li>
          </ol>
        </VerticalStack>
      ),
    },
    {
      id: "yahoo",
      content: "Yahoo",
      panelID: "yahoo-panel",
      contentDetails: (
        <VerticalStack>
          {/* <h3>Yahoo</h3> */}
          <ol>
            <li>
              Go to your{" "}
              <Link url="https://login.yahoo.com/account/security" external>
                Yahoo Account settings
              </Link>{" "}
              and enable "App Passwords".
            </li>
            <li>Select "Mail app" and generate a password.</li>
            <li>Use this password in your SMTP configuration.</li>
            <li>SMTP Server: "smtp.mail.yahoo.com".</li>
            <li>Port: "465".</li>
            <li>Your Username is your full Yahoo email address.</li>
            <li>The "From Email" can be the same as your username or another email.</li>
            <li>
              Still having issues? <Link url="mailto:support@example.com">Contact us</Link>.
            </li>
          </ol>
        </VerticalStack>
      ),
    },
    {
      id: "other-providers",
      content: "Other Providers",
      panelID: "other-providers-panel",
      contentDetails: (
        <VerticalStack>
          {/* <h3>Other Email Providers</h3> */}
          <p style={{ marginTop: "15px" }}>Please contact your email provider for the following details:</p>
          <ol>
            <li>SMTP Server address (e.g., smtp.yourmail.com).</li>
            <li>Port (common: "465" or "587").</li>
            <li>Your email address (used as the username).</li>
            <li>Your email account password or an app-specific password.</li>
            <li>If using SSL/TLS encryption, ensure your email client supports it.</li>
            <li>
              Still facing trouble? <Link url="mailto:support@example.com">Contact us</Link>.
            </li>
          </ol>
        </VerticalStack>
      ),
    },
  ];

  // Fetch store details
  useEffect(() => {
    fetch("/api/2024-10/shop.json", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((request) => request.json())
      .then((response) => {
        // console.log("Store Details---!", response.data);
        if (response.data.data.length > 0) {
          console.log("Store Details---", response.data.data[0]);
          setShopId(response.data.data[0].id);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (shopId) {
      fetchSMTPConfiguration(shopId);
      fetchToggleSetting(shopId);
    }
  }, [shopId]);

  useEffect(() => {
    console.log("emailSettings", emailSettings);
    
  }, [emailSettings]);

  const fetchSMTPConfiguration = async (shopId) => {
    try {
      // console.log("shopId:", shopId);

      if (!shopId) {
        console.error("Missing shopId.");
        throw new Error("Invalid shopId.");
      }

      const response = await fetch(`/api/smtp/get?shopId=${shopId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch settings. Status: ${response.status}`);
      }

      const data = await response.json();
      // console.log("Fetched settings:", data.smtpData);
      const smtpdata = data.smtpData;

      if (data) {
        // console.log("Fetched settings:", smtpdata);
        setEmailSettings({
          host: smtpdata.host || "",
          port: smtpdata.port || "",
          username: smtpdata.username || "",
          password: smtpdata.password || "",
          fromEmail: smtpdata.fromEmail || "",
          fromName: smtpdata.fromName || "",
        });
      } else {
        console.error("No data received from API.");
      }
    } catch (error) {
      console.error("Error while fetching settings:", error);
    }
  };

  const fetchToggleSetting = async (shopId) => {
    try {
      console.log("shopId:", shopId);

      if (!shopId) {
        console.error("Missing shopId.");
        throw new Error("Invalid shopId.");
      }

      const response = await fetch(`/api/check-status?shopId=${shopId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch settings. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("fetchToggleSetting:", data);
     setIsEnabled(data.sendByOwnEmail);
     setIsEnabledByApp(data.sendByAppEmail);
     setsendEmailOnOrderPlaced(data.sendOnOrderPlaced);
    } catch (error) {
      console.error("Error while fetching settings:", error);
    }
  };

  const updateToggleSetting = async (shopId, sendByOwnEmail) => {
    try {
      console.log("shopId:", shopId);
      console.log("sendByOwnEmail:", sendByOwnEmail);
      if (!shopId) {
        console.error("Missing shopId.");
        throw new Error("Invalid shopId.");
      }

      const response = await fetch(`/api/change-send-by-own-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopId,
          sendByOwnEmail
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch settings. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("fetchToggleSetting:", data);
     setIsEnabled(data.updatedConfig.sendByOwnEmail);
     
    } catch (error) {
      console.error("Error while fetching settings:", error);
    }
  };

  const updateToggleSettingbyApp = async (shopId, sendByAppEmail) => {
    try {
      console.log("shopId:", shopId);
      console.log("sendByAppEmail:", sendByAppEmail);
      if (!shopId) {
        console.error("Missing shopId.");
        throw new Error("Invalid shopId.");
      }

      const response = await fetch(`/api/change-send-by-app-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopId,
          sendByAppEmail
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch settings. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("fetchToggleSetting:", data);
     setIsEnabledByApp(data.updatedConfig.sendByAppEmail);
    } catch (error) {
      console.error("Error while fetching settings:", error);
    }
  };

  const updateToggleSettingonOrderPlaced = async (shopId, sendOnOrderPlaced) => {
    try {
      console.log("shopId:", shopId);
      console.log("sendOnOrderPlaced:", sendOnOrderPlaced);
      if (!shopId) {
        console.error("Missing shopId.");
        throw new Error("Invalid shopId.");
      }

      const response = await fetch(`/api/change-send-on-order-placed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopId,
          sendOnOrderPlaced
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch settings. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("fetchToggleSetting:", data);
     setsendEmailOnOrderPlaced(data.updatedConfig.sendOnOrderPlaced);
    } catch (error) {
      console.error("Error while fetching settings:", error);
    }
  };

  const saveSMTPConfiguration = async (shopId, smtpData) => {
    console.log("shopId ", shopId);
    console.log("smtpData ", smtpData);
    try {
      if (!shopId) {
        console.error("Missing shopId:", shopId);
        throw new Error("Invalid shopId.");
      }

      const response = await fetch("/api/smtp/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopId,
          smtpData,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save settings. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Saved settings:", data);
    } catch (error) {
      console.error("Error while save settings:", error);
    }
  };

  return (
    <Page title="Email Configuration" fullWidth>
      <div>
        <AlphaCard>
          <VerticalStack gap="5">
            <div style={styles.headerContainer}>
              <div style={styles.titleSection}>
                <Icon source={SettingsIcon} color="highlight" />
                <h2 style={styles.titleText}>Send from my own Email</h2>
                <Button plain icon={InfoIcon} onClick={toggleModal}>
                  How to configure SMTP?
                </Button>
                {active && (
                  <Modal
                    open={active}
                    onClose={toggleModal}
                    title="How to set up SMTP"
                    primaryAction={{
                      content: "Got it!",
                      onAction: toggleModal,
                    }}
                    large
                  >
                    <Modal.Section>
                      <Tabs
                        tabs={tabs.map((tab, index) => ({
                          id: tab.id,
                          content: tab.content,
                          panelID: tab.panelID,
                        }))}
                        selected={selectedTab}
                        onSelect={handleTabChange}
                      >
                        <div>{tabs[selectedTab].contentDetails}</div>
                      </Tabs>
                    </Modal.Section>
                  </Modal>
                )}
              </div>
              <LegacyStack alignment="center" spacing="tight">
                <Badge status={isEnabled ? "success" : "critical"}>{isEnabled ? "Enabled" : "Disabled"}</Badge>
                <div onClick={handleButtonToggle} style={styles.toggleWrapper}>
                  <div
                    style={{
                      ...styles.toggleCircle,
                      ...(isEnabled ? styles.on : styles.off),
                    }}
                  ></div>
                </div>
              </LegacyStack>
            </div>

            <div style={styles.collapsibleContainer} onClick={isEnabled ? handleToggle : null}>
              <div style={styles.collapsibleHeader}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <h3 style={{ margin: 0 }}>{open ? "Hide SMTP Configuration" : "Show SMTP Configuration"}</h3>
                  <Badge status={isEnabled ? "success" : "danger"}>{isEnabled ? "Connected" : "Not connected"}</Badge>
                </div>
                <div style={{ marginLeft: "auto" }}>
                  <Icon source={open ? ChevronUpIcon : ChevronDownIcon} />
                </div>
              </div>
            </div>

            <Collapsible
              open={open}
              id="smtp-collapsible"
              transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
            >
              <Box paddingBlockStart="4">
                <FormLayout>
                  <FormLayout.Group>
                    <TextField
                      label="Host"
                      value={emailSettings.host}
                      onChange={handleChange("host")}
                      autoComplete="off"
                      placeholder="e.g., smtp.mailtrap.io"
                    />
                    <TextField
                      label="Port"
                      type="number"
                      value={emailSettings.port}
                      onChange={handleChange("port")}
                      autoComplete="off"
                      placeholder="e.g., 587"
                    />
                  </FormLayout.Group>

                  <FormLayout.Group>
                    <TextField
                      label="Username"
                      value={emailSettings.username}
                      placeholder="Enter your username"
                      onChange={handleChange("username")}
                      autoComplete="off"
                    />
                    {/* <TextField
                    label="Password"
                    type="password"
                    value={emailSettings.password}
                    onChange={handleChange("password")}
                    autoComplete="off"
                  /> */}

                    <CustomPasswordInput
                      label="Password"
                      value={emailSettings.password}
                      onChange={handleChange("password")}
                      placeholder="Enter your password"
                    />
                  </FormLayout.Group>

                  {/* <TextField
                  label="Store Name"
                  value={emailSettings.storeName}
                  onChange={handleChange("storeName")}
                  autoComplete="off"
                  placeholder="Your Store Name"
                /> */}
                  <TextField
                    label="From Email"
                    type="email"
                    value={emailSettings.fromEmail}
                    onChange={handleChange("fromEmail")}
                    autoComplete="email"
                    placeholder="example@domain.com"
                  />
                  <TextField
                    label="From Name"
                    value={emailSettings.fromName}
                    onChange={handleChange("fromName")}
                    autoComplete="off"
                    placeholder="e.g., Support Team"
                  />
                </FormLayout>
              </Box>
            </Collapsible>

            <div style={styles.buttonWrapper}>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <Button onClick={handleTestConfiguration} disabled={isEnabled ? false : true} outline>
                  Send Test Email
                </Button>
                <p style={{ color: isEnabled ? "black" : "gray" }}>
                  Test email will be sent from <strong> entered@domain.com</strong> to <strong> store@email.com</strong>
                </p>
              </div>

              <Button primary onClick={handleSave} disabled={isEnabled ? false : true}>
                Save Settings
              </Button>
            </div>
          </VerticalStack>
        </AlphaCard>
      </div>
      <div style={{ marginTop: "20px" }}>
        <AlphaCard>
          <VerticalStack gap="5">
            <div style={styles.headerContainer}>
              <div style={styles.titleSection}>
                <Icon source={EmailFollowUpIcon} color="highlight" />
                <h2 style={styles.titleText}>Send from Indian GST Invoice App</h2>
              </div>
              <LegacyStack alignment="center" spacing="tight">
                <Badge status={isEnabledByApp ? "success" : "critical"}>
                  {isEnabledByApp ? "Enabled" : "Disabled"}
                </Badge>
                <div onClick={handleButtonByAppToggle} style={styles.toggleWrapper}>
                  <div
                    style={{
                      ...styles.toggleCircle,
                      ...(isEnabledByApp ? styles.on : styles.off),
                    }}
                  ></div>
                </div>
              </LegacyStack>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Button onClick={handleTestConfiguration} outline disabled={isEnabledByApp ? false : true}>
                Send Test Email
              </Button>
              <p style={{ color: isEnabledByApp ? "black" : "gray" }}>
                Test email will be sent from <strong> app@domain.com</strong> to <strong> store@email.com</strong>
              </p>
            </div>
          </VerticalStack>
        </AlphaCard>
      </div>

      <div style={{ marginTop: "20px" }}>
        <AlphaCard>
          <VerticalStack gap="5">
            <div style={styles.headerContainer}>
              <div style={styles.titleSection}>
                <Icon source={EmailFollowUpIcon} color="highlight" />
                <p>Automatically send invoice to customer on order placed!</p>
              </div>
              <LegacyStack alignment="center" spacing="tight">
                <Badge status={sendEmailOnOrderPlaced ? "success" : "critical"}>
                  {sendEmailOnOrderPlaced ? "Enabled" : "Disabled"}
                </Badge>
                <div onClick={handleButtonSendAuto} style={styles.toggleWrapper}>
                  <div
                    style={{
                      ...styles.toggleCircle,
                      ...(sendEmailOnOrderPlaced ? styles.on : styles.off),
                    }}
                  ></div>
                </div>
              </LegacyStack>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}></div>
          </VerticalStack>
        </AlphaCard>
      </div>
    </Page>
  );
};

const styles = {
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: "12px",
  },
  titleSection: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  titleText: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "600",
  },
  collapsibleContainer: {
    padding: "12px",
    backgroundColor: "#f4f6f8",
    borderRadius: "8px",
    cursor: "pointer",
  },
  collapsibleHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonWrapper: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "24px",
  },
  toggleWrapper: {
    width: "40px",
    height: "20px",
    borderRadius: "5px",
    backgroundColor: "#333", // Off background
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    padding: "2px",
    transition: "background-color 0.3s ease-in-out",
  },
  toggleCircle: {
    width: "16px",
    height: "16px",
    borderRadius: "20%",
    backgroundColor: "#fff",
    transition: "transform 0.3s ease-in-out",
  },
  on: {
    backgroundColor: "#0f0f0f0", // Green when enabled
    transform: "translateX(20px)",
  },
  off: {
    backgroundColor: "#f0f0f0", // Light gray background for off
    transform: "translateX(0px)",
  },
};

export default EmailSetting;
