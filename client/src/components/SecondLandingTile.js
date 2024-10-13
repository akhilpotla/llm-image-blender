import React, { useState } from "react";
import axios from "axios";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const SecondLandingTile = () => {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [error, setError] = useState(null);

  const MAX_SIZE = 2 * 1024 * 1024; // 2MB

  const handleImage1Change = (e) => {
    const file = e.target.files[0];
    if (file.size > MAX_SIZE) {
      setError("File size exceeds 2MB");
      setImage1(null);
      return;
    } else {
      setError(null);
      setImage1(file);
    }
  };

  const handleImage2Change = (e) => {
    const file = e.target.files[0];
    if (file.size > MAX_SIZE) {
      setError("File size exceeds 2MB");
      setImage2(null);
      return;
    } else {
      setError(null);
      setImage2(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!image1 || !image2) {
      setError("Please upload both images");
      return;
    }
    let formData = new FormData();
    formData.append("images", image1);
    formData.append("images", image2);
    axios
      .post("/api/v1/images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="gradient-background-top">
      <Container className="pt-8 pb-8">
        <h2>Upload images. Mint NFT AI art</h2>
        <h3 className="pt-3 text-muted">
          Generate provably rare AI art with ease.
        </h3>
        {error && (
          <Alert variant="danger" className="mt-3">
            {error}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <Form.Group controlId="file">
                <Form.Label>Image 1 (PNG)</Form.Label>
                <Form.Control
                  name="file"
                  type="file"
                  accept="image/png"
                  onChange={handleImage1Change}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formImage2">
                <Form.Label>Image 2 (PNG)</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/png"
                  onChange={handleImage2Change}
                />
              </Form.Group>
            </Col>
          </Row>
          <Button className="mt-3 text-white" variant="secondary" type="submit">
            Submit
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default SecondLandingTile;
