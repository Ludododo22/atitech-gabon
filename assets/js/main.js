/**
 * ATI TECH GABON - MODERN JAVASCRIPT
 */

class ATITechWebsite {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initPreloader();
    this.initNavigation();
    this.initScrollReveal();
    this.initCounters();
    this.initFormHandler();
    this.initPopups();
    this.initBackToTop();
    this.initParticles();
    this.initHeroCarousel();
    this.initSmoothScrolling();
  }

  setupEventListeners() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.onDOMLoaded());
    } else {
      this.onDOMLoaded();
    }

    window.addEventListener('load', () => this.onWindowLoad());
    window.addEventListener('scroll', () => this.onScroll());
    window.addEventListener('resize', () => this.onResize());
    document.addEventListener('click', (e) => this.handleClicks(e));
    document.addEventListener('keydown', (e) => this.handleKeydown(e));
  }

  onDOMLoaded() {
    console.log('ATI Tech Website initialized');
    this.initAnimations();
  }

  onWindowLoad() {
    setTimeout(() => this.hidePreloader(), 1000);
  }

  onScroll() {
    this.updateNavigation();
    this.updateScrollReveal();
    this.updateBackToTop();
    this.updateScrollIndicator();
  }

  onResize() {
    this.handleResponsiveFeatures();
  }

  initPreloader() {
    this.preloader = document.getElementById('preloader');
  }

  hidePreloader() {
    if (this.preloader) {
      this.preloader.style.opacity = '0';
      setTimeout(() => {
        this.preloader.style.display = 'none';
        document.body.style.overflow = 'visible';
      }, 500);
    }
  }

  initNavigation() {
    this.navbar = document.getElementById('navbar');
    this.navToggle = document.getElementById('nav-toggle');
    this.navMenu = document.getElementById('nav-menu');
    this.navLinks = document.querySelectorAll('.nav-link');

    if (this.navToggle) {
      this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
    }

    this.navLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMobileMenu());
    });

    this.updateActiveNavLink();
  }

  toggleMobileMenu() {
    this.navToggle.classList.toggle('active');
    this.navMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  }

  closeMobileMenu() {
    if (window.innerWidth <= 768) {
      this.navToggle.classList.remove('active');
      this.navMenu.classList.remove('active');
      document.body.classList.remove('menu-open');
    }
  }

  updateNavigation() {
    if (window.scrollY > 100) {
      this.navbar.classList.add('scrolled');
    } else {
      this.navbar.classList.remove('scrolled');
    }
  }

  updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (correspondingLink) {
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          this.navLinks.forEach(link => link.classList.remove('active'));
          correspondingLink.classList.add('active');
        }
      }
    });
  }

  initSmoothScrolling() {
    document.querySelectorAll('[data-scroll-to]').forEach(element => {
      element.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = element.getAttribute('data-scroll-to');
        const targetElement = document.getElementById(targetId);
        if (targetElement) this.smoothScrollTo(targetElement);
      });
    });

    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) this.smoothScrollTo(targetElement);
      });
    });
  }

  smoothScrollTo(target) {
    const targetPosition = target.offsetTop - 80;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 1000;
    let start = null;

    const animation = (currentTime) => {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const run = this.easeInOutQuad(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    };

    requestAnimationFrame(animation);
  }

  easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }

  initScrollReveal() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      this.observerOptions
    );

    const elementsToObserve = document.querySelectorAll(`
      .section-header,
      .about-card,
      .service-card,
      .contact-card,
      .hero-text,
      .stats-grid
    `);

    elementsToObserve.forEach((element, index) => {
      element.classList.add('fade-in');
      element.style.setProperty('--stagger-delay', index % 3);
      this.observer.observe(element);
    });
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        this.observer.unobserve(entry.target);
      }
    });
  }

  updateScrollReveal() {
    this.updateActiveNavLink();
  }

  initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    counters.forEach(counter => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !counter.classList.contains('counted')) {
            this.animateCounter(counter);
            counter.classList.add('counted');
          }
        });
      });
      
      observer.observe(counter);
    });
  }

  animateCounter(counter) {
    const target = parseInt(counter.getAttribute('data-count'));
    const duration = 2000;
    const startTime = performance.now();
    
    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentCount = Math.floor(progress * target);
      counter.textContent = currentCount;
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };
    
    requestAnimationFrame(updateCounter);
  }

  initFormHandler() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
      
      const formInputs = contactForm.querySelectorAll('input, textarea, select');
      formInputs.forEach(input => {
        input.addEventListener('focus', () => this.handleInputFocus(input));
        input.addEventListener('blur', () => this.handleInputBlur(input));
        input.addEventListener('input', () => this.handleInputChange(input));
      });
    }

    document.querySelectorAll('[data-action]').forEach(button => {
      button.addEventListener('click', (e) => this.handleContactAction(e));
    });
  }

  async handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    if (!this.validateForm(form)) {
      this.showNotification('Veuillez remplir tous les champs requis.', 'error');
      return;
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      // Simulation d'envoi (remplacer par votre endpoint)
      await new Promise(resolve => setTimeout(resolve, 1500));

      this.showNotification('Message envoyé avec succès ! Nous vous contacterons rapidement.', 'success');
      form.reset();
      this.resetFormLabels(form);

    } catch (error) {
      console.error('Erreur:', error);
      this.showNotification('Erreur lors de l\'envoi. Veuillez réessayer.', 'error');
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  }

  validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        field.classList.add('error');
        isValid = false;
      } else {
        field.classList.remove('error');
        if (field.type === 'email' && !this.isValidEmail(field.value)) {
          field.classList.add('error');
          isValid = false;
        }
      }
    });
    
    return isValid;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  resetFormLabels(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      const label = input.nextElementSibling;
      if (label && label.tagName === 'LABEL') {
        label.style.transform = '';
        label.style.fontSize = '';
        label.style.color = '';
      }
    });
  }

  handleInputFocus(input) {
    input.classList.add('focused');
  }

  handleInputBlur(input) {
    input.classList.remove('focused');
    if (!input.value) {
      input.classList.remove('has-value');
    } else {
      input.classList.add('has-value');
    }
  }

  handleInputChange(input) {
    if (input.value) {
      input.classList.add('has-value');
    } else {
      input.classList.remove('has-value');
    }
    input.classList.remove('error');
  }

  handleContactAction(e) {
    const action = e.target.getAttribute('data-action');
    switch (action) {
      case 'call':
        window.open('tel:+24174466862');
        break;
      case 'email':
        window.open('mailto:contact.atitech@gmail.com?subject=Demande de renseignements');
        break;
      case 'whatsapp':
        window.open('https://wa.me/24162059836?text=Bonjour%20je%20suis%20intéressé%20par%20vos%20services');
        break;
    }
  }

  initPopups() {
    this.createServicePopups();
    
    document.querySelectorAll('[data-popup]').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const popupId = trigger.getAttribute('data-popup');
        this.showPopup(popupId);
      });
    });

    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('popup-overlay') || e.target.classList.contains('popup-close')) {
        this.closeAllPopups();
      }
    });
  }

  createServicePopups() {
    const services = [
      {
        id: 'mobile-popup',
        title: 'Applications Mobile',
        image: 'https://res.cloudinary.com/dheprfudi/image/upload/v1749349502/rRepresentations_ycloxj.jpg',
        content: `
          <p>Développement d'applications mobiles natives et cross-platform performantes pour tous vos besoins :</p>
          <ul>
            <li>Applications iOS et Android natives hautement performantes</li>
            <li>Applications cross-platform (React Native, Flutter) économiques</li>
            <li>Applications PWA (Progressive Web Apps) accessibles</li>
            <li>Intégration d'APIs et services cloud (Firebase, AWS)</li>
            <li>Optimisation des performances et UX/UI design</li>
            <li>Publication sur App Store et Google Play</li>
          </ul>
          <p><strong>Technologies utilisées :</strong> React Native, Flutter, Swift, Kotlin, Firebase, Redux</p>
          <p><strong>Avantages :</strong> Interface intuitive, notifications push, mode hors ligne, sécurité renforcée</p>
        `
      },
      {
        id: 'maintenance-popup',
        title: 'Maintenance IT',
        image: 'https://res.cloudinary.com/dheprfudi/image/upload/v1749349503/12667727_20945577_ns2wr9.jpg',
        content: `
          <p>Services complets de maintenance informatique pour assurer la continuité de vos activités :</p>
          <ul>
            <li>Maintenance préventive et curative de tous vos équipements</li>
            <li>Support technique 24/7 avec intervention rapide</li>
            <li>Sauvegarde automatisée et récupération de données</li>
            <li>Mise à jour sécurisée des systèmes et logiciels</li>
            <li>Monitoring et supervision en temps réel</li>
            <li>Gestion du parc informatique et inventaire</li>
          </ul>
          <p><strong>Avantages :</strong> Réduction des pannes de 80%, optimisation des performances, sécurité renforcée, économies substantielles</p>
        `
      },
      {
        id: 'formation-popup',
        title: 'Formation Professionnelle',
        image: 'https://res.cloudinary.com/dheprfudi/image/upload/v1749348098/anonymous-black-man-typing_1_xhw7ia.jpg',
        content: `
          <p>Formations certifiantes adaptées aux besoins de votre entreprise et tous niveaux :</p>
          <ul>
            <li>Bureautique (Office 365, Google Workspace, Excel avancé)</li>
            <li>Programmation (Python, JavaScript, PHP, bases de données)</li>
            <li>Cybersécurité et bonnes pratiques de protection des données</li>
            <li>Marketing digital, SEO et gestion des réseaux sociaux</li>
            <li>Design graphique (Photoshop, Illustrator, Figma)</li>
            <li>Gestion de projet et outils collaboratifs</li>
          </ul>
          <p><strong>Modalités :</strong> Présentiel à Libreville, distanciel via visioconférence, formations sur mesure avec certification reconnue internationalement</p>
        `
      },
      {
        id: 'system-popup',
        title: 'Installation Système',
        image: 'https://res.cloudinary.com/dheprfudi/image/upload/v1749348103/computer-1209641__480_kuo6eb.webp',
        content: `
          <p>Installation et configuration professionnelle de systèmes informatiques complète :</p>
          <ul>
            <li>Systèmes d'exploitation (Windows 10/11, Linux Ubuntu/Debian, macOS)</li>
            <li>Logiciels métier et applications spécialisées selon votre secteur</li>
            <li>Configuration réseau local et sécurité périmétrique</li>
            <li>Migration de données sécurisée et test de compatibilité</li>
            <li>Optimisation des performances et personnalisation</li>
            <li>Formation des utilisateurs et documentation technique</li>
          </ul>
          <p><strong>Expertise :</strong> Installations sur site à Libreville, configuration à distance, support post-installation inclus pendant 30 jours</p>
        `
      },
      {
        id: 'archive-popup',
        title: 'Archivage Numérique',
        image: 'https://res.cloudinary.com/dheprfudi/image/upload/v1749348104/entrepreneur-1340649__340_x5ifvl.webp',
        content: `
          <p>Solutions complètes pour la gestion et la sécurisation de vos données critiques :</p>
          <ul>
            <li>Archivage automatisé et intelligent avec indexation avancée</li>
            <li>Sauvegarde cloud chiffrée (AWS, Azure, Google Cloud)</li>
            <li>Récupération rapide de données perdues ou corrompues</li>
            <li>Migration et transfert de données entre systèmes</li>
            <li>Conformité réglementaire (RGPD, normes ISO)</li>
            <li>Dématérialisation de documents et GED (Gestion Électronique de Documents)</li>
          </ul>
          <p><strong>Sécurité :</strong> Chiffrement AES-256, redondance multi-sites, accès contrôlé par authentification, audit trail complet avec traçabilité totale</p>
        `
      }
    ];

    services.forEach(service => {
      this.createPopupElement(service);
    });
  }

  createPopupElement(service) {
    const popup = document.createElement('div');
    popup.id = service.id;
    popup.className = 'popup-overlay';
    popup.innerHTML = `
      <div class="popup-content">
        <div class="popup-header">
          <h3>${service.title}</h3>
          <button class="popup-close">&times;</button>
        </div>
        <div class="popup-body">
          <img src="${service.image}" alt="${service.title}">
          <div class="popup-text">${service.content}</div>
        </div>
        <div class="popup-footer">
          <button class="btn-primary" data-scroll-to="contact">Demander un devis gratuit</button>
        </div>
      </div>
    `;
    document.body.appendChild(popup);
  }

  showPopup(popupId) {
    const popup = document.getElementById(popupId);
    if (popup) {
      document.body.style.overflow = 'hidden';
      popup.classList.add('active');
    }
  }

  closeAllPopups() {
    document.body.style.overflow = 'visible';
    document.querySelectorAll('.popup-overlay').forEach(popup => {
      popup.classList.remove('active');
    });
  }

  initBackToTop() {
    this.backToTopBtn = document.getElementById('backToTop');
    if (this.backToTopBtn) {
      this.backToTopBtn.addEventListener('click', () => {
        this.smoothScrollTo(document.body);
      });
    }
  }

  updateBackToTop() {
    if (this.backToTopBtn && window.scrollY > 300) {
      this.backToTopBtn.classList.add('active');
    } else if (this.backToTopBtn) {
      this.backToTopBtn.classList.remove('active');
    }
  }

  initParticles() {
    const heroParticles = document.querySelector('.hero-particles');
    if (heroParticles) {
      this.createParticles(heroParticles);
    }
  }

  createParticles(container) {
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 4 + 1}px;
        height: ${Math.random() * 4 + 1}px;
        background: rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2});
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: floatParticle ${Math.random() * 10 + 10}s linear infinite;
        animation-delay: ${Math.random() * 5}s;
      `;
      container.appendChild(particle);
    }

    if (!document.querySelector('#particle-styles')) {
      const style = document.createElement('style');
      style.id = 'particle-styles';
      style.textContent = `
        @keyframes floatParticle {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  initHeroCarousel() {
    this.carouselSlides = document.querySelectorAll('.hero-slide');
    this.carouselIndex = 0;
    
    if (this.carouselSlides.length <= 1) return;
    
    this.carouselInterval = setInterval(() => {
      this.nextHeroSlide();
    }, 6000);
  }

  nextHeroSlide() {
    this.carouselSlides[this.carouselIndex].classList.remove('active');
    this.carouselIndex = (this.carouselIndex + 1) % this.carouselSlides.length;
    this.carouselSlides[this.carouselIndex].classList.add('active');
  }

  showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const icon = notification.querySelector('.notification-icon');
    const text = notification.querySelector('.notification-text');
    
    const icons = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-circle',
      info: 'fas fa-info-circle',
      warning: 'fas fa-exclamation-triangle'
    };
    
    icon.className = `notification-icon ${icons[type] || icons.info}`;
    text.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('active');
    
    setTimeout(() => {
      notification.classList.remove('active');
    }, 5000);
  }

  handleClicks(e) {
    if (e.target.classList.contains('popup-close') || e.target.classList.contains('popup-overlay')) {
      this.closeAllPopups();
    }
    
    if (e.target.hasAttribute('data-scroll-to')) {
      const targetId = e.target.getAttribute('data-scroll-to');
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        this.closeAllPopups();
        setTimeout(() => this.smoothScrollTo(targetElement), 300);
      }
    }
  }

  handleKeydown(e) {
    if (e.key === 'Escape') {
      this.closeAllPopups();
      if (this.navMenu.classList.contains('active')) this.closeMobileMenu();
    }
  }

  updateScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
      scrollIndicator.style.opacity = window.scrollY > 100 ? '0' : '1';
    }
  }

  handleResponsiveFeatures() {
    if (window.innerWidth > 768) this.closeMobileMenu();
    this.adjustParticles();
  }

  adjustParticles() {
    const particles = document.querySelectorAll('.particle');
    const shouldShow = window.innerWidth > 768 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    particles.forEach(p => p.style.display = shouldShow ? 'block' : 'none');
  }

  initAnimations() {
    document.querySelectorAll('.service-card').forEach((card, i) => card.style.animationDelay = `${i * 0.1}s`);
    document.querySelectorAll('.floating-card').forEach((card, i) => card.style.animationDelay = `${i * 1.5}s`);
  }
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  try {
    window.atiTechApp = new ATITechWebsite();
    console.log('ATI Tech Gabon website fully initialized');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation:', error);
  }
});

window.addEventListener('error', (e) => console.error('Erreur globale:', e.error));
window.addEventListener('unhandledrejection', (e) => console.error('Promesse rejetée:', e.reason));
