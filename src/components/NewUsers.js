import React from "react";

const NewUsers = () => {
    return (
        <>
            <style>
                {`
                    @media (max-width: 768px) {
                        .partners-container {
                            flex-direction: column;
                            height: auto;
                        }

                        .partners-container > div {
                            width: 100%;
                            height: 200px;
                        }

                        .text-container {
                            width: 100%;
                            text-align: center;
                        }

                        .partner-img {
                            width: 100px;
                        }

                        .background {
                            display: none;
                        }
                    }
                `}
            </style>

            <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                <div
                    className="partners-container"
                    style={{
                        border: "1px solid rgba(128, 128, 128, 0.5)",
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        maxWidth: "100%",
                        height: "400px",
                        overflow: "hidden",
                        position: "relative",
                    }}
                >
                    <div
                        className="background"
                        style={{
                            flex: 1,
                            width: "100%",
                            height: "100%",
                            backgroundImage: "url('img/gd4.png')",
                            backgroundSize: "cover",
                            backgroundPosition: "50px center",
                            backgroundRepeat: "no-repeat",
                        }}
                    ></div>
                    <div
                        className="blog__item"
                        style={{
                            flex: 1,
                            padding: "20px",
                            borderRadius: "10px",
                            textAlign: "center",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            paddingBottom: "4rem",
                            paddingTop: "4rem",
                        }}
                    >
                        <h3 className="fn__maintitle big" data-text="Migration" style={{ margin: 0 }}>Migration</h3>
                        <p style={{ margin: 0, color: "yellow" }}>The Mining Migration Has Been Started</p>
                        <p style={{ margin: 0 }}>1. Migrate Goblin NFTs to V2</p>
                        <p style={{ margin: 0 }}>2. Migrate Items & S.Items to V2</p>
                        <p style={{ margin: 0 }}>3. Migrate Your Old Tokens to V2</p>

                        <a href="https://docs.goblinsaga.xyz/nft-and-token-migration#migration-of-nfts-to-new-mining-smart-contracts" target="_blank" className="metaportal_fn_button" style={{ marginTop: "20px", paddingBottom: "2rem" }}>
                            Migrate Now
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NewUsers;
