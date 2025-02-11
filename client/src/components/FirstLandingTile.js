import React from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

const FirstLandingTile = () => {
  return (
    <Container className="pt-5 pb-5">
      <h1>
        <b>
          Generate your own
          <span className="text-primary">
            <br />
            AI art NFTs.
          </span>
        </b>
      </h1>
      <h3 className="text-muted">
        Create unique AI art NFTs with your own base images.
      </h3>
      <Button className="mt-3 text-white" variant="primary">
        Generate NFT
      </Button>
      <br />
    </Container>
  );
};

export default FirstLandingTile;
