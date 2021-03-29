import setupGlobals from '../setupGlobals';
import './style.scss';

function getPlayerOptions(): PlayerOptionGroup[] {
  const optionGroups: PlayerOptionGroup[] = [];

  const qualityTitleNode = document.querySelector('.qualityMenuButton.baseSettingsMenuItem');
  if (qualityTitleNode != null) {
    const options = Array.from(
      document.querySelectorAll('.qualityMenuItemSelector.settingsMenuItemSelectionCircle')
    );
    if (options.length > 0) {
      optionGroups.push({
        title: 'Quality',
        icon: 'ic_player_option_quality.svg',
        options: options.map<PlayerOption>(option => ({
          isSelected: option.classList.contains('selected'),
          node: option as HTMLElement,
          title: option.textContent?.replace(/ {2}/g, ' ').trim() ?? 'Unknown',
        })),
      });
    }
  }

  const subtitlesTitleNode = document.querySelector('.subtitleMenuButton.baseSettingsMenuItem');
  if (subtitlesTitleNode != null) {
    const options = Array.from(
      document.querySelectorAll('.subtitlesMenuItemSelector.settingsMenuItemSelectionCircle')
    );
    if (options.length > 0) {
      optionGroups.push({
        title: 'Subtitles',
        icon: 'ic_player_option_subtitles.svg',
        options: options.map<PlayerOption>(option => ({
          isSelected: option.classList.contains('selected'),
          node: option as HTMLElement,
          title: option.textContent ?? 'Unknown',
        })),
      });
    }
  }

  return optionGroups;
}

setupGlobals('vrv', {
  serviceDisplayName: 'VRV',
  getPlayerOptions,
  getRootQuery() {
    return 'body>div';
  },
  getVideoQuery() {
    return 'video';
  },
});