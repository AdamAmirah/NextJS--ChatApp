import axios from "axios";
import { ParticipantPopulated } from "./types";
import jwt, { JwtPayload } from "jsonwebtoken";

export function userIsConversationParticipant(
  participants: Array<ParticipantPopulated>,
  userId: string
): boolean {
  return !!participants.find((participant) => participant.userId === userId);
}

export const verifyJwt = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    return decoded as JwtPayload;
  } catch (error) {
    console.log(error);
    return null;
  }
};
