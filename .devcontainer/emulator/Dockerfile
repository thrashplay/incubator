FROM vnc:fvwm

ARG USER_ID
ARG GROUP_ID
ARG AVD_DEVICE=22
ARG AVD_SYSTEM_IMAGE=system-images;android-30;google_apis;x86

ENV USER_ID=${USER_ID} GROUP_ID=${GROUP_ID}
ENV AVD_SYSTEM_IMAGE=${AVD_SYSTEM_IMAGE} AVD_DEVICE=${AVD_DEVICE}

USER root
 
RUN echo "y" | sdkmanager "${AVD_SYSTEM_IMAGE}"

RUN adduser --disabled-password --gecos '' --uid "${USER_ID}" --gid "${GROUP_ID}" emulator_user 

USER emulator_user

RUN avdmanager create avd --force -n defaultAVD -k "${AVD_SYSTEM_IMAGE}" --device "${AVD_DEVICE}"