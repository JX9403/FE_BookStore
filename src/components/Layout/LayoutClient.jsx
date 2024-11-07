import { Outlet } from "react-router-dom";
import HeaderClient from "../HeaderClient";
import "./LayoutClient.scss";
import Footer from "../Footer";
import { useState } from "react";

const LayoutClient = () => {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <div className="layout-client">
      <HeaderClient searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Outlet context={[searchTerm, setSearchTerm]} />
      <Footer />
    </div>
  );
};

export default LayoutClient;
