import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, Linking, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { SectionHeader } from '../components/SectionHeader';
import { listeningPlatforms, podcastProfile } from '../data/podcast';
import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';

export function SubscribeScreen() {
  const [email, setEmail] = useState('');

  function submitEmail() {
    const trimmedEmail = email.trim();

    if (!trimmedEmail.includes('@')) {
      Alert.alert('Email needed', 'Enter a valid email address to subscribe.');
      return;
    }

    Alert.alert(
      'Subscription ready',
      `Thanks for subscribing with ${trimmedEmail}. Connect this form to your newsletter provider to capture signups.`
    );
    setEmail('');
  }

  return (
    <Screen>
      <View style={styles.hero}>
        <View style={styles.icon}>
          <Ionicons name="notifications" size={32} color={colors.background} />
        </View>
        <Text style={styles.title}>Subscribe for insightful content</Text>
        <Text style={styles.body}>
          Get practical Breakpoint updates, new episode alerts, and listening links
          directly from the mobile app.
        </Text>
      </View>

      <View style={styles.form}>
        <SectionHeader eyebrow="Newsletter" title="Stay connected" />
        <View style={styles.inputWrap}>
          <Ionicons name="mail-outline" size={18} color={colors.textSubtle} />
          <TextInput
            accessibilityLabel="Email address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            placeholder="Enter your email address"
            placeholderTextColor={colors.textSubtle}
            style={styles.input}
          />
        </View>
        <PrimaryButton label="Subscribe" icon="send" onPress={submitEmail} />
      </View>

      <View style={styles.platforms}>
        <SectionHeader eyebrow="Connect" title="More ways to listen" />
        {listeningPlatforms.map((platform) => (
          <Pressable
            key={platform.id}
            accessibilityRole="link"
            onPress={() => Linking.openURL(platform.url)}
            style={({ pressed }) => [styles.platform, pressed && styles.pressed]}
          >
            <View>
              <Text style={styles.platformTitle}>{platform.label}</Text>
              <Text style={styles.platformUrl} numberOfLines={1}>
                {platform.url.replace('mailto:', '').replace('tel:', '')}
              </Text>
            </View>
            <Ionicons name="open-outline" size={20} color={colors.accent} />
          </Pressable>
        ))}
      </View>

      <Text style={styles.footer}>{podcastProfile.copyright}</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.xl,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.xl
  },
  icon: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    height: 76,
    justifyContent: 'center',
    width: 76
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center'
  },
  body: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center'
  },
  form: {
    gap: spacing.md
  },
  inputWrap: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm
  },
  input: {
    color: colors.text,
    flex: 1,
    fontSize: 15,
    minHeight: 40
  },
  platforms: {
    gap: spacing.md
  },
  platform: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.lg
  },
  pressed: {
    opacity: 0.76,
    transform: [{ scale: 0.99 }]
  },
  platformTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800'
  },
  platformUrl: {
    color: colors.textSubtle,
    fontSize: 13,
    marginTop: spacing.xs,
    maxWidth: 260
  },
  footer: {
    color: colors.textSubtle,
    fontSize: 12,
    textAlign: 'center'
  }
});
