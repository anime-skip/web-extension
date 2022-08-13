import { onUnmounted } from 'vue';
import { usePlayerConfig } from '~/composables/usePlayerConfig';
import {
  KeyboardShortcutActionToExecuteMap,
  usePrimaryKeyboardShortcutPrefs,
  useSecondaryKeyboardShortcutPrefs,
} from '~/stores/useKeyboardShortcutPrefs';
import { debug } from '~/utils/log';
import UsageStats from '~/utils/UsageStats';
import GeneralUtils from '~utils/GeneralUtils';

// The first instance of this helper should only report usage stats
let instanceCount = 0;

export function useKeyboardShortcuts(
  componentName: string,
  shortcuts: KeyboardShortcutActionToExecuteMap
) {
  const isFirst = instanceCount == 0;
  instanceCount++;
  debug(`[${componentName}] useKeyboardShortcuts()`);

  const { addKeyDownListener, removeKeyDownListener } = usePlayerConfig();
  const { primaryShortcutsKeyToActionsMap } = usePrimaryKeyboardShortcutPrefs();
  const { secondaryShortcutsKeyToActionsMap } = useSecondaryKeyboardShortcutPrefs();

  const onKeyDownInstance = (event: KeyboardEvent) => {
    // Prevent triggers from firing while typing
    if (document.activeElement?.tagName === 'INPUT' || !GeneralUtils.isKeyComboAllowed(event)) {
      return;
    }

    const keyCombo = GeneralUtils.keyComboFromEvent(event);
    const keyActions = [
      ...(primaryShortcutsKeyToActionsMap.value[keyCombo] ?? []),
      ...(secondaryShortcutsKeyToActionsMap.value[keyCombo] ?? []),
    ];

    debug(`[${componentName}] Pressed ${keyCombo} -> [${keyActions.join(', ')}]`);
    setTimeout(() => {
      keyActions.forEach(action => {
        if (isFirst)
          void UsageStats.saveEvent('used_keyboard_shortcut', { keyCombo, operation: action });
        shortcuts[action]?.();
      });
    }, 0);
  };

  addKeyDownListener?.(onKeyDownInstance);
  onUnmounted(() => removeKeyDownListener?.(onKeyDownInstance));

  return shortcuts;
}