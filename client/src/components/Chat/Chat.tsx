import { Button, Flex, useColorModeValue } from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import ConversationWrapper from "./Conversations/ConversationWrapper";
import FeedWrapper from "./Feed/FeedWrapper";
import { Session } from "next-auth";
import ToggleColorMode from "../common/ToggleColorMode";
import { useEffect } from "react";
import { useRouter } from "next/router";

interface ChatProps {
  session: Session;
}

const Chat: React.FC<ChatProps> = ({ session }) => {
  const primary = useColorModeValue("brand.50", "purple.100");
  const router = useRouter();

  useEffect(() => {
    router.push("");
  }, []);
  return (
    <Flex height="100vh" bg={primary}>
      <ToggleColorMode />
      <ConversationWrapper session={session} />
      <FeedWrapper session={session} />
    </Flex>
  );
};

export default Chat;
