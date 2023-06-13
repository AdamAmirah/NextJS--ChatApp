import { merge } from "lodash";
import userResolvers from "./user";
import ConversationResolvers from "./conversation";
import MessageResolvers from "./message";
import scalarResolvers from "./scalars";

const resolvers = merge(
  {},
  userResolvers,
  ConversationResolvers,
  MessageResolvers,
  scalarResolvers
); // merge all the resolvers correctly

export default resolvers;
