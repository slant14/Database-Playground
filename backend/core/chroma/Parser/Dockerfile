FROM haskell:9

WORKDIR /app

COPY . /app

RUN apt-get update && apt-get install -y libtinfo-dev xz-utils

RUN stack setup --install-ghc && stack build --copy-bins

# Копируем бинарник в рабочую директорию
RUN cp /root/.local/bin/chroma-parser /app/chroma-parser

EXPOSE 8080

CMD ["./chroma-parser"]