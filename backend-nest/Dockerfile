FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install && \
	npm i -g @nestjs/cli && \
	npm i --save @nestjs/passport passport @nestjs/jwt passport-jwt && \
	npm i --save-dev @types/passport-jwt && \
	npm i --save 2fa-util && \
	npm i --save prisma && \
	npm i --save @prisma/client && \
	npm i --save class-validator class-transformer && \
	npm i --save @nestjs/websockets @nestjs/platform-socket.io && \
	npm i --save @nestjs/swagger && \
	npm i --save body-parser && \
	npm i --save bcrypt && \
	npm i -D @types/multer && \
	npm install iconv && \
	npm install iconv-lite


COPY . .

ENTRYPOINT [ "sh", "backend-init.sh" ]