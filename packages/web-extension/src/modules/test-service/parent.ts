import { loadedLog } from '~/utils/log';
import setupParent from '~/utils/setupParent';

export function initTestServiceParent() {
  loadedLog('content-scripts/services/test-service/parent.ts');

  setupParent({
    getEpisodeInfo() {
      return {
        name: (document.getElementById('episode') as HTMLSpanElement | undefined)?.innerText,
        number: (document.getElementById('number') as HTMLSpanElement | undefined)?.innerText,
        absoluteNumber: (document.getElementById('absolute-number') as HTMLSpanElement | undefined)
          ?.innerText,
        season: (document.getElementById('season') as HTMLSpanElement | undefined)?.innerText,
        show: (document.getElementById('show') as HTMLSpanElement | undefined)?.innerText,
      };
    },
  });
}
