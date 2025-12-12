import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function Profile() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: "Lorenz Almonia",
    location: "Loc:",
    contact: "No:",
    bio: "About me:",
    avatarEmoji: "👤",
  });
  
  const [tempUser, setTempUser] = useState({ ...user });

  // General emoji options for profile picture
  const emojiOptions = [
    "👤", "👨", "👩", "🧑", "👨‍💼", "👩‍💼", "🧑‍💼",
  ];

  const handleSave = () => {
    setUser(tempUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempUser({ ...user });
    setIsEditing(false);
  };

  const selectEmoji = (emoji) => {
    setTempUser({ ...tempUser, avatarEmoji: emoji });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 My Profile</Text>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        {/* Avatar Emoji Display */}
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarEmoji}>{user.avatarEmoji}</Text>
        </View>
        
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.detail}>📍 {user.location}</Text>
        <Text style={styles.detail}>📞 {user.contact}</Text>
        <Text style={styles.bio}>📝 {user.bio}</Text>
      </View>

      {/* Edit Button */}
      <TouchableOpacity 
        style={styles.editBtn} 
        onPress={() => setIsEditing(true)}
      >
        <Text style={styles.editText}>✏️ Edit Profile</Text>
      </TouchableOpacity>

      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.backText}>⬅ Back</Text>
      </TouchableOpacity>

      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditing}
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            
            <ScrollView 
              style={styles.modalScrollView}
              showsVerticalScrollIndicator={true}
            >
              {/* Emoji Selection */}
              <Text style={styles.sectionLabel}>Select Profile Emoji:</Text>
              <View style={styles.emojiContainer}>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false} 
                  style={styles.emojiScroll}
                >
                  {emojiOptions.map((emoji, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.emojiOption,
                        tempUser.avatarEmoji === emoji && styles.selectedEmoji
                      ]}
                      onPress={() => selectEmoji(emoji)}
                    >
                      <Text style={styles.emojiText}>{emoji}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                
                {/* Selected Emoji Preview */}
                <View style={styles.selectedEmojiContainer}>
                  <Text style={styles.selectedEmojiPreview}>{tempUser.avatarEmoji}</Text>
                  <Text style={styles.selectedEmojiLabel}>Current Selection</Text>
                </View>
              </View>

              {/* Form Fields */}
              <View style={styles.formContainer}>
                <Text style={styles.inputLabel}>Name:</Text>
                <TextInput
                  style={styles.input}
                  value={tempUser.name}
                  onChangeText={(text) => setTempUser({ ...tempUser, name: text })}
                  placeholder="Enter your name"
                />

                <Text style={styles.inputLabel}>Location:</Text>
                <TextInput
                  style={styles.input}
                  value={tempUser.location}
                  onChangeText={(text) => setTempUser({ ...tempUser, location: text })}
                  placeholder="Enter your location"
                />

                <Text style={styles.inputLabel}>Contact:</Text>
                <TextInput
                  style={styles.input}
                  value={tempUser.contact}
                  onChangeText={(text) => setTempUser({ ...tempUser, contact: text })}
                  placeholder="Enter your contact number"
                  keyboardType="phone-pad"
                />

                <Text style={styles.inputLabel}>Bio:</Text>
                <TextInput
                  style={[styles.input, styles.bioInput]}
                  value={tempUser.bio}
                  onChangeText={(text) => setTempUser({ ...tempUser, bio: text })}
                  placeholder="Tell us about yourself"
                  multiline
                  numberOfLines={3}
                />
              </View>

              {/* Action Buttons - Moved inside ScrollView but positioned at bottom */}
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                  <Text style={styles.saveText}>Update Profile</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: "#fff" 
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    color: "#2E7D32", 
    marginBottom: 20,
    textAlign: "center"
  },
  profileCard: {
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 15,
    padding: 25,
    width: "100%",
    backgroundColor: "#F9F9F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 3,
    borderColor: "#4CAF50",
  },
  avatarEmoji: {
    fontSize: 60,
  },
  name: { 
    fontSize: 22, 
    fontWeight: "bold", 
    marginBottom: 10,
    color: "#2E7D32"
  },
  detail: { 
    fontSize: 16, 
    marginBottom: 8,
    color: "#555",
    textAlign: "center"
  },
  bio: { 
    marginTop: 15, 
    color: "#666", 
    fontStyle: "italic",
    fontSize: 16
  },
  editBtn: {
    marginTop: 10,
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  editText: { 
    color: "#fff", 
    fontWeight: "bold",
    fontSize: 16 
  },
  backText: { 
    marginTop: 25, 
    color: "#4CAF50",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500"
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    maxHeight: "85%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  modalScrollView: {
    maxHeight: "100%",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 20,
    textAlign: "center",
  },
  emojiContainer: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  emojiScroll: {
    flexDirection: "row",
    marginBottom: 15,
  },
  emojiOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  selectedEmoji: {
    backgroundColor: "#E8F5E9",
    borderColor: "#4CAF50",
    borderWidth: 2,
  },
  emojiText: {
    fontSize: 24,
  },
  selectedEmojiContainer: {
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    marginTop: 10,
  },
  selectedEmojiPreview: {
    fontSize: 50,
    marginBottom: 5,
  },
  selectedEmojiLabel: {
    fontSize: 14,
    color: "#666",
  },
  formContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#F9F9F9",
    marginBottom: 15,
  },
  bioInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  cancelText: {
    color: "#666",
    fontWeight: "600",
    fontSize: 16,
  },
  saveBtn: {
    flex: 1,
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginLeft: 10,
  },
  saveText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
});