import { CreateFederationHandler } from './create-federation.handler';
import { UpdateFederationHandler } from './update-federation.handler';
import { RemoveFederationHandler } from './remove-federation.handler';
import { ToggleFederationHandler } from './toggle-federation.handler';
import { GenerateSecretFederationHandler } from './generate-secret.federation.handler';

export const federationHCommands = [
  CreateFederationHandler,
  UpdateFederationHandler,
  RemoveFederationHandler,
  ToggleFederationHandler,
  GenerateSecretFederationHandler,
];
