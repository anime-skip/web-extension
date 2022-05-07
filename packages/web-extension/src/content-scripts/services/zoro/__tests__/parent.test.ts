import { getEpisodeInfo } from '../parent';
import { InferredEpisodeInfo } from '~types';
import { createDomFromFile } from '~/common/utils/testing/jsdom';

describe('Zoro.to Parent Content Script', () => {
  describe('getEpisodeInfo', () => {
    it('should find the correct episode details for a show', async () => {
      const dom = await createDomFromFile(__dirname, 'parent-show-2022-05-06.gen.html');
      const expected: InferredEpisodeInfo = {
        name: 'Operationã€ˆStrixã€‰',
        show: 'Spy x Family',
        number: '1',
      };

      const actual = getEpisodeInfo(dom);

      expect(actual).toEqual(expected);
    });

    it('should find the correct episode details for a movie', async () => {
      const dom = await createDomFromFile(__dirname, 'parent-movie-2022-05-06.gen.html');
      const expected: InferredEpisodeInfo = {
        name: 'A Silent Voice',
        show: 'A Silent Voice',
      };

      const actual = getEpisodeInfo(dom);

      expect(actual).toEqual(expected);
    });
  });
});
