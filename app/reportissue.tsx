import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
  TouchableOpacity,
  Pressable,
  Text, View
} from "react-native";
import { useRouter } from "expo-router";
import { getTicketsByUserId, createTicket, TicketDTO, TicketRequest } from "@/scripts/ticket";
import { getFromStorage } from "@/scripts/db";
import issuetypes from "@/data/issuetypes.json";
import { Picker } from "@react-native-picker/picker";

export default function MyTicketsScreen() {
  const [userData, setUserData] = useState<any>(null);
  const [tickets, setTickets] = useState<TicketDTO[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [issueType, setIssueType] = useState("BUG_REPORT");
  const [description, setDescription] = useState("");

  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getFromStorage("user");

        if (!user) {
           router.replace("/login");
           return;
        }
        setUserData(user);

        const rawData: any = user;
        const id = rawData.user.userId;

      setUserId(id);

        const ticketResponse = await getTicketsByUserId(id);
        setTickets(ticketResponse || []);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Create new ticket
  const handleCreateTicket = async () => {
    if (!userId || !issueType.trim() || !description.trim()) {
      alert("Please fill all fields.");
      return;
    }

    const newTicket: TicketRequest = {
      user: { userId },
      issueType,
      description,
    };

    try {
      const created = await createTicket(newTicket);
      alert("Your ticket has been created successfully.");
      setTickets((prev) => [...prev, created]);
      setModalVisible(false);
      setIssueType("");
      setDescription("");
    } catch (error) {
      console.error("Error creating ticket:", error);
      alert("Failed to create ticket. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Tickets</Text>

      {/* Create Ticket Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ New Ticket</Text>
      </TouchableOpacity>

      {/* Ticket List */}
      <ScrollView contentContainerStyle={styles.scroll}>
        {tickets.length > 0 ? (
          tickets.map((ticket) => (
            <View key={ticket.ticketId} style={styles.ticketCard}>
              <Text style={styles.ticketType}>{ticket.issueType}</Text>
              <Text style={styles.ticketDesc}>{ticket.description}</Text>
              <Text style={styles.ticketStatus}>
                Status: {ticket.status ?? "PENDING"}
              </Text>
              <Text style={styles.ticketDate}>
                Created: {new Date(ticket.createdAt).toLocaleString()}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noTickets}>No tickets found.</Text>
        )}
      </ScrollView>

      {/* Create Ticket Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Create New Ticket</Text>

            <Picker selectedValue={issueType} onValueChange={setIssueType}>
               {issuetypes.map((item) => (
                            <Picker.Item key={item.key} label={item.label} value={item.key} />
              ))}
            </Picker>

            <TextInput
              placeholder="Description"
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleCreateTicket}
              >
                <Text style={styles.modalButtonText}>Submit</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#c85bdf",
    borderRadius: 10,
    padding: 10,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  scroll: {
    paddingBottom: 30,
  },
  ticketCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  ticketType: {
    fontWeight: "bold",
    fontSize: 16,
  },
  ticketDesc: {
    fontSize: 14,
    marginVertical: 4,
  },
  ticketStatus: {
    color: "#c85bdf",
    fontWeight: "500",
  },
  ticketDate: {
    color: "#555",
    fontSize: 12,
    marginTop: 4,
  },
  noTickets: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#666",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "85%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  textArea: {
    height: 80,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  submitButton: {
    backgroundColor: "#c85bdf",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
