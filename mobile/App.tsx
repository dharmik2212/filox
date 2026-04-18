/**
 * Filox Mobile App - Google Photos Style Dashboard
 * Material 3 Design System matching code.html
 */

import React, { useState, useEffect } from "react";
import { startSilentSync } from "./src/services/AutoSyncGallery";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Image,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as MediaLibrary from "expo-media-library";
import { MaterialIcons } from "@expo/vector-icons";

const { width: screenWidth } = Dimensions.get("window");

// Material 3 Color Palette
const COLORS = {
  primary: "#0058ba",
  primaryContainer: "#6c9fff",
  secondary: "#3854b7",
  tertiary: "#883c93",
  surface: "#f7f5ff",
  surfaceContainer: "#e4e7ff",
  surfaceContainerHigh: "#dde1ff",
  onSurface: "#232c51",
  onSurfaceVariant: "#505a81",
};

// Mock photo emojis
const photoEmojis = ["🏔️", "⛰️", "🌲", "🌳", "🌅", "🏖️", "🏝️", "🌊", "🌸", "🏵️", "🌺", "🌻", "🌷", "🦋", "🐝"];

export default function App() {
  const [selectedTab, setSelectedTab] = useState("photos");
  const [localPhotos, setLocalPhotos] = useState<MediaLibrary.Asset[] | null>(null); // State modified to null for loading

  // Automatically start checking for new photos when app opens
  useEffect(() => {
    startSilentSync((assets) => {
      setLocalPhotos(assets);
    });
  }, []);

  // Everything above the photo grid goes into the FlatList header
  const renderListHeader = () => (
    <View>
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>Good morning, Alex</Text>
        <Text style={styles.welcomeSubtitle}>Your memories from this week are ready.</Text>
      </View>

      {/* Storage Card + Quick Action Bento */}
      <View style={styles.bentoRow}>
        <View style={[styles.storageCard, { flex: 2, marginRight: 12 }]}>
          <View style={styles.storageHeader}>
            <View>
              <Text style={styles.storageTitle}>Account Storage</Text>
              <Text style={styles.storageSubtitle}>75% of 15 GB used</Text>
            </View>
            <View style={styles.storageIcon}>
              <MaterialIcons name="cloud-done" size={24} color={COLORS.primary} />
            </View>
          </View>

          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: "75%", backgroundColor: COLORS.primary },
              ]}
            />
          </View>

          <View style={styles.storageButtons}>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Get more storage</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Clean up</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.rediscoverCard, { flex: 1 }]}>
          <MaterialIcons name="auto-awesome" size={32} color={COLORS.tertiary} />
          <Text style={styles.rediscoverTitle}>Rediscover</Text>
          <Text style={styles.rediscoverSubtitle}>4 years ago</Text>
          <TouchableOpacity>
            <Text style={styles.viewMemoryLink}>View</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Smart Recommendations Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Smart Recommendations</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllLink}>View all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.recommendationsGrid}>
          <View style={styles.largeRecCard}>
            <View style={[styles.recEmoji, { backgroundColor: "#FFE0B2" }]}>
              <Text style={styles.largeEmoji}>🌅</Text>
            </View>
            <Text style={styles.recTitle}>Summer Retreat 2023</Text>
            <Text style={styles.recSubtitle}>45 photos merged</Text>
          </View>

          <View style={styles.smallRecsGrid}>
            <View style={styles.smallRecCard}>
              <View style={[styles.smallEmoji, { backgroundColor: "#FFF9C4" }]}>
                <Text style={styles.smallEmojiText}>💡</Text>
              </View>
              <Text style={styles.smallRecTitle}>Fix lighting</Text>
            </View>
            <View style={styles.smallRecCard}>
              <View style={[styles.smallEmoji, { backgroundColor: "#E1BEE7" }]}>
                <Text style={styles.smallEmojiText}>📸</Text>
              </View>
              <Text style={styles.smallRecTitle}>Archive</Text>
            </View>
            <View style={styles.smallRecCard}>
              <View style={[styles.smallEmoji, { backgroundColor: "#C8E6C9" }]}>
                <Text style={styles.smallEmojiText}>🎥</Text>
              </View>
              <Text style={styles.smallRecTitle}>Cinematic</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Recent Photos Header */}
      <View style={[styles.sectionHeader, { paddingHorizontal: 16 }]}>
        <Text style={styles.sectionTitle}>Recent Photos</Text>
        <View style={styles.viewOptions}>
          <TouchableOpacity style={styles.viewOptionBtn}>
            <MaterialIcons name="grid-3x3" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.viewOptionBtn}>
            <MaterialIcons name="calendar-today" size={20} color={COLORS.onSurfaceVariant} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderPhotoItem = ({ item }: { item: MediaLibrary.Asset }) => (
    <TouchableOpacity style={styles.photoTile}>
      <Image 
         source={{ uri: item.uri }} 
         style={{ width: '100%', height: '100%', borderRadius: 8 }} 
         resizeMode="cover"
      />
    </TouchableOpacity>
  );

  // Dashboard Screen
  const renderDashboard = () => (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerLogo}>Filox</Text>
        <View style={styles.headerSearch}>
          <MaterialIcons name="search" size={18} color={COLORS.onSurfaceVariant} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search your memories"
            placeholderTextColor={COLORS.onSurfaceVariant}
          />
        </View>
        <View style={styles.profileAvatar}>
          <Text style={styles.avatarText}>A</Text>
        </View>
      </View>

      {localPhotos === null ? (
        <Text style={{textAlign: "center", color: COLORS.onSurfaceVariant, marginTop: 40}}>
          Syncing your photos...
        </Text>
      ) : localPhotos.length === 0 ? (
         <View style={{flex: 1}}>
           {renderListHeader()}
           <Text style={{textAlign: "center", color: COLORS.onSurfaceVariant, marginTop: 40}}>
             Your gallery is empty! Take some pictures.
           </Text>
         </View>
      ) : (
        <FlatList
          data={localPhotos}
          renderItem={renderPhotoItem}
          keyExtractor={(item) => item.id}
          numColumns={5} // Matches your 5-column grid layout
          columnWrapperStyle={styles.rowWrapper} // Adds spacing between columns
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderListHeader}
          contentContainerStyle={{ paddingBottom: 120 }} // Space for Bottom Nav
        />
      )}

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[styles.navItem, selectedTab === "photos" && styles.navItemActive]}
          onPress={() => setSelectedTab("photos")}
        >
          <MaterialIcons
            name="photo-library"
            size={24}
            color={selectedTab === "photos" ? "#ffffff" : COLORS.onSurfaceVariant}
          />
          <Text
            style={[
              styles.navLabel,
              { color: selectedTab === "photos" ? "#ffffff" : COLORS.onSurfaceVariant },
            ]}
          >
            Photos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setSelectedTab("search")}>
          <MaterialIcons name="search" size={24} color={COLORS.onSurfaceVariant} />
          <Text style={[styles.navLabel, { color: COLORS.onSurfaceVariant }]}>Search</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setSelectedTab("sharing")}>
          <MaterialIcons name="group" size={24} color={COLORS.onSurfaceVariant} />
          <Text style={[styles.navLabel, { color: COLORS.onSurfaceVariant }]}>Sharing</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setSelectedTab("library")}>
          <MaterialIcons name="inventory-2" size={24} color={COLORS.onSurfaceVariant} />
          <Text style={[styles.navLabel, { color: COLORS.onSurfaceVariant }]}>Library</Text>
        </TouchableOpacity>
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <MaterialIcons name="add" size={28} color="#ffffff" />
      </TouchableOpacity>
    </SafeAreaView>
  );

  return renderDashboard();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceContainerHigh,
  },
  headerLogo: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.primary,
    marginRight: 12,
  },
  headerSearch: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 24,
    marginHorizontal: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.onSurface,
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  welcomeSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.onSurface,
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
    fontWeight: "500",
  },
  bentoRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  storageCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "column",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  storageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  storageTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.onSurface,
    marginBottom: 4,
  },
  storageSubtitle: {
    fontSize: 11,
    color: COLORS.onSurfaceVariant,
  },
  storageIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceContainerHigh,
    justifyContent: "center",
    alignItems: "center",
  },
  progressBar: {
    width: "100%",
    height: 6,
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  storageButtons: {
    gap: 8,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 12,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.surfaceContainer,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 12,
  },
  rediscoverCard: {
    backgroundColor: "#f39cfb",
    borderRadius: 12,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  rediscoverTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.onSurface,
    marginTop: 8,
  },
  rediscoverSubtitle: {
    fontSize: 10,
    color: COLORS.onSurfaceVariant,
    marginVertical: 4,
  },
  viewMemoryLink: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "600",
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.onSurface,
  },
  viewAllLink: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "600",
  },
  viewOptions: {
    flexDirection: "row",
    gap: 8,
  },
  viewOptionBtn: {
    padding: 6,
  },
  recommendationsGrid: {
    gap: 8,
  },
  largeRecCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    marginBottom: 8,
  },
  recEmoji: {
    width: "100%",
    aspectRatio: 2,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  largeEmoji: {
    fontSize: 48,
  },
  recTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.onSurface,
    marginBottom: 4,
  },
  recSubtitle: {
    fontSize: 11,
    color: COLORS.onSurfaceVariant,
  },
  smallRecsGrid: {
    flexDirection: "row",
    gap: 8,
  },
  smallRecCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  smallEmoji: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  smallEmojiText: {
    fontSize: 24,
  },
  smallRecTitle: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.onSurface,
    textAlign: "center",
  },
  rowWrapper: {
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    gap: 1,
    marginBottom: 1,
  },
  photoTile: {
    width: (screenWidth - 35) / 5, // Adjusted slightly to fit gap safely
    aspectRatio: 1,
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 4,
  },
  bottomNav: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    marginHorizontal: 16,
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 28,
    paddingVertical: 8,
    paddingHorizontal: 12,
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    justifyContent: "space-around",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 6,
    borderRadius: 20,
  },
  navItemActive: {
    backgroundColor: COLORS.primary,
  },
  navLabel: {
    fontSize: 9,
    fontWeight: "600",
    marginTop: 4,
  },
  fab: {
    position: "absolute",
    bottom: 100,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});

