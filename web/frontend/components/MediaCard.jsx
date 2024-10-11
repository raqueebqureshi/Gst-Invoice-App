import {MediaCard} from '@shopify/polaris';
import React from 'react';

export function MediaCardExample() {
  return (
    <MediaCard
      title="Bold"
      primaryAction={{
        content: 'Customize',
        onAction: () => {},
      }}
      description="Make a statement without overwhelming your clients. Our elegant invoice features a simple design that put the focus on your business."
    //   popoverActions={[{content: 'Dismiss', onAction: () => {}}]}
    >
      <img
        alt=""
        width="100%"
        height="100%"
        style={{
          objectFit: 'cover',
          objectPosition: 'center',
          margin: '20px ',
          borderRadius: '10px 10px 10px 10px',
        }}
        src="assets/invoice.png"
      />
    </MediaCard>
  );
}

export function MediaCardExample2({imageSrc, title, primaryAction, description, secondaryAction}) {
    return (
      <MediaCard
        title= {title}
        primaryAction={{
          content: primaryAction,
          onAction: () => {},
        }}
    
        description={description}
        popoverActions={[{content: 'Select', onAction: () => {}}]}
      >
        <img
          alt=""
          width="100%"
          height="100%"
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
            margin: '20px ',
            borderRadius: '10px 10px 10px 10px',
          }}
          src={imageSrc}
        />
      </MediaCard>
    );
  }