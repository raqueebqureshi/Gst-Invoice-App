import { Page, Layout, TextField, Button, AlphaCard, VerticalStack } from "@shopify/polaris";
import { useState , useEffect} from "react";

export default function ContactUs() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Track loading state
  const [storeName, setStoreName] = useState("");
  const [storeDetails, setStoreDetails] = useState({});
  const [lastMonthOrders, setLastMonthOrders] = useState([]);
  

  async function fetchLastMonthOrders() {
    const currentDate = new Date();
  
    // Calculate the first and last day of the previous month in UTC
    const firstDayLastMonth = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth() - 1, 1));
    const lastDayLastMonth = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), 0));
  
    // Format the dates for the query
    const startDate = firstDayLastMonth.toISOString().split("T")[0] + "T00:00:00Z";
    const endDate = lastDayLastMonth.toISOString().split("T")[0] + "T23:59:59Z";
  
    console.log("Fetching orders from:", startDate, "to", endDate);
  
    try {
      // Fetch orders from Shopify API
      const response = await fetch(
        `/api/2024-10/orders.json?created_at_min=${startDate}&created_at_max=${endDate}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (!response.ok) {
        console.error("Failed to fetch orders:", response.statusText);
        return [];
      }
  
      const data = await response.json();
  
      console.log("Fetched orders:", data);
  
      // Assuming the API returns orders in `data.orders`
      return data.data || [];
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  }
  
  // Example Usage
  (async () => {
    const orders = await fetchLastMonthOrders();
    console.log("Orders from last month:", orders);
  })();
  


    useEffect(() => {
      const getOrders = async () => {
        const orders = await fetchLastMonthOrders();
        setLastMonthOrders(orders);
      };
  
      getOrders();
    }, []);
//Fetch store details and send with email
  useEffect(() => { 
    fetch("/api/shop/all", {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
    .then(request => request.json())
    .then(response => {
      if (response.data.length > 0) {
        console.log("Store Details ",response.data[0]);
        setStoreName(response.data[0].name);
        setStoreDetails({
          Store_name: response.data[0].name,
          email: response.data[0].email,
          phone: response.data[0].phone,
          domain: response.data[0].domain
          
        }); 
        console.log("Send in email" , storeDetails)
      }
    })
    .catch(error => console.log(error));
  }, []);


  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true); // Start loading

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, subject, message , storeDetails }),
      });

      const data = await response.json();
      if (data.status === 'success') {
        setSubmissionStatus('Your query has been sent to app support. Expected response within 24 hours!');
      } else {
        setSubmissionStatus('There was an error sending your message. Please try again.');
      }

      // Clear the form fields
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (error) {
      setSubmissionStatus('There was an error sending your message. Please try again.');
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
              <h5 style={{ marginBottom: '30px', textDecoration: 'underline', fontWeight: 'bold' }}>
                We'd love to hear from you! Please fill out the form below and we'll get back to you as soon as possible.
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
                <div style={{ paddingTop: '20px' }}>
                  <Button submit primary loading={isSubmitting}>Send</Button>
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

       <h2>Last Month Orders</h2>
                        <p>Total Orders: {lastMonthOrders.length}</p>
    </Page>
  );
}
