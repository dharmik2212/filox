import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Card } from "../components";
import { useAppSelector } from "../store";

/**
 * Dashboard Screen - Shows collections by semester
 */
export default function DashboardScreen() {
  const { user } = useAppSelector((state) => state.auth);
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);

  // Mock data - will be replaced with API calls
  const semesters = [
    { id: 1, name: "Fall 2024", files: 234, size: "1.2 GB", color: "#6c9fff" },
    { id: 2, name: "Spring 2024", files: 156, size: "892 MB", color: "#f39cfb" },
    { id: 3, name: "Fall 2023", files: 89, size: "456 MB", color: "#a2abd7" },
  ];

  const stats = [
    { label: "Total Files", value: "479", icon: "description" },
    { label: "Storage Used", value: "2.5 GB", icon: "storage" },
    { label: "Duplicates Found", value: "42", icon: "contentDuplicate" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Hey, {user?.name?.split(" ")[0] || "there"}! 👋
            </Text>
            <Text style={styles.subtitle}>Your file collections by semester</Text>
          </View>
        </View>

        {/* Stats Row */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.statsContainer}
          contentContainerStyle={styles.statsContent}
        >
          {stats.map((stat) => (
            <Card key={stat.label} padding={16} backgroundColor="#ffffff">
              <View style={styles.statCard}>
                <MaterialIcons
                  name={stat.icon as any}
                  size={24}
                  color="#0058ba"
                />
                <Text style={styles.statLabel}>{stat.label}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
              </View>
            </Card>
          ))}
        </ScrollView>

        {/* Collections Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Collections</Text>
            <TouchableOpacity>
              <MaterialIcons name="add" size={24} color="#0058ba" />
            </TouchableOpacity>
          </View>

          {semesters.map((semester) => (
            <TouchableOpacity
              key={semester.id}
              onPress={() => setSelectedSemester(semester.id.toString())}
              activeOpacity={0.7}
            >
              <Card
                padding={16}
                backgroundColor={
                  selectedSemester === semester.id.toString()
                    ? "#dde1ff"
                    : "#ffffff"
                }
              >
                <View style={styles.semesterCard}>
                  <View style={styles.semesterLeft}>
                    <View
                      style={[
                        styles.colorBadge,
                        { backgroundColor: semester.color },
                      ]}
                    />
                    <View>
                      <Text style={styles.semesterName}>{semester.name}</Text>
                      <Text style={styles.semesterMeta}>
                        {semester.files} files • {semester.size}
                      </Text>
                    </View>
                  </View>
                  <MaterialIcons
                    name="chevron-right"
                    size={24}
                    color="#0058ba"
                  />
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="cloud-upload" size={32} color="#0058ba" />
              <Text style={styles.actionLabel}>Upload</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="find-replace" size={32} color="#f39cfb" />
              <Text style={styles.actionLabel}>Find Duplicates</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="delete-outline" size={32} color="#d32f2f" />
              <Text style={styles.actionLabel}>Review</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="info" size={32} color="#6c9fff" />
              <Text style={styles.actionLabel}>Details</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.spacer} />
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
  header: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: "#f7f5ff",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "800",
    color: "#232c51",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#505a81",
  },
  statsContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  statsContent: {
    gap: 12,
  },
  statCard: {
    width: 140,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#505a81",
    textAlign: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0058ba",
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#232c51",
  },
  semesterCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  semesterLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  colorBadge: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  semesterName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#232c51",
  },
  semesterMeta: {
    fontSize: 12,
    color: "#505a81",
    marginTop: 2,
  },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#232c51",
    marginTop: 8,
    textAlign: "center",
  },
  spacer: {
    height: 24,
  },
});

