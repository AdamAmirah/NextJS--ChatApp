import { useMutation } from "@apollo/client";
import {
  Box,
  Button,
  Flex,
  Icon,
  Input,
  useColorModeValue,
} from "@chakra-ui/react";
import { Session } from "next-auth";
import { useState } from "react";
import { toast } from "react-hot-toast";
import MessageOperation from "../../../../graphql/operations/message";
import { MessagesData, SendMessageVariables } from "@/util/types";
import { ObjectId } from "bson";
import { ArrowUpIcon } from "@chakra-ui/icons";
interface IMessageInputProps {
  session: Session;
  conversationId: string;
}

const MessageInput: React.FC<IMessageInputProps> = ({
  session,
  conversationId,
}) => {
  const [messageBody, setMessageBody] = useState("");

  const [sendMessage] = useMutation<
    { sendMessage: boolean },
    SendMessageVariables
  >(MessageOperation.Mutations.sendMessage);

  const onSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      // call send message mutation
      const { id: senderId } = session.user;

      const messageId = new ObjectId().toString();
      const newMessage: SendMessageVariables = {
        id: messageId,
        senderId,
        conversationId,
        body: messageBody,
      };

      const { data, errors } = await sendMessage({
        variables: { ...newMessage },
        optimisticResponse: {
          sendMessage: true,
        },
        update: (cache) => {
          setMessageBody("");
          const existing = cache.readQuery<MessagesData>({
            query: MessageOperation.Queries.messages,
            variables: { conversationId },
          }) as MessagesData;

          cache.writeQuery<MessagesData, { conversationId: string }>({
            query: MessageOperation.Queries.messages,
            variables: { conversationId },
            data: {
              ...existing,
              messages: [
                {
                  id: messageId,
                  body: messageBody,
                  senderId: session.user.id,
                  conversationId,
                  sender: {
                    id: session.user.id,
                    username: session.user.username,
                    image: session?.user?.image,
                  },
                  createdAt: new Date(Date.now()),
                  updatedAt: new Date(Date.now()),
                },
                ...existing.messages,
              ],
            },
          });
        },
      });

      if (!data?.sendMessage || errors) {
        throw new Error("failed to send the message");
      }
    } catch (error: any) {
      toast.error(error);
    }
  };

  const primary = useColorModeValue("brand.50", "purple.100");
  const secondary = useColorModeValue("brand.100", "purple.50");

  const fontColor = useColorModeValue("purple.100", "brand.50");
  const fontColorSub = useColorModeValue("blackAlpha.200", "whiteAlpha.300");

  const borderColor = useColorModeValue("brand.50", "purple.50");
  return (
    <Box my={10} px={4} py={6} width="100%">
      <form onSubmit={onSendMessage}>
        <Flex direction="row" align="center" gap={5}>
          <Input
            value={messageBody}
            size="lg"
            placeholder="Message ..."
            _hover={{ bg: `${fontColorSub}` }}
            _focus={{
              boxShadow: "none",
              border: "1px solid",
              borderColor: `${secondary}`,
            }}
            border="2px solid"
            borderColor={fontColorSub}
            resize="none"
            onChange={(event) => setMessageBody(event.target.value)}
          />

          <Button p={0} m={0} type="submit" borderRadius={10}>
            <Icon
              _hover={{ bg: `${fontColorSub}` }}
              bg={primary}
              borderRadius={10}
              boxSize={10}
              as={ArrowUpIcon}
            />
          </Button>
        </Flex>
      </form>
    </Box>
  );
};

export default MessageInput;
