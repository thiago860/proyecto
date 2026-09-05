// ======================================================
// URBAN STYLE - ADMIN.JS
// ======================================================


// ======================================================
// PROTECCIÓN DEL PANEL
// ======================================================

if (
    sessionStorage.getItem("adminLogueado") !== "true"
) {
    window.location.href = "login-admin.html";
}


// ======================================================
// PRODUCTOS POR DEFECTO
// ======================================================

const productosPorDefecto = [

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
    },

    {
        nombre: "Collar Urban",
        precio: 12000,
        categoria: "accesorios",
        imagen: "imagenes/collar.webp"
    }

];


// ======================================================
// VARIABLES
// ======================================================

let productosAdmin = [];


// ======================================================
// CARGAR PRODUCTOS
// ======================================================

function cargarProductosAdmin() {

    const guardados =
        JSON.parse(
            localStorage.getItem("productosUrban")
        );

    if (
        Array.isArray(guardados) &&
        guardados.length > 0
    ) {

        productosAdmin = guardados;

    } else {

        productosAdmin =
            JSON.parse(
                JSON.stringify(productosPorDefecto)
            );

        guardarProductosAdmin();
    }

}


// ======================================================
// GUARDAR PRODUCTOS
// ======================================================

function guardarProductosAdmin() {

    localStorage.setItem(
        "productosUrban",
        JSON.stringify(productosAdmin)
    );

}


// ======================================================
// FORMATEAR PRECIO
// ======================================================

function formatearPrecioAdmin(precio) {

    return Number(precio || 0)
        .toLocaleString("es-AR");

}


// ======================================================
// NORMALIZAR IMAGEN
// ======================================================

function normalizarRutaImagen(ruta) {

    ruta = String(ruta || "").trim();

    if (ruta === "") {
        return "";
    }

    ruta = ruta.replace(/\\/g, "/");

    if (
        ruta.startsWith("imagenes/")
    ) {
        return ruta;
    }

    return "imagenes/" + ruta;

}


// ======================================================
// ESCAPAR HTML
// ======================================================

function escaparHTMLAdmin(texto) {

    return String(texto ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ======================================================
// MOSTRAR PRODUCTOS
// ======================================================

function mostrarProductosAdmin() {

    const contenedor =
        document.getElementById(
            "lista-admin-productos"
        );

    if (!contenedor) {
        return;
    }

    contenedor.innerHTML = "";


    if (
        productosAdmin.length === 0
    ) {

        contenedor.innerHTML = `

            <div class="admin-vacio">

                <h3>
                    🛍️ No hay productos
                </h3>

                <p>
                    Agregá un producto para comenzar.
                </p>

            </div>

        `;

        return;
    }


    productosAdmin.forEach(
        function(producto, indice) {

            const div =
                document.createElement("div");

            div.className =
                "admin-producto";


            div.innerHTML = `

                <div class="admin-producto-imagen">

                    <img
                        src="${escaparHTMLAdmin(producto.imagen)}"
                        alt="${escaparHTMLAdmin(producto.nombre)}"
                        onerror="this.style.opacity='0.3'"
                    >

                </div>


                <div class="admin-producto-info">

                    <h3>
                        ${escaparHTMLAdmin(
                            producto.nombre
                        )}
                    </h3>


                    <p>
                        Categoría:
                        <strong>
                            ${escaparHTMLAdmin(
                                producto.categoria
                            )}
                        </strong>
                    </p>


                    <p>
                        Precio:
                        <strong>
                            $${formatearPrecioAdmin(
                                producto.precio
                            )}
                        </strong>
                    </p>


                    <p>
                        Imagen:
                        <strong>
                            ${escaparHTMLAdmin(
                                producto.imagen
                            )}
                        </strong>
                    </p>


                    <div class="admin-botones">

                        <button
                            type="button"
                            onclick="editarProductoAdmin(${indice})"
                        >
                            ✏️ EDITAR
                        </button>


                        <button
                            type="button"
                            onclick="eliminarProductoAdmin(${indice})"
                        >
                            🗑️ ELIMINAR
                        </button>

                    </div>

                </div>

            `;


            contenedor.appendChild(div);

        }
    );

}


// ======================================================
// AGREGAR PRODUCTO
// ======================================================

function agregarProductoAdmin() {

    const nombre =
        document.getElementById(
            "nuevo-nombre"
        );

    const precio =
        document.getElementById(
            "nuevo-precio"
        );

    const categoria =
        document.getElementById(
            "nueva-categoria"
        );

    const imagen =
        document.getElementById(
            "nueva-imagen"
        );


    if (
        !nombre ||
        !precio ||
        !categoria ||
        !imagen
    ) {

        alert(
            "❌ No se encontraron los campos del producto."
        );

        return;
    }


    const nombreValor =
        nombre.value.trim();

    const precioValor =
        Number(precio.value);

    const categoriaValor =
        categoria.value.trim();

    const imagenValor =
        normalizarRutaImagen(
            imagen.value
        );


    if (
        nombreValor === ""
    ) {

        alert(
            "⚠️ Escribí el nombre del producto."
        );

        return;
    }


    if (
        !precioValor ||
        precioValor <= 0
    ) {

        alert(
            "⚠️ Ingresá un precio válido."
        );

        return;
    }


    if (
        imagenValor === ""
    ) {

        alert(
            "⚠️ Ingresá la imagen del producto."
        );

        return;
    }


    productosAdmin.push({

        nombre: nombreValor,

        precio: precioValor,

        categoria: categoriaValor,

        imagen: imagenValor

    });


    guardarProductosAdmin();

    mostrarProductosAdmin();

    actualizarEstadisticas();

    cargarProductosOferta();


    nombre.value = "";

    precio.value = "";

    imagen.value = "";


    alert(
        "✅ Producto agregado correctamente."
    );

}


// ======================================================
// EDITAR PRODUCTO
// ======================================================

function editarProductoAdmin(indice) {

    if (
        !productosAdmin[indice]
    ) {
        return;
    }


    const producto =
        productosAdmin[indice];


    const nuevoNombre =
        prompt(
            "Nombre del producto:",
            producto.nombre
        );


    if (
        nuevoNombre === null
    ) {
        return;
    }


    const nuevoPrecio =
        prompt(
            "Precio:",
            producto.precio
        );


    if (
        nuevoPrecio === null
    ) {
        return;
    }


    const nuevaCategoria =
        prompt(
            "Categoría:",
            producto.categoria
        );


    if (
        nuevaCategoria === null
    ) {
        return;
    }


    const nuevaImagen =
        prompt(
            "Imagen. Ejemplo: collar.webp",
            producto.imagen
                .replace(
                    "imagenes/",
                    ""
                )
        );


    if (
        nuevaImagen === null
    ) {
        return;
    }


    const precioNumero =
        Number(nuevoPrecio);


    if (
        !precioNumero ||
        precioNumero <= 0
    ) {

        alert(
            "❌ Precio inválido."
        );

        return;
    }


    producto.nombre =
        nuevoNombre.trim();

    producto.precio =
        precioNumero;

    producto.categoria =
        nuevaCategoria.trim();

    producto.imagen =
        normalizarRutaImagen(
            nuevaImagen
        );


    guardarProductosAdmin();

    mostrarProductosAdmin();

    actualizarEstadisticas();

    cargarProductosOferta();


    alert(
        "✅ Producto actualizado correctamente."
    );

}


// ======================================================
// ELIMINAR PRODUCTO
// ======================================================

function eliminarProductoAdmin(indice) {

    if (
        !productosAdmin[indice]
    ) {
        return;
    }


    const confirmar =
        confirm(
            "¿Seguro que querés eliminar este producto?"
        );


    if (!confirmar) {
        return;
    }


    productosAdmin.splice(
        indice,
        1
    );


    guardarProductosAdmin();

    mostrarProductosAdmin();

    actualizarEstadisticas();

    cargarProductosOferta();


    alert(
        "🗑️ Producto eliminado."
    );

}


// ======================================================
// RESTAURAR PRODUCTOS
// ======================================================

function restaurarProductos() {

    const confirmar =
        confirm(
            "¿Querés restaurar todos los productos originales?"
        );


    if (!confirmar) {
        return;
    }


    productosAdmin =
        JSON.parse(
            JSON.stringify(
                productosPorDefecto
            )
        );


    guardarProductosAdmin();

    mostrarProductosAdmin();

    actualizarEstadisticas();

    cargarProductosOferta();


    alert(
        "🔄 Productos restaurados correctamente."
    );

}


// ======================================================
// CARGAR PRODUCTOS EN SELECT DE OFERTA
// ======================================================

function cargarProductosOferta() {

    const select =
        document.getElementById(
            "producto-oferta"
        );


    if (!select) {
        return;
    }


    const ofertaGuardada =
        JSON.parse(
            localStorage.getItem(
                "ofertaUrban"
            )
        );


    select.innerHTML = "";


    productosAdmin.forEach(
        function(producto) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                producto.nombre;


            option.textContent =
                producto.nombre;


            if (
                ofertaGuardada &&
                ofertaGuardada.producto ===
                producto.nombre
            ) {

                option.selected = true;

            }


            select.appendChild(
                option
            );

        }
    );


    mostrarOfertaActual();

}


// ======================================================
// GUARDAR OFERTA
// ======================================================

function guardarOfertaAdmin() {

    const producto =
        document.getElementById(
            "producto-oferta"
        );

    const porcentaje =
        document.getElementById(
            "porcentaje-oferta"
        );

    const duracion =
        document.getElementById(
            "duracion-oferta"
        );


    if (
        !producto ||
        !porcentaje ||
        !duracion
    ) {

        alert(
            "❌ No se encontraron los campos de la oferta."
        );

        return;
    }


    const nombreProducto =
        producto.value;


    const descuento =
        Number(
            porcentaje.value
        );


    const horas =
        Number(
            duracion.value
        );


    const productoEncontrado =
        productosAdmin.find(
            function(item) {

                return (
                    item.nombre ===
                    nombreProducto
                );

            }
        );


    if (
        !productoEncontrado
    ) {

        alert(
            "⚠️ No se encontró el producto."
        );

        return;
    }


    if (
        descuento <= 0 ||
        descuento > 90
    ) {

        alert(
            "⚠️ El descuento debe estar entre 1 y 90%."
        );

        return;
    }


    const precioOriginal =
        Number(
            productoEncontrado.precio
        );


    const precioOferta =
        Math.round(
            precioOriginal *
            (
                1 -
                descuento / 100
            )
        );


    const fechaFin =
        Date.now() +
        (
            horas *
            60 *
            60 *
            1000
        );


    const oferta = {

        producto:
            nombreProducto,

        precioOriginal:
            precioOriginal,

        precioOferta:
            precioOferta,

        descuento:
            descuento,

        duracion:
            horas,

        fechaFin:
            fechaFin

    };


    localStorage.setItem(
        "ofertaUrban",
        JSON.stringify(
            oferta
        )
    );


    mostrarOfertaActual();


    alert(
        "🔥 Oferta guardada correctamente."
    );

}


// ======================================================
// MOSTRAR OFERTA ACTUAL
// ======================================================

function mostrarOfertaActual() {

    const contenedor =
        document.getElementById(
            "oferta-actual"
        );


    if (!contenedor) {
        return;
    }


    const oferta =
        JSON.parse(
            localStorage.getItem(
                "ofertaUrban"
            )
        );


    if (!oferta) {

        contenedor.innerHTML = `

            <p>
                No hay ninguna oferta configurada.
            </p>

        `;

        return;
    }


    const fechaFin =
        Number(
            oferta.fechaFin
        );


    if (
        fechaFin &&
        Date.now() >= fechaFin
    ) {

        localStorage.removeItem(
            "ofertaUrban"
        );


        contenedor.innerHTML = `

            <p>
                ⏰ La oferta terminó.
            </p>

        `;

        return;
    }


    contenedor.innerHTML = `

        <div class="oferta-admin-contenido">

            <h3>
                🔥 Oferta activa
            </h3>


            <p>

                Producto:

                <strong>
                    ${escaparHTMLAdmin(
                        oferta.producto
                    )}
                </strong>

            </p>


            <p>

                Precio original:

                <del>
                    $${formatearPrecioAdmin(
                        oferta.precioOriginal
                    )}
                </del>

            </p>


            <p>

                Precio oferta:

                <strong>
                    $${formatearPrecioAdmin(
                        oferta.precioOferta
                    )}
                </strong>

            </p>


            <p>

                Descuento:

                <strong>
                    ${oferta.descuento}%
                </strong>

            </p>


            <button
                type="button"
                class="admin-boton"
                onclick="eliminarOfertaAdmin()"
            >
                🗑️ ELIMINAR OFERTA
            </button>

        </div>

    `;

}


// ======================================================
// ELIMINAR OFERTA
// ======================================================

function eliminarOfertaAdmin() {

    const confirmar =
        confirm(
            "¿Querés eliminar la oferta?"
        );


    if (!confirmar) {
        return;
    }


    localStorage.removeItem(
        "ofertaUrban"
    );


    mostrarOfertaActual();


    alert(
        "🗑️ Oferta eliminada."
    );

}


// ======================================================
// NORMALIZAR ESTADO DEL PEDIDO
// ======================================================

function normalizarEstadoAdmin(
    estado
) {

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
// MOSTRAR PEDIDOS
// ======================================================

function mostrarPedidosAdmin() {

    const contenedor =
        document.getElementById(
            "lista-admin-pedidos"
        );


    if (!contenedor) {
        return;
    }


    const pedidos =
        JSON.parse(
            localStorage.getItem(
                "pedidos"
            )
        ) || [];


    contenedor.innerHTML = "";


    if (
        pedidos.length === 0
    ) {

        contenedor.innerHTML = `

            <div class="admin-vacio">

                <h3>
                    📦 No hay pedidos
                </h3>

                <p>
                    Cuando se realice una compra,
                    aparecerá acá.
                </p>

            </div>

        `;

        return;
    }


    pedidos.forEach(
        function(pedido, indice) {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "admin-pedido";


            const estado =
                normalizarEstadoAdmin(
                    pedido.estado
                );


            let productosHTML = "";


            // ------------------------------------------
            // PRODUCTOS DEL PEDIDO
            // ------------------------------------------

            if (
                Array.isArray(
                    pedido.productos
                )
            ) {

                pedido.productos.forEach(
                    function(producto) {

                        productosHTML += `

                            <div class="admin-pedido-producto">

                                ${
                                    producto.imagen
                                    ?
                                    `
                                        <img
                                            src="${escaparHTMLAdmin(
                                                producto.imagen
                                            )}"
                                            alt="${escaparHTMLAdmin(
                                                producto.nombre
                                            )}"
                                        >
                                    `
                                    :
                                    ""
                                }


                                <div>

                                    <strong>
                                        ${escaparHTMLAdmin(
                                            producto.nombre ||
                                            "Producto"
                                        )}
                                    </strong>


                                    <p>
                                        Cantidad:
                                        ${
                                            Number(
                                                producto.cantidad
                                            ) || 1
                                        }
                                    </p>


                                    ${
                                        producto.talle
                                        ?
                                        `
                                            <p>
                                                Talle:
                                                ${escaparHTMLAdmin(
                                                    producto.talle
                                                )}
                                            </p>
                                        `
                                        :
                                        ""
                                    }


                                    ${
                                        producto.color
                                        ?
                                        `
                                            <p>
                                                Color:
                                                ${escaparHTMLAdmin(
                                                    producto.color
                                                )}
                                            </p>
                                        `
                                        :
                                        ""
                                    }

                                </div>

                            </div>

                        `;

                    }
                );

            }


            // ------------------------------------------
            // PEDIDO
            // ------------------------------------------

            div.innerHTML = `

                <div class="admin-pedido-cabecera">

                    <div>

                        <h3>
                            📦 PEDIDO #${indice + 1}
                        </h3>


                        <p>
                            📅
                            ${escaparHTMLAdmin(
                                pedido.fecha ||
                                "Sin fecha"
                            )}
                        </p>

                    </div>


                    <div class="admin-estado">

                        <label>
                            Estado:
                        </label>


                        <select
                            onchange="
                                cambiarEstadoPedido(
                                    ${indice},
                                    this.value
                                )
                            "
                        >

                            <option
                                value="Pendiente"
                                ${
                                    estado === "Pendiente"
                                    ? "selected"
                                    : ""
                                }
                            >
                                Pendiente
                            </option>


                            <option
                                value="Preparando"
                                ${
                                    estado === "Preparando"
                                    ? "selected"
                                    : ""
                                }
                            >
                                Preparando
                            </option>


                            <option
                                value="Enviado"
                                ${
                                    estado === "Enviado"
                                    ? "selected"
                                    : ""
                                }
                            >
                                Enviado
                            </option>


                            <option
                                value="Entregado"
                                ${
                                    estado === "Entregado"
                                    ? "selected"
                                    : ""
                                }
                            >
                                Entregado
                            </option>

                        </select>

                    </div>

                </div>


                <div class="admin-pedido-productos">

                    ${productosHTML}

                </div>


                <div class="admin-pedido-total">

                    <p>
                        Subtotal:
                        $${formatearPrecioAdmin(
                            pedido.subtotal
                        )}
                    </p>


                    <p>
                        Descuento:
                        -$${formatearPrecioAdmin(
                            pedido.descuento
                        )}
                    </p>


                    <p>
                        Envío:
                        $${formatearPrecioAdmin(
                            pedido.envio
                        )}
                    </p>


                    <h3>
                        TOTAL:
                        $${formatearPrecioAdmin(
                            pedido.total
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
// CAMBIAR ESTADO DEL PEDIDO
// ======================================================

function cambiarEstadoPedido(
    indice,
    nuevoEstado
) {

    const pedidos =
        JSON.parse(
            localStorage.getItem(
                "pedidos"
            )
        ) || [];


    if (
        !pedidos[indice]
    ) {

        return;
    }


    // ==============================================
    // PEDIDO ENTREGADO
    // ==============================================

    if (
        nuevoEstado === "Entregado"
    ) {

        // Guardar aviso para el cliente

        localStorage.setItem(
            "ultimoPedidoEntregado",
            JSON.stringify({

                mensaje:
                    "📦 ¡Tu paquete ya fue entregado!",

                fecha:
                    Date.now()

            })
        );


        // Eliminar pedido

        pedidos.splice(
            indice,
            1
        );


        localStorage.setItem(
            "pedidos",
            JSON.stringify(
                pedidos
            )
        );


        mostrarPedidosAdmin();

        actualizarEstadisticas();


        alert(
            "📦 ¡Pedido marcado como entregado!"
        );


        return;
    }


    // ==============================================
    // OTROS ESTADOS
    // ==============================================

    pedidos[indice].estado =
        normalizarEstadoAdmin(
            nuevoEstado
        );


    localStorage.setItem(
        "pedidos",
        JSON.stringify(
            pedidos
        )
    );


    mostrarPedidosAdmin();

    actualizarEstadisticas();


    alert(
        "✅ Estado actualizado."
    );

}


// ======================================================
// ESTADÍSTICAS
// ======================================================

function actualizarEstadisticas() {

    const pedidos =
        JSON.parse(
            localStorage.getItem(
                "pedidos"
            )
        ) || [];


    const cantidadProductos =
        productosAdmin.length;


    const cantidadPedidos =
        pedidos.length;


    let dineroVendido = 0;


    pedidos.forEach(
        function(pedido) {

            dineroVendido +=
                Number(
                    pedido.total
                ) || 0;

        }
    );


    const productosElemento =
        document.getElementById(
            "cantidad-productos"
        );


    if (
        productosElemento
    ) {

        productosElemento.textContent =
            cantidadProductos;

    }


    const pedidosElemento =
        document.getElementById(
            "cantidad-pedidos"
        );


    if (
        pedidosElemento
    ) {

        pedidosElemento.textContent =
            cantidadPedidos;

    }


    const ventasElemento =
        document.getElementById(
            "dinero-vendido"
        );


    if (
        ventasElemento
    ) {

        ventasElemento.textContent =
            "$" +
            formatearPrecioAdmin(
                dineroVendido
            );

    }

}


// ======================================================
// MODO CLARO / OSCURO
// ======================================================

function cambiarTema() {

    document.body.classList.toggle(
        "modo-claro"
    );


    const claro =
        document.body.classList.contains(
            "modo-claro"
        );


    localStorage.setItem(
        "temaUrban",
        claro
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


    if (!boton) {
        return;
    }


    if (
        document.body.classList.contains(
            "modo-claro"
        )
    ) {

        boton.textContent =
            "☀️";

    } else {

        boton.textContent =
            "🌙";

    }

}


// ======================================================
// CERRAR SESIÓN
// ======================================================

function cerrarSesionAdmin() {

    const confirmar =
        confirm(
            "¿Querés cerrar la sesión de administrador?"
        );


    if (!confirmar) {
        return;
    }


    sessionStorage.removeItem(
        "adminLogueado"
    );


    window.location.href =
        "login-admin.html";

}


// ======================================================
// INICIAR ADMIN
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        cargarProductosAdmin();

        mostrarProductosAdmin();

        mostrarPedidosAdmin();

        cargarProductosOferta();

        actualizarEstadisticas();

        cargarTema();

    }
);