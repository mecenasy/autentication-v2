import { Controller } from '@nestjs/common';
import type {
  CreateFederationResponse,
  CreateRequest,
  FederationProxyServiceController,
  FederationRequest,
  FederationResponse,
  GetAllFederationRequest,
  GetAllFederationResponse,
  GetFederationResponse,
  NewSecretResponse,
  UpdateRequest,
} from 'src/proto/federation';
import { FEDERATION_PROXY_SERVICE_NAME } from 'src/proto/federation';
import { FederationService } from './federation.service';
import { GrpcMethod } from '@nestjs/microservices';

@Controller('federation')
export class FederationController implements FederationProxyServiceController {
  constructor(private readonly federationService: FederationService) {}

  @GrpcMethod(FEDERATION_PROXY_SERVICE_NAME, 'Create')
  async create(request: CreateRequest): Promise<CreateFederationResponse> {
    return await this.federationService.create(request);
  }
  @GrpcMethod(FEDERATION_PROXY_SERVICE_NAME, 'Get')
  async get(request: FederationRequest): Promise<GetFederationResponse> {
    return await this.federationService.get(request);
  }
  @GrpcMethod(FEDERATION_PROXY_SERVICE_NAME, 'GetAll')
  async getAll(
    request: GetAllFederationRequest,
  ): Promise<GetAllFederationResponse> {
    return await this.federationService.getAll(request);
  }
  @GrpcMethod(FEDERATION_PROXY_SERVICE_NAME, 'NewSecret')
  async newSecret(request: FederationRequest): Promise<NewSecretResponse> {
    return await this.federationService.newSecret(request);
  }
  @GrpcMethod(FEDERATION_PROXY_SERVICE_NAME, 'Remove')
  async remove(request: FederationRequest): Promise<FederationResponse> {
    return await this.federationService.remove(request);
  }
  @GrpcMethod(FEDERATION_PROXY_SERVICE_NAME, 'Toggle')
  async toggle(request: FederationRequest): Promise<FederationResponse> {
    return await this.federationService.toggle(request);
  }
  @GrpcMethod(FEDERATION_PROXY_SERVICE_NAME, 'Update')
  async update(request: UpdateRequest): Promise<CreateFederationResponse> {
    return await this.federationService.update(request);
  }
}
