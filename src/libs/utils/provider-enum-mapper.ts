import { Provider } from 'src/libs/utils/provider';

const providerMap: Record<string, Provider | undefined> = {
  microsoft: Provider.microsoft,
  google: Provider.google,
  facebook: Provider.facebook,
  github: Provider.github,
  linkedin: Provider.linkedin,
  twitter: Provider.twitter,
};

export const mapProvider = (provider: string): Provider => {
  const result = providerMap[provider];

  if (!result) {
    throw new Error(`Unsupported provider: ${provider}`);
  }

  return result;
};
