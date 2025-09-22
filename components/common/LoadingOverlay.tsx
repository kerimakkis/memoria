import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useThemeContext } from '../theme/ThemeProvider';

export function LoadingOverlay() {
  const { theme } = useThemeContext();

  const overlayColor = theme.mode === 'dark' ? 'rgba(15, 23, 42, 0.72)' : 'rgba(245, 246, 250, 0.72)';

  return (
    <View style={[styles.container, { backgroundColor: overlayColor }]}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
