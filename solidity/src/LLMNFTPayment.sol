// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract LLMNFTPayment {
    address public owner;
    uint256 public constant minPayment = 0.005 ether;
    event PaymentReceived(address indexed payer, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    // Need a function to accept payments
    function purchaseNFT() public payable {
        require(msg.value > minPayment, "Payment is required.");
        emit PaymentReceived(msg.sender, msg.value);
    }

    function withdraw() external {
        require(
            msg.sender == owner,
            "You must be the owner to withdraw funds."
        );
        payable(owner).transfer(address(this).balance);
    }
}
