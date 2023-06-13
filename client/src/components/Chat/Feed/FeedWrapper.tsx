import { Flex } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import MessageHeader from "./Messages/MessageHeader";
import MessageInput from "./Messages/MessageInput";
import Messages from "./Messages/Messages";
import NoConversation from "./NoConversationSelected";
interface FeedWrapperProps {
  session: Session;
}

const FeedWrapper: React.FC<FeedWrapperProps> = ({ session }) => {
  const router = useRouter();
  const userId = session.user.id;
  const image = session.user.image;

  const { conversationId } = router.query;
  return (
    <Flex
      display={{ base: conversationId ? "flex" : "none", md: "flex" }}
      direction="column"
      width="100%"
    >
      {conversationId && typeof conversationId === "string" ? (
        <>
          <Flex
            justify="space-between"
            direction="column"
            overflow="hidden"
            flexGrow={1}
          >
            <MessageHeader
              userId={userId}
              image={image}
              conversationId={conversationId}
            />
            <Messages
              userId={userId}
              conversationId={conversationId}
              image={image}
            />
          </Flex>
          <MessageInput session={session} conversationId={conversationId} />
        </>
      ) : (
        <NoConversation />
      )}
    </Flex>
  );
};

export default FeedWrapper;
