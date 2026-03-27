export interface LoginProcessCache {
  type: 'login start' | 'login success' | 'login tfa' | 'login code';
  code?: number;
  userId?: string;
  email?: string;
}
