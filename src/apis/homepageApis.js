import axios from 'axios';
import CONFIG from './config';
import { TezosToolkit } from '@taquito/taquito';

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

export const fetchCurrentTzPrice = async (network) => {
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
        const contract = await tezos.contract.at(CONFIG.CONTRACT[network]);
        const storage = await contract.storage();
        const cycleData = await storage.cycleData.get('' + cycle);
        cycleData.amountByRange.keyMap.forEach((element) => {
            ranges.push({
                low: element['0'].c[0] * element['0'].s,
                high: element['1'].c[0] * element['1'].s,
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
