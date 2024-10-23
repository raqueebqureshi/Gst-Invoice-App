// import { Page, Layout, TextField, Button, FooterHelp, Link, AlphaCard, VerticalStack } from "@shopify/polaris";
// import { useState, useCallback } from "react";


// export default function ContactUs() {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [message, setMessage] = useState('');

//   const handleNameChange = useCallback((newValue) => setName(newValue), []);
//   const handleEmailChange = useCallback((newValue) => setEmail(newValue), []);
//   const handleMessageChange = useCallback((newValue) => setMessage(newValue), []);

//   const handleSubmit = () => {
//     console.log('Submitted:', { name, email, message });
//     // You can add your form submission logic here
//   };

//   return (
//     <Page title="Contact Us">
//       <Layout>
//         <Layout.Section>
//           <AlphaCard sectioned>
//             <VerticalStack className="contact-us__card p-400">
//               <p>
//                 We'd love to hear from you! Please fill out the form below and we'll get back to you as soon as possible.
//               </p>
//             </VerticalStack>
//             <form onSubmit={handleSubmit}>
//               <VerticalStack className="contact-us__card p-400">
//                 <TextField
//                   label="Your Name"
//                   value={name}
//                   onChange={handleNameChange}
//                   autoComplete="name"
//                   required
//                 />
//                 <TextField
//                   type="email"
//                   label="Your Email"
//                   value={email}
//                   onChange={handleEmailChange}
//                   autoComplete="email"
//                   required
//                 />
//                 <TextField
//                   type="subject"
//                   label="Your Subject"
//                   value={email}
//                   onChange={handleEmailChange}
//                   autoComplete="email"
//                   required
//                 />
//                 <TextField
//                   label="Message"
//                   value={message}
//                   onChange={handleMessageChange}
//                   multiline={4}
//                   autoComplete="off"
//                   required
//                 />
//                 <div style={{ paddingTop: '20px' }}>
//                   <Button primary onClick={handleSubmit}>Submit</Button>
//                 </div>
              
//               </VerticalStack>
//             </form>
//           </AlphaCard>
//         </Layout.Section>
//       </Layout>
//       <FooterHelp >
//       Need Help{' '}
//       <Link url="" removeUnderline>
//         please click here
//       </Link>
//     </FooterHelp>
//     </Page>
//   );
// }


import { Page, Layout, TextField, Button,   FooterHelp, Link, AlphaCard, VerticalStack } from "@shopify/polaris";
import { useState, useCallback } from "react";

export default function ContactUs() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState(''); // Added subject state
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const handleNameChange = useCallback((newValue) => setName(newValue), []);
  const handleEmailChange = useCallback((newValue) => setEmail(newValue), []);
  const handleSubjectChange = useCallback((newValue) => setSubject(newValue), []); // Handle subject
  const handleMessageChange = useCallback((newValue) => setMessage(newValue), []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionStatus(null);

    const formData = { name, email, subject, message };
    console.log('Form data:', formData);
    
    try {
      const response = await fetch('/api/contact_us', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmissionStatus('Form submitted successfully! We will get back to you soon.');
      } else {
        setSubmissionStatus('Error submitting form.');
      }
    } catch (error) {
      setSubmissionStatus('Error submitting form.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Page title="Contact Us">
      <Layout>
        <Layout.Section>
          <AlphaCard sectioned>
            <VerticalStack className="contact-us__card p-400">
              <p>
                We'd love to hear from you! Please fill out the form below and we'll get back to you as soon as possible.
              </p>
            </VerticalStack>
            <form onSubmit={handleSubmit}>
              <VerticalStack className="contact-us__card p-400">
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
                  label="Your Subject"
                  value={subject}
                  onChange={handleSubjectChange}
                  autoComplete="subject"
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
                <div style={{ paddingTop: '20px' }}>
                  <Button primary submit disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit'}
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
      <FooterHelp >
        Need Help{' '}
        <Link url="" removeUnderline>
          please click here
        </Link>
      </FooterHelp>
    </Page>
  );
}
