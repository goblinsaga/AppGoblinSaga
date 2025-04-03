import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const tokenContractAddress = '0x6d80113e533a2C0fe82EaBD35f1875DcEA89Ea97';
const smartContractAddress = '0xDA99b83Effd726f25f6bbB49fBf70844D1B85DbD';

const erc20Abi = [
    {
        "constant": true,
        "inputs": [{ "name": "_owner", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "name": "balance", "type": "uint256" }],
        "type": "function"
    }
];

const useStakedAPOL = () => {
    const [balance, setBalance] = useState<string | null>(null);

    useEffect(() => {
        const provider = new ethers.providers.JsonRpcProvider('https://polygon-mainnet.g.alchemy.com/v2/k2giPV8cSqnNo8IYCqbkonOpJKYyoaVR');

        const fetchBalance = async () => {
            try {
                const tokenContract = new ethers.Contract(tokenContractAddress, erc20Abi, provider);
                const balance = await tokenContract.balanceOf(smartContractAddress);

                console.log("RAW BALANCE (wei):", balance.toString()); // 🔍 Muestra el balance crudo en la consola

                // Convierte el balance a formato normal
                const formattedBalance = ethers.utils.formatUnits(balance, 18);
                console.log("FORMATTED BALANCE:", formattedBalance); // 🔍 Muestra el balance después de formatear

                setBalance(formattedBalance);
            } catch (error) {
                console.error('Error fetching token balance:', error);
                setBalance(null);
            }
        };

        fetchBalance();
    }, []);

    return balance;
};

export default useStakedAPOL;