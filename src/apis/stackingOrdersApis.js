import Tezos from '@taquito/taquito';
import CONFIG from './config';
const tezos = new Tezos.TezosToolkit(CONFIG.RPC_NODES.TESTNET);

export const getBetsByBettor = async (address) => {
    try {

        const bets = []
        const contract = await tezos.contract.at(CONFIG.CONTRACT.TESTNET);
        const storage = await contract.storage();
        const betByCycle = await storage.bettors.get(address);
        betByCycle.keyMap.forEach(async (element) => {
            let cycleValue = await betByCycle.get(element);
            bets.push({cycle : parseInt(element) , stakedAt : cycleValue.stakedAt.c[0] , withdrawn : cycleValue.withdrawn ,withdrawnAmount : cycleValue.withdrawnAmount.c[0] , range : {low : cycleValue.range["1"].c[0] , high : cycleValue.range["2"].c[0]}});
            
        });
        return {
            sucess : true,
            bets
        }
    }
    catch(error)
    {
        return {
            sucess: false,
            error,
        }
    }
}

export const getCycleData = async (cycle) => {
    try {

        const cycleDetails = {}
        const contract = await tezos.contract.at(CONFIG.CONTRACT.TESTNET);
        const storage = await contract.storage();
        const cycleData = await storage.cycleData.get(""+cycle);
        cycleDetails.concluded = cycleData.concluded;
        cycleDetails.endingPrice = cycleData.endingPrice.c[0];
        cycleDetails.referencePrice = cycleData.referencePrice.c[0];
        return {
            sucess : true,
            cycleDetails
        }
    }
    catch(error)
    {
        return {
            sucess: false,
            error,
        }
    }
}
