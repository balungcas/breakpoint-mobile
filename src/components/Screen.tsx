import { PropsWithChildren } from 'react';
import {
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  View,
  ViewStyle
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type ScreenProps = PropsWithChildren<
  ScrollViewProps & {
    scroll?: boolean;
    contentStyle?: ViewStyle;
  }
>;

export function Screen({
  children,
  scroll = true,
  contentStyle,
  ...scrollProps
}: ScreenProps) {
  const insets = useSafeAreaInsets();

  if (!scroll) {
    return (
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top + spacing.md,
            paddingBottom: insets.bottom + spacing.md
          },
          contentStyle
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + spacing.md,
          paddingBottom: insets.bottom + spacing.xxxl
        },
        contentStyle
      ]}
      showsVerticalScrollIndicator={false}
      {...scrollProps}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.cream
  },
  content: {
    paddingHorizontal: spacing.lg,
    gap: spacing.xl
  },
  container: {
    flex: 1,
    backgroundColor: colors.cream,
    paddingHorizontal: spacing.lg
  }
});
