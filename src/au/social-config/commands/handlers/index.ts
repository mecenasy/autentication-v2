import { CreateSocialConfigHandler } from './create-social-config.handler';
import { UpdateSocialConfigHandler } from './update-social-config.handler';
import { ToggleActiveSocialConfigHandler } from './toggle-active-social-config.handler';
import { DeleteSocialConfigHandler } from './delete-social-config.handler';

export const commandHandlers = [
  CreateSocialConfigHandler,
  UpdateSocialConfigHandler,
  ToggleActiveSocialConfigHandler,
  DeleteSocialConfigHandler,
];
