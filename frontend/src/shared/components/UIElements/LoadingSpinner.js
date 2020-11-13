import React from "react";

import "./LoadingSpinner.css";

const LoadingSpinner = (props) => {
  return (
    <div className="LoadingSpinner center">
      <div className="lds-dual-ring center" />;
    </div>
  );
};

export default LoadingSpinner;
