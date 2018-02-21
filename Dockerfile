# Set the base image to Ubuntu
FROM node:latest

RUN echo 151.101.16.162 registry.npmjs.org >> /etc/hosts
RUN echo 192.30.253.113 github.com >> /etc/hosts
RUN echo 104.192.143.1 bitbucket.org >> /etc/hosts
RUN echo 87.98.253.214 packagist.org >> /etc/hosts

# Install nodemon
RUN yarn global add nodemon

# Install packages using Yarn
ADD ./package.json /tmp/package.json
RUN cd /tmp && yarn
RUN mkdir -p /app && cp -a /tmp/node_modules /app/

ENV NODE_ENV "development"

# Define working directory
WORKDIR /app
ADD . /app

# Expose port
EXPOSE  3000

RUN npm run prestart:prod

# Run app using nodemon
CMD ["npm", "run", "start:prod"]