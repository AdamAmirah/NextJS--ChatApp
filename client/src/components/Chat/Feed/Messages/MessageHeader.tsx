import { useQuery } from "@apollo/client";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import ConversationOperations from "../../../../graphql/operations/conversation";
import { formatUsernames } from "../../../../util/functions";
import { ConversationData } from "@/util/types";

interface IMessageHeaderProps {
  userId: string;
  conversationId: string;
  image: string | undefined | null;
}

const MessageHeader: React.FunctionComponent<IMessageHeaderProps> = ({
  userId,
  conversationId,
  image,
}) => {
  const router = useRouter();
  const { data, loading } = useQuery<ConversationData>(
    ConversationOperations.Queries.conversations
  );

  const conversation = data?.conversations.find(
    (conversation: any) => conversation.id === conversationId
  ); //TODO fix the type
  const primary = useColorModeValue("brand.50", "purple.100");
  const secondary = useColorModeValue("brand.100", "purple.50");

  const fontColor = useColorModeValue("purple.100", "brand.50");
  const fontColorSub = useColorModeValue("blackAlpha.500", "whiteAlpha.700");

  const borderColor = useColorModeValue("brand.50", "purple.50");
  return (
    <Box
      m={5}
      borderRadius="2xl"
      borderColor="whiteAlpha.200"
      bg={secondary}
      boxShadow="2xl"
    >
      <Stack
        direction="row"
        align="center"
        spacing={6}
        py={5}
        px={{ base: 4, md: 0 }}
      >
        <Button
          display={{ md: "none" }}
          onClick={() =>
            router.replace("?conversationId", "/", {
              shallow: true,
            })
          }
        >
          Back
        </Button>
        {/* {loading && <SkeletonLoader count={1} height="30px" width="320px" />} */}
        {!conversation && !loading && <Text>Conversation Not Found</Text>}
        {conversation && (
          <Flex direction="row" justify="space-between" align="center" gap={10}>
            <Text fontWeight={600}>To :</Text>
            <Text fontWeight={600}>
              {formatUsernames(conversation.participants, userId)}
            </Text>
          </Flex>
        )}
      </Stack>
    </Box>
  );
};

export default MessageHeader;
