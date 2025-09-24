/**
 * ATI TECH GABON - MODERN JAVASCRIPT
 * Advanced interactions and animations
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
    this.initTypingEffect();
    this.initSmoothScrolling();
  }

  // ==========================================
  // EVENT LISTENERS SETUP
  // ==========================================
  setupEventListeners() {
    // DOM Content Loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.onDOMLoaded());
    } else {
      this.onDOMLoaded();
    }

    // Window events
    window.addEventListener('load', () => this.onWindowLoad());
    window.addEventListener('scroll', () => this.onScroll());
    window.addEventListener('resize', () => this.onResize());

    // Navigation events
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

  // ==========================================
  // PRELOADER
  // ==========================================
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

  // ==========================================
  // NAVIGATION
  // ==========================================
  initNavigation() {
    this.navbar = document.getElementById('navbar');
    this.navToggle = document.getElementById('nav-toggle');
    this.navMenu = document.getElementById('nav-menu');
    this.navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (this.navToggle) {
      this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
    }

    // Close mobile menu when clicking on links
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMobileMenu());
    });

    // Active link highlighting
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

  // ==========================================
  // SMOOTH SCROLLING
  // ==========================================
  initSmoothScrolling() {
    document.querySelectorAll('[data-scroll-to]').forEach(element => {
      element.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = element.getAttribute('data-scroll-to');
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          this.smoothScrollTo(targetElement);
        }
      });
    });

    // Handle navigation links
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          this.smoothScrollTo(targetElement);
        }
      });
    });
  }

  smoothScrollTo(target) {
    const targetPosition = target.offsetTop - 80; // Account for fixed header
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

  // ==========================================
  // SCROLL REVEAL ANIMATIONS
  // ==========================================
  initScrollReveal() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      this.observerOptions
    );

    // Observe elements for animation
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

  // ==========================================
  // COUNTER ANIMATIONS
  // ==========================================
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

  // ==========================================
  // FORM HANDLING
  // ==========================================
  initFormHandler() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
      
      // Add floating label functionality
      const formInputs = contactForm.querySelectorAll('input, textarea, select');
      formInputs.forEach(input => {
        input.addEventListener('focus', () => this.handleInputFocus(input));
        input.addEventListener('blur', () => this.handleInputBlur(input));
        input.addEventListener('input', () => this.handleInputChange(input));
      });
    }

    // Contact action buttons
    document.querySelectorAll('[data-action]').forEach(button => {
      button.addEventListener('click', (e) => this.handleContactAction(e));
    });
  }

  handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Validate form
    if (!this.validateForm(form)) {
      this.showNotification('Veuillez remplir tous les champs requis.', 'error');
      return;
    }
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual endpoint)
    setTimeout(() => {
      this.processFormSubmission(formData)
        .then(() => {
          this.showNotification('Message envoyé avec succès! Nous vous répondrons bientôt.', 'success');
          form.reset();
          this.resetFormLabels(form);
        })
        .catch(() => {
          this.showNotification('Erreur lors de l\'envoi. Veuillez réessayer.', 'error');
        })
        .finally(() => {
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
        });
    }, 2000);
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
        
        // Email validation
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

  async processFormSubmission(formData) {
    // Simulate API call - replace with actual implementation
    return new Promise((resolve, reject) => {
      // In a real implementation, you would send the data to your server
      console.log('Form data:', Object.fromEntries(formData));
      
      // For demo purposes, always resolve
      resolve();
    });
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
    
    // Remove error state on input change
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

  // ==========================================
  // POPUP SYSTEM
  // ==========================================
  initPopups() {
    // Create additional popups for other services
    this.createServicePopups();
    
    // Service popup triggers
    document.querySelectorAll('[data-popup]').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const popupId = trigger.getAttribute('data-popup');
        this.showPopup(popupId);
      });
    });

    // Close popup handlers
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('popup-overlay') || 
          e.target.classList.contains('popup-close')) {
        this.closeAllPopups();
      }
    });

    // ESC key to close popups
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
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
          <p>Développement d'applications mobiles natives et cross-platform performantes :</p>
          <ul>
            <li>Applications iOS et Android natives</li>
            <li>Applications cross-platform (React Native, Flutter)</li>
            <li>Applications PWA (Progressive Web Apps)</li>
            <li>Intégration d'APIs et services cloud</li>
            <li>Optimisation des performances</li>
          </ul>
          <p><strong>Technologies utilisées :</strong> React Native, Flutter, Swift, Kotlin, Firebase</p>
        `
      },
      {
        id: 'maintenance-popup',
        title: 'Maintenance IT',
        image: 'https://res.cloudinary.com/dheprfudi/image/upload/v1749349503/12667727_20945577_ns2wr9.jpg',
        content: `
          <p>Services complets de maintenance informatique pour assurer la continuité de vos activités :</p>
          <ul>
            <li>Maintenance préventive et curative</li>
            <li>Support technique 24/7</li>
            <li>Sauvegarde et récupération de données</li>
            <li>Mise à jour sécurisée des systèmes</li>
            <li>Monitoring et supervision</li>
          </ul>
          <p><strong>Avantages :</strong> Réduction des pannes, optimisation des performances, sécurité renforcée</p>
        `
      },
      {
        id: 'formation-popup',
        title: 'Formation Professionnelle',
        image: 'https://res.cloudinary.com/dheprfudi/image/upload/v1749348098/anonymous-black-man-typing_1_xhw7ia.jpg',
        content: `
          <p>Formations certifiantes adaptées aux besoins de votre entreprise :</p>
          <ul>
            <li>Bureautique (Office 365, Google Workspace)</li>
            <li>Programmation (Python, JavaScript, PHP)</li>
            <li>Bases de données (MySQL, PostgreSQL)</li>
            <li>Cybersécurité et bonnes pratiques</li>
            <li>Marketing digital et réseaux sociaux</li>
          </ul>
          <p><strong>Modalités :</strong> Présentiel, distanciel, formations sur mesure avec certification</p>
        `
      },
      {
        id: 'system-popup',
        title: 'Installation Système',
        image: 'https://res.cloudinary.com/dheprfudi/image/upload/v1749348103/computer-1209641__480_kuo6eb.webp',
        content: `
          <p>Installation et configuration professionnelle de systèmes informatiques :</p>
          <ul>
            <li>Systèmes d'exploitation (Windows, Linux, macOS)</li>
            <li>Logiciels métier et applications spécialisées</li>
            <li>Configuration réseau et sécurité</li>
            <li>Migration de données et environnements</li>
            <li>Optimisation et personnalisation</li>
          </ul>
          <p><strong>Expertise :</strong> Installations sur site, configuration à distance, formation utilisateurs</p>
        `
      },
      {
        id: 'archive-popup',
        title: 'Archivage Numérique',
        image: 'https://res.cloudinary.com/dheprfudi/image/upload/v1749348104/entrepreneur-1340649__340_x5ifvl.webp',
        content: `
          <p>Solutions complètes pour la gestion et la sécurisation de vos données :</p>
          <ul>
            <li>Archivage automatisé et intelligent</li>
            <li>Sauvegarde cloud sécurisée</li>
            <li>Récupération de données perdues</li>
            <li>Migration et transfert de données</li>
            <li>Conformité réglementaire (RGPD)</li>
          </ul>
          <p><strong>Sécurité :</strong> Chiffrement, redondance, accès contrôlé, audit trail complet</p>
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
          <button class="btn-primary" data-scroll-to="contact">Demander un devis</button>
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

  // ==========================================
  // BACK TO TOP BUTTON
  // ==========================================
  initBackToTop() {
    this.backToTopBtn = document.getElementById('backToTop');
    
    if (this.backToTopBtn) {
      this.backToTopBtn.addEventListener('click', () => {
        this.smoothScrollTo(document.body);
      });
    }
  }

  updateBackToTop() {
    if (this.backToTopBtn) {
      if (window.scrollY > 300) {
        this.backToTopBtn.classList.add('active');
      } else {
        this.backToTopBtn.classList.remove('active');
      }
    }
  }

  // ==========================================
  // PARTICLES ANIMATION
  // ==========================================
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
    
    // Add CSS animation for particles
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

  // ==========================================
  // TYPING EFFECT
  // ==========================================
  initTypingEffect() {
    const typingElements = document.querySelectorAll('[data-typing]');
    
    typingElements.forEach(element => {
      const text = element.getAttribute('data-typing');
      const speed = parseInt(element.getAttribute('data-typing-speed')) || 100;
      this.typeText(element, text, speed);
    });
  }

  typeText(element, text, speed) {
    let index = 0;
    element.textContent = '';
    
    const typeInterval = setInterval(() => {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        index++;
      } else {
        clearInterval(typeInterval);
        element.classList.remove('typing');
      }
    }, speed);
  }

  // ==========================================
  // NOTIFICATION SYSTEM
  // ==========================================
  showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const icon = notification.querySelector('.notification-icon');
    const text = notification.querySelector('.notification-text');
    
    // Set icon based on type
    const icons = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-circle',
      info: 'fas fa-info-circle',
      warning: 'fas fa-exclamation-triangle'
    };
    
    icon.className = `notification-icon ${icons[type] || icons.info}`;
    text.textContent = message;
    
    // Remove existing type classes and add new one
    notification.className = `notification ${type}`;
    notification.classList.add('active');
    
    // Auto hide after 5 seconds
    setTimeout(() => {
      notification.classList.remove('active');
    }, 5000);
  }

  // ==========================================
  // CLICK HANDLERS
  // ==========================================
  handleClicks(e) {
    // Handle popup close buttons
    if (e.target.classList.contains('popup-close') || 
        e.target.classList.contains('popup-overlay')) {
      this.closeAllPopups();
    }
    
    // Handle scroll-to buttons
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
    // Close popups with Escape key
    if (e.key === 'Escape') {
      this.closeAllPopups();
    }
    
    // Close mobile menu with Escape key
    if (e.key === 'Escape' && this.navMenu.classList.contains('active')) {
      this.closeMobileMenu();
    }
  }

  // ==========================================
  // SCROLL INDICATOR
  // ==========================================
  updateScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
      if (window.scrollY > 100) {
        scrollIndicator.style.opacity = '0';
      } else {
        scrollIndicator.style.opacity = '1';
      }
    }
  }

  // ==========================================
  // RESPONSIVE FEATURES
  // ==========================================
  handleResponsiveFeatures() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
      this.closeMobileMenu();
    }
    
    // Adjust particles count based on screen size
    this.adjustParticles();
  }

  adjustParticles() {
    const particles = document.querySelectorAll('.particle');
    const shouldShowParticles = window.innerWidth > 768 && 
                               !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    particles.forEach(particle => {
      particle.style.display = shouldShowParticles ? 'block' : 'none';
    });
  }

  // ==========================================
  // ANIMATIONS
  // ==========================================
  initAnimations() {
    // Stagger animations for service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
    });

    // Floating cards animation
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach((card, index) => {
      card.style.animationDelay = `${index * 1.5}s`;
    });
  }

  // ==========================================
  // PERFORMANCE OPTIMIZATION
  // ==========================================
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  debounce(func, wait, immediate) {
    let timeout;
    return function() {
      const context = this, args = arguments;
      const later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  // ==========================================
  // ACCESSIBILITY ENHANCEMENTS
  // ==========================================
  initAccessibility() {
    // Add skip link
    this.addSkipLink();
    
    // Improve focus management
    this.improveFocusManagement();
    
    // Add ARIA labels where needed
    this.addAriaLabels();
  }

  addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link visually-hidden';
    skipLink.textContent = 'Aller au contenu principal';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: var(--primary-color);
      color: white;
      padding: 8px;
      text-decoration: none;
      border-radius: 4px;
      z-index: 10000;
      transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  improveFocusManagement() {
    // Trap focus in popups
    document.querySelectorAll('.popup-overlay').forEach(popup => {
      popup.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          this.trapFocus(e, popup);
        }
      });
    });
  }

  trapFocus(e, container) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus();
        e.preventDefault();
      }
    }
  }

  addAriaLabels() {
    // Add aria-labels to buttons without text
    document.querySelectorAll('button:not([aria-label])').forEach(button => {
      if (!button.textContent.trim()) {
        const icon = button.querySelector('i');
        if (icon) {
          const iconClass = icon.className;
          let label = 'Bouton';
          
          if (iconClass.includes('phone')) label = 'Téléphoner';
          else if (iconClass.includes('envelope')) label = 'Envoyer un email';
          else if (iconClass.includes('whatsapp')) label = 'Contacter via WhatsApp';
          else if (iconClass.includes('chevron-up')) label = 'Retour en haut';
          
          button.setAttribute('aria-label', label);
        }
      }
    });
  }

  // ==========================================
  // ERROR HANDLING
  // ==========================================
  handleError(error, context = 'Application') {
    console.error(`[${context}] Erreur:`, error);
    
    // Log error for debugging in development
    if (window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1') {
      this.showNotification(`Erreur de développement: ${error.message}`, 'error');
    }
  }

  // ==========================================
  // UTILITY METHODS
  // ==========================================
  utils = {
    // Check if element is in viewport
    isInViewport: (element) => {
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    },

    // Format phone number for display
    formatPhone: (phone) => {
      return phone.replace(/(\d{3})(\d{2})(\d{2})(\d{2})(\d{2})/, '+$1 $2 $3 $4 $5');
    },

    // Validate email format
    isValidEmail: (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    // Sanitize HTML content
    sanitizeHTML: (str) => {
      const temp = document.createElement('div');
      temp.textContent = str;
      return temp.innerHTML;
    },

    // Get device type
    getDeviceType: () => {
      const width = window.innerWidth;
      if (width < 480) return 'mobile';
      if (width < 768) return 'tablet';
      return 'desktop';
    },

    // Check for reduced motion preference
    respectsReducedMotion: () => {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },

    // Generate unique ID
    generateId: () => {
      return 'ati-' + Math.random().toString(36).substr(2, 9);
    }
  };
}

// ==========================================
// SPECIALIZED COMPONENTS
// ==========================================

class ServiceCardComponent {
  constructor(element) {
    this.element = element;
    this.init();
  }

  init() {
    this.addHoverEffects();
    this.addClickHandler();
  }

  addHoverEffects() {
    this.element.addEventListener('mouseenter', () => {
      this.element.style.transform = 'translateY(-8px) scale(1.02)';
    });

    this.element.addEventListener('mouseleave', () => {
      this.element.style.transform = 'translateY(0) scale(1)';
    });
  }

  addClickHandler() {
    const button = this.element.querySelector('.service-btn');
    if (button) {
      button.addEventListener('click', (e) => {
        this.createRippleEffect(e, button);
      });
    }
  }

  createRippleEffect(e, element) {
    const rect = element.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
    `;
    
    element.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }
}

class ContactFormComponent {
  constructor(form) {
    this.form = form;
    this.init();
  }

  init() {
    this.addRealTimeValidation();
    this.addProgressIndicator();
  }

  addRealTimeValidation() {
    const inputs = this.form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });
  }

  validateField(field) {
    let isValid = true;
    const value = field.value.trim();
    
    // Required field check
    if (field.hasAttribute('required') && !value) {
      this.showFieldError(field, 'Ce champ est requis');
      isValid = false;
    }
    
    // Email validation
    if (field.type === 'email' && value && !this.isValidEmail(value)) {
      this.showFieldError(field, 'Format d\'email invalide');
      isValid = false;
    }
    
    // Phone validation
    if (field.type === 'tel' && value && !this.isValidPhone(value)) {
      this.showFieldError(field, 'Format de téléphone invalide');
      isValid = false;
    }
    
    if (isValid) {
      this.showFieldSuccess(field);
    }
    
    return isValid;
  }

  showFieldError(field, message) {
    field.classList.add('error');
    this.removeFieldMessage(field);
    
    const errorMessage = document.createElement('div');
    errorMessage.className = 'field-error';
    errorMessage.textContent = message;
    errorMessage.style.cssText = `
      color: var(--accent-color);
      font-size: var(--font-size-xs);
      margin-top: var(--spacing-xs);
      animation: slideDown 0.3s ease;
    `;
    
    field.parentNode.appendChild(errorMessage);
  }

  showFieldSuccess(field) {
    field.classList.remove('error');
    field.classList.add('success');
    this.removeFieldMessage(field);
  }

  clearFieldError(field) {
    field.classList.remove('error');
    this.removeFieldMessage(field);
  }

  removeFieldMessage(field) {
    const existingMessage = field.parentNode.querySelector('.field-error, .field-success');
    if (existingMessage) {
      existingMessage.remove();
    }
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidPhone(phone) {
    const phoneRegex = /^(\+241|241)?\s?[0-9]{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  addProgressIndicator() {
    const submitButton = this.form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.addEventListener('click', () => {
        if (this.form.checkValidity()) {
          this.showProgress();
        }
      });
    }
  }

  showProgress() {
    // Implementation for form submission progress
    console.log('Affichage du progrès de soumission');
  }
}

// ==========================================
// INITIALIZATION
// ==========================================

// Initialize the website when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  try {
    // Main application
    window.atiTechApp = new ATITechWebsite();
    
    // Initialize specialized components
    document.querySelectorAll('.service-card').forEach(card => {
      new ServiceCardComponent(card);
    });
    
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      new ContactFormComponent(contactForm);
    }
    
    // Add ripple effect CSS
    const rippleStyles = document.createElement('style');
    rippleStyles.textContent = `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
      
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(rippleStyles);
    
    console.log('ATI Tech Gabon website fully initialized');
    
  } catch (error) {
    console.error('Erreur lors de l\'initialisation:', error);
  }
});

// Global error handler
window.addEventListener('error', (e) => {
  console.error('Erreur globale:', e.error);
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (e) => {
  console.error('Promesse rejetée non gérée:', e.reason);
});

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker enregistré:', registration);
      })
      .catch(error => {
        console.log('Échec d\'enregistrement du Service Worker:', error);
      });
  });
}