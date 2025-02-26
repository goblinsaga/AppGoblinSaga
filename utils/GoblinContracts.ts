import { chain } from "../src/app/chain";
import { client } from "../src/app/client";
import { getContract } from "thirdweb";
import { stakingABI } from "./GoblinsABI";

const nftContractAddress = "0x4Ac03107603F37AD24a36c32bEC98b22AF46ABbf";
const rewardTokenContractAddress = "0x8a5135FFb75af2460605d26c190DB5862c6Ec55b";
const stakingContractAddress = "0xD38bD38f9b96c9B34000A1336614506B272Fe913";

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