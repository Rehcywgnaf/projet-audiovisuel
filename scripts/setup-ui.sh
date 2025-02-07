#!/bin/bash

# Installation des dépendances Radix UI
npm install @radix-ui/react-select @radix-ui/react-alert-dialog @radix-ui/react-slot

# Installation des dépendances utilitaires
npm install class-variance-authority clsx tailwind-merge

# Installation des dépendances pour les icônes et graphiques
npm install lucide-react recharts

# Installation des composants shadcn/ui
npx shadcn-ui@latest add select
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add progress

echo "Installation des composants UI terminée"
