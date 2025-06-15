# MiniShop

MiniShop est une application e-commerce basée sur une architecture microservices. Elle est composée de trois services principaux, chacun responsable d’une fonctionnalité spécifique :
- **Product Service** : gestion du catalogue et des stocks produits.
- **Cart Service** : gestion des paniers clients (ajout/retrait d’articles, total, etc.).
- **Order Service** : gestion des commandes (création, suivi, statut, etc.).

Chaque service utilise sa propre base de données PostgreSQL et expose une API REST documentée avec Swagger. L’ensemble est conçu pour être facilement déployé sur Kubernetes.

## Structure du projet

product-service/ (API REST pour la gestion des produits)
cart-service/ (API REST pour la gestion des paniers)
order-service/ (API REST pour la gestion des commandes)
k8s/ (manifests Kubernetes pour le déploiement)


## Prérequis
- Docker (pour construire et exécuter les conteneurs)
- Kubernetes (minikube, k3d ou Docker Desktop avec Kubernetes activé)
- Make (pour exécuter les scripts de build et de déploiement)
- Node.js (nécessaire pour les tests ou le mode développement)

## Déploiement rapide (via Makefile)

### 1. Construction des images Docker
Depuis la racine de chaque fichier, exécutez :
```sh
	docker build --tag docker.io/cgayet/products-service:0.0.1 .
	docker build --tag docker.io/cgayet/cart-service:0.0.1 .
	docker build --tag docker.io/cgayet/order-service:0.0.1 .
	kind load docker-image docker.io/cgayet/products-service:0.0.1
	kind load docker-image docker.io/cgayet/cart-service:0.0.1
	kind load docker-image docker.io/cgayet/order-service:0.0.1 
```
Ces commandes vont créer les images Docker pour les trois services (product, cart et order) puis on va les load avec kind.

### 2. Lancement sur Kubernetes
Déployez l’ensemble de l’infrastructure avec :
```sh
make k8s-deploy
```
Cette commande applique les fichiers de configuration Kubernetes (namespace, ConfigMaps, volumes, déploiements et services) dans le namespace minishop.
On pense bien à apply dans le fichier .\k8s les services suivant :
```sh
kubectl apply -f product-service.yaml
kubectl apply -f cart-service.yaml
kubectl apply -f order-service.yaml
kubectl rollout restart deployment product-service -n minishop
kubectl rollout restart deployment cart-service -n minishop
kubectl rollout restart deployment order-service -n minishop
```
On peut le vérifier avec la commande suivante 
```sh
kubectl get deployments -n minishop
```

### 3. Accéder aux services
- Exposition : Par défaut, les services sont accessibles uniquement dans le cluster (ClusterIP). Pour les tester localement, utilisez les redirections de ports :
```sh
kubectl port-forward -n minishop svc/product-service 3000:3000
kubectl port-forward -n minishop svc/cart-service 3001:3000
kubectl port-forward -n minishop svc/order-service 3002:3000
```
- Swagger / Documentation OpenAPI : Chaque service expose sa documentation sur l’URL /api. Une fois le port-forward actif, ouvrez les liens suivants dans votre navigateur :

	- Product : http://localhost:3000/api

	- Cart : http://localhost:3001/api

	- Order : http://localhost:3002/api

### 4. Nettoyage du cluster
Pour supprimer tous les éléments déployés (namespace, volumes, services, etc.), lancez :
```sh
make k8s-clean
```

### Informations supplémentaires
- Dockerfile : Chaque service possède son propre Dockerfile à la racine de son dossier.

- Makefile : Le fichier Makefile situé à la racine contient les commandes pour construire, publier (optionnel), et déployer les services.

- Kubernetes : Tous les manifests Kubernetes (déploiements, services, volumes, etc.) sont centralisés dans le dossier k8s/.


