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
        if (betByCycle) {
            betByCycle.keyMap.forEach(async (element) => {
                let cycleValue = await betByCycle.get(element);
                bets.push({
                    cycle: parseInt(element),
                    stakedAt: cycleValue.stakedAt.toNumber(),
                    stakedAmount: cycleValue.amount.toNumber(),
                    withdrawn: cycleValue.withdrawn,
                    withdrawnAmount: cycleValue.withdrawnAmount.toNumber(),
                    range: {
                        low:
                            cycleValue.range['1'].toNumber(),
                        high:
                            cycleValue.range['2'].toNumber()
                    },
                });
            });
        }
        return {
            sucess: true,
            bets,
        };
    } catch (error) {
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
        tezos.setRpcProvider(CONFIG.RPC_NODES[network]);
        const contract = await tezos.contract.at(CONFIG.CONTRACT[network]);
        const storage = await contract.storage();
        const cycleData = await storage.cycleData.get('' + cycle);
        cycleDetails.concluded = cycleData.concluded;
        cycleDetails.endingPrice = cycleData.endingPrice.toNumber();
        cycleDetails.referencePrice = cycleData.referencePrice.toNumber();
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

export const withdrawAmount = async (cycle, network, wallet) => {
    try {
        const tezos = new TezosToolkit(CONFIG.RPC_NODES[network]);
        tezos.setProvider({ wallet });
        const contract = await tezos.wallet.at(CONFIG.CONTRACT[network]);
        const withdrawOp = await contract.methods.withdrawAmount(cycle).send();
        await withdrawOp
            .confirmation(CONFIG.TAQUITO_CHECK_CONF_NUM)
            .then(() => withdrawOp.opHash);
        return {
            sucess: true,
            operationId: withdrawOp.opHash,
        };
    } catch (error) {
        return {
            sucess: false,
            error,
        };
    }
};

export const calculateRewards = async (
    cycle,
    low,
    high,
    stakedAmount,
    network
) => {
    try {
        const cycleDetails = {};
        const conclusion = {};
        const tezos = new TezosToolkit(CONFIG.RPC_NODES[network]);
        tezos.setRpcProvider(CONFIG.RPC_NODES[network]);
        const contract = await tezos.contract.at(CONFIG.CONTRACT[network]);
        const storage = await contract.storage();
        const cycleData = await storage.cycleData.get('' + cycle);
        cycleDetails.concluded = cycleData.concluded;
        cycleDetails.endingPrice = cycleData.endingPrice.toNumber();
        cycleDetails.referencePrice = cycleData.referencePrice.toNumber();
        cycleDetails.totalAmount = cycleData.totalAmount.toNumber();
        let totalRewards =
            (cycleData.roi['4'].toNumber() * cycleDetails.totalAmount) /
            cycleData.roi['5'].toNumber();
        totalRewards = totalRewards * 0.98;
        cycleDetails.totalRewards = totalRewards;
        if (cycleDetails.concluded === false) {
            conclusion.status = 'Pending';
            conclusion.rewardWon = 0;
        } else {
            let lowPercent = low / 100;
            let highPercent = high / 100;
            let lowAmount = (cycleDetails.referencePrice * lowPercent) / 100;
            lowAmount = lowAmount + cycleDetails.referencePrice;
            let highAmount = (cycleDetails.referencePrice * highPercent) / 100;
            highAmount = highAmount + cycleDetails.referencePrice;
            if (lowAmount === highAmount) {
                if (low < 0 && cycleDetails.endingPrice < lowAmount) {
                    cycleData.amountByRange.keyMap.forEach(async (element) => {
                        if (
                            low === element['0'].toNumber() &&
                            high === element['1'].toNumber()
                        ) {
                            const valueByRange = await cycleData.amountByRange.get(
                                element
                            );
                            let rewardWon =
                                (stakedAmount * cycleDetails.totalRewards) /
                                valueByRange;
                            conclusion.rewardWon = rewardWon;
                            conclusion.status = 'Won';
                        }
                    });
                } else if (low > 0 && cycleDetails.endingPrice > lowAmount) {
                    cycleData.amountByRange.keyMap.forEach(async (element) => {
                        if (
                            low === element['0'].toNumber() &&
                            high === element['1'].toNumber()
                        ) {
                            const valueByRange = await cycleData.amountByRange.get(
                                element
                            );
                            let rewardWon =
                                (stakedAmount * cycleDetails.totalRewards) /
                                valueByRange;
                            conclusion.rewardWon = rewardWon;
                            conclusion.status = 'Won';
                        }
                    });
                } else {
                    conclusion.status = 'Lost';
                    conclusion.rewardWon = 0;
                }
            } else {
                if (
                    lowAmount <= cycleDetails.endingPrice &&
                    cycleDetails.endingPrice < highAmount
                ) {
                    cycleData.amountByRange.keyMap.forEach(async (element) => {
                        if (
                            low === element['0'].toNumber() &&
                            high === element['1'].toNumber()
                        ) {
                            const valueByRange = await cycleData.amountByRange.get(
                                element
                            );
                            let rewardWon =
                                (stakedAmount * cycleDetails.totalRewards) /
                                valueByRange.toNumber();
                            conclusion.rewardWon = rewardWon;
                            conclusion.status = 'Won';
                        }
                    });
                } else {
                    conclusion.status = 'Lost';
                    conclusion.rewardWon = 0;
                }
            }
        }
        return {
            sucess: true,
            details: { cycleDetails, conclusion },
        };
    } catch (error) {
        return {
            sucess: false,
            error,
        };
    }
};
