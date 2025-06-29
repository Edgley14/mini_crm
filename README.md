# mini_crm

CRM Mini – Proyecto Omnicanal

---

## 📁 Estructura del Proyecto

mini_crm/
├── frontend/ # Código fuente del frontend (HTML, CSS, JS, configs)
│ ├── campanas/
│ ├── chat/
│ ├── data/
│ ├── functions/
│ ├── scripts/
│ ├── styles/
│ ├── telefonia/
│ ├── usuarios/
│ ├── .firebaserc
│ ├── config.json
│ ├── firebase.json
│ ├── firestore.indexes.json
│ ├── firestore.rules
│ ├── index.html
│ ├── layout.html
│ ├── login.html
│ ├── logo.png
│ ├── README.md
│ └── softphone.html
│
├── backend/ # Backend Express.js (API RESTful, PostgreSQL)
│ ├── .env
│ ├── index.js
│ ├── db.js
│ ├── package.json
│ └── routes/
│ ├── campanas.js
│ ├── extensiones.js
│ ├── llamadas.js
│ ├── contactos.js
│ └── asignaciones.js
│
└── .gitignore

yaml
Copiar
Editar

---

## 🚀 ¿Cómo correr el proyecto?

### 1. **Frontend**
- **Abre `/frontend/index.html`** directamente o sirve la carpeta con un servidor local (ej: [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) de VSCode).
- Toda la lógica y archivos legacy siguen aquí.

### 2. **Backend**
- Ve a la carpeta `/backend`:
    ```bash
    cd backend
    npm install
    ```
- Crea el archivo `.env` con tu conexión a PostgreSQL:
    ```
    DATABASE_URL=postgresql://postgres:TU_PASSWORD@localhost:5432/mini_crm
    PORT=4000
    ```
- Levanta el backend:
    ```bash
    node index.js
    ```
- Los endpoints estarán en:  
  `http://localhost:4000/api/...`

### 3. **Conexión Frontend-Backend**
- Los scripts JS del frontend (en `/scripts/`) ahora deben consumir los endpoints del backend REST para campañas, llamadas, contactos y usuarios.
- Firebase solo para login, chat y archivos.

---

## 🔧 Tecnologías Usadas

- **Frontend:** HTML5, CSS3, JS (Vanilla)
- **Backend:** Node.js, Express.js, PostgreSQL
- **Auth y Realtime:** Firebase (Auth, Storage, RealtimeDB)
- **Infraestructura:** Modular, escalable y preparada para integración Asterisk

---

## 📝 Notas y ToDo

- Migrar lógica de campañas/contactos/llamadas de Firestore a API REST (Express)
- Mantener Firebase solo para login, chat, adjuntos
- Dejar estructura lista para pruebas con Asterisk, reporting y Looker Studio
- Documentar rutas backend y endpoints

---

## ✨ Contribuciones

Súmate a mejorar este CRM mini, cualquier PR o issue es bienvenido.  
Para dudas técnicas, revisa la carpeta `/backend/routes/` y los scripts de `/frontend/scripts/`.

---

*Powered by EL GOD FAR & ChatGPT. No te rindas, que el CRM no se va a migrar solo… ¡pero aquí tienes el mapa! 🚀*
