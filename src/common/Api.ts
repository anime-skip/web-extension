import Axios from 'axios';
import Utils from '@/common/utils/Utils';
import Browser from '@/common/utils/Browser';
import md5 from 'md5';

const axios = Axios.create({
  baseURL: 'http://localhost:8000/',
  // baseURL: 'http://api.anime-skip.com/',
});

axios.interceptors.request.use((config): any => {
  /* eslint-disable no-console */
  console.groupCollapsed(
    `%cAPI  %c/${config.url}`,
    'font-weight: 600; color: default;',
    'font-weight: 400; color: black;'
  );
  console.log(`URL: %c${config.baseURL}${config.url}`, 'color: #137AF8');
  const headers = {
    ...config.headers,
    ...config.headers.common,
    ...config.headers[config.method || 'get'],
  };
  delete headers.get;
  delete headers.post;
  delete headers.put;
  delete headers.delete;
  delete headers.patch;
  delete headers.head;
  console.log('Headers: ', headers);
  if (config.params) {
    console.log('Parameters: ', config.params);
  }
  if (config.data) {
    console.log(
      `GraphQL:\n%c${Utils.formatGraphql(config.data.query)}`,
      'color: #137AF8'
    );
    if (config.data.variables) {
      console.log('Variables: ', config.data.variables);
    }
  }
  /* eslint-enable no-console */
  return config;
});

function query(q: string): GraphQlBody {
  return { query: q };
}

function mutation(
  mutationString: string,
  vars: { [variableName: string]: any }
): GraphQlBody {
  return { query: mutationString, variables: vars };
}

const preferencesData = `
  enableAutoSkip enableAutoPlay
  skipBranding skipIntros skipNewIntros skipMixedIntros skipRecaps skipFiller skipCanon skipTransitions skipTitleCard skipCredits skipMixedCredits skipNewCredits skipPreview
`;

const loginData = `
  authToken refreshToken
  account {
    username emailVerified
    preferences {
      ${preferencesData}
    }
  }
`;

const episodeData = `
  id absoluteNumber number season name 
  timestamps {
    id time _typeId
  }
  show { id name originalName website image }
`;

export default class Api {
  private static async send<Q extends string, D>(
    data: any
  ): Promise<{ data: { [field in Q]: D } }> {
    try {
      const token = await Browser.storage.getItem<string>('token');
      const response = await axios.post('graphql', data, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      /* eslint-disable no-console */
      console.log();
      console.log('Response: ', response.data);
      console.groupEnd();
      /* eslint-enable no-console */

      return response.data;
    } catch (err) {
      /* eslint-disable no-console */
      console.log();
      console.error(err.message, {
        status: err.response.status,
        headers: err.response.headers,
        ...err.response.data,
      });
      console.groupEnd();
      /* eslint-enable no-console */
      throw err;
    }
  }

  public static async loginManual(
    username: string,
    password: string
  ): Promise<Api.LoginResponse> {
    const q = query(
      `{
        login(usernameEmail: "${username}", passwordHash: "${md5(password)}") {
          ${loginData}
        }
      }`
    );
    const response = await this.send<'login', Api.LoginResponse>(q);
    return response.data.login;
  }

  public static async loginRefresh(
    refreshToken: string
  ): Promise<Api.LoginResponse> {
    const q = query(
      `{
        loginRefresh(refreshToken: "${refreshToken}") {
          ${loginData}
        }
      }`
    );
    const response = await this.send<'login', Api.LoginResponse>(q);
    return response.data.login;
  }

  public static async updatePreferences(prefs: Api.Preferences): Promise<void> {
    const m = mutation(
      `mutation SavePreferences($prefs: InputPreferences!) {
        savePreferences(preferences: $prefs) {
          ${preferencesData}
        }
      }`,
      {
        prefs,
      }
    );
    await this.send(m);
  }

  public static async fetchEpisodeByUrl(url: string): Promise<Api.Episode> {
    const q = query(
      `{
        findEpisodeByUrl(url: "${url}") {
          ${episodeData}
        }
      }`
    );
    const response = await this.send<'episode', Api.Episode>(q);
    return response.data.episode;
  }
}
