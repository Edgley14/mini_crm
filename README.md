# Mini CRM

Este proyecto usa Firebase para autenticación y base de datos. Para evitar subir credenciales sensibles al repositorio, la configuración de Firebase se carga desde un archivo `config.json` que **no** se versiona.

1. Copia `config.example.json` a `config.json` en la raíz del proyecto.
2. Rellena los valores con tus credenciales de Firebase.
3. Asegúrate de que `config.json` esté en `.gitignore` para no subirlo al repositorio.

```bash
cp config.example.json config.json
# Edita config.json con tus claves
```

El archivo `scripts/firebase-config.js` se encarga de leer `config.json` de forma dinámica al momento de inicializar la app.

