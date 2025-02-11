import React from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

const ThirdLandingTile = () => {
  return (
    <div className="bg-primary">
      <Container className="pt-8 pb-8">
        <h2 className="text-white">
          Start now with any two <br /> images you want.
        </h2>
        <h3 className="pt-3 text-offwhite">
          Interact with the global NFT art market with the help of AI
        </h3>
        <Button className="mt-3 text-white" variant="secondary">
          Generate NFT
        </Button>
      </Container>
    </div>
  );
};

export default ThirdLandingTile;
