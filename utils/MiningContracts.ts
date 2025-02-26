import { chain } from "../src/app/chain";
import { client } from "../src/app/client";
import { getContract } from "thirdweb";
import { stakingABI } from "./MiningsABI";

const nftContractAddress = "0x8c73fc3b9178c99576D39e0CD7d0A64C89bdEb8E";
const rewardTokenContractAddress = "0xC3882D10e49Ac4E9888D0C594DB723fC9cE95468";
const stakingContractAddress = "0x48A3a50b925CA2c2e92fCF77883BD0df111E9c51";

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
