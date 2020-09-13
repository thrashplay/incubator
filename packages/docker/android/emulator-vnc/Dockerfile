FROM thrashplay/android-sdk:30.0.2

USER root

ENV DEBIAN_FRONTEND noninteractive
ENV NO_VNC_HOME /root/noVNC

RUN set -x \
  && : Install xvnc / xfce and support packages \
  && apt-get update \
  && apt-get upgrade -y \
  && apt-get install -y --no-install-recommends \
    fvwm \
    iproute2 \
    tightvncserver \
    x11vnc \
    x11-apps \
    xvfb

RUN apt-get install -y xfce4

RUN apt-get install -y software-properties-common \
  && add-apt-repository "deb http://archive.ubuntu.com/ubuntu $(lsb_release -sc) universe" \
  && apt-get update \
  && apt-get install -y \
    qemu-kvm \
    libvirt-daemon-system \
    libvirt-clients \
    bridge-utils
    # ubuntu-vm-builder \

RUN apt-get install -y xfce4-session

COPY scripts/start-vnc.sh /usr/local/bin/start-vnc.sh
RUN chmod +x /usr/local/bin/start-vnc.sh

# xvnc server port, if $DISPLAY=:1 port will be 5901
EXPOSE 5900
# novnc web port
EXPOSE 6901

# vnc configuration
ENV DISPLAY :0
ENV VNC_COL_DEPTH 24
ENV VNC_RESOLUTION 1280x1024
ENV VNC_PASSWORD abcd

CMD [ "/usr/local/bin/start-vnc.sh", "--tail-log" ] 