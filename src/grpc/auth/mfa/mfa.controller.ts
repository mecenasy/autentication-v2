import { Controller } from '@nestjs/common';
import { MfaService } from './mfa.service';
import {
  VERIFY_MFA_PROXY_SERVICE_NAME,
  VerifyMfaProxyServiceController,
  type VerifyMfaRequest,
  type VerifyMfaResponse,
} from 'src/proto/verify-code';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class MfaController implements VerifyMfaProxyServiceController {
  constructor(private readonly mfaService: MfaService) {}

  @GrpcMethod(VERIFY_MFA_PROXY_SERVICE_NAME, 'VerifyMfa')
  async getUserId(request: VerifyMfaRequest): Promise<VerifyMfaResponse> {
    return await this.mfaService.getUserId(request.email);
  }
}
