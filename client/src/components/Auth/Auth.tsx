import { useMutation } from "@apollo/client";
import {
  Box,
  Button,
  Center,
  Flex,
  Image,
  Input,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import { useState } from "react";
import UserOperations from "../../graphql/operations/user";
import { CreateUsernameVariables, CreateUsernameData } from "@/util/types";
import toast from "react-hot-toast";
import ToggleColorMode from "../common/ToggleColorMode";

interface IAuthProps {
  session: Session | null;
  reloadSession: () => void;
}
const Auth: React.FC<IAuthProps> = ({ session, reloadSession }) => {
  const [username, setUsername] = useState("");
  const [createUsername, { loading, error }] = useMutation<
    CreateUsernameData,
    CreateUsernameVariables
  >(UserOperations.Mutations.createUsername);

  const onSubmit = async () => {
    if (!username) return;
    try {
      const { data } = await createUsername({ variables: { username } });
      if (!data?.createUsername) {
        throw new Error();
      }

      if (data.createUsername.error) {
        const {
          createUsername: { error },
        } = data;
        throw Error(error);
      }

      toast.success("Username successfully created! ");
      /// reload session to get the new username
      reloadSession();
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const bg = useColorModeValue("brand.50", "purple.50");
  const bg2 = useColorModeValue("brand.100", "purple.100");
  const borderColor = useColorModeValue("brand.50", "purple.50");

  const color = useColorModeValue("purple.100", "brand.50");

  return (
    <Flex
      height="100vh"
      initial-scale={1}
      bg={bg}
      justify="center"
      align="center"
    >
      <Box
        border={`solid 1px ${bg}`}
        borderRadius={14}
        px={{ base: 4, md: 80 }}
        py={{ base: 10, md: 40 }}
        boxShadow="2xl"
        bg={bg2}
      >
        <ToggleColorMode />
        <Stack spacing={8}>
          {session ? (
            <>
              <Text
                color={color}
                fontFamily="heading"
                textAlign="center"
                fontSize="3xl"
              >
                Create a Username
              </Text>
              <Input
                placeholder="Enter a Username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                borderColor={borderColor}
              />
              <Button
                width="100%"
                color={borderColor}
                bg={color}
                onClick={onSubmit}
                isLoading={loading}
              >
                Save
              </Button>
            </>
          ) : (
            <>
              <Center>
                <Text color={color} fontFamily="heading" fontSize="4xl">
                  iMessages
                </Text>
              </Center>
              <Button
                onClick={() => signIn("google")}
                colorScheme="custom"
                color={bg}
                bg={color}
                leftIcon={<Image height="20px" src="/images/googlelogo.png" />}
              >
                Continue with Google
              </Button>
            </>
          )}
        </Stack>
      </Box>
    </Flex>
  );
};

export default Auth;
