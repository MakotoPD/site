FROM node:26.11.1-bookworm-slim AS build
WORKDIR /app
COPY package*.json ./
# The postinstall script needs the sources, which are copied later; the build prepares Nuxt itself.
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

FROM node:26.11.1-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3000
COPY --from=build --chown=node:node /app/.output ./.output
USER node
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
