DOCKER_REPOSITORY ?= docker.io/cgayet

# get the branch name from git slugify it and use it as the image tag
# Image tag should be the version in the package.json if the branch is dev or main, otherwise it should be the branch name
GIT_BRANCH ?= $(shell git rev-parse --abbrev-ref HEAD | sed 's/[^a-zA-Z0-9]/-/g')
ifeq ($(GIT_BRANCH),$(filter $(GIT_BRANCH),dev main))
 IMAGE_TAG ?= $(shell npm pkg get version)
else
 IMAGE_TAG ?= $(GIT_BRANCH)
endif

IMAGE_NAME ?= products-service

default: help

help:
	 @egrep '^[a-zA-Z/]*+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

info: ## Print the information about the project
	@echo "DOCKER_IMAGE_REFERENCE=${DOCKER_REPOSITORY}/${IMAGE_NAME}:${IMAGE_TAG}"
	@echo "DOCKER_REPOSITORY=${DOCKER_REPOSITORY}"
	@echo "IMAGE_NAME=${IMAGE_NAME}"
	@echo "IMAGE_TAG=${IMAGE_TAG}"
	@echo "GIT_BRANCH=${GIT_BRANCH}"

image/ref: ## Print the information about the project
	@echo "${DOCKER_REPOSITORY}/${IMAGE_NAME}:${IMAGE_TAG}"

image/name: ## Print the information about the project
	@echo "${DOCKER_REPOSITORY}/${IMAGE_NAME}"

image/tag: ## Print the information about the project
	@echo "${IMAGE_TAG}"

install: ## Install dependencies of the project
	@npm install --no-audit

build/npm: install ## Build npm package
	@npm run build
	@npm prune

build/docker: ## Build the docker image
	@echo Image will be built using : [${DOCKER_REPOSITORY}/${IMAGE_NAME}:${IMAGE_TAG}]
	@docker build --tag ${DOCKER_REPOSITORY}/${IMAGE_NAME}:${IMAGE_TAG} .

push/docker:  ## Push the docker image
	@docker push ${DOCKER_REPOSITORY}/${IMAGE_NAME}:${IMAGE_TAG}

apply/kube:  ## Apply the configuration to the target environment
	@kubectl apply -f ./deploy/${ENV}
