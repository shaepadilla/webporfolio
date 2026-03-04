// ===== Main JavaScript File =====

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initContactForm();
    initScrollEffects();
    initSkillBars();
    initTooltipEffects();
    initMobileMenu();
    initParallaxEffect();
    initProjectModal();
    initImageFallback();
    initConsoleWelcome();
    initLazyLoading();
    initResizeHandler();
    initTouchPrevention();
});

// ===== Project Modal & Filtering =====
function initProjectModal() {
    const modal = document.getElementById('projectModal');
    const iframe = document.getElementById('projectFrame');
    const closeModal = document.getElementById('closeModal');
    const openNewTab = document.getElementById('openNewTab');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const workCards = document.querySelectorAll('.work-card');
    let currentPath = "";

    // 1. Category Filtering Logic
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filterValue = btn.getAttribute('data-filter');
                
                workCards.forEach(card => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'block';
                        // Re-trigger scroll effects for visible cards
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 100);
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // 2. Modal Launch Logic
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

            if (iframe) {
                iframe.src = currentPath;
            }
            
            if (modal) {
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        }
    });

    // 3. Close & External Link Logic
    if(closeModal) {
        closeModal.addEventListener('click', () => {
            if (modal) modal.style.display = 'none';
            if (iframe) iframe.src = ""; 
            document.body.style.overflow = 'auto';
        });
    }

    if(openNewTab) {
        openNewTab.addEventListener('click', () => {
            if (currentPath) {
                window.open(currentPath, '_blank');
            }
        });
    }

    // Close on click outside
    if (modal) {
        window.addEventListener('click', (e) => {
            if (e.target === modal && closeModal) {
                closeModal.click();
            }
        });

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex' && closeModal) {
                closeModal.click();
            }
        });
    }
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
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - navbarHeight - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        const scrollY = window.scrollY;
        
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
    
    if (toggler && collapse) {
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
}

// ===== Contact Form =====
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (!validateForm(data)) {
                showFormStatus('Please fill all required fields.', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            try {
                // Simulate form submission
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
}

// Show form status message
function showFormStatus(message, type) {
    // Check if status div exists, if not create it
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
        statusDiv.style.color = type === 'success' ? '#dbaedb' : '#ff6b6b';
        
        setTimeout(() => {
            statusDiv.innerHTML = '';
        }, 5000);
    }
}

// Validate form
function validateForm(data) {
    return data.name && data.name.trim() !== '' && 
           data.email && data.email.trim() !== '' && 
           isValidEmail(data.email) &&
           data.message && data.message.trim() !== '';
}

// Email validation
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Simulate form submission
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
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for fade-in effect
    const elements = document.querySelectorAll(
        '.work-card, .about-content, .contact-info, .tools-category, .section-header, .contact-form'
    );
    
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });
}

// ===== Skill Bars Animation =====
function initSkillBars() {
    const skillBars = document.querySelectorAll('.progress');
    
    if (skillBars.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Get the target width from the style attribute
                const bar = entry.target;
                const width = bar.style.width;
                
                // Reset width to 0 then animate
                bar.style.width = '0';
                bar.style.transition = 'width 1s ease';
                
                setTimeout(() => {
                    bar.style.width = width;
                }, 200);
                
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => {
        observer.observe(bar);
    });
}

// ===== Tooltip Effects =====
function initTooltipEffects() {
    const toolItems = document.querySelectorAll('.tool-item, .credential-badge, .social-links a');
    
    toolItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.05)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Touch support
        item.addEventListener('touchstart', function(e) {
            e.preventDefault();
            this.style.transform = 'translateY(-5px) scale(1.05)';
        }, { passive: false });
        
        item.addEventListener('touchend', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// ===== Parallax Effect =====
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    
    if (!hero) return;
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        // Parallax effect for hero section
        hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
    });
}

// ===== Image Fallback Handler =====
function initImageFallback() {
    function handleBrokenImage(img) {
        // Replace with a fallback image using a reliable CDN
        img.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop';
        img.alt = 'Project placeholder image';
        console.log('Replaced broken image with fallback');
    }
    
    // Check all images
    document.querySelectorAll('img').forEach(img => {
        if (img.complete && img.naturalHeight === 0) {
            handleBrokenImage(img);
        } else {
            img.onerror = function() {
                handleBrokenImage(this);
            };
        }
    });
}

// ===== Console Welcome Message =====
function initConsoleWelcome() {
    console.log(`
%c╔══════════════════════════════════════╗
%c║     Shae Padilla Portfolio 🚀        ║
%c╠══════════════════════════════════════╣
%c║  MERN Stack Developer                ║
%c║  Based in Philippines 🇵🇭            ║
%c║                                      ║
%c║  Let's connect!                      ║
%c║  📧 shaepadilla5@gmail.com           ║
%c╚══════════════════════════════════════╝
`, 
    'color: #dbaedb; font-size: 14px; font-weight: bold;',
    'color: white; font-size: 14px; font-weight: bold;',
    'color: #dbaedb; font-size: 14px;',
    'color: white; font-size: 12px;',
    'color: white; font-size: 12px;',
    'color: #dbaedb; font-size: 12px;',
    'color: white; font-size: 12px;',
    'color: #dbaedb; font-size: 12px;',
    'color: #dbaedb; font-size: 14px;'
    );
}

// ===== Lazy Loading Images =====
function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img:not([loading])');
        images.forEach(img => {
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
        if (e.target.closest('a, button, .btn, .nav-link, .tool-item, .open-modal')) {
            e.preventDefault();
        }
    }, { passive: false });
}

// ===== Smooth Scroll for all anchor links (fallback) =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '') {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navbar = document.querySelector('.navbar');
                const navHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = target.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});