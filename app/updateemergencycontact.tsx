import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import React, { useEffect, useState } from 'react';
import { useRouter,useLocalSearchParams } from 'expo-router';
import { updateContact, EmergencyContactDTO, EmergencyContact } from '@/scripts/userapi';

export default function UpdateEmergencyContactsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ contactId?: string; name?: string; phoneNumber?: string }>();

  const [userData, setUserData] = useState<any>(null);
  const [userId, setUserId] = useState<number | null>(null);

  const [contactId, setContactId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    if (params.contactId) setContactId(Number(params.contactId));
    if (params.name) setName(params.name);
    if (params.phoneNumber) setPhoneNumber(params.phoneNumber);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await import('@/scripts/db').then(module =>
          module.getFromStorage('user')
        );

        if (!user) {
          router.replace('/login');
          return;
        }

        setUserData(user);

        const rawData: any = user;
        const id = rawData.user.userId;

        setUserId(id);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    if (!userId || !name.trim() || !phoneNumber.trim() || !contactId) {
      alert('Please enter both name and phone number.');
      return;
    }

    try {
      const updatedContact: EmergencyContact = {
        contactId,
        user: { userId },
        name,
        phoneNumber,
      };

      await updateContact(updatedContact);
      alert('Contact updated successfully!');
      router.back();
    } catch (error) {
      console.error('Error updating contact:', error);
      alert('Failed to update contact. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Update Emergency Contact</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Contact</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-start',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#9c27b0',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
