import { ICredentialType, INodeProperties, ICredentialTestRequest, IAuthenticateGeneric } from 'n8n-workflow';

export class ComteleGatewayApi implements ICredentialType {
  name = 'comteleGatewayApi';
  displayName = 'Comtele account';
  documentationUrl = 'https://developers.comtele.com.br/';
  icon: 'file:comtelegateway.svg' = 'file:comtelegateway.svg';
  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: {
        password: true,
      },
      required: true,
      default: '',
      description: 'The X-API-Key header value for authentication',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        'x-api-key': '={{$credentials.apiKey}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: 'https://api.comtele.com.br',
      url: '/balance',
      method: 'GET',
    },
  };
}