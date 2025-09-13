import { StyleSheet, Image, ScrollView, Button } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { clearAllStorage } from '@/scripts/db';

export default function ProfileScreen() {
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await import('@/scripts/db').then(module =>
            module.getFromStorage('user')
        );
        if (!user) {
          router.replace('/login'); // redirect immediately if no user
          return;
        }
        setUserData(user);
      } catch (error) {
        console.error('Error fetching user data:', error);
        router.replace('/login'); // fallback
      }
    };

    fetchUserData();
  }, []);

  if (!userData) {
    return (
        <View style={styles.container}>
          <Text>Loading profile...</Text>
        </View>
    );
  }

  const user = userData.user;
  const base64Image = user.image?.base64String
      ? `data:image/jpeg;base64,${user.image.base64String}`
      : null;

  const handleLogout = async () => {
    try {
      await clearAllStorage();
      router.replace('/login'); // redirect after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>
          {user.firstName} {user.lastName}
        </Text>

        {base64Image && (
            <Image
                source={{ uri: base64Image }}
                style={styles.profileImage}
                resizeMode="cover"
            />
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.label}>
            Username: <Text style={styles.value}>{user.username}</Text>
          </Text>
          <Text style={styles.label}>
            Email: <Text style={styles.value}>{user.email}</Text>
          </Text>
          <Text style={styles.label}>
            Age: <Text style={styles.value}>{user.age}</Text>
          </Text>
          <Text style={styles.label}>
            Gender: <Text style={styles.value}>{user.gender}</Text>
          </Text>
          <Text style={styles.label}>
            Institution: <Text style={styles.value}>{user.institution}</Text>
          </Text>
          <Text style={styles.label}>Bio:</Text>
          <Text style={styles.value}>{user.bio}</Text>
        </View>

        <View style={styles.logoutButton}>
          <Button title="Logout" onPress={handleLogout} color="red" />
        </View>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginVertical: 15,
  },
  infoContainer: {
    width: '100%',
    marginTop: 20,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
    fontSize: 16,
  },
  value: {
    fontWeight: 'normal',
    fontSize: 16,
  },
  logoutButton: {
    marginTop: 30,
    width: '100%',
  },
});
