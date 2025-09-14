import { Alert, Button, Pressable, StyleSheet, TextInput, Platform, Switch,Image} from 'react-native';
import { Text, View } from '@/components/Themed';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { signupUser } from '@/scripts/userapi';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from "@react-native-picker/picker";
import { MultiSelect } from "react-native-element-dropdown";
import * as FileSystem from 'expo-file-system';
import institutions from "@/data/institutions.json";
import orientations from "@/data/orientations.json";
import genders from "@/data/genders.json";
import interests from "@/data/interests.json";
import courses from "@/data/courses.json";

export default function SignupScreen() {
  const [step, setStep] = useState(1); // Track step 1-3

  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');
  const [institution, setInstitution] = useState('');
  const [gender, setGender] = useState('');
  const [course, setCourse] = useState('');
const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [smoker, setSmoker] = useState(false);
  const [drinker, setDrinker] = useState(false);
  const [height, setHeight] = useState('');
  const [orientation, setOrientation] = useState('');

  const [imageFile, setImageFile] = useState<File | null>(null);
const [imageUri, setImageUri] = useState<string | null>(null);

  const router = useRouter();

const pickImage = async () => {
  if (Platform.OS !== 'web') {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Permission to access gallery is required!');
      return;
    }
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.7,
    base64: false,
  });

  if (!result.canceled && result.assets.length > 0) {
    const localUri = result.assets[0].uri;
    setImageUri(localUri); // use this for preview

    if (Platform.OS === 'web') {
      const filename = localUri.split('/').pop() || 'photo.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;
      const file = new File([await fetch(localUri).then(r => r.blob())], filename, { type });
      setImageFile(file); // only needed for web upload
    } else {
      setImageFile(null); // on mobile, you can handle upload differently
    }
  }
};



  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSignUp = async () => {
    try {
      const user = {
        username,
        firstName,
        lastName,
        email,
        password,
        age: parseInt(age, 10),
        bio,
        institution,
        gender,
        course,
        interests: selectedInterests,
        orientation: orientation,
        smoker,
        drinker,
        height: parseFloat(height),
      };

      const result = await signupUser(user, imageFile || undefined);

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
            <Picker selectedValue={institution} onValueChange={setOrientation}>
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

      {/* STEP 3: Image */}
      {step === 3 && (
  <View style={styles.stepContainer}>
    <Pressable  style={styles.button} onPress={pickImage}><Text style={styles.buttonText}>Pick Profile Image</Text></Pressable>
    {imageUri && (
      <Image
        source={{ uri: imageUri }}
        style={{ width: 150, height: 150, marginTop: 10,alignContent:'center',alignSelf:'center' }}
      />
    )}
  </View>
)}


      {/* Navigation Buttons */}
      <View style={styles.navButtons}>
        {step > 1 && <Pressable style={styles.button} onPress={handleBack}><Text style={styles.buttonText}>Back</Text></Pressable>}
        {step < 3 && <Pressable style={styles.button} onPress={handleNext}><Text style={styles.buttonText}>Next</Text></Pressable>}
        {step === 3 && <Pressable style={styles.button} onPress={handleSignUp}><Text style={styles.buttonText}>Sign Up</Text></Pressable>}
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#6a0dad',
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#6a0dad',
    borderRadius: 25,
    paddingHorizontal: 12,
    height: 50,
    marginVertical: 10,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  togglePassword: {
    padding: 5,
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
    backgroundColor: '#6a0dad', // purple button
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonText: {
    color: '#fff', // white text
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

