#!/bin/bash

# create our AVD
avdmanager create avd --force -n defaultAVD -k "${AVD_SYSTEM_IMAGE}" --device "${AVD_DEVICE}"

mkdir -p ~/.vnc
cp /usr/local/bin/xstartup ~/.vnc
if [ ! -f ~/.vnc/passwd ]; then
    x11vnc -storepasswd "${VNC_PASSWORD}" ~/.vnc/passwd
fi

Xvfb -screen 1 "${VNC_RESOLUTION}x${VNC_COL_DEPTH}" -ac -nolisten unix &
sleep 5

export DISPLAY=:1
x11vnc -rfbauth ~/.vnc/passwd -o ~/.vnc/vnc.log -bg -6 -listen 0.0.0.0 -noxrecord -noxfixes -noxdamage -forever -display :1 &
# xfce4-session &
sleep 5

# #resolve_vnc_connection
# VNC_IP=$(ip addr show eth0 | grep -Po 'inet \K[\d.]+')
# VNC_PORT="590"${DISPLAY:1}
# NO_VNC_PORT="690"${DISPLAY:1}

# (echo "${VNC_PASSWORD}" && echo "${VNC_PASSWORD}" && echo "n") | vncpasswd

# ##start vncserver and noVNC webclient
# # $NO_VNC_HOME/utils/launch.sh --vnc $VNC_IP:$VNC_PORT --listen $NO_VNC_PORT &
# USER=android vncserver "${DISPLAY}" -depth "${VNC_COL_DEPTH}" -geometry "${VNC_RESOLUTION}"
# sleep 1
# ##log connect options
# echo -e "\n------------------ VNC environment started ------------------"
# echo -e "\nVNCSERVER started on DISPLAY= $DISPLAY \n\t=> connect via VNC viewer with $VNC_IP:$VNC_PORT"
# echo -e "\nnoVNC HTML client started:\n\t=> connect via http://$VNC_IP:$NO_VNC_PORT/vnc_auto.html?password=..."

# for i in "$@"
# do
# case $i in
#     # if option `-t` or `--tail-log` block the execution and tail the VNC log
#     -t|--tail-log)
#     echo -e "\n------------------ /home/android/*$DISPLAY.log ------------------"
#     tail -f ~/fvwm.log
#     # tail -f /dev/null
#     ;;
#     *)
#     # unknown option ==> do nothing
#     ;;
# esac
# done

sleep infinity
