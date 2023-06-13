import { Box, Button, Flex, useColorModeValue } from "@chakra-ui/react";
import { Session } from "next-auth";
import ConversationList from "./ConversationList";
import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import conversationOperation from "../../../graphql/operations/conversation";
import {
  ConversationCreatedSubscriptionData,
  ConversationData,
  ConversationDeletedData,
  ConversationParticipants,
  ConversationUpdatedSubscriptionData,
} from "@/util/types";

import { useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import SkeletonLoader from "@/components/common/SkeletonLoader";
import { signOut } from "next-auth/react";
interface ConversationWrapperProps {
  session: Session;
}

const ConversationWrapper: React.FC<ConversationWrapperProps> = ({
  session,
}) => {
  const {
    user: { id: userId },
  } = session;

  // skeleton loader
  const {
    data: conversationsData,
    error: conversationsError,
    loading: conversationsLoading,
    subscribeToMore,
  } = useQuery<ConversationData>(conversationOperation.Queries.conversations, {
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  const router = useRouter();
  const { conversationId } = router.query;

  const [markConversationAsRead] = useMutation<
    { markConversationAsRead: boolean },
    { userId: string; conversationId: string }
  >(conversationOperation.Mutations.markConversationAsRead);

  // call useSubscription

  useSubscription<ConversationUpdatedSubscriptionData>(
    conversationOperation.Subscriptions.conversationUpdated,
    {
      onData: ({ client, data }) => {
        const { data: subscriptionData } = data;

        if (!subscriptionData) return;

        const {
          conversationUpdated: { conversation },
        } = subscriptionData;

        const currentlyViewingConversation = conversation.id === conversationId;

        if (currentlyViewingConversation) {
          onViewConversation(conversationId, false);
        }
      },
    }
  );

  useSubscription<ConversationDeletedData>(
    conversationOperation.Subscriptions.conversationDeleted,
    {
      onData: ({ client, data }) => {
        const { data: subscriptionData } = data;

        if (!subscriptionData) return;

        const existing = client.readQuery<ConversationData>({
          query: conversationOperation.Queries.conversations,
        });

        if (!existing) return;

        const { conversations } = existing;
        const {
          conversationDeleted: { id: deletedConversationId },
        } = subscriptionData;

        client.writeQuery<ConversationData>({
          query: conversationOperation.Queries.conversations,
          data: {
            conversations: conversations.filter(
              (conversation) => conversation.id !== deletedConversationId
            ),
          },
        });

        router.push("/");
      },
    }
  );

  const onViewConversation = async (
    _conversationId: string,
    hasSeenLatestMessage: boolean
  ) => {
    /**
     * push the query conversationId to the router
     */
    router.push({ query: { conversationId: _conversationId } });
    /**
     * mark conversation as read
     */

    if (hasSeenLatestMessage) return;

    try {
      await markConversationAsRead({
        variables: {
          userId,
          conversationId: _conversationId,
        },
        optimisticResponse: {
          markConversationAsRead: true,
        },
        update: (cache) => {
          const participantsFragment = cache.readFragment<{
            participants: Array<ConversationParticipants>;
          }>({
            id: `Conversation:${_conversationId}`,
            fragment: gql`
              fragment Participants on Conversation {
                participants {
                  user {
                    id
                    username
                  }
                  hasSeenLatestMessage
                }
              }
            `,
          });

          if (!participantsFragment) return;

          const participants = [...participantsFragment.participants];

          const userParticipantIdx = participants.findIndex(
            (p) => p.user.id === userId
          );

          if (userParticipantIdx === -1) return;

          const userParticipant = participants[userParticipantIdx];

          participants[userParticipantIdx] = {
            ...userParticipant,
            hasSeenLatestMessage: true,
          };

          /**
           * Update cache
           */
          cache.writeFragment({
            id: `Conversation:${_conversationId}`,
            fragment: gql`
              fragment UpdatedParticipants on Conversation {
                participants
              }
            `,
            data: {
              participants,
            },
          });
        },
      });
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const subscribeToNewConversations = () => {
    subscribeToMore({
      document: conversationOperation.Subscriptions.conversationCreated,
      updateQuery: (
        prev,
        { subscriptionData }: ConversationCreatedSubscriptionData
      ) => {
        if (!subscriptionData.data) return prev;

        const newConversation = subscriptionData.data.conversationCreated;
        return Object.assign({}, prev, {
          conversations: [newConversation, ...prev.conversations],
        });
      },
    });
  };

  useEffect(() => {
    subscribeToNewConversations();
  }, []);

  if (conversationsError) {
    toast.error("There was an error fetching conversations");
    return null;
  }
  const primary = useColorModeValue("brand.50", "purple.100");
  const secondary = useColorModeValue("brand.100", "purple.50");
  const fontColor = useColorModeValue("purple.100", "brand.50");
  const borderColor = useColorModeValue("brand.50", "purple.50");
  return (
    <Box
      borderRadius="3xl"
      display={{ base: conversationId ? "none" : "flex", md: "flex" }}
      width={{ base: "100%", md: "450px" }}
      py={6}
      px={3}
      mx={8}
      my={5}
      gap={5}
      bg={secondary}
      flexDirection="column"
      boxShadow="2xl"
    >
      {conversationsLoading ? (
        <SkeletonLoader count={10} height="50px" width="360"></SkeletonLoader>
      ) : (
        <ConversationList
          session={session}
          conversations={conversationsData?.conversations || []}
          onViewConversation={onViewConversation}
        />
      )}
      {/* 
      <Flex alignItems="end">
        <Button onClick={() => signOut()}>Logout</Button>
      </Flex> */}
    </Box>
  );
};

export default ConversationWrapper;
