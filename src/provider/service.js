import { baseLink } from "./common";


export function FetchPost(apiLink, data) {
    return new Promise((resolve, reject) => {
        fetch(baseLink + apiLink, {
            method: 'post', headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)'
            }, body: JSON.stringify(data)
        }).then(response => {
            if (response.status !== 201 && response.status !== 202 && response.status !== 200) {
                //burada kötü istekleri veya sunucu hatalarını tek bir yerden yönetebiliriz.
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
