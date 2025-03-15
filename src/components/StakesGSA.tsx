import React, { useState } from "react"; // Importa useState
import SEHeaderH from "./SimpleEarnOneTestThree";
import SEHeader2Two from "./SimpleEarnTwoTestTwo";
import SEHeaderThree from "./SimpleEarnThreeTest";
import SEHeaderFour from "./SimpleEarnFourTest";

const StakeGSA = () => {
    // Estados para controlar la visibilidad de cada componente
    const [showSEHeaderH, setShowSEHeaderH] = useState(false);
    const [showSEHeader2Two, setShowSEHeader2Two] = useState(false);
    const [showSEHeaderThree, setShowSEHeaderThree] = useState(false);
    const [showSEHeaderFour, setShowSEHeaderFour] = useState(false);

    return (
        <section id="news" style={{ marginTop: "-200px" }}>
            <div id="defi-stake" className="container">
                <h3 className="fn__maintitle big" data-text="DeFi Stake" data-align="center">
                    DeFi Stake
                </h3>
                <div className="tasks-list">
                    {/* Tarea 0 */}
                    <div
                        className="blog__item"
                        onClick={() => setShowSEHeaderH(!showSEHeaderH)}
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
                        </div>
                        <div className="task-action">
                            <p className="task-reward">APR: 9.13%</p>
                        </div>
                    </div>
                    {/* Muestra SEHeaderH condicionalmente */}
                    {showSEHeaderH && (
                        <div>
                            <SEHeaderH />
                        </div>
                    )}

                    {/* Tarea 1 */}
                    <div
                        className="blog__item"
                        onClick={() => setShowSEHeader2Two(!showSEHeader2Two)}
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
                        </div>
                        <div className="task-action">
                            <p className="task-reward">APR: 27.37%</p>
                        </div>
                    </div>
                    {/* Muestra SEHeader2Two condicionalmente */}
                    {showSEHeader2Two && (
                        <div>
                            <SEHeader2Two />
                        </div>
                    )}

                    {/* Tarea 2 */}
                    <div
                        className="blog__item"
                        onClick={() => setShowSEHeaderThree(!showSEHeaderThree)}
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
                        </div>
                        <div className="task-action">
                            <p className="task-reward">APR: 36.4%</p>
                        </div>
                    </div>
                    {/* Muestra SEHeaderThree condicionalmente */}
                    {showSEHeaderThree && (
                        <div>
                            <SEHeaderThree />
                        </div>
                    )}

                    {/* Tarea 2 */}
                    <div
                        className="blog__item"
                        onClick={() => setShowSEHeaderFour(!showSEHeaderFour)}
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
                            <p className="task-title">ankrPOL/WGSA</p>
                        </div>
                        <div className="task-action">
                            <p className="task-reward">APR: 72.98%</p>
                        </div>
                    </div>
                    {showSEHeaderFour && (
                        <div>
                            <SEHeaderFour />
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
                            <img src="/img/aPOL-WGSA.png" alt="Goblin Icon" />
                        </div>
                        <div className="task-content">
                            <p className="task-title">aPolWMATIC/WGSA</p>
                        </div>
                        <div className="task-action">
                            <p className="task-reward">Coming Soon</p>
                        </div>
                    </div>

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
                    height: auto; /* Cambiado a auto para ajustarse al contenido */
                }

                .task-icon img {
                    width: 50px; /* Reducido para móviles */
                    height: 50px; /* Reducido para móviles */
                    border-radius: 10px;
                }

                .task-content {
                    flex: 1;
                    text-align: left;
                    margin-left: 15px;
                }

                .task-title {
                    font-size: 14px; /* Reducido para móviles */
                    margin-bottom: 5px;
                }

                .task-reward {
                    font-size: 12px; /* Reducido para móviles */
                }

                .task-action {
                    display: flex;
                    align-items: center;
                    margin-top: 15px; /* Eliminado margen superior */
                }

                @media screen and (max-width: 768px) {
                    .blog__item {
                        flex-direction: row; /* Mantener dirección horizontal */
                        align-items: center;
                        padding: 10px;
                        gap: 10px;
                        height: auto; /* Ajustar al contenido */
                    }

                    .task-icon {
                        margin-top: 0; /* Eliminado margen superior */
                    }

                    .task-action {
                        font-size: 14px; 
                        margin-top: 15px; 
                        margin-left: 0; 
                        justify-content: flex-end; 
                    }

                    .task-action p {
                        white-space: nowrap; /* Evitar salto de línea */
                    }
                }
            `}</style>
        </section>
    );
};

export default StakeGSA;
