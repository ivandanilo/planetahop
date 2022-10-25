

let seach = document.querySelector('.seachInput')
let filterPorPreco = document.querySelector('.filterMenorMaiorPreco')

let cardShop = document.getElementById('shop')

let listaDeProduto = []

async function produtoList() {
  const endpoint = await fetch(`https://fakestoreapi.com/products`)
  const data = await endpoint.json()

 

  generateShop(data)
  listaDeProduto = data
 
}

produtoList()


let basket = JSON.parse(localStorage.getItem('data')) || []

let generateShop = data => {
  return (cardShop.innerHTML = data
    .map(x => {
      let { id, image, title, category, price } = x
      let search = basket.find(x => x.id === id) || []
      return `
    <div id=producId-${id} class="card">
      <img width="100" src=${image} alt="">
      <h3>${title}</h3>
      <p>
        Categoria: ${category}
      </p>
      <p>
        R$ ${price}
      </p>

          <div class="buttonQuant">
              <a onclick="decrement(${id})" class="dash">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-lg" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8Z"/>
              </svg>
            </a>

            <div id=${id} class="quantity">
            ${search.item === undefined ? 0 : search.item}
            </div>
            
              <a onclick="increment(${id})" class="plus">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
                </svg>
              </a>
            </div>
          </div>
    `
    })
    .join(''))
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
  document.getElementById(id).innerHTML = search.item

  calcQtdCarrinho()
}

let calcQtdCarrinho = () => {
  let cartIcon = document.getElementById('qtdCar')

  cartIcon.innerHTML = basket.map(x => x.item).reduce((x, y) => x + y, 0)
}

calcQtdCarrinho()

let filtroMaiorMenor = () => {
  let optionValue = filterPorPreco.options[filterPorPreco.selectedIndex]
  let value = optionValue.value

  if (value === 'menor') {
    listaDeProduto.sort((a, b) => {
      return a.price - b.price
    })

    generateShop(listaDeProduto)
  } else if (value === 'maior') {
    listaDeProduto.sort((a, b) => {
      return b.price - a.price
    })
    generateShop(listaDeProduto)
  } else {
    produtoList(listaDeProduto)
  }
}

seach.addEventListener('input', x => {
  console.log(x.target.value.toUpperCase().trim())
  let search = listaDeProduto.filter(y => {
    return y.title.toUpperCase().includes(x.target.value.toUpperCase().trim())
  })

  generateShop(search)
})

window.addEventListener('scroll', onScroll)
onScroll()
function onScroll() {
  showNavOnScroll()
  showBackToTopButtonOnScroll()
  showBackToTopButtonOnScroll2()
}

function activateMenuAtCurrentSection(section) {
  // linha alvo
  const targetLine = scrollY + innerHeight / 2 // const (variavel q não muda o valor)

  // varificar se a seção passou da linha
  // quais dados vou precisar ?

  // top da seção
  const sectionTop = section.offsetTop
  // a altura da seção
  const sectionHeight = section.offsetHeight

  // o topo da seção chegou ou ultrapassou a linha alvo
  const sectionTopReachOrPassedTargetline = targetLine >= sectionTop

  // informações dos dados e da lógica
  //console.log('O topo da seção chegou ou passou da linha?', sectionTopReachOrPassedTargetline)

  // verificar se a base está abaixo da linha alvo
  // quais dados vou precisar?

  // a seção termina onde?
  const sectionEndAt = sectionTop + sectionHeight

  //o final da seção pasou da linha alvo?
  const sectionEndPassedTargetline = sectionEndAt <= targetLine

  // console.log('O fundo da seção passou da linha?', sectionEndPassedTargetline)

  // limites da seção
  const sectionBoundaries =
    sectionTopReachOrPassedTargetline && !sectionEndPassedTargetline

  const sectionId = section.getAttribute('id')
  const menuElement = document.querySelector(`.menu a[href*=${sectionId}]`)

  menuElement.classList.remove('active')
  if (sectionBoundaries) {
    menuElement.classList.add('active')
  }
}

function showNavOnScroll() {
  if (scrollY > 0) {
    navigation.classList.add('scroll')
  } else {
    navigation.classList.remove('scroll')
  }
}

function showBackToTopButtonOnScroll() {
  if (scrollY > 450) {
    backToTopButton.classList.add('show')
  } else {
    backToTopButton.classList.remove('show')
  }
}

function showBackToTopButtonOnScroll2() {
  //Linha Alvo
  const targetline = scrollY + innerHeight

  // top da seção
  const sectionTop = rodape.offsetTop

  //linha passou do topo
  const linepassedtop = targetline >= sectionTop

  /*  console.log(targetline)

  console.log('Altura do Top ',sectionTop)

  console.log(linepassedtop) */

  if (linepassedtop) {
    // pegando tudo dentro do botão "backToTopButton"
    const subirHome = document.querySelector('#backToTopButton')

    //criar nova div
    const botaoSubirHome = document.createElement('div')
    botaoSubirHome.setAttribute('id', 'botaoSubirInicio', 'class', 'botaoUp')

    // copiar as coisas do botão "backToTopButton" para nova div

    for (const child of subirHome.childNodes) {
      botaoSubirHome.appendChild(child.cloneNode(true))
    }

    botaoSubirInicio.classList.add('show2')

    //console.log(botaoSubirInicio)
  } else {
    botaoSubirInicio.classList.remove('show2')
  }
}

function seachHide() {
  seach.classList.toggle('hide')
}

ScrollReveal({
  origin: 'top',
  distance: '30px',
  duration: 700
}).reveal(`#home, 
#home img,
#home .stats, 
#product,
#product header, 
#product .card,
#about,
#about header,
#about .content`)
