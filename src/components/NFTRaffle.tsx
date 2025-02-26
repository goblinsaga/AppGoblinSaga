import type { NextPage } from "next";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { MediaRenderer, useAddress, useContract, useContractRead } from "@thirdweb-dev/react";
import { HERO_IMAGE_URL, LOTTERY_CONTRACT_ADDRESS } from "../../consts/addresses";
import PrizeNFT from "../components/RaffleComponents/PrizeNFT";
import ErrorMessagePopup from '../components/popups/ErrorMessagePopup';
import SuccessMessagePopup from '../components/popups/SuccessMessagePopup';
import CountdownTimer from "./CountdownTimer";

const Raffle: NextPage = () => {
    const targetDate = new Date('2024-12-10T11:00:00');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [ticketAmount, setTicketAmount] = useState(1);

    const address = useAddress();
    const { contract } = useContract(LOTTERY_CONTRACT_ADDRESS);
    const { data: lotteryStatus } = useContractRead(contract, "lotteryStatus");
    const { data: ticketCost, isLoading: ticketCostLoading } = useContractRead(contract, "ticketCost");
    const ticketCostInEther = ticketCost ? ethers.utils.formatEther(ticketCost) : "0";
    const { data: totalEntries, isLoading: totalEntriesLoading } = useContractRead(contract, "totalEntries");

    const ticketCostSubmit = parseFloat(ticketCostInEther) * ticketAmount;

    const handleConnectWallet = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            setSuccessMessage('Wallet connected successfully');
        } catch (error) {
            setErrorMessage('Error: Unable to connect wallet.');
        }
    };

    const handleBuyTickets = async () => {
        if (!address || !contract) {
            setErrorMessage("Please connect your wallet first.");
            return;
        }

        try {
            const value = ethers.utils.parseEther(ticketCostSubmit.toString());
            await contract.call("buyTicket", [ticketAmount], { value });
            setSuccessMessage('Entry successfully submitted!');
        } catch (error) {
            setErrorMessage('Error: Transaction rejected or insufficient funds.');
        }
    };

    const increaseTicketAmount = () => setTicketAmount(ticketAmount + 1);
    const decreaseTicketAmount = () => ticketAmount > 1 && setTicketAmount(ticketAmount - 1);

    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => setErrorMessage(''), 4000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(''), 4000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    return (
        <section id="news">
            <div id="nft-raffle" className="container">
                <h3 className="fn__maintitle big" data-text="NFT Raffle" data-align="center">
                    NFT Raffle
                </h3>
                <div className="fn_cs_news">
                    <div className="news_part">
                        <div className="left_items">
                            <div className="blog__item">
                                <div className="image">
                                    {lotteryStatus ? (
                                        <PrizeNFT />
                                    ) : (
                                        <MediaRenderer
                                            src={HERO_IMAGE_URL}
                                            width="100%"
                                            height="auto"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="right_items">
                            <div style={{ height: "580px" }} className="blog__item">
                                <div>
                                    <p style={{ fontSize: "20px", color: "yellow" }}>Win The Goblin NFT</p>
                                    <p>
                                        Buy entries for a chance to win the NFT! Winner will be selected and transferred the NFT. The more entries the higher chance you have of winning the prize.
                                    </p>
                                </div>
                                
                                <div style={{ marginBottom: "30px" }}>
                                    {!ticketCostLoading && (
                                        <p>Ticket Price: <span style={{ color: "yellow", textAlign: "center" }}>{ticketCostInEther} POL</span></p>
                                    )}
                                </div>

                                <div>
                                    <CountdownTimer targetDate={targetDate} />
                                </div>

                                <div>
                                    <div>
                                        <div style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            height: "100%",
                                            width: "100%",
                                            marginTop: "30px",
                                        }}>
                                            <div className="qnt">
                                                <span className="decrease" onClick={decreaseTicketAmount}>-</span>
                                                <span className="summ">{ticketAmount}</span>
                                                <span className="increase" onClick={increaseTicketAmount}>+</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        height: "100%",
                                        width: "100%",
                                        marginTop: "30px",
                                    }}>
                                        {successMessage && <SuccessMessagePopup message={successMessage} onClose={() => setSuccessMessage('')} />}
                                        {errorMessage && <ErrorMessagePopup message={errorMessage} onClose={() => setErrorMessage('')} />}
                                        <button
                                            onClick={handleBuyTickets}
                                            disabled={!lotteryStatus}
                                            className="metaportal_fn_buttonLW"
                                        >
                                            Buy Ticket(s)
                                        </button>
                                    </div>
                                    <div>
                                        {!totalEntriesLoading && (
                                            <p style={{ textAlign: "center", marginTop: "20px" }}>Purchased Tickets: {totalEntries.toString()}</p>
                                        )}
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Raffle;
