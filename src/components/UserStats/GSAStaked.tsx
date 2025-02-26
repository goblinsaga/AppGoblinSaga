import {
    useAddress,
    useContract,
    useContractRead,
    useTokenBalance,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { stakingContractAddress } from "../../../consts/Details";
import React from "react";

const GSAStaked = () => {
    const address = useAddress();
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [password, setPassword] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => {
                setErrorMessage('');
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const { contract: staking } = useContract(stakingContractAddress, "custom");
    const { data: rewardTokenAddress } = useContractRead(staking, "rewardToken");
    const { data: stakingTokenAddress } = useContractRead(staking, "stakingToken");

    const { contract: stakingToken } = useContract(stakingTokenAddress, "token");
    const { data: stakingTokenBalance } = useTokenBalance(stakingToken, address);

    const { data: stakeInfo, refetch: refetchStakingInfo } = useContractRead(staking, "getStakeInfo", [address || "0"]);

    useEffect(() => {
        const interval = setInterval(refetchData, 10000);
        return () => clearInterval(interval);
    }, [stakingToken]);

    const refetchData = () => {
        if (stakingToken) {
            refetchStakingInfo();
        }
    };

    const handleLogin = () => {
        if (password === "stakegsa") {
            setLoggedIn(true);
            setSuccessMessage('Logged In Successfully');
        } else {
            setErrorMessage('Wrong Password');
            setPassword("");
        }
    };

    return (
        <div>
            <p>
                {!stakingTokenBalance
                    ? "Loading..."
                    : parseFloat(stakingTokenBalance.displayValue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
        </div>
    );
};

export default GSAStaked;
