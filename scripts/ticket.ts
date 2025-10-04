import Constants from 'expo-constants';
import axios from 'axios';

const apiUrl = Constants.expoConfig?.extra?.API_URL;
const TICKET_URL = `${apiUrl}/tickets`;

export interface TicketRequest {
  user: { userId: number };
  issueType: string;
  description: string;
}

export interface TicketDTO {
  ticketId: number;
  userId: number;
  issueType: string;
  description: string;
  status: string | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string | null;
  resolvedBy?: number | null;
}

// Axios instance
const api = axios.create({
  baseURL: apiUrl,
  headers: { 'Content-Type': 'application/json' },
});

// Get all tickets
export async function getAllTickets(): Promise<TicketDTO[]> {
  const res = await api.get('/tickets');
  return res.data;
}

// Get ticket by ID
export async function getTicket(id: number): Promise<TicketDTO> {
  const res = await api.get(`/tickets/${id}`);
  return res.data;
}

// Get tickets by user ID
export async function getTicketsByUserId(userId: number): Promise<TicketDTO[]> {
  const res = await api.get(`/tickets/user/${userId}`);
  return res.data;
}

// Create a new ticket
export async function createTicket(ticket: TicketRequest): Promise<TicketDTO> {
  const res = await api.post('/tickets', ticket);
  return res.data;
}

// Patch (partial update)
export async function patchTicket(id: number, partialTicket: Partial<TicketDTO>): Promise<TicketDTO> {
  const res = await api.patch(`/tickets/${id}`, partialTicket);
  return res.data;
}

// Delete ticket
export async function deleteTicket(id: number): Promise<void> {
  await api.delete(`/tickets/${id}`);
}
