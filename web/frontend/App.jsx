"use client"


import { BrowserRouter, Routes as RouterRoutes, Route, Navigate, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { NavMenu } from "@shopify/app-bridge-react"
import "@shopify/polaris/build/esm/styles.css"
import "./styles.css"
import { useEffect, useState } from "react"
import { QueryProvider, PolarisProvider } from "./components"
import { Spinner } from "@shopify/polaris"


// Custom router wrapper that handles initial redirection
function CustomRouter({ pages }) {
 const { t } = useTranslation()
 const [loading, setLoading] = useState(true)
 const [shouldRedirect, setShouldRedirect] = useState(false)
 const location = useLocation()


 // Comprehensive profile validation function
 const isProfileComplete = (profile) => {
   // Check storeProfile fields
   if (!profile.storeProfile) return false


   const requiredStoreFields = [
     "firstName",
     "lastName",
     "brandName",
     "phone",
     "storeEmail",
     "websiteURL",
     "gstNumber",
   ]


   for (const field of requiredStoreFields) {
     if (!profile.storeProfile[field]) return false
   }
   return true
 }


 useEffect(() => {
   // Only check on initial load or when on home page
   if (location.pathname === "/") {
     checkProfileAndSetRedirect()
   } else {
     // If not on home page, don't need to check
     setLoading(false)
   }
 }, [location.pathname])


 const checkProfileAndSetRedirect = async () => {
   try {
     // Step 1: Fetch shop data to get shop ID
     const shopResponse = await fetch("/api/2024-10/shop.json", {
       method: "GET",
       headers: { "Content-Type": "application/json" },
     })


     if (!shopResponse.ok) {
       console.error("Failed to fetch shop data")
       setLoading(false)
       return
     }


     const shopData = await shopResponse.json()
     const shopId = shopData.data.data[0].id


     if (!shopId) {
       console.error("No shop ID found")
       setLoading(false)
       return
     }


     // Step 2: Fetch store profile using shop ID
     const profileResponse = await fetch(`/api/fetch-store-profile?shopId=${shopId}`, {
       method: "GET",
       headers: { "Content-Type": "application/json" },
     })


     if (!profileResponse.ok) {
       console.error("Failed to fetch profile data")
       setLoading(false)
       return
     }


     const profileData = await profileResponse.json()


     // Step 3: Use the comprehensive validation function to check if all required fields are filled
     if (profileData && profileData.profile && isProfileComplete(profileData.profile)) {
       // Store plan ID in localStorage if needed
       const currentPlanId = profileData.profile.plans?.planId?.toString() || "0"
       localStorage.setItem("currentPlan", currentPlanId)


       // Set redirect flag
       setShouldRedirect(true)
      //  console.log("Profile is complete, redirecting to orders page")
     } else {
      //  console.log("Profile is incomplete, staying on home page")
     }


     // Finally set loading to false
     setLoading(false)
   } catch (error) {
     console.error("Error in profile check:", error)
     setLoading(false)
   }
 }


 // Create routes from pages
 const routeElements = Object.entries(pages).map(([path, component]) => {
   const routePath = path
     .replace("./pages", "")
     .replace(/\.(t|j)sx?$/, "")
     .replace(/\/index$/i, "/")
     .replace(/\[\.{3}.+\]/, "*")
     .replace(/\[(.+)\]/, ":$1")


   return {
     path: routePath,
     element: component.default ? <component.default /> : <component />,
   }
 })


 // If loading, show spinner
 if (loading && location.pathname === "/") {
   return (
     <>
       <NavMenu>
         <a href="/" rel="home" />
         <a href="/orders">{t("NavigationMenu.orders")}</a>
         <a href="/products">{t("NavigationMenu.products")}</a>
         <a href="/invoice_templates">{t("NavigationMenu.invoice_templates")}</a>
         <a href="/settings">{t("NavigationMenu.settings")}</a>
         <a href="/contactus">{t("NavigationMenu.contactus")}</a>
         <a href="/email-settings">{t("NavigationMenu.email-settings")}</a>
         <a href="/plans_and_billings">{t("NavigationMenu.plans_and_billings")}</a>
         {/* <a href="/paginated_orders">{t("NavigationMenu.paginated_orders")}</a> */}
       </NavMenu>
       <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
         <Spinner accessibilityLabel="Loading" size="large" />
       </div>
     </>
   )
 }


 return (
   <>
     <NavMenu>
       <a href="/" rel="home" />
       <a href="/orders">{t("NavigationMenu.orders")}</a>
       <a href="/products">{t("NavigationMenu.products")}</a>
       <a href="/invoice_templates">{t("NavigationMenu.invoice_templates")}</a>
       <a href="/settings">{t("NavigationMenu.settings")}</a>
       <a href="/contactus">{t("NavigationMenu.contactus")}</a>
       <a href="/email-settings">{t("NavigationMenu.email-settings")}</a>
       <a href="/plans_and_billings">{t("NavigationMenu.plans_and_billings")}</a>
       {/* <a href="/paginated_orders">{t("NavigationMenu.paginated_orders")}</a> */}
     </NavMenu>


     <RouterRoutes>
       {/* Handle home route with conditional redirect */}
       {location.pathname === "/" && shouldRedirect ? (
         <Route path="/" element={<Navigate to="/orders" replace />} />
       ) : (
         <Route path="/" element={routeElements.find((route) => route.path === "/")?.element} />
       )}


       {/* Add all other routes */}
       {routeElements
         .filter((route) => route.path !== "/")
         .map((route) => (
           <Route key={route.path} path={route.path} element={route.element} />
         ))}
     </RouterRoutes>
   </>
 )
}


export default function App() {
 // Any .tsx or .jsx files in /pages will become a route
 // See documentation for <Routes /> for more info
 const pages = import.meta.glob("./pages/**/!(*.test.[jt]sx)*.([jt]sx)", {
   eager: true,
 })


 return (
   <PolarisProvider>
     <BrowserRouter>
       <QueryProvider>
         <CustomRouter pages={pages} />
       </QueryProvider>
     </BrowserRouter>
   </PolarisProvider>
 )
}





