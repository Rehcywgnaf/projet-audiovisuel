// DocumentTemplates.js
export const documentTemplates = {
  artistic: {
    "Note d'intention": {
      sections: [
        {
          title: "Genèse du projet",
          placeholder: "Décrivez l'origine de votre projet, son point de départ..."
        },
        {
          title: "Vision artistique",
          placeholder: "Développez votre approche artistique, le style visuel..."
        },
        {
          title: "Public visé",
          placeholder: "Définissez votre public cible et la façon de l'atteindre..."
        }
      ],
      format: "PDF",
      maxPages: 5
    },
    "Synopsis": {
      sections: [
        {
          title: "Accroche",
          placeholder: "Une phrase percutante qui résume votre projet..."
        },
        {
          title: "Résumé",
          placeholder: "Développez votre histoire en 1-2 pages..."
        }
      ],
      format: "PDF",
      maxPages: 2
    }
  },
  
  technical: {
    "Fiche technique": {
      sections: [
        {
          title: "Caractéristiques techniques",
          fields: [
            "Format de tournage",
            "Format de diffusion",
            "Durée",
            "Langue"
          ]
        },
        {
          title: "Équipe technique",
          fields: [
            "Réalisation",
            "Image",
            "Son",
            "Montage"
          ]
        }
      ],
      format: "PDF",
      maxPages: 2
    },
    "Plan de travail": {
      sections: [
        {
          title: "Préparation",
          fields: [
            "Repérages",
            "Casting",
            "Tests techniques"
          ]
        },
        {
          title: "Tournage",
          fields: [
            "Dates",
            "Lieux",
            "Planning journalier"
          ]
        },
        {
          title: "Post-production",
          fields: [
            "Montage",
            "Étalonnage",
            "Mixage",
            "Livraison"
          ]
        }
      ],
      format: "Excel",
      sheets: ["Planning", "Équipe", "Matériel"]
    }
  },
  
  financial: {
    "Budget prévisionnel": {
      sections: [
        {
          title: "Droits artistiques",
          items: ["Droits d'auteur", "Droits musicaux"]
        },
        {
          title: "Personnel",
          items: ["Équipe technique", "Équipe artistique"]
        },
        {
          title: "Moyens techniques",
          items: ["Matériel de tournage", "Location véhicules"]
        },
        {
          title: "Post-production",
          items: ["Montage", "Étalonnage", "Mixage"]
        }
      ],
      format: "Excel",
      sheets: ["Dépenses", "Recettes", "Synthèse"]
    },
    "Plan de financement": {
      sections: [
        {
          title: "Apports",
          items: ["Apport producteur", "Coproducteurs"]
        },
        {
          title: "Aides publiques",
          items: ["CNC", "Régions", "Autres"]
        },
        {
          title: "Diffuseurs",
          items: ["TV", "Plateformes"]
        }
      ],
      format: "Excel",
      sheets: ["Financements", "Calendrier"]
    }
  },
  
  administrative: {
    "Fiche producteur": {
      sections: [
        {
          title: "Informations société",
          fields: [
            "Raison sociale",
            "SIRET",
            "Adresse",
            "Contact"
          ]
        },
        {
          title: "Track record",
          fields: [
            "Productions précédentes",
            "Récompenses",
            "Diffusions"
          ]
        }
      ],
      format: "PDF",
      maxPages: 3
    }
  }
};
