import { StyleSheet, ScrollView, Image, View as RNView, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { getAllMatchesByUserId, getUserById, getLikesByLiked } from '@/scripts/userapi';
import { getFromStorage } from '@/scripts/db';

interface MatchData {
  id: number;
  name: string;
  img: string;
  otherUserId: number;
}

export default function MatchesScreen() {
  const [userId, setUserId] = useState<number | null>(null);
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [likedByUsers, setLikedByUsers] = useState<MatchData[]>([]);
  const router = useRouter();

  // Fetch data
const fetchUserData = useCallback(async () => {
  try {
    const user = await getFromStorage('user');
    if (!user) {
      router.replace('/login');
      return;
    }

    const rawData: any = user;
    const id = rawData.user.userId;
    setUserId(id);

    // Fetch matches
    const matchData = await getAllMatchesByUserId(id);
    if (matchData) {
      const displayData: MatchData[] = await Promise.all(
        matchData.map(async (match: any) => {
          // Determine the other user in the match
          const otherUserId = match.user1Id === id ? match.user2Id : match.user1Id;
          if (!otherUserId) return null;

          const userData = await getUserById(otherUserId);
          if (!userData) return null;

          return {
            id: match.matchId,
            name: `${userData.firstName} ${userData.lastName}`,
            otherUserId: otherUserId,
            img: userData.imageBase64,
          };
        })
      );
      setMatches(displayData.filter(Boolean) as MatchData[]);
    }

    // Fetch users who liked logged-in user
    const likesData = await getLikesByLiked(id);
    if (likesData) {
      const likedDisplay = await Promise.all(
        likesData.map(async (like: any) => {
          const userData = await getUserById(like.likerId);
          if (!userData) return null;
          return {
            id: like.likeId,
            name: `${userData.firstName} ${userData.lastName}`,
            otherUserId: like.likerId,
            img: userData.imageBase64,
          };
        })
      );

      setLikedByUsers(likedDisplay.filter((item): item is MatchData => item !== null));
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    router.replace('/login');
  }
}, [router]);


  // Polling effect
  useEffect(() => {
    if (!userId) {
      fetchUserData();
      return;
    }

    const interval = setInterval(fetchUserData, 5000); // fetch every 5 seconds
    return () => clearInterval(interval); 
  }, [userId, fetchUserData]);

  // Render horizontal cards
  const renderCards = (data: MatchData[]) => (
    <ScrollView horizontal showsHorizontalScrollIndicator style={styles.scrollView}>
      {data.map(item => (
        <Pressable
          key={item.id}
          style={styles.card}
          onPress={() => router.push({ pathname: '/userprofile', params: { userId: item.otherUserId } })}
        >
          {item.img ? (
            <Image source={{ uri: `data:image/jpeg;base64,${item.img}` }} style={styles.image} />
          ) : (
            <RNView style={[styles.image, styles.placeholder]} />
          )}
          <Text style={styles.name}>{item.name}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );

  const renderLikeCards = (data: MatchData[]) => (
    <ScrollView horizontal showsHorizontalScrollIndicator style={styles.scrollView}>
      {data.map(item => (
        <Pressable key={item.id} style={styles.card}>
          {item.img ? (
            <Image source={{ uri: `data:image/jpeg;base64,${item.img}` }} style={styles.image} />
          ) : (
            <RNView style={[styles.image, styles.placeholder]} />
          )}
          <Text style={styles.name}>{item.name}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Matches</Text>
      {matches.length > 0 ? renderCards(matches) : (
        <Text style={styles.emptyMessage}>You have no matches yet.</Text>
      )}

      <Text style={[styles.title, { marginTop: 30 }]}>People Who Liked You</Text>
      {likedByUsers.length > 0 ? renderLikeCards(likedByUsers) : (
        <Text style={styles.emptyMessage}>No one has liked you yet.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  scrollView: {
    flexGrow: 0,
  },
  card: {
    width: 150,
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
  },
  placeholder: {
    backgroundColor: '#ddd',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
  emptyMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
  },
});
