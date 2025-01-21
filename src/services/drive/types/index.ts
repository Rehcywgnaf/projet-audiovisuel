export interface DriveConfigOptions {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface DriveToken {
  access_token: string;
  refresh_token?: string;
  scope: string;
  token_type: string;
  expiry_date: number;
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  createdTime: string;
  modifiedTime: string;
}

export interface DriveListOptions {
  pageSize?: number;
  pageToken?: string;
  fields?: string;
  orderBy?: string;
  q?: string;
}