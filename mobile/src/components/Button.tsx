import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "tertiary";
  disabled?: boolean;
  loading?: boolean;
  size?: "small" | "medium" | "large";
}

const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  size = "medium",
}) => {
  const styles = getStyles(variant, size, disabled);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={disabled || loading}
    >
      <Text style={styles.text}>
        {loading ? "Loading..." : label}
      </Text>
    </TouchableOpacity>
  );
};

const getStyles = (variant: string, size: string, disabled: boolean) => {
  const baseSize = {
    small: { padding: 8, fontSize: 14 },
    medium: { padding: 12, fontSize: 16 },
    large: { padding: 16, fontSize: 18 },
  };

  const baseColor = {
    primary: { bg: "#0058ba", text: "#ffffff" },
    secondary: { bg: "#6c9fff", text: "#ffffff" },
    tertiary: { bg: "#f39cfb", text: "#232c51" },
  };

  const color = baseColor[variant as keyof typeof baseColor];
  const sz = baseSize[size as keyof typeof baseSize];

  return StyleSheet.create({
    container: {
      paddingVertical: sz.padding,
      paddingHorizontal: sz.padding + 4,
      backgroundColor: disabled ? "#a2abd7" : color.bg,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    text: {
      color: disabled ? "#505a81" : color.text,
      fontSize: sz.fontSize,
      fontWeight: "600",
    },
  });
};

export default Button;
