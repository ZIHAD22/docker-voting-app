FROM node:alpine AS builder

WORKDIR	/frontend

# Accept build-time environment variables
ARG VITE_API_URL
ARG VITE_SOCKET_URL

# Export for vite build
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_SOCKET_URL=${VITE_SOCKET_URL}

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine 

COPY --from=builder /frontend/dist /usr/share/nginx/html

