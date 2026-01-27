// Response types
export interface ComteleResponse<T> {
  hasError: boolean;
  message: string | null;
  object: T;
  totalRecords: number;
  errors: Array<{ message: string }> | null;
}

// Balance
export interface BalanceObject {
  balance: number;
}

// Contact Groups
export interface ContactGroup {
  id: number;
  name: string;
  createdAt: string;
  validContacts: number;
}

// Routes
export interface Route {
  id: number;
  displayName: string;
  farePrice: number;
  productName: string;
  productId: number;
  replyFarePrice: number;
}

// Message Report
export interface MessageRequest {
  userId: number;
  content: string;
  createdAt: string;
  sentAt: string;
  requestCount: number;
  requestId: string;
  schedule: string;
  custom: string;
  tag: string;
  productId: number;
  product: string;
  routeId: number;
  route: string;
}

// Received Message
export interface ReceivedMessage {
  sender: string;
  content: string;
  receivedAt: string;
  messageId: string;
}

// Sent Message
export interface SentMessage {
  id: string;
  receiver: string;
  content: string;
  createdAt: string;
  sentAt: string;
  requestId: string;
  schedule: string;
  custom: string;
  tag: string;
  status: string;
  statusDetails: string;
  product: string;
  route: string;
}

// RCS Card Button
export interface RcsButton {
  url: string;
  text: string;
}

// RCS Card
export interface RcsCard {
  cardImage?: string;
  cardTitle?: string;
  cardMessage?: string;
  buttons?: RcsButton[];
}

// Send Message Response
export interface SendMessageResponse {
  hasError: boolean;
  message: string;
  object: unknown[];
  totalRecords: number;
  errors: unknown[];
}

// Cancel Request Response
export interface CancelRequestResponse {
  hasError: boolean;
  message: string;
  object: null;
  totalRecords: number;
  errors: unknown[];
}