export interface AccessTokenPayload {
  sub: string; // userId
  email: string;
}

export interface RefreshTokenPayload {
  sub: string; // userId
  jti: string; // session/token id, para poder revocar
}
