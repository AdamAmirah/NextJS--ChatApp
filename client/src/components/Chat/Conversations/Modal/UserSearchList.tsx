import { SearchedUser } from "@/util/types";
import {
  Avatar,
  Button,
  Flex,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

interface UserSearchListProps {
  users: Array<SearchedUser>;
  addParticipant: (user: SearchedUser) => void;
}

const UserSearchList: React.FC<UserSearchListProps> = ({
  users,
  addParticipant,
}) => {
  const primary = useColorModeValue("purple.100", "brand.50");
  return (
    <>
      {users.length === 0 ? (
        <Flex mt={6} justify="center">
          <Text>No users found</Text>
        </Flex>
      ) : (
        <Stack mt={6}>
          {users.map((user) => (
            <Stack
              key={user.id}
              direction="row"
              align="center"
              spacing={4}
              py={4}
              px={2}
              borderRadius={4}
              _hover={{ bg: "whiteAlpha.50" }}
            >
              <Avatar />
              <Flex justify="space-between" align="center" width="100%">
                <Text color={primary}>{user.username}</Text>
                <Button
                  bg="brand.200"
                  color="whiteAlpha.900"
                  _hover={{ bg: "blue.600" }}
                  onClick={() => addParticipant(user)}
                >
                  Select
                </Button>
              </Flex>
            </Stack>
          ))}
        </Stack>
      )}
    </>
  );
};

export default UserSearchList;
