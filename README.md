# n8n-nodes-comtele-gateway

This is an n8n community node for integrating with the **Comtele Gateway API**. It provides a comprehensive set of operations for managing messaging, including SMS, RCS (Rich Communication Services), reports, and additional services.

## Features

The node supports 12 different operations:

1. **Cancel Messages Request** - Cancel pending message requests
2. **Get Balance** - Check your account balance
3. **Get Contact Groups** - Retrieve all contact groups
4. **Get Messages Requests Report** - Get detailed reports of sent message requests
5. **Get Routes** - Retrieve available messaging routes
6. **Received Messages Report** - Get reports of received messages
7. **Send RCS Basic Message** - Send simple RCS text messages
8. **Send RCS Card Message** - Send RCS messages with rich card layouts
9. **Send RCS Carousel Message** - Send RCS messages with carousel/slider functionality
10. **Send RCS File Message** - Send RCS messages with file attachments
11. **Send SMS Message** - Send traditional SMS messages
12. **Sent Messages Report** - Get reports of sent messages

## Installation

### Using n8n UI

1. Create a Workflow
2. Click on + to add a new node
3. Search for `SMS & RCS Message Gateway by Comtele`

### Using npm

```bash
npm install n8n-nodes-comtele-gateway
````

## Setup
### 1. Create Credentials
In n8n:

  1. Click on Settings in the sidebar
  2. Go to Credentials
  3. Create a new credential of type Comtele Gateway API
  3. Enter your X-API-Key (provided by Comtele)

### 2. Add Node to Workflow
  1. Create a new workflow
  2. Add a new node and search for `SMS & RCS Message Gateway by Comtele`
  3. Select the operation you want to perform
  4. Configure the parameters based on the selected operation
  5. Test the connection

## Usage Examples
### Get Account Balance

```bash
Node Configuration:
- Operation: Get Balance
- No parameters needed
```

### Send SMS Message

```bash
Node Configuration:
- Operation: Send SMS Message
- Receivers: ["11999999999"]
- Message: "Hello from N8N!"
- Route: 1
- Tag: "marketing"
```
  
### Send RCS Card Message

```bash
Node Configuration:
- Operation: Send RCS Card Message
- Receivers: ["11999999999"]
- Route: 1
- Card Title: "Special Offer"
- Card Message: "Get 50% off today!"
- Card Image URL: "https://example.com/image.jpg"
- Buttons:
  - Text: "Learn More", URL: "https://example.com"
  - Text: "Buy Now", URL: "https://shop.example.com"
 ```
    
### Get Message Reports

```bash
Node Configuration:
- Operation: Sent Messages Report
- Start Date: "2024-01-01T00:00:00Z"
- End Date: "2024-01-31T23:59:59Z"
- Limit: 100
```

## Date Format
All date parameters use the ISO 8601 format with timezone:

```bash
yyyy-MM-ddTHH:mm:ssZ
```

Examples:

- 2024-06-10T14:30:00Z
- 2024-01-01T00:00:00Z

## Parameters
### Common Parameters

- Receivers: Array of phone numbers (with country code, e.g., "11999999999")
- Contact Groups: Array of contact group IDs
- Route: Route ID to use for sending messages
- Schedule Date (optional): Date and time to schedule message sending
- Custom (optional): Custom field for tracking/filtering
- Tag (optional): Tag for message classification

### Query Parameters for Reports
- Start Date: Report period start
- End Date: Report period end
- Skip: Number of records to skip (pagination)
- Limit: Maximum records to return

## Error Handling
The node includes comprehensive error handling:

- Invalid credentials: Tests connection using the Balance endpoint
- Invalid parameters: Validates required fields
- API errors: Returns detailed error information from Comtele API

## Response Format
All responses follow the standard Comtele API format:

```bash
{
  "hasError": false,
  "message": "Success message or null",
  "object": {
    "// Response data based on operation"
  },
  "totalRecords": 0,
  "errors": []
}
```

## Support
For issues, questions, or suggestions, please visit:

- [GitHub Repository](https://github.com/comtele/n8n-nodes-comtele-gateway)
- [Comtele Documentation](https://developers.comtele.com.br/)

## License
This node is licensed under the MIT License. See LICENSE file for details.

##
**Developed by Comtele** - _Your messaging company_
