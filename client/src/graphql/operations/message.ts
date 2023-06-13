import { gql } from "@apollo/client";

export const MessageFields = `
  id
  sender {
    id
    username
    image
  }
  body
  createdAt
`;

export default {
  Queries: {
    messages: gql`
            query messages($conversationId: String!) {
                messages (conversationId : $conversationId) {
                    ${MessageFields}                
                }
            }
        `,
  },
  Mutations: {
    sendMessage: gql`
      mutation sendMessage(
        $id: String!
        $conversationId: String!
        $senderId: String!
        $body: String!
      ) {
        sendMessage(
          id: $id
          conversationId: $conversationId
          senderId: $senderId
          body: $body
        )
      }
    `,
  },

  Subscriptions: {
    messageSent: gql`
            subscription messageSent($conversationId: String!) {
                messageSent(conversationId: $conversationId) {
                    ${MessageFields}
                }
            }
        `,
  },
};
