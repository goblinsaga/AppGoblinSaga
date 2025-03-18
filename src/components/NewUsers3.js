import React from "react";

const NewUsersThree = () => {
    return (
        <section id="news">
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
                            text-align: justify;
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

                <div id="migration" className="container" style={{ display: "flex", justifyContent: "justify", marginTop: "10px" }}>
                    <div
                        className="partners-container"
                        style={{
                            border: "1px solid rgba(128, 128, 128, 0.5)",
                            borderRadius: "10px",
                            display: "flex",
                            alignItems: "justify",
                            justifyContent: "justify",
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
                                backgroundPosition: "-80% center",
                                backgroundRepeat: "no-repeat",
                            }}
                        ></div>
                        <div
                            className="blog__item"
                            style={{
                                flex: 1,
                                padding: "20px",
                                borderRadius: "10px",
                                textAlign: "justify",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "justify",
                                alignItems: "justify",
                                paddingBottom: "4rem",
                                paddingTop: "4rem",
                            }}
                        >
                            <h3 className="fn__maintitle big" data-text="Migration" style={{ margin: 0 }}>Migration</h3>
                            <ul>
                                <li style={{ textAlign: "justify" }}>
                                    To migrate your old $GSA and $xGSA please open a support ticket at <a href="https://discord.com/invite/RSyZuSJN5z" target="_blank" style={{ color: "green" }}>Discord</a>
                                </li>
                                <li style={{ textAlign: "justify" }}>
                                    Learn how to claim unclaimed $xGSA from old Smart Contracts <a href="https://docs.goblinsaga.xyz/nft-and-token-migration#how-to-migrate-your-unclaimed-usdxgsa-to-usdwgsa" target="_blank" style={{ color: "green" }}>Click Here</a>
                                </li>
                                <li style={{ textAlign: "justify" }}>
                                    How to complete token migration process <a href="https://docs.goblinsaga.xyz/nft-and-token-migration#steps-to-migrate-old-usdgsa-and-usdxgsa" target="_blank" style={{ color: "green" }}>Click Here</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </>
        </section>
    );
};

export default NewUsersThree;
