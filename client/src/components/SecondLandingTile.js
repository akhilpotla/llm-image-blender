import React, { useEffect, useState } from "react";
import { BrowserProvider, parseEther, Contract } from "ethers";
import axios from "axios";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { RotatingLines } from "react-loader-spinner";

import ConnectWallet from "./ConnectWallet";
import contractABI from "../config/LLMNFTPaymentABI.json";

const SecondLandingTile = () => {
  const [account, setAccount] = useState(null);
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [error, setError] = useState(null);
  const [awaitingResponse, setAwaitingResponse] = useState(false);
  const [paymentContract, setPaymentContract] = useState(null);
  const [waitingForTransaction, setWaitingForTransaction] = useState(false);
  const AMOUNT = "0.0051";

  const MAX_SIZE = 5 * 1024 * 1024; // 5MB

  useEffect(() => {
    axios
      .get("/api/v1/contracts/payment")
      .then((res) => {
        setPaymentContract(res.data.contractAddress);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleImage1Change = (e) => {
    const file = e.target.files[0];
    if (file && file.size > MAX_SIZE) {
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
    if (file && file.size > MAX_SIZE) {
      setError("File size exceeds 5MB");
      setImage2(null);
      return;
    } else {
      setError(null);
      setImage2(file);
    }
  };

  const sendPayment = async (e) => {
    e.preventDefault();
    if (!window.ethereum) {
      alert("MetaMask is not installed");
      return;
    }
    if (!paymentContract) {
      alert("Payment contract address is missing!");
      return;
    }
    try {
      // Connect to Ethereum provider
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(paymentContract, contractABI.abi, signer);
      // Send ETH to the payment contract
      setWaitingForTransaction(true);
      const tx = await contract.purchaseNFT({
        value: parseEther(AMOUNT), // Convert ETH to Wei
      });
      const receipt = await tx.wait();
      console.log("Transaction receipt:", receipt);
      console.log("Transaction sent! Hash:", tx.hash);
      alert(`Transaction sent! Hash: ${tx.hash}`);
      alert("Generating AI art... please wait.");
      handleSubmit();
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Transaction failed.");
    }
    setWaitingForTransaction(false);
  };

  const handleSubmit = () => {
    if (!image1 || !image2) {
      setError("Please upload both images");
      return;
    }
    let formData = new FormData();
    formData.append("images", image1);
    formData.append("images", image2);
    formData.append("account", account);
    setAwaitingResponse(true);
    axios
      .post("/api/v1/images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        const data = res.data;
        // Display alert with the image CID
        console.log("Image CID:", data);
        alert(`Image CID: ${data.upload.IpfsHash}`);
        setAwaitingResponse(false);
      })
      .catch((err) => {
        console.error(err);
        setAwaitingResponse(false);
      });
  };

  const handleWaitingForTransaction = () => {
    if (waitingForTransaction) {
      return (
        <Alert variant="danger" className="mt-3">
          <RotatingLines strokeColor="black" />
          Waiting for transaction confirmation. Do not refresh or close the
          page.
        </Alert>
      );
    }
  };

  const handleAwaitingResponse = () => {
    if (awaitingResponse) {
      return (
        <Alert variant="danger" className="mt-3">
          <RotatingLines strokeColor="black" />
          Generating your image...
        </Alert>
      );
    }
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
        {handleWaitingForTransaction()}
        {handleAwaitingResponse()}
        {account ? (
          <Form onSubmit={sendPayment}>
            <Row>
              <Col>
                <Form.Group controlId="file">
                  <Form.Label>Image 1 (PNG or JPG)</Form.Label>
                  <Form.Control
                    name="file"
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleImage1Change}
                    required
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
                    required
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
              {account == null ? `Wallet Connection Required` : `Submit`}
            </Button>
          </Form>
        ) : null}
      </Container>
    </div>
  );
};

export default SecondLandingTile;
