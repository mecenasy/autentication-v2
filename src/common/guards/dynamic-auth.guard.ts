import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

export class DynamicAuthGuard extends AuthGuard([
  'google',
  'facebook',
  'twitter',
  'github',
  'linkedin',
]) {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const provider = request.params.provider;

    const isRegister = request.path.includes('register');

    if (isRegister) {
      request.session.isRegister = true;

      await new Promise<void>((resolve) =>
        request.session.save(() => resolve()),
      );
    }

    const passportGuard = AuthGuard(provider);
    const instance = new passportGuard();

    return instance.canActivate(context) as Promise<boolean>;
  }
}
