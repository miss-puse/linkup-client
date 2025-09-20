import { StyleSheet, ScrollView, TouchableOpacity, Linking, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { getContactsByUser, EmergencyContactDTO, deleteContact} from '@/scripts/userapi';
import FontAwesome from '@expo/vector-icons/FontAwesome';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={22} style={{ marginHorizontal: 6 }} {...props} />;
}

export default function EmergencyContactsScreen() {
  const [userId, setUserId] = useState<number | null>(null);
  const [contacts, setContacts] = useState<EmergencyContactDTO[]>([]);
  const router = useRouter();

  const fetchContacts = async (id: number) => {
    try {
      const contactsResponse = await getContactsByUser(id);
      setContacts(contactsResponse || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const user = await import('@/scripts/db').then(module =>
          module.getFromStorage('user')
        );
        if (!user) {
          router.replace('/login');
          return;
        }
        const rawData: any = user;
        const id = rawData.user.userId;
        setUserId(id);

        if (id) {
          await fetchContacts(id);
          // refresh every 5 seconds
          const interval = setInterval(() => fetchContacts(id), 5000);
          return () => clearInterval(interval);
        }
      } catch (error) {
        console.error('Error initializing user data:', error);
      }
    };

    init();
  }, []);

  const handleDialNumber = (phoneNumber: string) => {
    const telUrl = `tel:${phoneNumber}`;
    Linking.openURL(telUrl).catch(err =>
      console.error('Failed to open dialer:', err)
    );
  };

const handleEdit = (contact: EmergencyContactDTO) => {
    router.push({pathname:"/updateemergencycontact", params:{
        contactId: contact.contactId,
        name: contact.name,
        phoneNumber: contact.phoneNumber,
    }});
};


  const handleDelete = async (contactId: number) => {
    try {
          await deleteContact(contactId);
          alert('Contact deleted successfully!');
          router.back();
        } catch (error) {
          console.error('Error deleting contact:', error);
          alert('Failed to delete contact. Please try again.');
        }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Emergency Contacts</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/createemergencycontact')}
        >
          <TabBarIcon name="plus" color="#9c24ffff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {contacts.length > 0 ? (
          contacts.map(contact => (
            <View key={contact.contactId} style={styles.contactCard}>
              <View style={styles.contactInfo}>
                <Text style={styles.name}>{contact.name}</Text>
                <Text style={styles.phone}>{contact.phoneNumber}</Text>
              </View>
              <View style={styles.actionsRow}>
                <TouchableOpacity onPress={() => handleDialNumber(contact.phoneNumber)}>
                  <TabBarIcon name="phone" color="#9c24ffff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleEdit(contact)}>
                  <TabBarIcon name="edit" color="#9c24ffff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(contact.contactId!)}>
                  <TabBarIcon name="trash" color="#9c24ffff" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noContacts}>No contacts found</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  addButton: {
    padding: 6,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  contactCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
  },
  contactInfo: {
    flex: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding:10,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  phone: {
    fontSize: 16,
    color: '#333',
  },
  noContacts: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
  },
});
