const items = document.getElementById('items')
const templateCard = document.getElementById('template-card').content
const fragment = document.createDocumentFragment()
let carrito = {}

//================Consumiendo una api local=====================
//
document.addEventListener('DOMContentLoaded', () =>{
    // DOMContentLoaded nos sirve para que cargue primero el
    // html y luego ejecute la funcion
    fetchData()
})
items.addEventListener('click', e =>{
    aggCarrito(e)
})

const fetchData = async () =>{
//async = funcion asincrona que espera que devuela el resultado
    try {
        //fetch para consimir apis
        const respuesta = await fetch('api.json')
        //El lugar de poner api,json podemos poner el link 
        //para consumir la api
        const datos = await respuesta.json()
        //await = espere la respuesta en caso de un retraso
        //console.log(datos);
        pintarCars(datos)

    } catch (error){
        console.log(error);
    }
}

//==========================================================
const pintarCars = datos => {
    datos.forEach(productos => {
        console.log(productos);
        templateCard.querySelector('h5').textContent = productos.title
        //modifica el titulo
        templateCard.querySelector('p').textContent = productos.precio
        //modifica el precio
        templateCard.querySelector('img').setAttribute("src",productos.thumbnailUrl)
        //pone las imagenes
        templateCard.querySelector('.btn-dark').dataset.id = productos.id

        const clon = templateCard.cloneNode(true)
        fragment.appendChild(clon)
    })
    items.appendChild(fragment)
}


const aggCarrito = e =>{
    
    if(e.target.classList.contains('btn-dark')){
        
        // console.log(e.target.parentElement);
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCarrito = objeto =>{
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    }

    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    carrito[producto.id] = {...producto}
    // este operador nos permite copiar de manera simple una parte 
    // o la totalidad de un elemento array o un objeto

    console.log(producto);
}