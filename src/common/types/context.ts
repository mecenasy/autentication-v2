import express from 'express';
import { User } from 'src/grpc/user/entity/user.entity';

export interface Context {
  req: express.Request;
  res: express.Response;
  user: any;
}
