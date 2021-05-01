FROM archlinux:latest

RUN pacman -Sy --noconfirm archlinux-keyring
RUN pacman -Syyu --noconfirm
RUN pacman -S --noconfirm \
    i3status \
    i3-wm \
    git \
    net-tools \
    python3 \
    rxvt-unicode \
    supervisor \
    ttf-dejavu \
    x11vnc \
    xorg-server \
    xorg-apps \
    xorg-server-xvfb \
    xorg-xinit && \
    useradd -M -d /home/linucksio linucksio && \
    usermod -s /bin/bash linucksio

RUN git clone https://github.com/novnc/noVNC.git /noVNC

COPY config /

ENV VNC_SCREEN_SIZE 1366x768

EXPOSE 5900

ENTRYPOINT ["/bin/bash", "/entrypoint.sh"]

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
