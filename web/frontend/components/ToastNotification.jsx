// src/components/ToastNotification.js

import React, { useState, useCallback } from "react";
import { Toast, Frame } from "@shopify/polaris";

const ToastNotification = ({ message, duration = 4000 }) => {
  const [showToast, setShowToast] = useState(true);

  const handleDismiss = useCallback(() => setShowToast(false), []);

  return (
    <Frame>
      {showToast && (
        <Toast
          content={message}
          onDismiss={handleDismiss}
          duration={duration} // Default duration is 4000ms, can be customized
        />
      )}
    </Frame>
  );
};

export default ToastNotification;
