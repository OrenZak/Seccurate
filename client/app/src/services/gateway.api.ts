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
                .then(result => {
                    return ({ response: { result } })
                })
                .catch(error => ({ error }));
        },
        async logout(): Promise<ApiResult<{ result: string }>> {
            return fetch(`${END_POINTS.gatewayURL}/logout`, {
                method: 'POST',
                headers: { ...BASE_HEADERS },
                credentials: 'same-origin',
            })
                .then(checkStatus)
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
                .then(results => {
                    return { response: { targets: [...results._configEntityArray] } };
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
                .then(() => ({ response: { succeed: true } }))
                .catch(error => ({ error: error.msg }));
        },
    };

    users = {
        async fetchAll(): Promise<ApiResult<FetchAllUsersResponse>> {
            return fetch(`${END_POINTS.gatewayURL}/users`, {
                method: 'GET',
                headers: { ...BASE_HEADERS },
                credentials: 'same-origin',
            })
                .then(checkStatus)
                .then(response => {
                    return { response: { usersArray: [...response] } };
                })
                .catch(error => {
                    return { error: error.msg };
                });
        },

        async createUser(payload: CreateUserParams): Promise<ApiResult<{ msg: string }>> {
            return fetch(`${END_POINTS.gatewayURL}/manage_users`, {
                method: 'POST',
                headers: { ...BASE_HEADERS },
                credentials: 'same-origin',
                body: JSON.stringify({ ...payload.user }),
            })
                .then(checkStatus)

                .then(() => {
                    return { response: { msg: 'registered' } };
                })
                .catch(error => ({ error: error.msg }));
        },

        async updateUser(payload: UpdateUserParams): Promise<ApiResult<{ msg: string }>> {
            return fetch(`${END_POINTS.gatewayURL}/manage_users`, {
                method: 'PUT',
                headers: { ...BASE_HEADERS },
                credentials: 'same-origin',
                body: JSON.stringify({ ...payload.user, password: '123456' }),
            })
                .then(checkStatus)
                .then(() => {
                    console.log('Updated');
                    return { response: { msg: 'updated' } };
                })
                .catch(error => {
                    console.log('error: ', error);
                    return { error: error.msg };
                });
        },

        async deleteUser(payload: DeleteUserParams): Promise<ApiResult<{ msg: string }>> {
            return fetch(`${END_POINTS.gatewayURL}/manage_users`, {
                method: 'DELETE',
                headers: { ...BASE_HEADERS },
                credentials: 'same-origin',
                body: JSON.stringify({ ...payload }),
            })
                .then(checkStatus)
                .then(() => {
                    return { response: { msg: 'deleted' } };
                })
                .catch(error => ({ error: error.msg }));
        },
    };

    savedConfig = {
        async fetchAll(page: number = 0, pageCount: number = 20): Promise<ApiResult<FetchAllConfigsResponse>> {
            return fetch(`${END_POINTS.gatewayURL}/saved_config?page=${page}&size=${pageCount}`, {
                method: 'GET',
                headers: { ...BASE_HEADERS },
                credentials: 'same-origin',
            })
                .then(checkStatus)
                .then(response => {
                    return { response: { configs: [...response._configEntityArray] } };
                })
                .catch(error => ({ error: error.msg }));
        },

        async add(scanConfig: ScanConfig): Promise<ApiResult<{ scanConfigID: string }>> {
            return fetch(`${END_POINTS.gatewayURL}/saved_config`, {
                method: 'POST',
                headers: { ...BASE_HEADERS },
                body: JSON.stringify({ ...scanConfig }),
            })
                .then(checkStatus)
                .then(configID => ({ response: { scanConfigID: configID } }))
                .catch(error => ({ error: error.msg }));
        },

        async update(scanConfig: ScanConfig): Promise<ApiResult<{ msg: string }>> {
            return fetch(`${END_POINTS.gatewayURL}/saved_config`, {
                method: 'PUT',
                headers: { ...BASE_HEADERS },
                body: JSON.stringify({ ...scanConfig }),
            })
                .then(checkStatus)
                .then(() => ({ response: { msg: 'updated' } }))
                .catch(error => ({ error: error.msg }));
        },

        async delete(id: string): Promise<ApiResult<{ msg: string }>> {
            return fetch(`${END_POINTS.gatewayURL}/saved_config`, {
                method: 'DELETE',
                headers: { ...BASE_HEADERS },
                body: JSON.stringify({ id }),
            })
                .then(checkStatus)
                .then(() => ({ response: { msg: 'deleted' } }))
                .catch(error => ({ error: error.msg }));
        },
    };

    scans = {
        async fetchAllCompleted(
            page: number = 0,
            pageCount: number = 20,
        ): Promise<ApiResult<FetchAllCompletedScansResponse>> {
            return fetch(`${END_POINTS.gatewayURL}/completed_scans?page=${page}&size=${pageCount}`, {
                method: 'GET',
                headers: { ...BASE_HEADERS },
                credentials: 'same-origin',
            })
                .then(checkStatus)
                .then(response => {
                    return { response: { scans: [...response.scanEntityArray] } };
                })
                .catch(error => {
                    return { error: error.msg };
                });
        },

        async start(scanId: string): Promise<ApiResult<{ msg: string }>> {
            return fetch(`${END_POINTS.gatewayURL}/start_scan`, {
                method: 'POST',
                headers: { ...BASE_HEADERS },
                credentials: 'same-origin',
                body: JSON.stringify({ id: scanId }),
            })
                .then(checkStatus)
                .then(() => {
                    return { response: { msg: 'started' } };
                })
                .catch(error => ({ error: error.msg }));
        },

        async getResults(scanId: string): Promise<ApiResult<{ results: Result[] }>> {
            return fetch(`${END_POINTS.gatewayURL}/results?scanName=${scanId}`, {
                method: 'GET',
                headers: { ...BASE_HEADERS },
                credentials: 'same-origin',
            })
                .then(checkStatus)
                .then(results => {
                    return { response: { results } };
                })
                .catch(error => {
                    return { error: error.msg };
                });
        },
    };
}

async function checkStatus(response: Response) {
    if (response.status >= 200 && response.status < 300) {
        const result = await response.json();
        return result;
    } else {
        const { error } = (await response.json()) as ServerError;
        throw error;
    }
}

export interface ServerError {
    error: string;
}
