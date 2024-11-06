import { MediaCard, Button } from '@shopify/polaris';
import React from 'react';

export function MediaCardExample2({ imageSrc, title, primaryAction, description, isSelected, onSelect }) {
  return (
    <MediaCard
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'space-between' }}>
          <span>{title}</span>
        
          <Button
            variant="primary"
            size="slim"
            primary={!isSelected}
            disabled={isSelected}
            onClick={onSelect}
          >
            {isSelected ? 'Selected' : 'Select'}
          </Button>
        </div>
      }
      primaryAction={{
        content: primaryAction,
        onAction: () => {},
      }}
      description={description}
    >
      <img
        alt=""
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          borderRadius: '10px ',
        }}
        src={imageSrc}
      />
    </MediaCard>
  );
}
