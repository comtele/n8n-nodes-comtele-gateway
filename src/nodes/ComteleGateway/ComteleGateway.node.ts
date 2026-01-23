import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
} from 'n8n-workflow';
import { OptionsWithUri } from 'request';
import {
  ComteleResponse,
  BalanceObject,
  ContactGroup,
  Route,
  MessageRequest,
  ReceivedMessage,
  SentMessage,
  SendMessageResponse,
  CancelRequestResponse,
} from '../../types/index';

export class ComteleGatewayNode implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Comtele Gateway',
    name: 'comteleGateway',
    icon: 'file:comtelegateway.svg',
    group: ['transform'],
    version: 1,
    description: 'Integrate with Comtele Gateway API for messaging operations',
    defaults: {
      name: 'Comtele Gateway',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'comteleGatewayApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Cancel Messages Request',
            value: 'cancelMessagesRequest',
            description: 'Cancel a message request',
            action: 'Cancel messages request',
          },
          {
            name: 'Get Balance',
            value: 'getBalance',
            description: 'Get account balance',
            action: 'Get balance',
          },
          {
            name: 'Get Contact Groups',
            value: 'getContactGroups',
            description: 'Get all contact groups',
            action: 'Get contact groups',
          },
          {
            name: 'Get Messages Requests Report',
            value: 'getMessagesRequestsReport',
            description: 'Get messages requests report with filters',
            action: 'Get messages requests report',
          },
          {
            name: 'Get Routes',
            value: 'getRoutes',
            description: 'Get all available routes',
            action: 'Get routes',
          },
          {
            name: 'Received Messages Report',
            value: 'receivedMessagesReport',
            description: 'Get received messages report',
            action: 'Get received messages report',
          },
          {
            name: 'Send RCS Basic Message',
            value: 'sendRcsBasicMessage',
            description: 'Send RCS basic text message',
            action: 'Send RCS basic message',
          },
          {
            name: 'Send RCS Card Message',
            value: 'sendRcsCardMessage',
            description: 'Send RCS card message',
            action: 'Send RCS card message',
          },
          {
            name: 'Send RCS Carousel Message',
            value: 'sendRcsCarouselMessage',
            description: 'Send RCS carousel message',
            action: 'Send RCS carousel message',
          },
          {
            name: 'Send RCS File Message',
            value: 'sendRcsFileMessage',
            description: 'Send RCS file message',
            action: 'Send RCS file message',
          },
          {
            name: 'Send SMS Message',
            value: 'sendSmsMessage',
            description: 'Send SMS message',
            action: 'Send SMS message',
          },
          {
            name: 'Sent Messages Report',
            value: 'sentMessagesReport',
            description: 'Get sent messages report',
            action: 'Get sent messages report',
          },
        ],
        required: true,
        default: 'getBalance',
      },

      // Cancel Messages Request Fields
      {
        displayName: 'Request ID',
        name: 'requestId',
        type: 'string',
        required: true,
        default: '',
        description: 'The ID of the message request to cancel',
        displayOptions: {
          show: {
            operation: ['cancelMessagesRequest'],
          },
        },
      },

      // Get Messages Requests Report Fields
      {
        displayName: 'Start Date',
        name: 'startDate',
        type: 'string',
        required: true,
        default: '',
        placeholder: '2024-06-10T00:00:00Z',
        description: 'Start date in format yyyy-MM-ddTHH:mm:ssZ',
        displayOptions: {
          show: {
            operation: ['getMessagesRequestsReport'],
          },
        },
      },
      {
        displayName: 'End Date',
        name: 'endDate',
        type: 'string',
        required: true,
        default: '',
        placeholder: '2024-06-10T23:59:59Z',
        description: 'End date in format yyyy-MM-ddTHH:mm:ssZ',
        displayOptions: {
          show: {
            operation: ['getMessagesRequestsReport'],
          },
        },
      },

      // Received Messages Report Fields
      {
        displayName: 'Start Date',
        name: 'startDate',
        type: 'string',
        required: true,
        default: '',
        placeholder: '2024-06-10T00:00:00Z',
        description: 'Start date in format yyyy-MM-ddTHH:mm:ssZ',
        displayOptions: {
          show: {
            operation: ['receivedMessagesReport'],
          },
        },
      },
      {
        displayName: 'End Date',
        name: 'endDate',
        type: 'string',
        required: true,
        default: '',
        placeholder: '2024-06-10T23:59:59Z',
        description: 'End date in format yyyy-MM-ddTHH:mm:ssZ',
        displayOptions: {
          show: {
            operation: ['receivedMessagesReport'],
          },
        },
      },
      {
        displayName: 'Statuses',
        name: 'statuses',
        type: 'string',
        required: false,
        default: '',
        placeholder: 'Received,Read',
        description: 'Filter by message statuses (comma-separated)',
        displayOptions: {
          show: {
            operation: ['receivedMessagesReport'],
          },
        },
      },
      {
        displayName: 'Sender',
        name: 'sender',
        type: 'string',
        required: false,
        default: '',
        description: 'Filter by sender phone number',
        displayOptions: {
          show: {
            operation: ['receivedMessagesReport'],
          },
        },
      },
      {
        displayName: 'Skip',
        name: 'skip',
        type: 'number',
        required: false,
        default: 0,
        description: 'Number of records to skip',
        displayOptions: {
          show: {
            operation: ['receivedMessagesReport'],
          },
        },
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        required: false,
        default: 10,
        description: 'Maximum number of records to return',
        displayOptions: {
          show: {
            operation: ['receivedMessagesReport'],
          },
        },
      },

      // Send RCS Basic Message Fields
      {
        displayName: 'Receivers',
        name: 'receivers',
        type: 'string',
        typeOptions: {
          multipleValues: true,
        },
        required: true,
        default: [],
        description: 'List of recipient phone numbers',
        displayOptions: {
          show: {
            operation: ['sendRcsBasicMessage'],
          },
        },
      },
      {
        displayName: 'Contact Groups',
        name: 'contactGroups',
        type: 'string',
        typeOptions: {
          multipleValues: true,
        },
        required: false,
        default: [],
        description: 'List of contact group IDs',
        displayOptions: {
          show: {
            operation: ['sendRcsBasicMessage'],
          },
        },
      },
      {
        displayName: 'Message',
        name: 'message',
        type: 'string',
        required: true,
        default: '',
        description: 'Message content',
        displayOptions: {
          show: {
            operation: ['sendRcsBasicMessage'],
          },
        },
      },
      {
        displayName: 'Route',
        name: 'route',
        type: 'number',
        required: true,
        default: 0,
        description: 'Route ID to use for sending',
        displayOptions: {
          show: {
            operation: ['sendRcsBasicMessage'],
          },
        },
      },
      {
        displayName: 'Schedule Date',
        name: 'scheduleDate',
        type: 'string',
        required: false,
        default: '',
        placeholder: '2024-06-10T14:30:00Z',
        description: 'Optional scheduled date in format yyyy-MM-ddTHH:mm:ssZ',
        displayOptions: {
          show: {
            operation: ['sendRcsBasicMessage'],
          },
        },
      },
      {
        displayName: 'Custom',
        name: 'custom',
        type: 'string',
        required: false,
        default: '',
        description: 'Custom field',
        displayOptions: {
          show: {
            operation: ['sendRcsBasicMessage'],
          },
        },
      },
      {
        displayName: 'Tag',
        name: 'tag',
        type: 'string',
        required: false,
        default: '',
        description: 'Message tag',
        displayOptions: {
          show: {
            operation: ['sendRcsBasicMessage'],
          },
        },
      },

      // Send RCS Card Message Fields
      {
        displayName: 'Receivers',
        name: 'receivers',
        type: 'string',
        typeOptions: {
          multipleValues: true,
        },
        required: true,
        default: [],
        description: 'List of recipient phone numbers',
        displayOptions: {
          show: {
            operation: ['sendRcsCardMessage'],
          },
        },
      },
      {
        displayName: 'Contact Groups',
        name: 'contactGroups',
        type: 'string',
        typeOptions: {
          multipleValues: true,
        },
        required: false,
        default: [],
        description: 'List of contact group IDs',
        displayOptions: {
          show: {
            operation: ['sendRcsCardMessage'],
          },
        },
      },
      {
        displayName: 'Route',
        name: 'route',
        type: 'number',
        required: true,
        default: 0,
        description: 'Route ID to use for sending',
        displayOptions: {
          show: {
            operation: ['sendRcsCardMessage'],
          },
        },
      },
      {
        displayName: 'Card Title',
        name: 'cardTitle',
        type: 'string',
        required: true,
        default: '',
        description: 'Title of the RCS card',
        displayOptions: {
          show: {
            operation: ['sendRcsCardMessage'],
          },
        },
      },
      {
        displayName: 'Card Message',
        name: 'cardMessage',
        type: 'string',
        required: true,
        default: '',
        typeOptions: {
          rows: 3,
        },
        description: 'Content of the RCS card message',
        displayOptions: {
          show: {
            operation: ['sendRcsCardMessage'],
          },
        },
      },
      {
        displayName: 'Card Image URL',
        name: 'cardImage',
        type: 'string',
        required: false,
        default: '',
        description: 'URL of the card image',
        displayOptions: {
          show: {
            operation: ['sendRcsCardMessage'],
          },
        },
      },
      {
        displayName: 'Buttons',
        name: 'buttons',
        type: 'fixedCollection',
        typeOptions: {
          multipleValues: true,
        },
        default: [],
        description: 'List of card buttons',
        displayOptions: {
          show: {
            operation: ['sendRcsCardMessage'],
          },
        },
        options: [
          {
            name: 'buttonValues',
            displayName: 'Button',
            values: [
              {
                displayName: 'Text',
                name: 'text',
                type: 'string',
                required: true,
                default: '',
              },
              {
                displayName: 'URL',
                name: 'url',
                type: 'string',
                required: true,
                default: '',
              },
            ],
          },
        ],
      },
      {
        displayName: 'Schedule Date',
        name: 'scheduleDate',
        type: 'string',
        required: false,
        default: '',
        placeholder: '2024-06-10T14:30:00Z',
        description: 'Optional scheduled date in format yyyy-MM-ddTHH:mm:ssZ',
        displayOptions: {
          show: {
            operation: ['sendRcsCardMessage'],
          },
        },
      },
      {
        displayName: 'Custom',
        name: 'custom',
        type: 'string',
        required: false,
        default: '',
        description: 'Custom field',
        displayOptions: {
          show: {
            operation: ['sendRcsCardMessage'],
          },
        },
      },
      {
        displayName: 'Tag',
        name: 'tag',
        type: 'string',
        required: false,
        default: '',
        description: 'Message tag',
        displayOptions: {
          show: {
            operation: ['sendRcsCardMessage'],
          },
        },
      },

      // Send RCS Carousel Message Fields
      {
        displayName: 'Receivers',
        name: 'receivers',
        type: 'string',
        typeOptions: {
          multipleValues: true,
        },
        required: true,
        default: [],
        description: 'List of recipient phone numbers',
        displayOptions: {
          show: {
            operation: ['sendRcsCarouselMessage'],
          },
        },
      },
      {
        displayName: 'Contact Groups',
        name: 'contactGroups',
        type: 'string',
        typeOptions: {
          multipleValues: true,
        },
        required: false,
        default: [],
        description: 'List of contact group IDs',
        displayOptions: {
          show: {
            operation: ['sendRcsCarouselMessage'],
          },
        },
      },
      {
        displayName: 'Route',
        name: 'route',
        type: 'number',
        required: true,
        default: 0,
        description: 'Route ID to use for sending',
        displayOptions: {
          show: {
            operation: ['sendRcsCarouselMessage'],
          },
        },
      },
      {
        displayName: 'Cards',
        name: 'cards',
        type: 'fixedCollection',
        typeOptions: {
          multipleValues: true,
        },
        default: [],
        description: 'List of carousel cards',
        displayOptions: {
          show: {
            operation: ['sendRcsCarouselMessage'],
          },
        },
        options: [
          {
            name: 'cardValues',
            displayName: 'Card',
            values: [
              {
                displayName: 'Card Title',
                name: 'cardTitle',
                type: 'string',
                required: true,
                default: '',
              },
              {
                displayName: 'Card Message',
                name: 'cardMessage',
                type: 'string',
                required: true,
                default: '',
              },
              {
                displayName: 'Card Image URL',
                name: 'cardImage',
                type: 'string',
                required: false,
                default: '',
              },
              {
                displayName: 'Buttons',
                name: 'buttons',
                type: 'fixedCollection',
                typeOptions: {
                  multipleValues: true,
                },
                default: [],
                options: [
                  {
                    name: 'buttonValues',
                    displayName: 'Button',
                    values: [
                      {
                        displayName: 'Text',
                        name: 'text',
                        type: 'string',
                        required: true,
                        default: '',
                      },
                      {
                        displayName: 'URL',
                        name: 'url',
                        type: 'string',
                        required: true,
                        default: '',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        displayName: 'Schedule Date',
        name: 'scheduleDate',
        type: 'string',
        required: false,
        default: '',
        placeholder: '2024-06-10T14:30:00Z',
        description: 'Optional scheduled date in format yyyy-MM-ddTHH:mm:ssZ',
        displayOptions: {
          show: {
            operation: ['sendRcsCarouselMessage'],
          },
        },
      },
      {
        displayName: 'Custom',
        name: 'custom',
        type: 'string',
        required: false,
        default: '',
        description: 'Custom field',
        displayOptions: {
          show: {
            operation: ['sendRcsCarouselMessage'],
          },
        },
      },
      {
        displayName: 'Tag',
        name: 'tag',
        type: 'string',
        required: false,
        default: '',
        description: 'Message tag',
        displayOptions: {
          show: {
            operation: ['sendRcsCarouselMessage'],
          },
        },
      },

      // Send RCS File Message Fields
      {
        displayName: 'Receivers',
        name: 'receivers',
        type: 'string',
        typeOptions: {
          multipleValues: true,
        },
        required: true,
        default: [],
        description: 'List of recipient phone numbers',
        displayOptions: {
          show: {
            operation: ['sendRcsFileMessage'],
          },
        },
      },
      {
        displayName: 'Contact Groups',
        name: 'contactGroups',
        type: 'string',
        typeOptions: {
          multipleValues: true,
        },
        required: false,
        default: [],
        description: 'List of contact group IDs',
        displayOptions: {
          show: {
            operation: ['sendRcsFileMessage'],
          },
        },
      },
      {
        displayName: 'Route',
        name: 'route',
        type: 'number',
        required: true,
        default: 0,
        description: 'Route ID to use for sending',
        displayOptions: {
          show: {
            operation: ['sendRcsFileMessage'],
          },
        },
      },
      {
        displayName: 'File URL',
        name: 'file',
        type: 'string',
        required: true,
        default: '',
        description: 'URL of the file to send',
        displayOptions: {
          show: {
            operation: ['sendRcsFileMessage'],
          },
        },
      },
      {
        displayName: 'File Name',
        name: 'fileName',
        type: 'string',
        required: true,
        default: '',
        description: 'Name of the file',
        displayOptions: {
          show: {
            operation: ['sendRcsFileMessage'],
          },
        },
      },
      {
        displayName: 'Schedule Date',
        name: 'scheduleDate',
        type: 'string',
        required: false,
        default: '',
        placeholder: '2024-06-10T14:30:00Z',
        description: 'Optional scheduled date in format yyyy-MM-ddTHH:mm:ssZ',
        displayOptions: {
          show: {
            operation: ['sendRcsFileMessage'],
          },
        },
      },
      {
        displayName: 'Custom',
        name: 'custom',
        type: 'string',
        required: false,
        default: '',
        description: 'Custom field',
        displayOptions: {
          show: {
            operation: ['sendRcsFileMessage'],
          },
        },
      },
      {
        displayName: 'Tag',
        name: 'tag',
        type: 'string',
        required: false,
        default: '',
        description: 'Message tag',
        displayOptions: {
          show: {
            operation: ['sendRcsFileMessage'],
          },
        },
      },

      // Send SMS Message Fields
      {
        displayName: 'Receivers',
        name: 'receivers',
        type: 'string',
        typeOptions: {
          multipleValues: true,
        },
        required: true,
        default: [],
        description: 'List of recipient phone numbers',
        displayOptions: {
          show: {
            operation: ['sendSmsMessage'],
          },
        },
      },
      {
        displayName: 'Contact Groups',
        name: 'contactGroups',
        type: 'string',
        typeOptions: {
          multipleValues: true,
        },
        required: false,
        default: [],
        description: 'List of contact group IDs',
        displayOptions: {
          show: {
            operation: ['sendSmsMessage'],
          },
        },
      },
      {
        displayName: 'Message',
        name: 'message',
        type: 'string',
        required: true,
        default: '',
        typeOptions: {
          rows: 3,
        },
        description: 'Message content',
        displayOptions: {
          show: {
            operation: ['sendSmsMessage'],
          },
        },
      },
      {
        displayName: 'Route',
        name: 'route',
        type: 'number',
        required: true,
        default: 0,
        description: 'Route ID to use for sending',
        displayOptions: {
          show: {
            operation: ['sendSmsMessage'],
          },
        },
      },
      {
        displayName: 'Schedule Date',
        name: 'scheduleDate',
        type: 'string',
        required: false,
        default: '',
        placeholder: '2024-06-10T14:30:00Z',
        description: 'Optional scheduled date in format yyyy-MM-ddTHH:mm:ssZ',
        displayOptions: {
          show: {
            operation: ['sendSmsMessage'],
          },
        },
      },
      {
        displayName: 'Custom',
        name: 'custom',
        type: 'string',
        required: false,
        default: '',
        description: 'Custom field',
        displayOptions: {
          show: {
            operation: ['sendSmsMessage'],
          },
        },
      },
      {
        displayName: 'Tag',
        name: 'tag',
        type: 'string',
        required: false,
        default: '',
        description: 'Message tag',
        displayOptions: {
          show: {
            operation: ['sendSmsMessage'],
          },
        },
      },

      // Sent Messages Report Fields
      {
        displayName: 'Start Date',
        name: 'startDate',
        type: 'string',
        required: true,
        default: '',
        placeholder: '2024-06-10T00:00:00Z',
        description: 'Start date in format yyyy-MM-ddTHH:mm:ssZ',
        displayOptions: {
          show: {
            operation: ['sentMessagesReport'],
          },
        },
      },
      {
        displayName: 'End Date',
        name: 'endDate',
        type: 'string',
        required: true,
        default: '',
        placeholder: '2024-06-10T23:59:59Z',
        description: 'End date in format yyyy-MM-ddTHH:mm:ssZ',
        displayOptions: {
          show: {
            operation: ['sentMessagesReport'],
          },
        },
      },
      {
        displayName: 'Receiver',
        name: 'receiver',
        type: 'string',
        required: false,
        default: '',
        description: 'Filter by receiver phone number',
        displayOptions: {
          show: {
            operation: ['sentMessagesReport'],
          },
        },
      },
      {
        displayName: 'Content',
        name: 'content',
        type: 'string',
        required: false,
        default: '',
        description: 'Filter by message content',
        displayOptions: {
          show: {
            operation: ['sentMessagesReport'],
          },
        },
      },
      {
        displayName: 'Custom',
        name: 'custom',
        type: 'string',
        required: false,
        default: '',
        description: 'Filter by custom field',
        displayOptions: {
          show: {
            operation: ['sentMessagesReport'],
          },
        },
      },
      {
        displayName: 'Tag',
        name: 'tag',
        type: 'string',
        required: false,
        default: '',
        description: 'Filter by tag',
        displayOptions: {
          show: {
            operation: ['sentMessagesReport'],
          },
        },
      },
      {
        displayName: 'Skip',
        name: 'skip',
        type: 'number',
        required: false,
        default: 0,
        description: 'Number of records to skip',
        displayOptions: {
          show: {
            operation: ['sentMessagesReport'],
          },
        },
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        required: false,
        default: 10,
        description: 'Maximum number of records to return',
        displayOptions: {
          show: {
            operation: ['sentMessagesReport'],
          },
        },
      },
      {
        displayName: 'Statuses',
        name: 'statuses',
        type: 'string',
        required: false,
        default: '',
        placeholder: 'Sent,Delivered',
        description: 'Filter by message statuses (comma-separated)',
        displayOptions: {
          show: {
            operation: ['sentMessagesReport'],
          },
        },
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
      try {
        const operation = this.getNodeParameter('operation', itemIndex) as string;
        let responseData;

        const credentials = await this.getCredentials('comteleGatewayApi');
        const apiKey = credentials.apiKey as string;

        const baseUrl = 'https://api.comtele.com.br';
        const headers = {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
        };

        switch (operation) {
          case 'cancelMessagesRequest':
            responseData = await this.cancelMessagesRequest(
              this,
              itemIndex,
              baseUrl,
              headers
            );
            break;
          case 'getBalance':
            responseData = await this.getBalance(this, itemIndex, baseUrl, headers);
            break;
          case 'getContactGroups':
            responseData = await this.getContactGroups(
              this,
              itemIndex,
              baseUrl,
              headers
            );
            break;
          case 'getMessagesRequestsReport':
            responseData = await this.getMessagesRequestsReport(
              this,
              itemIndex,
              baseUrl,
              headers
            );
            break;
          case 'getRoutes':
            responseData = await this.getRoutes(this, itemIndex, baseUrl, headers);
            break;
          case 'receivedMessagesReport':
            responseData = await this.receivedMessagesReport(
              this,
              itemIndex,
              baseUrl,
              headers
            );
            break;
          case 'sendRcsBasicMessage':
            responseData = await this.sendRcsBasicMessage(
              this,
              itemIndex,
              baseUrl,
              headers
            );
            break;
          case 'sendRcsCardMessage':
            responseData = await this.sendRcsCardMessage(
              this,
              itemIndex,
              baseUrl,
              headers
            );
            break;
          case 'sendRcsCarouselMessage':
            responseData = await this.sendRcsCarouselMessage(
              this,
              itemIndex,
              baseUrl,
              headers
            );
            break;
          case 'sendRcsFileMessage':
            responseData = await this.sendRcsFileMessage(
              this,
              itemIndex,
              baseUrl,
              headers
            );
            break;
          case 'sendSmsMessage':
            responseData = await this.sendSmsMessage(
              this,
              itemIndex,
              baseUrl,
              headers
            );
            break;
          case 'sentMessagesReport':
            responseData = await this.sentMessagesReport(
              this,
              itemIndex,
              baseUrl,
              headers
            );
            break;
          default:
            throw new NodeOperationError(
              this.getNode(),
              `Unknown operation: ${operation}`
            );
        }

        returnData.push({ json: responseData });
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({ json: { error: error.message } });
        } else {
          throw error;
        }
      }
    }

    return [returnData];
  }

  private async cancelMessagesRequest(
    context: IExecuteFunctions,
    itemIndex: number,
    baseUrl: string,
    headers: Record<string, string>
  ): Promise<CancelRequestResponse> {
    const requestId = context.getNodeParameter('requestId', itemIndex) as string;

    const options: OptionsWithUri = {
      method: 'POST',
      uri: `${baseUrl}/messages/request/cancel`,
      headers,
      json: true,
      body: {
        requestId,
      },
    };

    return await context.helpers.request(options);
  }

  private async getBalance(
    context: IExecuteFunctions,
    itemIndex: number,
    baseUrl: string,
    headers: Record<string, string>
  ): Promise<ComteleResponse<BalanceObject>> {
    const options: OptionsWithUri = {
      method: 'GET',
      uri: `${baseUrl}/balance`,
      headers,
      json: true,
    };

    return await context.helpers.request(options);
  }

  private async getContactGroups(
    context: IExecuteFunctions,
    itemIndex: number,
    baseUrl: string,
    headers: Record<string, string>
  ): Promise<ComteleResponse<ContactGroup[]>> {
    const options: OptionsWithUri = {
      method: 'GET',
      uri: `${baseUrl}/contacts`,
      headers,
      json: true,
    };

    return await context.helpers.request(options);
  }

  private async getMessagesRequestsReport(
    context: IExecuteFunctions,
    itemIndex: number,
    baseUrl: string,
    headers: Record<string, string>
  ): Promise<ComteleResponse<MessageRequest[]>> {
    const startDate = context.getNodeParameter('startDate', itemIndex) as string;
    const endDate = context.getNodeParameter('endDate', itemIndex) as string;

    const qs = {
      startDate,
      endDate,
    };

    const options: OptionsWithUri = {
      method: 'GET',
      uri: `${baseUrl}/reports/messages/requests`,
      qs,
      headers,
      json: true,
    };

    return await context.helpers.request(options);
  }

  private async getRoutes(
    context: IExecuteFunctions,
    itemIndex: number,
    baseUrl: string,
    headers: Record<string, string>
  ): Promise<ComteleResponse<Route[]>> {
    const options: OptionsWithUri = {
      method: 'GET',
      uri: `${baseUrl}/routes`,
      headers,
      json: true,
    };

    return await context.helpers.request(options);
  }

  private async receivedMessagesReport(
    context: IExecuteFunctions,
    itemIndex: number,
    baseUrl: string,
    headers: Record<string, string>
  ): Promise<ComteleResponse<ReceivedMessage[]>> {
    const startDate = context.getNodeParameter('startDate', itemIndex) as string;
    const endDate = context.getNodeParameter('endDate', itemIndex) as string;
    const statuses = context.getNodeParameter('statuses', itemIndex) as string;
    const sender = context.getNodeParameter('sender', itemIndex) as string;
    const skip = context.getNodeParameter('skip', itemIndex) as number;
    const limit = context.getNodeParameter('limit', itemIndex) as number;

    const qs: Record<string, string | number> = {
      startDate,
      endDate,
      skip,
      limit,
    };

    if (statuses) {
      qs.statuses = statuses;
    }
    if (sender) {
      qs.sender = sender;
    }

    const options: OptionsWithUri = {
      method: 'GET',
      uri: `${baseUrl}/reports/messages/received`,
      qs,
      headers,
      json: true,
    };

    return await context.helpers.request(options);
  }

  private async sendRcsBasicMessage(
    context: IExecuteFunctions,
    itemIndex: number,
    baseUrl: string,
    headers: Record<string, string>
  ): Promise<SendMessageResponse> {
    const receivers = context.getNodeParameter('receivers', itemIndex) as string[];
    const contactGroups = context.getNodeParameter(
      'contactGroups',
      itemIndex
    ) as string[];
    const message = context.getNodeParameter('message', itemIndex) as string;
    const route = context.getNodeParameter('route', itemIndex) as number;
    const scheduleDate = context.getNodeParameter('scheduleDate', itemIndex) as string;
    const custom = context.getNodeParameter('custom', itemIndex) as string;
    const tag = context.getNodeParameter('tag', itemIndex) as string;

    const body: Record<string, unknown> = {
      receivers: receivers.map(r => r.trim()),
      contactGroups: contactGroups.map(cg => parseInt(cg, 10)),
      message,
      route,
    };

    if (scheduleDate) {
      body.scheduleDate = scheduleDate;
    }
    if (custom) {
      body.custom = custom;
    }
    if (tag) {
      body.tag = tag;
    }

    const options: OptionsWithUri = {
      method: 'POST',
      uri: `${baseUrl}/messages/rcs/basic/send`,
      headers,
      json: true,
      body,
    };

    return await context.helpers.request(options);
  }

  private async sendRcsCardMessage(
    context: IExecuteFunctions,
    itemIndex: number,
    baseUrl: string,
    headers: Record<string, string>
  ): Promise<SendMessageResponse> {
    const receivers = context.getNodeParameter('receivers', itemIndex) as string[];
    const contactGroups = context.getNodeParameter(
      'contactGroups',
      itemIndex
    ) as string[];
    const route = context.getNodeParameter('route', itemIndex) as number;
    const cardTitle = context.getNodeParameter('cardTitle', itemIndex) as string;
    const cardMessage = context.getNodeParameter('cardMessage', itemIndex) as string;
    const cardImage = context.getNodeParameter('cardImage', itemIndex) as string;
    const buttonsData = context.getNodeParameter('buttons', itemIndex) as unknown;
    const scheduleDate = context.getNodeParameter('scheduleDate', itemIndex) as string;
    const custom = context.getNodeParameter('custom', itemIndex) as string;
    const tag = context.getNodeParameter('tag', itemIndex) as string;

    const buttons = this.parseButtons(buttonsData);

    const body: Record<string, unknown> = {
      receivers: receivers.map(r => r.trim()),
      contactGroups: contactGroups.map(cg => parseInt(cg, 10)),
      route,
      cardTitle,
      cardMessage,
      buttons,
    };

    if (cardImage) {
      body.cardImage = cardImage;
    }
    if (scheduleDate) {
      body.scheduleDate = scheduleDate;
    }
    if (custom) {
      body.custom = custom;
    }
    if (tag) {
      body.tag = tag;
    }

    const options: OptionsWithUri = {
      method: 'POST',
      uri: `${baseUrl}/messages/rcs/card/send`,
      headers,
      json: true,
      body,
    };

    return await context.helpers.request(options);
  }

  private async sendRcsCarouselMessage(
    context: IExecuteFunctions,
    itemIndex: number,
    baseUrl: string,
    headers: Record<string, string>
  ): Promise<SendMessageResponse> {
    const receivers = context.getNodeParameter('receivers', itemIndex) as string[];
    const contactGroups = context.getNodeParameter(
      'contactGroups',
      itemIndex
    ) as string[];
    const route = context.getNodeParameter('route', itemIndex) as number;
    const cardsData = context.getNodeParameter('cards', itemIndex) as unknown;
    const scheduleDate = context.getNodeParameter('scheduleDate', itemIndex) as string;
    const custom = context.getNodeParameter('custom', itemIndex) as string;
    const tag = context.getNodeParameter('tag', itemIndex) as string;

    const cards = this.parseCards(cardsData);

    const body: Record<string, unknown> = {
      receivers: receivers.map(r => r.trim()),
      contactGroups: contactGroups.map(cg => parseInt(cg, 10)),
      route,
      cards,
    };

    if (scheduleDate) {
      body.scheduleDate = scheduleDate;
    }
    if (custom) {
      body.custom = custom;
    }
    if (tag) {
      body.tag = tag;
    }

    const options: OptionsWithUri = {
      method: 'POST',
      uri: `${baseUrl}/messages/rcs/carousel/send`,
      headers,
      json: true,
      body,
    };

    return await context.helpers.request(options);
  }

  private async sendRcsFileMessage(
    context: IExecuteFunctions,
    itemIndex: number,
    baseUrl: string,
    headers: Record<string, string>
  ): Promise<SendMessageResponse> {
    const receivers = context.getNodeParameter('receivers', itemIndex) as string[];
    const contactGroups = context.getNodeParameter(
      'contactGroups',
      itemIndex
    ) as string[];
    const route = context.getNodeParameter('route', itemIndex) as number;
    const file = context.getNodeParameter('file', itemIndex) as string;
    const fileName = context.getNodeParameter('fileName', itemIndex) as string;
    const scheduleDate = context.getNodeParameter('scheduleDate', itemIndex) as string;
    const custom = context.getNodeParameter('custom', itemIndex) as string;
    const tag = context.getNodeParameter('tag', itemIndex) as string;

    const body: Record<string, unknown> = {
      receivers: receivers.map(r => r.trim()),
      contactGroups: contactGroups.map(cg => parseInt(cg, 10)),
      route,
      file,
      fileName,
    };

    if (scheduleDate) {
      body.scheduleDate = scheduleDate;
    }
    if (custom) {
      body.custom = custom;
    }
    if (tag) {
      body.tag = tag;
    }

    const options: OptionsWithUri = {
      method: 'POST',
      uri: `${baseUrl}/messages/rcs/file/send`,
      headers,
      json: true,
      body,
    };

    return await context.helpers.request(options);
  }

  private async sendSmsMessage(
    context: IExecuteFunctions,
    itemIndex: number,
    baseUrl: string,
    headers: Record<string, string>
  ): Promise<SendMessageResponse> {
    const receivers = context.getNodeParameter('receivers', itemIndex) as string[];
    const contactGroups = context.getNodeParameter(
      'contactGroups',
      itemIndex
    ) as string[];
    const message = context.getNodeParameter('message', itemIndex) as string;
    const route = context.getNodeParameter('route', itemIndex) as number;
    const scheduleDate = context.getNodeParameter('scheduleDate', itemIndex) as string;
    const custom = context.getNodeParameter('custom', itemIndex) as string;
    const tag = context.getNodeParameter('tag', itemIndex) as string;

    const body: Record<string, unknown> = {
      receivers: receivers.map(r => r.trim()),
      contactGroups: contactGroups.map(cg => parseInt(cg, 10)),
      message,
      route,
    };

    if (scheduleDate) {
      body.scheduleDate = scheduleDate;
    }
    if (custom) {
      body.custom = custom;
    }
    if (tag) {
      body.tag = tag;
    }

    const options: OptionsWithUri = {
      method: 'POST',
      uri: `${baseUrl}/messages/sms/send`,
      headers,
      json: true,
      body,
    };

    return await context.helpers.request(options);
  }

  private async sentMessagesReport(
    context: IExecuteFunctions,
    itemIndex: number,
    baseUrl: string,
    headers: Record<string, string>
  ): Promise<ComteleResponse<SentMessage[]>> {
    const startDate = context.getNodeParameter('startDate', itemIndex) as string;
    const endDate = context.getNodeParameter('endDate', itemIndex) as string;
    const receiver = context.getNodeParameter('receiver', itemIndex) as string;
    const content = context.getNodeParameter('content', itemIndex) as string;
    const custom = context.getNodeParameter('custom', itemIndex) as string;
    const tag = context.getNodeParameter('tag', itemIndex) as string;
    const skip = context.getNodeParameter('skip', itemIndex) as number;
    const limit = context.getNodeParameter('limit', itemIndex) as number;
    const statuses = context.getNodeParameter('statuses', itemIndex) as string;

    const qs: Record<string, string | number> = {
      startDate,
      endDate,
      skip,
      limit,
    };

    if (receiver) {
      qs.receiver = receiver;
    }
    if (content) {
      qs.content = content;
    }
    if (custom) {
      qs.custom = custom;
    }
    if (tag) {
      qs.tag = tag;
    }
    if (statuses) {
      qs.statuses = statuses;
    }

    const options: OptionsWithUri = {
      method: 'GET',
      uri: `${baseUrl}/reports/messages/sent`,
      qs,
      headers,
      json: true,
    };

    return await context.helpers.request(options);
  }

  private parseButtons(
    buttonsData: unknown
  ): Array<{ text: string; url: string }> {
    if (!buttonsData || typeof buttonsData !== 'object') {
      return [];
    }

    const data = buttonsData as Record<string, unknown>;
    if (!data.buttonValues || !Array.isArray(data.buttonValues)) {
      return [];
    }

    return (data.buttonValues as Array<{ text: string; url: string }>).map(
      button => ({
        text: button.text,
        url: button.url,
      })
    );
  }

  private parseCards(
    cardsData: unknown
  ): Array<{
    cardTitle: string;
    cardMessage: string;
    cardImage?: string;
    buttons: Array<{ text: string; url: string }>;
  }> {
    if (!cardsData || typeof cardsData !== 'object') {
      return [];
    }

    const data = cardsData as Record<string, unknown>;
    if (!data.cardValues || !Array.isArray(data.cardValues)) {
      return [];
    }

    return (
      data.cardValues as Array<{
        cardTitle: string;
        cardMessage: string;
        cardImage?: string;
        buttons?: { buttonValues: Array<{ text: string; url: string }> };
      }>
    ).map(card => {
      const buttons = this.parseButtons(card.buttons);
      return {
        cardTitle: card.cardTitle,
        cardMessage: card.cardMessage,
        ...(card.cardImage && { cardImage: card.cardImage }),
        buttons,
      };
    });
  }
}
```
