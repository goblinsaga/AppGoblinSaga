import { useAddress, useContract, useNFT } from "@thirdweb-dev/react";
import { BUSINESSES_CONTRACT_ADDRESS, STAKING_CONTRACT_ADDRESS } from "../../../consts/ZeusContracts";
import { useEffect, useState } from "react";
import { ethers, BigNumber } from "ethers";
import ErrorMessagePopup from "../popups/ErrorMessagePopup";
import SuccessMessagePopup from "../popups/SuccessMessagePopup";
import stakingContractBoxABI from "../../../contracts/StakingContractBoxABI.json";

// Props for the BusinessCard component
type Props = {
    tokenId?: number;
};

// Define el tipo de staking contract
interface StakingContract {
    claimRewards(tokenId: number): Promise<void>;
    getStakeInfo(address: string): Promise<{
        _tokensStaked: number[];
        _tokenAmounts: BigNumber[];
        _totalRewards: BigNumber;
    }>;
    claimAllRewards?(tokenIds: number[]): Promise<void>; // Usa el operador `?` si no estás seguro si está definida.
    getStakeInfoForToken?(tokenId: number, staker: string): Promise<{
        _tokensStaked: number;
        _rewards: BigNumber;
    }>; // Usa el operador `?` si no estás seguro si está definida.
}

export default function ZeusClaim({ tokenId }: Props) {
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isClaiming, setIsClaiming] = useState(false);
    const address = useAddress();
    const [claimableRewards, setClaimableRewards] = useState<BigNumber>();

    const { contract: businessesContract } = useContract(BUSINESSES_CONTRACT_ADDRESS);
    const { data: nft } = useNFT(businessesContract, tokenId);

    // Obtener el contrato de staking
    const { contract: stakingContract } = useContract(STAKING_CONTRACT_ADDRESS);

    useEffect(() => {
        if (!stakingContract || !address || tokenId === undefined) return;

        async function loadClaimableRewards() {
            try {
                const stakeInfo = await (stakingContract as unknown as StakingContract).getStakeInfoForToken(tokenId, address);
                setClaimableRewards(stakeInfo._rewards);
            } catch (error) {
                console.error("Error fetching stake info:", error);
            }
        }

        loadClaimableRewards();

        const intervalId = setInterval(loadClaimableRewards, 1000);
        return () => clearInterval(intervalId);
    }, [stakingContract, address, tokenId]);

    const claimAllRewards = async () => {
        if (!window.ethereum) {
            setErrorMessage("No Ethereum wallet found.");
            return;
        }

        try {
            setIsClaiming(true);
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const stakingContractInstance = new ethers.Contract(
                STAKING_CONTRACT_ADDRESS,
                stakingContractBoxABI,
                signer
            ) as unknown as StakingContract;

            // Fetch the IDs that the wallet holds
            const stakeInfo = await stakingContractInstance.getStakeInfo(address);
            const tokenIds = stakeInfo._tokensStaked;

            if (tokenIds.length === 0) {
                setErrorMessage("No tokens to claim rewards for.");
                return;
            }

            // Procesar todas las transacciones en paralelo
            const batchTransaction = tokenIds.map((tokenId) =>
                stakingContractInstance.claimRewards(tokenId)
            );

            await Promise.all(batchTransaction);

            setSuccessMessage("$GSA Claimed");
        } catch (error) {
            console.error("Batch transaction error:", error);
            setErrorMessage("Error: Transaction rejected or insufficient funds.");
        } finally {
            setIsClaiming(false);
        }
    };

    return (
        <div>
            {successMessage && <SuccessMessagePopup message={successMessage} onClose={() => setSuccessMessage("")} />}
            {errorMessage && <ErrorMessagePopup message={errorMessage} onClose={() => setErrorMessage("")} />}
            <button className="metaportal_fn_buttonLW" onClick={claimAllRewards} disabled={isClaiming}>
                {isClaiming ? "Claiming..." : "Claim Rewards"}
            </button>
        </div>
    );
}
