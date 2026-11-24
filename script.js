
// CONEXIÓN CON CONTENTFUL - PAGA YA

const SPACE_ID = "5rq5hwssem5k";
const ACCESS_TOKEN = "eh8ZZbMoTPJBvlZRLXo8aN9gvUZ6xy7nx4XVVtp4GlQ";
const CONTENT_TYPE_ID = "nombre";

const API_URL = `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/master/entries?content_type=${CONTENT_TYPE_ID}&include=2`;

// Obtener una imagen desde Contentful
function obtenerImagen(assetId, assets) {
    const asset = assets.find(item => item.sys.id === assetId);

    if (!asset) return "";

    return "https:" + asset.fields.file.url;
}

// Cargar información de Contentful
async function cargarContenido() {
    try {
        const respuesta = await fetch(
            `${API_URL}&access_token=${ACCESS_TOKEN}`
        );

        if (!respuesta.ok) {
            throw new Error("Error al obtener los datos de Contentful");
        }

        const datos = await respuesta.json();

        if (datos.items.length === 0) {
            throw new Error("No se encontró la entrada publicada");
        }

        const app = datos.items[0].fields;
        const assets = datos.includes?.Asset || [];

        // DESCRIPCIÓN
        document.getElementById("descripcion").textContent =
            app.descripcion || "";

        // PROBLEMA
        document.getElementById("problemaTexto").textContent =
            app.problema || "";

        // IMAGEN PRINCIPAL
        const imagenPrincipal = document.querySelector(
            ".imagen-principal img"
        );

        if (app.imagenPrincipal) {
            const url = obtenerImagen(
                app.imagenPrincipal.sys.id,
                assets
            );

            if (url) {
                imagenPrincipal.src = url;
            }
        }

        // MOSTRAR FUNCIONALIDADES
        mostrarFunciones(app);

        // MOSTRAR GALERÍA
        mostrarGaleria(app, assets);

        // MOSTRAR GUÍAS
        mostrarGuias(app);

        console.log("¡Paga YA está conectado con Contentful!", app);

    } catch (error) {
        console.error("Error de conexión:", error);
    }
}


// FUNCIONALIDADES

function mostrarFunciones(app) {
    const contenedor = document.getElementById("listaFunciones");

    if (!contenedor) return;

    contenedor.innerHTML = "";

    const lista = (app.funcionalidades || "")
        .split("\n")
        .filter(texto => texto.trim() !== "");

    lista.forEach((texto) => {
        const [nombre, descripcion] = texto.split("|");

        contenedor.innerHTML += `
            <div class="tarjeta">
                <h3>${nombre || "Funcionalidad"}</h3>
                <p>${descripcion || ""}</p>
            </div>
        `;
    });
}



// GALERÍA
function mostrarGaleria(app, assets) {
    const contenedor = document.getElementById("galeriaImagenes");

    if (!contenedor) return;

    contenedor.innerHTML = "";

    const imagenes = app.galeria || [];

    imagenes.forEach((imagen, index) => {
        const url = obtenerImagen(imagen.sys.id, assets);

        if (url) {
            contenedor.innerHTML += `
                <div class="galeria-item">
                    <img src="${url}" alt="Imagen de Paga YA ${index + 1}">
                </div>
            `;
        }
    });
}


// GUÍAS

function crearListaGuia(texto) {
    const lineas = (texto || "")
        .split("\n")
        .map(linea => linea.trim())
        .filter(linea => linea !== "");

    const lista = document.createElement("ol");

    for (let i = 0; i < lineas.length; i += 2) {
        const elemento = document.createElement("li");

        const titulo = document.createElement("strong");
        titulo.textContent = lineas[i];

        const descripcion = document.createElement("p");
        descripcion.textContent = lineas[i + 1] || "";

        elemento.appendChild(titulo);
        elemento.appendChild(descripcion);
        lista.appendChild(elemento);
    }

    return lista;
}

function mostrarGuias(app) {
    const contenedor = document.getElementById("guiaContenido");

    if (!contenedor) return;

    contenedor.innerHTML = "";

    const pasajeros = document.createElement("div");
    pasajeros.className = "guia-item";

    const tituloPasajeros = document.createElement("h3");
    tituloPasajeros.textContent = "Para pasajeros";

    pasajeros.appendChild(tituloPasajeros);
    pasajeros.appendChild(crearListaGuia(app.guiaPasajeros));

    const conductores = document.createElement("div");
    conductores.className = "guia-item";

    const tituloConductores = document.createElement("h3");
    tituloConductores.textContent = "Para conductores";

    conductores.appendChild(tituloConductores);
    conductores.appendChild(crearListaGuia(app.guiaConductores));

    contenedor.appendChild(pasajeros);
    contenedor.appendChild(conductores);
}



// INICIAR
document.addEventListener("DOMContentLoaded", cargarContenido);