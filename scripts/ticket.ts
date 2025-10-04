import Constants from 'expo-constants';
import {Alert} from "react-native";
import { Platform, Switch,Image} from 'react-native';

const apiUrl = Constants.expoConfig?.extra?.API_URL;
const TICKET_URL = apiUrl + "/tickets";

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

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with status ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// Get all tickets
export async function getAllTickets(): Promise<TicketDTO[]> {
  const res = await fetch(TICKET_URL);
  return handleResponse<TicketDTO[]>(res);
}

// Get ticket by ID
export async function getTicket(id: number): Promise<TicketDTO> {
  const res = await fetch(`${TICKET_URL}/${id}`);
  return handleResponse<TicketDTO>(res);
}

// Get tickets by user ID
export async function getTicketsByUserId(userId: number): Promise<TicketDTO[]> {
  const res = await fetch(`${TICKET_URL}/user/${userId}`);
  return handleResponse<TicketDTO[]>(res);
}

// Create a new ticket
export async function createTicket(ticket: TicketRequest): Promise<TicketDTO> {
  const res = await fetch(TICKET_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ticket),
  });
  return handleResponse<TicketDTO>(res);
}

// Patch (partial update)
export async function patchTicket(id: number, partialTicket: Partial<TicketDTO>): Promise<TicketDTO> {
  const res = await fetch(`${TICKET_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(partialTicket),
  });
  return handleResponse<TicketDTO>(res);
}

// Delete ticket
export async function deleteTicket(id: number): Promise<void> {
  const res = await fetch(`${TICKET_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Failed to delete ticket with ID ${id}`);
}
