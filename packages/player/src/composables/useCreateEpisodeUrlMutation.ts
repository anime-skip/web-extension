import { QueryKey } from '../utils/QueryKey';

export default function () {
  const api = useApiClient(true);
  const client = useQueryClient();

  return useMutation(api.createEpisodeUrl, {
    onSuccess({ createEpisodeUrl: episodeUrl }, { episodeUrlInput }) {
      client.setQueryData(
        [QueryKey.FindEpisodeUrl, episodeUrlInput.url],
        episodeUrl,
      );
    },
  });
}
