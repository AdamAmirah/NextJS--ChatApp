import * as React from "react";
import {
  Box,
  Flex,
  Menu,
  MenuItem,
  MenuList,
  Stack,
  Text,
  Avatar,
  useColorModeValue,
} from "@chakra-ui/react";
import { formatRelative } from "date-fns";
import enUS from "date-fns/locale/en-US";

import { TbCircleDotFilled } from "react-icons/tb";
import { MdDeleteOutline } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { AiOutlineEdit } from "react-icons/ai";
import { formatUsernames } from "@/util/functions";
import { useState } from "react";
import { ConversationPopulated } from "@/util/types";

interface ConversationItemProps {
  userId: string;
  image: string | undefined | null;
  conversation: ConversationPopulated;
  onClick: () => void;
  isSelected: boolean;
  hasSeenLatestMessage: boolean | undefined;
  onDeleteConversation: (conversationId: string) => void;
  // onLeaveConversation?: (conversation: ConversationPopulated) => void;
  // onEditConversation?: () => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  userId,
  conversation,
  onClick,
  isSelected,
  hasSeenLatestMessage,
  image,
  // onEditConversation,
  onDeleteConversation,
  // onLeaveConversation,
}) => {
  const formatRelativeLocale = {
    lastWeek: "eeee",
    yesterday: "'Yesterday",
    today: "p",
    other: "MM/dd/yy",
  };
  const [menuOpen, setMenuOpen] = useState(false);

  const handleClick = (event: React.MouseEvent) => {
    if (event.type === "click") {
      onClick();
    } else if (event.type === "contextmenu") {
      event.preventDefault();
      setMenuOpen(true);
    }
  };

  const primary = useColorModeValue("brand.50", "purple.100");
  const secondary = useColorModeValue("brand.100", "purple.50");

  const fontColor = useColorModeValue("purple.100", "brand.50");
  const fontColorSub = useColorModeValue("blackAlpha.500", "whiteAlpha.700");

  const borderColor = useColorModeValue("whiteAlpha.900", "purple.100");

  const [senderImage, setSenderImage] = useState<string>("");
  const findSenderImage = () => {
    if (conversation.participants.length > 2) return;
    const sender = conversation.participants.find((p) => p.user.id != userId);
    if (!sender?.user.image) return;
    setSenderImage(sender.user.image);
  };
  React.useEffect(() => {
    findSenderImage();
  }, []);

  return (
    <Stack
      direction="row"
      align="center"
      justify="space-between"
      p={4}
      mb={5}
      cursor="pointer"
      borderRadius={14}
      boxShadow="xl"
      bg={isSelected ? `${primary}` : `${secondary}`}
      _hover={{ bg: `${primary}` }}
      onClick={handleClick}
      onContextMenu={handleClick}
      position="relative"
      width="100%"
    >
      {/* {showMenu && ( */}
      <Menu isOpen={menuOpen} onClose={() => setMenuOpen(false)}>
        <MenuList bg={borderColor}>
          <MenuItem
            icon={<MdDeleteOutline fontSize={20} />}
            onClick={(event) => {
              event.stopPropagation();
              onDeleteConversation(conversation.id);
            }}
            bg={borderColor}
            _hover={{ bg: "whiteAlpha.200" }}
          >
            Delete
          </MenuItem>
        </MenuList>
      </Menu>
      <Flex position="absolute" left="-6px">
        {hasSeenLatestMessage === false && (
          <TbCircleDotFilled fontSize={18} color="#6B46C1" />
        )}
      </Flex>
      <Avatar src={senderImage} />
      <Flex justify="space-between" width="80%" height="100%">
        <Flex direction="column" width="70%" height="100%">
          <Text
            fontWeight={600}
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
            color={fontColor}
          >
            {formatUsernames(conversation.participants, userId)}
          </Text>
          {conversation.latestMessage && (
            <Box width="140%" maxWidth="360px">
              <Text
                color={fontColorSub}
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                {conversation.latestMessage.body}
              </Text>
            </Box>
          )}
        </Flex>
        <Text
          color={fontColorSub}
          textAlign="right"
          position="absolute"
          right={4}
        >
          {formatRelative(new Date(conversation.updatedAt), new Date(), {
            locale: {
              ...enUS,
              formatRelative: (token) =>
                formatRelativeLocale[
                  token as keyof typeof formatRelativeLocale
                ],
            },
          })}
        </Text>
      </Flex>
    </Stack>
  );
};

export default ConversationItem;
