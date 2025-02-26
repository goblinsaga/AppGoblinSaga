import { useContract, useNFTs, useAddress, useTokenBalance, useOwnedNFTs, useContractRead } from "@thirdweb-dev/react";
import { BigNumber } from "ethers";
import React, { useEffect, useState } from "react";
import { BUSINESSES_CONTRACT_ADDRESS } from "../../consts/contracts";
import { BUSINESSES_CONTRACT_ADDRESS2 } from "../../consts/contracts2";
import { nftDropContractAddress, stakingContractAddress, tokenContractAddress } from "../../consts/contractAddresses";
import NFTCard from "./NFTCard2";
import NFTCardBox from "./NFTCard3";
import NFTCard4 from "./NFTCard4";
import SectionDivider from "./SectionDivider";

const ShopSections = () => {
    const { contract: businessesContract } = useContract(BUSINESSES_CONTRACT_ADDRESS);
    const { data: businesses } = useNFTs(businessesContract);
    const { contract: boxContract } = useContract(BUSINESSES_CONTRACT_ADDRESS2);
    const { data: box } = useNFTs(boxContract);
    const address = useAddress();
    const { contract: nftDropContract } = useContract(nftDropContractAddress, "nft-drop");
    const { contract: tokenContract } = useContract(tokenContractAddress, "token");
    const { contract, isLoading } = useContract(stakingContractAddress);


    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <section id="roadmap">
            <div className="container">
                <h3
                    className="fn__maintitle big"
                    data-text="Item Shop"
                    data-align="center"
                >
                    Item Shop
                </h3>

                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                }}>
                    <a href="#mines" style={{ textDecoration: "none" }}>
                        <button className="metaportal_fn_buttonLW">Mines</button>
                    </a>
                    <a href="#partners" style={{ textDecoration: "none" }}>
                        <button className="metaportal_fn_buttonLW">Partners</button>
                    </a>
                    <a href="#special-items" style={{ textDecoration: "none" }}>
                        <button className="metaportal_fn_buttonLW">Special Items</button>
                    </a>
                </div>


                <div id="mines" style={{ marginBottom: "100px" }} className="gridNFT">
                    {businesses && businesses.length > 0 ? (
                        businesses.map((business) => (
                            <NFTCard
                                key={business.metadata.id}
                                nft={business}
                            />
                        ))
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            </div>
            <SectionDivider />

            <div style={{ marginTop: "100px" }} className="container">
                <h3
                    className="fn__maintitle big"
                    data-text="Partners"
                    data-align="center"
                >
                    Partners
                </h3>

                <div id="partners" style={{ marginBottom: "100px" }} className="gridNFT">
                    {businesses && businesses.length > 0 ? (
                        businesses.map((business) => (
                            <NFTCard4
                                key={business.metadata.id}
                                nft={business}
                            />
                        ))
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            </div>


            <SectionDivider />
            <div style={{ marginTop: "100px" }} className="container">
                <h3
                    className="fn__maintitle big"
                    data-text="Special Items"
                    data-align="center"
                >
                    Special Items
                </h3>

                <div id="special-items" style={{ marginBottom: "100px" }} className="gridNFT">
                    {box && box.length > 0 ? (
                        box.map((boxItem) => (
                            <NFTCardBox
                                key={boxItem.metadata.id}
                                nft={boxItem}
                            />
                        ))
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            </div>
            <div className="container" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <a href="/">
                    <button className="metaportal_fn_buttonLW">Back to Mine</button>
                </a>
            </div>
        </section>
    );
};

export default ShopSections;
