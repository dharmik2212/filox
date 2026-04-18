import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { useAppDispatch, useAppSelector } from "../store";
import { loginStart, loginSuccess, loginError } from "../store/slices/authSlice";
import { Button, Card, ErrorBox } from "../components";
import { apiClient } from "../services/api";

export default function AuthScreen() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [isGuest, setIsGuest] = useState(false);

  const handleGoogleLogin = async () => {
    dispatch(loginStart());
    try {
      // For demo: simulate Google OAuth
      // In production, integrate: react-native-google-signin or expo-auth-session
      const mockResponse = {
        user: {
          id: 1,
          email: "test@example.com",
          name: "Test User",
        },
        token: "demo_token_" + Date.now(),
      };

      // Set token in API client
      apiClient.setToken(mockResponse.token);

      dispatch(loginSuccess(mockResponse));
    } catch (err: any) {
      dispatch(loginError(err.message || "Login failed"));
    }
  };

  const handleGuestLogin = () => {
    dispatch(loginStart());
    try {
      const mockResponse = {
        user: {
          id: 0,
          email: "guest@demo.local",
          name: "Guest User",
        },
        token: "guest_token_" + Date.now(),
      };

      apiClient.setToken(mockResponse.token);
      dispatch(loginSuccess(mockResponse));
    } catch (err: any) {
      dispatch(loginError(err.message || "Login failed"));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Filox</Text>
            <Text style={styles.subtitle}>Academic File Manager</Text>
            <Text style={styles.description}>
              Organize your files by semester and remove duplicates safely
            </Text>
          </View>

          {/* Error Display */}
          {error && <ErrorBox message={error} />}

          {/* Login Cards */}
          <Card padding={20} backgroundColor="#f7f5ff">
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Sign In</Text>

              <View style={styles.buttonContainer}>
                <Button
                  label="Continue with Google"
                  onPress={handleGoogleLogin}
                  variant="primary"
                  loading={loading}
                  size="large"
                />
              </View>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.buttonContainer}>
                <Button
                  label="Continue as Guest"
                  onPress={handleGuestLogin}
                  variant="secondary"
                  loading={loading}
                  size="large"
                />
              </View>

              <Text style={styles.disclaimer}>
                Demo mode enabled. Full OAuth integration coming soon.
              </Text>
            </View>
          </Card>

          {/* Features List */}
          <Card padding={20} backgroundColor="#ffffff">
            <Text style={styles.featureTitle}>Features</Text>
            {[
              "📁 Dynamic semester classification",
              "🔍 Smart duplicate detection",
              "🗑️ Safe file management (no auto-delete)",
              "📊 Storage analytics",
              "🔐 Secure OAuth authentication",
            ].map((feature, idx) => (
              <Text key={idx} style={styles.featureItem}>
                {feature}
              </Text>
            ))}
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f5ff",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  header: {
    paddingVertical: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "#0058ba",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#232c51",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#505a81",
    textAlign: "center",
    lineHeight: 20,
  },
  cardContent: {
    gap: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#232c51",
    marginBottom: 8,
  },
  buttonContainer: {
    marginVertical: 8,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#dde1ff",
  },
  dividerText: {
    marginHorizontal: 12,
    color: "#a2abd7",
    fontSize: 12,
  },
  disclaimer: {
    fontSize: 12,
    color: "#a2abd7",
    textAlign: "center",
    marginTop: 8,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#232c51",
    marginBottom: 12,
  },
  featureItem: {
    fontSize: 14,
    color: "#505a81",
    paddingVertical: 6,
    lineHeight: 20,
  },
});

