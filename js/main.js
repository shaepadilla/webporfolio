// ===== Main JavaScript File =====

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initContactForm();
    initScrollEffects();
    initSkillBars();
    initTooltipEffects();
    initMobileMenu();
    // Parallax effect removed to avoid direct style.backgroundPosition manipulation
    initProjectModal();
    initImageFallback();
    initConsoleWelcome();
    initLazyLoading();
    initResizeHandler();
    initTouchPrevention();
    initResumeButton();
    initFilterButtons();
    initSmoothScroll();
});

// ===== Project Modal & Filtering =====
function initProjectModal() {
    const modal = document.getElementById('projectModal');
    const iframe = document.getElementById('projectFrame');
    const closeModal = document.getElementById('closeModal');
    const openNewTab = document.getElementById('openNewTab');
    let currentPath = "";

    if (!modal || !iframe) return;

    // Modal Launch Logic
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.open-modal');
        if (btn && !btn.classList.contains('disabled')) {
            e.preventDefault();
            currentPath = btn.getAttribute('data-path');
            
            // Set Modal Title based on the card's H3
            const projectCard = btn.closest('.work-card');
            if (projectCard) {
                const projectTitle = projectCard.querySelector('h3')?.innerText || 'Project Preview';
                const modalTitleElement = document.getElementById('modalTitle');
                if(modalTitleElement) modalTitleElement.innerText = projectTitle;
            }

            iframe.src = currentPath;
            // PATCH: Use classList instead of .style.display
            modal.classList.add('active');
            document.body.classList.add('modal-open');
        }
    });

    // Close Modal Logic
    if(closeModal) {
        closeModal.addEventListener('click', closeModalFunction);
    }

    function closeModalFunction() {
        // PATCH: Use classList instead of .style.display
        modal.classList.remove('active');
        if (iframe) iframe.src = ""; 
        document.body.classList.remove('modal-open');
    }

    // Open in New Tab
    if(openNewTab) {
        openNewTab.addEventListener('click', () => {
            if (currentPath) {
                window.open(currentPath, '_blank');
            }
        });
    }

    // Close on click outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModalFunction();
        }
    });

    // ESC key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModalFunction();
        }
    });
}

// ===== Filter Buttons =====
function initFilterButtons() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const workCards = document.querySelectorAll('.work-card');

    if (filterBtns.length === 0) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            // Filter cards
            workCards.forEach(card => {
                // PATCH: Use classList toggling instead of .style.display
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.classList.remove('filtered-out');
                } else {
                    card.classList.add('filtered-out');
                }
            });
        });
    });
}

// ===== Navigation =====
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!navbar) return;
    
    // Scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateActiveNavLink();
    });
    
    // Navigation click handling
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            
            const targetSection = document.querySelector(href);
            
            if (targetSection) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    navbarCollapse.classList.remove('show');
                }
            }
        });
    });
}

// Update active navigation link
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');
    
    if (!navbar || sections.length === 0) return;
    
    const navbarHeight = navbar.offsetHeight;
    let current = '';
    const scrollY = window.scrollY;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - navbarHeight - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollY >= sectionTop && scrollY < sectionBottom) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            const linkId = href.substring(1);
            if (linkId === current) {
                link.classList.add('active');
            }
        }
    });
}

// ===== Mobile Menu =====
function initMobileMenu() {
    const toggler = document.querySelector('.navbar-toggler');
    const collapse = document.querySelector('.navbar-collapse');
    
    if (!toggler || !collapse) return;
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!collapse.contains(e.target) && !toggler.contains(e.target) && collapse.classList.contains('show')) {
            collapse.classList.remove('show');
        }
    });
    
    // Close menu when clicking a nav link
    const navLinks = collapse.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (collapse.classList.contains('show')) {
                collapse.classList.remove('show');
            }
        });
    });
}

// ===== Resume Button =====
function initResumeButton() {
    const resumeBtn = document.getElementById('resumeButton');
    if (resumeBtn) {
        resumeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Resume request sent! I\'ll email you a copy shortly.');
        });
    }
}

// ===== Contact Form =====
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        if (!validateForm(data)) {
            showFormStatus('Please fill all required fields.', 'error');
            return;
        }
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            await simulateFormSubmission(data);
            showFormStatus('Message sent successfully! I\'ll get back to you soon.', 'success');
            form.reset();
        } catch (error) {
            showFormStatus('Something went wrong. Please try again.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

function showFormStatus(message, type) {
    let statusDiv = document.getElementById('formStatus');
    const form = document.getElementById('contactForm');
    
    if (!statusDiv && form) {
        statusDiv = document.createElement('div');
        statusDiv.id = 'formStatus';
        statusDiv.className = 'form-status';
        form.appendChild(statusDiv);
    }
    
    if (statusDiv) {
        const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        statusDiv.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
        // PATCH: Use classList for status coloring if possible, but keep simple toggle for status
        statusDiv.className = `form-status status-${type}`;
        
        setTimeout(() => {
            statusDiv.innerHTML = '';
            statusDiv.className = 'form-status';
        }, 5000);
    }
}

function validateForm(data) {
    return data.name && data.name.trim() !== '' && 
           data.email && data.email.trim() !== '' && 
           isValidEmail(data.email) &&
           data.message && data.message.trim() !== '';
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function simulateFormSubmission(data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Form submitted:', data);
            resolve();
        }, 1500);
    });
}

// ===== Scroll Effects =====
function initScrollEffects() {
    if (!('IntersectionObserver' in window)) return;
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // PATCH: Use classList instead of .style.opacity/transform
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const elements = document.querySelectorAll(
        '.work-card, .about-content, .contact-info, .tools-category, .section-header, .contact-form'
    );
    
    elements.forEach(el => {
        el.classList.add('reveal-on-scroll');
        observer.observe(el);
    });
}

// ===== Skill Bars Animation =====
function initSkillBars() {
    const skillBars = document.querySelectorAll('.progress');
    if (skillBars.length === 0 || !('IntersectionObserver' in window)) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // PATCH: Use classList to trigger width animation defined in CSS
                entry.target.classList.add('animate-progress');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => observer.observe(bar));
}

// ===== Tooltip Effects =====
function initTooltipEffects() {
    const toolItems = document.querySelectorAll('.tool-item, .credential-badge, .social-links a');
    
    toolItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.classList.add('item-hover');
        });
        
        item.addEventListener('mouseleave', function() {
            this.classList.remove('item-hover');
        });
        
        item.addEventListener('touchstart', function(e) {
            this.classList.add('item-hover');
        }, { passive: true });
        
        item.addEventListener('touchend', function() {
            this.classList.remove('item-hover');
        });
    });
}

// ===== Image Fallback Handler =====
function initImageFallback() {
    const fallbackImages = [
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop',
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop'
    ];
    
    function handleBrokenImage(img) {
        // PATCH: Prevent infinite loop if fallback also fails
        if (img.dataset.fallbackAttempted) return;
        img.dataset.fallbackAttempted = "true";
        
        const randomFallback = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
        img.src = randomFallback;
    }
    
    document.querySelectorAll('img').forEach(img => {
        if (img.complete && img.naturalHeight === 0) {
            handleBrokenImage(img);
        } else {
            img.addEventListener('error', function() { handleBrokenImage(this); });
        }
    });
}

// ===== Console Welcome Message =====
function initConsoleWelcome() {
    console.log(`%cShae Padilla Portfolio 🚀`, 'color: #dbaedb; font-size: 16px; font-weight: bold;');
}

// ===== Lazy Loading Images =====
function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
        document.querySelectorAll('img:not([loading])').forEach(img => {
            img.loading = 'lazy';
        });
    }
}

// ===== Handle Window Resize =====
function initResizeHandler() {
    let resizeTimer;
    window.addEventListener('resize', function() {
        document.body.classList.add('resize-animation-stopper');
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            document.body.classList.remove('resize-animation-stopper');
        }, 400);
    });
}

// ===== Prevent zoom on double tap for iOS =====
function initTouchPrevention() {
    document.addEventListener('touchend', function(e) {
        if (e.target.closest('a, button, .btn, .nav-link, .tool-item, .open-modal, .filter-btn')) {
            // Logic handled by specific listeners
        }
    }, { passive: true });
}

// ===== Smooth Scroll for all anchor links =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const target = document.querySelector(href);
            if (target) {
                const navbar = document.querySelector('.navbar');
                const navHeight = navbar ? navbar.offsetHeight : 0;
                window.scrollTo({
                    top: target.offsetTop - navHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== CSS Utility Helper =====
const styleHelper = document.createElement('style');
styleHelper.textContent = `
    .filtered-out { display: none !important; }
    .modal-open { overflow: hidden !important; }
    .reveal-on-scroll { opacity: 0; transform: translateY(30px); transition: all 0.8s ease; }
    .is-visible { opacity: 1 !important; transform: translateY(0) !important; }
    .item-hover { transform: translateY(-5px) scale(1.05) !important; }
    .status-success { color: #dbaedb !important; }
    .status-error { color: #ff6b6b !important; }
    .resize-animation-stopper * { animation: none !important; transition: none !important; }
`;
document.head.appendChild(styleHelper);