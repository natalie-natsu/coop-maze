FROM node
LABEL maintainer="Wassim DHIF <wassimdhif@gmail.com> (https://github.com/wdhif)"

COPY . .

ENV WS_PORT 3001
ENV PYTHON_CMD "python3"
ENV MAP_WIDTH 100
ENV MAP_HEIGHT 75
ENV DELETE_GAME_TIMEOUT 10
ENV START_GAME_TIMEOUT 5
ENV MAX_MOVE_DISTANCE_ALLOWED 25
ENV TILE_SIZE 64

# Install app dependencies
RUN npm install && npm run build

CMD [ "npm", "run", "start" ]

