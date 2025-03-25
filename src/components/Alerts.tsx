const Announce = () => {
    return (
        <section className="blog">
            <div className="container">
                <div className="blog__item">
                    <p>📢Maintenance scheduled for 26 March. Maintenance time ~1 to 3 Days.</p>
                    <p>Transactions will not be affected by upgrades during maintenance.</p>
                    <p>If you have any problem contact us via Discord</p>
                </div>
            </div>
            <style jsx>{`
                .blog {
                    margin-top: -110px;
                    margin-bottom: 100px;
                }
                .container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .blog__item {
                    padding: 15px;
                    text-align: center;
                    width: auto;
                }
                .blog__item p {
                    font-size: 13px;
                    margin: 5px 0;
                }
            `}</style>
        </section>
    );
};

export default Announce;
