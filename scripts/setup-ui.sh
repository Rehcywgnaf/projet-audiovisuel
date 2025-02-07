#!/bin/bash

echo "Installation des dépendances de base..."
# Installation des dépendances Radix UI
npm install @radix-ui/react-select @radix-ui/react-alert-dialog @radix-ui/react-slot

# Installation des dépendances utilitaires
npm install class-variance-authority clsx tailwind-merge

# Installation des dépendances pour les icônes et graphiques
npm install lucide-react recharts

echo "Installation des composants shadcn/ui..."
# Initialisation de shadcn-ui si nécessaire
npx shadcn-ui@latest init

# Installation des composants shadcn/ui
echo "Installation des composants select..."
npx shadcn-ui@latest add select

echo "Installation des composants alert..."
npx shadcn-ui@latest add alert

echo "Installation des composants button..."
npx shadcn-ui@latest add button

echo "Installation des composants card..."
npx shadcn-ui@latest add card

echo "Installation des composants badge..."
npx shadcn-ui@latest add badge

echo "Installation des composants progress..."
npx shadcn-ui@latest add progress

echo "Installation des composants UI terminée"
