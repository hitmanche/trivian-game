import { baseLink } from "./common";

//APIDEN ISTEK CEKILIP EGER OLUMLU DEGILSE PROMISE YAPISI ILE BUTUN KONTROLLERI BURADA SAGLAYABILIRIZ
export function FetchGet(apiLink) {
    return new Promise((resolve, reject) => {
        fetch(baseLink + apiLink, {
            method: 'get', headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)'
            }
        }).then(response => {
            if (response.status !== 201 && response.status !== 202 && response.status !== 200) {
                reject(response);
            }
            else {
                resolve(response);
            }
        }).catch(error => {
            reject(error);
        });
    });
}
