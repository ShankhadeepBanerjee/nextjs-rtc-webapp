import SimplePeer from "simple-peer";

export type RoomCreateProps = {
  username?: string;
};

export type PeerOfferProps = {
  roomId: string;
  offer: SimplePeer.SignalData;
};

export type PeerOfferReceiveProps = {
  offer: SimplePeer.SignalData;
};

export type PeerAnserProps = {
  roomId: string;
  answer: SimplePeer.SignalData;
};

export type PeerAnserReceiveProps = {
  answer: SimplePeer.SignalData;
};
