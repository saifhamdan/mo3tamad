# stage one build app
FROM node:18-alpine as build
WORKDIR '/app'
COPY package.json .
RUN npm install
COPY . . 
RUN npm run build

# stage two deploy app
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]