// import { MediaCard, Button } from '@shopify/polaris';
// import React from 'react';

// export function MediaCardExample2({ imageSrc, title, primaryAction, secondaryAction,secondaryAct, description, isSelected, onSelect }) {
//   return (
//     <MediaCard
//       title={
//         <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'space-between' }}>
//           <span>{title}</span>
        
//           <Button
//             variant="primary"
//             size="slim"
//             primary={!isSelected}
//             disabled={isSelected}
//             onClick={onSelect}
//           >
//             {isSelected ? 'Selected' : 'Select'}
//           </Button>
          
//         </div>
//       }
//       primaryAction={{
//         content: primaryAction,
//         onAction: () => {},
//       }}
//       secondaryAction={{
//         content: secondaryAction,
//         onAction: () => {secondaryAct}}}
//       description={description}
//     >
//       <img
//         alt=""
//         style={{
//           width: '100%',
//           height: '100%',
//           objectFit: 'cover',
//           objectPosition: 'center',
//           borderRadius: '10px ',
//         }}
//         src={imageSrc}
//       />
//     </MediaCard>
//   );
// }


import { MediaCard, Button } from '@shopify/polaris';
import React from 'react';

export function MediaCardExample2({ imageSrc, title, primaryAction, secondaryAction, secondaryAct, description, isSelected, onSelect }) {
  return (
    <MediaCard
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'space-between' }}>
          <span>{title}</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px' }}>
            <Button
              variant="primary"
              size="slim"
              primary={!isSelected}
              disabled={isSelected}
              onClick={onSelect}
            >
              {isSelected ? 'Selected' : 'Select'}
            </Button>
            <Button
              variant="primary"
              size="slim"
              onClick={secondaryAct}
            >
             {isSelected ? 'Customize' : 'Preview & Customize'}
            </Button>
          </div>
        </div>
      }
      secondaryAction={{
        content: secondaryAction,
        onAction: secondaryAct,
      }}
      description={
        // Replace <div> with <span> or pass the string directly
        <span style={{ marginTop: '20px' }}>{description}</span>
      }
    >
      <img
        alt=""
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          borderRadius: '10px',
        }}
        src={imageSrc}
      />
    </MediaCard>
  );
}

