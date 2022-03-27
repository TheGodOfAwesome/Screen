import React from "react";

const LoadingSpinner = () => {
  return (
    <>
      <div style={{color: "#680de4"}} className="spinner-border" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </>
  );
}

export default LoadingSpinner;