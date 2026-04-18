import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";

/**
 * Settings Screen - App configuration and user preferences
 */
export default function SettingsScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "#f7f5ff" }}>
      <ScrollView>
        {/* Header */}
        <View style={{ padding: 24, backgroundColor: "#f7f5ff" }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: "#232c51",
              marginBottom: 8,
            }}
          >
            Settings
          </Text>
        </View>

        {/* User Section */}
        <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: "#505a81",
              marginBottom: 12,
              textTransform: "uppercase",
            }}
          >
            Account
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 16,
              padding: 16,
              marginBottom: 12,
            }}
          >
            <Text style={{ color: "#232c51", fontWeight: "500" }}>
              Current Semester
            </Text>
            <Text style={{ color: "#505a81", fontSize: 12, marginTop: 4 }}>
              Fall 2024
            </Text>
          </TouchableOpacity>
        </View>

        {/* App Section */}
        <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: "#505a81",
              marginBottom: 12,
              textTransform: "uppercase",
            }}
          >
            App
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 16,
              padding: 16,
              marginBottom: 12,
            }}
          >
            <Text style={{ color: "#232c51", fontWeight: "500" }}>
              Version
            </Text>
            <Text style={{ color: "#505a81", fontSize: 12, marginTop: 4 }}>
              1.0.0
            </Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <View style={{ paddingHorizontal: 16 }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#fb5151",
              borderRadius: 999,
              padding: 16,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#ffffff", fontWeight: "600" }}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
