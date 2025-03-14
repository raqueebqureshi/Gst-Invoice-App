import { BrowserRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NavMenu } from "@shopify/app-bridge-react";
import Routes from "./Routes";
import "@shopify/polaris/build/esm/styles.css";
import './styles.css';



import { QueryProvider, PolarisProvider } from "./components";

export default function App() {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.glob("./pages/**/!(*.test.[jt]sx)*.([jt]sx)", {
    eager: true,
  });
  const { t } = useTranslation();

  return (
    <PolarisProvider>
      <BrowserRouter>
        <QueryProvider>
          <NavMenu>
            <a href="/" rel="home" />
            <a href="/orders">{t("NavigationMenu.orders")}</a>
            <a href="/products">{t("NavigationMenu.products")}</a>
            <a href="/invoice_templates">{t("NavigationMenu.invoice_templates")}</a>
            <a href="/plans_and_billings">{t("NavigationMenu.plans_and_billings")}</a>
            <a href="/email-settings">{t("NavigationMenu.email-settings")}</a>
            <a href="/settings">{t("NavigationMenu.settings")}</a>
            <a href="/contactus">{t("NavigationMenu.contactus")}</a>
            
          </NavMenu>
        
          <Routes pages={pages} />
          
        </QueryProvider>
      </BrowserRouter>
    </PolarisProvider>
  );
}
