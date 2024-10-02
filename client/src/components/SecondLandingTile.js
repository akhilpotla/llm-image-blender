import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';


const SecondLandingTile = () => {
  return (
    <div className="gradient-background-top">
      <Container className="pt-8 pb-8">
        <h2>
          Onboard, buy, send <br/> & swap crypto on the go
        </h2>
        <h3 className="pt-3 text-muted">
          Use crypto with ease: whenever and to whoever.
        </h3>
        <Button className="mt-3 text-white"variant="secondary">
          Send Message
        </Button>
      </Container>
    </div>
  )
}

export default SecondLandingTile;
