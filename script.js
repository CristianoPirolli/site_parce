/**
 * CRISTIANO PIROLLI - LANDING PAGE
 * Script.js - Interatividade, Carrossel e Validações
 */

// ============================================
// MOBILE MENU
// ============================================

const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navbarLinks = document.getElementById('navbarLinks');

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', () => {
    const isOpen = navbarLinks.classList.toggle('active');
    mobileMenuBtn.setAttribute('aria-expanded', isOpen);
  });

  // Fechar menu ao clicar em um link
  navbarLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navbarLinks.classList.remove('active');
      mobileMenuBtn.setAttribute('aria-expanded', false);
    });
  });
}

// ============================================
// CARROSSEL DE PORTFÓLIO
// ============================================

class Carousel {
  constructor(carouselId) {
    this.carouselId = carouselId;
    this.slides = document.querySelectorAll(`.carousel-container:has([data-carousel="${carouselId}"]) .carousel-slide`);
    this.dots = document.querySelectorAll(`.carousel-dot[data-carousel="${carouselId}"]`);
    this.currentSlide = 0;
    this.autoplayInterval = null;

    if (this.slides.length === 0) return;

    this.init();
  }

  init() {
    // Event listeners para setas
    const prevBtn = document.querySelector(`.carousel-arrow.prev[data-carousel="${this.carouselId}"]`);
    const nextBtn = document.querySelector(`.carousel-arrow.next[data-carousel="${this.carouselId}"]`);

    if (prevBtn) prevBtn.addEventListener('click', () => this.prev());
    if (nextBtn) nextBtn.addEventListener('click', () => this.next());

    // Event listeners para dots
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index));
    });

    // Autoplay
    this.startAutoplay();

    // Pausar autoplay ao interagir
    document.querySelector(`.carousel-container:has([data-carousel="${this.carouselId}"])`)?.addEventListener('mouseenter', () => this.stopAutoplay());
    document.querySelector(`.carousel-container:has([data-carousel="${this.carouselId}"])`)?.addEventListener('mouseleave', () => this.startAutoplay());
  }

  showSlide(index) {
    // Validar índice
    if (index < 0) {
      this.currentSlide = this.slides.length - 1;
    } else if (index >= this.slides.length) {
      this.currentSlide = 0;
    } else {
      this.currentSlide = index;
    }

    // Remover classe active de todos os slides
    this.slides.forEach(slide => slide.classList.remove('active'));
    this.dots.forEach(dot => dot.classList.remove('active'));

    // Adicionar classe active ao slide atual
    this.slides[this.currentSlide].classList.add('active');
    this.dots[this.currentSlide].classList.add('active');
  }

  next() {
    this.showSlide(this.currentSlide + 1);
  }

  prev() {
    this.showSlide(this.currentSlide - 1);
  }

  goToSlide(index) {
    this.showSlide(index);
  }

  startAutoplay() {
    this.autoplayInterval = setInterval(() => {
      this.next();
    }, 5000); // 5 segundos
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }
  }
}

class PortfolioRotator {
  constructor() {
    this.container = document.getElementById('portfolioRotator');
    this.grid = document.getElementById('portfolioGrid');
    this.cards = this.grid ? Array.from(this.grid.querySelectorAll('.portfolio-card')) : [];
    this.dots = Array.from(document.querySelectorAll('.portfolio-rotator-dot'));
    this.currentIndex = 0;
    this.visibleCount = window.matchMedia('(max-width: 768px)').matches ? 1 : 2;
    this.autoplayInterval = null;

    if (!this.container || this.cards.length < 3) return;

    this.init();
  }

  init() {
    const prevBtn = this.container.querySelector('[data-portfolio-nav="prev"]');
    const nextBtn = this.container.querySelector('[data-portfolio-nav="next"]');

    if (prevBtn) prevBtn.addEventListener('click', () => this.prev());
    if (nextBtn) nextBtn.addEventListener('click', () => this.next());

    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goTo(index));
    });

    this.container.addEventListener('mouseenter', () => this.stopAutoplay());
    this.container.addEventListener('mouseleave', () => this.startAutoplay());

    window.addEventListener('resize', () => {
      const nextVisibleCount = window.matchMedia('(max-width: 768px)').matches ? 1 : 2;
      if (nextVisibleCount !== this.visibleCount) {
        this.visibleCount = nextVisibleCount;
        this.show(false);
      }
    });

    this.show(false);
    this.startAutoplay();
  }

  updateCardVisibility(card, shouldShow, animate = true) {
    if (shouldShow) {
      const wasHidden = card.classList.contains('portfolio-card-hidden');
      card.classList.remove('portfolio-card-hidden');

      if (animate && wasHidden) {
        card.classList.add('is-fading-in');
        requestAnimationFrame(() => {
          requestAnimationFrame(() => card.classList.remove('is-fading-in'));
        });
      } else {
        card.classList.remove('is-fading-in');
      }

      return;
    }

    if (card.classList.contains('portfolio-card-hidden')) return;

    card.classList.remove('is-fading-in');
    card.classList.add('portfolio-card-hidden');
  }

  show(animate = true) {
    const visibleIndexes = [];

    for (let i = 0; i < this.visibleCount; i++) {
      visibleIndexes.push((this.currentIndex + i) % this.cards.length);
    }

    this.cards.forEach((card, index) => {
      this.updateCardVisibility(card, visibleIndexes.includes(index), animate);
    });

    this.dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentIndex);
    });
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.cards.length;
    this.show(true);
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.cards.length) % this.cards.length;
    this.show(true);
  }

  goTo(index) {
    this.currentIndex = index;
    this.show(true);
  }

  startAutoplay() {
    this.stopAutoplay();
    this.autoplayInterval = setInterval(() => this.next(), 6000);
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }
}

// Inicializar carrosséis
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.service-features li').forEach((item) => {
    if (!item.querySelector('[data-lucide]')) {
      item.insertAdjacentHTML('afterbegin', '<i data-lucide="check" aria-hidden="true"></i>');
    }
  });

  if (window.lucide) {
    window.lucide.createIcons();
  }

  new Carousel('carousel-1');
  new Carousel('carousel-2');
  new Carousel('carousel-3');
  new Carousel('carousel-4');
  new PortfolioRotator();
});

// ============================================
// VALIDAÇÃO E ENVIO DE NEWSLETTER
// ============================================

const newsletterForm = document.getElementById('newsletterForm');

if (newsletterForm) {
  newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('newsletterName').value.trim();
    const email = document.getElementById('newsletterEmail').value.trim();
    const whatsapp = document.getElementById('newsletterWhatsapp')?.value.trim() || '';
    const service = document.getElementById('newsletterService')?.value;
    const messageDiv = document.getElementById('newsletterMessage');
    const submitButton = newsletterForm.querySelector('button[type="submit"]');

    // Validações
    if (!name || name.length < 3) {
      showMessage(messageDiv, 'Por favor, insira um nome válido.', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showMessage(messageDiv, 'Por favor, insira um email válido.', 'error');
      return;
    }

    if (!isValidPhone(whatsapp)) {
      showMessage(messageDiv, 'Por favor, insira um WhatsApp válido com DDD.', 'error');
      return;
    }

    if (!service) {
      showMessage(messageDiv, 'Por favor, selecione o serviço de interesse.', 'error');
      return;
    }

    const endpoint = newsletterForm.getAttribute('action') || '';
    if (!endpoint || endpoint.includes('SEU_FORM_ID')) {
      showMessage(messageDiv, 'Configure seu endpoint do Formspree no atributo action do formulário.', 'error');
      return;
    }

    if (submitButton) submitButton.disabled = true;
    showMessage(messageDiv, 'Enviando seu interesse...', 'info');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(newsletterForm),
        headers: {
          Accept: 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Falha no envio');
      }

      showMessage(messageDiv, 'Interesse enviado com sucesso! Entraremos em contato.', 'success');
      newsletterForm.reset();
    } catch (error) {
      showMessage(messageDiv, 'Nao foi possivel enviar agora. Tente novamente em instantes.', 'error');
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}

// ============================================
// VALIDAÇÃO E ENVIO DO FORMULÁRIO DE CONTATO
// ============================================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const phone = document.getElementById('contactPhone').value.trim();
    const service = document.getElementById('contactService').value;
    const message = document.getElementById('contactMessage').value.trim();
    const messageDiv = document.getElementById('contactFormMessage');

    // Validações
    if (!name || name.length < 3) {
      showMessage(messageDiv, 'Por favor, insira um nome válido.', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showMessage(messageDiv, 'Por favor, insira um email válido.', 'error');
      return;
    }

    if (!isValidPhone(phone)) {
      showMessage(messageDiv, 'Por favor, insira um telefone válido.', 'error');
      return;
    }

    if (!service) {
      showMessage(messageDiv, 'Por favor, selecione um tipo de serviço.', 'error');
      return;
    }

    if (!message || message.length < 10) {
      showMessage(messageDiv, 'Por favor, insira uma mensagem com pelo menos 10 caracteres.', 'error');
      return;
    }

    // Simular envio (sem backend)
    showMessage(messageDiv, 'Enviando solicitacao...', 'info');

    setTimeout(() => {
      // Simular sucesso
      showMessage(messageDiv, 'Solicitacao enviada com sucesso! Entraremos em contato em breve.', 'success');

      // Limpar formulário
      contactForm.reset();

      // Fechar modal após 2 segundos
      setTimeout(() => {
        closeContactModal();
        messageDiv.textContent = '';
        messageDiv.classList.remove('success', 'error', 'info');
      }, 2000);
    }, 1500);
  });
}

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

/**
 * Validar email
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validar telefone
 */
function isValidPhone(phone) {
  // Remove caracteres não numéricos
  const phoneNumbers = phone.replace(/\D/g, '');
  // Verifica se tem entre 10 e 11 dígitos
  return phoneNumbers.length >= 10 && phoneNumbers.length <= 11;
}

/**
 * Exibir mensagem de validação
 */
function showMessage(element, text, type) {
  if (!element) return;

  element.textContent = text;
  element.classList.remove('success', 'error', 'info');
  element.classList.add(type);
  element.style.display = 'block';
}

// ============================================
// FECHAR MODAL AO CLICAR FORA
// ============================================

const contactModal = document.getElementById('contactModal');

function openContactModal() {
  if (!contactModal) return;
  contactModal.style.display = 'flex';
  contactModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeContactModal() {
  if (!contactModal) return;
  contactModal.style.display = 'none';
  contactModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// Necessário para os handlers inline do HTML
window.openContactModal = openContactModal;
window.closeContactModal = closeContactModal;

if (contactModal) {
  contactModal.addEventListener('click', (e) => {
    if (e.target === contactModal) {
      closeContactModal();
    }
  });

  // Fechar modal com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && contactModal.style.display === 'flex') {
      closeContactModal();
    }
  });
}

// ============================================
// SMOOTH SCROLL PARA ÂNCORAS
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');

    // Verificar se é uma âncora válida
    if (href !== '#' && document.querySelector(href)) {
      e.preventDefault();

      const target = document.querySelector(href);
      const offsetTop = target.offsetTop - 80; // Compensar altura da navbar

      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  });
});

// ============================================
// ANIMAÇÃO DE ENTRADA PARA ELEMENTOS
// ============================================

const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.appendChild(progressBar);

let scrollRaf = null;
const updateScrollProgress = () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0;
  document.documentElement.style.setProperty('--scroll-progress', progress.toString());
  scrollRaf = null;
};

window.addEventListener('scroll', () => {
  if (!scrollRaf) {
    scrollRaf = requestAnimationFrame(updateScrollProgress);
  }
}, { passive: true });
updateScrollProgress();

document.querySelectorAll('section:not(.portfolio)').forEach(section => {
  section.classList.add('fx-section');
});

const revealTargets = [
  '.hero-text > *',
  '.hero-proof-item',
  '.hero-ctas .btn',
  '.services-header > *',
  '.service-card',
  '.process-header > *',
  '.process-step',
  '.benefits-header > *',
  '.benefit-item',
  '.newsletter-content > *',
  '.contact-content > *',
  '.contact-buttons .contact-btn',
  '.authority-item'
];

document.querySelectorAll(revealTargets.join(', ')).forEach((el, index) => {
  if (el.closest('.portfolio-card')) return;
  el.classList.add('fx-reveal');
  el.style.setProperty('--fx-delay', `${(index % 6) * 70}ms`);
});

const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('revealed');
    obs.unobserve(entry.target);
  });
}, {
  threshold: 0.16,
  rootMargin: '0px 0px -60px 0px'
});

document.querySelectorAll('.fx-reveal').forEach(el => revealObserver.observe(el));

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('section-in-view');
    }
  });
}, {
  threshold: 0.2
});

document.querySelectorAll('section.fx-section').forEach(section => {
  sectionObserver.observe(section);
});

// ============================================
// NAVBAR STICKY COM SHADOW
// ============================================

const navbar = document.querySelector('.navbar');

if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.boxShadow = '0 10px 15px rgba(0, 0, 0, 0.2)';
    } else {
      navbar.style.boxShadow = 'var(--shadow-md)';
    }
  });
}

// ============================================
// CONTADOR ANIMADO (NÚMEROS DE AUTORIDADE)
// ============================================

let hasAnimated = false;

const authoritySection = document.querySelector('.authority');

if (authoritySection) {
  const authorityObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        animateCounters();
      }
    });
  }, { threshold: 0.5 });

  authorityObserver.observe(authoritySection);
}

function animateCounters() {
  const counters = document.querySelectorAll('.authority-number');

  counters.forEach(counter => {
    const target = parseInt(counter.textContent);
    let current = 0;
    const increment = target / 50; // 50 frames de animação
    const duration = 2000; // 2 segundos
    const frameTime = duration / 50;

    const interval = setInterval(() => {
      current += increment;

      if (current >= target) {
        counter.textContent = target + '+';
        clearInterval(interval);
      } else {
        counter.textContent = Math.floor(current) + '+';
      }
    }, frameTime);
  });
}

// ============================================
// ANALYTICS E TRACKING (SIMULADO)
// ============================================

/**
 * Rastrear cliques em CTAs
 */
function trackCTAClick(ctaName) {
  console.log(`CTA clicado: ${ctaName}`);
  // Aqui você poderia enviar dados para Google Analytics ou outro serviço
}

// Rastrear cliques nos botões principais
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
  btn.addEventListener('click', () => {
    const text = btn.textContent.trim();
    trackCTAClick(text);
  });
});

// ============================================
// PREFETCH DE RECURSOS
// ============================================

// Prefetch de imagens e recursos para melhor performance
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => {
    // Prefetch de fontes e recursos críticos
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = 'https://fonts.googleapis.com/css2?family=Segoe+UI:wght@400;500;600;700&display=swap';
    document.head.appendChild(link);
  });
}

// ============================================
// INICIALIZAÇÃO
// ============================================

console.log('Landing Page Cristiano Pirolli - Script carregado com sucesso');
