FROM node:18.12
MAINTAINER NeoNexus DeMortis

RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y curl ntp nano
RUN mkdir /var/www && mkdir /var/www/myapp
WORKDIR /var/www/myapp

# If you change the exposed port, you need to also change the environment variable PORT below to the same port, or nothing will work
EXPOSE 1337
# REMEMBER! NEVER STORE SECRETS, DEK's, PASSWORDS, OR ANYTHING OF A SENSITIVE NATURE IN SOURCE CONTROL (INCLUDING THIS FILE)! USE ENVIRONMENT VARIABLES!
ENV PORT=1337 DB_HOSTNAME=dockerdb DB_USERNAME=dockeruser DB_PASSWORD=dockerpass DB_NAME=docker DB_PORT=3306 DB_SSL=true DATA_ENCRYPTION_KEY=1234abcd4321asdf0987lkjh SESSION_SECRET=0987poiuqwer1234zxcvmnbv

# This keeps builds more efficient, because we can use Docker cache more effectively.
COPY package.json /var/www/myapp/package.json
RUN npm install

# More caching help
COPY ./* /var/www/myapp/
COPY config /var/www/myapp/config
COPY assets /var/www/myapp/assets
COPY webpack /var/www/myapp/webpack
RUN npm run build

# Copy the rest of the app
COPY . /var/www/myapp/

# Expose the compiled public assets, so Nginx can route to them, instead of using Sails to do the file serving.
VOLUME /var/www/myapp/.tmp/public

CMD NODE_ENV=production node app.js --max-stack-size 32000
