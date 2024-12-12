import React, { useState } from "react";
import { Menubar } from "primereact/menubar";
import { faBars } from "@fortawesome/free-solid-svg-icons"; // Import specific icons
import { Button } from "primereact/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Navbar({ onShow }) {
  const [checked, setChecked] = useState(true);

  return (
    <>
      <Menubar
        start={
          <Button
            icon={<FontAwesomeIcon icon={faBars} />}
            className="p-button-text"
            onClick={onShow} // Call the function to show the sidebar
            aria-label="Show Sidebar"
          />
        }
        end={
          <h3 className=" pr-2 text-lg font-bold text-purple-900">
            EduAccountant
          </h3>
        }
      />
    </>
  );
}
