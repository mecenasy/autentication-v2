export interface RefreshTokenPayload extends Record<string, string> {
  sub: string;
  email: string;
}
