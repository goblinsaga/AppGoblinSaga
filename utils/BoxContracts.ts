import { chain } from "../src/app/chain";
import { client } from "../src/app/client";
import { getContract } from "thirdweb";
import { stakingABI } from "./MiningsABI";

const nftContractAddress = "0xE62b57bA772DFf6Aa044407D79B4B12fA28a4942";
const rewardTokenContractAddress = "0xC3882D10e49Ac4E9888D0C594DB723fC9cE95468";
const stakingContractAddress = "0x7bBF62c83d3d00eCFDA3Ea98355B2895A453d786";

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
