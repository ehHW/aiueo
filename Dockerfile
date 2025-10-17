FROM node:22.12.0 AS frontend-build-base

WORKDIR /app
ADD . ./

RUN --mount=type=cache,target=/root/.npm,sharing=locked npm install --legacy-peer-deps

RUN npm run build

FROM nginx:stable as frontend-runtime
RUN mkdir -p /etc/nginx/ssl
COPY --from=frontend-build-base /app/dist /usr/share/nginx/html
COPY --from=frontend-build-base /app/conf.d /app/conf.d
COPY --from=frontend-build-base /app/certificate/self.crt /etc/nginx/ssl/
COPY --from=frontend-build-base /app/certificate/self.key /etc/nginx/ssl/

RUN /usr/bin/cp -rf  /app/conf.d /etc/nginx/
