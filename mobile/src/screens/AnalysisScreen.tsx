import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";

/**
 * Analysis Screen - Duplicate detection and cleanup recommendations
 */
export default function AnalysisScreen() {
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
            Cleanup
          </Text>
          <Text style={{ fontSize: 14, color: "#505a81" }}>
            Find duplicates and optimize storage
          </Text>
        </View>

        {/* Stats */}
        <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
          <View
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 16,
              padding: 16,
              marginBottom: 12,
            }}
          >
            <Text style={{ color: "#505a81", fontSize: 12, marginBottom: 4 }}>
              DUPLICATES FOUND
            </Text>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "#0058ba",
              }}
            >
              24 files
            </Text>
          </View>

          <View
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 16,
              padding: 16,
            }}
          >
            <Text style={{ color: "#505a81", fontSize: 12, marginBottom: 4 }}>
              POTENTIAL STORAGE SAVED
            </Text>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "#0058ba",
              }}
            >
              1.2 GB
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={{ paddingHorizontal: 16 }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#0058ba",
              borderRadius: 999,
              padding: 16,
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Text style={{ color: "#ffffff", fontWeight: "600" }}>
              Scan for Duplicates
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: "#e4e7ff",
              borderRadius: 999,
              padding: 16,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#0058ba", fontWeight: "600" }}>
              View Noise Files
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
