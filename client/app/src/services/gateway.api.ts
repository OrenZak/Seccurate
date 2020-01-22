import { END_POINTS } from '../config';

const BASE_HEADERS = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
};

export default class ApiGateway {
    user = {
        async login(username: string, password: string): Promise<any> {
            return fetch(`${END_POINTS.gateway}/login`, {
                method: 'POST',
                headers: { ...BASE_HEADERS },
                body: JSON.stringify({ username, password }),
            })
                .then(checkStatus)
                .then(parseJSON)
                .then(() => ({ response: { succeed: true } }))
                .catch(error => ({ error: error.msg }));
        },
    };

    targets = {
        async fetchAll(page: number = 0, page_count: number = 20): Promise<any> {
            return fetch(`${END_POINTS.gateway}/config_target`, {
                method: 'GET',
                headers: { ...BASE_HEADERS },
                body: JSON.stringify({ page, size: page_count }),
            })
                .then(checkStatus)
                .then(parseJSON)
                .then(({ }) => ({ response: { } }))
                .catch(error => ({ error: error.msg }));
        },

        async add(target: Target, config: ScanConfig): Promise<any> {
            return fetch(`${END_POINTS.gateway}/config_target`, {
                method: 'POST',
                headers: { ...BASE_HEADERS },
                body: JSON.stringify({ ...target, ...config }),
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
        const { status, msg } = (await parseJSON(response)) as ServerError;
        const error = {
            status,
            msg,
        };
        throw error;
    }
}

function parseJSON(response: Response) {
    return response.json();
}

export interface ServerError {
    status: string;
    msg: string;
}
