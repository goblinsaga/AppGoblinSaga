import React from "react";

const NewUsersTwo = () => {
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

            <div className="container" style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
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
                            backgroundImage: "url('img/gd2.png')",
                            backgroundSize: "cover",
                            backgroundPosition: "-10px center",
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
                        <h3 className="fn__maintitle big" data-text="Beginner?" style={{ margin: 0 }}>Beginner?</h3>
                        <p style={{ margin: 0 }}>Learn the basic steps on App.</p>

                        <div className="partner-img" style={{ display: "flex", gap: "10px", justifyContent: "center", alignItems: "center", marginTop: "20px" }}>
                            <img className="partner-img" src="/img/Logo_type2.png" style={{ width: "125px" }} />
                        </div>

                        <a href="https://docs.goblinsaga.xyz/beginners/goblin-app-tutorial" target="_blank" className="metaportal_fn_button" style={{ marginTop: "20px", paddingBottom: "2rem" }}>
                            Check this Tutorial
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NewUsersTwo;
