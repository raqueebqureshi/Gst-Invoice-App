import {Select} from '@shopify/polaris';
import {useState, useCallback} from 'react';

export function SelectPostal() {
  const [selected, setSelected] = useState('today');

  const handleSelectChange = useCallback(
    (newValue) => setSelected(newValue),
    [],
  );

  const countries = [
    {label: 'United States', value: 'US'},
    {label: 'Canada', value: 'CA'},
    {label: 'United Kingdom', value: 'UK'},
    {label: 'Australia', value: 'AU'},
    {label: 'Germany', value: 'DE'},
    {label: 'France', value: 'FR'},
    {label: 'India', value: 'IN'},
    {label: 'China', value: 'CN'},
    {label: 'Japan', value: 'JP'},
    {label: 'Brazil', value: 'BR'},
    {label: 'South Africa', value: 'ZA'},
    {label: 'Mexico', value: 'MX'},
    {label: 'Italy', value: 'IT'},
    {label: 'Spain', value: 'ES'},
    {label: 'Russia', value: 'RU'},
    {label: 'South Korea', value: 'KR'},
    {label: 'Argentina', value: 'AR'},
    {label: 'Nigeria', value: 'NG'},
    {label: 'Netherlands', value: 'NL'},
    {label: 'Saudi Arabia', value: 'SA'},
    {label: 'New Zealand', value: 'NZ'},
    {label: 'Sweden', value: 'SE'},
    {label: 'Norway', value: 'NO'},
    {label: 'Switzerland', value: 'CH'},
    {label: 'Turkey', value: 'TR'},
    {label: 'United Arab Emirates', value: 'AE'}
  ];
  

  return (
    <div style={{paddingTop: '10px',}}>  
    <Select
      label="Country"
      options={countries}
      onChange={handleSelectChange}
      value={selected}
    />
    </div>
  );
}