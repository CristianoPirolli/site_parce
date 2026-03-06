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

// Inicializar carrosséis
document.addEventListener('DOMContentLoaded', () => {
  new Carousel('carousel-1');
  new Carousel('carousel-2');
});

// ============================================
// VALIDAÇÃO E ENVIO DE NEWSLETTER
// ============================================

const newsletterForm = document.getElementById('newsletterForm');

if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('newsletterName').value.trim();
    const email = document.getElementById('newsletterEmail').value.trim();
    const messageDiv = document.getElementById('newsletterMessage');

    // Validações
    if (!name || name.length < 3) {
      showMessage(messageDiv, 'Por favor, insira um nome válido.', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showMessage(messageDiv, 'Por favor, insira um email válido.', 'error');
      return;
    }

    // Simular envio (sem backend)
    showMessage(messageDiv, '⏳ Processando...', 'info');

    setTimeout(() => {
      // Simular sucesso
      showMessage(messageDiv, '✅ Inscrição realizada com sucesso! Verifique seu email.', 'success');

      // Limpar formulário
      newsletterForm.reset();

      // Remover mensagem após 5 segundos
      setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.classList.remove('success', 'error', 'info');
      }, 5000);
    }, 1000);
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
    const messageDiv = document.querySelector('.contact-form .form-message');

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
    showMessage(messageDiv, '⏳ Enviando solicitação...', 'info');

    setTimeout(() => {
      // Simular sucesso
      showMessage(messageDiv, '✅ Solicitação enviada com sucesso! Entraremos em contato em breve.', 'success');

      // Limpar formulário
      contactForm.reset();

      // Fechar modal após 2 segundos
      setTimeout(() => {
        document.getElementById('contactModal').style.display = 'none';
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

if (contactModal) {
  contactModal.addEventListener('click', (e) => {
    if (e.target === contactModal) {
      contactModal.style.display = 'none';
    }
  });

  // Fechar modal com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && contactModal.style.display === 'flex') {
      contactModal.style.display = 'none';
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

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observar elementos com animação
document.querySelectorAll('.service-card, .process-step, .benefit-item, .portfolio-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
  observer.observe(el);
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

console.log('✅ Landing Page Cristiano Pirolli - Script carregado com sucesso');
