/**
 * The current "view" show in the player.
 */
export type View = 'timestamps' | 'settings' | 'account';

/**
 * Returns a global reference to which "view" is active. A "view" is the current dialog or panel
 * visible. Only one "view" can be open at a time.
 *
 * To change views, set the value to `undefined`.
 */
export default createGlobalState(() => ref<View>());