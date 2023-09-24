FROM node:14 as build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build-stage /app/dist /usr/share/nginx/html

# EXPOSE 80 #! useless if we export port in docker file

CMD ["nginx", "-g", "daemon off;"]