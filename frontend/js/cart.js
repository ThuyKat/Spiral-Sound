import { logout } from './logout.js'
import { checkAuth, renderGreeting, showHideMenuItems } from './authUI.js'
import { loadCart, removeItem } from './cartService.js'

const dom = {
  checkoutBtn: document.getElementById('checkout-btn'),
  userMessage: document.getElementById('user-message'),
  cartList: document.getElementById('cart-list'),
  cartTotal: document.getElementById('cart-total')
}

document.getElementById('logout-btn').addEventListener('click', logout)

dom.cartList.addEventListener('click', event => {
  if (event.target.matches('.remove-btn')) {
    removeItem(event.target.dataset.id, dom)
  }
})

dom.checkoutBtn.addEventListener('click', async () => {
  dom.checkoutBtn.disabled = true
  dom.userMessage.textContent = 'Redirecting to payment...'

  try {
    const res = await fetch('/api/checkout/create-checkout-session', {
      method: 'POST',
      credentials: 'include'
    })

    const data = await res.json()

    if (!res.ok) {
      dom.userMessage.textContent = data.error || 'Something went wrong.'
      dom.checkoutBtn.disabled = false
      return
    }

    // Redirect to Stripe's hosted checkout page
    window.location.href = data.url

  } catch (err) {
    console.error('Checkout error:', err)
    dom.userMessage.textContent = 'Could not connect to payment service.'
    dom.checkoutBtn.disabled = false
  }
})

async function init() {
  loadCart(dom)
  const name = await checkAuth()
  renderGreeting(name)
  showHideMenuItems(name)
}

init()
