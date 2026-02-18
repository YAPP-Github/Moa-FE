export interface RetroRoomCreateRequest {
  title: string;
  /** @nullable */
  description?: string | null;
}

export interface JoinRetroRoomRequest {
  inviteUrl: string;
}

export interface UpdateRetroRoomNameRequest {
  name: string;
}
