import Axios, { AxiosResponse } from 'axios';

const axios = Axios.create({
    // baseURL: 'http://localhost:8000/',
    baseURL: 'http://api.anime-skip.com/',
});

function query(q: string) {
    console.log('Query:\n', q);
    return { query: q };
}

function mutation(m: string, vars: { [variableName: string]: any }) {
    console.log('Mutation:\n', m);
    return { query: m, variables: vars };
}

const preferencesData = `
    enableAutoSkip enableAutoPlay skipBranding skipIntros skipNewIntros skipRecaps skipFiller
    skipCanon skipTransitions skipTitleCard skipCredits skipMixedCredits skipPreview`;

const loginData =
    `token refreshToken
    myUser {
        username verified
        preferences {
            ${preferencesData}
        }
    }`;

type LoginResponse = AxiosResponse<{
    data: {
        login: Api.LoginResponse;
    };
}>;

export default class Api {

    public static async loginManual(username: string, password: string): Promise<Api.LoginResponse> {
        const response: LoginResponse = await axios.post(
            'graphql',
            query(`{
                login(usernameOrEmail: "${username}", password: "${password}") {
                    ${loginData}
                }
            }`),
        );
        return response.data.data.login;
    }

    public static async loginRefresh(refreshToken: string): Promise<Api.LoginResponse> {
        const response: LoginResponse = await axios.post(
            'graphql',
            query(`{
                login(refreshToken: "${refreshToken}") {
                    ${loginData}
                }
            }`),
        );
        return response.data.data.login;
    }

    public static async mutatePrefs(pref: keyof Api.Preferences, value: boolean, token: string): Promise<void> {
        const headers: any = {
            Authorization: `Bearer ${token}`,
        };
        return axios.post(
            'graphql',
            mutation(
                `mutation UpdatePreferenes($prefs: PreferencesInput) {
                    preferences(preferences: $prefs) {
                        ${preferencesData}
                    }
                }`,
                {
                    prefs: { [pref]: value },
                },
            ),
            { headers },
        );
    }

}
