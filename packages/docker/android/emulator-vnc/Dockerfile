FROM thrashplay/android-sdk:30.0.2

    # firefox \
    # supervisor \
    # unzip \
    # vim \

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

RUN echo "y" | sdkmanager 'system-images;android-30;google_apis;x86_64'
RUN echo "y" | sdkmanager 'system-images;android-30;google_apis;x86'
RUN echo "y" | sdkmanager 'system-images;android-28;default;x86_64'
RUN echo "y" | sdkmanager 'system-images;android-28;default;x86'

RUN apt-get install -y xfce4

RUN apt-get install -y software-properties-common \
  && add-apt-repository "deb http://archive.ubuntu.com/ubuntu $(lsb_release -sc) universe" \
  && apt-get update \
  && apt-get install -y \
    qemu-kvm \
    libvirt-daemon-system \
    libvirt-clients \
    bridge-utils \
  && adduser "android" libvirt \
  && adduser "android" kvm
    # ubuntu-vm-builder \

RUN apt-get install -y xfce4-session

COPY .vnc /home/android/.vnc
COPY scripts/start-vnc.sh /usr/local/bin/start-vnc.sh
RUN chown -R android:android /home/android/.vnc \
  && chmod +x /usr/local/bin/start-vnc.sh /home/android/.vnc/xstartup

USER android

RUN avdmanager create avd --force -n defaultAVD -k 'system-images;android-30;google_apis;x86' --device 22

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