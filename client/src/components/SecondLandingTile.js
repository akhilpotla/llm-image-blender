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

  const handleTesting = () => {
    axios
      .get("/api/v1/images")
      .then((res) => {
        // Response contains the image in Base64 encoding under the key 'image'
        const base64Image = res.data.image;
        console.log(base64Image);
        downloadBase64AsImage(base64Image, "test.png");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const downloadBase64AsImage = (base64String, fileName) => {
    // Convert Base64 string to a binary Blob
    const byteCharacters = atob(base64String); // Decode the Base64 string
    const byteNumbers = new Array(byteCharacters.length)
      .fill(0)
      .map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);

    // Create a Blob from the binary data
    const blob = new Blob([byteArray], { type: "image/png" });

    // Create a URL for the Blob
    const url = window.URL.createObjectURL(blob);

    // Create a link element and simulate a click
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName); // Set the file name for download
    document.body.appendChild(link);
    link.click();
    link.remove();

    // Revoke the Blob URL to free up memory
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="gradient-background-top">
      <ConnectWallet />
      <Container className="pt-8 pb-8">
        <h2>Upload images. Mint NFT AI art</h2>
        <h3 className="pt-3 text-muted">
          Generate provably rare AI art with ease.
        </h3>
        <Button onClick={handleTesting}>Testing</Button>
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
            disabled={awaitingResponse}
          >
            Submit
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default SecondLandingTile;
