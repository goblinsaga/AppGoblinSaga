import React, { useState } from "react";
import SEHeaderH from "./SimpleEarnOneTestThree";
import SEHeader2Two from "./SimpleEarnTwoTestTwo";
import SEHeaderThree from "./SimpleEarnThreeTest";
import SEHeaderFour from "./SimpleEarnFourTest";
import SEHeaderFive from "./SimpleEarnFiveTest";
import SEHeaderSix from "./SimpleEarnSixTest";
import SEv1Rewards from "./SEv1Rewards";
import SEv2Rewards from "./SEv2Rewards";
import SEv3Rewards from "./SEv3Rewards";
import SEv6Rewards from "./SEv6Rewards";
import SEv4Rewards from "./SEv4Rewards";
import SEv5Rewards from "./SEv5Rewards";
import useStakedGSA from "./TotalStakeds/GSAStaked";
import useStakedPOL from "./TotalStakeds/POLStaked";
import useStakedUSDC from "./TotalStakeds/USDCStaked";
import useStakedMATICX from "./TotalStakeds/MATICXStaked";
import userStakedANKRPOL from "./TotalStakeds/ANKRPOLStaked";
import useStakedAPOL from "./TotalStakeds/APOLStaked";
import dynamic from "next/dynamic";

const Counter = dynamic(() => import("./Counter"), {
    ssr: false,
});

const StakeGSA = () => {
    const totalGSAStaked = useStakedGSA();
    const totalPOLStaked = useStakedPOL();
    const totalUSDCStaked = useStakedUSDC();
    const totalMATICXStaked = useStakedMATICX();
    const totalANKRPOLStaked = userStakedANKRPOL();
    const totalAPOLStaked = useStakedAPOL();
    const [visibleComponent, setVisibleComponent] = useState(null);

    const handleComponentClick = (componentName) => {
        setVisibleComponent(visibleComponent === componentName ? null : componentName);
    };

    return (
        <section id="news" style={{ marginTop: "-200px" }}>
            <div id="stake" className="container">
                <h3 className="fn__maintitle big" data-text="DeFi Stake" data-align="center" style={{ marginBottom: "50px" }}>
                    DeFi Stake
                </h3>
                <div className="tasks-list">
                    {/* Tarea 0 */}
                    <div
                        className="blog__item"
                        onClick={() => handleComponentClick('SEHeaderH')}
                        style={{ cursor: "pointer", transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out" }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-10px)";
                            e.currentTarget.style.boxShadow = "0px 4px 10px rgba(128, 0, 128, 0.6)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                        }}
                    >
                        <div className="task-icon">
                            <img src="/img/GSA-WGSA.png" alt="Goblin Icon" />
                        </div>
                        <div className="task-content">
                            <p className="task-title">GSA/WGSA</p>
                            <div className="additional-text">
                                <span className="label">Total Staked: </span>
                                <Counter end={totalGSAStaked || 0} decimals={0} /> {/* Usa el valor formateado sin decimales */}
                                <span className="suffix">
                                    {totalGSAStaked >= 1_000_000 ? "M" : totalGSAStaked >= 1_000 ? "M" : ""} $GSA
                                </span>
                            </div>
                        </div>
                        <div className="task-action">
                            <div className="task-reward-container">
                                <p className="task-reward">APR: 9.13%</p>
                                <div className="additional-text"><SEv1Rewards /></div>
                            </div>
                        </div>
                    </div>
                    {/* Muestra SEHeaderH condicionalmente */}
                    {visibleComponent === 'SEHeaderH' && (
                        <div>
                            <SEHeaderH />
                        </div>
                    )}

                    {/* Tarea 1 */}
                    <div
                        className="blog__item"
                        onClick={() => handleComponentClick('SEHeader2Two')}
                        style={{ cursor: "pointer", transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out" }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-10px)";
                            e.currentTarget.style.boxShadow = "0px 4px 10px rgba(128, 0, 128, 0.6)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                        }}
                    >
                        <div className="task-icon">
                            <img src="/img/POL-GSA2.png" alt="Goblin Icon" />
                        </div>
                        <div className="task-content">
                            <p className="task-title">POL/GSA</p>
                            <div className="additional-text">
                                <span className="label">Total Staked: </span>
                                <Counter end={totalPOLStaked || 0} decimals={0} /> {/* Usa el valor formateado sin decimales */}
                                <span className="suffix">
                                    {totalPOLStaked >= 1_000_000 ? "K" : totalPOLStaked >= 1_000 ? "K" : ""} $POL
                                </span>
                            </div>
                        </div>
                        <div className="task-action">
                            <div className="task-reward-container">
                                <p className="task-reward">APR: 27.37%</p>
                                <div className="additional-text"><SEv2Rewards /></div>
                            </div>
                        </div>
                    </div>
                    {/* Muestra SEHeader2Two condicionalmente */}
                    {visibleComponent === 'SEHeader2Two' && (
                        <div>
                            <SEHeader2Two />
                        </div>
                    )}

                    {/* Tarea 2 */}
                    <div
                        className="blog__item"
                        onClick={() => handleComponentClick('SEHeaderThree')}
                        style={{ cursor: "pointer", transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out" }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-10px)";
                            e.currentTarget.style.boxShadow = "0px 4px 10px rgba(128, 0, 128, 0.6)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                        }}
                    >
                        <div className="task-icon">
                            <img src="/img/USDC-WGSA.png" alt="Goblin Icon" />
                        </div>
                        <div className="task-content">
                            <p className="task-title">USDC/WGSA</p>
                            <div className="additional-text">
                                <span className="label">Total Staked: </span>
                                <Counter end={totalUSDCStaked || 0} decimals={0} /> {/* Usa el valor formateado sin decimales */}
                                <span className="suffix">
                                    {totalUSDCStaked >= 1_000_000 ? "K" : totalUSDCStaked >= 1_000 ? "K" : ""} $USDC
                                </span>
                            </div>
                        </div>
                        <div className="task-action">
                            <div className="task-reward-container">
                                <p className="task-reward">APR: 36.4%</p>
                                <div className="additional-text"><SEv3Rewards /></div>
                            </div>
                        </div>
                    </div>
                    {/* Muestra SEHeaderThree condicionalmente */}
                    {visibleComponent === 'SEHeaderThree' && (
                        <div>
                            <SEHeaderThree />
                        </div>
                    )}

                    {/* Tarea 2 */}
                    <div
                        className="blog__item"

                        style={{ cursor: "pointer", transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out" }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-10px)";
                            e.currentTarget.style.boxShadow = "0px 4px 10px rgba(128, 0, 128, 0.6)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                        }}
                    >
                        <div className="task-icon">
                            <img src="/img/USDT-WGSA.png" alt="Goblin Icon" />
                        </div>
                        <div className="task-content">
                            <p className="task-title">USDT/WGSA</p>
                            <div className="additional-text">
                                <span className="label">Coming Soon</span>
                            </div>
                        </div>
                        <div className="task-action">
                            <div className="task-reward-container">
                                <p className="task-reward">Coming Soon</p>
                                <div className="additional-text"></div>
                            </div>
                        </div>
                    </div>


                    <h3 id="restake" className="fn__maintitle big" data-text="DeFi Restake" data-align="center" style={{ marginBottom: "40px", marginTop: "30px" }}>
                        DeFi Restake
                    </h3>

                    {/* Tarea 2 */}
                    <div
                        className="blog__item"
                        onClick={() => handleComponentClick('SEHeaderSix')}
                        style={{ cursor: "pointer", transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out" }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-10px)";
                            e.currentTarget.style.boxShadow = "0px 4px 10px rgba(128, 0, 128, 0.6)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                        }}
                    >
                        <div className="task-icon">
                            <img src="/img/MATICX-WGSA.png" alt="Goblin Icon" />
                        </div>
                        <div className="task-content">
                            <p className="task-title">MATICX/WGSA🔥</p>
                            <div className="additional-text">
                                <span className="label">Total Staked: </span>
                                <Counter end={totalMATICXStaked || 0} decimals={0} /> {/* Usa el valor formateado sin decimales */}
                                <span className="suffix">
                                    {totalMATICXStaked >= 1_000_000 ? "K" : totalMATICXStaked >= 1_000 ? "K" : ""} $MATICX
                                </span>
                            </div>
                        </div>
                        <div className="task-action">
                            <div className="task-reward-container">
                                <p className="task-reward">APR: 71.45%</p>
                                <div className="additional-text"><SEv6Rewards /></div>
                            </div>
                        </div>
                    </div>
                    {visibleComponent === 'SEHeaderSix' && (
                        <div>
                            <SEHeaderSix />
                        </div>
                    )}

                    {/* Tarea 2 */}
                    <div
                        className="blog__item"
                        onClick={() => handleComponentClick('SEHeaderFour')}
                        style={{ cursor: "pointer", transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out" }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-10px)";
                            e.currentTarget.style.boxShadow = "0px 4px 10px rgba(128, 0, 128, 0.6)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                        }}
                    >
                        <div className="task-icon">
                            <img src="/img/ankrPOL-WGSA.png" alt="Goblin Icon" />
                        </div>
                        <div className="task-content">
                            <p className="task-title">ankrPOL/WGSA🔥</p>
                            <div className="additional-text">
                                <span className="label">Total Staked: </span>
                                <Counter end={totalANKRPOLStaked || 0} decimals={0} /> {/* Usa el valor formateado sin decimales */}
                                <span className="suffix">
                                    {totalANKRPOLStaked >= 1_000_000 ? "K" : totalANKRPOLStaked >= 1_000 ? "K" : ""} $ankrPOL
                                </span>
                            </div>
                        </div>
                        <div className="task-action">
                            <div className="task-reward-container">
                                <p className="task-reward">APR: 72.98%</p>
                                <div className="additional-text"><SEv4Rewards /></div>
                            </div>
                        </div>
                    </div>
                    {visibleComponent === 'SEHeaderFour' && (
                        <div>
                            <SEHeaderFour />
                        </div>
                    )}

                    {/* Tarea 2 */}
                    <div
                        className="blog__item"
                        onClick={() => handleComponentClick('SEHeaderFive')}
                        style={{ cursor: "pointer", transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out" }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-10px)";
                            e.currentTarget.style.boxShadow = "0px 4px 10px rgba(128, 0, 128, 0.6)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                        }}
                    >
                        <div className="task-icon">
                            <img src="/img/aPOL-WGSA.png" alt="Goblin Icon" />
                        </div>
                        <div className="task-content">
                            <p className="task-title">aPolWMATIC/WGSA🔥</p>
                            <div className="additional-text">
                                <span className="label">Total Staked: </span>
                                <Counter end={totalAPOLStaked || 0} decimals={0} /> {/* Usa el valor formateado sin decimales */}
                                <span className="suffix">
                                    {Number(totalAPOLStaked) >= 1_000_000 ? "K" : Number(totalAPOLStaked) >= 1_000 ? "K" : ""} $aPOL
                                </span>
                            </div>
                        </div>
                        <div className="task-action">
                            <div className="task-reward-container">
                                <p className="task-reward">APR: 74.08%</p>
                                <div className="additional-text"><SEv5Rewards /></div>
                            </div>
                        </div>
                    </div>
                    {visibleComponent === 'SEHeaderFive' && (
                        <div>
                            <SEHeaderFive />
                        </div>
                    )}
                </div>
            </div>

            {/* Estilos CSS */}
            <style jsx>{`
                .tasks-list {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .blog__item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    background: transparent;
                    padding: 15px 20px;
                    height: auto;
                }

                .task-icon img {
                    width: 50px;
                    height: 50px;
                    border-radius: 10px;
                }

                .task-content {
                    flex: 1;
                    text-align: left;
                    margin-left: 15px;
                }

                .task-title {
                    font-size: 14px;
                    margin-bottom: 5px;
                }

                .task-action {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                }

                .task-reward-container {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                }

                .task-reward {
                    font-size: 12px;
                    margin: 15px 0 0 0;
                }

                .additional-text {
                    font-size: 9px;
                    margin: 5px 0 0 0;
                }

                @media screen and (max-width: 768px) {
                    .blog__item {
                        flex-direction: row;
                        align-items: center;
                        padding: 10px;
                        gap: 10px;
                        height: auto;
                    }

                    .task-icon {
                        margin-top: 0;
                    }

                    .task-action {
                        font-size: 14px; 
                        margin-top: 15px; 
                        margin-left: 0; 
                        justify-content: flex-end; 
                    }

                    .task-action p {
                        white-space: nowrap;
                    }
                }
            `}</style>
        </section>
    );
};

export default StakeGSA;
