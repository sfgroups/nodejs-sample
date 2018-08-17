FROM node:10.9-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

ENV NODE_ENV production

ENV MONGODB_USERNAME ""
ENV MONGODB_PASSWORD ""
ENV MONGODB_URI ""

RUN mkdir -p /secret /dbinfo
COPY secret.txt /secret/
COPY dbconfig.conf /dbinfo/

RUN chown -R 1000:1000 /usr/src/app
EXPOSE 3000
CMD ["node", "server.js", "--use-strict"]
