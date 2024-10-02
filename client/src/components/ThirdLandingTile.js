import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';


const ThirdLandingTile = () => {
  return (
    <div className="bg-primary">
      <Container className="pt-8 pb-8">
        <h2 className="text-white">
          Start now with a simple <br/> text message
        </h2>
        <h3 className="pt-3 text-offwhite">Interact with a global financial system with the help of AI</h3>
        <Button className="mt-3 text-white"variant="secondary">
          Send Message
        </Button>
      </Container>
    </div>
  )
}

export default ThirdLandingTile;
