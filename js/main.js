// ===== Main JavaScript File =====

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initContactForm();
    initScrollEffects();
    initSkillBars();
    initTooltipEffects();
    initMobileMenu();
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

    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.open-modal');
        if (btn && !btn.classList.contains('disabled')) {
            e.preventDefault();
            currentPath = btn.getAttribute('data-path');
            
            const projectCard = btn.closest('.work-card');
            if (projectCard) {
                const projectTitle = projectCard.querySelector('h3')?.innerText || 'Project Preview';
                const modalTitleElement = document.getElementById('modalTitle');
                if(modalTitleElement) modalTitleElement.innerText = projectTitle;
            }

            iframe.src = currentPath;
            modal.classList.add('active');
            document.body.classList.add('modal-open');
        }
    });

    if(closeModal) {
        closeModal.addEventListener('click', closeModalFunction);
    }

    function closeModalFunction() {
        modal.classList.remove('active');
        if (iframe) iframe.src = ""; 
        document.body.classList.remove('modal-open');
    }

    if(openNewTab) {
        openNewTab.addEventListener('click', () => {
            if (currentPath) window.open(currentPath, '_blank');
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModalFunction();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModalFunction();
    });
}

// ===== Filter Buttons =====
function initFilterButtons() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const workCards = document.querySelectorAll('.work-card');

    if (filterBtns.length === 0) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            workCards.forEach(card => {
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
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateActiveNavLink();
    });
}

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
        if (href && href.substring(1) === current) {
            link.classList.add('active');
        }
    });
}

// ===== Mobile Menu =====
function initMobileMenu() {
    const toggler = document.querySelector('.navbar-toggler');
    const collapse = document.querySelector('.navbar-collapse');
    
    if (!toggler || !collapse) return;
    
    document.addEventListener('click', function(e) {
        if (!collapse.contains(e.target) && !toggler.contains(e.target) && collapse.classList.contains('show')) {
            collapse.classList.remove('show');
        }
    });
    
    collapse.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => collapse.classList.remove('show'));
    });
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
            showFormStatus('Message sent successfully!', 'success');
            form.reset();
        } catch (error) {
            showFormStatus('Something went wrong.', 'error');
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
        form.appendChild(statusDiv);
    }
    
    if (statusDiv) {
        const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        statusDiv.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
        statusDiv.className = `form-status status-${type}`;
        
        setTimeout(() => {
            statusDiv.innerHTML = '';
            statusDiv.className = 'form-status';
        }, 5000);
    }
}

function validateForm(data) {
    return data.name?.trim() && data.email?.trim() && data.message?.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
}

function simulateFormSubmission(data) {
    return new Promise(resolve => setTimeout(resolve, 1500));
}

// ===== Scroll Effects =====
function initScrollEffects() {
    if (!('IntersectionObserver' in window)) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    document.querySelectorAll('.work-card, .about-content, .contact-info, .tools-category, .section-header, .contact-form')
        .forEach(el => {
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
                entry.target.classList.add('animate-progress');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => observer.observe(bar));
}

// ===== Tooltip Effects =====
function initTooltipEffects() {
    document.querySelectorAll('.tool-item, .credential-badge, .social-links a').forEach(item => {
        ['mouseenter', 'touchstart'].forEach(evt => 
            item.addEventListener(evt, () => item.classList.add('item-hover'), {passive: true})
        );
        ['mouseleave', 'touchend'].forEach(evt => 
            item.addEventListener(evt, () => item.classList.remove('item-hover'), {passive: true})
        );
    });
}

// ===== Image Fallback & Utilities =====
function initImageFallback() {
    const fallback = './assets/img1.jpg';
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            if (!this.dataset.fallbackAttempted) {
                this.dataset.fallbackAttempted = "true";
                this.src = fallback;
            }
        });
    });
}

function initConsoleWelcome() {
    console.log(`%cShara Mae Padilla Portfolio 🚀`, 'color: #dbaedb; font-size: 16px; font-weight: bold;');
}

function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
        document.querySelectorAll('img:not([loading])').forEach(img => img.loading = 'lazy');
    }
}

function initResizeHandler() {
    let resizeTimer;
    window.addEventListener('resize', () => {
        document.body.classList.add('resize-animation-stopper');
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => document.body.classList.remove('resize-animation-stopper'), 400);
    });
}

function initTouchPrevention() {
    document.addEventListener('touchend', () => {}, { passive: true });
}

function initResumeButton() {
    const btn = document.getElementById('resumeButton');
    if (btn) btn.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Resume request sent!');
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                window.scrollTo({ top: target.offsetTop - navHeight, behavior: 'smooth' });
            }
        });
    });
}