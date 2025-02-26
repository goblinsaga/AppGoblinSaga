import ClaimRewardsNFTClaimThree from "./dailyrewardseight";
import ClaimRewardsNFTClaim from "./dailyrewardsmint";
import ClaimRewardsNFTClaimTwo from "./dailyrewardsseven";
import ClaimRewardsNFTClaimBox from "./dailyrewardsten";

const ClaimDailyRewards = () => {
    return (
        <section id="news">
            <div id="task-center" className="container">
                <p id="partners-task" style={{ textAlign: "center", marginTop: "100px" }}>App Tasks | Goblin Saga</p>
                <div className="tasks-list">
                    {/* Tarea 0 */}
                    <div className="blog__item">
                        <div className="task-icon">
                            <img src="/img/MLGSA.png" alt="Goblin Icon" />
                        </div>
                        <div className="task-content">
                            <p style={{ color: "yellow" }} className="task-title">Mint a Goblin NFT</p>
                            <p style={{ color: "yellow" }} className="task-reward">+1000000 <img style={{ marginTop: "-3px", width: "20px" }} src="/img/LOGOS-GS-32x32.png" alt="" /></p>
                            <p style={{ color: "yellow", fontSize: "9px", marginTop: "-15px" }} className="task-reward">14 Streaks = +1500000 <img style={{ marginTop: "-3px", width: "9px" }} src="/img/LOGOS-GS-32x32.png" alt="" /></p>
                        </div>
                        <div className="task-action">
                            <ClaimRewardsNFTClaim />
                        </div>
                    </div>

                    {/* Tarea 1 */}
                    <div className="blog__item">
                        <div className="task-icon">
                            <img src="/img/MLGSA.png" alt="Goblin Icon" />
                        </div>
                        <div className="task-content">
                            <p style={{ color: "yellow" }} className="task-title">Mint a Token Box Lvl.1</p>
                            <p style={{ color: "yellow" }} className="task-reward">+1100000 <img style={{ marginTop: "-3px", width: "20px" }} src="/img/LOGOS-GS-32x32.png" alt="" /></p>
                            <p style={{ color: "yellow", fontSize: "9px", marginTop: "-15px" }} className="task-reward">14 Streaks = +1600000 <img style={{ marginTop: "-3px", width: "9px" }} src="/img/LOGOS-GS-32x32.png" alt="" /></p>
                        </div>
                        <div className="task-action">
                            <ClaimRewardsNFTClaimBox />
                        </div>
                    </div>

                    {/* Tarea 2 */}
                    <div className="blog__item">
                        <div className="task-icon">
                            <img src="/img/MLGSA.png" alt="Goblin Icon" />
                        </div>
                        <div className="task-content">
                            <p style={{ color: "yellow" }} className="task-title">Mint a Enchanted Amulet Lvl.3</p>
                            <p style={{ color: "yellow" }} className="task-reward">+500000 <img style={{ marginTop: "-3px", width: "20px" }} src="/img/LOGOS-GS-32x32.png" alt="" /></p>
                            <p style={{ color: "yellow", fontSize: "9px", marginTop: "-15px" }} className="task-reward">14 Streaks = +550000 <img style={{ marginTop: "-3px", width: "9px" }} src="/img/LOGOS-GS-32x32.png" alt="" /></p>
                        </div>
                        <div className="task-action">
                            <ClaimRewardsNFTClaimThree />
                        </div>
                    </div>

                    {/* Tarea 3 */}
                    <div className="blog__item">
                        <div className="task-icon">
                            <img src="/img/MLGSA.png" alt="Goblin Icon" />
                        </div>
                        <div className="task-content">
                            <p style={{ color: "yellow" }} className="task-title">Mint a Greed Potion Lvl.1</p>
                            <p style={{ color: "yellow" }} className="task-reward">+300000 <img style={{ marginTop: "-3px", width: "20px" }} src="/img/LOGOS-GS-32x32.png" alt="" /></p>
                            <p style={{ color: "yellow", fontSize: "9px", marginTop: "-15px" }} className="task-reward">14 Streaks = +350000 <img style={{ marginTop: "-3px", width: "9px" }} src="/img/LOGOS-GS-32x32.png" alt="" /></p>
                        </div>
                        <div className="task-action">
                            <ClaimRewardsNFTClaimTwo />
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
                    height: 120px;
                }

                .task-icon img {
                    width: 70px;
                    height: 70px;
                    border-radius: 10px;
                }

                .task-content {
                    flex: 1;
                    text-align: left;
                    margin-left: 15px;
                    padding-top: 1rem;
                }

                .task-title {
                    font-size: 16px;
                    margin-bottom: 5px;
                }

                .task-reward {
                    font-size: 14px;
                }

                .task-action {
                    margin-top: 25px;
                    display: flex;
                    align-items: center;
                }

                .task-action button {
                    border: none;
                    color: white;
                    padding: 10px 20px;
                    border-radius: 8px;
                    text-decoration: none;
                    font-size: 14px;
                    font-weight: bold;
                }

                @media screen and (max-width: 768px) {
                    .blog__item {
                        flex-direction: column;
                        align-items: flex-start;
                        text-align: left;
                        gap: 10px;
                        height: 120px;
                        padding: 10px 15px;
                    }

                    .task-icon {
                        display: flex;
                        margin-top: 10px;
                        align-self: flex-start;
                    }

                    .task-content {
                        display: none;
                    }

                    .task-action {
                        margin-top: 10px;
                        justify-content: flex-start;
                        width: 100%;
                        margin-top: -220px;
                        margin-left: 130px;
                    }

                    .task-action button {
                        width: 100%;
                        text-align: center;
                        padding: 8px 15px;
                        font-size: 14px;
                    }
                }
            `}</style>
        </section>
    );
};

export default ClaimDailyRewards;