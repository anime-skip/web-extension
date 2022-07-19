import { initStoreReviewPrompt } from '~/stores/store-review-prompt';
import { error, loadedLog } from '~/utils/log';
import { initContextMenu } from './context-menu';
import { initMessenger } from './messenger';
import { initMetrics } from './metrics';
import { initPageAction } from './page-action';
import { initTabChange } from './tab-change';

function init() {
  initMessenger();
  initMetrics();
  initContextMenu();
  initTabChange();
  initPageAction();

  initStoreReviewPrompt();
}

try {
  loadedLog('background/index.ts');
  init();
} catch (err) {
  error(err);
}
