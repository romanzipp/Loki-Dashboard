FROM node:18-alpine

ARG LOKI_ENTRYPOINT

WORKDIR /app

# Install system dependencies

RUN apk update && apk upgrade
RUN apk add git curl

COPY . /app

# Install npm dependencies

RUN npm install

# Build application

RUN PRODUCTION=false npm run build

# Remove dev dependencies

#RUN npm install --omit=dev

# Export port & start server

EXPOSE 3000
CMD ["sh", "run.sh"]
