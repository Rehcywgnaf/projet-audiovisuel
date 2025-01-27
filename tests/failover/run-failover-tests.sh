#!/bin/bash

# Configuration
MAIN_SERVERS=("backend1.sapav.local" "backend2.sapav.local")
BACKUP_SERVERS=("backup1.sapav.local" "backup2.sapav.local")
TEST_DURATION=480  # 8 minutes total

echo "🚀 Démarrage des tests de failover"
echo "--------------------------------"

# Fonction de vérification de la santé d'un serveur
check_health() {
    local server=$1
    curl -s -o /dev/null -w "%{http_code}" "http://$server:3000/health"
}

# Vérification initiale des serveurs
echo "📝 Vérification initiale des serveurs..."
for server in "${MAIN_SERVERS[@]}" "${BACKUP_SERVERS[@]}"; do
    status=$(check_health $server)
    if [ "$status" == "200" ]; then
        echo "✅ $server: OK"
    else
        echo "❌ $server: NOK (status: $status)"
        echo "⚠️  Arrêt des tests - Un serveur n'est pas disponible"
        exit 1
    fi
done

echo "
🔄 Plan de test:
1. Charge normale (2min)
2. Augmentation charge (1min)
3. Simulation panne serveur principal
4. Validation failover (2min)
5. Restauration serveur principal
6. Validation retour normal (2min)
"

# Démarrage des tests k6
echo "▶️  Lancement des tests de charge..."
k6 run tests/failover/failover-test.js &
K6_PID=$!

# Attente avant simulation de panne
echo "⏳ Attente charge normale (3min)..."
sleep 180

# Simulation panne serveur principal
echo "🔌 Simulation panne serveur principal..."
sudo systemctl stop nginx-backend1

# Attente validation failover
echo "🔄 Validation failover en cours..."
sleep 120

# Restauration serveur principal
echo "🔧 Restauration serveur principal..."
sudo systemctl start nginx-backend1

# Attente fin des tests
echo "⏳ Attente fin des tests..."
wait $K6_PID

# Vérification finale
echo "📊 Vérification finale des serveurs..."
for server in "${MAIN_SERVERS[@]}" "${BACKUP_SERVERS[@]}"; do
    status=$(check_health $server)
    if [ "$status" == "200" ]; then
        echo "✅ $server: OK"
    else
        echo "⚠️  $server: NOK (status: $status)"
    fi
done

echo "--------------------------------"
echo "✅ Tests de failover terminés"