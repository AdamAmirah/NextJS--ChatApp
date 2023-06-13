import { merge } from "lodash";
import userResolvers from "./user";
const resolvers = merge({}, userResolvers); // merge all the resolvers correctly 
export default resolvers;
