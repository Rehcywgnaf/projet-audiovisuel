import { useState, useEffect } from 'react';
import { DriveService } from '@/services';

export const useDrive = (config: any) => {
  const [documents, setDocuments] = useState([]);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState(null);

  const driveService = new DriveService(config);

  const chargerDocuments = async (dossier: string) => {
    setChargement(true);
    try {
      await driveService.initialiser();
      const docs = await driveService.chargerDocuments(dossier);
      setDocuments(docs);
    } catch (err) {
      setErreur(err);
    } finally {
      setChargement(false);
    }
  };

  const gererPermissions = async (fileId: string, email: string, role: string) => {
    try {
      await driveService.mettreAJourPermissions(fileId, email, role);
      return true;
    } catch (err) {
      setErreur(err);
      return false;
    }
  };

  return {
    documents,
    chargement,
    erreur,
    chargerDocuments,
    gererPermissions
  };
};
