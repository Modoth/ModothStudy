FROM ubuntu:18.04

RUN true \
&& sed -i -e 's/archive.ubuntu.com/mirrors.aliyun.com/g' /etc/apt/sources.list \
&& apt update && apt full-upgrade -y \
&& apt install -y \
    curl \
    software-properties-common \
&& curl https://packages.microsoft.com/config/ubuntu/18.04/packages-microsoft-prod.deb \
    -o packages-microsoft-prod.deb \
&& dpkg -i packages-microsoft-prod.deb && rm packages-microsoft-prod.deb \
&& add-apt-repository universe \
&& apt update && apt install -y apt-transport-https && apt update \
&& curl -sL https://deb.nodesource.com/setup_12.x | bash - \
&& apt install -y \
    docker-compose \
    dotnet-sdk-2.2 \
    nodejs \
    openjdk-8-jre-headless \
    openssh-server \
    sudo \
    zsh \
&& rm -rf /var/lib/apt/lists/* \
&& mkdir /var/run/sshd \
&& useradd dev -G sudo -s $(which zsh) \
&& echo "dev:dev" | chpasswd \
&& true

EXPOSE 22
CMD ["/usr/sbin/sshd", "-D"]

