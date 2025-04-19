import React from 'react';
import { useContract, useContractRead, useAddress } from '@thirdweb-dev/react';
import { STAKING_CONTRACT_ADDRESS } from '../../consts/ZeusContracts';

const ZeusMiningCount: React.FC = () => {
  const address = useAddress();
  const { contract } = useContract(STAKING_CONTRACT_ADDRESS);
  const { data: stakedTokens } = useContractRead(contract, "getStakeInfo", [address]);

  // Función para contar el número de NFTs en el array stakedTokens
  const getTotalStakedNfts = () => {
    if (!stakedTokens || !stakedTokens[0]) return 0;
    return stakedTokens[0].length;
  };

  return (
    <div>
      <p>
        {getTotalStakedNfts()} Zeus
      </p>
    </div>
  );
};

export default ZeusMiningCount;
