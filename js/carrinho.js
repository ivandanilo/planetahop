let label = document.getElementById('label')
let shoppingCar = document.getElementById('shopping-car')

let basket = JSON.parse(localStorage.getItem('data')) || []

let calcQtdCarrinho = () => {
  let cartIcon = document.getElementById('qtdCar')

  cartIcon.innerHTML = basket.map(x => x.item).reduce((x, y) => x + y, 0)
}

calcQtdCarrinho()

async function produtoList() {
  const endpoint = await fetch(`https://fakestoreapi.com/products`)
  const data = await endpoint.json()

  generateCartItems(data)
  totalValor(data)
}

produtoList()

let generateCartItems = data => {
  if (basket.length !== 0) {
    return (shoppingCar.innerHTML = basket
      .map(x => {
        let { id, item } = x
        let search = data.find(y => y.id === id) || []
        let { image, title, price } = search
        return `
         <div class="car-item">
         <img width="100" src=${image} alt="" />
         <div class="details">
 
           <div class="title-price-x">
               <h4 class="title-price">
                 <p>${title}</p>
                 <p class="car-item-price">
                 R$ ${price}
                 </p>
               </h4>
               <i onclick="removeItem(${id})" class="bi bi-x-lg"></i>
           </div>
 
           <div class="buttonQuant">
           <a onclick="decrement(${id})" class="dash">
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-lg" viewBox="0 0 16 16">
           <path fill-rule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8Z"/>
         </svg>
       </a>

               <div id=${id} class="quantity">${item}</div>

               <a onclick="increment(${id})" class="plus">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
                </svg>
              </a>
           </div>
 
           <h3>Total R$ ${item * price}</h3>
         </div>
       </div>
      `
      })
      .join(''))
  } else {
    shoppingCar.innerHTML = ``
    label.innerHTML = `
    <h2>Carrinho Vazio</h2>
    <a href="../index.html">
      <button class="HomeBtn">Volte as Compras</button>
    </a>
    `
  }
}

let increment = id => {
  let selectedItem = id

  let search = basket.find(x => x.id === selectedItem)

  if (search === undefined) {
    basket.push({
      id: selectedItem,
      item: 1
    })
  } else {
    search.item += 1
  }

  upDate(selectedItem)

  localStorage.setItem('data', JSON.stringify(basket))
}

let decrement = id => {
  let selectedItem = id
  let search = basket.find(x => x.id === selectedItem)

  if (search === undefined) return
  else if (search.item === 0) {
    return
  } else {
    search.item -= 1
  }

  upDate(selectedItem)
  basket = basket.filter(x => x.item !== 0)
  localStorage.setItem('data', JSON.stringify(basket))
}

let upDate = id => {
  let search = basket.find(x => x.id === id)
  console.log(search.item)
  document.getElementById(id).innerHTML = search.item

  produtoList()
  calcQtdCarrinho()
}

let removeItem = id => {
  let selectedItem = id
  console.log(selectedItem)
  basket = basket.filter(x => x.id !== selectedItem)

  produtoList()
  calcQtdCarrinho()
  localStorage.setItem('data', JSON.stringify(basket))
}

let clearCar = () => {
  basket = []
  generateCartItems()
  calcQtdCarrinho()
  localStorage.setItem('data', JSON.stringify(basket))
}

let totalValor = data => {
  if (basket.length !== 0) {
    let valorTotal = basket
      .map(x => {
        let { item, id } = x
        let search = data.find(y => y.id === id) || []

        return item * search.price
      })
      .reduce((x, y) => x + y, 0)
    label.innerHTML = `
    <h2>Valor Total: R$ ${valorTotal.toFixed(2)}</h2>
    <button class="pag">Pagamento</button>
    <button onclick="clearCar()" class="removeAll">Limpar Carrinho</button>
    `
  } else return
}
