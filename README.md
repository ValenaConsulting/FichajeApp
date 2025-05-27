# FichajeApp - Portal de gestión para empleados 

### Credenciales del proyecto

-MongoDB
	email: bmarin@valenaconsulting.com 
	constraseña: ContrasenaValena

 Para el funcionamiento del email de recuperación de contraseñas es necesario generar una contraseña de app. El requisito para generarla es establecer un método de verificación en dos pasos. Al haber eliminado mi número personal no sé si seguirá funcionando
 
-Email de recuperación de contraseñas:
 email: fichaje.reset.pswd@gmail.com
 contraseña: ContrasenaValena
 email de recuperación de la cuenta: bmarin@valenaconsulting.com

## Configuración del Proyecto

### 1. Clonar el Repositorio

```
git clone https://github.com/ValenaConsulting/FichajeApp.git
cd FichajeApp
```

### 2. Configurar las Variables de Entorno
Crear un archivo ``.env`` en la carpeta ``backend`` con el siguiente contenido:
```
MONGO_URI=mongodb+srv://bmarin:ContrasenaValena@fichaje.u5pydhz.mongodb.net/?retryWrites=true&w=majority&appName=Fichaje
PORT=5000
EMAIL_USER=fichaje.reset.pswd@gmail.com
EMAIL_PASS=zedw nzuj kgzm aqar
```

### 3. Instalar Dependencias
```
# Instalar dependencias del backend
cd backend
npm install

# Instalar dependencias del frontend
cd ..
npm install
```

### 4. Ejecutar el Proyecto
1. Iniciar el servidor backend:
```
cd ../backend
node server.js
 ```

2. En otra terminal, iniciar el frontend:
```
cd ..
npm start
 ```

### 5. Acceder a la Aplicación
Abre tu navegador y visita:

```
http://localhost:3000
 ```
