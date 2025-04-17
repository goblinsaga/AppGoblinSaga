const TaskCenterApp = () => {
    return (
        <section>
            <div id="task-center">
                <div className="tasks-list">
                    {/* Tarea 0 */}
                    <div className="blog__item">
                        <div className="task-icon">
                            <img src="/img/MLGSA.png" alt="Goblin Icon" />
                        </div>
                        <div className="task-content">
                            <p className="task-title">Task Center</p>
                            <p style={{ color: "yellow" }} className="task-reward">Earn $GSA <img style={{ marginTop: "-3px", width: "20px" }} src="/img/GSAV2.png" alt="" /></p>
                            <p style={{ fontSize: "11px", marginTop: "-10px" }} className="task-reward">Claim every 6 Hours</p>
                        </div>
                        <div style={{ position: "relative", width: "150px", height: "45px", marginLeft: "-10px" }}>
                            <a style={{ textDecoration: "none" }} href="https://app.goblinsaga.xyz/task-center">
                                <button
                                    className="metaportal_fn_buttonLW"
                                    style={{
                                        cursor: 'pointer',
                                        width: '100%',
                                        display: 'block',
                                        textAlign: 'center',
                                    }}
                                >
                                    Go
                                </button>
                            </a>
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
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        background: transparent;
                        padding: 15px 20px;
                        height: 120px;
                    }

                    .task-icon {
                        display: flex;
                        margin-top: 10px;
                        align-self: flex-start;
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

export default TaskCenterApp;
