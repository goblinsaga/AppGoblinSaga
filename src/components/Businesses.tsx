import { useAddress, useContract, useContractRead } from "@thirdweb-dev/react";
import { STAKING_CONTRACT_ADDRESS } from "../../consts/contractsNew";
import { BigNumber } from "ethers";
import BusinessCard from "../components/BusinessCard";
import React from "react";

const Businesses = () => {
    // Get the user's address needed for staking info
    const address = useAddress();

    // Get the staking contract instance
    const { contract: stakingContract } = useContract(STAKING_CONTRACT_ADDRESS);
    const { data: stakedTokens, isLoading: loadingBusinesses } = useContractRead(stakingContract, "getStakeInfo", [
        address,
    ]);

    // IDs que no deseas mostrar
    const excludedIds = [12, 13, 14];

    // Filtrar los stakedTokens para excluir los IDs no deseados
    const filteredStakedTokens = stakedTokens
        ? stakedTokens[0].filter((stakedToken: BigNumber) => !excludedIds.includes(stakedToken.toNumber()))
        : [];

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
            {loadingBusinesses ? (
                <p style={{ textAlign: "center", alignContent: "center" }}>Loading mines...</p>
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
                        <p>No mines owned.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Businesses;