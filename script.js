// ======================================================
// URBAN STYLE - SCRIPT.JS
// TIENDA, CARRITO, FAVORITOS, OFERTAS, PAGOS Y PEDIDOS
// ======================================================


// ======================================================
// PRODUCTOS ORIGINALES
// ======================================================

const productosOriginales = [

    {
        nombre: "Remera Urban Black",
        precio: 18000,
        categoria: "remeras",
        imagen: "imagenes/remera.JPG"
    },

    {
        nombre: "Buzo Street",
        precio: 35000,
        categoria: "buzos",
        imagen: "imagenes/buzo.jpg"
    },

    {
        nombre: "Pantalón Cargo",
        precio: 42000,
        categoria: "pantalones",
        imagen: "imagenes/pantalon.jpg"
    },

    {
        nombre: "Zapatillas Urban",
        precio: 65000,
        categoria: "zapatillas",
        imagen: "imagenes/zapatillas.jpg"
    },

    {
        nombre: "Gorra Urban",
        precio: 15000,
        categoria: "accesorios",
        imagen: "imagenes/gorra.jpg"
    },

    {
        nombre: "Medias Urban",
        precio: 8000,
        categoria: "accesorios",
        imagen: "imagenes/medias.jpg"
    }

];


// ======================================================
// OFERTAS ORIGINALES
// ======================================================

const ofertasOriginales = [

    {
        nombre: "Remera Urban Black",
        precioAnterior: 22500,
        precioOferta: 18000,
        descuento: 20,
        imagen: "imagenes/remera.JPG"
    },

    {
        nombre: "Buzo Street",
        precioAnterior: 45000,
        precioOferta: 35000,
        descuento: 22,
        imagen: "imagenes/buzo.jpg"
    },

    {
        nombre: "Pantalón Cargo",
        precioAnterior: 50000,
        precioOferta: 42000,
        descuento: 16,
        imagen: "imagenes/pantalon.jpg"
    },

    {
        nombre: "Zapatillas Urban",
        precioAnterior: 80000,
        precioOferta: 65000,
        descuento: 19,
        imagen: "imagenes/zapatillas.jpg"
    }

];


// ======================================================
// VARIABLES
// ======================================================

let productosUrban = obtenerProductos();

let carrito =
    JSON.parse(
        localStorage.getItem("carritoUrban")
    ) || [];

let favoritos =
    JSON.parse(
        localStorage.getItem("favoritosUrban")
    ) || [];

let costoEnvio =
    Number(
        localStorage.getItem("costoEnvio")
    ) || 0;

let descuentoAplicado =
    Number(
        localStorage.getItem("descuentoUrban")
    ) || 0;


// ======================================================
// FUNCIONES GENERALES
// ======================================================

function obtenerProductos() {

    const guardados =
        JSON.parse(
            localStorage.getItem("productosUrban")
        );

    if (Array.isArray(guardados)) {
        return guardados;
    }

    return JSON.parse(
        JSON.stringify(productosOriginales)
    );
}


function guardarProductos() {

    localStorage.setItem(
        "productosUrban",
        JSON.stringify(productosUrban)
    );

}


function formatearPrecio(numero) {

    return Number(numero || 0)
        .toLocaleString("es-AR");

}


function escaparHTML(texto) {

    return String(texto ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ======================================================
// CARRITO - CONTADOR
// ======================================================

function actualizarContadorCarrito() {

    const cantidad =
        carrito.reduce(
            function(total, producto) {

                return total +
                    (Number(producto.cantidad) || 1);

            },
            0
        );


    document
        .querySelectorAll(".carrito span")
        .forEach(
            function(contador) {

                contador.textContent =
                    cantidad;

            }
        );

}


// ======================================================
// GUARDAR CARRITO
// ======================================================

function guardarCarrito() {

    localStorage.setItem(
        "carritoUrban",
        JSON.stringify(carrito)
    );

    actualizarContadorCarrito();

}


// ======================================================
// AGREGAR AL CARRITO
// ======================================================

function agregarAlCarrito(
    nombre,
    talle = "",
    color = "",
    cantidad = 1
) {

    const producto =
        productosUrban.find(
            function(item) {

                return item.nombre === nombre;

            }
        );


    if (!producto) {

        alert(
            "❌ No se encontró el producto."
        );

        return;
    }


    const cantidadAgregar =
        Math.max(
            1,
            Number(cantidad) || 1
        );


    const existente =
        carrito.find(
            function(item) {

                return (
                    item.nombre === nombre &&
                    item.talle === talle &&
                    item.color === color
                );

            }
        );


    if (existente) {

        existente.cantidad =
            (Number(existente.cantidad) || 0) +
            cantidadAgregar;

    } else {

        carrito.push({

            nombre:
                producto.nombre,

            precio:
                Number(producto.precio),

            imagen:
                producto.imagen,

            categoria:
                producto.categoria,

            talle:
                talle,

            color:
                color,

            cantidad:
                cantidadAgregar

        });

    }


    guardarCarrito();

    mostrarCarrito();

    mostrarNotificacion(
        `✅ ${producto.nombre} se agregó al carrito.`
    );

}


// ======================================================
// NOTIFICACIÓN
// ======================================================

function mostrarNotificacion(mensaje) {

    const notificacion =
        document.getElementById(
            "notificacion"
        );


    if (!notificacion) {
        return;
    }


    const texto =
        document.getElementById(
            "notificacion-texto"
        );


    if (texto) {

        texto.textContent =
            mensaje;

    } else {

        notificacion.textContent =
            mensaje;

    }


    notificacion.classList.add(
        "mostrar"
    );


    setTimeout(
        function() {

            notificacion.classList.remove(
                "mostrar"
            );

        },
        2500
    );

}


// ======================================================
// AVISO DE PEDIDO ENTREGADO
// ======================================================

function mostrarAvisoPedidoEntregado() {

    const aviso =
        JSON.parse(
            localStorage.getItem(
                "ultimoPedidoEntregado"
            )
        );


    if (!aviso) {
        return;
    }


    const notificacion =
        document.getElementById(
            "notificacion"
        );


    if (!notificacion) {
        return;
    }


    const texto =
        document.getElementById(
            "notificacion-texto"
        );


    if (texto) {

        texto.textContent =
            aviso.mensaje;

    } else {

        notificacion.textContent =
            aviso.mensaje;

    }


    notificacion.classList.add(
        "mostrar"
    );


    // Eliminamos el aviso para que
    // no aparezca nuevamente
    localStorage.removeItem(
        "ultimoPedidoEntregado"
    );


    setTimeout(
        function() {

            notificacion.classList.remove(
                "mostrar"
            );

        },
        3000
    );

}


// ======================================================
// BUSCADOR
// ======================================================

function buscarProductos(input) {

    if (!input) return;


    input.value =
        input.value.replace(
            /[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g,
            ""
        );


    const texto =
        input.value
            .trim()
            .toLowerCase();


    document
        .querySelectorAll(
            "#productos .producto"
        )
        .forEach(
            function(producto) {

                const nombre =
                    producto
                        .querySelector("h3")
                        ?.textContent
                        .toLowerCase() || "";


                if (
                    texto === "" ||
                    nombre.includes(texto)
                ) {

                    producto.style.display =
                        "";

                } else {

                    producto.style.display =
                        "none";

                }

            }
        );

}


// ======================================================
// FILTROS
// ======================================================

function filtrarProductos(
    categoria,
    boton
) {

    const productos =
        document.querySelectorAll(
            "#productos .producto"
        );


    productos.forEach(
        function(producto) {

            const categoriaProducto =
                producto.dataset.categoria;


            if (
                categoria === "todos" ||
                categoriaProducto === categoria
            ) {

                producto.style.display =
                    "";

            } else {

                producto.style.display =
                    "none";

            }

        }
    );


    document
        .querySelectorAll(".filtro")
        .forEach(
            function(item) {

                item.classList.remove(
                    "activo"
                );

            }
        );


    if (boton) {

        boton.classList.add(
            "activo"
        );

    }

}


// ======================================================
// MOSTRAR PRODUCTOS
// ======================================================

function mostrarProductosTienda() {

    const contenedor =
        document.querySelector(
            "#productos .productos-grid"
        );


    if (!contenedor) return;


    productosUrban =
        obtenerProductos();


    contenedor.innerHTML =
        "";


    if (productosUrban.length === 0) {

        contenedor.innerHTML = `

            <p class="carrito-vacio">
                No hay productos disponibles.
            </p>

        `;

        return;
    }


    productosUrban.forEach(
        function(producto) {

            const div =
                document.createElement(
                    "article"
                );


            div.className =
                "producto";


            div.dataset.categoria =
                producto.categoria;


            const esFavorito =
                favoritos.includes(
                    producto.nombre
                );


            div.innerHTML = `

                <div class="imagen-producto">

                    <a
                        href="producto.html?producto=${encodeURIComponent(producto.nombre)}"
                        class="imagen-producto-link"
                    >

                        <img
                            src="${escaparHTML(producto.imagen)}"
                            alt="${escaparHTML(producto.nombre)}"
                        >

                    </a>


                    <button
                        type="button"
                        class="boton-favorito ${
                            esFavorito
                                ? "favorito-activo"
                                : ""
                        }"
                        title="${
                            esFavorito
                                ? "Quitar de favoritos"
                                : "Agregar a favoritos"
                        }"
                        aria-label="${
                            esFavorito
                                ? "Quitar de favoritos"
                                : "Agregar a favoritos"
                        }"
                        onclick="
                            cambiarFavorito(
                                '${escaparParaJS(producto.nombre)}',
                                this
                            )
                        "
                    >

                        ${
                            esFavorito
                                ? "♥"
                                : "♡"
                        }

                    </button>

                </div>


                <div class="producto-info">

                    <h3>
                        ${escaparHTML(producto.nombre)}
                    </h3>


                    <p class="precio">
                        $${formatearPrecio(producto.precio)}
                    </p>


                    <a
                        href="producto.html?producto=${encodeURIComponent(producto.nombre)}"
                        class="boton"
                    >

                        VER PRODUCTO

                    </a>

                </div>

            `;


            contenedor.appendChild(
                div
            );

        }
    );


    actualizarBotonesFavoritos();

}


// ======================================================
// ESCAPAR TEXTO PARA onclick
// ======================================================

function escaparParaJS(texto) {

    return String(texto)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");

}


// ======================================================
// FAVORITOS
// ======================================================

function cambiarFavorito(
    nombre,
    boton
) {

    const indice =
        favoritos.indexOf(nombre);


    if (indice === -1) {

        favoritos.push(nombre);


        if (boton) {

            boton.classList.add(
                "favorito-activo"
            );

            boton.textContent =
                "♥";

            boton.title =
                "Quitar de favoritos";

        }


        mostrarNotificacion(
            "❤️ Producto agregado a favoritos."
        );

    } else {

        favoritos.splice(
            indice,
            1
        );


        if (boton) {

            boton.classList.remove(
                "favorito-activo"
            );

            boton.textContent =
                "♡";

            boton.title =
                "Agregar a favoritos";

        }


        mostrarNotificacion(
            "💔 Producto quitado de favoritos."
        );

    }


    localStorage.setItem(
        "favoritosUrban",
        JSON.stringify(favoritos)
    );


    if (
        document.getElementById(
            "lista-favoritos"
        )
    ) {

        mostrarFavoritos();

    }

}


function actualizarBotonesFavoritos() {

    document
        .querySelectorAll(
            ".boton-favorito"
        )
        .forEach(
            function(boton) {

                const onclick =
                    boton.getAttribute(
                        "onclick"
                    ) || "";


                const coincidencia =
                    onclick.match(
                        /cambiarFavorito\('(.+?)'/
                    );


                if (!coincidencia) return;


                const nombre =
                    coincidencia[1]
                        .replace(/\\'/g, "'")
                        .replace(/\\\\/g, "\\");


                if (
                    favoritos.includes(
                        nombre
                    )
                ) {

                    boton.classList.add(
                        "favorito-activo"
                    );

                    boton.textContent =
                        "♥";

                } else {

                    boton.classList.remove(
                        "favorito-activo"
                    );

                    boton.textContent =
                        "♡";

                }

            }
        );

}


// ======================================================
// PÁGINA DE FAVORITOS
// ======================================================

function mostrarFavoritos() {

    const contenedor =
        document.getElementById(
            "lista-favoritos"
        );


    if (!contenedor) return;


    productosUrban =
        obtenerProductos();


    contenedor.innerHTML =
        "";


    const productosFavoritos =
        productosUrban.filter(
            function(producto) {

                return favoritos.includes(
                    producto.nombre
                );

            }
        );


    if (
        productosFavoritos.length === 0
    ) {

        contenedor.innerHTML = `

            <div class="carrito-vacio">

                <h2>
                    ❤️ Todavía no tenés favoritos
                </h2>

                <p>
                    Agregá productos desde la tienda.
                </p>

                <a
                    href="index.html#productos"
                    class="boton"
                >

                    VER PRODUCTOS

                </a>

            </div>

        `;

        return;
    }


    productosFavoritos.forEach(
        function(producto) {

            const div =
                document.createElement(
                    "article"
                );


            div.className =
                "producto";


            div.dataset.categoria =
                producto.categoria;


            div.innerHTML = `

                <div class="imagen-producto">

                    <a
                        href="producto.html?producto=${encodeURIComponent(producto.nombre)}"
                        class="imagen-producto-link"
                    >

                        <img
                            src="${escaparHTML(producto.imagen)}"
                            alt="${escaparHTML(producto.nombre)}"
                        >

                    </a>

                </div>


                <div class="producto-info">

                    <h3>
                        ${escaparHTML(producto.nombre)}
                    </h3>


                    <p class="precio">
                        $${formatearPrecio(producto.precio)}
                    </p>


                    <a
                        href="producto.html?producto=${encodeURIComponent(producto.nombre)}"
                        class="boton"
                    >

                        VER PRODUCTO

                    </a>


                    <button
                        type="button"
                        class="boton boton-quitar-favorito"
                        onclick="
                            cambiarFavorito(
                                '${escaparParaJS(producto.nombre)}'
                            )
                        "
                    >

                        💔 QUITAR

                    </button>

                </div>

            `;


            contenedor.appendChild(
                div
            );

        }
    );

}


// ======================================================
// DETALLE DEL PRODUCTO
// ======================================================

function mostrarDetalleProducto() {

    const contenedor =
        document.getElementById(
            "detalle-producto"
        );


    if (!contenedor) return;


    const parametros =
        new URLSearchParams(
            window.location.search
        );


    const nombre =
        parametros.get("producto");


    if (!nombre) {

        contenedor.innerHTML = `

            <div class="carrito-vacio">

                <h2>
                    ❌ Producto no encontrado
                </h2>

                <a
                    href="index.html#productos"
                    class="boton"
                >

                    VOLVER A PRODUCTOS

                </a>

            </div>

        `;

        return;
    }


    productosUrban =
        obtenerProductos();


    const producto =
        productosUrban.find(
            function(item) {

                return item.nombre === nombre;

            }
        );


    if (!producto) {

        contenedor.innerHTML = `

            <div class="carrito-vacio">

                <h2>
                    ❌ Producto no encontrado
                </h2>

                <a
                    href="index.html#productos"
                    class="boton"
                >

                    VOLVER A PRODUCTOS

                </a>

            </div>

        `;

        return;
    }


    window.talleSeleccionado =
        "";

    window.colorSeleccionado =
        "";


    const talles = [
        "S",
        "M",
        "L",
        "XL"
    ];


    const colores = [
        "Negro",
        "Blanco",
        "Rojo",
        "Azul"
    ];


    contenedor.innerHTML = `

        <div class="detalle-card">

            <div class="detalle-imagen">

                <img
                    src="${escaparHTML(producto.imagen)}"
                    alt="${escaparHTML(producto.nombre)}"
                >

            </div>


            <div class="detalle-info">

                <h1>
                    ${escaparHTML(producto.nombre)}
                </h1>


                <h2>
                    $${formatearPrecio(producto.precio)}
                </h2>


                <div class="opciones-producto">

                    <h3>
                        Talle
                    </h3>


                    <div
                        id="talles"
                        class="opciones"
                    >

                        ${talles.map(
                            function(talle) {

                                return `

                                    <button
                                        type="button"
                                        class="opcion"
                                        onclick="
                                            seleccionarOpcion(
                                                'talle',
                                                '${talle}'
                                            )
                                        "
                                    >

                                        ${talle}

                                    </button>

                                `;

                            }
                        ).join("")}

                    </div>


                    <h3>
                        Color
                    </h3>


                    <div
                        id="colores"
                        class="opciones"
                    >

                        ${colores.map(
                            function(color) {

                                return `

                                    <button
                                        type="button"
                                        class="opcion"
                                        onclick="
                                            seleccionarOpcion(
                                                'color',
                                                '${color}'
                                            )
                                        "
                                    >

                                        ${color}

                                    </button>

                                `;

                            }
                        ).join("")}

                    </div>

                </div>


                <button
                    type="button"
                    id="boton-agregar-detalle"
                    class="boton-agregar"
                    onclick="agregarDetalleAlCarrito()"
                    disabled
                >

                    ELEGÍ TALLE Y COLOR

                </button>

            </div>

        </div>

    `;

}


// ======================================================
// SELECCIONAR TALLE / COLOR
// ======================================================

function seleccionarOpcion(
    tipo,
    valor
) {

    const contenedor =
        tipo === "talle"
            ? document.getElementById("talles")
            : document.getElementById("colores");


    if (!contenedor) return;


    contenedor
        .querySelectorAll(".opcion")
        .forEach(
            function(boton) {

                boton.classList.remove(
                    "seleccionado"
                );

            }
        );


    const botones =
        contenedor.querySelectorAll(
            ".opcion"
        );


    botones.forEach(
        function(boton) {

            if (
                boton.textContent.trim() ===
                valor
            ) {

                boton.classList.add(
                    "seleccionado"
                );

            }

        }
    );


    if (tipo === "talle") {

        window.talleSeleccionado =
            valor;

    } else {

        window.colorSeleccionado =
            valor;

    }


    actualizarBotonDetalle();

}


// ======================================================
// BOTÓN DEL DETALLE
// ======================================================

function actualizarBotonDetalle() {

    const boton =
        document.getElementById(
            "boton-agregar-detalle"
        );


    if (!boton) return;


    if (
        window.talleSeleccionado &&
        window.colorSeleccionado
    ) {

        boton.disabled =
            false;

        boton.textContent =
            "🛒 AGREGAR AL CARRITO";

    } else {

        boton.disabled =
            true;

        boton.textContent =
            "ELEGÍ TALLE Y COLOR";

    }

}


// ======================================================
// AGREGAR DESDE DETALLE
// ======================================================

function agregarDetalleAlCarrito() {

    const parametros =
        new URLSearchParams(
            window.location.search
        );


    const nombre =
        parametros.get("producto");


    if (
        !nombre ||
        !window.talleSeleccionado ||
        !window.colorSeleccionado
    ) {

        alert(
            "⚠️ Elegí un talle y un color."
        );

        return;
    }


    agregarAlCarrito(
        nombre,
        window.talleSeleccionado,
        window.colorSeleccionado,
        1
    );

}


// ======================================================
// MOSTRAR CARRITO
// ======================================================

function mostrarCarrito() {

    const contenedor =
        document.getElementById(
            "lista-carrito"
        );


    if (!contenedor) return;


    contenedor.innerHTML =
        "";


    if (carrito.length === 0) {

        contenedor.innerHTML = `

            <div class="carrito-vacio">

                <h2>
                    🛒 Tu carrito está vacío
                </h2>

                <p>
                    Todavía no agregaste productos.
                </p>

                <a
                    href="index.html#productos"
                    class="boton"
                >

                    SEGUIR COMPRANDO

                </a>

            </div>

        `;


        actualizarTotales();

        return;
    }


    carrito.forEach(
        function(producto, indice) {

            const cantidad =
                Number(producto.cantidad) || 1;


            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "item-carrito";


            div.innerHTML = `

                <div class="imagen-carrito">

                    <img
                        src="${escaparHTML(producto.imagen)}"
                        alt="${escaparHTML(producto.nombre)}"
                    >

                </div>


                <div class="info-carrito">

                    <h3>
                        ${escaparHTML(producto.nombre)}
                    </h3>


                    ${
                        producto.talle
                            ? `
                                <p>
                                    <strong>
                                        Talle:
                                    </strong>

                                    ${escaparHTML(
                                        producto.talle
                                    )}

                                </p>
                            `
                            : ""
                    }


                    ${
                        producto.color
                            ? `
                                <p>
                                    <strong>
                                        Color:
                                    </strong>

                                    ${escaparHTML(
                                        producto.color
                                    )}

                                </p>
                            `
                            : ""
                    }


                    <p>

                        Precio:

                        <strong>
                            $${formatearPrecio(
                                producto.precio
                            )}
                        </strong>

                    </p>


                    <div class="cantidad-controles">

                        <button
                            type="button"
                            onclick="
                                cambiarCantidad(
                                    ${indice},
                                    -1
                                )
                            "
                        >
                            −
                        </button>


                        <span>
                            ${cantidad}
                        </span>


                        <button
                            type="button"
                            onclick="
                                cambiarCantidad(
                                    ${indice},
                                    1
                                )
                            "
                        >
                            +
                        </button>

                    </div>


                    <p class="subtotal-producto">

                        Subtotal:

                        <strong>
                            $${formatearPrecio(
                                Number(producto.precio) *
                                cantidad
                            )}
                        </strong>

                    </p>

                </div>


                <button
                    type="button"
                    class="eliminar"
                    onclick="
                        eliminarDelCarrito(
                            ${indice}
                        )
                    "
                    title="Eliminar producto"
                >

                    🗑️

                </button>

            `;


            contenedor.appendChild(
                div
            );

        }
    );


    const zona =
        document.getElementById(
            "zona-envio"
        );


    if (
        zona &&
        costoEnvio !== undefined
    ) {

        const existe =
            Array.from(
                zona.options
            ).some(
                function(option) {

                    return Number(
                        option.value
                    ) === Number(
                        costoEnvio
                    );

                }
            );


        if (
            existe &&
            costoEnvio > 0
        ) {

            zona.value =
                String(costoEnvio);

        }

    }


    actualizarTotales();

}


// ======================================================
// CAMBIAR CANTIDAD
// ======================================================

function cambiarCantidad(
    indice,
    cambio
) {

    if (!carrito[indice]) return;


    carrito[indice].cantidad =
        (Number(
            carrito[indice].cantidad
        ) || 1) +
        cambio;


    if (
        carrito[indice].cantidad <= 0
    ) {

        carrito.splice(
            indice,
            1
        );

    }


    guardarCarrito();

    mostrarCarrito();

}


// ======================================================
// ELIMINAR DEL CARRITO
// ======================================================

function eliminarDelCarrito(
    indice
) {

    if (!carrito[indice]) return;


    const nombre =
        carrito[indice].nombre;


    carrito.splice(
        indice,
        1
    );


    guardarCarrito();

    mostrarCarrito();


    mostrarNotificacion(
        `🗑️ ${nombre} fue eliminado del carrito.`
    );

}


// ======================================================
// ENVÍO
// ======================================================

function calcularEnvio() {

    const select =
        document.getElementById(
            "zona-envio"
        );


    if (!select) return;


    costoEnvio =
        Number(
            select.value
        ) || 0;


    localStorage.setItem(
        "costoEnvio",
        costoEnvio
    );


    actualizarTotales();

}


// ======================================================
// CUPÓN
// ======================================================

function aplicarCupon() {

    const input =
        document.getElementById(
            "cupon"
        );


    if (!input) return;


    const codigo =
        input.value
            .trim()
            .toUpperCase();


    if (
        codigo === "URBAN20"
    ) {

        descuentoAplicado =
            20;


        localStorage.setItem(
            "descuentoUrban",
            descuentoAplicado
        );


        mostrarNotificacion(
            "🎟️ Cupón URBAN20 aplicado: 20% de descuento."
        );

    } else {

        descuentoAplicado =
            0;


        localStorage.removeItem(
            "descuentoUrban"
        );


        alert(
            "❌ Cupón inválido."
        );

    }


    actualizarTotales();

}


// ======================================================
// TOTALES
// ======================================================

function actualizarTotales() {

    let subtotal =
        0;


    carrito.forEach(
        function(producto) {

            subtotal +=
                Number(
                    producto.precio || 0
                ) *
                (
                    Number(
                        producto.cantidad
                    ) || 1
                );

        }
    );


    const descuento =
        Math.round(
            subtotal *
            (
                descuentoAplicado /
                100
            )
        );


    const total =
        Math.max(
            0,
            subtotal -
            descuento +
            costoEnvio
        );


    const subtotalElemento =
        document.getElementById(
            "subtotal"
        );


    if (subtotalElemento) {

        subtotalElemento.textContent =
            "SUBTOTAL: $" +
            formatearPrecio(
                subtotal
            );

    }


    const descuentoElemento =
        document.getElementById(
            "descuento"
        );


    if (descuentoElemento) {

        descuentoElemento.textContent =
            "DESCUENTO: $" +
            formatearPrecio(
                descuento
            );

    }


    const envioElemento =
        document.getElementById(
            "envio"
        );


    if (envioElemento) {

        envioElemento.textContent =
            "ENVÍO: $" +
            formatearPrecio(
                costoEnvio
            );

    }


    const costoEnvioElemento =
        document.getElementById(
            "costo-envio"
        );


    if (costoEnvioElemento) {

        costoEnvioElemento.textContent =
            "ENVÍO: $" +
            formatearPrecio(
                costoEnvio
            );

    }


    const totalElemento =
        document.getElementById(
            "total"
        );


    if (totalElemento) {

        totalElemento.textContent =
            "TOTAL: $" +
            formatearPrecio(
                total
            );

    }


    return {

        subtotal:
            subtotal,

        descuento:
            descuento,

        envio:
            costoEnvio,

        total:
            total

    };

}


// ======================================================
// IR A PAGAR
// ======================================================

function irAPagar() {

    if (
        carrito.length === 0
    ) {

        alert(
            "🛒 El carrito está vacío."
        );

        return;
    }


    window.location.href =
        "pagar.html";

}


// ======================================================
// VALIDACIONES DE PAGO
// ======================================================

function soloLetras(input) {

    if (!input) return;


    input.value =
        input.value.replace(
            /[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g,
            ""
        );

}


function soloNumeros(input) {

    if (!input) return;


    input.value =
        input.value.replace(
            /[^0-9]/g,
            ""
        );

}


function formatearTarjeta(input) {

    if (!input) return;


    let numero =
        input.value.replace(
            /[^0-9]/g,
            ""
        );


    numero =
        numero.substring(
            0,
            16
        );


    let resultado =
        "";


    for (
        let i = 0;
        i < numero.length;
        i++
    ) {

        if (
            i > 0 &&
            i % 4 === 0
        ) {

            resultado +=
                " ";

        }


        resultado +=
            numero[i];

    }


    input.value =
        resultado;

}


function formatearVencimiento(
    input
) {

    if (!input) return;


    let valor =
        input.value.replace(
            /[^0-9]/g,
            ""
        );


    valor =
        valor.substring(
            0,
            4
        );


    if (
        valor.length > 2
    ) {

        valor =
            valor.substring(
                0,
                2
            ) +
            "/" +
            valor.substring(
                2
            );

    }


    input.value =
        valor;

}


// ======================================================
// FINALIZAR COMPRA
// ======================================================

function finalizarCompra() {

    if (
        carrito.length === 0
    ) {

        alert(
            "🛒 No hay productos en el carrito."
        );

        return;
    }


    const nombre =
        document.getElementById(
            "nombre"
        );


    const tarjeta =
        document.getElementById(
            "tarjeta"
        );


    const vencimiento =
        document.getElementById(
            "vencimiento"
        );


    const cvv =
        document.getElementById(
            "cvv"
        );


    if (
        !nombre ||
        !tarjeta ||
        !vencimiento ||
        !cvv
    ) {

        return;

    }


    if (
        nombre.value.trim() === "" ||
        tarjeta.value.replace(/\s/g, "").length !== 16 ||
        vencimiento.value.length !== 5 ||
        cvv.value.length !== 3
    ) {

        alert(
            "⚠️ Completá correctamente los datos de prueba."
        );

        return;
    }


    const totales =
        actualizarTotales();


    const pedidos =
        JSON.parse(
            localStorage.getItem(
                "pedidos"
            )
        ) || [];


    const pedido = {

        fecha:
            new Date()
                .toLocaleString(
                    "es-AR"
                ),

        productos:
            JSON.parse(
                JSON.stringify(
                    carrito
                )
            ),

        subtotal:
            totales.subtotal,

        descuento:
            totales.descuento,

        envio:
            totales.envio,

        total:
            totales.total,

        estado:
            "Pendiente"

    };


    pedidos.push(
        pedido
    );


    localStorage.setItem(
        "pedidos",
        JSON.stringify(
            pedidos
        )
    );


    // Vaciar carrito

    carrito =
        [];


    localStorage.setItem(
        "carritoUrban",
        JSON.stringify([])
    );


    // Reiniciar cupón y envío

    descuentoAplicado =
        0;

    costoEnvio =
        0;


    localStorage.removeItem(
        "descuentoUrban"
    );

    localStorage.removeItem(
        "costoEnvio"
    );


    actualizarContadorCarrito();


    const formulario =
        document.getElementById(
            "formulario-pago"
        );


    if (formulario) {

        formulario.style.display =
            "none";

    }


    const exito =
        document.getElementById(
            "compra-exitosa"
        );


    if (exito) {

        exito.classList.add(
            "mostrar"
        );


        crearConfeti();


        setTimeout(
            function() {

                window.location.href =
                    "pedidos.html";

            },
            3000
        );

    } else {

        alert(
            "🎉 ¡Compra realizada correctamente!"
        );


        window.location.href =
            "pedidos.html";

    }

}


// ======================================================
// CONFETI
// ======================================================

function crearConfeti() {

    const contenedor =
        document.getElementById(
            "confeti"
        );


    if (!contenedor) return;


    contenedor.innerHTML =
        "";


    for (
        let i = 0;
        i < 60;
        i++
    ) {

        const pieza =
            document.createElement(
                "span"
            );


        pieza.className =
            "pieza-confeti";


        pieza.style.left =
            Math.random() * 100 +
            "%";


        pieza.style.animationDelay =
            Math.random() * 2 +
            "s";


        pieza.style.transform =
            `rotate(${Math.random() * 360}deg)`;


        contenedor.appendChild(
            pieza
        );

    }

}


// ======================================================
// MOSTRAR PEDIDOS
// ======================================================

function mostrarPedidos() {

    const contenedor =
        document.getElementById(
            "lista-pedidos"
        );


    if (!contenedor) return;


    const pedidos =
        JSON.parse(
            localStorage.getItem(
                "pedidos"
            )
        ) || [];


    contenedor.innerHTML =
        "";


    if (
        pedidos.length === 0
    ) {

        contenedor.innerHTML = `

            <div class="carrito-vacio">

                <h2>
                    📦 No tenés pedidos todavía
                </h2>

                <p>
                    Cuando realices una compra,
                    aparecerá acá.
                </p>

                <a
                    href="index.html#productos"
                    class="boton"
                >

                    VER PRODUCTOS

                </a>

            </div>

        `;

        return;
    }


    pedidos
        .slice()
        .reverse()
        .forEach(
            function(pedido, indice) {

                const div =
                    document.createElement(
                        "article"
                    );


                div.className =
                    "pedido";


                const estado =
                    normalizarEstadoPedido(
                        pedido.estado
                    );


                let productosHTML =
                    "";


                if (
                    Array.isArray(
                        pedido.productos
                    )
                ) {

                    pedido.productos.forEach(
                        function(producto) {

                            productosHTML += `

                                <div class="producto-pedido">

                                    <img
                                        src="${escaparHTML(producto.imagen)}"
                                        alt="${escaparHTML(producto.nombre)}"
                                    >


                                    <div>

                                        <strong>
                                            ${escaparHTML(producto.nombre)}
                                        </strong>


                                        <p>
                                            Cantidad:
                                            ${Number(producto.cantidad) || 1}
                                        </p>


                                        ${
                                            producto.talle
                                                ? `
                                                    <p>
                                                        Talle:
                                                        ${escaparHTML(
                                                            producto.talle
                                                        )}
                                                    </p>
                                                `
                                                : ""
                                        }


                                        ${
                                            producto.color
                                                ? `
                                                    <p>
                                                        Color:
                                                        ${escaparHTML(
                                                            producto.color
                                                        )}
                                                    </p>
                                                `
                                                : ""
                                        }

                                    </div>

                                </div>

                            `;

                        }
                    );

                }


                div.innerHTML = `

                    <div class="pedido-cabecera">

                        <h2>
                            📦 Pedido #${pedidos.length - indice}
                        </h2>


                        <span class="estado-pedido">

                            ${escaparHTML(
                                estado
                            )}

                        </span>

                    </div>


                    <p>

                        📅 Fecha:

                        ${escaparHTML(
                            pedido.fecha ||
                            "Sin fecha"
                        )}

                    </p>


                    <div class="productos-del-pedido">

                        ${productosHTML}

                    </div>


                    <div class="pedido-total">

                        <p>

                            Subtotal:

                            $${formatearPrecio(
                                pedido.subtotal || 0
                            )}

                        </p>


                        <p>

                            Descuento:

                            -$${formatearPrecio(
                                pedido.descuento || 0
                            )}

                        </p>


                        <p>

                            Envío:

                            $${formatearPrecio(
                                pedido.envio || 0
                            )}

                        </p>


                        <h3>

                            TOTAL:

                            $${formatearPrecio(
                                pedido.total || 0
                            )}

                        </h3>

                    </div>

                `;


                contenedor.appendChild(
                    div
                );

            }
        );

}


// ======================================================
// ESTADOS
// ======================================================

function normalizarEstadoPedido(
    estado
) {

    if (
        !estado ||
        estado === "recibido"
    ) {

        return "Pendiente";

    }


    const estados = [

        "Pendiente",
        "Preparando",
        "Enviado",
        "Entregado"

    ];


    if (
        estados.includes(estado)
    ) {

        return estado;

    }


    return "Pendiente";

}


// ======================================================
// TEMA
// ======================================================

function cambiarTema() {

    document.body.classList.toggle(
        "modo-claro"
    );


    const modoClaro =
        document.body.classList.contains(
            "modo-claro"
        );


    localStorage.setItem(
        "temaUrban",
        modoClaro
            ? "claro"
            : "oscuro"
    );


    actualizarBotonTema();

}


function cargarTema() {

    const tema =
        localStorage.getItem(
            "temaUrban"
        );


    if (
        tema === "claro"
    ) {

        document.body.classList.add(
            "modo-claro"
        );

    } else {

        document.body.classList.remove(
            "modo-claro"
        );

    }


    actualizarBotonTema();

}


function actualizarBotonTema() {

    const boton =
        document.getElementById(
            "boton-tema"
        );


    if (!boton) return;


    const modoClaro =
        document.body.classList.contains(
            "modo-claro"
        );


    boton.textContent =
        modoClaro
            ? "☀️"
            : "🌙";

}


// ======================================================
// OFERTAS
// ======================================================

const DURACION_OFERTA =
    24 *
    60 *
    60 *
    1000;


function obtenerOfertaAdmin() {

    const oferta =
        JSON.parse(
            localStorage.getItem(
                "ofertaUrban"
            )
        );


    if (!oferta) {
        return null;
    }


    if (
        !oferta.fechaFin ||
        oferta.fechaFin <= Date.now()
    ) {

        localStorage.removeItem(
            "ofertaUrban"
        );

        return null;
    }


    return oferta;

}


function mostrarOfertas() {

    const contenedor =
        document.querySelector(
            ".ofertas-grid"
        );


    if (!contenedor) return;


    productosUrban =
        obtenerProductos();


    const ofertas =
        [];


    // --------------------------------------------------
    // OFERTA CREADA DESDE ADMIN
    // --------------------------------------------------

    const ofertaAdmin =
        obtenerOfertaAdmin();


    if (ofertaAdmin) {

        let producto =
            null;


        if (
            ofertaAdmin.producto
        ) {

            producto =
                productosUrban.find(
                    function(item) {

                        return (
                            item.nombre ===
                            ofertaAdmin.producto
                        );

                    }
                );

        }


        if (
            !producto &&
            Number.isInteger(
                Number(
                    ofertaAdmin.indice
                )
            )
        ) {

            producto =
                productosUrban[
                    Number(
                        ofertaAdmin.indice
                    )
                ];

        }


        if (producto) {

            ofertas.push({

                nombre:
                    producto.nombre,

                precioAnterior:
                    Number(
                        ofertaAdmin.precioOriginal ||
                        producto.precio
                    ),

                precioOferta:
                    Number(
                        ofertaAdmin.precioOferta
                    ),

                descuento:
                    Number(
                        ofertaAdmin.descuento
                    ),

                imagen:
                    producto.imagen

            });

        }

    }


    // --------------------------------------------------
    // OFERTAS ORIGINALES
    // --------------------------------------------------

    ofertasOriginales.forEach(
        function(oferta) {

            const yaExiste =
                ofertas.some(
                    function(item) {

                        return (
                            item.nombre ===
                            oferta.nombre
                        );

                    }
                );


            if (!yaExiste) {

                ofertas.push(
                    oferta
                );

            }

        }
    );


    contenedor.innerHTML =
        "";


    ofertas.forEach(
        function(oferta) {

            const article =
                document.createElement(
                    "article"
                );


            article.className =
                "oferta";


            article.innerHTML = `

                <div class="oferta-imagen">

                    <img
                        src="${escaparHTML(oferta.imagen)}"
                        alt="${escaparHTML(oferta.nombre)}"
                    >


                    <span class="descuento">

                        -${Number(
                            oferta.descuento
                        )}%

                    </span>

                </div>


                <div class="oferta-info">

                    <h3>
                        ${escaparHTML(oferta.nombre)}
                    </h3>


                    <p class="precio-anterior">

                        $${formatearPrecio(
                            oferta.precioAnterior
                        )}

                    </p>


                    <p class="precio-oferta">

                        $${formatearPrecio(
                            oferta.precioOferta
                        )}

                    </p>


                    <a
                        href="producto.html?producto=${encodeURIComponent(oferta.nombre)}"
                        class="boton"
                    >

                        VER PRODUCTO

                    </a>

                </div>

            `;


            contenedor.appendChild(
                article
            );

        }
    );

}


// ======================================================
// CONTADOR DE OFERTA
// ======================================================

function obtenerFinOferta() {

    const ofertaAdmin =
        obtenerOfertaAdmin();


    if (ofertaAdmin) {

        return ofertaAdmin.fechaFin;

    }


    let fin =
        Number(
            localStorage.getItem(
                "finOfertaUrban"
            )
        );


    if (
        !fin ||
        fin <= Date.now()
    ) {

        fin =
            Date.now() +
            DURACION_OFERTA;


        localStorage.setItem(
            "finOfertaUrban",
            fin
        );

    }


    return fin;

}


function iniciarContadorOferta() {

    const contador =
        document.getElementById(
            "contador-oferta"
        );


    if (!contador) return;


    function actualizar() {

        const fin =
            obtenerFinOferta();


        let restante =
            fin -
            Date.now();


        if (
            restante <= 0
        ) {

            contador.textContent =
                "00:00:00";


            const ofertaAdmin =
                JSON.parse(
                    localStorage.getItem(
                        "ofertaUrban"
                    )
                );


            if (
                ofertaAdmin &&
                ofertaAdmin.fechaFin <=
                Date.now()
            ) {

                localStorage.removeItem(
                    "ofertaUrban"
                );


                mostrarOfertas();

            }


            return;
        }


        const horas =
            Math.floor(
                restante /
                (
                    1000 *
                    60 *
                    60
                )
            );


        restante %=
            1000 *
            60 *
            60;


        const minutos =
            Math.floor(
                restante /
                (
                    1000 *
                    60
                )
            );


        restante %=
            1000 *
            60;


        const segundos =
            Math.floor(
                restante /
                1000
            );


        contador.textContent =
            String(
                horas
            ).padStart(
                2,
                "0"
            ) +
            ":" +
            String(
                minutos
            ).padStart(
                2,
                "0"
            ) +
            ":" +
            String(
                segundos
            ).padStart(
                2,
                "0"
            );

    }


    actualizar();


    setInterval(
        actualizar,
        1000
    );

}


// ======================================================
// INICIAR TODO
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        productosUrban =
            obtenerProductos();


        carrito =
            JSON.parse(
                localStorage.getItem(
                    "carritoUrban"
                )
            ) || [];


        favoritos =
            JSON.parse(
                localStorage.getItem(
                    "favoritosUrban"
                )
            ) || [];


        costoEnvio =
            Number(
                localStorage.getItem(
                    "costoEnvio"
                )
            ) || 0;


        descuentoAplicado =
            Number(
                localStorage.getItem(
                    "descuentoUrban"
                )
            ) || 0;


        mostrarProductosTienda();

        actualizarContadorCarrito();

        mostrarCarrito();

        mostrarFavoritos();

        actualizarBotonesFavoritos();

        mostrarDetalleProducto();

        mostrarPedidos();

        // ⭐ NUEVO:
        // Comprueba si existe un aviso
        // de pedido entregado.
        mostrarAvisoPedidoEntregado();

        cargarTema();

        mostrarOfertas();

        iniciarContadorOferta();


        // ------------------------------------------------
        // FORMULARIO DE PAGO
        // ------------------------------------------------

        const formulario =
            document.getElementById(
                "formulario-pago"
            );


        if (formulario) {

            formulario.addEventListener(
                "submit",
                function(event) {

                    event.preventDefault();

                    finalizarCompra();

                }
            );

        }

    }
);