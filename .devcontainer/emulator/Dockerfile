FROM thrashplay/android-emulator-vnc:dev

ARG AVD_SYSTEM_IMAGE
ENV AVD_SYSTEM_IMAGE=${AVD_SYSTEM_IMAGE}

RUN echo "y" | sdkmanager "${AVD_SYSTEM_IMAGE}"