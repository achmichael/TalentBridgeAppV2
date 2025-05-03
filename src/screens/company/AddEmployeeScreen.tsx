import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence,
  runOnJS
} from 'react-native-reanimated';
import withAuth from '@/src/hoc/withAuth';
import { useTheme } from '@/src/contexts/ThemeContext';

const positions = [
  'Software Developer',
  'UI/UX Designer',
  'Project Manager',
  'QA Engineer',
  'DevOps Engineer',
  'Data Analyst',
  'Marketing Specialist',
  'HR Manager',
  'Customer Support',
  'Sales Representative'
];

const statusOptions = ['aktif', 'tidak aktif', 'cuti', 'resign'];

const AddEmployee = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();

  const addEmployee = async (employee: object) => { 

  }
  
  // Form state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [position, setPosition] = useState('');
  const [status, setStatus] = useState('aktif');
  const [showPositionDropdown, setShowPositionDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  
  // Animation values
  const formOpacity = useSharedValue(0);
  const formTranslateY = useSharedValue(50);
  const buttonScale = useSharedValue(1);
  
  // Initialize animations
  React.useEffect(() => {
    formOpacity.value = withTiming(1, { duration: 600 });
    formTranslateY.value = withTiming(0, { duration: 600 });
  }, []);
  
  const formAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: formOpacity.value,
      transform: [{ translateY: formTranslateY.value }],
    };
  });
  
  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });
  
  const handleAddEmployee = () => {
    if (!username || !email || !password || !position) {
      Alert.alert('Error', 'Please fill all required fields');
      
      formTranslateY.value = withSequence(
        withTiming(-10, { duration: 100 }),
        withTiming(10, { duration: 100 }),
        withTiming(-10, { duration: 100 }),
        withTiming(0, { duration: 100 })
      );
      
      return;
    }
    
    // Animation for button press
    buttonScale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withTiming(1.1, { duration: 100 }),
      withTiming(1, { duration: 100 }, () => {
        runOnJS(submitForm)();
      })
    );
  };
  
  const submitForm = () => {
    // Create new employee object
    const newEmployee = {
      id: Math.floor(Math.random() * 1000000),
      company_id: 'company-uuid-placeholder', // This would come from props or context in a real app
      employee_id: `user-${Math.floor(Math.random() * 1000000)}`, // This would be the user's ID in a real app
      username,
      email,
      password, // Note: In a real app, you'd never store plain text passwords
      position,
      status,
      employed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    // Add employee to context
    addEmployee(newEmployee);
    
    // Show success message
    Alert.alert(
      'Success',
      'Employee added successfully!',
      [
        { 
          text: 'OK', 
          onPress: () => navigation.goBack() 
        }
      ]
    );
  };


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add New Employee</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.formContainer, formAnimatedStyle]}>
            <Text style={styles.sectionTitle}>User Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter username"
                  value={username}
                  onChangeText={setUsername}
                />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter email address"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Create password"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
            </View>
            
            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Employment Details</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Position</Text>
              <TouchableOpacity 
                style={styles.dropdownContainer}
                onPress={() => setShowPositionDropdown(!showPositionDropdown)}
              >
                <Ionicons name="briefcase-outline" size={20} color="#666" style={styles.inputIcon} />
                <Text style={position ? styles.dropdownText : styles.dropdownPlaceholder}>
                  {position || "Select position"}
                </Text>
                <Ionicons 
                  name={showPositionDropdown ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
              
              {showPositionDropdown && (
                <View style={styles.dropdownList}>
                  <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled>
                    {positions.map((pos) => (
                      <TouchableOpacity
                        key={pos}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setPosition(pos);
                          setShowPositionDropdown(false);
                        }}
                      >
                        <Text style={[
                          styles.dropdownItemText,
                          position === pos && styles.selectedDropdownItem
                        ]}>
                          {pos}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Status</Text>
              <TouchableOpacity 
                style={styles.dropdownContainer}
                onPress={() => setShowStatusDropdown(!showStatusDropdown)}
              >
                <Ionicons name="stats-chart-outline" size={20} color="#666" style={styles.inputIcon} />
                <Text style={styles.dropdownText}>
                  {status}
                </Text>
                <Ionicons 
                  name={showStatusDropdown ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
              
              {showStatusDropdown && (
                <View style={styles.dropdownList}>
                  {statusOptions.map((statusOption) => (
                    <TouchableOpacity
                      key={statusOption}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setStatus(statusOption);
                        setShowStatusDropdown(false);
                      }}
                    >
                      <Text style={[
                        styles.dropdownItemText,
                        status === statusOption && { fontWeight: 'bold', color: theme.accent }
                      ]}>
                        {statusOption}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            
            <Animated.View style={[styles.buttonContainer, buttonAnimatedStyle]}>
              <TouchableOpacity 
                style={[styles.addButton, { backgroundColor: theme.accent }]}
                onPress={handleAddEmployee}
              >
                <Text style={styles.addButtonText}>Add Employee</Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 15,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 15,
    height: 50,
  },
  dropdownText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  dropdownPlaceholder: {
    flex: 1,
    fontSize: 16,
    color: '#999',
  },
  dropdownList: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  selectedDropdownItem: {
    color: '#4c669f',
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 30,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#4c669f',
    borderRadius: 10,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4c669f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default withAuth(AddEmployee);
