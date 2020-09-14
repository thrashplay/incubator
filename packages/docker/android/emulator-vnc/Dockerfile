FROM thrashplay/android-sdk:30.0.2

USER root

ENV DEBIAN_FRONTEND=noninteractive \
  EMULATOR_HOME=/home/emulator \
  NO_VNC_HOME=/root/noVNC \
  PATH=${PATH}:${ANDROID_HOME}/emulator

# vnc configuration
ENV DISPLAY=:0 \
  VNC_COL_DEPTH=24 \
  VNC_RESOLUTION=1280x1024 \
  VNC_PASSWORD=abcd

RUN set -x \
  && : Install vnc and support packages \
  && apt-get update \
  && apt-get upgrade -y \
  && apt-get install -y --no-install-recommends \
    fvwm \
    iproute2 \
    tightvncserver \
    x11vnc \
    x11-apps \
    xvfb \
  && : Install emulator acceleration support \
  && apt-get install -y software-properties-common \
  && add-apt-repository "deb http://archive.ubuntu.com/ubuntu $(lsb_release -sc) universe" \
  && apt-get update \
  && apt-get install -y \
    qemu-kvm \
    libvirt-daemon-system \
    libvirt-clients \
    bridge-utils \
  && : Install gosu \
	&& apt-get install -y gosu \ 
	&& gosu nobody true \ 
  && : Install Android emulator \ 
  && sdkmanager "emulator" \
  && : Cleanup \
	&& rm -rf /var/lib/apt/lists/*

COPY scripts/* /usr/local/bin/
RUN chmod +x /usr/local/bin/*.sh

COPY .vnc/xstartup /usr/local/bin/xstartup

# xvnc server port, if $DISPLAY=:1 port will be 5901
EXPOSE 5901

ENTRYPOINT [ "/usr/local/bin/entrypoint.sh" ]
CMD [ "--tail-log" ]