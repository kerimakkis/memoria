import { GameDefinition } from '../types';

export const GAMES: GameDefinition[] = [
  {
    slug: 'memory-match',
    titleKey: 'games.memoryMatch.title',
    summaryKey: 'games.memoryMatch.summary',
    goalKey: 'games.memoryMatch.goal',
    hintKey: 'games.memoryMatch.hint',
    category: 'memory',
    difficulty: 'easy',
    icon: '🧠'
  },
  {
    slug: 'sequence-remember',
    titleKey: 'games.sequenceRemember.title',
    summaryKey: 'games.sequenceRemember.summary',
    goalKey: 'games.sequenceRemember.goal',
    hintKey: 'games.sequenceRemember.hint',
    category: 'memory',
    difficulty: 'medium',
    icon: '🎯'
  },
  {
    slug: 'pattern-vision',
    titleKey: 'games.patternVision.title',
    summaryKey: 'games.patternVision.summary',
    goalKey: 'games.patternVision.goal',
    hintKey: 'games.patternVision.hint',
    category: 'logic',
    difficulty: 'medium',
    icon: '🧩'
  },
  {
    slug: 'quick-count',
    titleKey: 'games.quickCount.title',
    summaryKey: 'games.quickCount.summary',
    goalKey: 'games.quickCount.goal',
    hintKey: 'games.quickCount.hint',
    category: 'attention',
    difficulty: 'hard',
    icon: '🔢'
  },
  {
    slug: 'focus-tap',
    titleKey: 'games.focusTap.title',
    summaryKey: 'games.focusTap.summary',
    goalKey: 'games.focusTap.goal',
    hintKey: 'games.focusTap.hint',
    category: 'attention',
    difficulty: 'medium',
    icon: '👆'
  },
  {
    slug: 'emotion-match',
    titleKey: 'games.emotionMatch.title',
    summaryKey: 'games.emotionMatch.summary',
    goalKey: 'games.emotionMatch.goal',
    hintKey: 'games.emotionMatch.hint',
    category: 'memory',
    difficulty: 'easy',
    icon: '😊'
  },
  {
    slug: 'rhythm-tap',
    titleKey: 'games.rhythmTap.title',
    summaryKey: 'games.rhythmTap.summary',
    goalKey: 'games.rhythmTap.goal',
    hintKey: 'games.rhythmTap.hint',
    category: 'attention',
    difficulty: 'medium',
    icon: '🥁'
  },
  {
    slug: 'math-bridge',
    titleKey: 'games.mathBridge.title',
    summaryKey: 'games.mathBridge.summary',
    goalKey: 'games.mathBridge.goal',
    hintKey: 'games.mathBridge.hint',
    category: 'logic',
    difficulty: 'easy',
    icon: '➕'
  },
  {
    slug: 'find-the-difference',
    titleKey: 'games.findTheDifference.title',
    summaryKey: 'games.findTheDifference.summary',
    goalKey: 'games.findTheDifference.goal',
    hintKey: 'games.findTheDifference.hint',
    category: 'attention',
    difficulty: 'medium',
    icon: '🔍'
  }
];

export const getGameBySlug = (slug: string) => GAMES.find(game => game.slug === slug);
