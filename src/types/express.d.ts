import { User } from '../autemticator/user/entity/user-details.entity';

declare module 'express' {
  export interface Request {
    user?: User;
    securityContext?: SecurityContext;
  }
}
