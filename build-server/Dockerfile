FROM ubuntu:focal

# Install dependencies
RUN apt-get update
RUN apt-get install -y 
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get upgrade -y
RUN apt-get install -y nodejs
RUN apt-get install git -y

# As soon as the container is up and running
WORKDIR /home/app

COPY main.sh main.sh
RUN chmod +x main.sh

ENTRYPOINT [ "/home/app/main.sh" ]