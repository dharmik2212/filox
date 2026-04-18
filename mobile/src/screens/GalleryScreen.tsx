import React from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";

/**
 * Gallery Screen - Shows all photos with classification badges
 */
export default function GalleryScreen() {
  const [photos, setPhotos] = React.useState<any[]>([]);

  return (
    <View style={{ flex: 1, backgroundColor: "#f7f5ff" }}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 8,
          backgroundColor: "#f7f5ff",
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            color: "#232c51",
            marginBottom: 8,
          }}
        >
          Gallery
        </Text>
      </View>

      {/* Photo Grid */}
      <FlatList
        data={photos}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              flex: 1,
              margin: 8,
              backgroundColor: "#e4e7ff",
              borderRadius: 12,
              overflow: "hidden",
              aspectRatio: 1,
            }}
          >
            {/* Classification Badge */}
            <View
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                zIndex: 10,
                backgroundColor:
                  item.classification === "academic" ? "#0058ba" : "#fb5151",
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 20,
              }}
            >
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 10,
                  fontWeight: "600",
                }}
              >
                {item.classification}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        numColumns={3}
        scrollEnabled={true}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 40,
            }}
          >
            <Text style={{ color: "#505a81", marginBottom: 8 }}>
              No photos yet
            </Text>
            <Text style={{ color: "#a2abd7", fontSize: 12 }}>
              Grant permission to access your phone's photos
            </Text>
          </View>
        }
      />
    </View>
  );
}
