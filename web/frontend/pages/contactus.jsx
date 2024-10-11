import { Page, Layout, TextField, Button, Card, Stack, TextContainer, FooterHelp, Link } from "@shopify/polaris";
import { useState, useCallback } from "react";

export default function ContactUs() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleNameChange = useCallback((newValue) => setName(newValue), []);
  const handleEmailChange = useCallback((newValue) => setEmail(newValue), []);
  const handleMessageChange = useCallback((newValue) => setMessage(newValue), []);

  const handleSubmit = () => {
    console.log('Submitted:', { name, email, message });
    // You can add your form submission logic here
  };

  return (
    <Page title="Contact Us">
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <TextContainer>
              <p>
                We'd love to hear from you! Please fill out the form below and we'll get back to you as soon as possible.
              </p>
            </TextContainer>
            <form onSubmit={handleSubmit}>
              <Stack vertical>
                <TextField
                  label="Your Name"
                  value={name}
                  onChange={handleNameChange}
                  autoComplete="name"
                  required
                />
                <TextField
                  type="email"
                  label="Your Email"
                  value={email}
                  onChange={handleEmailChange}
                  autoComplete="email"
                  required
                />
                <TextField
                  label="Message"
                  value={message}
                  onChange={handleMessageChange}
                  multiline={4}
                  autoComplete="off"
                  required
                />
                <Button primary onClick={handleSubmit}>Submit</Button>
              </Stack>
            </form>
          </Card>
        </Layout.Section>
      </Layout>
      <FooterHelp >
      Need Help{' '}
      <Link url="" removeUnderline>
        please click here
      </Link>
    </FooterHelp>
    </Page>
  );
}
