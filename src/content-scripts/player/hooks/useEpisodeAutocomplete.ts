import { Ref } from 'vue';
import * as Api from '~/common/api';
import { EPISODE_SEARCH_RESULT_DATA } from '~/common/api';
import { useApiClient } from '~/common/hooks/useApiClient';
import Mappers from '~/common/utils/Mappers';

export function useEpisodeAutocomplete(show: Ref<Api.Show | undefined>, api = useApiClient()) {
  const episodeItem = ref<AutocompleteItem<Api.EpisodeSearchResult>>({
    title: '',
  });
  const episode = computed(() => episodeItem.value.data);
  const isExistingEpisode = computed(() => episode.value != null);

  const episodeSearchResults = ref<Api.EpisodeSearchResult[]>([]);
  const episodeOptions = computed(() =>
    episodeSearchResults.value.map(Mappers.episodeSearchResultToAutocompleteItem)
  );

  const searchEpisodes = async (search: string): Promise<void> => {
    episodeSearchResults.value = await api.searchEpisodes(EPISODE_SEARCH_RESULT_DATA, {
      limit: 5,
      search,
      showId: show.value?.id,
    });
  };

  return {
    episodeItem,
    episode,
    isExistingEpisode,
    episodeSearchResults,
    episodeOptions,
    searchEpisodes,
  };
}