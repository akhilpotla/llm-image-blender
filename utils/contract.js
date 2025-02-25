const { ethers } = require("ethers");
const NFTContractABI = require("../config/LLMGenerateNFTABI.json");
const config = require("config");

const provider = new ethers.JsonRpcProvider(config.SEPOLIA_RPC_URL);
const nftContractAddress = config.NFT_CONTRACT_ADDRESS;

const nftContract = new ethers.Contract(
  nftContractAddress,
  NFTContractABI.abi,
  provider
);

async function mintNFT(payer, metadataUri) {
  const signer = new ethers.Wallet(config.PRIVATE_KEY, provider);
  const nftContractWithSigner = nftContract.connect(signer);
  const tx = await nftContractWithSigner.mintNFT(payer, metadataUri);
  return tx.hash;
}

module.exports = { mintNFT };
