import {Button} from '@shopify/polaris';
import React from 'react';

export function ButtonEx() {
  return <Button variant="primary" onClick={() => console.log("Primary action")}>Save theme</Button>;
}