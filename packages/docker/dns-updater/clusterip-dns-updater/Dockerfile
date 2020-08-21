FROM thrashplay/cloudflare-dns:latest

COPY scripts /usr/local/bin
RUN chmod +x /usr/local/bin/*

CMD [ "/usr/local/bin/update-cluster-dns" ]
ENTRYPOINT [ "/bin/bash" ]