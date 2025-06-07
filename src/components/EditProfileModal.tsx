"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { pickImageAsync } from "./common/AutoHelper";

const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

interface SocialLink {
  platform: string;
  url: string;
}

interface ProfileData {
  name: string;
  cover_image: string;
  address: string;
  industry: string;
  website: string;
  slug: string;
  description: string;
  social_links: SocialLink[];
  founded_at: Date | null;
}

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: ProfileData) => void;
  initialData?: Partial<ProfileData>;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  onClose,
  onSave,
  initialData = {},
}) => {
  const [formData, setFormData] = useState<ProfileData>({
    name: "",
    cover_image: "",
    address: "",
    industry: "",
    website: "",
    slug: "",
    description: "",
    social_links: [],
    founded_at: null,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const today = new Date();
  const [manualDate, setManualDate] = useState({
    day: today.getDate(),
    month: today.getMonth(),
    year: today.getFullYear(),
  });

  useEffect(() => {
    if (initialData) {
      let foundedDate = null;

      if (initialData.founded_at) {
        foundedDate = new Date(initialData.founded_at);
      }

      let socialLinks: SocialLink[] = [];
      if (initialData.social_links) {
        if (Array.isArray(initialData.social_links)) {
          socialLinks = initialData.social_links;
        } else {
          socialLinks = Object.entries(initialData.social_links).map(
            ([platform, url]) => ({
              platform,
              url: url as string,
            })
          );
        }
      }

      setFormData({
        name: initialData.name || "",
        cover_image: initialData.cover_image || "",
        address: initialData.address || "",
        industry: initialData.industry || "",
        website: initialData.website || "",
        slug: initialData.slug || "",
        description: initialData.description || "",
        social_links: socialLinks,
        founded_at: foundedDate,
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (formData.founded_at) {
      setManualDate({
        day: formData.founded_at.getDate(),
        month: formData.founded_at.getMonth(),
        year: formData.founded_at.getFullYear(),
      });
    }
  }, [formData.founded_at]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.cover_image.trim())
      newErrors.cover_image = "Cover image is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.industry.trim()) newErrors.industry = "Industry is required";
    if (!formData.website.trim()) newErrors.website = "Website is required";
    if (!formData.slug.trim()) newErrors.slug = "Slug is required";

    const urlPattern =
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    if (formData.website && !urlPattern.test(formData.website)) {
      newErrors.website = "Please enter a valid website URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSave({
        ...formData,
        social_links: JSON.stringify(formData.social_links),
      } as any);
      onClose();
    } catch (error) {
      Alert.alert("Error", "Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof ProfileData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const addSocialLink = () => {
    setFormData((prev) => ({
      ...prev,
      social_links: [...prev.social_links, { platform: "", url: "" }],
    }));
  };

  const updateSocialLink = (
    index: number,
    field: "platform" | "url",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      social_links: prev.social_links.map((link, i) =>
        i === index ? { ...link, [field]: value } : link
      ),
    }));
  };

  const removeSocialLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      social_links: prev.social_links.filter((_, i) => i !== index),
    }));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <TouchableOpacity
            onPress={handleSave}
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? "Saving..." : "Save"}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cover Image</Text>
            <TouchableOpacity
              style={styles.imageContainer}
              onPress={async () => {
                const imageUri = await pickImageAsync();
                if (imageUri) {
                  updateField("cover_image", imageUri);
                }
              }}
              activeOpacity={0.7}
            >
              {formData.cover_image ? (
                <Image
                  source={{ uri: formData.cover_image }}
                  style={styles.coverImage}
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="image-outline" size={40} color="#999" />
                  <Text style={styles.imagePlaceholderText}>
                    Tap to select cover image
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            {errors.cover_image && (
              <Text style={styles.errorText}>{errors.cover_image}</Text>
            )}
          </View>

          {/* Basic Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Company Name *</Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                value={formData.name}
                onChangeText={(value) => updateField("name", value)}
                placeholder="Enter company name"
                placeholderTextColor="#999"
              />
              {errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Slug *</Text>
              <TextInput
                style={[styles.input, errors.slug && styles.inputError]}
                value={formData.slug}
                onChangeText={(value) =>
                  updateField("slug", value.toLowerCase().replace(/\s+/g, "-"))
                }
                placeholder="company-slug"
                placeholderTextColor="#999"
                autoCapitalize="none"
              />
              {errors.slug && (
                <Text style={styles.errorText}>{errors.slug}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Industry *</Text>
              <TextInput
                style={[styles.input, errors.industry && styles.inputError]}
                value={formData.industry}
                onChangeText={(value) => updateField("industry", value)}
                placeholder="e.g., Technology, Healthcare, Finance"
                placeholderTextColor="#999"
              />
              {errors.industry && (
                <Text style={styles.errorText}>{errors.industry}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Website *</Text>
              <TextInput
                style={[styles.input, errors.website && styles.inputError]}
                value={formData.website}
                onChangeText={(value) => updateField("website", value)}
                placeholder="https://www.example.com"
                placeholderTextColor="#999"
                keyboardType="url"
                autoCapitalize="none"
              />
              {errors.website && (
                <Text style={styles.errorText}>{errors.website}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address *</Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  errors.address && styles.inputError,
                ]}
                value={formData.address}
                onChangeText={(value) => updateField("address", value)}
                placeholder="Enter full address"
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
              />
              {errors.address && (
                <Text style={styles.errorText}>{errors.address}</Text>
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Information</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Founded Date</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Text
                  style={[
                    styles.dateText,
                    !formData.founded_at && styles.placeholderText,
                  ]}
                >
                  {formData?.founded_at
                    ? formData.founded_at.toLocaleDateString()
                    : "Select founding date"}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(value) => updateField("description", value)}
                placeholder="Tell us about your company..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
              />
            </View>
          </View>

          {/* Social Links */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Social Links</Text>
              <TouchableOpacity
                onPress={addSocialLink}
                style={styles.addButton}
              >
                <Ionicons name="add" size={20} color="#007AFF" />
                <Text style={styles.addButtonText}>Add Link</Text>
              </TouchableOpacity>
            </View>
            {formData.social_links.map((link, index) => (
              <View key={index} style={styles.socialLinkContainer}>
                <View style={styles.socialLinkInputs}>
                  <TextInput
                    style={[styles.input, styles.socialInput]}
                    value={link.platform}
                    onChangeText={(value) =>
                      updateSocialLink(index, "platform", value)
                    }
                    placeholder="Platform (e.g., LinkedIn)"
                    placeholderTextColor="#999"
                  />
                  <TextInput
                    style={[styles.input, styles.socialInput]}
                    value={link.url}
                    onChangeText={(value) =>
                      updateSocialLink(index, "url", value)
                    }
                    placeholder="URL"
                    placeholderTextColor="#999"
                    keyboardType="url"
                    autoCapitalize="none"
                  />
                </View>
                <TouchableOpacity
                  onPress={() => removeSocialLink(index)}
                  style={styles.removeButton}
                >
                  <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* Date Picker */}
        {showDatePicker && (
          <View style={styles.customDatePickerContainer}>
            <View style={styles.customDatePickerHeader}>
              <Text style={styles.customDatePickerTitle}>Select Date</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.customDatePickerContent}>
              <View style={styles.datePickerRow}>
                <Picker
                  selectedValue={manualDate.month}
                  onValueChange={(value) =>
                    setManualDate({ ...manualDate, month: value })
                  }
                  style={styles.datePickerItem}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <Picker.Item
                      key={`month-${i}`}
                      label={new Date(0, i).toLocaleString("default", {
                        month: "long",
                      })}
                      value={i}
                    />
                  ))}
                </Picker>

                <Picker
                  selectedValue={manualDate.day}
                  onValueChange={(value) =>
                    setManualDate({ ...manualDate, day: value })
                  }
                  style={styles.datePickerItem}
                >
                  {Array.from(
                    {
                      length: getDaysInMonth(manualDate.year, manualDate.month),
                    },
                    (_, i) => (
                      <Picker.Item
                        key={`day-${i}`}
                        label={`${i + 1}`}
                        value={i + 1}
                      />
                    )
                  )}
                </Picker>

                <Picker
                  selectedValue={manualDate.year}
                  onValueChange={(value) =>
                    setManualDate({ ...manualDate, year: value })
                  }
                  style={styles.datePickerItem}
                >
                  {Array.from({ length: 123 }, (_, i) => (
                    <Picker.Item
                      key={`year-${i}`}
                      label={`${2025 - i}`}
                      value={2025 - i}
                    />
                  ))}
                </Picker>
              </View>{" "}
              <TouchableOpacity
                style={styles.confirmDateButton}
                onPress={() => {
                  const selectedDate = new Date(
                    manualDate.year,
                    manualDate.month,
                    manualDate.day
                  );
                  console.log("Setting founded_at:", selectedDate);
                  updateField("founded_at", selectedDate);
                  setShowDatePicker(false);
                }}
              >
                <Text style={styles.confirmDateButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E7",
    paddingTop: Platform.OS === "ios" ? 50 : 16,
    backgroundColor: "#f8f9fa",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  closeButton: {
    padding: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    letterSpacing: 0.5,
  },
  saveButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: "#007AFF",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  saveButtonDisabled: {
    backgroundColor: "#b3b3b3",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    marginBottom: 16,
    position: "relative",
    paddingLeft: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E5E7",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#F8F9FA",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputError: {
    borderColor: "#FF3B30",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 14,
    marginTop: 4,
  },
  imageContainer: {
    height: 250,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E5E5E7",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  coverImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  imagePlaceholderText: {
    color: "#999",
    fontSize: 14,
    marginTop: 8,
    fontWeight: "500",
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E5E5E7",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F8F9FA",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  dateText: {
    fontSize: 16,
    color: "#000",
  },
  placeholderText: {
    color: "#999",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 4,
  },
  socialLinkContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5E7",
    padding: 12,
    paddingRight: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  socialLinkInputs: {
    flex: 1,
    gap: 12,
  },
  socialInput: {
    marginBottom: 0,
    backgroundColor: "#fff",
    borderColor: "#E0E0E0",
  },
  removeButton: {
    padding: 10,
    marginLeft: 8,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF0F0",
  },
  bottomSpacing: {
    height: 40,
  },

  customDatePickerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  customDatePickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E7",
  },
  customDatePickerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  customDatePickerContent: {
    paddingVertical: 16,
  },
  datePickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  datePickerItem: {
    flex: 1,
    height: 180,
  },
  confirmDateButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  confirmDateButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default EditProfileModal;
