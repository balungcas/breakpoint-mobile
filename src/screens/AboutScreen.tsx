import { Ionicons } from '@expo/vector-icons';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { InfoCard } from '../components/InfoCard';
import { Screen } from '../components/Screen';
import { SectionHeader } from '../components/SectionHeader';
import { podcastProfile } from '../data/podcast';
import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';

const contactActions = [
  {
    id: 'email',
    label: podcastProfile.email,
    icon: 'mail-outline' as const,
    url: `mailto:${podcastProfile.email}`
  },
  {
    id: 'phone',
    label: podcastProfile.displayPhone,
    icon: 'call-outline' as const,
    url: `tel:${podcastProfile.phone}`
  },
  {
    id: 'website',
    label: 'bp-pod.com',
    icon: 'globe-outline' as const,
    url: podcastProfile.website
  }
];

export function AboutScreen() {
  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.kicker}>About the show</Text>
        <Text style={styles.title}>{podcastProfile.name}</Text>
        <Text style={styles.body}>{podcastProfile.description}</Text>
      </View>

      <View style={styles.section}>
        <SectionHeader eyebrow="Mobile first" title="What this app includes" />
        <InfoCard
          icon="albums-outline"
          title="Episode discovery"
          body="Browse featured conversations, search the catalog, and filter by practical life categories."
        />
        <InfoCard
          icon="share-social-outline"
          title="Easy sharing"
          body="Share episodes, copy links, and contact the Breakpoint team from native mobile controls."
        />
        <InfoCard
          icon="phone-portrait-outline"
          title="Ready to extend"
          body="Centralized data makes it straightforward to swap in an RSS feed, CMS API, or original repository content."
        />
      </View>

      <View style={styles.section}>
        <SectionHeader eyebrow="Connect" title="Contact Breakpoint" />
        {contactActions.map((action) => (
          <Pressable
            key={action.id}
            accessibilityRole="link"
            onPress={() => Linking.openURL(action.url)}
            style={({ pressed }) => [styles.contact, pressed && styles.pressed]}
          >
            <View style={styles.contactIcon}>
              <Ionicons name={action.icon} size={20} color={colors.primary} />
            </View>
            <Text style={styles.contactText}>{action.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textSubtle} />
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.xl,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.xl
  },
  kicker: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase'
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '900'
  },
  body: {
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 24
  },
  section: {
    gap: spacing.md
  },
  contact: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg
  },
  contactIcon: {
    alignItems: 'center',
    backgroundColor: colors.cardMuted,
    borderRadius: radius.md,
    height: 42,
    justifyContent: 'center',
    width: 42
  },
  contactText: {
    color: colors.text,
    flex: 1,
    fontSize: 15,
    fontWeight: '800'
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }]
  }
});
