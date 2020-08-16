FROM node:12.18
MAINTAINER NeoNexus DeMortis

RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y curl ntp nano
RUN mkdir /var/www && mkdir /var/www/myapp
WORKDIR /var/www/myapp

EXPOSE 1337
# REMEMBER! NEVER STORE SECRETS, DEK's, PASSWORDS, OR ANYTHING OF A SENSITIVE NATURE IN SOURCE CONTROL! USE ENVIRONMENT VARIABLES!
ENV PORT=1337 DB_HOSTNAME=localhost DB_USERNAME=user DB_PASSWORD=pass DB_NAME=myappdb DB_PORT=3306 DB_SSL=true DATA_ENCRYPTION_KEY=1234abcd4321asdf0987lkjh SESSION_SECRET=0987poiuqwer1234zxcvmnbv

# This keeps builds more efficient, because we can use cache more effectively.
COPY package.json /var/www/myapp/package.json
RUN npm install

COPY . /var/www/myapp/
RUN npm run build

# Expose the compiled public assets, so Nginx can route to them, instead of using Sails to do the file serving.
VOLUME /var/www/myapp/.tmp/public

CMD NODE_ENV=production node app.js --max-stack-size 32000
