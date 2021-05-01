FROM ubuntu:latest

ENV DEBIAN_FRONTEND noninteractive

RUN apt update && \
    apt install --yes --allow-unauthenticated xfce4 \
    xfce4-terminal \
    x11vnc \
    xvfb \
    git \
    supervisor && \
    apt clean && \
    apt autoclean && \
    apt autoremove && \
    useradd -M -d /home/linucksio linucksio && \
    usermod -s /bin/bash linucksio

RUN git clone https://github.com/novnc/noVNC.git /noVNC

COPY config /

ENV VNC_SCREEN_SIZE 1366x768

EXPOSE 5900

ENTRYPOINT ["/bin/bash", "/entrypoint.sh"]

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
