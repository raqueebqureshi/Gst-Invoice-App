// import {Banner} from '@shopify/polaris';
// import React from 'react';
// import '@shopify/polaris/build/esm/styles.css';
// import {ButtonGroup, Button} from '@shopify/polaris';

// export function BannerEx() {
//   return (
//     <Banner title="Welcome to GST Invoice App" onDismiss={() => {}}>
    
//      <p style={{ marginBottom: '15px' }}>
//         This is where you can find your recent orders. Click on print button to export your PDFs. Questions? Read our FAQ or book a free demo with us
//       </p>
//         <ButtonGroup>
//           <Button primary>Book a demo</Button>
//           <Button>FAQ</Button>
//         </ButtonGroup>
      
//     </Banner>
//   );
// }

import { Banner } from "@shopify/polaris";
import {ButtonGroup, Button} from '@shopify/polaris';
import "@shopify/polaris/build/esm/styles.css";



export function BannerEx() {
  return (
    
    <Banner
      title="Welcome to GST Pro"
      status="info"
      onDismiss={() => {
        console.log("Banner dismissed");
      }}
    >
      <p style={{ marginBottom: '15px' }}>
        This is where you can find your recent orders. Click on the print button to export your PDFs. Questions? Read our FAQ or book a free demo with us.
      </p>
      <ButtonGroup>
//           <Button primary>Book a demo</Button>
//           <Button>FAQ</Button>
//         </ButtonGroup>
    </Banner>
  );
}

