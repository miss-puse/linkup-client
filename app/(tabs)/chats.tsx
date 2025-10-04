import { StyleSheet, ScrollView, Pressable, Image, ActivityIndicator } from 'react-native';
import { Text, View } from '@/components/Themed';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { getChatsForUser, getMatchById, getUser } from '@/scripts/userapi';
import { ChatDTO, Message } from '@/scripts/userapi';
import moment from 'moment';

interface MatchInfo {
  matchId: number;
  firstName: string;
  lastName: string;
  image: string | null;
}

export default function ChatsScreen() {
  const [userId, setUserId] = useState<number | null>(null);
  const [chats, setChats] = useState<ChatDTO[]>([]);
  const [matches, setMatches] = useState<Record<number, MatchInfo>>({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchMatchInfo = async (matchId: number, currentUserId: number) => {
    try {
      const match = await getMatchById(matchId);
      if (!match) return null;

      // figure out the other user
      const otherUserId = match.user1Id === currentUserId ? match.user2Id : match.user1Id;
      const user = await getUser(otherUserId);

      return {
        matchId,
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        image: user?.imageBase64 || null,
      };
    } catch (err) {
      console.error('Error fetching match data:', err);
      return null;
    }
  };

  const fetchData = async () => {
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

      const chatsData = await getChatsForUser(id);
      if (chatsData) {
        setChats(chatsData);

        const matchPromises = chatsData.map(chat => fetchMatchInfo(chat.matchId, id));
        const matchResults = await Promise.all(matchPromises);
        const matchMap: Record<number, MatchInfo> = {};
        matchResults.forEach(m => {
          if (m) matchMap[m.matchId] = m;
        });
        setMatches(matchMap);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const renderLastMessage = (messages: Message[]) => {
    if (!messages || messages.length === 0) return 'No messages yet';
    return messages[messages.length - 1].content;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff4d6d" />
        <Text style={styles.loadingText}>Loading chats...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {chats.map(chat => {
          const matchInfo = matches[chat.matchId];

          return (
            <Pressable
              key={chat.chatId}
              style={styles.cardContent}
              onPress={() =>
                router.push({
                  pathname: '/chatscreen',
                  params: {
                    chatId: chat.chatId.toString(),
                    matchId: chat.matchId.toString(),
                    firstName: matchInfo?.firstName || '',
                    lastName: matchInfo?.lastName || '',
                    image: matchInfo?.image || '',
                  },
                })
              }
            >
              <View style={styles.cardContent}>
                {matchInfo?.image ? (
                  <Image
                    source={{ uri: `data:image/jpeg;base64,${matchInfo.image}` }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={[styles.avatar, styles.placeholder]} />
                )}

                <View style={styles.textContainer}>
                  <Text style={styles.matchText}>
                    {matchInfo ? `${matchInfo.firstName} ${matchInfo.lastName}` : 'Loading...'}
                  </Text>
                  <View style={styles.messageRow}>
                    <Text style={styles.lastMessage}>{renderLastMessage(chat.messages)}</Text>
                    <Text style={styles.timestamp}>
                      {chat.messages.length > 0
                        ? moment(chat.messages[chat.messages.length - 1].sentAt).format('HH:mm')
                        : ''}
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>
          );
        })}
        {chats.length === 0 && (
          <Text style={styles.emptyMessage}>No chats available</Text>
        )}
      </ScrollView>
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
  scrollContainer: {
    paddingHorizontal: 3,
    paddingBottom: 20,
  },
  cardContent: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    backgroundColor: '#fff'
  },
  placeholder: {
    backgroundColor: '#ddd',
  },
  matchText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000ff'
  },
  lastMessage: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
    backgroundColor: '#fff'
  },
  emptyMessage: {
    fontSize: 16,
    color: '#666',
    marginTop: 20,
    textAlign: 'center',
    backgroundColor: '#fff'
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    backgroundColor: '#fff'
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
});
