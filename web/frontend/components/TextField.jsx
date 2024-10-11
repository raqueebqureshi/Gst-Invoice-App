import { TextField } from '@shopify/polaris';
import { useState, useCallback } from 'react';
import "@shopify/polaris/build/esm/styles.css";


export function TextFieldExample({label}) {
  const [value, setValue] = useState('');

  const handleChange = useCallback(
    (newValue) => setValue(newValue), // Remove type annotation (: string)
    []
  );

  return (
    <div style={{paddingTop: '10px',}}>  
    <TextField
      label={label}
      value={value}
      onChange={handleChange}
      autoComplete="off"
    /></   div>
  );
}

