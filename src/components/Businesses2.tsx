import { useAddress, useContract, useContractRead } from "@thirdweb-dev/react";
import { STAKING_CONTRACT_ADDRESS } from "../../consts/contractsNew";
import { BigNumber } from "ethers";
import BusinessCard from "../components/BusinessCard";
import React from "react";

const BusinessesTwo = () => {
    // Get the user's address needed for staking info
    const address = useAddress();

    // Get the staking contract instance
    const { contract: stakingContract } = useContract(STAKING_CONTRACT_ADDRESS);
    const { data: stakedTokens, isLoading: loadingBusinesses } = useContractRead(stakingContract, "getStakeInfo", [
        address,
    ]);

    // IDs que deseas mostrar
    const includedIds = [12, 13, 14];

    // Filtrar los stakedTokens para incluir solo los IDs deseados
    const filteredStakedTokens = stakedTokens
        ? stakedTokens[0].filter((stakedToken: BigNumber) => includedIds.includes(stakedToken.toNumber()))
        : [];

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
            {loadingBusinesses ? (
                <p style={{ textAlign: "center", alignContent: "center" }}>Loading partners...</p>
            ) : (
                <div className="gridNFT">
                    {filteredStakedTokens.length > 0 ? (
                        filteredStakedTokens.map((stakedToken: BigNumber) => (
                            <BusinessCard
                                key={stakedToken.toString()}
                                tokenId={stakedToken.toNumber()}
                            />
                        ))
                    ) : (
                        <p>No partners owned.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default BusinessesTwo;