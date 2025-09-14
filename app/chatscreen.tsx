import { StyleSheet, TextInput, FlatList, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { getMessagesForChat, sendMessage, MessageDTO, getMatchById, getUser } from '@/scripts/userapi';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChatScreen() {
  const { chatId } = useLocalSearchParams();
  const [messages, setMessages] = useState<MessageDTO[]>([]);
  const [input, setInput] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [headerName, setHeaderName] = useState<string>('Chat');

  const fetchMatchInfo = async (matchId: number) => {
    try {
      const match = await getMatchById(matchId);
      if (!match) return null;
      const user = await getUser(match.user2Id);

      return {
        matchId,
        firstName: match.user2FirstName,
        lastName: match.user2LastName,
        image: user?.imageBase64 || null,
      };
    } catch (err) {
      console.error('Error fetching match data:', err);
      return null;
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const user = await import('@/scripts/db').then(m => m.getFromStorage('user'));
      if (user) {
        const rawData: any = user;
        setUserId(rawData.user.userId);
      }
    };
    fetchUser();
  }, []);

 useEffect(() => {
  if (!chatId) return;

  const fetchMessages = async () => {
    try {
      const data = await getMessagesForChat(Number(chatId));
      setMessages(data);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  fetchMessages();

  const interval = setInterval(fetchMessages, 3000);

  return () => clearInterval(interval); 
}, [chatId]);


  // --- New: fetch header info ---
  useEffect(() => {
    const loadHeader = async () => {
      if (!chatId) return;
      const matchInfo = await fetchMatchInfo(Number(chatId));
      if (matchInfo) {
        setHeaderName(`${matchInfo.firstName} ${matchInfo.lastName}`);
      }
    };
    loadHeader();
  }, [chatId]);

  const handleSendMessage = async () => {
    if (input.trim().length === 0 || !chatId || !userId) return;

    try {
      const newMessage = await sendMessage(Number(chatId), userId, input);
      setMessages(prev => [...prev, newMessage]);
      setInput('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const renderMessage = ({ item }: { item: MessageDTO }) => (
    <View
      style={[
        styles.messageBubble,
        item.senderId === userId ? styles.myMessage : styles.theirMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.content}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>{headerName}</Text>
        </View>

        {/* Messages */}
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.messageId.toString()}
          contentContainerStyle={styles.chatContainer}
        />

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Enter your message..."
          />
          <Pressable onPress={handleSendMessage} style={styles.sendButton}>
            <Ionicons name="send" size={20} color="#fff" />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#a020f0',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 10 },

  chatContainer: { padding: 10 },

  messageBubble: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 15,
    marginVertical: 5,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#a020f0',
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e1bee7',
  },
  messageText: { color: '#000' },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sendButton: {
    backgroundColor: '#a020f0',
    padding: 10,
    borderRadius: 20,
    marginLeft: 8,
  },
});
