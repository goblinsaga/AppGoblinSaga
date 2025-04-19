'use client';

import { useAddress, useContract, useContractRead } from "@thirdweb-dev/react";
import { STAKING_CONTRACT_ADDRESS } from "../../consts/ZeusContracts";
import { useEffect, useState } from "react";

type Props = {
  tokenId: number;
};

export default function ZeusMiningCount({ tokenId }: Props) {
  const address = useAddress();
  const [stakedCount, setStakedCount] = useState<number>(0);

  const { contract: stakingContract } = useContract(STAKING_CONTRACT_ADDRESS);
  const { data: stakeInfo } = useContractRead(
    stakingContract,
    "getStakeInfoForToken",
    address ? [tokenId, address] : undefined
  );

  useEffect(() => {
    try {
      if (stakeInfo && stakeInfo[0]) {
        setStakedCount(stakeInfo[0].toNumber());
      } else {
        setStakedCount(0);
      }
    } catch {
      setStakedCount(0);
    }
  }, [stakeInfo]);

  return stakedCount > 0 ? <>{stakedCount}</> : null;
}
