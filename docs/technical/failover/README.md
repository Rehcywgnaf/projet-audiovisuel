# Documentation Technique - Tests Failover SAPAV

## Infrastructure Requise

### Serveurs
- 2 serveurs principaux (backend1, backend2)
- 2 serveurs de backup (backup1, backup2)
- 1 serveur de monitoring

### Configuration Réseau
- Load Balancer Nginx en frontal
- Réseau interne pour communication inter-serveurs
- IPs statiques pour tous les serveurs

### Outils Requis
- k6 pour les tests de charge
- curl pour les healthchecks
- Node.js v16+ pour le monitoring

## Installation et Configuration

### 1. Préparation des Serveurs
```bash
# Installation des dépendances
sudo apt update
sudo apt install -y nginx nodejs npm curl

# Installation de k6
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt update
sudo apt install k6
```

### 2. Configuration Nginx
- Déployer la configuration failover sur le load balancer :
```bash
sudo cp config/nginx/sapav-failover.conf /etc/nginx/conf.d/
sudo nginx -t  # Test de la configuration
sudo systemctl reload nginx
```

### 3. Installation Monitoring
- Déployer le composant DriveMonitoring sur le serveur de monitoring
- Configurer les alertes selon les seuils définis

## Procédure de Test

### Phase 1 : Vérification Préliminaire
1. Vérifier la disponibilité de tous les serveurs :
```bash
# Exécuter sur chaque serveur
curl -I http://[SERVER_IP]:3000/health
```

2. Valider la configuration Nginx :
```bash
sudo nginx -t
sudo nginx -T | grep "backup"  # Vérifier la présence des serveurs de backup
```

### Phase 2 : Tests de Charge
1. Lancer le dashboard de monitoring :
```bash
npm run start:monitoring
```

2. Exécuter les tests :
```bash
./tests/failover/run-failover-tests.sh
```

### Phase 3 : Validation Failover
Pendant l'exécution, vérifier :
- Temps de bascule (cible : <5s)
- Taux d'erreur pendant la transition (cible : <5%)
- Reprise automatique après restauration
- Continuité des sessions utilisateur

## Métriques et Seuils

### Performance
- Temps de réponse : <200ms (warning), <500ms (critique)
- Taux d'erreur : <1% (normal), <5% (max pendant failover)
- Débit : <180 req/min (warning), <250 req/min (critique)

### Failover
- Temps de détection : <3s
- Temps de bascule : <5s
- Temps de synchronisation : <30s

## Interprétation des Résultats

### Critères de Succès
1. Performance
   - 95% des requêtes sous 2000ms
   - Taux d'erreur global <5%
   - Zero perte de session utilisateur

2. Résilience
   - Bascule automatique réussie
   - Reprise sans intervention manuelle
   - Restauration propre du service primaire

### Analyse des Logs
Patterns à surveiller dans les logs Nginx :
```
# Pattern de bascule réussie
[notice] ... gracefully shutting down
[notice] ... start worker process ...

# Pattern d'erreur de bascule
[error] ... no live upstreams while connecting to upstream
```

## Résolution des Problèmes

### Problèmes Courants
1. Échec de la bascule
   - Vérifier les timeouts Nginx
   - Contrôler les healthchecks
   - Valider la configuration DNS

2. Latence élevée
   - Vérifier la charge des serveurs
   - Contrôler le cache Nginx
   - Analyser les connexions actives

3. Perte de sessions
   - Vérifier la réplication des sessions
   - Contrôler la synchronisation Redis
   - Valider les sticky sessions

## Maintenance et Mise à Jour

### Procédure de Mise à Jour
1. Mettre à jour un serveur de backup
2. Tester le serveur mis à jour
3. Basculer le trafic
4. Répéter pour les autres serveurs

### Tests Réguliers
- Planifier des tests mensuels
- Alterner les scénarios de panne
- Documenter les résultats

## Notes de Sécurité
- Limiter l'accès aux endpoints de healthcheck
- Sécuriser les logs de test
- Utiliser des connexions chiffrées
- Isoler le réseau de test

## Support et Contacts
- Équipe Infra : infra@sapav.com
- Équipe Dev : dev@sapav.com
- Support 24/7 : +XX XX XX XX XX