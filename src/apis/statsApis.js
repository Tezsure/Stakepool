import { TezosToolkit } from '@taquito/taquito';
const CONFIG = require('./config');

export const getLastCycleStats = async (currentCycle, network) => {
    try {
        const data = {};
        let cycle = currentCycle - 1;

        const tezos = new TezosToolkit(CONFIG.RPC_NODES[network]);
        tezos.setRpcProvider(CONFIG.RPC_NODES[network]);
        const contract = await tezos.contract.at(CONFIG.CONTRACT[network]);
        const storage = await contract.storage();
        const cycleData = await storage.cycleData.get('' + cycle);
        if(cycleData.concluded === false)
        {
            throw new Error("Cycle has not concluded yet.");
        }
        data.totalBetAmount = cycleData.totalAmount.c[0];

        let referencePrice = cycleData.referencePrice.c[0];
        let endingPrice = cycleData.endingPrice.c[0];
        let roi = cycleData.roi['4'].c[0] / cycleData.roi['5'].c[0];
        let totalPoolRewardWon = roi * data.totalBetAmount;
        totalPoolRewardWon = 0.98 * totalPoolRewardWon;

        data.totalPoolRewardWon = totalPoolRewardWon;

        let changePercent = (endingPrice - referencePrice) / referencePrice;
        changePercent = changePercent * 10000;
        changePercent = Math.floor(changePercent);

        cycleData.amountByRange.keyMap.forEach(async (element) => {
            let low = element['0'].c[0] * element['0'].s;
            let high = element['1'].c[0] * element['1'].s;
            if (low !== high) {
                if (low <= changePercent && changePercent < high) {
                    let valueByRange = await cycleData.amountByRange.get(
                        element
                    );
                    let lowPrice =
                        referencePrice + (referencePrice * (low / 100)) / 100;
                    let highPrice =
                        referencePrice + (referencePrice * (high / 100)) / 100;
                    data.winningPriceRange = { lowPrice, highPrice };
                    data.totalAmountInWinningRange = valueByRange.c[0];
                    let aggregateROIPercent =
                        (data.totalPoolRewardWon /
                            data.totalAmountInWinningRange) *
                        100;
                        data.aggregateROIPercent = isNaN(aggregateROIPercent) ? 0 : aggregateROIPercent
                }
            } else if (low === high) {
                if (low < 0 && changePercent < low) {
                    let valueByRange = await cycleData.amountByRange.get(
                        element
                    );
                    let lowPrice =
                        referencePrice + (referencePrice * (low / 100)) / 100;
                    let highPrice =
                        referencePrice + (referencePrice * (high / 100)) / 100;
                    data.winningPriceRange = { lowPrice, highPrice };
                    data.totalAmountInWinningRange = valueByRange.c[0];
                    let aggregateROIPercent =
                        (data.totalPoolRewardWon /
                            data.totalAmountInWinningRange) *
                        100;
                        data.aggregateROIPercent = isNaN(aggregateROIPercent) ? 0 : aggregateROIPercent
                } else if (high > 0 && changePercent >= high) {
                    let valueByRange = await cycleData.amountByRange.get(
                        element
                    );
                    let lowPrice =
                        referencePrice + (referencePrice * (low / 100)) / 100;
                    let highPrice =
                        referencePrice + (referencePrice * (high / 100)) / 100;
                    data.winningPriceRange = { lowPrice, highPrice };
                    data.totalAmountInWinningRange = valueByRange.c[0];
                    let aggregateROIPercent =
                        (data.totalPoolRewardWon /
                            data.totalAmountInWinningRange) *
                        100;
                        data.aggregateROIPercent = isNaN(aggregateROIPercent) ? 0 : aggregateROIPercent
                }
            }
        });
        return {
            success: true,
            data,
        };
    } catch (error) {
        return {
            success: false,
            error,
        };
    }
};
