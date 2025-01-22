import {Page, Grid,  AlphaCard} from '@shopify/polaris';
import React from 'react';

export function GridExample() {
  return (
    <Page fullWidth>
      <Grid>
        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
          <AlphaCard title="Orders" sectioned>
            <p>View a summary of your online store’s sales.</p>
          </AlphaCard>
        </Grid.Cell>
        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
          <AlphaCard title="Products" sectioned>
            <p>View a summary of your online store’s orders.</p>
          </AlphaCard>
        </Grid.Cell>

      </Grid>
    </Page>
  );
}