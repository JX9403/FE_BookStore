import { Outlet } from "react-router-dom";
import HeaderClient from "../HeaderClient";
import "./LayoutClient.scss";
import Footer from "../Footer";

const LayoutClient = () => {
  return (
    <div className="layout-client">
      <HeaderClient />
      <Outlet />
      <Footer />
    </div>
  );
};

export default LayoutClient;
