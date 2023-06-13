import axios from "axios";
import { ParticipantPopulated } from "./types";

export const getServerSession = async (cookie: string) => {
  try {
    const response = await axios.get("http://client:3000/api/auth/session", {
      headers: { cookie: cookie },
    });
    const session = response.data;
    return session;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export function userIsConversationParticipant(
  participants: Array<ParticipantPopulated>,
  userId: string
): boolean {
  return !!participants.find((participant) => participant.userId === userId);
}
