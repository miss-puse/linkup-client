import { StyleSheet, TextInput, FlatList, Pressable, View, KeyboardAvoidingView, Platform, ActivityIndicator, Modal } from 'react-native';
import { Text } from '@/components/Themed';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { getMessagesForChat, sendMessage, MessageDTO, getMatchById, getUser } from '@/scripts/userapi';
import { getFromStorage } from '@/scripts/db';
import { createTicket, TicketRequest } from '@/scripts/ticket';
import { SafeAreaView } from 'react-native-safe-area-context';
import moment from 'moment';

export default function ChatScreen() {
  const { chatId } = useLocalSearchParams();
  const [messages, setMessages] = useState<MessageDTO[]>([]);
  const [input, setInput] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [chatPartner, setChatPartner] = useState<string>('Chat');
  const [loading, setLoading] = useState(true);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [chatPartnerId, setChatPartnerId] = useState<number | null>(null);
  const [reason, setReason] = useState('');

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

  // Fetch chat partner’s name
  useEffect(() => {
    const fetchPartner = async () => {
      if (!chatId) return;
      try {
        const match = await getMatchById(Number(chatId));
        if (!match) return;
        const otherUserId = userId === match.user1Id ? match.user2Id : match.user1Id;
        const otherUser = await getUser(otherUserId);
        if (otherUser) {
          setChatPartner(`${otherUser.firstName} ${otherUser.lastName}`);
          setChatPartnerId(otherUserId);
        }
      } catch (err) {
        console.error('Failed to fetch chat partner:', err);
      }
    };
    fetchPartner();
  }, [chatId, userId]);

  // Fetch messages
  useEffect(() => {
    if (!chatId) return;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const data = await getMessagesForChat(Number(chatId));
        setMessages(data);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
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

  const handleReportUser = async () => {
    if (!userId || !chatId) return;
    try {
      // Create REPORT_USER ticket
      const ticket: TicketRequest = {
        user: { userId },
        issueType: 'REPORT_USER',
        description: `Reported user: ${chatPartner} (Chat ID: ${chatId}) with User ID: ${chatPartnerId} for reason: ${reason || 'No reason provided'}`,
      };
      await createTicket(ticket);
      alert('User reported successfully. A moderator will review the issue.' );
    } catch (err) {
      console.error('Failed to report user:', err);
      alert('Failed to report user. Please try again.');
    } finally {
      setReportModalVisible(false);
    }
  };

  const renderMessage = ({ item }: { item: MessageDTO }) => {
    const isMe = item.senderId === userId;
    const timestamp = moment(item.sentAt).format('HH:mm');

    return (
      <View style={{ marginVertical: 5 }}>
        <View style={[styles.messageBubble, isMe ? styles.myMessage : styles.theirMessage]}>
          <Text style={styles.messageText}>{item.content}</Text>
          <Text style={styles.messageTime}>{timestamp}</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#a020f0" />
        <Text style={{ marginTop: 10 }}>Loading chat...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={100}>
        <View style={styles.container}>
          {/* Header with Report User button */}
          <View style={styles.header}>
            <Text style={styles.headerText}>{chatPartner}</Text>
            <Pressable style={styles.reportButton} onPress={() => setReportModalVisible(true)}>
              <Text style={styles.reportButtonText}>Report</Text>
            </Pressable>
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

          {/* Report Confirmation Modal */}
          <Modal visible={reportModalVisible} transparent animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Confirm Report</Text>
                <Text style={styles.modalText}>Are you sure you want to report {chatPartner}?</Text>
                <TextInput style={{height: 40, borderColor: 'gray', borderWidth: 1,borderRadius:5, marginBottom: 10, paddingHorizontal: 8}} placeholder="Reason for reporting" value={reason} onChangeText={setReason} />
                <View style={styles.modalButtons}>
                  <Pressable style={[styles.modalButton, styles.cancelButton]} onPress={() => setReportModalVisible(false)}>
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </Pressable>
                  <Pressable style={[styles.modalButton, styles.submitButton]} onPress={handleReportUser}>
                    <Text style={styles.modalButtonText}>Report</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  chatContainer: { padding: 10 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#a020f0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  reportButton: {
    backgroundColor: '#ff3b30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  reportButtonText: { color: '#fff', fontWeight: 'bold' },

  messageBubble: {
    maxWidth: '70%',
    padding: 15,
    borderRadius: 15,
    marginVertical: 2,
  },
  messageTime: {
    fontSize: 10,
    color: '#ffffffcc',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#c05cff',
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ef94ff',
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

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#000', },
  modalText: { fontSize: 14, marginBottom: 15, color: '#000', },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  modalButton: { flex: 1, padding: 10, borderRadius: 8, alignItems: 'center', marginHorizontal: 5 },
  cancelButton: { backgroundColor: '#ccc' },
  submitButton: { backgroundColor: '#ff3b30' },
  modalButtonText: { color: '#fff', fontWeight: 'bold' },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
