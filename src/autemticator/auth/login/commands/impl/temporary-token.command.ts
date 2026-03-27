import { Command } from '@nestjs/cqrs';
import { StatusType } from '../../dto/status.type';
import { SessionData } from 'express-session';
import express from 'express';

export class TemporaryTokenCommand extends Command<StatusType> {
  constructor(
    public readonly fail: boolean,
    public readonly email: string,
    public readonly response: express.Response,
    public readonly session: SessionData,
  ) {
    super();
  }
}
