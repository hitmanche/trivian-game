import { baseLink } from "./common";

//APIDEN ISTEK CEKILIP EGER OLUMLU DEGILSE PROMISE YAPISI ILE BUTUN KONTROLLERI BURADA SAGLAYABILIRIZ
export function FetchGet(apiLink) {
    return new Promise((resolve, reject) => {
        fetch(baseLink + apiLink, {
            method: 'get', headers: {
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
