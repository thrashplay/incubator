FROM alpine

ARG YQ_VERSION=3.3.2

RUN apk add --no-cache --no-progress \
  bash \
  curl \
  jq \
  py-pip && \
  pip install yq && yq --version

# Install kubectl from Docker Hub.
COPY --from=lachlanevenson/k8s-kubectl:v1.18.0 /usr/local/bin/kubectl /usr/local/bin/kubectl

ENTRYPOINT [ "/bin/sh" ]