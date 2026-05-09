import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChunkyButton } from '../components/ChunkyButton';
import { PopCard } from '../components/PopCard';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';

export function AuthScreen() {
  const insets = useSafeAreaInsets();
  const auth = useAuth();
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isSignUp = mode === 'signUp';

  async function submit() {
    if (!email.trim() || !password) {
      Alert.alert('Missing credentials', 'Enter your email and password to continue.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Password too short', 'Your password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    try {
      if (isSignUp) {
        const result = await auth.signUp(email, password, displayName);
        if (result.needsEmailConfirmation) {
          Alert.alert(
            'Check your email',
            'Your account was created. Confirm your email, then sign in.'
          );
          setMode('signIn');
        }
      } else {
        await auth.signIn(email, password);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Authentication failed.';
      Alert.alert(isSignUp ? 'Sign up failed' : 'Login failed', message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.screen, { paddingTop: insets.top + spacing.xl }]}
    >
      <View style={styles.hero}>
        <View style={styles.logo}>
          <Ionicons name="radio" size={24} color={colors.white} />
        </View>
        <Text style={styles.kicker}>Detective Console</Text>
        <Text style={styles.title}>BREAKPOINT</Text>
        <Text style={styles.body}>
          Sign in to unlock your Dossier Profile, sync progress, and continue your case files.
        </Text>
      </View>

      <PopCard backgroundColor={colors.white} style={styles.card}>
        <View style={styles.modeRow}>
          <Pressable
            onPress={() => setMode('signIn')}
            style={[styles.modeButton, !isSignUp && styles.modeButtonActive]}
          >
            <Text style={[styles.modeText, !isSignUp && styles.modeTextActive]}>Sign In</Text>
          </Pressable>
          <Pressable
            onPress={() => setMode('signUp')}
            style={[styles.modeButton, isSignUp && styles.modeButtonActive]}
          >
            <Text style={[styles.modeText, isSignUp && styles.modeTextActive]}>Sign Up</Text>
          </Pressable>
        </View>

        {isSignUp ? (
          <View style={styles.inputWrap}>
            <Ionicons name="person-outline" size={18} color={colors.purple} />
            <TextInput
              value={displayName}
              onChangeText={setDisplayName}
              autoCapitalize="words"
              placeholder="Agent display name"
              placeholderTextColor={colors.muted}
              style={styles.input}
            />
          </View>
        ) : null}

        <View style={styles.inputWrap}>
          <Ionicons name="mail-outline" size={18} color={colors.purple} />
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            placeholder="Email"
            placeholderTextColor={colors.muted}
            style={styles.input}
          />
        </View>

        <View style={styles.inputWrap}>
          <Ionicons name="lock-closed-outline" size={18} color={colors.purple} />
          <TextInput
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Password"
            placeholderTextColor={colors.muted}
            secureTextEntry
            style={styles.input}
          />
        </View>

        <ChunkyButton
          label={isSignUp ? 'Create Dossier' : 'Enter Console'}
          icon={isSignUp ? 'person-add' : 'log-in'}
          backgroundColor={isSignUp ? colors.orange : colors.blue}
          onPress={submit}
          disabled={submitting}
        />
        {submitting ? <ActivityIndicator color={colors.navy} /> : null}
      </PopCard>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.cream,
    flex: 1,
    gap: spacing.xl,
    justifyContent: 'center',
    padding: spacing.lg
  },
  hero: {
    alignItems: 'center',
    gap: spacing.sm
  },
  logo: {
    alignItems: 'center',
    backgroundColor: colors.orange,
    borderColor: colors.navy,
    borderRadius: radius.xl,
    borderWidth: 2,
    height: 64,
    justifyContent: 'center',
    width: 64
  },
  kicker: {
    color: colors.blue,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2.4,
    textTransform: 'uppercase'
  },
  title: {
    color: colors.navy,
    fontSize: 44,
    fontWeight: '900',
    lineHeight: 46
  },
  body: {
    color: colors.purple,
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 22,
    maxWidth: 340,
    textAlign: 'center'
  },
  card: {
    gap: spacing.md
  },
  modeRow: {
    backgroundColor: colors.cream,
    borderColor: colors.navy,
    borderRadius: radius.round,
    borderWidth: 2,
    flexDirection: 'row',
    padding: spacing.xs
  },
  modeButton: {
    alignItems: 'center',
    borderRadius: radius.round,
    flex: 1,
    paddingVertical: spacing.sm
  },
  modeButtonActive: {
    backgroundColor: colors.navy
  },
  modeText: {
    color: colors.navy,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  modeTextActive: {
    color: colors.white
  },
  inputWrap: {
    alignItems: 'center',
    backgroundColor: colors.cream,
    borderColor: colors.navy,
    borderRadius: radius.lg,
    borderWidth: 2,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md
  },
  input: {
    color: colors.navy,
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    minHeight: 48
  }
});
