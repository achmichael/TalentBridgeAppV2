"use client";

import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import withAuth from "@/src/hoc/withAuth";
import { poster } from "@/src/components/common/AutoHelper";
import { baseUrl } from "@/src/config/baseUrl";
import { useAuth } from "@/src/contexts/AuthContext";
import AlertModal from "@/src/components/ModalAlert";
import { Picker } from "@react-native-picker/picker";
import { AlertType } from "@/src/components/ModalAlert";
import useFetch from "@/hooks/use-fetch";
import LoadingScreen from "../common/LoadingScreen";

const CreateJobScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useAuth();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [titleModal, setTitleModal] = useState<string>("");
  const [messageModal, setMessageModal] = useState<string>("");
  const [typeModal, setTypeModal] = useState<string>("");

  // Post fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [levelId, setLevelId] = useState(1);
  const [requiredSkills, setRequiredSkills] = useState("");
  const [minExperienceYears, setMinExperienceYears] = useState("");
  const [categoryId, setCategoryId] = useState(1);

  // Job fields
  const [numberOfEmployee, setNumberOfEmployee] = useState("");
  const [duration, setDuration] = useState("");
  const [status, setStatus] = useState<"open" | "closed">("open");
  const [typeJob, setTypeJob] = useState<
    "full-time" | "part-time" | "contract"
  >("full-time");
  const [typeSalary, setTypeSalary] = useState<"fixed" | "flexible">("fixed");
  const [system, setSystem] = useState<"wfo" | "wfh" | "hybrid">("wfo");
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showLevelPicker, setShowLevelPicker] = useState(false);
  const [levels, setLevels] = useState([
    { id: 1, name: "Entry Level" },
    { id: 2, name: "Mid Level" },
    { id: 3, name: "Expert Level" },
  ]);

  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );

  const { data, loading } = useFetch(`${baseUrl}/categories`);

  useEffect(() => {
    if (data && data.length > 0) {
      const typed = data as { id: number; category_name: string }[];
      setCategories(
        typed.map(({ id, category_name }) => ({
          id,
          name: category_name,
        }))
      );
    }
  }, [data]);

  const handleSubmit = async () => {
    if (
      !title ||
      !description ||
      !price ||
      !requiredSkills ||
      !minExperienceYears ||
      !numberOfEmployee ||
      !duration
    ) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    const formattedSkills =
      typeof requiredSkills === "string"
        ? requiredSkills.split(",").map((skill) => skill.trim())
        : requiredSkills;

    const jobData = {
      job_title: title,
      description,
      price: Number(price),
      level_id: levelId,
      category_id: categoryId,
      required_skills: JSON.stringify(formattedSkills),
      min_experience_years: Number(minExperienceYears),
      number_of_employee: Number(numberOfEmployee),
      duration: Number(duration),
      status,
      type_job: typeJob,
      type_salary: typeSalary,
      system,
    };

    const { error, data } = await poster(`${baseUrl}/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`,
      },
      body: JSON.stringify(jobData),
    });

    setIsSubmitting(false);

    if (error) {
      setShowModal(true);
      setTitleModal("error");
      setTypeModal("error");
      setMessageModal(error);
      return;
    }

    setShowModal(true);
    setTypeModal("success");
    setTitleModal("Success");
    setMessageModal(data.message);
  };

  const handleSaveDraft = () => {
    if (!title) {
      Alert.alert("Error", "Please enter at least a job title");
      return;
    }

    Alert.alert("Success", "Job posting saved as draft", [
      {
        text: "OK",
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <AlertModal
        visible={showModal}
        type={typeModal as AlertType}
        title={titleModal}
        message={messageModal}
        onClose={() => setShowModal(false)}
      />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Create Job Posting
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Post Details Section */}
        <View style={styles.formSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Post Details
          </Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>
              Job Title *
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.card,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              placeholder="e.g. Senior React Developer"
              placeholderTextColor={theme.text + "60"}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>
              Description *
            </Text>
            <TextInput
              style={[
                styles.textArea,
                {
                  backgroundColor: theme.card,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              placeholder="Describe the job role, responsibilities, and qualifications..."
              placeholderTextColor={theme.text + "60"}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>
              Category Job *
            </Text>
            <TouchableOpacity
              style={[
                styles.input,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                  justifyContent: "center",
                },
              ]}
              onPress={() => setShowCategoryPicker(true)}
            >
              <Text style={{ color: theme.text }}>
                {categories.find((cat) => cat.id === categoryId)?.name ||
                  "Select Level"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>
              Price/Salary *
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.card,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              placeholder="e.g. 5000"
              placeholderTextColor={theme.text + "60"}
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>
              Job Level *
            </Text>
            <TouchableOpacity
              style={[
                styles.input,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                  justifyContent: "center",
                },
              ]}
              onPress={() => setShowLevelPicker(true)}
            >
              <Text style={{ color: theme.text }}>
                {levels.find((lev) => lev.id === levelId)?.name ||
                  "Select Level"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>
              Required Skills *
            </Text>
            <TextInput
              style={[
                styles.textArea,
                {
                  backgroundColor: theme.card,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              placeholder="List required skills (comma separated)"
              placeholderTextColor={theme.text + "60"}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={requiredSkills}
              onChangeText={setRequiredSkills}
            />
            <Text style={[styles.helperText, { color: theme.text + "60" }]}>
              Tip: Separate skills with commas (e.g. React, TypeScript, Node.js)
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>
              Minimum Experience (Years) *
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.card,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              placeholder="e.g. 2"
              placeholderTextColor={theme.text + "60"}
              value={minExperienceYears}
              onChangeText={setMinExperienceYears}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Job Details Section */}
        <View style={styles.formSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Job Details
          </Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>
              Number of Employees *
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.card,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              placeholder="e.g. 3"
              placeholderTextColor={theme.text + "60"}
              value={numberOfEmployee}
              onChangeText={setNumberOfEmployee}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>
              Duration (months) *
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.card,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              placeholder="e.g. 12"
              placeholderTextColor={theme.text + "60"}
              value={duration}
              onChangeText={setDuration}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>
              Status
            </Text>
            <View style={styles.jobTypeContainer}>
              {[
                { value: "open", label: "Open" },
                { value: "closed", label: "Closed" },
              ].map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.jobTypeButton,
                    {
                      backgroundColor:
                        status === option.value ? theme.accent : theme.card,
                      borderColor:
                        status === option.value ? theme.accent : theme.border,
                    },
                  ]}
                  onPress={() => setStatus(option.value as "open" | "closed")}
                >
                  <Text
                    style={[
                      styles.jobTypeText,
                      {
                        color: status === option.value ? "#FFFFFF" : theme.text,
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>
              Job Type
            </Text>
            <View style={styles.jobTypeContainer}>
              {[
                { value: "full-time", label: "Full-time" },
                { value: "part-time", label: "Part-time" },
                { value: "contract", label: "Contract" },
              ].map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.jobTypeButton,
                    {
                      backgroundColor:
                        typeJob === option.value ? theme.accent : theme.card,
                      borderColor:
                        typeJob === option.value ? theme.accent : theme.border,
                    },
                  ]}
                  onPress={() =>
                    setTypeJob(
                      option.value as "full-time" | "part-time" | "contract"
                    )
                  }
                >
                  <Text
                    style={[
                      styles.jobTypeText,
                      {
                        color:
                          typeJob === option.value ? "#FFFFFF" : theme.text,
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>
              Salary Type
            </Text>
            <View style={styles.jobTypeContainer}>
              {[
                { value: "fixed", label: "Fixed" },
                { value: "flexible", label: "Flexible" },
              ].map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.jobTypeButton,
                    {
                      backgroundColor:
                        typeSalary === option.value ? theme.accent : theme.card,
                      borderColor:
                        typeSalary === option.value
                          ? theme.accent
                          : theme.border,
                    },
                  ]}
                  onPress={() =>
                    setTypeSalary(option.value as "fixed" | "flexible")
                  }
                >
                  <Text
                    style={[
                      styles.jobTypeText,
                      {
                        color:
                          typeSalary === option.value ? "#FFFFFF" : theme.text,
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>
              Work System
            </Text>
            <View style={styles.jobTypeContainer}>
              {[
                { value: "wfo", label: "Work From Office" },
                { value: "wfh", label: "Work From Home" },
                { value: "hybrid", label: "Hybrid" },
              ].map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.jobTypeButton,
                    {
                      backgroundColor:
                        system === option.value ? theme.accent : theme.card,
                      borderColor:
                        system === option.value ? theme.accent : theme.border,
                    },
                  ]}
                  onPress={() =>
                    setSystem(option.value as "wfo" | "wfh" | "hybrid")
                  }
                >
                  <Text
                    style={[
                      styles.jobTypeText,
                      {
                        color: system === option.value ? "#FFFFFF" : theme.text,
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              { backgroundColor: theme.accent },
              isSubmitting && { opacity: 0.7 },
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Publish Job</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.draftButton, { borderColor: theme.accent }]}
            onPress={handleSaveDraft}
            disabled={isSubmitting}
          >
            <Text style={[styles.draftButtonText, { color: theme.accent }]}>
              Save as Draft
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ModalPicker
        title={"Select Job Level"}
        data={levels}
        onClose={() => setShowLevelPicker(false)}
        onSelect={(value) => {
          setLevelId(value);
          setShowLevelPicker(false);
        }}
        theme={theme}
        styles={styles}
        visible={showLevelPicker}
        selectedValue={levelId}
      />
      <ModalPicker
        title={"Select Category job"}
        data={categories as { id: number; name: string }[]}
        onClose={() => setShowCategoryPicker(false)}
        onSelect={(value) => {
          setCategoryId(value);
          setShowCategoryPicker(false);
        }}
        theme={theme}
        styles={styles}
        visible={showCategoryPicker}
        selectedValue={categoryId}
      />
    </View>
  );
};

const ModalPicker = ({
  visible,
  onClose,
  onSelect,
  data,
  theme,
  styles,
  selectedValue,
  title,
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (value: number) => void;
  data: { id: number; name: string }[];
  theme: { card: string; text: string };
  styles: any;
  selectedValue: number;
  title: string;
}) => {
  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={[styles.pickerContainer, { backgroundColor: theme.card }]}>
          <View style={styles.pickerHeader}>
            <Text style={[styles.pickerTitle, { color: theme.text }]}>
              {title}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>
          <Picker
            selectedValue={selectedValue}
            onValueChange={(itemValue) => onSelect(itemValue)}
            style={{ color: theme.text }}
          >
            {data.map((item) => (
              <Picker.Item key={item.id} label={item.name} value={item.id} />
            ))}
          </Picker>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 5,
  },
  formSection: {
    marginBottom: 24,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  textArea: {
    minHeight: 120,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  helperText: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    marginTop: 4,
  },
  jobTypeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  jobTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  jobTypeText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  switchInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  switchText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    marginLeft: 12,
  },
  actionButtons: {
    marginVertical: 24,
    flex: 1,
  },
  submitButton: {
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    width: "90%",
    alignSelf: "center",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
  draftButton: {
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    width: "90%",
    alignSelf: "center",
  },
  draftButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  pickerContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  pickerTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Medium",
  },
});

export default withAuth(CreateJobScreen);
