FROM node:24-slim AS frontend-builder

WORKDIR /app

COPY frontend/package*.json ./frontend/
COPY frontend/ ./frontend/

WORKDIR /app/frontend
RUN npm install

RUN npm run build -- --configuration production

FROM nginx:alpine

COPY --from=frontend-builder /app/frontend/dist/frontend/browser /usr/share/nginx/html

COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
