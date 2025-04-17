import React, { useState, useEffect } from "react";
//use this varibale to get myshopify_domain from the url and extract store name from domain name 
const PricingPlans = ({currentPlanId}) => {
  const [isYearly, setIsYearly] = useState(false);
const [storeName, setStoreName] = useState(""); // State to hold the store name
const currentOrders = 60; // Example: Change order count here
const milestones = [0, 50, 1000, "Unlimited"]; // Define milestones

const maxOrders = typeof milestones[milestones.length - 1] === "number" 
  ? milestones[milestones.length - 1] 
  : milestones[milestones.length - 2]; // Last numeric milestone

  // Fetch store details and set store name
  useEffect(() => {
    fetch("/api/2024-10/shop.json", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((request) => request.json())
      .then((response) => {
        // console.log("Store Details---!", response.data);
        if (response.data && response.data.data.length > 0) {
          const fetchedStoreName = response.data.data[0].myshopify_domain;
            const storeName = fetchedStoreName.split(".")[0];//extract store name from domain name
          // console.log("Store Name:", fetchedStoreName);
          setStoreName(storeName); // Set the store name
        }
      })
      .catch((error) => console.log("Error fetching store details:", error));
  }, []);

  const appName = "indiangstinvoice";
  // Redirect to the pricing plans page
  const handleChangePlanButton = () => {
    if (storeName) {
      const pricingPlanUrl = `https://admin.shopify.com/store/${storeName}/charges/${appName}/pricing_plans`;
      window.location.href = pricingPlanUrl; // Redirects to the Shopify admin URL
    } else {
      console.error("Store name is not set. Cannot redirect to the pricing plans page.");
    }
  };
  

  // Calculate the progress percentage based on the milestones
  const progressPercentage = (() => {
  if (!milestones || milestones.length === 0) return 0; // Handle empty milestones

  // Ensure currentOrders does not exceed maxOrders
  const clampedOrders = Math.min(currentOrders, maxOrders);

  // Calculate cumulative percentage
  return (clampedOrders / maxOrders) * 100;
})();
  

  const plans = [
    {
      title: "Basic",
      monthlyPrice: "Free",
      yearlyPrice: "Free",
      orderLimit: "Stores with up to 50 orders monthly",
      features: ["1 Template", "Download invoice", "Print Invoice", "Email support"],
      planId: "0"
    },
    {
      title: "Pro",
      monthlyPrice: "$5.99",
      yearlyPrice: "$65.00/year (10% off)",
      orderLimit: "1000 Orders per month",
      planId: "1",
      features: [
        "Including Free plan +",
        "Customizable Template",
        "Use 5+ Templates",
        "Bulk Download Invoices",
        "Email PDF Invoices",
        "Priority Support",
      ],
    },
    {
      title: "Business",
      monthlyPrice: "$29.99",
      yearlyPrice: "$299.99/year (17% off)",
      orderLimit: "Unlimited Orders",
      planId: "2",
      features: [
        "Including Free plan + ",
        "Customizable Template",
        "Use 5+ Templates",
        "Bulk Download Invoices",
        "Email PDF Invoices",
        "Priority Support",
      ],
    },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <h1 style={styles.heading}>Plans and pricing</h1>
        <p style={styles.subheading}>Select a plan to continue</p>

        {/* Toggle Section */}
        <div style={styles.toggleContainer}>
          <span style={{ ...styles.toggleLabel, fontWeight: !isYearly ? "bold" : "normal" }}>
            Monthly
          </span>
          <div
            style={{
              ...styles.toggleSwitch,
              backgroundColor: isYearly ? "#047b5d" : "#ddd",
            }}
            onClick={() => setIsYearly(!isYearly)}
          >
            <div
              style={{
                ...styles.toggleKnob,
                transform: isYearly ? "translateX(22px)" : "translateX(0)",
              }}
            ></div>
          </div>
          <span style={{ ...styles.toggleLabel, fontWeight: isYearly ? "bold" : "normal" }}>
            Yearly
          </span>
        </div>

  

        {/* Plans Grid */}
        <div style={styles.plansGrid}>
          {plans.map((plan) => (
            <div key={plan.title} style={styles.planCard}>
              <div style={{display:"flex", justifyContent:"space-between"}}>

              <h3 style={styles.planTitle}>{plan.title}</h3>
              
              {(plan?.planId?.toString() || "") === (currentPlanId?.toString() || "") && (
                <>             
               <span style={{display:"flex", alignItems:"center",
                 background:"#d5ebff", paddingRight:"5px", paddingLeft:"5px", 
                 borderRadius:"10px", fontSize:"12px", color:"#0f304f", textAlign:"center", marginBottom:"10px"}}
                 >Current
                 </span>
                </>) }
              </div>
              
              <div style={styles.planPrice}>
                {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                {plan.title !== "Basic" && (
                  <span style={styles.pricePeriod}>{isYearly ? "" : "/30 days"}</span>
                )}
              </div>
              <p style={styles.planOrderLimit}>{plan.orderLimit}</p>
              <ul style={styles.planFeatures}>
                {plan.features.map((feature, index) => (
                  <li key={index} style={styles.featureItem}>
                    {feature}
                  </li>
                ))}
              </ul>

            </div>
          ))}
        </div>
        <div  style={{
                display:"flex",
                justifyContent:"center",
                width:"100%",
               
        }}>
              <a style={{ textDecoration:"none"}} href={`https://admin.shopify.com/store/${storeName}/charges/${appName}/pricing_plans`} target="_blank" rel="noopener noreferrer">
            <button 
            style={{
                display:"flex",
                justifyContent:"center",
                ...styles.planButton,
                backgroundColor : "#047b5d",
                color:  "#fff",
                marginTop:"30px",
               padding:"12px 30px",
              }}
            >
                Change Plan
            </button>
            </a>
            
            </div>
      </div>
    </div>
  );
};

const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#f9f9f9",
      padding: "24px",
    },
    wrapper: {
      maxWidth: "1200px",
      margin: "0 auto",
    },
    heading: {
      textAlign: "center",
      fontSize: "32px",
      fontWeight: "bold",
      marginBottom: "16px",
    },
    subheading: {
      textAlign: "center",
      color: "#6b7280",
      marginBottom: "32px",
    },
    toggleContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "48px",
      gap: "8px",
    },
    toggleLabel: {
      fontSize: "14px",
    },
    toggleSwitch: {
      position: "relative",
      width: "44px",
      height: "22px",
      borderRadius: "11px",
      cursor: "pointer",
    },
    toggleKnob: {
      position: "absolute",
      top: "2px",
      left: "2px",
      width: "18px",
      height: "18px",
      backgroundColor: "#fff",
      borderRadius: "50%",
      transition: "all 0.3s ease",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    progressContainer: {
      position: "relative",
      width: "60%",
      margin: "0 auto",
      marginBottom: "48px",
    },
    progressBar: {
      height: "8px",
      backgroundColor: "#ddd",
      borderRadius: "4px",
      position: "relative",
    },
    progressFill: {
      height: "100%",
      backgroundColor: "#047b5d",
      borderRadius: "4px",
    },
    progressIndicator: {
      position: "absolute",
      top: "-30px",
      transform: "translateX(-50%)",
      backgroundColor: "#047b5d",
      color: "#fff",
      fontSize: "12px",
      padding: "4px 8px",
      borderRadius: "4px",
      whiteSpace: "nowrap",
      textAlign: "center",
    },
    progressLabels: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "8px",
      fontSize: "14px",
      color: "#6b7280",
    },
    plansGrid: {
      display: "flex",
      gap: "16px",
      justifyContent: "center",
    },
    planCard: {
      backgroundColor: "#fff",
      border: "1px solid #ddd",
      borderRadius: "8px",
      width: "300px",
      padding: "24px",
      transition: "box-shadow 0.3s ease",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    planTitle: {
      fontSize: "20px",
      fontWeight: "bold",
      marginBottom: "8px",
    },
    planPrice: {
      fontSize: "20px",
      fontWeight: "bold",
      marginBottom: "16px",
    },
    pricePeriod: {
      fontSize: "14px",
      fontWeight: "normal",
      color: "#6b7280",
    },
    planOrderLimit: {
      fontSize: "14px",
      color: "#6b7280",
      marginBottom: "16px",
    },
    planFeatures: {
      listStyle: "none",
      padding: "0",
      margin: "0 0 16px 0",
    },
    featureItem: {
      fontSize: "14px",
      marginBottom: "8px",
    },
    planButton: {
      display: "block",
      width: "100%",
      padding: "10px 16px",
      borderRadius: "4px",
      border: "none",
      textAlign: "center",
      fontSize: "14px",
      cursor: "pointer",
      transition: "background-color 0.3s ease, color 0.3s ease",
    },
  };
export default PricingPlans;
