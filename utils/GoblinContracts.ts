import { chain } from "../src/app/chain";
import { client } from "../src/app/client";
import { getContract } from "thirdweb";
import { stakingABI } from "./GoblinsABI";

const nftContractAddress = "0x4Ac03107603F37AD24a36c32bEC98b22AF46ABbf";
const rewardTokenContractAddress = "0xC3882D10e49Ac4E9888D0C594DB723fC9cE95468";
const stakingContractAddress = "0x4c501f493aE00a866A8cB2De4fc31f19e5d676f0";

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
