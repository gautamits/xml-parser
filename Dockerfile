FROM node AS builder

WORKDIR /app
COPY package.json .
RUN yarn install

COPY src/ src
COPY nginx.conf .
COPY public/ public/
COPY . .
RUN npm run build
#RUN apt update -y && apt install jq -y
#RUN python linter.py | jq -C --tab .

FROM nginx:stable
COPY --from=builder /app/build/ /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

# Make our shell script executable
CMD ["/bin/bash", "-c", "nginx -g \"daemon off;\""]
