import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Button, Input, Select, Text, Box, VStack, Container } from "@chakra-ui/react";

const smartContracts = [
    { name: "GSA Social 1", address: "0x64f29e9e63cce89afcc02f72ba450493d613a328" },
    { name: "GSA Social 2", address: "0xf14547926d383daf1476cb9319c0141eebce760f" },
    { name: "GSA Social 3", address: "0x5d5a56cf41f93ef67285d4310b9670414f2db820" },
    { name: "EPOP Social 1", address: "0x7eea0bb58436bb794a2f1c85af247fa00cd37477" },
    { name: "EPOP Social 2", address: "0x175aaacf0b47ac7682ceb891b559600a4416e809" },
    { name: "Tlaco Social 1", address: "0x68a47b881cc4db887f359d023d46aa846791d54b" },
    { name: "Tlaco Social 2", address: "0x5aa15eb1b820c019cd69b120c3c12ab0d0970fb6" },
    { name: "Daemon Social 1", address: "0x100b20ab742e40830f330a8fd73a284a28bb9742" },
    { name: "Daemon Social 2", address: "0x54ca7d5d98126a5430f357207ca47ebc1f28ba79" },
    { name: "Grand Gansta 1", address: "0x3d99db3836a53bfa41a68f2495e2c14cb1b0d42b" },
    { name: "Grand Gansta 2", address: "0x42eDcB9Ba95a3d4817197fE60E7FF0606CB436D3" },
    { name: "Grand Gansta 3", address: "0x2dB0B47988C7A00B2002a73D34A9BF5CC65A9a7A" },
    { name: "GSA NFT Claim", address: "0x6737c8b9079803CE5B93198ec3d8E3721A682Cca" },
    { name: "Greed Claim", address: "0x7c1149fd38ac89c52d0af38eba08a7ba1cf0a8d7" },
    { name: "Amulet Claim", address: "0x6679b3480c4e1e53e6d54fd7070acfc196d26cef" },
    { name: "Token Box", address: "0x4bd77d1c0856c81d382eb34d49cb8491819a8b53" },
    { name: "Epop NFT Claim", address: "0x2b87a483a4c1502ab29ac235d2467c7108e15f54" },
];

const tokenAddress = "0xc1e2859c9d20456022ade2d03f2e48345ca177c2";

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