import {
  MessagesVariables,
  MessagesData,
  MessageSentSubscriptionData,
} from "@/util/types";
import { Flex, Stack, SkeletonText, Text } from "@chakra-ui/react";

import { useEffect } from "react";
import MessageOperation from "../../../../graphql/operations/message";
import { useQuery } from "@apollo/client";
import toast from "react-hot-toast";
import SkeletonLoader from "@/components/common/SkeletonLoader";
import MessageItem from "./MessageItem";

interface IMessagesProps {
  userId: string;
  conversationId: string;
  image: string | undefined | null;
}

const Messages: React.FC<IMessagesProps> = ({
  userId,
  conversationId,
  image,
}) => {
  const { data, loading, error, subscribeToMore } = useQuery<
    MessagesData,
    MessagesVariables
  >(MessageOperation.Queries.messages, {
    variables: { conversationId },
    onError({ message }) {
      toast.error(message);
    },
    // onCompleted() {},  // we can use that later //TODO
  });

  useEffect(() => {
    let unsubscribe = subscribeToMore({
      document: MessageOperation.Subscriptions.messageSent,
      variables: { conversationId },
      updateQuery: (
        prev,
        { subscriptionData }: MessageSentSubscriptionData
      ) => {
        if (!subscriptionData.data) return prev;

        const newMessage = subscriptionData.data.messageSent;

        return Object.assign({}, prev, {
          messages:
            newMessage.sender.id === userId
              ? prev.messages
              : [newMessage, ...prev.messages],
        });
      },
    });
    return () => unsubscribe();
  }, [conversationId]);

  if (error) {
    return null;
  }
  return (
    <Flex direction="column" justify="flex-end" overflow="hidden">
      {loading && (
        <Stack spacing={4} px={4}>
          <SkeletonText mt="4" noOfLines={4} spacing="4" skeletonHeight="2" />
        </Stack>
      )}

      {data?.messages && (
        <Flex direction="column-reverse" overflowY="scroll" height="100%">
          {data.messages.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              sentByMe={message.sender.id === userId}
              image={image}
            ></MessageItem>
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default Messages;
