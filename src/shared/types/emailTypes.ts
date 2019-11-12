export type EmailBody = {
  to: [Recipient],
  cc: [Recipient],
  bcc: [Recipient],
  content: string
};

export type Recipient = {
  email: string;
  name?: string;
};

export type EmailField = 'to' | 'cc' | 'bcc';
