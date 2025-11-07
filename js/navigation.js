// Navigation JavaScript for Enhanced User Experience

class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navToggle = document.getElementById('navToggle');
        this.navMenu = document.getElementById('navMenu');
        this.progressBar = document.getElementById('progressBar');
        this.backToTop = document.getElementById('backToTop');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateActiveNavLink();
        this.setupScrollProgress();
        this.setupSmoothScrolling();
        this.setupBackToTop();
        this.setupAccessibility();
    }

    setupEventListeners() {
        // Mobile menu toggle
        this.navToggle?.addEventListener('click', () => this.toggleMobileMenu());
        
        // Close mobile menu when clicking on links
        this.navMenu?.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link')) {
                this.closeMobileMenu();
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navbar?.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Scroll events
        window.addEventListener('scroll', () => {
            this.handleScroll();
            this.updateScrollProgress();
            this.updateActiveNavLink();
        });

        // Resize events
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Escape key to close mobile menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        this.navMenu?.classList.toggle('active');
        this.navToggle?.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (this.navMenu?.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        // Update aria attributes
        const isExpanded = this.navMenu?.classList.contains('active');
        this.navToggle?.setAttribute('aria-expanded', isExpanded.toString());
    }

    closeMobileMenu() {
        this.navMenu?.classList.remove('active');
        this.navToggle?.classList.remove('active');
        document.body.style.overflow = '';
        this.navToggle?.setAttribute('aria-expanded', 'false');
    }

    handleScroll() {
        // Add scrolled class to navbar
        if (window.scrollY > 50) {
            this.navbar?.classList.add('scrolled');
        } else {
            this.navbar?.classList.remove('scrolled');
        }
    }

    handleResize() {
        // Close mobile menu on desktop
        if (window.innerWidth > 768) {
            this.closeMobileMenu();
        }
    }

    updateScrollProgress() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        if (this.progressBar) {
            this.progressBar.style.width = scrolled + '%';
        }
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                // Remove active class from all nav links
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });

                // Add active class to current section's nav link
                const activeLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);
                activeLink?.classList.add('active');
            }
        });
    }

    setupSmoothScrolling() {
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                
                // Skip if href is just "#"
                if (href === '#') return;
                
                e.preventDefault();
                
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu after clicking
                    this.closeMobileMenu();
                    
                    // Focus management for accessibility
                    target.focus();
                }
            });
        });
    }

    setupBackToTop() {
        // Show/hide back to top button
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                this.backToTop?.classList.add('visible');
            } else {
                this.backToTop?.classList.remove('visible');
            }
        });

        // Back to top functionality
        this.backToTop?.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    setupAccessibility() {
        // Keyboard navigation for dropdowns
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            const menu = dropdown.querySelector('.dropdown-menu');

            toggle?.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    dropdown.classList.toggle('show');
                }
            });

            // Close dropdown on escape
            dropdown.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    dropdown.classList.remove('show');
                    toggle?.focus();
                }
            });
        });

        // Focus management for mobile menu
        this.navToggle?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleMobileMenu();
                
                if (this.navMenu?.classList.contains('active')) {
                    const firstLink = this.navMenu.querySelector('.nav-link');
                    firstLink?.focus();
                }
            }
        });

        // Trap focus in mobile menu
        this.navMenu?.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const focusableElements = this.navMenu.querySelectorAll('.nav-link');
                const firstFocusable = focusableElements[0];
                const lastFocusable = focusableElements[focusableElements.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable?.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable?.focus();
                    }
                }
            }
        });
    }
}

// Breadcrumb Management
class Breadcrumb {
    constructor() {
        this.breadcrumbList = document.querySelector('.breadcrumb-list');
        this.init();
    }

    init() {
        this.updateBreadcrumb();
    }

    updateBreadcrumb() {
        const path = window.location.pathname;
        const pathSegments = path.split('/').filter(segment => segment);
        
        // Clear existing breadcrumb except home
        const homeItem = this.breadcrumbList?.querySelector('li:first-child');
        if (this.breadcrumbList) {
            this.breadcrumbList.innerHTML = '';
            if (homeItem) {
                this.breadcrumbList.appendChild(homeItem);
            }
        }

        // Add current page to breadcrumb if not home
        if (pathSegments.length > 0) {
            const currentPage = pathSegments[pathSegments.length - 1];
            const pageName = this.formatPageName(currentPage);
            
            const listItem = document.createElement('li');
            listItem.textContent = pageName;
            listItem.setAttribute('aria-current', 'page');
            
            this.breadcrumbList?.appendChild(listItem);
        }
    }

    formatPageName(filename) {
        // Remove .html extension and format name
        const name = filename.replace('.html', '');
        return name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');
    }
}

// Form Enhancement
class FormEnhancement {
    constructor() {
        this.forms = document.querySelectorAll('form');
        this.init();
    }

    init() {
        this.setupFormValidation();
        this.setupFormAccessibility();
    }

    setupFormValidation() {
        this.forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
            });

            // Real-time validation
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
            });
        });
    }

    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldType = field.type;
        let isValid = true;
        let message = '';

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            message = 'This field is required';
        }

        // Email validation
        if (fieldType === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                message = 'Please enter a valid email address';
            }
        }

        // Phone validation
        if (fieldType === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                isValid = false;
                message = 'Please enter a valid phone number';
            }
        }

        this.showFieldValidation(field, isValid, message);
        return isValid;
    }

    showFieldValidation(field, isValid, message) {
        // Remove existing validation messages
        const existingMessage = field.parentNode.querySelector('.validation-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Add validation styling
        field.classList.remove('valid', 'invalid');
        field.classList.add(isValid ? 'valid' : 'invalid');

        // Add error message
        if (!isValid && message) {
            const messageElement = document.createElement('div');
            messageElement.className = 'validation-message';
            messageElement.textContent = message;
            messageElement.setAttribute('role', 'alert');
            field.parentNode.appendChild(messageElement);
        }
    }

    setupFormAccessibility() {
        // Add proper labels and ARIA attributes
        this.forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                // Add aria-required for required fields
                if (input.hasAttribute('required')) {
                    input.setAttribute('aria-required', 'true');
                }

                // Add aria-invalid for validation
                input.setAttribute('aria-invalid', 'false');
            });
        });
    }
}

// Performance and Loading
class PerformanceOptimization {
    constructor() {
        this.init();
    }

    init() {
        this.lazyLoadImages();
        this.preloadCriticalResources();
        this.setupIntersectionObserver();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
            });
        }
    }

    preloadCriticalResources() {
        // Preload critical CSS and fonts
        const criticalResources = [
            { href: 'css/styles.css', as: 'style' },
            { href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css', as: 'style' }
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            document.head.appendChild(link);
        });
    }

    setupIntersectionObserver() {
        // Animate elements when they come into view
        const animateOnScroll = document.querySelectorAll('.animate-on-scroll');
        
        if ('IntersectionObserver' in window) {
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                    }
                });
            }, { threshold: 0.1 });

            animateOnScroll.forEach(element => {
                animationObserver.observe(element);
            });
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main navigation
    new Navigation();
    
    // Initialize breadcrumb
    new Breadcrumb();
    
    // Initialize form enhancements
    new FormEnhancement();
    
    // Initialize performance optimizations
    new PerformanceOptimization();
    
    // Add loading complete class for CSS animations
    document.body.classList.add('loaded');
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export for potential module usage
export { Navigation, Breadcrumb, FormEnhancement, PerformanceOptimization };