# ============================
# Étape 1 : Builder Vite
# ============================
FROM node:22-alpine AS build
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du projet
COPY . .

# Build Vite pour production (minifié)
RUN npm run build

# ============================
# Étape 2 : Serveur Nginx optimisé
# ============================
FROM nginx:alpine

# Installer gzip et autres utilitaires si nécessaire
RUN apk add --no-cache gzip

# Copier les fichiers build vers Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Configuration Nginx optimisée pour SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 80
EXPOSE 80

# Lancer Nginx en mode foreground
CMD ["nginx", "-g", "daemon off;"]
