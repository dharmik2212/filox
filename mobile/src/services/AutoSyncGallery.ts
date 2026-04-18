import * as MediaLibrary from 'expo-media-library';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const BACKEND_AUTO_URL = "http://192.168.x.x:8000/auto-sync"; // replace with your machine IP

/**
 * Runs silently in the background or during app startup to find NEW notes 
 * exactly like Google Photos background syncing.
 */
export async function startSilentSync(onPhotosFound?: (assets: MediaLibrary.Asset[]) => void) {
  try {
    try {
      let permission = await MediaLibrary.getPermissionsAsync();
      if (!permission.granted && permission.canAskAgain) {
        permission = await MediaLibrary.requestPermissionsAsync();
      }
      if (!permission.granted) {
        console.log('Permission to access gallery denied.');
      }
    } catch (permError) {
      console.warn("Expo Go Android 13+ Permission Bug - ignoring and attempting to fetch anyway.");
    }

    // 1. Where did we leave off?
    const lastSyncTimeStr = await AsyncStorage.getItem('LAST_SYNC_TIME');
    const lastSyncTime = 0; // TEMP FOR TESTING: always act like it's the first time

    // 2. Fetch all new local photos since the last check
    console.log("Auto-Scanning for new gallery items...");
    
    let fetchOptions: MediaLibrary.AssetsOptions = {
      mediaType: 'photo',
      sortBy: [[MediaLibrary.SortBy.creationTime, false]],
      first: 20, // Grab in batches of 20
    };
    if (lastSyncTime > 0) {
      fetchOptions.createdAfter = lastSyncTime;
    }

    const recentAssets = await MediaLibrary.getAssetsAsync(fetchOptions);

    if (onPhotosFound) {
      onPhotosFound(recentAssets.assets); // Send even if 0, so UI can stop "Syncing" state
    }

    if (recentAssets.assets.length === 0) {
      console.log("No new photos found to sync.");
      return;
    }

  let latestFoundTime = lastSyncTime;

  // 3. Process each photo silently
  for (let asset of recentAssets.assets) {
    if (asset.creationTime > latestFoundTime) {
      latestFoundTime = asset.creationTime;
    }

    try {
      // Get the real file path so we can upload it
      let fileInfo = await MediaLibrary.getAssetInfoAsync(asset);
      let localUri = fileInfo.localUri || asset.uri;

      // 4. Fire the image up to the Python (AI) Backend
      console.log(`ðŸš€ Silent upload for ${localUri}`);

      let formData = new FormData();
      formData.append('image', {
        uri: localUri,
        type: 'image/jpeg',
        name: asset.filename || 'auto-upload.jpg',
      } as any);
      formData.append('photo_creation_date', asset.creationTime.toString());

      const response = await fetch(BACKEND_AUTO_URL, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const resJson = await response.json();
      console.log("âœ¨ Backend AI processed image:", resJson);

    } catch (e) {
      console.error("âš ï¸  Sync failed for an image:", e);
    }
  }

    // 5. Update our checkpoint so we don't re-upload these photos next time
    await AsyncStorage.setItem('LAST_SYNC_TIME', latestFoundTime.toString());
    console.log("Batch background sync complete. Updated checkpoint.");
  } catch (error) {
    console.error("Critical error in startSilentSync:", error);
    if (onPhotosFound) onPhotosFound([]);
  }
}
