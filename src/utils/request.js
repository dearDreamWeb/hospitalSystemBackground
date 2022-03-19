import axios from 'axios';

let test = 'http://192.168.31.98:8081/hospital';
let test1 = 'http://hospital.liqiu.vip/hospital';
let test2 = 'http://dockerhospital.liqiu.vip/hospital';

// console.log(import.meta.env.MODE)

const instance = axios.create({
    baseURL: import.meta.env.MODE === 'production'
        ? import.meta.env.VITE_BASE_URL
        : test1,
    timeout: 5000
})

instance.interceptors.response.use(
    response => {
        if (response.status === 200) {
            if (response.data.code === 10003) {
                localStorage.clear();
                window.location.href = '/login';
                return;
            }
            return response.data;
        } else {
            Promise.reject();
        }
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

function request(url, options = {}) {
    return new Promise((resolve, reject) => {
        const token = window.localStorage.getItem('token')
        const headers = {
            token
        }

        if (options.method === 'get' || options.method === 'delete') {
            if (options.data && typeof options.data === 'object') {
                url = `${url}?`;
                let count = 0;
                for (const k in options.data) {
                    if (count > 0) {
                        url += '&' + k + '=' + options.data[k]
                    } else {
                        url += k + '=' + options.data[k]
                    }
                    count++;

                }
            }

            return instance[options.method](url, {
                ...options,
                headers
            })
                .then((response) => {
                    resolve(response)
                })
                .catch((response) => {
                    reject(response)
                })
        } else if (options.method === 'post') {
            return instance
                .post(url, options.data, { headers })
                .then((response) => {
                    resolve(response)
                })
                .catch((response) => {
                    resolve({
                        success: false,
                    })
                })
        } else if (options.method === 'put') {
            return instance
                .put(url, options.data, { headers })
                .then((response) => {
                    resolve(response)
                })
                .catch((response) => {
                    resolve({
                        success: false,
                    })
                })
        }
    })
}

export default request;
