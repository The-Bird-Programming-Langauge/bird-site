FROM mcr.microsoft.com/devcontainers/cpp:1-debian-12

# Install npm and nodejs for the frontend

RUN apt-get update && apt-get -y install --no-install-recommends npm nodejs

RUN sudo apt-get update && apt-get clean && \
    sudo apt-get install -y build-essential libzstd-dev 

# Install binaryen for wasm

RUN apt-get update && apt-get -y install --no-install-recommends binaryen -y


