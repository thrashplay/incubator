FROM ubuntu:20.04

# install dependencies
# RUN apt-get update 
# RUN apt-get --quiet --yes install \ 
#       curl \
#       nano \
#       unzip \
#       xorriso \
#       xz-utils \
#       zip \
#     && \
#     apt-get clean

# copy scripts to image
COPY scripts /usr/local/bin
RUN chmod +x /usr/local/bin/*

WORKDIR /app

# Supported: k3os, raspios_lite, ubuntu
ARG DEFAULT_INPUT_DISK_IMAGE_PATH=/app/images/original.img
ARG DEFAULT_PARTITION_NUMBER=""
ARG DEFAULT_SCRIPT=/app/script/edit-disk-image

ENV \
  CHROOT=false \
  INPUT_DISK_IMAGE_PATH="${DEFAULT_INPUT_DISK_IMAGE_PATH}" \
  PARTITION_NUMBER="${DEFAULT_PARTITION_NUMBER}" \
  SCRIPT="${DEFAULT_SCRIPT}"

ENTRYPOINT [ "/usr/local/bin/entry-point" ]