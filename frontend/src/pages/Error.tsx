import React from "react";
import { useRouteError, Link } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";

interface RouteError {
  statusText?: string;
  message?: string;
  status?: number;
}

const Error: React.FC = () => {
  const error = useRouteError() as RouteError;

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row>
        <Col className="text-center">
          <div className="error-content">
            <h1 className="display-1 fw-bold text-primary mb-4">
              {error?.status || "404"}
            </h1>
            <h2 className="h4 mb-3">Oops! Something went wrong</h2>
            <p className="text-muted mb-4">
              {error?.statusText || error?.message || "The page you're looking for doesn't exist."}
            </p>
            <div className="d-flex gap-3 justify-content-center">
              <Button as={Link} to="/" variant="primary">
                Go Home
              </Button>
              <Button 
                variant="outline-primary" 
                onClick={() => window.history.back()}
              >
                Go Back
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Error;