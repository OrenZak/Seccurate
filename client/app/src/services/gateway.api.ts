import { END_POINTS } from '../config';

const BASE_HEADERS = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
};

export interface ApiResult<T extends object> {
    error?: string;
    response?: T;
}

export default class ApiGateway {
    user = {
        async login(username: string, password: string): Promise<ApiResult<{ result: string }>> {
            return fetch(`${END_POINTS.gatewayURL}/login`, {
                method: 'POST',
                headers: { ...BASE_HEADERS },
                credentials: 'same-origin',
                body: JSON.stringify({ username, password }),
            })
                .then(checkStatus)
                .then(parseJSON)
                .then(result => ({ response: { result } }))
                .catch(error => ({ error }));
        },
    };

    targets = {
        async fetchAll(page: number = 0, pageCount: number = 20): Promise<ApiResult<FetchAllResponse>> {
            return fetch(`${END_POINTS.gatewayURL}/config_target?page=${page}&size=${pageCount}`, {
                method: 'GET',
                headers: { ...BASE_HEADERS },
                credentials: 'same-origin',
            })
                .then(checkStatus)
                .then(parseJSON)
                .then(response => {
                    return { response: { targets: [...response._configEntityArray] } };
                })
                .catch(error => ({ error: error.msg }));
        },

        async add(target: Target): Promise<any> {
            return fetch(`${END_POINTS.gatewayURL}/config_target`, {
                method: 'POST',
                headers: { ...BASE_HEADERS },
                body: JSON.stringify({ ...target }),
            })
                .then(checkStatus)
                .then(parseJSON)
                .then(() => ({ response: { succeed: true } }))
                .catch(error => ({ error: error.msg }));
        },

        async update(target: Target): Promise<any> {
            return fetch(`${END_POINTS.gatewayURL}/config_target`, {
                method: 'PUT',
                headers: { ...BASE_HEADERS },
                body: JSON.stringify({ ...target }),
            })
                .then(checkStatus)
                .then(parseJSON)
                .then(() => ({ response: { succeed: true } }))
                .catch(error => ({ error: error.msg }));
        },

        async delete(id: string): Promise<any> {
            return fetch(`${END_POINTS.gatewayURL}/config_target`, {
                method: 'DELETE',
                headers: { ...BASE_HEADERS },
                body: JSON.stringify({ id }),
            })
                .then(checkStatus)
                .then(parseJSON)
                .then(() => ({ response: { succeed: true } }))
                .catch(error => ({ error: error.msg }));
        },
    };
}

async function checkStatus(response: Response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        const { error } = (await parseJSON(response)) as ServerError;
        throw error;
    }
}

function parseJSON(response: Response) {
    return response.json();
}

export interface ServerError {
    error: string;
}
