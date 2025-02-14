import React, { useState } from "react";
import axios from "axios";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import ConnectWallet from "./ConnectWallet";

const SecondLandingTile = () => {
  const [account, setAccount] = useState(null);
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [error, setError] = useState(null);
  const [awaitingResponse, setAwaitingResponse] = useState(false);

  const MAX_SIZE = 5 * 1024 * 1024; // 10MB

  const handleImage1Change = (e) => {
    const file = e.target.files[0];
    if (file.size > MAX_SIZE) {
      setError("File size exceeds 5MB");
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
      setError("File size exceeds 5MB");
      setImage2(null);
      return;
    } else {
      setError(null);
      setImage2(file);
    }
  };

  const handleSubmit = (e) => {
    setAwaitingResponse(true);
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
        const data = res.data;
        // Display alert with the image CID
        alert(`Image CID: ${data.IpfsHash}`);
      })
      .catch((err) => {
        console.error(err);
      });
    setAwaitingResponse(false);
  };

  return (
    <div className="gradient-background-top">
      <Container className="pt-5 pb-5">
        <h2>Upload images. Mint NFT AI art</h2>
        <h3 className="pt-3 text-muted">
          Generate provably rare AI art with ease.
        </h3>
        <ConnectWallet account={[account, setAccount]} />
        {error && (
          <Alert variant="danger" className="mt-3">
            {error}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <Form.Group controlId="file">
                <Form.Label>Image 1 (PNG or JPG)</Form.Label>
                <Form.Control
                  name="file"
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleImage1Change}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formImage2">
                <Form.Label>Image 2 (PNG or JPG)</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleImage2Change}
                />
              </Form.Group>
            </Col>
          </Row>
          <Button
            className="mt-3 text-white"
            variant="secondary"
            type="submit"
            disabled={account == null || awaitingResponse}
          >
            {account == null ? `First Connect Wallet` : `Submit`}
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default SecondLandingTile;
