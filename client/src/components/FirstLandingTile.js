import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

import messages from '../imessages.png';


const FirstLandingTile = () => {
  return (
    <Container className="pt-5">
      <h1>
        <b>
          Talk to your
          <span className="text-primary">
            <br/>crypto wallet.
          </span>
        </b>
      </h1>
      <h3 className="text-muted">Trade, transfer, sell crypto right from iMessage</h3>
      <Button className="mt-3 text-white"variant="primary">
        Send Message
      </Button>
      <br/>
      <img className="trim mt-3" src={messages} alt="imessages"/>
    </Container>
  )
}

export default FirstLandingTile;
