import { chain } from "../src/app/chain";
import { client } from "../src/app/client";
import { getContract } from "thirdweb";
import { stakingABI } from "./MiningsABI";

const nftContractAddress = "0x8c73fc3b9178c99576D39e0CD7d0A64C89bdEb8E";
const rewardTokenContractAddress = "0x8a5135FFb75af2460605d26c190DB5862c6Ec55b";
const stakingContractAddress = "0xe088d4349E1Fe17072A743b87FB2d511C4772449";

export const NFT_CONTRACT = getContract({
    client: client,
    chain: chain,
    address: nftContractAddress
});

export const REWARD_TOKEN_CONTRACT = getContract({
    client: client,
    chain: chain,
    address: rewardTokenContractAddress
});

export const STAKING_CONTRACT = getContract({
    client: client,
    chain: chain,
    address: stakingContractAddress,
    abi: stakingABI
});