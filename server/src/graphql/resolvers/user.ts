import { User } from "@prisma/client";
import { CreateUsernameResponse, GraphQLContext } from "../../util/types";
import { GraphQLError } from "graphql";

// even tho you are returning an array of user , only the fields specified in the frontend is returned
const userResolvers = {
  Query: {
    searchUsers: async (
      _: any,
      args: { username: string },
      context: GraphQLContext
    ): Promise<Array<User>> => {
      const { session, prisma } = context;
      const { username: searchedUsername } = args;
      if (!session?.user) {
        throw new GraphQLError("Not Authorized");
      }

      const {
        user: { username: myUsername },
      } = session;

      if (searchedUsername == myUsername) {
        throw new GraphQLError("This username belongs to you");
      }

      try {
        const searchedUsers = await prisma.user.findMany({
          where: {
            username: {
              contains: searchedUsername,
              not: myUsername,
              mode: "insensitive",
            },
          },
        });

        return searchedUsers;
      } catch (error: any) {
        console.log("search users error", error);
        throw new GraphQLError(error?.message);
      }
    },
  },
  Mutation: {
    createUsername: async (
      _: any,
      args: { username: string },
      context: GraphQLContext
    ): Promise<CreateUsernameResponse> => {
      const { session, prisma } = context;
      const { username } = args;
      if (!session?.user) {
        return {
          error: "Not Authorized",
        };
      }

      const { id: userId } = session.user;

      try {
        // check if username exists
        const userExists = await prisma.user.findUnique({
          where: {
            username,
          },
        });
        if (userExists) {
          return {
            error: "Username exists, try another one!",
          };
        }

        // save username in the db
        const response = await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            username,
          },
        });

        return {
          success: true,
        };
      } catch (error) {
        console.log("create username : ", error);
        return {
          error: error?.message,
        };
      }
    },
  },
};

export default userResolvers;
