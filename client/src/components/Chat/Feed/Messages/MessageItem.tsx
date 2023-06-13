import * as React from "react";
import {
  Avatar,
  Box,
  Flex,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { formatRelative } from "date-fns";
import { enUS } from "date-fns/locale";
import { MessagePopulated } from "@/util/types";

interface IMessageItemProps {
  message: MessagePopulated;
  sentByMe: boolean;
  image: string | undefined | null;
}

const formatRelativeLocale = {
  lastWeek: "eeee 'at' p",
  yesterday: "'Yesterday at' p",
  today: "p",
  other: "MM/dd/yy",
};
const MessageItem: React.FunctionComponent<IMessageItemProps> = ({
  message,
  sentByMe,
  image,
}) => {
  const primary = useColorModeValue("brand.200", "brand.200");
  const secondary = useColorModeValue("brand.100", "purple.50");

  const fontColor = useColorModeValue("purple.100", "brand.50");
  const fontColorSub = useColorModeValue("blackAlpha.500", "whiteAlpha.700");

  const borderColor = useColorModeValue("brand.50", "purple.50");
  return (
    <Stack
      p={4}
      spacing={4}
      _hover={{ bg: "whiteAlpha.200" }}
      justify={sentByMe ? "flex-end" : "flex-start"}
      wordBreak="break-word"
    >
      <Stack spacing={1} width="100%">
        <Flex justify={sentByMe ? "flex-end" : "flex-start"}>
          <Stack
            direction="row"
            align="center"
            justify={sentByMe ? "flex-end" : "flex-start"}
            mr={4}
          >
            {!sentByMe && (
              <Avatar src={message.sender.image ? message.sender.image : ""} />
            )}
          </Stack>
          <Box
            bg={sentByMe ? "brand.200" : "purple.50"}
            px={3}
            py={1}
            borderRadius={12}
            maxWidth="65%"
          >
            <Text p={1} color={sentByMe ? "brand.50" : "whiteAlpha.700"}>
              {message.body}
            </Text>
            <Text
              fontSize={14}
              color={sentByMe ? "brand.50" : "whiteAlpha.700"}
              textAlign="right"
            >
              {formatRelative(message.createdAt, new Date(), {
                locale: {
                  ...enUS,
                  formatRelative: (token) =>
                    formatRelativeLocale[
                      token as keyof typeof formatRelativeLocale
                    ],
                },
              })}
            </Text>
          </Box>
        </Flex>
      </Stack>
    </Stack>
  );
};

export default MessageItem;
