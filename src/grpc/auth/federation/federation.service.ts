import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Federation } from './entity/federation.entity';
import type {
  CreateFederationResponse,
  CreateRequest,
  FederationRequest,
  FederationResponse,
  GetAllFederationRequest,
  GetAllFederationResponse,
  GetClientFederationRequest,
  GetClientResponse,
  GetFederationResponse,
  NewSecretResponse,
  UpdateRequest,
} from 'src/proto/federation';
import { UserGrpcService } from 'src/grpc/user/user.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FederationService {
  constructor(
    @InjectRepository(Federation)
    private readonly federationRepository: Repository<Federation>,
    private readonly userService: UserGrpcService,
  ) {}

  async create({
    clientUrl,
    name,
    userId,
  }: CreateRequest): Promise<CreateFederationResponse> {
    const user = await this.userService.findUserById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const clientId = uuidv4();
    const clientSecret = uuidv4();

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(clientSecret, salt);

    const federation = this.federationRepository.create({
      name,
      clientUrl,
      clientId,
      hash,
      salt,
      user,
    });

    await this.federationRepository.save(federation);

    return {
      name,
      clientId,
      clientUrl,
      isActivated: true,
      id: federation.id,
    };
  }

  async get({
    clientId,
    userId,
  }: FederationRequest): Promise<GetFederationResponse> {
    const user = await this.userService.findUserById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const project = await this.federationRepository.findOne({
      where: { clientId, user: { id: userId } },
    });

    if (!project) {
      throw new NotFoundException('Provider not found');
    }

    return project;
  }

  async getAll({
    userId,
  }: GetAllFederationRequest): Promise<GetAllFederationResponse> {
    const user = await this.userService.findUserById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const projects = await this.federationRepository.find({
      where: { user: { id: userId } },
    });

    return {
      federations: projects,
    };
  }

  async newSecret({
    clientId,
    userId,
  }: FederationRequest): Promise<NewSecretResponse> {
    const user = await this.userService.findUserById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const project = await this.findProject(clientId, userId);
    const secret = uuidv4();

    project.salt = bcrypt.genSaltSync(10);
    project.hash = bcrypt.hashSync(secret, project.salt);

    await this.federationRepository.save(project);
    return { secret };
  }

  async remove({
    clientId,
    userId,
  }: FederationRequest): Promise<FederationResponse> {
    const user = await this.userService.findUserById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const project = await this.findProject(clientId, userId);
    await this.federationRepository.remove(project);

    return {
      status: true,
      message: 'Project removed successfully',
    };
  }

  async toggle({
    clientId,
    userId,
  }: FederationRequest): Promise<FederationResponse> {
    const user = await this.userService.findUserById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const project = await this.findProject(clientId, userId);
    project.isActivated = !project.isActivated;
    await this.federationRepository.save(project);

    return {
      status: true,
      message: 'Project toggled successfully',
    };
  }

  async update({
    clientUrl,
    clientId,
    name,
    userId,
    isActivated,
  }: UpdateRequest): Promise<CreateFederationResponse> {
    const user = await this.userService.findUserById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.federationRepository.update(
      { clientId },
      { clientUrl, name, isActivated },
    );

    return await this.findProject(clientId, userId);
  }

  public async getClient({
    clientId,
  }: GetClientFederationRequest): Promise<GetClientResponse> {
    const result = await this.federationRepository.findOne({
      where: { clientId },
    });

    return {
      clientUrl: result?.clientUrl ?? '',
      hash: result?.hash ?? '',
      salt: result?.salt ?? '',
    };
  }
  private async findProject(clientId: string, userId: string) {
    return await this.federationRepository.findOneOrFail({
      where: { clientId, user: { id: userId } },
    });
  }
}
