import React from 'react';
import { useContract, useContractRead, useAddress } from '@thirdweb-dev/react';
import { stakingContractAddress } from '../../consts/contractAddressesNew';

const GoblinsMiningCount: React.FC = () => {
  const address = useAddress();
  const { contract } = useContract(stakingContractAddress);
  const { data: stakedTokens } = useContractRead(contract, "getStakeInfo", [address]);

  // Función para contar el número de NFTs en el array stakedTokens
  const getTotalStakedNfts = () => {
    if (!stakedTokens || !stakedTokens[0]) return 0;
    return stakedTokens[0].length;
  };

  return (
    <div>
      <p>
        ({getTotalStakedNfts()}) Goblins Mining
      </p>
    </div>
  );
};

export default GoblinsMiningCount;
