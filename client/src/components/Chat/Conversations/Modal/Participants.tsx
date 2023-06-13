import { SearchedUser } from "@/util/types";
import { Flex, Stack, Text } from "@chakra-ui/layout";
import * as React from "react";
import { TiDeleteOutline } from "react-icons/ti";

interface ParticipantsProps {
  removeParticipant: (id: string) => void;
  participants: Array<SearchedUser>;
}

const Participants: React.FunctionComponent<ParticipantsProps> = ({
  removeParticipant,
  participants,
}) => {
  return (
    <Flex mt={8} gap="10" flexWrap="wrap">
      {participants.map((participant: SearchedUser) => (
        <Stack
          key={participant.id}
          direction="row"
          align="center"
          bg="whiteAlpha.200"
          borderRadius={4}
          p={2}
        >
          <TiDeleteOutline
            size={20}
            cursor="pointer"
            onClick={() => removeParticipant(participant.id)}
          />
          <Text>{participant.username}</Text>
        </Stack>
      ))}
    </Flex>
  );
};

export default Participants;
