# Invisalign Tracker 🦷

Una aplicación moderna construida con React Native y Expo para hacer el seguimiento de tu tratamiento Invisalign más fácil y eficiente.

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

## ✨ Características Principales

*   **⏱️ Cronómetro Diario**: Registra el tiempo exacto que pasas sin los alineadores cada día.
*   **📅 Gestión de Calendario**:
    *   Cálculo automático de fechas de cambio.
    *   Ajuste flexible de fechas si te retrasas o adelantas.
    *   Reprogramación automática de todos los alineadores futuros.
*   **📊 Historial Detallado**:
    *   Visualiza todos tus alineadores pasados y futuros.
    *   Desglose diario del tiempo sin uso para cada alineador.
    *   Marca/desmarca alineadores como completados.
*   **🔔 Notificaciones**: Recordatorios para volver a ponerte los alineadores (configurables).
*   **📱 Diseño Moderno**: Interfaz limpia y fácil de usar, adaptada a modo claro/oscuro.
*   **🌐 Soporte Web**: Funciona en iOS, Android y Web (con selectores de fecha nativos).

## 🚀 Comenzar

### Requisitos Previos

*   Node.js instalado
*   npm o yarn
*   Expo Go en tu dispositivo móvil (opcional, para desarrollo)

### Instalación

1.  Clona el repositorio:
    ```bash
    git clone https://github.com/adriestapillado/invisitracker
    cd invisitracker
    ```

2.  Instala las dependencias:
    ```bash
    npm install
    ```

3.  Inicia la aplicación:
    ```bash
    npm start --web
    ```

### Comandos Disponibles

*   `npm start`: Inicia el servidor de desarrollo de Metro.
*   `npm run android`: Ejecuta la app en un emulador o dispositivo Android.
*   `npm run ios`: Ejecuta la app en un simulador o dispositivo iOS.
*   `npm run web`: Ejecuta la aplicación en el navegador.

## 📱 Uso de la Aplicación

1.  **Configuración Inicial**: Al abrir la app por primera vez, ingresa la fecha de inicio de tu tratamiento, la duración de cada alineador (ej. 14 días) y el total de alineadores.
2.  **Pantalla de Inicio**:
    *   Verás tu alineador actual y los días restantes.
    *   Usa el botón "Editar fecha" para ajustar si cambias de alineador un día diferente.
    *   Usa el cronómetro cuando te quites los alineadores para comer o cepillarte.
3.  **Historial**:
    *   Revisa tu progreso.
    *   Toca un alineador para ver el detalle de tiempo sin uso por día.
    *   Marca o desmarca alineadores si cometiste un error.

## 🛠️ Tecnologías

*   **Core**: React Native, Expo SDK 51
*   **Lenguaje**: TypeScript
*   **Almacenamiento**: AsyncStorage
*   **Navegación**: React Navigation (implícito/personalizado)
*   **Estilos**: StyleSheet nativo con sistema de diseño (tokens)
*   **Componentes Clave**:
    *   `@react-native-community/datetimepicker`: Selección de fechas nativa/web.
    *   `expo-notifications`: Gestión de recordatorios.

## 📂 Estructura del Proyecto

```
src/
├── components/     # Componentes reutilizables (Botones, Tarjetas, Modales)
├── constants/      # Configuración y tokens de diseño (Colores, Espaciado)
├── context/        # Estado global (AppContext)
├── hooks/          # Hooks personalizados (useAlignerSchedule)
├── screens/        # Pantallas principales (Home, History, Setup)
├── services/       # Lógica de negocio (Cálculos de fechas, Notificaciones)
├── styles/         # Estilos globales
└── types/          # Definiciones de tipos TypeScript
```
