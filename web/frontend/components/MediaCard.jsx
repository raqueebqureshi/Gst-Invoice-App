import { Card, Button, Badge, Stack, AlphaCard, LegacyStack } from '@shopify/polaris';
import React from 'react';


export function MediaCardExample2({
 imageSrc,
 title,
 primaryAction,
 secondaryAction,
 secondaryAct,
 description,
 isSelected,
 onSelect,
 
}) {
 return (
   <AlphaCard
     style={{
       display: 'flex',
       borderRadius: '12px',
       overflow: 'hidden',
       boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
       margin: '0px 0',
       backgroundColor: '#f9fafb',
     }}
   >
     <div
       style={{
         flex: 1,
         backgroundImage: `url(${imageSrc})`,
         backgroundSize: 'cover',
         backgroundPosition: 'center',
         absolute: 'true',
         transition: 'transform 0.3s ease',
         borderTopRightRadius: '12px',
         borderTopLeftRadius: '12px',
         minHeight: '280px',
       }}
     />
     {/* Left Section - Content */}
     <div style={{ flex: 1, padding: '24px' }}>
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <h2 style={{ fontSize: '22px', fontWeight: 'bold', margin: 0 }}>{title}</h2>
         <Badge status={isSelected ? 'success' : 'attention'}>
           {isSelected ? 'Selected' : 'Available'}
         </Badge>
       </div>
       <p style={{ margin: '16px 0', color: '#606060', fontSize: '16px', lineHeight: '1.5' }}>
         {description}
       </p>
       <LegacyStack distribution="equalSpacing">
         <Button
           variant="primary"
           size="medium"
           primary={!isSelected}
           disabled={isSelected}
           onClick={onSelect}
         >
           {isSelected ? 'Selected' : 'Select'}
         </Button>
        
         <Button size="medium" onClick={secondaryAct} disabled={!isSelected}>
           { 'Customize' }
         </Button>
       </LegacyStack>
     </div>


     {/* Right Section - Image */}
    
   </AlphaCard>
 );
}



