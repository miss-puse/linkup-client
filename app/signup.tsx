import { Alert, Pressable, StyleSheet, TextInput, Switch } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { signupUser } from '@/scripts/userapi';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from "@react-native-picker/picker";
import { MultiSelect } from "react-native-element-dropdown";
import institutions from "@/data/institutions.json";
import orientations from "@/data/orientations.json";
import genders from "@/data/genders.json";
import interests from "@/data/interests.json";
import courses from "@/data/courses.json";

export default function SignupScreen() {
  const [step, setStep] = useState(1); 

  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');
  const [institution, setInstitution] = useState('');
  const [gender, setGender] = useState('MALE');
  const [course, setCourse] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [smoker, setSmoker] = useState(false);
  const [drinker, setDrinker] = useState(false);
  const [height, setHeight] = useState('');
  const [orientation, setOrientation] = useState('');

  const router = useRouter();

  const handleNext = () => {
    if (step < 2) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

const handleSignUp = async () => {
  // Collect missing fields
  const missingFields: string[] = [];

  if (!username.trim()) missingFields.push("Username");
  if (!firstName.trim()) missingFields.push("First Name");
  if (!lastName.trim()) missingFields.push("Last Name");
  if (!email.trim()) missingFields.push("Email");
  if (!password.trim()) missingFields.push("Password");
  if (!age.trim()) missingFields.push("Age");
  if (!bio.trim()) missingFields.push("Bio");
  if (!height.trim()) missingFields.push("Height");
  if (!institution) missingFields.push("Institution");
  if (!gender) missingFields.push("Gender");
  if (!course) missingFields.push("Course");
  if (!orientation) missingFields.push("Orientation");
  if (selectedInterests.length === 0) missingFields.push("Interest(s)");

  // Numeric validation
  const ageNum = parseInt(age, 10);
  const heightNum = parseFloat(height);
  if (!isNaN(ageNum) && ageNum <= 0) missingFields.push("Valid Age");
  if (!isNaN(heightNum) && heightNum <= 0) missingFields.push("Valid Height");

  // If anything is missing, alert the user
  if (missingFields.length > 0) {
    Alert.alert(
      "Validation Error",
      `Please fill in the following fields:\n- ${missingFields.join("\n- ")}`
    );
    return;
  }

  // All good, submit
  try {
    const user = {
      username,
      firstName,
      lastName,
      email,
      password,
      age: ageNum,
      bio,
      institution,
      gender,
      course,
      interests: selectedInterests,
      orientation,
      smoker,
      drinker,
      height: heightNum,
    };

    console.log('Signing up user:', user);

    const result = await signupUser(user);

    if (result) {
      Alert.alert('Account created successfully!');
      router.replace('/login');
    }
  } catch (error: any) {
    console.error('Signup error:', error);
    Alert.alert('Signup failed', error.message || 'Unknown error');
  }
};



  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <View style={styles.container}>

        {/* STEP 1: Basic User Info */}
        {step === 1 && (
          <View style={styles.stepContainer}>
            <TextInput style={styles.input} onChangeText={setUsername} value={username} placeholder="Username" />
            <TextInput style={styles.input} onChangeText={setFirstName} value={firstName} placeholder="First Name" />
            <TextInput style={styles.input} onChangeText={setLastName} value={lastName} placeholder="Last Name" />
            <TextInput style={styles.input} onChangeText={setEmail} value={email} placeholder="Email" keyboardType="email-address" />
            <TextInput style={styles.input} onChangeText={setPassword} value={password} placeholder="Password" secureTextEntry />
            <TextInput style={styles.input} onChangeText={setAge} value={age} placeholder="Age" keyboardType="numeric" />  
            <TextInput style={styles.input} onChangeText={setBio} value={bio} placeholder="Bio" multiline />
            <TextInput style={styles.input} onChangeText={setHeight} value={height} placeholder="Height (cm)" keyboardType="numeric" />
          </View>
        )}

        {/* STEP 2: Personal Details */}
        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text>Institution</Text>
            <Picker selectedValue={institution} onValueChange={setInstitution}>
              {institutions.map((item) => (
                <Picker.Item key={item.key} label={item.label} value={item.key} />
              ))}
            </Picker>

            <Text>Gender</Text>
            <Picker selectedValue={gender} onValueChange={setGender}>
              {genders.map((item) => (
                <Picker.Item key={item.key} label={item.label} value={item.key} />
              ))}
            </Picker>

            <Text>Course</Text>
            <Picker selectedValue={course} onValueChange={setCourse}>
              {courses.map((item) => (
                <Picker.Item key={item.key} label={item.label} value={item.key} />
              ))}
            </Picker>

            <Text>Interests</Text>
            <MultiSelect
              style={styles.dropdown}
              data={interests}
              labelField="label"
              valueField="key"
              placeholder="Select Interests"
              value={selectedInterests}
              onChange={setSelectedInterests}
              selectedStyle={styles.selectedItem}
            />
            
            <Text>Orientation</Text>
            <Picker selectedValue={orientation} onValueChange={setOrientation}>
              {orientations.map((item) => (
                <Picker.Item key={item.key} label={item.label} value={item.key} />
              ))}
            </Picker>

            <View style={styles.switchContainer}>
              <Text>Smoker:</Text>
              <Switch value={smoker} onValueChange={setSmoker} />
              <Text>Drinker:</Text>
              <Switch value={drinker} onValueChange={setDrinker} />
            </View>
          </View>
        )}

        {/* Navigation Buttons */}
        <View style={styles.navButtons}>
          {step > 1 && <Pressable style={styles.button} onPress={handleBack}><Text style={styles.buttonText}>Back</Text></Pressable>}
          {step < 2 && <Pressable style={styles.button} onPress={handleNext}><Text style={styles.buttonText}>Next</Text></Pressable>}
          {step === 2 && <Pressable style={styles.button} onPress={handleSignUp}><Text style={styles.buttonText}>Sign Up</Text></Pressable>}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  stepContainer: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    marginVertical: 10,
    borderWidth: 1.5,
    borderColor: '#6a0dad',
    paddingHorizontal: 12,
    borderRadius: 25,
    fontSize: 16,
    color: '#333',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  navButtons: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  button: {
    backgroundColor: '#6a0dad',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  selectedItem: {
    backgroundColor: "#6a0dad",
    color: '#fff',
    borderRadius: 8,
  },
});
