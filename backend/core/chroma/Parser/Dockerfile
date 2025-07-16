FROM haskell:9

WORKDIR /app

# Копируем только файлы зависимостей
COPY *.cabal ./
COPY cabal.project* ./

# Устанавливаем системные зависимости
RUN apt-get update && apt-get install -y libtinfo-dev xz-utils

# Обновляем индекс пакетов и устанавливаем зависимости
RUN cabal update && cabal build --only-dependencies

# Теперь копируем исходники
COPY . /app

# Собираем проект
RUN cabal build

EXPOSE 8080

CMD ["cabal", "run", "chroma-parser"]