# Module Team SAPAV

## Structure
```
/src/components/team/
├── core/                # Logique métier
│   ├── TeamManager.ts   # Gestion état et opérations
│   ├── types.ts        # Types partagés
│   └── validation.ts   # Validation données
├── ui/
│   ├── common/         # Composants partagés
│   │   └── ValidationError.tsx
│   ├── dashboard/      # Interface tableau de bord
│   │   ├── Dashboard.tsx
│   │   ├── KPIs.tsx
│   │   ├── Navigation.tsx
│   │   └── index.ts
│   └── tracking/       # Suivi des équipes
│       └── MemberForm.tsx
└── index.ts           # Exports centralisés
```

## Utilisation
Importer les composants depuis le module :
```typescript
import { 
  // Core
  TeamManager,
  type Team,
  type TeamMember,
  
  // UI Components
  Dashboard,
  KPIs,
  MemberForm,
  ValidationError
} from '@/components/team';
```

## Points clés
- Architecture modulaire
- Séparation claire UI/Logique
- Composants réutilisables
- Tests unitaires par composant
- Documentation maintenue

## Migration des anciens composants
Les anciens composants ont été migrés depuis :
- /src/components/Teams/
- /src/components/TeamDashboard/
- /src/components/teams/

Les fichiers sources sont maintenant dans cette nouvelle structure.
