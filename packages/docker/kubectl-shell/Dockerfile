FROM alpine

ARG YQ_VERSION=3.3.2

RUN apk add --no-cache --no-progress \
  curl \
  jq && \
  wget -O /usr/local/bin/yq "https://github.com/mikefarah/yq/releases/download/${YQ_VERSION}/yq_linux_amd64" && \
  chmod +x /usr/local/bin/yq

# Install kubectl from Docker Hub.
COPY --from=lachlanevenson/k8s-kubectl:v1.10.3 /usr/local/bin/kubectl /usr/local/bin/kubectl

ENTRYPOINT [ "/bin/sh" ]