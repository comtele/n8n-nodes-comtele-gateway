import { INodeType, ICredentialType } from 'n8n-workflow';

import { ComteleGatewayNode } from './nodes/ComteleGateway/ComteleGateway.node';
import { ComteleGatewayApiCredential } from './credentials/ComteleGatewayApi.credentials';

export const nodes: INodeType[] = [ComteleGatewayNode];
export const credentials: ICredentialType[] = [ComteleGatewayApiCredential];