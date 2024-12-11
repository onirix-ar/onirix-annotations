#!/bin/bash

# Verifica si se ha proporcionado el nombre de la nueva carpeta
if [ -z "$1" ]; then
  echo "Uso: $0 nombre_nueva_carpeta"
  exit 1
fi

NUEVA_CARPETA=$1

# Usa el usuario de la variable de entorno o "webmaster" si no está definida
REMOTE_USER=${SDK_ONIRIX_COM_USER:-webmaster}

# Si el usuario es "webmaster", solicita la contraseña
if [ "$REMOTE_USER" = "webmaster" ]; then
  read -s -p "Introduce la contraseña para $REMOTE_USER@sdk.onirix.com: " PASSWORD
  echo
fi

# Ejecuta el comando de construcción
npm run build || { echo "Error al ejecutar 'npm run build'"; exit 1; }

# Extrae el módulo y el nombre del package.json
MODULE_PATH=$(node -p "require('./package.json').module")
PACKAGE_NAME=$(node -p "require('./package.json').name")

if [ -z "$MODULE_PATH" ] || [ -z "$PACKAGE_NAME" ]; then
  echo "No se pudo obtener el módulo o el nombre del package.json."
  exit 1
fi

# Define el directorio de destino en el servidor
DEST_DIR="/var/www/onirix-sdk/${PACKAGE_NAME}/${NUEVA_CARPETA}"

# Crea el directorio en el servidor si no existe
echo "Creando directorio en el servidor..."
if [ "$REMOTE_USER" = "webmaster" ]; then
  # Usa ssh con contraseña para "webmaster"
  ssh "$REMOTE_USER@sdk.onirix.com" "mkdir -p $DEST_DIR" || { echo "Error al crear directorio en el servidor"; exit 1; }
else
  # Usa ssh sin contraseña para otros usuarios
  ssh "$REMOTE_USER@sdk.onirix.com" "mkdir -p $DEST_DIR" || { echo "Error al crear directorio en el servidor"; exit 1; }
fi

# Sube el archivo al servidor
echo "Subiendo archivo al servidor..."
if [ "$REMOTE_USER" = "webmaster" ]; then
  # Usa scp con contraseña para "webmaster"
  scp "$MODULE_PATH" "$REMOTE_USER@sdk.onirix.com:$DEST_DIR/" || { echo "Error al subir el archivo"; exit 1; }
else
  # Usa scp sin contraseña para otros usuarios
  scp "$MODULE_PATH" "$REMOTE_USER@sdk.onirix.com:$DEST_DIR/" || { echo "Error al subir el archivo"; exit 1; }
fi

# Construye la URL del archivo
URL="https://sdk.onirix.com/${PACKAGE_NAME}/${NUEVA_CARPETA}/$(basename $MODULE_PATH)"

# Verifica que la URL sea accesible
echo "Verificando la URL del archivo..."
if curl --output /dev/null --silent --head --fail "$URL"; then
  echo "Despliegue exitoso. La URL del archivo es: $URL"
else
  echo "Error: No se pudo acceder a la URL $URL"
  exit 1
fi
