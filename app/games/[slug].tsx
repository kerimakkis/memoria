import { Redirect, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useThemeContext } from '../../components/theme/ThemeProvider';
import { getGameBySlug } from '../../constants/games';
import { useGameSession } from '../../hooks/useGameSession';
import { saveGameSession } from '../../services/gameSessionService';

interface Challenge {
  prompt: string;
  options: string[];
  correctOption: string;
  explanation?: string;
}

type ChallengeGenerator = () => Challenge;

type ChallengeFactoryMap = Record<string, ChallengeGenerator>;

const shuffle = <T,>(values: T[]): T[] => [...values].sort(() => Math.random() - 0.5);

const numberOptions = (answer: number) => {
  const options = new Set([answer]);
  while (options.size < 4) {
    const candidate = answer + Math.floor(Math.random() * 5) - 2;
    options.add(Math.max(1, candidate));
  }
  return shuffle(Array.from(options)).map(option => option.toString());
};

const uniqueOptions = (options: string[], desired = 4) => {
  const unique = Array.from(new Set(options));
  while (unique.length < desired) {
    unique.push((Math.floor(Math.random() * 9) + 1).toString());
  }
  return shuffle(unique);
};

const createChallengeFactories = (t: TFunction): ChallengeFactoryMap => ({
  'memory-match': () => {
    const icons = ['🍎', '🍌', '🍇', '🍉'];
    const pair = icons[Math.floor(Math.random() * icons.length)];
    const options = uniqueOptions([
      `${pair} ${pair}`,
      `${pair} 🍊`,
      `${pair} 🍍`,
      '🍒 🍓'
    ]);

    return {
      prompt: t('games.memoryMatch.prompt', { pair }),
      options,
      correctOption: `${pair} ${pair}`,
      explanation: t('games.memoryMatch.explanation')
    };
  },
  'sequence-remember': () => {
    const length = 4;
    const sequence = Array.from({ length }, () => Math.floor(Math.random() * 9) + 1);
    const correct = sequence.join('-');

    const variations = new Set<string>([correct]);
    while (variations.size < 4) {
      const clone = [...sequence];
      const first = Math.floor(Math.random() * clone.length);
      let second = Math.floor(Math.random() * clone.length);
      if (first === second) {
        second = (second + 1) % clone.length;
      }
      [clone[first], clone[second]] = [clone[second], clone[first]];
      variations.add(clone.join('-'));
    }

    return {
      prompt: t('games.sequenceRemember.prompt', { sequence: sequence.join(' ') }),
      options: shuffle(Array.from(variations)),
      correctOption: correct,
      explanation: t('games.sequenceRemember.explanation')
    };
  },
  'pattern-vision': () => {
    const start = Math.floor(Math.random() * 5) + 1;
    const step = Math.floor(Math.random() * 3) + 2;
    const sequence = [start, start + step, start + 2 * step, start + 3 * step];
    const answer = start + 4 * step;
    return {
      prompt: t('games.patternVision.prompt', { sequence: sequence.join(', ') }),
      options: numberOptions(answer),
      correctOption: answer.toString(),
      explanation: t('games.patternVision.explanation')
    };
  },
  'quick-count': () => {
    const count = Math.floor(Math.random() * 7) + 4;
    const symbols = '🔵 '.repeat(count);
    return {
      prompt: t('games.quickCount.prompt', { symbols }),
      options: numberOptions(count),
      correctOption: count.toString(),
      explanation: t('games.quickCount.explanation')
    };
  },
  'focus-tap': () => {
    const target = Math.floor(Math.random() * 9) + 1;
    return {
      prompt: t('games.focusTap.prompt', { number: target }),
      options: numberOptions(target),
      correctOption: target.toString(),
      explanation: t('games.focusTap.explanation')
    };
  },
  'emotion-match': () => {
    const labels = {
      happy: t('games.emotionMatch.emotions.happy'),
      sad: t('games.emotionMatch.emotions.sad'),
      angry: t('games.emotionMatch.emotions.angry'),
      surprised: t('games.emotionMatch.emotions.surprised')
    };
    const data = [
      { emoji: '😊', label: labels.happy },
      { emoji: '😢', label: labels.sad },
      { emoji: '😠', label: labels.angry },
      { emoji: '😲', label: labels.surprised }
    ];
    const selected = data[Math.floor(Math.random() * data.length)];
    return {
      prompt: t('games.emotionMatch.prompt', { emoji: selected.emoji }),
      options: shuffle(data.map(item => item.label)),
      correctOption: selected.label,
      explanation: t('games.emotionMatch.explanation')
    };
  },
  'rhythm-tap': () => {
    const base = ['TA', 'TA', 'ta', 'TA'];
    const shift = Math.floor(Math.random() * base.length);
    const pattern = [...base.slice(shift), ...base.slice(0, shift)];
    const correct = pattern.join(' > ');
    const options = uniqueOptions([
      correct,
      [...pattern].reverse().join(' > '),
      [...pattern.slice(1), pattern[0]].join(' > '),
      ['TA', 'ta', 'TA', 'TA'].join(' > ')
    ]);

    return {
      prompt: t('games.rhythmTap.prompt', { pattern: pattern.join(' - ') }),
      options,
      correctOption: correct,
      explanation: t('games.rhythmTap.explanation')
    };
  },
  'math-bridge': () => {
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    const answer = a + b;
    return {
      prompt: t('games.mathBridge.prompt', { a, b }),
      options: numberOptions(answer),
      correctOption: answer.toString(),
      explanation: t('games.mathBridge.explanation')
    };
  },
  'find-the-difference': () => {
    const base = ['🌳', '🌼', '🌳', '🌼'];
    const variant = [...base];
    const index = Math.floor(Math.random() * variant.length);
    variant[index] = '🌸';
    return {
      prompt: t('games.findTheDifference.prompt', { sequence: variant.join(' ') }),
      options: shuffle(['🌸', '🌳', '🌼', '🌲']),
      correctOption: '🌸',
      explanation: t('games.findTheDifference.explanation')
    };
  }
});

export default function GameScreen() {
  const params = useLocalSearchParams<{ slug: string }>();
  const slug = params.slug;
  const { theme } = useThemeContext();
  const { user, loading } = useAuth();
  const session = useGameSession(60);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [sessionSaved, setSessionSaved] = useState(false);
  const { t } = useTranslation();
  const factories = useMemo(() => createChallengeFactories(t), [t]);
  const game = slug ? getGameBySlug(slug) : undefined;

  const { mutateAsync: persistSession, isPending } = useMutation({
    mutationFn: saveGameSession
  });

  useEffect(() => {
    if (!slug) {
      return;
    }
    const generator = factories[slug];
    if (!generator) {
      return;
    }
    setChallenge(generator());
    session.start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, factories]);

  useEffect(() => {
    if (session.status !== 'finished' || !user || sessionSaved) {
      return;
    }

    const accuracy = attempts === 0 ? 0 : correctAnswers / attempts;

    persistSession({
      gameSlug: slug!,
      score: session.score,
      durationSeconds: session.elapsed,
      accuracy,
      metadata: {
        attempts,
        correctAnswers
      }
    })
      .then(() => setSessionSaved(true))
      .catch(error => {
        const message = error instanceof Error ? error.message : t('auth.genericError');
        Alert.alert(t('games.messages.saveError'), message);
      });
  }, [attempts, correctAnswers, persistSession, session, sessionSaved, slug, t, user]);

  const accuracyText = attempts === 0
    ? t('messages.noAttempts')
    : t('games.status.accuracy', { percentage: Math.round((correctAnswers / attempts) * 100) });

  if (!loading && !user) {
    return <Redirect href="/auth/login" />;
  }

  if (!game || !challenge) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.text }}>{t('games.messages.notFound')}</Text>
      </View>
    );
  }

  const handleOptionPress = (option: string) => {
    if (session.status !== 'running') {
      return;
    }

    setAttempts(prev => prev + 1);

    if (option === challenge.correctOption) {
      setCorrectAnswers(prev => prev + 1);
      session.increment(100);
      setFeedback(t('games.feedback.correct'));
    } else {
      setFeedback(challenge.explanation ?? t('games.feedback.incorrect'));
    }

    const generator = factories[slug!];
    setChallenge(generator());
  };

  const handleRestart = () => {
    const generator = factories[slug!];
    setChallenge(generator());
    setAttempts(0);
    setCorrectAnswers(0);
    setFeedback(null);
    setSessionSaved(false);
    session.reset();
    session.start();
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{t(game.titleKey)}</Text>
        <Text style={[styles.subtitle, { color: theme.colors.muted }]}>{t(game.goalKey)}</Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.prompt, { color: theme.colors.text }]}>{challenge.prompt}</Text>
        <View style={styles.options}>
          {challenge.options.map((option, index) => (
            <Pressable
              key={`option-${index}`}
              onPress={() => handleOptionPress(option)}
              style={({ pressed }) => [
                styles.option,
                {
                  backgroundColor: pressed ? theme.colors.secondary : theme.colors.surface,
                  borderColor: theme.colors.primary
                }
              ]}
            >
              <Text style={[styles.optionText, { color: theme.colors.text }]}>{option}</Text>
            </Pressable>
          ))}
        </View>
        {feedback ? (
          <Text style={[styles.feedback, { color: theme.colors.primary }]}>{feedback}</Text>
        ) : null}
        <Text style={[styles.hint, { color: theme.colors.muted }]}>{t(game.hintKey)}</Text>
      </View>

      <View style={[styles.statusCard, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.statusText, { color: theme.colors.text }]}>{t('games.status.score', { score: session.score })}</Text>
        <Text style={[styles.statusText, { color: theme.colors.text }]}>{t('games.status.remaining', { seconds: session.remaining })}</Text>
        <Text style={[styles.statusText, { color: theme.colors.text }]}>{accuracyText}</Text>
      </View>

      {(session.status === 'finished' || session.remaining === 0) && (
        <Pressable
          style={[styles.restartButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleRestart}
        >
          <Text style={styles.restartText}>{t('buttons.playAgain')}</Text>
        </Pressable>
      )}

      {isPending && (
        <Text style={[styles.savingText, { color: theme.colors.muted }]}>{t('games.messages.saving')}</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    padding: 20,
    gap: 20
  },
  header: {
    gap: 8
  },
  title: {
    fontSize: 26,
    fontWeight: '800'
  },
  subtitle: {
    fontSize: 14
  },
  card: {
    borderRadius: 16,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  prompt: {
    fontSize: 18,
    fontWeight: '600'
  },
  options: {
    gap: 12
  },
  option: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center'
  },
  feedback: {
    fontSize: 16,
    fontWeight: '600'
  },
  hint: {
    fontSize: 12
  },
  statusCard: {
    borderRadius: 16,
    padding: 16,
    gap: 8
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600'
  },
  restartButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center'
  },
  restartText: {
    color: '#fff',
    fontWeight: '700'
  },
  savingText: {
    textAlign: 'center'
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
