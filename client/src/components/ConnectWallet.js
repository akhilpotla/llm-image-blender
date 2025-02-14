import { useState } from "react";

import Button from "react-bootstrap/Button";

const ConnectWallet = () => {
  const [account, setAccount] = useState(null);

  // Function to connect MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Request accounts from MetaMask
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]); // Save first account
      } catch (error) {
        console.error("User rejected the request", error);
      }
    } else {
      alert("MetaMask not installed! Please install MetaMask to continue.");
    }
  };

  return (
    <div>
      {account ? (
        <p>Connected: {account}</p>
      ) : (
        <Button className="mt-3 text-white" onClick={connectWallet}>
          Connect MetaMask
        </Button>
      )}
    </div>
  );
};

export default ConnectWallet;
