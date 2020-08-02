declare interface VuexState {
  activeDialog?: string;
  playbackRate: number;
  isEditing: boolean;
  selectedTimestamp?: Api.AmbigousTimestamp;
  tabUrl: string;

  token?: string;
  tokenExpiresAt?: number;
  refreshToken?: string;
  refreshTokenExpiresAt?: number;
  loginRequestState: RequestState;

  account?: Api.Account;
  preferencesRequestState?: RequestState;
  preferencesLastUpdatedAt: number;

  searchShowsResult: Api.ShowSearchResult[];
  searchShowsRequestState: RequestState;

  searchEpisodesResult: Api.EpisodeSearchResult[];
  searchEpisodesRequestState: RequestState;
  episodeUrl?: Api.EpisodeUrl;
  episodeRequestState: RequestState;

  editTimestampMode?: 'add' | 'edit';
  activeTimestamp?: Api.AmbigousTimestamp;
  draftTimestamps: Api.AmbigousTimestamp[];
}
