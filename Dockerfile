FROM node:12 as build

WORKDIR /sources

COPY . .

RUN npm ci && npm run build

FROM nginx

COPY  --from=build /sources/build /usr/share/nginx/html

WORKDIR /etc/nginx/conf.d

RUN echo \
 "server {\n\
  \tlisten 80;\n\
  \tlisten  [::]:80;\n\
  \tserver_name  localhost;\n\n\
  \tlocation / {\n\
  \t\troot   /usr/share/nginx/html;\n\
  \t\ttry_files \$uri \$uri/ =404 /index.html;\n\
  \t}\n\
  }"  > default.conf