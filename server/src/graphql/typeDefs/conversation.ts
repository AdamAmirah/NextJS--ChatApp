const ConversationTypeDefs = `#graphql
  scalar Date

  type Conversation {
    id : String
    latestMessage: Message
    participants: [Participant]
    createdAt: Date
    updatedAt: Date
  }
  type Query {
    conversations: [Conversation]
  }
  type Mutation {
    createConversation(participantIds : [String]) : CreateConversationResponse
    markConversationAsRead(userId : String!, conversationId : String!) : Boolean
    deleteConversation(conversationId : String!) : Boolean
  }

  type Subscription {
    conversationCreated : Conversation
    conversationUpdated: ConversationUpdatedSubscriptionPayload
    conversationDeleted: ConversationDeletedSubscriptionPayload
  }
  
  type Participant {
    id: String
    user: User
    hasSeenLatestMessage: Boolean
  }
  
  type CreateConversationResponse {
    conversationId: String
  }


  type ConversationUpdatedSubscriptionPayload {
    conversation: Conversation
  }
  
  type ConversationDeletedSubscriptionPayload {
    id: String
  }
`;

export default ConversationTypeDefs;
