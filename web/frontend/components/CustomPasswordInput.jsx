import React, { useState } from "react";
import { Icon } from "@shopify/polaris";
// import { HideIcon, ViewIcon } from "@shopify/polaris-icons";
import { BiSolidHide } from "react-icons/bi";
import { BiSolidShow } from "react-icons/bi";

export const CustomPasswordInput = ({ label, value, onChange, placeholder = "Enter your password" }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div style={{ marginBottom: "0px"}}>
      {/* Label */}
      <label
        style={{
          display: "block",
          marginBottom: "4px",
          fontWeight: "600",
          fontSize: "14px",
          color: "#202223",
        }}
      >
        {label}
      </label>

      {/* Input Container */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          border: "1px solid #abb1ba",
          borderRadius: "4px",
          height: "37px",
          width: "100%",
          padding: "10px 12px",
          backgroundColor: "#ffffff",
          position: "relative",
        }}
      >
        {/* Input Field */}
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            fontSize: "14px",
            paddingRight: "40px", // To prevent text from going below the icon
            color: "#202223",
          }}
        />

        {/* Eye Button */}
        <button
          type="button"
          onClick={togglePasswordVisibility}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            position: "absolute",
            right: "12px",
            padding: "0",
            display: "flex",
            alignItems: "center",
          }}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          <Icon source={showPassword ? <BiSolidHide/> : <BiSolidShow/>} color="subdued" />
        </button>
      </div>
    </div>
  );
};

