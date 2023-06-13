import { gql } from "@apollo/client";
import { MessageFields } from "./message";

const conversationFields = `
  id
  updatedAt
  participants {
    user {
      id
      username
      image
    }
    hasSeenLatestMessage
  }
  latestMessage {
    ${MessageFields}
  }
`;
export default {
  Queries: {
    conversations: gql`
            query conversations{
                conversations {
                    ${conversationFields}                
                }
            }
        
        `,
  },
  Mutations: {
    createConversation: gql`
      mutation createConversation($participantIds: [String]!) {
        createConversation(participantIds: $participantIds) {
          conversationId
        }
      }
    `,

    markConversationAsRead: gql`
      mutation markConversationAsRead(
        $userId: String!
        $conversationId: String!
      ) {
        markConversationAsRead(userId: $userId, conversationId: $conversationId)
      }
    `,

    deleteConversation: gql`
      mutation deleteConversation($conversationId: String!) {
        deleteConversation(conversationId: $conversationId)
      }
    `,
  },

  Subscriptions: {
    conversationCreated: gql`
            subscription conversationCreated {
                conversationCreated {
                    ${conversationFields}
                }
            }
        `,

    conversationUpdated: gql`
            subscription conversationUpdated {
                conversationUpdated {
                  conversation {
                    ${conversationFields}
                  }
                }
            }
        `,

    conversationDeleted: gql`
      subscription conversationDeleted {
        conversationDeleted {
          id
        }
      }
    `,
  },
};
