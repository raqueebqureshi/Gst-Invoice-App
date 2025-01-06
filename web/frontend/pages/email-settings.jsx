import React, { useState , useCallback } from 'react';
import { Card, Button, Stack,  Icon , LegacyCard,
  LegacyStack,
  Collapsible,
  TextContainer,
  Badge,
  FormLayout, TextField,
  Link,} from '@shopify/polaris';
  import {
    SettingsIcon
  } from '@shopify/polaris-icons';
// import { SettingsMajor, CircleTickMajor, CircleAlertMajor } from '@shopify/polaris-icons';

const EmailSetting = () => {
  const [isConnected, setIsConnected] = useState(true); // Mock connection status
  const [autoSend, setAutoSend] = useState(false); // Toggle auto-send emails
  const [open, setOpen] = useState(true);
  const handleToggle = useCallback(() => setOpen((open) => !open), []);
  const handleTestConfiguration = () => {
    // Logic for testing the SMTP configuration
    console.log('Testing SMTP Configuration...');
  };

  const handleSave = () => {
    // Logic to save the email settings
    console.log('Saving Email Settings...');
  };

  return (
    <LegacyCard title="Email Settings" sectioned>
    <div style={{height: '600px'}}>
    <LegacyCard sectioned>
      <LegacyStack vertical>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <Icon
  source={SettingsIcon}
  tone="base"
/>
        <Button
          onClick={handleToggle}
          ariaExpanded={open}
          ariaControls="basic-collapsible"
        >
          SMTP Email Configuration
        </Button>
        <Badge tone="success">Active</Badge>  
        </div>
        
        <Collapsible
          open={open}
          id="basic-collapsible"
          transition={{duration: '500ms', timingFunction: 'ease-in-out'}}
          expandOnPrint
        >
          <FormLayout>
          <FormLayout.Group>
        <TextField
          type="text"
          label="Host"
          onChange={() => {}}
          autoComplete="off"
        />
        <TextField
          type="text"
          label="Port"
          onChange={() => {}}
          autoComplete="off"
        />
      </FormLayout.Group>
      <FormLayout.Group>
        <TextField
          type="text"
          label="Username"
          onChange={() => {}}
          autoComplete="off"
        />
        <TextField
          type="password"
          label="Password"
          onChange={() => {}}
          autoComplete="off"
        />
      </FormLayout.Group>
      <TextField label="Store name" onChange={() => {}} autoComplete="off" />
      <TextField
        type="email"
        label="From Email"
        onChange={() => {}}
        autoComplete="email"
      />
      <TextField
        type="email"
        label="From Name"
        onChange={() => {}}
        autoComplete="email"
      />

    </FormLayout>
        </Collapsible>
      </LegacyStack>
    </LegacyCard>
  </div>
  </LegacyCard>
  );
};

export default EmailSetting;
