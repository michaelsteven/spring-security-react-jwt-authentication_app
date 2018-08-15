import {ACCESS_TOKEN, API_BASE_URL} from "../config/Config";

const sendRequest = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    });

    if (localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN));
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
        .then(
            response =>
                response.json()
                    .then(
                        json => {
                            if (!response.ok) {
                                return Promise.reject(json)
                            }
                            return json;
                        }
                    )
        )
};

export function login(loginRequest) {
    return sendRequest({
        url: API_BASE_URL + "/public/auth/signin",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function register(registerRequest) {
    return sendRequest({
        url: API_BASE_URL + "/public/auth/signup",
        method: 'POST',
        body: JSON.stringify(registerRequest)
    });
}

export function updatePassword(updatePasswordRequest) {
    return sendRequest({
        url: API_BASE_URL + "/secure/account/update-password",
        method: 'POST',
        body: JSON.stringify(updatePasswordRequest)
    });
}