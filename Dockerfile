FROM node:9

WORKDIR /usr/src/testing

run	apt-get update
run	apt-get upgrade -y
run	apt-get install -y -q wget curl unzip
run	apt-get install -y -q build-essential
run	apt-get install -y -q cmake
run	apt-get install -y -q python2.7 python2.7-dev python-pip
run	wget 'https://pypi.python.org/packages/2.7/s/setuptools/setuptools-0.6c11-py2.7.egg' && /bin/sh setuptools-0.6c11-py2.7.egg && rm -f setuptools-0.6c11-py2.7.egg
run	curl 'https://raw.github.com/pypa/pip/master/contrib/get-pip.py' | python2.7
run	pip install numpy
run	apt-get install -y -q libavformat-dev libavcodec-dev libavfilter-dev libswscale-dev
run	apt-get install -y -q libjpeg-dev libpng-dev libtiff-dev libjasper-dev zlib1g-dev libopenexr-dev libeigen3-dev libtbb-dev
add	build_opencv.sh	/build_opencv.sh
run	/bin/sh /build_opencv.sh
run	rm -rf /build_opencv.sh

RUN echo "/usr/local/lib/" > /etc/ld.so.conf.d/opencv.conf
RUN ldconfig -v
RUN wget https://kent.dl.sourceforge.net/project/libpng/libpng16/1.6.32/libpng-1.6.32.tar.xz
RUN tar xf libpng-1.6.32.tar.xz && cd libpng-1.6.32 && ./configure && make check && make install
RUN ldconfig -v

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