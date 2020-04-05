# # use golang to build the docker-credential-helpers for 'arm'
# FROM golang:1.14.1-buster as credential-helpers-build

# ENV GOOS=linux
# ENV GOARCH=arm
# ENV CGO_ENABLED=1

# RUN apt-get update && apt-get install --yes \
#   g++ \
#   gcc \
#   git \
#   make 

# # this command fails because the root has no main(), but source is still retrieved
# # actual README is wrong, got info I needed from: https://github.com/docker/docker-credential-helpers/issues/116
# RUN go get github.com/docker/docker-credential-helpers ; exit 0
# RUN cd $GOPATH/src/github.com/docker/docker-credential-helpers && \
#   make pass && \
#   cp bin/docker-credential-pass /usr/local/bin/docker-credential-pass

FROM python:2.7.17-slim-buster

LABEL maintainer="Sean Kleinjung sean@thrashplay.com"

# RUN apt-get update && \
#   apt-get install --yes gpg pass && \
#   apt-get clean

# COPY --from=credential-helpers-build /usr/local/bin/docker-credential-pass /usr/local/bin
COPY --from=docker:19.03.8 /usr/local/bin/docker /usr/local/bin
COPY app/* /app/
COPY scripts/entry-point.sh /usr/local/bin

RUN chmod +x /app/docker-copyedit.py && \
  chmod +x /usr/local/bin/entry-point.sh && \
  docker -v 
  # && \
  # echo docker-credential-pass version: $(docker-credential-pass version)

ENTRYPOINT [ "/usr/local/bin/entry-point.sh" ]