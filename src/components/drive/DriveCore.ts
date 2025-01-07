import { GoogleDrive } from '@google-cloud/drive';

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: Date;
  size: number;
}

interface DrivePermission {
  type: 'user' | 'group' | 'domain' | 'anyone';
  role: 'owner' | 'organizer' | 'fileOrganizer' | 'writer' | 'commenter' | 'reader';
  emailAddress?: string;
}

export class DriveCore {
  private driveClient: GoogleDrive;
  
  constructor() {
    this.driveClient = new GoogleDrive({
      scopes: ['https://www.googleapis.com/auth/drive'],
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
    });
  }

  async syncFiles(folderId: string): Promise<DriveFile[]> {
    try {
      const response = await this.driveClient.files.list({
        q: `'${folderId}' in parents and trashed = false`,
        fields: 'files(id, name, mimeType, modifiedTime, size)'
      });

      return response.data.files.map(file => ({
        id: file.id,
        name: file.name,
        mimeType: file.mimeType,
        modifiedTime: new Date(file.modifiedTime),
        size: parseInt(file.size)
      }));
    } catch (error) {
      await this.handleError(error as Error);
      throw error;
    }
  }

  async updatePermissions(fileId: string, permissions: DrivePermission[]): Promise<void> {
    try {
      await Promise.all(permissions.map(permission =>
        this.driveClient.permissions.create({
          fileId,
          requestBody: {
            type: permission.type,
            role: permission.role,
            emailAddress: permission.emailAddress
          }
        })
      ));
    } catch (error) {
      await this.handleError(error as Error);
      throw error;
    }
  }

  private async handleError(error: Error): Promise<void> {
    console.error('Erreur DriveCore:', error);
    
    if (error.message.includes('quota')) {
      await this.notifyQuotaExceeded();
    } else if (error.message.includes('permission')) {
      await this.notifyPermissionDenied();
    }
  }

  private async notifyQuotaExceeded(): Promise<void> {
    await this.notify('quota_exceeded', {
      level: 'error',
      message: 'Quota Drive dépassé',
      action: 'cleanup_required'
    });
  }

  private async notifyPermissionDenied(): Promise<void> {
    await this.notify('permission_denied', {
      level: 'error',
      message: 'Accès refusé',
      action: 'check_permissions'
    });
  }

  private async notify(type: string, data: any): Promise<void> {
    await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, data })
    });
  }
}