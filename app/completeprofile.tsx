import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { MultiSelect } from "react-native-element-dropdown";

// Data
import institutions from "@/data/institutions.json";
import genders from "@/data/genders.json";
import interests from "@/data/interests.json";
import courses from "@/data/courses.json";

// Placeholder profile image
const profileImage = "https://via.placeholder.com/100";

export default function CompleteProfile() {
  const [bio, setBio] = useState("");
  const [institution, setInstitution] = useState("");
  const [gender, setGender] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [course, setCourse] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [showDeleteInput, setShowDeleteInput] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState("");

  const user = {
    id: 1,
    fullName: "David Python",
    email: "boogie@gmail.com",
    username: "@XA",
  };

  const handleSubmit = async () => {
    // ... your existing submit logic ...
  };

  const confirmDeleteAccount = async () => {
  if (!deleteUserId || isNaN(Number(deleteUserId))) {
    Alert.alert("❌ Error", "Please enter a valid user ID.");
    return;
  }

  try {
    console.log("Sending DELETE request for user ID:", deleteUserId);

    const response = await fetch(
      `http://192.168.x.x:9999/user/${deleteUserId}/schedule-deletion`, // Use your LAN IP, not localhost
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          // Add auth token if needed: Authorization: `Bearer ${token}`
        },
      }
    );

    if (!response.ok) {
      const errorMessage = await response.text();
      console.error("Server error:", errorMessage);
      throw new Error(errorMessage || "Failed to schedule account deletion");
    }

    const message = await response.text();
    Alert.alert(" Success", message);
    setShowDeleteInput(false);
    setDeleteUserId("");
  } catch (err: any) {
    console.error("Request failed:", err);
    Alert.alert(" Error", err.message);
  }
};

  const handleLogout = () => {
    Alert.alert("Logged out");
