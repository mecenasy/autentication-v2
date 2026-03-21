import { Injectable } from '@nestjs/common';
import { UserGrpcService } from 'src/grpc/user/user.service';
import type { VerifyMfaResponse } from 'src/proto/verify-code';

@Injectable()
export class MfaService {
  constructor(private readonly userService: UserGrpcService) {}
  async getUserId(email: string): Promise<VerifyMfaResponse> {
    const user = await this.userService.findUser(email);
    return { userId: user?.id ?? '' };
  }
}
