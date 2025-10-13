FROM ubuntu:22.04

RUN apt update && apt install -y openssh-server sudo
RUN useradd -m devuser && echo "devuser:1234" | chpasswd
RUN mkdir /var/run/sshd

# Permitir login por contraseña (importante)
RUN sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config && \
    sed -i 's/PasswordAuthentication no/PasswordAuthentication yes/' /etc/ssh/sshd_config && \
    sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config

EXPOSE 22
CMD ["/usr/sbin/sshd", "-D"]
