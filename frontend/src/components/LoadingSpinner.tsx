import React from "react";
import { Spinner } from "react-bootstrap";

export default function LoadingSpinner() {
  return (
    <div className="d-flex justify-content-center">
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </div>
  );
}
