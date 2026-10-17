# Lista de asistentes — Talento Tech

Segundo paso de la tarea, desarrollado con React y Vite.

## Ejecutar

```bash
npm install
npm run dev
```

Abrir la dirección indicada por Vite. Para detener el servidor, usar Ctrl+C.

## Cómo funciona

- `src/Asistente.jsx` recibe y desestructura las props `nombre`, `tarea` y `emoji`. Muestra el nombre en un `h3` y la tarea con su emoji en un `p`.
- `src/App.jsx` define el array `asistentes` dentro de la función App. Cada objeto tiene los datos de una persona y un `id` estable y único.
- `.map()` genera un componente `Asistente` por persona y le pasa las tres props.
- Cada `<Asistente />` lleva `key={asistente.id}` para que React identifique cada elemento de la lista. `key` es especial de React y no se recibe como una prop dentro de Asistente.
- `PieDePosteo.jsx` conserva el pie de página del primer ejercicio. Los archivos `Encabezado.jsx` y `CuerpoPosteo.jsx` del primer paso se conservan, aunque esta pantalla ya no los utiliza.

Para agregar otra persona, agregar un objeto al array con un `id` que no se repita y sus valores de `nombre`, `tarea` y `emoji`.

## Verificar

```bash
npm run lint
npm run build
```


## CSS global y CSS Modules

Los estilos generales (fuente, fondo y color del texto) están en `src/index.css`, importado desde `src/main.jsx`. `src/App.css` define la distribución de la página.

`src/TarjetaProducto.jsx` muestra un producto de ejemplo y recibe las props `imagen`, `nombre` y `precio`, además de una `descripcion` opcional. Importa `TarjetaProducto.module.css` como `styles` y aplica clases mediante `className={styles.tarjeta}`. Vite genera nombres de clase únicos para encapsular esos estilos y evitar que afecten a los asistentes u otros componentes.

## Layout y catálogo

`App.jsx` envuelve las secciones en `<Layout>`. `Layout.jsx` recibe `children` y los muestra dentro de `main`, entre el encabezado y el footer compartidos.

El array `productos` contiene tres productos de ejemplo. Mediante `.map()` se crean tres instancias de `TarjetaProducto`, con claves únicas y sus props, incluida una imagen local para cada producto. Los precios son ficticios para la práctica.

El catálogo y los asistentes usan CSS Grid con columnas adaptables al ancho disponible. Las tarjetas conservan sus estilos encapsulados en `TarjetaProducto.module.css`.


Las ilustraciones de ejemplo están en `public/productos/`. La prop `imagen` se usa en el atributo `src` de un elemento `img`, con el nombre como texto alternativo. Para reutilizar la tarjeta:

```jsx
<TarjetaProducto
  imagen="/productos/cuaderno.svg"
  nombre="Cuaderno para desarrolladores"
  precio="USD 12"
/>
```

## Estado de favoritos

Cada `TarjetaProducto` tiene su propio estado booleano:

```jsx
const [esFavorito, setEsFavorito] = useState(false)

function marcarComoFavorito() {
  setEsFavorito((valorActual) => !valorActual)
}
```

El botón usa `onClick={marcarComoFavorito}`. Cada clic invierte el estado y actualiza el corazón, el texto y el color del botón. `aria-pressed` comunica si está seleccionado. Cada tarjeta funciona de forma independiente; al recargar la página los favoritos vuelven a su estado inicial.

## Carga del equipo desde JSON

`public/data/nosotros.json` contiene cuatro personas ficticias con `id`, `nombre`, `email`, `puesto` y `foto`. Las fotos de ejemplo provienen de Random User (https://randomuser.me/) y se guardan en `public/images`; no representan las identidades ficticias del JSON.

En `App.jsx`, los estados son `nosotros` (inicialmente `[]`), `cargando` (`true`) y `error` (`null`). Un `useEffect` ejecuta `fetch('/data/nosotros.json')`, comprueba el estado HTTP y lee el JSON. La limpieza del efecto cancela la solicitud con AbortController para evitar actualizaciones de una carga cancelada.

La sección Equipo muestra condicionalmente el mensaje de carga, un error visible, una lista vacía o las tarjetas con foto, nombre, puesto y email. El enlace Equipo del encabezado lleva a esta sección.

## Directorio de contactos en el footer

`App` conserva la carga y los tres estados del equipo. Pasa esos datos a `Directorio` mediante props. `Directorio` usa `usuarios.map()` para crear una `TarjetaContacto` por persona con su foto, nombre, puesto y email.

`Layout` recibe el directorio en la prop `pie` y lo entrega como `children` a `PieDePosteo`. Así la grilla se muestra al principio del elemento `footer`, antes de la autoría y el enlace de regreso. Los mensajes de carga, error y lista vacía aparecen en esa misma sección.

## Formulario y estado de carga

`NewProductContainer.jsx` inicia `loading` en `false`. Su función `handleFormSubmit` activa la carga como primera acción, espera `onCreateProduct` y restablece `loading` en `finally`, tanto ante éxito como ante error. Pasa el estado como prop a `ProductForm`.

`ProductForm.jsx` desestructura `loading`: el botón usa `disabled={loading}` y muestra `loading ? 'Guardando…' : 'Agregar producto'`. Los campos también se bloquean durante el envío. Si hay un error conserva los datos; si tiene éxito limpia el formulario.

La creación es una simulación local de 700 ms, sin API. Agrega el producto al estado del catálogo y se pierde al recargar. Un nombre compuesto solo por espacios permite comprobar el error de validación y que el botón vuelve a habilitarse.

## Inicio y detalle de productos

React Router muestra `Inicio.jsx` en `/` y `DetalleProducto.jsx` en `/productos/:id`. Inicio reutiliza el catálogo del estado de App para las tarjetas destacadas. Las imágenes y nombres enlazan al detalle; el botón de favoritos sigue siendo independiente.

El detalle muestra imagen, nombre, precio, descripción y referencia. Hay mensajes para productos inexistentes y rutas desconocidas, con un enlace para regresar. Los productos agregados durante la sesión también tienen detalle; siguen siendo temporales hasta recargar.

Para publicar con BrowserRouter, el alojamiento debe redirigir las rutas desconocidas a `index.html` (Vite lo resuelve en desarrollo).

## Productos con fetch

La fuente del catálogo es ahora `public/productos.json`. `ItemListContainer.jsx` define `products` con `useState([])` y ejecuta `fetch('/productos.json')` dentro de `useEffect` al montarse. El segundo `.then()` actualiza `products` y `.map()` genera un `Item` por producto. `Item` reutiliza `TarjetaProducto`.

El contenedor conserva el estado mientras se navega entre inicio y detalle. Muestra carga, error o lista vacía según corresponda. El detalle espera a que termine la carga antes de decidir si un producto existe. La portada no accede al primer producto cuando el array está vacío.

Los productos del formulario se agregan a ese mismo estado en memoria, sin escribir en el JSON. El formulario se habilita cuando termina correctamente la carga inicial.
