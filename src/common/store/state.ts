import RequestState from '../utils/RequestState';

export const initialState: VuexState = {
  activeDialog: undefined,
  token: undefined,
  tokenExpiresAt: undefined,
  refreshToken: undefined,
  refreshTokenExpiresAt: undefined,
  loginRequestState: RequestState.NOT_REQUESTED,
  account: undefined,
  episode: undefined,
  preferencesRequestState: RequestState.NOT_REQUESTED,
};