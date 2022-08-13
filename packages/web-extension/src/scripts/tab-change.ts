import Browser from 'webextension-polyfill';
import { loadedLog, warn } from '~/utils/log';
import Messenger from '~/utils/Messenger';

export function initTabChange() {
  loadedLog('background/tab-change.ts');

  const messenger = new Messenger('background-tabs');

  Browser.tabs.onUpdated.addListener(function (tabId, { url }, _tabInfo) {
    if (url == null) return;

    messenger.send('@anime-skip/changeUrl', url, tabId).catch(err => {
      warn('Tab url change update failed', err);
    });
  });
}
