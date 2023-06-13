import { useLazyQuery, useMutation } from "@apollo/client";
import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Stack,
  Input,
  ButtonGroup,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import UserOperations from "../../../../graphql/operations/user";
import ConversationOperations from "../../../../graphql/operations/conversation";

import {
  CreateConversationData,
  CreateConversationVariables,
  SearchUsersData,
  SearchUsersVariables,
  SearchedUser,
} from "@/util/types";
import UserSearchList from "./UserSearchList";
import Participants from "./Participants";
import toast from "react-hot-toast";
import { Session } from "next-auth";
import { useRouter } from "next/router";

interface ConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session;
}

const ConversationModal: React.FC<ConversationModalProps> = ({
  isOpen,
  onClose,
  session,
}) => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [searchUsers, { loading, error, data }] = useLazyQuery<
    SearchUsersData,
    SearchUsersVariables
  >(UserOperations.Queries.searchUsers);
  const [participants, setParticipants] = useState<Array<SearchedUser>>([]);

  const [createConversation, { loading: createConversationLoading }] =
    useMutation<CreateConversationData, CreateConversationVariables>(
      ConversationOperations.Mutations.createConversation
    );

  const onCreateConversation = async () => {
    const participantIds = [session.user.id, ...participants.map((p) => p.id)];

    try {
      //create a conversation in the db
      const { data } = await createConversation({
        variables: { participantIds: participantIds },
      });
      if (!data?.createConversation) {
        throw new Error("Failed to create a conversation");
      }

      const {
        createConversation: { conversationId },
      } = data;
      router.push({ query: { conversationId } });

      /**
       * clear state and close modal
       * on successful creation
       */

      setParticipants([]);
      setUsername("");
      onClose();
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  const addParticipant = (user: SearchedUser) => {
    const userExists = participants.find((element) => element.id === user.id);
    if (!userExists) {
      setParticipants([...participants, user]);
      setUsername("");
    } else {
      toast.error("User is already added");
    }
  };

  const removeParticipant = (id: String) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  };

  const onSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    const usernameExists = data?.searchUsers.find(
      (p) => p.username === username
    );
    if (usernameExists) return;

    searchUsers({ variables: { username } });
  };

  const primary = useColorModeValue("brand.50", "purple.100");
  const secondary = useColorModeValue("brand.100", "purple.50");
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={primary} pb={4}>
          <ModalHeader>Create a Conversation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={onSearch}>
              <Stack>
                <Input
                  placeholder="Enter a username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
                <Button
                  bg="whiteAlpha.500"
                  type="submit"
                  disabled={!username}
                  isLoading={loading}
                >
                  Search
                </Button>
              </Stack>
            </form>
            {data?.searchUsers && (
              <UserSearchList
                users={data?.searchUsers}
                addParticipant={addParticipant}
              />
            )}
            {participants.length !== 0 && (
              <>
                <Participants
                  removeParticipant={removeParticipant}
                  participants={participants}
                />
                <Button
                  width="100%"
                  mt={6}
                  color="whiteAlpha.900"
                  bg="brand.200"
                  _hover={{ bg: "blue.600" }}
                  onClick={onCreateConversation}
                  isLoading={createConversationLoading}
                >
                  Create Conversation
                </Button>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConversationModal;
