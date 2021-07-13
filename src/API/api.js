import * as axios from "axios";

const instance = axios.create({
    baseURL: 'https://ipfs.io/ipfs/',
    headers: {}
});

export const encodingAPI = {
    getEncodingData(hash) {
        return instance.get(hash);
    },
};