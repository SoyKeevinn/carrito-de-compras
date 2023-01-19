const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('templagte-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {}

//================Eventos=====================
//
document.addEventListener('DOMContentLoaded', () =>{
    // DOMContentLoaded nos sirve para que cargue primero el
    // html y luego ejecute la funcion
    fetchData()
    //======= almacenar o respaldar el contenido ========
    //preguntamos si existe algo
    if(localStorage.getItem('llave')){
        //lo guardamos con una key 
        carrito = JSON.parse(localStorage.getItem('llave'))
        // luego lo pintamos
        pintarCarrito()
    }
})
cards.addEventListener('click', e =>{
    aggCarrito(e)
})
items.addEventListener('click', e =>{
    btnAccion(e)
})

//================Consumiendo una api local=====================
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
        //console.log(productos);
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
    cards.appendChild(fragment)
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

    pintarCarrito()
}

//========= tabla de compra =================

const pintarCarrito = () =>{
    items.innerHTML = ''
    Object.values(carrito).forEach(product  =>{
        templateCarrito.querySelectorAll('td')[0].textContent = product.id
        templateCarrito.querySelectorAll('td')[1].textContent = product.title
        templateCarrito.querySelectorAll('td')[2].textContent = product.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = product.id
        templateCarrito.querySelector('.btn-danger').dataset.id = product.id
        templateCarrito.querySelector('span').textContent = product.cantidad * product.precio

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
    
    pintarFooter()
// extrar datos del localStorage
    localStorage.setItem('llave', JSON.stringify(carrito))
}

// pintar footer o sea el total 

const pintarFooter =  () => {
    footer.innerHTML = ''
    if(Object.keys(carrito).length === 0){
        footer.innerHTML = `
        <th scope="row" colspan="5" > Carrito Vacio</th>
        `
        return
    }

    const nCantidad = Object.values(carrito).reduce((aux, {cantidad}) => aux + cantidad,0)
    const nPrecio = Object.values(carrito).reduce((aux, {cantidad,precio}) => aux + cantidad * precio ,0)
    

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () =>{
        carrito = {}
        pintarCarrito()
    })
}

// ============ botones de aumentar y disminuir ===========
const btnAccion = e =>{
    //accion de aumentar
    if(e.target.classList.contains('btn-info')){
        // console.log(carrito[e.target.dataset.id]);
        const total = carrito[e.target.dataset.id]
        total.cantidad ++
        carrito[e.target.dataset.id] = {...total}
        pintarCarrito()
    }

    if(e.target.classList.contains('btn-danger')){
        const total = carrito[e.target.dataset.id]
        total.cantidad --
        if(total.cantidad === 0){
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito()
    }

    e.stopPropagation()
}