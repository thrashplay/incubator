FROM alpine:3.11.5 as pause_builder

# make a small program that pauses indefinitely
RUN apk update && apk add --no-cache gcc musl-dev && \
  printf "#include <unistd.h>\nint main() { for(;;) pause(); }" > pause.c && \
  gcc -o /usr/local/bin/pause pause.c && \
  chmod +x /usr/local/bin/pause

FROM alpine:3.11.5

RUN apk update && apk add --no-cache tini

COPY --from=docker:19.03.8 /usr/local/bin/docker /usr/local/bin
COPY --from=pause_builder /usr/local/bin/pause /usr/local/bin/pause
COPY scripts/entry-point.sh /usr/local/bin
RUN chmod +x /usr/local/bin/entry-point.sh && mkdir -p /var/run/service-wrapper

ENTRYPOINT [ "/sbin/tini", "-g", "--", "/usr/local/bin/entry-point.sh" ]