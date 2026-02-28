// ==================== DOM Elements ====================
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links');
const newsletterForm = document.getElementById('newsletterForm');
const nameInput = document.getElementById('nameInput');
const emailInput = document.getElementById('emailInput');
const formMessage = document.getElementById('formMessage');

// ==================== Mobile Menu Toggle ====================
menuToggle?.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    menuToggle.textContent = navLinks.classList.contains('open') ? '✕' : '≡';
});

// Fechar menu ao clicar em um link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.textContent = '≡';
    });
});

// ==================== Smooth Scroll Function ====================
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// ==================== Newsletter Form Handler ====================
function handleNewsletter(event) {
    event.preventDefault();
    
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    
    // Reset message
    formMessage.style.display = 'none';
    formMessage.textContent = '';
    
    // Validar formulário
    if (!name || !email) {
        showMessage('Por favor, preencha todos os campos.', 'error');
        return;
    }
    
    // Validar email
    if (!isValidEmail(email)) {
        showMessage('Por favor, insira um email válido.', 'error');
        return;
    }
    
    // Desabilitar botão durante envio
    const submitButton = newsletterForm.querySelector('.btn-subscribe');
    submitButton.disabled = true;
    submitButton.textContent = 'Inscrevendo...';
    
    // Dados do formulário
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    
    // Enviar para Formspree
    const formspreeUrl = 'https://formspree.io/f/mbdabqdn';
    
    // Enviar para Formspree
    fetch(formspreeUrl, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            showMessage(`✓ Obrigado, ${name}! Já recebemos sua inscrição. Você receberá novidades no seu email!`, 'success');
            newsletterForm.reset();
            
            // Rastrear evento
            trackEvent('newsletter_signup', {
                email: email,
                name: name
            });
        } else {
            showMessage('Erro ao inscrever. Tente novamente.', 'error');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        showMessage('Erro de conexão. Tente novamente.', 'error');
    })
    .finally(() => {
        submitButton.disabled = false;
        submitButton.textContent = 'Quero receber as dicas';
    });
}

// ==================== Utilities ====================
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
    
    // Auto-hide após 5 segundos se ffor sucesso
    if (type === 'success') {
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
}

// ==================== Scroll Animations ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.animation = 'slideInUp 0.6s ease-out';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observar elementos com data-aos
document.querySelectorAll('[data-aos]').forEach(element => {
    element.style.opacity = '0';
    observer.observe(element);
});

// ==================== Navbar Scroll Effect ====================
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Adicionar sombra ao navbar quando scrollar
    if (scrollTop > 10) {
        navbar.style.boxShadow = '0 5px 20px rgba(102, 126, 234, 0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    
    lastScrollTop = scrollTop;
});

// ==================== Analytics Helper ====================
function trackEvent(eventName, eventData) {
    // Aqui você implementaria rastreamento com Google Analytics ou similar
    // Exemplo:
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', eventName, eventData);
    // }
    console.log(`Event tracked: ${eventName}`, eventData);
}


// ==================== Page Load Animation ====================
document.addEventListener('DOMContentLoaded', () => {
    // Animação ao carregar a página
    console.log('✓ Landing page carregada com sucesso!');
});

// ==================== Service Cards Hover Effect ====================
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// ==================== Portfolio Cards Click Handler ====================
document.querySelectorAll('.portfolio-card').forEach(card => {
    card.addEventListener('click', function() {
        trackEvent('portfolio_click', {
            project: this.querySelector('h3').textContent
        });
    });
});

// ==================== Preload Images ====================
function preloadImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        const newImg = new Image();
        newImg.src = img.src;
    });
}

// Chamar preload quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preloadImages);
} else {
    preloadImages();
}

// ==================== Keyboard Navigation ====================
document.addEventListener('keydown', (e) => {
    // ESC para fechar menu mobile
    if (e.key === 'Escape' && navLinks.style.display === 'flex') {
        navLinks.style.display = 'none';
        menuToggle.textContent = '≡';
    }
    
    // Alt + N para focar no campo de newsletter (acessibilidade)
    if (e.altKey && e.key === 'n') {
        nameInput.focus();
    }
});

// ==================== Social Links ====================
// Atualizar links de contato com informações reais
document.addEventListener('DOMContentLoaded', () => {
    // Substituir links de placeholder por links reais
    // const githubLink = document.querySelector('.contact-link[href*="github"]');
    // const linkedinLink = document.querySelector('.contact-link[href*="linkedin"]');
    // const emailLink = document.querySelector('.contact-link[href*="mailto"]');
    
    // githubLink?.setAttribute('href', 'https://github.com/seu-usuario');
    // linkedinLink?.setAttribute('href', 'https://linkedin.com/in/seu-perfil');
    // emailLink?.setAttribute('href', 'mailto:seu.email@example.com');
});

// ==================== Performance Optimization ====================
// Lazy Loading para images (se necessário adicionar imagens depois)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ==================== Error Handling ====================
window.addEventListener('error', (event) => {
    console.error('Erro detectado:', event.error);
    // Em produção, você poderia enviar isto para um serviço de log
});

// ==================== Contact Link Handlers ====================
document.querySelectorAll('.contact-link').forEach(link => {
    link.addEventListener('click', function(e) {
        const linkType = this.textContent.includes('Email') ? 'email' : 
                        this.textContent.includes('LinkedIn') ? 'linkedin' : 'github';
        trackEvent('contact_link_clicked', { type: linkType });
    });
});

// ==================== Form Validation Helpers ====================
function validateFormInputs() {
    nameInput.addEventListener('blur', function() {
        if (this.value.trim().length < 2) {
            this.style.borderColor = 'var(--error-color)';
        } else {
            this.style.borderColor = 'var(--border-color)';
        }
    });
    
    emailInput.addEventListener('blur', function() {
        if (!isValidEmail(this.value)) {
            this.style.borderColor = 'var(--error-color)';
        } else {
            this.style.borderColor = 'var(--border-color)';
        }
    });
}

validateFormInputs();

// ==================== Scroll to Top Button (opcional) ====================
function createScrollToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'scroll-to-top';
    button.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
        border: none;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        z-index: 999;
        font-size: 1.5rem;
        transition: all 0.3s ease;
        box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
    `;
    
    document.body.appendChild(button);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            button.style.display = 'flex';
            button.style.alignItems = 'center';
            button.style.justifyContent = 'center';
        } else {
            button.style.display = 'none';
        }
    });
    
    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
}

createScrollToTopButton();

// ==================== Responsive Adjustments ====================
function handleResponsive() {
    const isMobile = window.innerWidth < 768;
    
    if (isMobile && navLinks?.style.display === 'flex') {
        navLinks.style.display = 'none';
        menuToggle.textContent = '≡';
    }
}

window.addEventListener('resize', handleResponsive);

console.log('JavaScript carregado e pronto! 🚀');
