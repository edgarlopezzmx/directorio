This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/users](http://localhost:3000/api/users).

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.



## Configuración de la url de la BD.
Generar un archivo de entorno
.env.docker

DATABASE_URL="postgresql://usuario:password@db:5432/mydb"

## Actualizar configuración de docker-compose.yml
configurar las siguientes claves para el gestor de base de datos

POSTGRES_USER:

POSTGRES_PASSWORD:

POSTGRES_DB:

## para consultar la documentación de la Api
Para consultar la documentación disponible de la Api, favor de ejecutar el siguiente comando en la terminal:

node swagger-server.js

visitar Swagger docs en http://localhost:4000/api-docs
