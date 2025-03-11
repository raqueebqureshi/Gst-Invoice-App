import {
  Page,
  Layout,
  TextField,
  Button,
  AlphaCard,
  VerticalStack,
} from "@shopify/polaris";
import { useState, useEffect } from "react";

export default function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Track loading state
  const [storeName, setStoreName] = useState("");
  const [storeDetails, setStoreDetails] = useState({});

  //Fetch store details and send with email
  useEffect(() => {
    fetch("/api/2024-10/shop.json", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((request) => request.json())
      .then((response) => {
        if (response.data.data.length > 0) {
          // console.log("Store Details ",response.data[0]);
          setStoreName(response.data.data[0].name);
          setStoreDetails({
            Store_name: response.data.data[0].name,
            email: response.data.data[0].email,
            phone: response.data.data[0].phone,
            domain: response.data.data[0].domain,
          });
          // console.log("Send in email" , storeDetails)
        }
      })
      .catch((error) => console.log(error));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true); // Start loading

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, subject, message, storeDetails }),
      });

      const data = await response.json();
      if (data.status === "success") {
        setSubmissionStatus(
          "Your query has been sent to app support. Expected response within 4 hours!"
        );
      } else {
        setSubmissionStatus(
          "There was an error sending your message. Please try again."
        );
      }

      // Clear the form fields
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (error) {
      setSubmissionStatus(
        "There was an error sending your message. Please try again."
      );
    } finally {
      setIsSubmitting(false); // Stop loading
    }
  };

  return (
    <Page title="Contact Us">
      <Layout>
        <Layout.Section>
          <AlphaCard sectioned>
            <VerticalStack className="contact-us__card p-400">
              <h5 style={{ marginBottom: "30px", fontWeight: "600" }}>
                We'd love to hear from you! Please fill out the form below and
                we'll get back to you as soon as possible, or you can reach us
                on{" "}
                <span
                  style={{
                    fontWeight: "bolder",
                    textDecoration: "underline",
                  }}
                >
                  <a
                    href="https://api.whatsapp.com/send?phone=8527274859&text=Support%20Needed%20on%20*Indian%20GST%20Invoice%20Shopify%20App*"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                    WhatsApp at +91 8527274859
                  </a>
                </span>{" "}
                for a quicker response.
              </h5>
            </VerticalStack>
            <form onSubmit={handleSubmit}>
              <VerticalStack className="contact-us__card p-400">
                <TextField
                  label="Your Name"
                  value={name}
                  onChange={setName}
                  autoComplete="name"
                  required
                />
                <TextField
                  type="email"
                  label="Your Email"
                  value={email}
                  onChange={setEmail}
                  autoComplete="email"
                  required
                />
                <TextField
                  label="Your Subject"
                  value={subject}
                  onChange={setSubject}
                  autoComplete="subject"
                  required
                />
                <TextField
                  label="Message"
                  value={message}
                  onChange={setMessage}
                  multiline={4}
                  autoComplete="off"
                  required
                />
                <div style={{ paddingTop: "20px" }}>
                  <Button submit primary loading={isSubmitting}>
                    Send
                  </Button>
                </div>
              </VerticalStack>
            </form>
            {submissionStatus && (
              <VerticalStack>
                <p>{submissionStatus}</p>
              </VerticalStack>
            )}
          </AlphaCard>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
