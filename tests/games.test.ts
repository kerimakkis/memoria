import { GAMES, getGameBySlug } from '../constants/games';

describe('GAMES sabiti', () => {
  it('dokuz oyun içerir', () => {
    expect(GAMES).toHaveLength(9);
  });

  it('slug üzerinden oyuna erişilmesini sağlar', () => {
    const game = getGameBySlug('memory-match');
    expect(game?.titleKey).toBeDefined();
  });
});
