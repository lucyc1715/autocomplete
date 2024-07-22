FROM node:20-alpine as build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build --prod

FROM nginx:1.27.0-alpine

EXPOSE 80

COPY --from=build /usr/src/app/dist/frontend/browser /usr/share/nginx/html
