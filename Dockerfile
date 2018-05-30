FROM blackgamelp/nodejs-opencv
RUN apt-get install -y pkg-config
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

CMD ["yarn", "test"]