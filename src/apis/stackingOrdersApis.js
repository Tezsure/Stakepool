import { TezosToolkit } from '@taquito/taquito';
const CONFIG = require('./config');

export const getBetsByBettor = async (address, network) => {
    try {
        const bets = [];
        const tezos = new TezosToolkit(CONFIG.RPC_NODES[network]);
        tezos.setRpcProvider(CONFIG.RPC_NODES[network]);
        const contract = await tezos.contract.at(CONFIG.CONTRACT[network]);
        const storage = await contract.storage();
        const betByCycle = await storage.bettors.get(address);
        betByCycle.keyMap.forEach(async (element) => {
            let cycleValue = await betByCycle.get(element);
            bets.push({
                cycle: parseInt(element),
                stakedAt: cycleValue.stakedAt.c[0],
                stakedAmount: cycleValue.amount.c[0],
                withdrawn: cycleValue.withdrawn,
                withdrawnAmount: cycleValue.withdrawnAmount.c[0],
                range: {
                    low: cycleValue.range['1'].c[0],
                    high: cycleValue.range['2'].c[0],
                },
            });
        });
        return {
            sucess: true,
            bets,
        };
    } catch (error) {
        console.log(error);
        return {
            sucess: false,
            error,
        };
    }
};

export const getCycleData = async (cycle, network) => {
    try {
        const cycleDetails = {};
        const tezos = new TezosToolkit(CONFIG.RPC_NODES[network]);
        const contract = await tezos.contract.at(CONFIG.CONTRACT[network]);
        const storage = await contract.storage();
        const cycleData = await storage.cycleData.get('' + cycle);
        cycleDetails.concluded = cycleData.concluded;
        cycleDetails.endingPrice = cycleData.endingPrice.c[0];
        cycleDetails.referencePrice = cycleData.referencePrice.c[0];
        return {
            sucess: true,
            cycleDetails,
        };
    } catch (error) {
        return {
            sucess: false,
            error,
        };
    }
};
