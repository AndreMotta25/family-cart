interface IProviderResponse {
  email: string;
  id: string;
  name: string;
}

interface IProvider {
  verify(token: string): Promise<IProviderResponse>;
}

export { IProvider, IProviderResponse };
