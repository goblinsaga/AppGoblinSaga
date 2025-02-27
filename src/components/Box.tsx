import { useAddress, useContract, useContractRead } from "@thirdweb-dev/react";
import { STAKING_CONTRACT_ADDRESS } from "../../consts/contracts2New";
import { BigNumber } from "ethers";
import BoxCard from "./BoxCard";
import React from "react";

const Box = () => {
    // Obtener la dirección del usuario necesaria para la info de staking
    const address = useAddress();

    // Obtener instancia del contrato de staking
    const { contract: stakingContract } = useContract(STAKING_CONTRACT_ADDRESS);
    const { data: stakedTokens, isLoading } = useContractRead(stakingContract, "getStakeInfo", [address]);

    // Filtrar y ordenar los stakedTokens por ID en orden ascendente
    const filteredStakedTokens = stakedTokens
        ? stakedTokens[0].sort((a: BigNumber, b: BigNumber) => a.toNumber() - b.toNumber())
        : [];

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
            {isLoading ? (
                <p style={{ textAlign: "center", alignContent: "center" }}>Loading items...</p>
            ) : (
                <div className="gridNFT">
                    {filteredStakedTokens.length > 0 ? (
                        filteredStakedTokens.map((stakedToken: BigNumber) => (
                            <BoxCard
                                key={stakedToken.toString()}
                                tokenId={stakedToken.toNumber()}
                            />
                        ))
                    ) : (
                        <p className="centered-text">No Items started.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Box;
