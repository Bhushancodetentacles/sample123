import React from "react";
import Header from "./Common/Header";
import Footer from "./Common/Footer";



const Layout = ({ children, isFooterEnable = true }) => {
  return (
    <>
      <div className="bg-pattern bg-center bg-repeat max-w-screen-xl mx-auto flex flex-col gap-3 w-full py-3 px-5 margintop">
       
        {children}
       <Footer/>
      </div>
    </>
  );
};

export default Layout;