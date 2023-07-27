import { TurnCreds } from "../types";
import { publicAxios } from "./api";

const turnCredsURL = "/turn-creds";

export const getTURNCreds = async (): Promise<TurnCreds> => {
  const { data } = await publicAxios.get<TurnCreds>(turnCredsURL);
  return data;
};
