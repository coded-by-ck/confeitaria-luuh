// Troque pelo número da confeitaria no formato internacional, sem espaços ou símbolos.
const WHATSAPP_NUMBER = '5567981108467';

const products = [
  { name: 'Chocolate granulado', description: 'Massa pronta', price: 25, category: 'prontas', theme: 'chocolate', icon: '✦' },
  { name: 'Chocolate granulado', description: 'Massa feita com trigo', price: 35, category: 'naturais', theme: 'chocolate', icon: '✦', label: 'Massa natural' },
  { name: 'Cenoura com chocolate', description: 'Massa pronta', price: 25, category: 'prontas', theme: 'carrot', icon: '♡' },
  { name: 'Cenoura com chocolate', description: 'Massa natural / feita com trigo', price: 35, category: 'naturais', theme: 'carrot', icon: '♡', label: 'Massa natural' },
  { name: 'Laranja', description: 'Massa pronta', price: 25, category: 'prontas', theme: 'orange', icon: '✺' },
  { name: 'Laranja', description: 'Massa natural', price: 35, category: 'naturais', theme: 'orange', icon: '✺', label: 'Massa natural' },
  { name: 'Banana', description: 'Massa natural · Recheio natural da fruta', price: 35, category: 'naturais', theme: 'banana', icon: '⌁', label: 'Massa natural' },
  { name: 'Bolo pega marido', description: 'Cremoso, delicado e irresistível', price: 40, category: 'especiais', theme: 'special', icon: '♡', label: 'Especial' },
  { name: 'Bolo formigueiro simples', description: 'Massa fofinha com chocolate', price: 20, category: 'especiais', theme: 'special', icon: '✦', label: 'Especial' }
];

const productGrid = document.querySelector('#products-grid');
const categoryTabs = document.querySelectorAll('.category-tab');

function formatPrice(price) {
  return price.toFixed(2).replace('.', ',');
}

function createWhatsAppUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function productMessage(product) {
  const variation = product.label ? ` - ${product.label}` : '';
  return `Olá! Quero pedir o ${product.name}${variation}, no valor de R$ ${formatPrice(product.price)}.`;
}

function renderProducts(filter = 'todos') {
  const visibleProducts = filter === 'todos' ? products : products.filter((product) => product.category === filter);
  productGrid.innerHTML = visibleProducts.map((product) => `
    <article class="product-card reveal visible">
      <!-- As imagens temáticas podem ser substituídas pelas fotos reais dos produtos. -->
      <div class="product-visual ${product.theme}" role="img" aria-label="Imagem ilustrativa de ${product.name}">
        <span class="product-icon" aria-hidden="true">${product.icon}</span>
      </div>
      <div class="product-content">
        <h3>${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-footer">
          <div class="product-price"><small>R$</small> ${formatPrice(product.price)}</div>
          <button class="order-product" type="button" data-product-index="${products.indexOf(product)}">Pedir este <span aria-hidden="true">↗</span></button>
        </div>
      </div>
    </article>
  `).join('');

  productGrid.querySelectorAll('.order-product').forEach((button) => {
    button.addEventListener('click', () => {
      const product = products[Number(button.dataset.productIndex)];
      window.open(createWhatsAppUrl(productMessage(product)), '_blank', 'noopener,noreferrer');
    });
  });
}

categoryTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    categoryTabs.forEach((item) => {
      item.classList.remove('active');
      item.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    renderProducts(tab.dataset.filter);
  });
});

document.querySelectorAll('[data-whatsapp-general]').forEach((link) => {
  link.href = createWhatsAppUrl('Olá! Quero conhecer o cardápio da Confeitaria da Luuh.');
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
});

const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});
mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
renderProducts();
