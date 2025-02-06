import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

export class DriveAuthHandler {
  private static oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  static async handleAuth(req: NextApiRequest, res: NextApiResponse) {
    try {
      // Vérification du token
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Token manquant' });
      }

      // Configuration de l'authentification
      this.oauth2Client.setCredentials({ access_token: token });
      
      // Test de la connexion
      const drive = google.drive({ version: 'v3', auth: this.oauth2Client });
      await drive.files.list({ pageSize: 1 });

      return res.status(200).json({ status: 'authentifié' });
    } catch (error) {
      console.error('Erreur d\'authentification Drive:', error);
      return res.status(500).json({ 
        error: 'Erreur d\'authentification',
        details: error.message 
      });
    }
  }

  static async refreshToken(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { refresh_token } = req.body;
      if (!refresh_token) {
        return res.status(400).json({ error: 'Refresh token manquant' });
      }

      const response = await this.oauth2Client.refreshToken(refresh_token);
      return res.status(200).json(response.tokens);
    } catch (error) {
      console.error('Erreur de refresh token:', error);
      return res.status(500).json({
        error: 'Erreur de rafraîchissement du token',
        details: error.message
      });
    }
  }
}