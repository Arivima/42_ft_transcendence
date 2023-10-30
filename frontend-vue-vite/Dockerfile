# build stage
FROM node:20.2.0-bullseye-slim as build-stage

WORKDIR /app

COPY package*.json ./

RUN npm i vite-plugin-node-polyfills && \
	npm install socket.io-client

RUN npm install

COPY . .

ENTRYPOINT ["npm", "run", "dev"]

# # production stage
# FROM nginx:stable-alpine as production-stage

# COPY --from=build-stage /app/dist /usr/share/nginx/html

# #! useless if we export port in docker file
# # EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]