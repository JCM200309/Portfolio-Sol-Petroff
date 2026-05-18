# Resumen de Conversación: Femmora Portfolio Integration

Este documento sirve como transferencia de contexto para la siguiente sesión de trabajo sobre el portfolio de **Femora Creative Studio**.

## 🎯 Objetivo General
Crear una landing page inmersiva de una sola página (Single Page) utilizando el stack moderno (React + Tailwind v4) e integrando componentes avanzados de **React Bits** con una estética editorial y fluida.

## 🛠️ Stack Tecnológico
- **Frontend**: React 19 + Vite
- **Estilos**: Tailwind CSS v4 (usando variables de tema `@theme`)
- **Animaciones**: GSAP (para WebGL) y Framer Motion (para UI)
- **Gráficos**: WebGL (para el componente `InfiniteMenu`)

## ✨ Logros de esta Sesión

### 1. Hero Section (Inicio)
- **Máscara de Video Personalizada**: Se implementó un `clipPath` SVG que sigue una trayectoria manual ("línea negra") basada en el diseño del usuario.
- **Identidad Visual**: Integración del logo oficial de Femmora y tipografía *Playfair Display*.
- **Navegación**: Menú escalonado (`StaggeredMenu`) con los colores de la marca.

### 2. Portfolio (InfiniteMenu)
- **Integración React Bits**: Se adaptó el componente `InfiniteMenu` manteniendo su lógica de WebGL pura pero con personalización total.
- **Transparencia**: El canvas de WebGL es ahora transparente (`alpha: true`), permitiendo que el color crema de fondo de la web se vea detrás de los proyectos.
- **Efecto de Zoom-out (Preview)**:
  - Se agregó un `IntersectionObserver` que detecta cuando el usuario llega a la sección.
  - Al entrar, se dispara una animación de GSAP que hace un "de-zoom" (de `0.5` a `3.0` de distancia de cámara) para mostrar la amplitud del portfolio.
  - Es **reiniciable**: ocurre cada vez que la sección vuelve a entrar en el viewport.
- **Colores**: Se cambiaron los colores neón por defecto por la paleta de Femmora (Bordó, Marrón Oscuro, Crema).

### 3. Experiencia de Usuario (UX)
- **Scroll Snapping**: Implementación de navegación por secciones de pantalla completa (`100vh`) con "imán" de scroll (`snap-y snap-mandatory`).
- **Fluidez**: Ajuste de la amortiguación (`damping`) de la cámara en el portfolio para un movimiento más pesado y elegante.
- **Indicadores**: Se agregó un mensaje sutil `"DRAG TO VIEW PROJECTS"` con entrada animada.

## 📍 Estado Actual
La página tiene el Hero y el Portfolio completamente funcionales y armonizados. Las secciones de "Sobre Mí" y "Contacto" están maquetadas como placeholders de pantalla completa listos para recibir contenido o nuevos componentes.

## 📝 Notas para el Próximo Agente
- **Variables de Color**: Usar siempre las variables definidas en `index.css` (`var(--color-brand-...)`).
- **WebGL**: Si se modifica el fondo o la opacidad del portfolio, recordar que el context se inicializa en `InfiniteMenu.tsx` con `alpha: true` y `premultipliedAlpha: false`.
- **Scrolling**: La web no tiene scrollbar visible por diseño (`display: none` en CSS) para favorecer la inmersión.

---
*Conversación exportada el 15 de mayo de 2026 para renovación de historial.*
