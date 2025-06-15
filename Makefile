# Makefile MiniShop

DOCKER_REGISTRY ?= minishop
NAMESPACE ?= minishop

PRODUCT_SERVICE_IMAGE = $(DOCKER_REGISTRY)/product-service:latest
CART_SERVICE_IMAGE = $(DOCKER_REGISTRY)/cart-service:latest
ORDER_SERVICE_IMAGE = $(DOCKER_REGISTRY)/order-service:latest

.PHONY: build push k8s-deploy k8s-clean

build:
	docker build -t $(PRODUCT_SERVICE_IMAGE) ./product-service
	docker build -t $(CART_SERVICE_IMAGE) ./cart-service
	docker build -t $(ORDER_SERVICE_IMAGE) ./order-service

push:
	docker push $(PRODUCT_SERVICE_IMAGE)
	docker push $(CART_SERVICE_IMAGE)
	docker push $(ORDER_SERVICE_IMAGE)

k8s-deploy:
	kubectl apply -f k8s/namespace.yaml
	kubectl apply -f k8s/postgres-pv.yaml
	kubectl apply -f k8s/postgres-pvc.yaml
	kubectl apply -f k8s/postgres-config.yaml
	kubectl apply -f k8s/postgres-deployment.yaml
	kubectl apply -f k8s/postgres-service.yaml
	kubectl apply -f k8s/app-config.yaml
	kubectl apply -f k8s/app-deployment.yaml

k8s-clean:
	kubectl delete -f k8s/app-deployment.yaml --ignore-not-found
	kubectl delete -f k8s/app-config.yaml --ignore-not-found
	kubectl delete -f k8s/postgres-service.yaml --ignore-not-found
	kubectl delete -f k8s/postgres-deployment.yaml --ignore-not-found
	kubectl delete -f k8s/postgres-config.yaml --ignore-not-found
	kubectl delete -f k8s/postgres-pvc.yaml --ignore-not-found
	kubectl delete -f k8s/postgres-pv.yaml --ignore-not-found
	kubectl delete -f k8s/namespace.yaml --ignore-not-found 