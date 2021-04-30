import axios from 'axios';
import { TezosToolkit } from '@taquito/taquito';
import { TempleWallet } from '@temple-wallet/dapp';

const CONFIG = require('./config');

export const placeBetAPI = async (network, BetAmount, RANGE) => {
    try {
        const highRange = RANGE.split('~')[1];
        const lowRange = RANGE.split('~')[0];
        const wallet = new TempleWallet('Stakepool');
        const walletNetwork = network === 'mainnet' ? 'mainnet' : 'edo2net';
        await wallet.connect(walletNetwork, { forcePermission: true });
        const tezos = wallet.toTezos();
        const contractInstance = await tezos.wallet.at(
            CONFIG.CONTRACT[network]
        );
        const operation = await contractInstance.methods
            .placeBet(highRange, lowRange)
            .send({ amount: parseInt(BetAmount, 10), mutez: false });
        await operation
            .confirmation(CONFIG.TAQUITO_CHECK_CONF_NUM)
            .then(() => operation.opHash);
        return {
            sucess: true,
            operationId: operation.opHash,
        };
    } catch (error) {
        return {
            sucess: false,
            error,
        };
    }
};

export const getCurrentCycle = async (network) => {
    try {
        const URL = CONFIG.TZSTATS[network];
        const TZ_RESPONSE = await axios.get(`${URL}/explorer/cycle/head`);
        const ctime = new Date(TZ_RESPONSE.data.end_time).valueOf();
        const stime = new Date(TZ_RESPONSE.data.start_time).valueOf();
        const cycle = TZ_RESPONSE.data.cycle;
        const sCycle = TZ_RESPONSE.data.follower_cycle.cycle + 1;
        const dur = (sCycle - cycle - 1) * (ctime - stime);
        return {
            sucess: true,
            duration: dur,
            cycletime: ctime,
            currentCycle: cycle,
            endCycle: sCycle,
        };
    } catch (error) {
        return {
            sucess: false,
            error,
        };
    }
};

export const fetchCurrentTzPrice = async () => {
    try {
        const URL = CONFIG.COINGECKO_API;
        const PRICE_RESPONSE = await axios.get(`${URL}`);
        return {
            sucess: true,
            currentprice: PRICE_RESPONSE.data.market_data.current_price.usd,
        };
    } catch (error) {
        return {
            sucess: false,
            error,
        };
    }
};

export const fetchContractStorage = async (network) => {
    try {
        const URL = CONFIG.TZSTATS[network];
        const CONTRACT = CONFIG.CONTRACT[network];
        const STORAGE_RESPONSE = await axios.get(
            `${URL}explorer/contract/${CONTRACT}/storage`
        );
        return {
            sucess: true,
            storage: STORAGE_RESPONSE.data,
        };
    } catch (error) {
        return {
            sucess: false,
            error,
        };
    }
};

export const getReferencePriceAndRanges = async (currentCycle, network) => {
    try {
        let data = {};
        let ranges = [];
        let cycle = currentCycle + 2;
        const tezos = new TezosToolkit(CONFIG.RPC_NODES[network]);
        tezos.setRpcProvider(CONFIG.RPC_NODES[network]);
        const contract = await tezos.contract.at(CONFIG.CONTRACT[network]);
        const storage = await contract.storage();
        const cycleData = await storage.cycleData.get('' + cycle);
        const totalAmount = cycleData.totalAmount;
        const roi = cycleData.roi['4'].c[0] / cycleData.roi['5'].c[0];
        let totalRewardWon = roi * totalAmount;
        totalRewardWon = totalRewardWon * 0.98;

        cycleData.amountByRange.keyMap.forEach((element) => {
            let amountInRange = cycleData.amountByRange.get(element);
            let estimatedRoi = (totalRewardWon / amountInRange) * 100;
            const rangeBasedRoi = {
                amountInRange: amountInRange.c[0],
                estimatedRoi: isFinite(estimatedRoi) ? estimatedRoi : (roi * 0.98 * 100),
            };
            ranges.push({
                low: element['0'].c[0] * element['0'].s,
                high: element['1'].c[0] * element['1'].s,
                rangeBasedRoi,
            });
        });
        data.referencePrice = cycleData.referencePrice.c[0];
        data.ranges = ranges;
        return {
            sucess: true,
            data,
        };
    } catch (error) {
        return {
            success: false,
            error,
        };
    }
};

export const getElementY = (query) => {
    return (
        window.pageYOffset +
        document.getElementById(query).getBoundingClientRect().top
    );
};

export const doScrolling = (element, duration) => {
    var startingY = window.pageYOffset;
    var elementY = getElementY(element);
    // If element is close to page's bottom then window will scroll only to some position above the element.
    var targetY =
        document.body.scrollHeight - elementY < window.innerHeight
            ? document.body.scrollHeight - window.innerHeight
            : elementY;
    var diff = targetY - startingY;

    var easing = function (t) {
        return t < 0.5
            ? 4 * t * t * t
            : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    };
    var start;

    if (!diff) return;

    // Bootstrap our animation - it will get called right before next frame shall be rendered.
    window.requestAnimationFrame(function step(timestamp) {
        if (!start) start = timestamp;
        // Elapsed miliseconds since start of scrolling.
        var time = timestamp - start;
        // Get percent of completion in range [0, 1].
        var percent = Math.min(time / duration, 1);
        // Apply the easing.
        // It can cause bad-looking slow frames in browser performance tool, so be careful.
        percent = easing(percent);

        window.scrollTo(0, startingY + diff * percent);

        // Proceed with animation as long as we wanted it to.
        if (time < duration) {
            window.requestAnimationFrame(step);
        }
    });
};
