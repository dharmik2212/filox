import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

interface CardProps {
  children: React.ReactNode;
  padding?: number;
  backgroundColor?: string;
  borderRadius?: number;
  elevation?: number;
}

export const Card: React.FC<CardProps> = ({
  children,
  padding = 16,
  backgroundColor = "#ffffff",
  borderRadius = 12,
  elevation = 2,
}) => {
  const styles = StyleSheet.create({
    card: {
      backgroundColor,
      borderRadius,
      padding,
      elevation,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
  });

  return <View style={styles.card}>{children}</View>;
};

interface LoadingSpinnerProps {
  size?: "small" | "large";
  color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "large",
  color = "#0058ba",
}) => {
  return (
    <View style={styles.centerContainer}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

interface ErrorBoxProps {
  message: string;
  onDismiss?: () => void;
}

export const ErrorBox: React.FC<ErrorBoxProps> = ({ message, onDismiss }) => {
  return (
    <View style={styles.errorBox}>
      <Text style={styles.errorText}>{message}</Text>
      {onDismiss && (
        <Text onPress={onDismiss} style={styles.dismissText}>
          Dismiss
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorBox: {
    backgroundColor: "#ffefee",
    borderLeftColor: "#d32f2f",
    borderLeftWidth: 4,
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 14,
    marginBottom: 8,
  },
  dismissText: {
    color: "#d32f2f",
    fontSize: 12,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
