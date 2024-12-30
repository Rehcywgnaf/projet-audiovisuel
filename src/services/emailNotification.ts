import { ProjectOpportunity } from './projectWatch';

export async function sendNotificationEmail(opportunity: ProjectOpportunity) {
  const emailContent = generateEmailContent(opportunity);
  // TODO: Intégrer service d'envoi d'email
  console.log('Email notification sent:', emailContent);
}

function generateEmailContent(opportunity: ProjectOpportunity) {
  return `
    Nouvel appel à projet détecté !

    ${opportunity.title}

    Description:
    ${opportunity.description}

    Critères principaux:
    ${Object.entries(opportunity.criteria)
      .map(([key, value]) => `- ${key}: ${value}`)
      .join('\n')}

    Score de correspondance: ${opportunity.matchScore}%

    En savoir plus: ${opportunity.url}
  `;
}
