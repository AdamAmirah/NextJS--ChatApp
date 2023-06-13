import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import { Session } from "next-auth";
import ConversationModal from "./Modal/ConversationModal";
import { useState } from "react";
import ConversationItem from "./ConversationItem";
import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";
import conversationOperation from "../../../graphql/operations/conversation";
import toast from "react-hot-toast";
import { ConversationPopulated } from "@/util/types";

interface ConversationListProps {
  session: Session;
  conversations: Array<ConversationPopulated>;
  onViewConversation: (
    conversationId: string,
    hasSeenLatestMessage: boolean
  ) => void;
}

const ConversationList: React.FunctionComponent<ConversationListProps> = ({
  session,
  conversations,
  onViewConversation,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);
  const router = useRouter();
  const { conversationId } = router.query;

  const sortedConversations = [...conversations].sort(
    (a, b) => b.updatedAt.valueOf() - a.updatedAt.valueOf()
  );

  const [deleteConversation] = useMutation<
    { deleteConversation: boolean },
    { conversationId: string }
  >(conversationOperation.Mutations.deleteConversation);

  const onDeleteConversation = async (_conversationId: string) => {
    try {
      toast.promise(
        deleteConversation({
          variables: {
            conversationId: _conversationId,
          },
          update: () => {
            router.replace(
              typeof process.env.NEXT_PUBLIC_BASE_URL === "string"
                ? process.env.NEXT_PUBLIC_BASE_URL
                : ""
            );
          },
        }),
        {
          loading: "Deleting conversation",
          success: "Conversation deleted",
          error: "Failed to delete conversation",
        }
      );
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const primary = useColorModeValue("brand.50", "purple.100");
  const secondary = useColorModeValue("brand.100", "purple.50");
  const fontColor = useColorModeValue("purple.100", "brand.50");
  const borderColor = useColorModeValue("brand.50", "purple.50");

  return (
    <Box width="100%">
      <Box
        py={3}
        px={2}
        mb={4}
        bg={primary}
        borderRadius={20}
        cursor="pointer"
        onClick={onOpen}
      >
        <Text textAlign="center" color={fontColor} fontWeight={500}>
          Start a conversation
        </Text>
      </Box>
      <ConversationModal session={session} onClose={onClose} isOpen={isOpen} />
      {sortedConversations.length !== 0 ? (
        sortedConversations.map((conversation) => {
          const participant = conversation.participants.find(
            (p) => p.user.id === session.user.id
          );
          if (participant === undefined) {
            throw new TypeError("Participant is undefined");
          }
          return (
            <ConversationItem
              userId={session.user.id}
              image={session.user.image}
              key={conversation.id}
              conversation={conversation}
              isSelected={conversationId === conversation.id}
              onClick={() => {
                onViewConversation(
                  conversation.id,
                  participant.hasSeenLatestMessage
                );
              }}
              onDeleteConversation={onDeleteConversation}
              hasSeenLatestMessage={participant.hasSeenLatestMessage}
            />
          );
        })
      ) : (
        <></>
      )}
    </Box>
  );
};

export default ConversationList;
