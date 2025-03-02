import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Button, Input, Select, Text, Box, VStack, Container } from "@chakra-ui/react";

const smartContracts = [
    { name: "GSA NFT Claim", address: "0xe18cf2c54c64d76237b06c7b4081f74eda672960" },
    { name: "Greed Claim", address: "0x80d89a39fa93d03720aac5a1e49956cca9014008" },
    { name: "Amulet Claim", address: "0xc6168f1e52848c30c4c91e11b059584cb59e7cb6" },
    { name: "Token Box", address: "0xfbc30c0293003a39efa86aef9aa035f5d03ad86c" },
];

const tokenAddress = "0xC3882D10e49Ac4E9888D0C594DB723fC9cE95468";

const DepositDailyRewards = () => {
    const [selectedContract, setSelectedContract] = useState(smartContracts[0].address);
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [balance, setBalance] = useState("0");
    const [walletBalance, setWalletBalance] = useState("0");

    useEffect(() => {
        const fetchBalance = async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const tokenContract = new ethers.Contract(
                tokenAddress,
                ["function balanceOf(address) view returns (uint256)"],
                provider
            );
            const contractBalance = await tokenContract.balanceOf(selectedContract);
            setBalance(parseFloat(ethers.utils.formatEther(contractBalance)).toFixed(2));

            // Fetch wallet balance
            const accounts = await provider.listAccounts();
            const walletAddress = accounts[0];
            const walletBalance = await tokenContract.balanceOf(walletAddress);
            setWalletBalance(parseFloat(ethers.utils.formatEther(walletBalance)).toFixed(2));
        };

        fetchBalance();
    }, [selectedContract]);

    const handleDeposit = async () => {
        if (!amount || isNaN(amount)) {
            alert("Please enter a valid amount.");
            return;
        }

        try {
            setLoading(true); // Cambiar texto a "Depositing..."
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            // Aprobar el gasto de tokens
            const tokenContract = new ethers.Contract(
                tokenAddress,
                ["function approve(address spender, uint256 amount) public returns (bool)"],
                signer
            );

            const approveTx = await tokenContract.approve(selectedContract, ethers.utils.parseEther(amount));
            await approveTx.wait();

            // Interactuar con el contrato de recompensas
            const rewardContract = new ethers.Contract(
                selectedContract,
                ["function depositRewards(uint256 _amount) nonpayable"],
                signer
            );

            const depositTx = await rewardContract.depositRewards(ethers.utils.parseEther(amount), {
                value: ethers.utils.parseEther("0"),
            });

            await depositTx.wait();
            alert("Deposit successful!");
        } catch (error) {
            console.error(error);
            alert("An error occurred: " + error.message);
        } finally {
            setLoading(false); // Cambiar texto a "Deposit" nuevamente
        }
    };

    return (
        <Container maxW="container.md" centerContent pt="10rem" pb="10rem">
            <Box p="4" bg="gray.100" rounded="lg" shadow="md" w="full" maxW="md">
                <Text fontSize="xl" mb="4" textAlign="center">Deposit Rewards</Text>
                <VStack spacing="4" align="center" textAlign="center">
                    <Text fontSize="sm" fontWeight="medium">
                        Contract Balance: {balance} $GSA
                    </Text>
                    <Select
                        id="contract"
                        value={selectedContract}
                        onChange={(e) => setSelectedContract(e.target.value)}
                        bg="transparent"
                        border="none" 
                        p="2"
                        fontSize="lg" 
                        sx={{
                            width: "350px", 
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                            borderRadius: "5px", 
                            color: "black", 
                            fontWeight: "medium", 
                            paddingRight: "25px",
                        }}
                    >
                        {smartContracts.map((contract) => (
                            <option key={contract.address} value={contract.address}>
                                {contract.name}
                            </option>
                        ))}
                    </Select>

                    <div style={{ marginTop: "30px" }}>
                        <Text fontSize="sm" fontWeight="medium">Amount to Deposit</Text>
                        <Input
                            id="amount"
                            type="text"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            variant="outline"
                            bg="transparent"
                            color="white"
                            style={{ width: "100%", height: "40px" }}
                        />
                    </div>

                    <Button
                        onClick={handleDeposit}
                        colorScheme="blue"
                        width="full"
                        mt="4"
                        className="metaportal_fn_buttonLW"
                        isDisabled={loading}
                    >
                        {loading ? "Depositing..." : "Deposit"}
                    </Button>

                    <div style={{ marginTop: "30px" }}>
                        <Text mt="4" fontSize="sm" fontWeight="medium">
                            Wallet Balance: {walletBalance} $GSA
                        </Text>
                    </div>
                </VStack>
            </Box>
            <style jsx global>{`
                .chakra-select__icon-wrapper {
                    display: none !important;
                }
            `}</style>
        </Container>
    );
};

export default DepositDailyRewards;
