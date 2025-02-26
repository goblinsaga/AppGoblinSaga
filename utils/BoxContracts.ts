import { chain } from "../src/app/chain";
import { client } from "../src/app/client";
import { getContract } from "thirdweb";
import { stakingABI } from "./MiningsABI";

const nftContractAddress = "0xE62b57bA772DFf6Aa044407D79B4B12fA28a4942";
const rewardTokenContractAddress = "0x8a5135FFb75af2460605d26c190DB5862c6Ec55b";
const stakingContractAddress = "0x997C6fb85EE4E54Fe099A1C83Cd9f53b1BceF65C";

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