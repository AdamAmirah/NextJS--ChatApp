/* USER TYPES */
export interface CreateUsernameVariables {
  username: string;
}
export interface CreateUsernameData {
  createUsername: {
    success: boolean;
    error: string;
  };
}
export interface SearchUsersVariables {
  username: string;
}

export interface SearchUsersData {
  searchUsers: Array<SearchedUser>;
}

export interface SearchedUser {
  id: string;
  username: string;
}

/* CONVERSATION TYPES */

export interface CreateConversationData {
  createConversation: {
    conversationId: string;
  };
}
export interface CreateConversationVariables {
  participantIds: Array<string>;
}

export interface User {
  id: string;
  image: string;
  username: string;
}
export interface ConversationParticipants {
  hasSeenLatestMessage: boolean;
  user: User;
}
export interface ConversationPopulated {
  id: string;
  latestMessage: MessagePopulated;
  participants: Array<ConversationParticipants>;
  updatedAt: Date;
}
export interface ConversationData {
  conversations: Array<ConversationPopulated>;
}

export interface ConversationCreatedSubscriptionData {
  subscriptionData: {
    data: {
      conversationCreated: ConversationPopulated;
    };
  };
}

export interface ConversationUpdatedSubscriptionData {
  conversationUpdated: {
    conversation: ConversationPopulated;
  };
}

export interface ConversationDeletedData {
  conversationDeleted: {
    id: string;
  };
}

/**
 * MESSAGES TYPES
 */

export interface MessagesVariables {
  conversationId: string;
}

export interface MessagesData {
  messages: Array<MessagePopulated>;
}

export interface SendMessageVariables {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
}

export interface MessageSentSubscriptionData {
  subscriptionData: {
    data: {
      messageSent: MessagePopulated;
    };
  };
}

export interface MessagePopulated {
  id: string;
  body: string;
  createdAt: Date;
  updatedAt?: Date;
  senderId?: string;
  conversationId?: string;
  sender: {
    id: string;
    image: string | undefined | null;
    username: string;
  };
}
