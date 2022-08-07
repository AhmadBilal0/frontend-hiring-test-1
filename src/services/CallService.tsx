import baseApi from './api';
import AuthService from './AuthService';

class CallService {
    public api = baseApi();
    constructor() {
    }

    async getCalls(offSet: any, limit: any) {
        const request = new AuthService();
        request.refresh().then((success) => {
            localStorage.setItem("TOKEN", success.access_token);
        },
            (error) => {
                console.log(error);
            }

        )
        let result = await this.api.get(`https://frontend-test-api.aircall.io/calls`, { params: { offset: offSet, limit: limit } });

        return result.data;
    }

    async updateCalls(id: string,) {
        const request = new AuthService();
        request.refresh().then((success) => {
            localStorage.setItem("TOKEN", success.access_token);
        },
            (error) => {
                console.log(error);
            }

        )
        let result = await this.api.put(`https://frontend-test-api.aircall.io/calls/${id}/archive`);


        return result.data;
    }
}

export default CallService;