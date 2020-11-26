import React from "react";

import "./LoadingSpinner.scss";

const LoadingSpinner = () => {
  return (
    <div className="LoadingSpinner center">
      <div className="lds-dual-ring center" />;
    </div>
  );
};

export default LoadingSpinner;
