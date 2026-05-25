import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors, Spacing, Radius, FontSize, Shadow } from '@/utils/theme';

interface Props {
  onLogin: () => void;
}

export default function AuthScreen({ onLogin }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    password: '',
    confirmPassword: '',
  });
  const [showPwd, setShowPwd] = useState(false);

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Green header */}
        <View style={styles.headerBg}>
          <View style={styles.logo}>
            <Text style={styles.logoIcon}>🏦</Text>
            <Text style={styles.logoText}>PocketFlow</Text>
          </View>
          <Text style={styles.headerTitle}>{mode === 'login' ? 'Welcome' : 'Create Account'}</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          {mode === 'register' && (
            <View style={styles.field}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="example@example.com"
                placeholderTextColor={Colors.textMuted}
                value={form.fullName}
                onChangeText={v => update('fullName', v)}
              />
            </View>
          )}

          <View style={styles.field}>
            <Text style={styles.label}>{mode === 'login' ? 'Username Or Email' : 'Email'}</Text>
            <TextInput
              style={styles.input}
              placeholder="example@example.com"
              placeholderTextColor={Colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={v => update('email', v)}
            />
          </View>

          {mode === 'register' && (
            <>
              <View style={styles.field}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+123 456 789"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="phone-pad"
                  value={form.phone}
                  onChangeText={v => update('phone', v)}
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Date Of Birth</Text>
                <TextInput
                  style={styles.input}
                  placeholder="DD / MM / YYY"
                  placeholderTextColor={Colors.textMuted}
                  value={form.dob}
                  onChangeText={v => update('dob', v)}
                />
              </View>
            </>
          )}

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.pwdRow}>
              <TextInput
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                placeholder="••••••••"
                placeholderTextColor={Colors.textMuted}
                secureTextEntry={!showPwd}
                value={form.password}
                onChangeText={v => update('password', v)}
              />
              <TouchableOpacity onPress={() => setShowPwd(s => !s)} style={styles.eyeBtn}>
                <Text>{showPwd ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {mode === 'register' && (
            <View style={styles.field}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={Colors.textMuted}
                secureTextEntry={!showPwd}
                value={form.confirmPassword}
                onChangeText={v => update('confirmPassword', v)}
              />
            </View>
          )}

          {mode === 'login' && (
            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.primaryBtn} onPress={onLogin} activeOpacity={0.85}>
            <Text style={styles.primaryBtnText}>{mode === 'login' ? 'Login' : 'Sign Up'}</Text>
          </TouchableOpacity>

          {mode === 'login' && (
            <>
              <TouchableOpacity style={styles.secondaryBtn} onPress={() => setMode('register')}>
                <Text style={styles.secondaryBtnText}>Sign Up</Text>
              </TouchableOpacity>

              <Text style={styles.orText}>or sign up with</Text>

              <View style={styles.socialRow}>
                <TouchableOpacity style={styles.socialBtn}>
                  <Text style={styles.socialIcon}>f</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialBtn}>
                  <Text style={styles.socialIcon}>G</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          <TouchableOpacity onPress={() => setMode(mode === 'login' ? 'register' : 'login')}>
            <Text style={styles.switchText}>
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <Text style={styles.switchLink}>{mode === 'login' ? 'Sign up' : 'Log in'}</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primary },
  scroll: { flexGrow: 1 },

  headerBg: {
    backgroundColor: Colors.primary,
    paddingTop: 56,
    paddingBottom: 48,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
  },
  logo: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: Spacing.xl },
  logoIcon: { fontSize: 22 },
  logoText: { fontSize: FontSize.lg, fontWeight: '700', color: '#fff' },
  headerTitle: { fontSize: FontSize.xxl + 4, fontWeight: '800', color: '#fff' },

  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
    ...Shadow.md,
  },

  field: { marginBottom: Spacing.md },
  label: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: 6, fontWeight: '500' },
  input: {
    backgroundColor: Colors.surfaceGray,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 13,
    fontSize: FontSize.base,
    color: Colors.text,
    marginBottom: 0,
  },
  pwdRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  eyeBtn: { padding: 10 },

  forgotBtn: { alignSelf: 'center', marginBottom: Spacing.lg },
  forgotText: { fontSize: FontSize.sm, color: Colors.textSecondary },

  primaryBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  primaryBtnText: { color: '#fff', fontSize: FontSize.md, fontWeight: '700' },

  secondaryBtn: {
    borderRadius: Radius.lg,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.primary,
    marginBottom: Spacing.lg,
  },
  secondaryBtnText: { color: Colors.primary, fontSize: FontSize.md, fontWeight: '600' },

  orText: { textAlign: 'center', color: Colors.textMuted, fontSize: FontSize.sm, marginBottom: Spacing.md },

  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: Spacing.lg },
  socialBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIcon: { fontSize: 18, fontWeight: '700', color: Colors.text },

  switchText: { textAlign: 'center', fontSize: FontSize.sm, color: Colors.textSecondary },
  switchLink: { color: Colors.primary, fontWeight: '600' },
});
