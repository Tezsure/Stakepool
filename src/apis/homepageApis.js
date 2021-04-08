import axios from 'axios';
import CONFIG from './config';

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
