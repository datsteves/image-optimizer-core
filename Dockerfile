FROM blackgamelp/nodejs-opencv:latest

RUN apt-get install graphicsmagick -y

WORKDIR /usr/src/testing
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY . .
RUN yarn global add node-pre-gyp
RUN yarn
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source

CMD ["yarn", "jest"]