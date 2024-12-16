import React, { useState } from "react";
import { Navbar } from "../utils/LazyLoadComponent";
import { Outlet, useNavigate } from "react-router-dom";
import CustomSidebar from "../components/Sidebar/SideNavbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong, faRightLong } from "@fortawesome/free-solid-svg-icons";

const Layout = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  return (
    <>
      {/* <div className="main_container">
        <CustomSidebar visible={visible} onHide={() => setVisible(false)} />
        <Outlet />
      </div> */}
      <div className="navbar">
        <Navbar visible={visible} onShow={() => setVisible(true)} />
      </div>
      <div className="sidebar_components">
        <CustomSidebar visible={visible} onHide={() => setVisible(false)} />
        <div className="p-5">
          <div className="navigator">
            <div
              className="flex gap-2 align-items-center"
              style={{ width: "100%" }}
            >
              <FontAwesomeIcon
                icon={faLeftLong}
                style={{
                  color: "#640D5F",
                  fontSize: "20px",
                  border: "3px solid #640D5F",
                  borderRadius: "50px",
                  padding: "5px",
                  cursor: "pointer",
                }}
                onClick={() => navigate(-1)}
              />
              <FontAwesomeIcon
                icon={faRightLong}
                style={{
                  color: "#640D5F",
                  fontSize: "20px",
                  border: "3px solid #640D5F",
                  borderRadius: "50px",
                  padding: "5px",
                  cursor: "pointer",
                }}
                onClick={() => navigate(+1)}
              />
            </div>
          </div>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout;
