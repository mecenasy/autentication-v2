import { CommandHandler } from '@nestjs/cqrs';
import { Handler } from 'src/common/handler/handler';
import {
  FEDERATION_PROXY_SERVICE_NAME,
  FederationProxyServiceClient,
} from 'src/proto/federation';
import { GenerateSecretType } from '../../dto/generate-secret.type';
import { GenerateSecretFederationCommand } from '../impl/generate-secret.federation.command';
import { lastValueFrom } from 'rxjs';

@CommandHandler(GenerateSecretFederationCommand)
export class GenerateSecretFederationHandler extends Handler<
  GenerateSecretFederationCommand,
  GenerateSecretType,
  FederationProxyServiceClient
> {
  constructor() {
    super(FEDERATION_PROXY_SERVICE_NAME);
  }

  async execute({ clientId, userId }: GenerateSecretFederationCommand) {
    const result = await lastValueFrom(
      this.gRpcService.newSecret({
        clientId,
        userId,
      }),
    );
    return result;
  }
}
