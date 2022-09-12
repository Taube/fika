# Fika

A simple HTML and vanilla javascript ordering form.

For learning:

- Node / Express
- HTML / CSS
- Vanilla Javascript
- Docker / Synology NAS OS / Reverse Proxy

## Check for ports

netstat -ano | findstr :3002

## Kill port

npx kill-port 3002

## Run the site

`npm install`
`npm run start`

# DOCKER

## Build the container

> docker build -t getitdone/lillskrot-fika .

## Run the container

> docker run -p 3002:3002 getitdone/lillskrot-fika

## Push the conatiner

> docker push getitdone/lillskrot-fika

## Kill the container

> docker kill getitdone/lillskrot-fika

## List containers

> docker container ls

## Move a running container

> docker rm -f <container-name>
