import 'express-serve-static-core';
import { UserEntity } from '../users/entities/user.entity';

declare module 'express-serve-static-core' {
  interface Request {
    user?: UserEntity;
    cookies?: Record<string, string>;
  }
}
