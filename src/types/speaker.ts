export type SessionWithRoom = {
  id: string;
  title: string;
  description: string | null;
  startTime: Date;
  endTime: Date;
  capacity: number | null;
  room: { id: string; name: string } | null;
};

export type SpeakerWithSessions = {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  bio: string | null;
  links: unknown;
  sessions: SessionWithRoom[];
} | null;
