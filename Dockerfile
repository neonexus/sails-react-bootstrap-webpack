FROM node:20-slim
MAINTAINER NeoNexus DeMortis

RUN mkdir /var/www && mkdir /var/www/myapp
WORKDIR /var/www/myapp

# If you change the exposed port, you need to also change the environment variable PORT below to the same port, or nothing will work.
EXPOSE 1337
# REMEMBER! NEVER STORE SECRETS, DEK's, PASSWORDS, OR ANYTHING OF A SENSITIVE NATURE IN SOURCE CONTROL (INCLUDING THIS FILE)! USE ENVIRONMENT VARIABLES!
ENV PORT=1337 DB_HOSTNAME=dockerdb DB_USERNAME=dockeruser DB_PASSWORD=dockerpass DB_NAME=docker DB_PORT=3306 DB_SSL=true DATA_ENCRYPTION_KEY=null SESSION_SECRET=null

# This keeps builds more efficient, because we can use Docker cache more effectively.
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install

# Build the PRODUCTION assets
COPY . .
RUN npm run build

# Expose the compiled public assets, so Nginx can route to them, instead of using Sails to do the file serving.
VOLUME .tmp/public

CMD NODE_ENV=production node app.js --max-stack-size 32000
