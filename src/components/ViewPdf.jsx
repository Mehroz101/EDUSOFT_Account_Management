import React from "react";

const ViewPdf = ({ url }) => {
  return (
    <div className="ml-2 mr-2 min-h-screen w-full mt-2">
      <div style={{ width: "100%", height: "100vh" }}>
        <iframe
          src={url}
          width="100%"
          height="100%"
          style={{ border: "none" }}
          title="PDF Viewer"
        ></iframe>
      </div>
    </div>
  );
};

export default ViewPdf;
