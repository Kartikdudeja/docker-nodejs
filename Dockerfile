# Base Image
FROM node:15

WORKDIR /app
COPY package.json .

# RUN npm install

# install dev dependencies in development environment
# and production depedencies in prod env
ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
        then npm install; \
        else npm install --only=production; \
        fi

COPY . .

# Environment Variable named PORT
ENV PORT 3000
EXPOSE $PORT

# RUN is used when we are building the image
# CMD is used when we run the container
CMD ["node", "index.js"]
# command for prod server

# Run Test Script as defined in 'package.json'

#CMD ["npm", "run", "dev"]
# command for dev server

# bind mount sync the file/file syste on a local machine with file/ file system inside of a container