import React from "react";

const NewUsersTasks = () => {
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
                        <h3 className="fn__maintitle big" data-text="Task Center" style={{ margin: 0 }}>Task Center</h3>
                        <p style={{ margin: 0 }}>Learn the basic steps on Task Center.</p>

                        <div className="partner-img" style={{ display: "flex", gap: "10px", justifyContent: "center", alignItems: "center", marginTop: "20px" }}>
                            <img className="partner-img" src="/img/Logo_type2.png" style={{ width: "125px" }} />
                        </div>

                        <p style={{ textAling: "center" }}>
                            Make the post during the 30 seconds and close the window after 30 seconds.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NewUsersTasks;
