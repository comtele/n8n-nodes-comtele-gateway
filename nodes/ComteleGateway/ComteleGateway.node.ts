import { INodeType, INodeTypeDescription, NodeConnectionTypes } from 'n8n-workflow';

export class ComteleGateway implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'SMS/RCS Message Gateway by Comtele',
		documentationUrl: 'https://developers.comtele.com.br/',
		name: 'comtele',
		icon: 'file:comtelegateway.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
		description: 'Send SMS and RCS messages',
		defaults: {
			name: 'SMS/RCS Message Gateway by Comtele',
		},
		codex: {
			categories: ['Communication'],
			subcategories: {
				Communication: ['Messaging'],
			},
			resources: {
				primaryDocumentation: [
					{
						url: 'https://developers.comtele.com.br/',
					},
				],
			},
			alias: ['sms', 'rcs', 'message', 'messaging', 'text message', 'gateway'],
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'comteleGatewayApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.comtele.com.br',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': '={{$credentials.apiKey}}',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Others',
						value: 'others',
					},
					{
						name: 'RCS',
						value: 'rcs',
					},
					{
						name: 'SMS',
						value: 'sms',
					},
				],
				default: 'sms',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['sms'],
					},
				},
				options: [
					{
						name: 'Send SMS Message',
						value: 'sendSmsMessage',
						description: 'Send SMS message',
						action: 'Send SMS message',
						routing: {
							request: {
								method: 'POST',
								url: '/messages/sms/send',
								body: {
									receivers: '={{$parameter.receivers.map(r => r.trim())}}',
									contactGroups: '={{$parameter.contactGroups.map(cg => parseInt(cg, 10))}}',
									message: '={{$parameter.message}}',
									route: '={{$parameter.route}}',
									'={{$parameter.scheduleDate ? "scheduleDate" : undefined}}': '={{$parameter.scheduleDate}}',
									'={{$parameter.custom ? "custom" : undefined}}': '={{$parameter.custom}}',
									'={{$parameter.tag ? "tag" : undefined}}': '={{$parameter.tag}}',
								},
							},
						},
					},
				],
				required: true,
				default: 'sendSmsMessage',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['rcs'],
					},
				},
				options: [
					{
						name: 'Send RCS Basic Message',
						value: 'sendRcsBasicMessage',
						description: 'Send RCS basic text message',
						action: 'Send RCS basic message',
						routing: {
							request: {
								method: 'POST',
								url: '/messages/rcs/basic/send',
								body: {
									receivers: '={{$parameter.receivers.map(r => r.trim())}}',
									contactGroups: '={{$parameter.contactGroups.map(cg => parseInt(cg, 10))}}',
									message: '={{$parameter.message}}',
									route: '={{$parameter.route}}',
									'={{$parameter.scheduleDate ? "scheduleDate" : undefined}}': '={{$parameter.scheduleDate}}',
									'={{$parameter.custom ? "custom" : undefined}}': '={{$parameter.custom}}',
									'={{$parameter.tag ? "tag" : undefined}}': '={{$parameter.tag}}',
								},
							},
						},
					},
					{
						name: 'Send RCS Card Message',
						value: 'sendRcsCardMessage',
						description: 'Send RCS card message',
						action: 'Send RCS card message',
						routing: {
							request: {
								method: 'POST',
								url: '/messages/rcs/card/send',
								body: {
									receivers: '={{$parameter.receivers.map(r => r.trim())}}',
									contactGroups: '={{$parameter.contactGroups.map(cg => parseInt(cg, 10))}}',
									route: '={{$parameter.route}}',
									cardTitle: '={{$parameter.cardTitle}}',
									cardMessage: '={{$parameter.cardMessage}}',
									'={{$parameter.cardImage ? "cardImage" : undefined}}': '={{$parameter.cardImage}}',
									buttons: '={{$parameter.buttons.buttonValues}}',
									'={{$parameter.scheduleDate ? "scheduleDate" : undefined}}': '={{$parameter.scheduleDate}}',
									'={{$parameter.custom ? "custom" : undefined}}': '={{$parameter.custom}}',
									'={{$parameter.tag ? "tag" : undefined}}': '={{$parameter.tag}}',
								},
							},
						},
					},
					{
						name: 'Send RCS Carousel Message',
						value: 'sendRcsCarouselMessage',
						description: 'Send RCS carousel message',
						action: 'Send RCS carousel message',
						routing: {
							request: {
								method: 'POST',
								url: '/messages/rcs/carousel/send',
								body: {
									receivers: '={{$parameter.receivers.map(r => r.trim())}}',
									contactGroups: '={{$parameter.contactGroups.map(cg => parseInt(cg, 10))}}',
									route: '={{$parameter.route}}',
									cards:
										'={{$parameter.cards.cardValues.map(card => ({ cardTitle: card.cardTitle, cardMessage: card.cardMessage, ...(card.cardImage && { cardImage: card.cardImage }), buttons: card.buttons?.buttonValues || [] }))}}',
									'={{$parameter.scheduleDate ? "scheduleDate" : undefined}}': '={{$parameter.scheduleDate}}',
									'={{$parameter.custom ? "custom" : undefined}}': '={{$parameter.custom}}',
									'={{$parameter.tag ? "tag" : undefined}}': '={{$parameter.tag}}',
								},
							},
						},
					},
					{
						name: 'Send RCS File Message',
						value: 'sendRcsFileMessage',
						description: 'Send RCS file message',
						action: 'Send RCS file message',
						routing: {
							request: {
								method: 'POST',
								url: '/messages/rcs/file/send',
								body: {
									receivers: '={{$parameter.receivers.map(r => r.trim())}}',
									contactGroups: '={{$parameter.contactGroups.map(cg => parseInt(cg, 10))}}',
									route: '={{$parameter.route}}',
									file: '={{$parameter.file}}',
									fileName: '={{$parameter.fileName}}',
									'={{$parameter.scheduleDate ? "scheduleDate" : undefined}}': '={{$parameter.scheduleDate}}',
									'={{$parameter.custom ? "custom" : undefined}}': '={{$parameter.custom}}',
									'={{$parameter.tag ? "tag" : undefined}}': '={{$parameter.tag}}',
								},
							},
						},
					},
				],
				required: true,
				default: 'sendRcsBasicMessage',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['others'],
					},
				},
				options: [
					{
						name: 'Cancel Messages Request',
						value: 'cancelMessagesRequest',
						description: 'Cancel a message request',
						action: 'Cancel messages request',
						routing: {
							request: {
								method: 'POST',
								url: '/messages/request/cancel',
								body: {
									requestId: '={{$parameter.requestId}}',
								},
							},
						},
					},
					{
						name: 'Get Balance',
						value: 'getBalance',
						description: 'Get account balance',
						action: 'Get balance',
						routing: {
							request: {
								method: 'GET',
								url: '/balance',
							},
						},
					},
					{
						name: 'Get Contact Groups',
						value: 'getContactGroups',
						description: 'Get all contact groups',
						action: 'Get contact groups',
						routing: {
							request: {
								method: 'GET',
								url: '/contacts',
							},
						},
					},
					{
						name: 'Get Messages Requests Report',
						value: 'getMessagesRequestsReport',
						description: 'Get messages requests report with filters',
						action: 'Get messages requests report',
						routing: {
							request: {
								method: 'GET',
								url: '/reports/messages/requests',
								qs: {
									startDate: '={{$parameter.startDate}}',
									endDate: '={{$parameter.endDate}}',
									skip: '={{$parameter.skip}}',
									limit: '={{$parameter.limit}}',
								},
							},
						},
					},
					{
						name: 'Get Routes',
						value: 'getRoutes',
						description: 'Get all available routes',
						action: 'Get routes',
						routing: {
							request: {
								method: 'GET',
								url: '/routes',
							},
						},
					},
					{
						name: 'Received Messages Report',
						value: 'receivedMessagesReport',
						description: 'Get received messages report',
						action: 'Get received messages report',
						routing: {
							send: {
								preSend: [
									async function (this, requestOptions) {
										const statuses = this.getNodeParameter('statuses', 0) as string[];
										if (statuses && Array.isArray(statuses) && statuses.length > 0) {
											const baseUrl = requestOptions.url || '';
											const params = new URLSearchParams();
											
											// Add existing query parameters
											if (requestOptions.qs) {
												for (const [key, value] of Object.entries(requestOptions.qs)) {
													if (value !== undefined && value !== null) {
														params.append(key, String(value));
													}
												}
											}
											
											// Add statuses as multiple query parameters
											statuses.forEach(status => params.append('statuses', status));
											
											requestOptions.url = `${baseUrl}?${params.toString()}`;
											delete requestOptions.qs;
										}
										return requestOptions;
									},
								],
							},
							request: {
								method: 'GET',
								url: '/reports/messages/received',
								qs: {
									startDate: '={{$parameter.startDate}}',
									endDate: '={{$parameter.endDate}}',
									'={{$parameter.sender ? "sender" : undefined}}': '={{$parameter.sender}}',
									skip: '={{$parameter.skip}}',
									limit: '={{$parameter.limit}}',
								},
							},
						},
					},
					{
						name: 'Sent Messages Report',
						value: 'sentMessagesReport',
						description: 'Get sent messages report',
						action: 'Get sent messages report',
						routing: {
							send: {
								preSend: [
									async function (this, requestOptions) {
										const statuses = this.getNodeParameter('statuses', 0) as string[];
										if (statuses && Array.isArray(statuses) && statuses.length > 0) {
											const baseUrl = requestOptions.url || '';
											const params = new URLSearchParams();
											
											// Add existing query parameters
											if (requestOptions.qs) {
												for (const [key, value] of Object.entries(requestOptions.qs)) {
													if (value !== undefined && value !== null) {
														params.append(key, String(value));
													}
												}
											}
											
											// Add statuses as multiple query parameters
											statuses.forEach(status => params.append('statuses', status));
											
											requestOptions.url = `${baseUrl}?${params.toString()}`;
											delete requestOptions.qs;
										}
										return requestOptions;
									},
								],
							},
							request: {
								method: 'GET',
								url: '/reports/messages/sent',
								qs: {
									startDate: '={{$parameter.startDate}}',
									endDate: '={{$parameter.endDate}}',
									'={{$parameter.receiver ? "receiver" : undefined}}': '={{$parameter.receiver}}',
									'={{$parameter.content ? "content" : undefined}}': '={{$parameter.content}}',
									'={{$parameter.custom ? "custom" : undefined}}': '={{$parameter.custom}}',
									'={{$parameter.tag ? "tag" : undefined}}': '={{$parameter.tag}}',
									skip: '={{$parameter.skip}}',
									limit: '={{$parameter.limit}}',
								},
							},
						},
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
				placeholder: '1d333cee-5cfa-4f10-9211-5e5886420220',
				default: '',
				description: 'The ID of the message request to cancel',
				displayOptions: {
					show: {
						resource: ['others'],
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
						resource: ['others'],
						operation: ['getMessagesRequestsReport', 'receivedMessagesReport', 'sentMessagesReport'],
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
						resource: ['others'],
						operation: ['getMessagesRequestsReport', 'receivedMessagesReport', 'sentMessagesReport'],
					},
				},
			},

			// Received Messages Report Fields
			{
				displayName: 'Statuses',
				name: 'statuses',
				type: 'string',
				typeOptions: {
					multipleValues: true,
				},
				required: false,
				default: [],
				placeholder: 'Sent',
				description: 'Filter by message statuses',
				displayOptions: {
					show: {
						resource: ['others'],
						operation: ['receivedMessagesReport', 'sentMessagesReport'],
					},
				},
			},
			{
				displayName: 'Sender',
				name: 'sender',
				type: 'string',
				required: false,
				default: '',
				placeholder: '11999997777',
				description: 'Filter by sender phone number',
				displayOptions: {
					show: {
						resource: ['others'],
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
						resource: ['others'],
						operation: ['getMessagesRequestsReport', 'receivedMessagesReport', 'sentMessagesReport'],
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
						resource: ['others'],
						operation: ['getMessagesRequestsReport', 'receivedMessagesReport', 'sentMessagesReport'],
					},
				},
			},

			// Send Messages Common Fields
			{
				displayName: 'Receivers',
				name: 'receivers',
				type: 'string',
				typeOptions: {
					multipleValues: true,
				},
				required: true,
				placeholder: '11999997777',
				default: [],
				description: 'List of recipient phone numbers',
				displayOptions: {
					show: {
						resource: ['sms', 'rcs'],
						operation: [
							'sendRcsBasicMessage',
							'sendRcsCardMessage',
							'sendRcsCarouselMessage',
							'sendRcsFileMessage',
							'sendSmsMessage',
						],
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
						resource: ['sms', 'rcs'],
						operation: [
							'sendRcsBasicMessage',
							'sendRcsCardMessage',
							'sendRcsCarouselMessage',
							'sendRcsFileMessage',
							'sendSmsMessage',
						],
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
						resource: ['sms', 'rcs'],
						operation: [
							'sendRcsBasicMessage',
							'sendRcsCardMessage',
							'sendRcsCarouselMessage',
							'sendRcsFileMessage',
							'sendSmsMessage',
						],
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
						resource: ['sms', 'rcs'],
						operation: [
							'sendRcsBasicMessage',
							'sendRcsCardMessage',
							'sendRcsCarouselMessage',
							'sendRcsFileMessage',
							'sendSmsMessage',
						],
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
						resource: ['sms', 'rcs', 'others'],
						operation: [
							'sendRcsBasicMessage',
							'sendRcsCardMessage',
							'sendRcsCarouselMessage',
							'sendRcsFileMessage',
							'sendSmsMessage',
							'sentMessagesReport',
						],
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
						resource: ['sms', 'rcs', 'others'],
						operation: [
							'sendRcsBasicMessage',
							'sendRcsCardMessage',
							'sendRcsCarouselMessage',
							'sendRcsFileMessage',
							'sendSmsMessage',
							'sentMessagesReport',
						],
					},
				},
			},

			// Text Message Fields
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'Hello, this is a test message',
				description: 'Message content',
				displayOptions: {
					show: {
						resource: ['sms', 'rcs'],
						operation: ['sendRcsBasicMessage', 'sendSmsMessage'],
					},
				},
			},

			// Card Message Fields
			{
				displayName: 'Card Title',
				name: 'cardTitle',
				type: 'string',
				required: true,
				default: '',
				description: 'Card title',
				displayOptions: {
					show: {
						resource: ['rcs'],
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
				description: 'Card message content',
				displayOptions: {
					show: {
						resource: ['rcs'],
						operation: ['sendRcsCardMessage'],
					},
				},
			},
			{
				displayName: 'Card Image',
				name: 'cardImage',
				type: 'string',
				required: false,
				default: '',
				placeholder: 'https://example.com/image.jpg',
				description: 'Card image URL',
				displayOptions: {
					show: {
						resource: ['rcs'],
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
				required: true,
				default: {},
				placeholder: 'Add Button',
				options: [
					{
						name: 'buttonValues',
						displayName: 'Button',
						values: [
							{
								displayName: 'Text',
								name: 'text',
								type: 'string',
								default: '',
								description: 'Button text',
							},
							{
								displayName: 'URL',
								name: 'url',
								type: 'string',
								default: '',
								placeholder: 'https://example.com',
								description: 'Button URL',
							},
						],
					},
				],
				displayOptions: {
					show: {
						resource: ['rcs'],
						operation: ['sendRcsCardMessage'],
					},
				},
			},

			// Carousel Message Fields
			{
				displayName: 'Cards',
				name: 'cards',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				required: true,
				default: {},
				placeholder: 'Add Card',
				options: [
					{
						name: 'cardValues',
						displayName: 'Card',
						values: [
							{
								displayName: 'Card Title',
								name: 'cardTitle',
								type: 'string',
								default: '',
								description: 'Card title',
							},
							{
								displayName: 'Card Message',
								name: 'cardMessage',
								type: 'string',
								default: '',
								description: 'Card message content',
							},
							{
								displayName: 'Card Image',
								name: 'cardImage',
								type: 'string',
								default: '',
								placeholder: 'https://example.com/image.jpg',
								description: 'Card image URL',
							},
							{
								displayName: 'Buttons',
								name: 'buttons',
								type: 'fixedCollection',
								typeOptions: {
									multipleValues: true,
								},
								default: {},
								placeholder: 'Add Button',
								options: [
									{
										name: 'buttonValues',
										displayName: 'Button',
										values: [
											{
												displayName: 'Text',
												name: 'text',
												type: 'string',
												default: '',
												description: 'Button text',
											},
											{
												displayName: 'URL',
												name: 'url',
												type: 'string',
												placeholder: 'https://example.com',
												default: '',
												description: 'Button URL',
											},
										],
									},
								],
							},
						],
					},
				],
				displayOptions: {
					show: {
						resource: ['rcs'],
						operation: ['sendRcsCarouselMessage'],
					},
				},
			},

			// File Message Fields
			{
				displayName: 'File',
				name: 'file',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'https://example.com/file.pdf',
				description: 'File URL content',
				displayOptions: {
					show: {
						resource: ['rcs'],
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
				description: 'File name',
				displayOptions: {
					show: {
						resource: ['rcs'],
						operation: ['sendRcsFileMessage'],
					},
				},
			},

			// Sent Messages Report Filters
			{
				displayName: 'Receiver',
				name: 'receiver',
				type: 'string',
				required: false,
				default: '',
				placeholder: '11999997777',
				description: 'Filter by receiver phone number',
				displayOptions: {
					show: {
						resource: ['others'],
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
				placeholder: 'Hello, this is a test message',
				displayOptions: {
					show: {
						resource: ['others'],
						operation: ['sentMessagesReport'],
					},
				},
			},
		],
	};
}
