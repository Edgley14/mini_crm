# Mini CRM

Este proyecto es una pequeña aplicación CRM que utiliza Firebase para el hosting y las funciones en la nube.

## Configuración de variables de entorno

Las funciones de Firebase requieren credenciales de Twilio para generar tokens de acceso. Para configurarlas ejecuta en la raíz del proyecto:

```bash
firebase functions:config:set \
  twilio.account_sid="ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" \
  twilio.api_key="SKXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" \
  twilio.api_secret="<tu_api_secret>" \
  twilio.app_sid="APXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
```

Puedes verificar que se guardaron correctamente con:

```bash
firebase functions:config:get
```

## Despliegue de funciones y hosting

1. Instala las dependencias del proyecto de funciones:

```bash
cd functions
npm install
cd ..
```

2. Inicia sesión en Firebase y selecciona el proyecto correspondiente si es necesario:

```bash
firebase login
firebase use --add
```

3. Despliega las funciones de Cloud Functions:

```bash
firebase deploy --only functions
```

4. Despliega la aplicación web en Firebase Hosting:

```bash
firebase deploy --only hosting
```

Con esto tendrás la aplicación y las funciones disponibles en tu proyecto de Firebase.
