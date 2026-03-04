// ===== Main JavaScript File =====

// Add this to your init list at the top
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initContactForm();
    initScrollEffects();
    initSkillBars();
    initTooltipEffects();
    initMobileMenu();
    initParallaxEffect();
    initProjectModal(); // Added this
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
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            workCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    // Re-trigger scroll effects for visible cards
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 2. Modal Launch Logic
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.open-modal');
        if (btn) {
            currentPath = btn.getAttribute('data-path');
            
            // Set Modal Title based on the card's H3
            const projectTitle = btn.closest('.work-card').querySelector('h3').innerText;
            const modalTitleElement = document.getElementById('modalTitle');
            if(modalTitleElement) modalTitleElement.innerText = projectTitle;

            iframe.src = currentPath;
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; 
        }
    });

    // 3. Close & External Link Logic
    if(closeModal) {
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
            iframe.src = ""; 
            document.body.style.overflow = 'auto';
        });
    }

    if(openNewTab) {
        openNewTab.addEventListener('click', () => {
            window.open(currentPath, '_blank');
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal.click();
    });
}


// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initContactForm();
    initScrollEffects();
    initSkillBars();
    initTooltipEffects();
    initMobileMenu();
    initParallaxEffect();
});

// ===== Navigation =====
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
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
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    navbarCollapse.classList.remove('show');
                }
            }
        });
    });
}

// Update active navigation link
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - navbarHeight - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href').substring(1);
        if (href === current) {
            link.classList.add('active');
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
    }
}

// ===== Contact Form =====
function initContactForm() {
    const form = document.getElementById('contactForm');
    const statusDiv = document.getElementById('formStatus');
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (!validateForm(data)) {
                statusDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please fill all required fields.';
                statusDiv.style.color = '#dbaedb';
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
                
                statusDiv.innerHTML = '<i class="fas fa-check-circle"></i> Message sent successfully! I\'ll get back to you soon.';
                statusDiv.style.color = '#dbaedb';
                
                form.reset();
                
                setTimeout(() => {
                    statusDiv.innerHTML = '';
                }, 5000);
                
            } catch (error) {
                statusDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> Something went wrong. Please try again.';
                statusDiv.style.color = '#dbaedb';
                
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

// Validate form
function validateForm(data) {
    return data.name && data.email && data.message;
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
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Get the target width from the style attribute
                const bar = entry.target;
                const width = bar.style.width;
                
                // Reset width to 0 then animate
                bar.style.width = '0';
                
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
        });
        
        item.addEventListener('touchend', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// ===== Parallax Effect =====
function initParallaxEffect() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        
        if (hero) {
            // Parallax effect for hero section
            hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
        }
    });
}

// ===== Smooth Scroll for all anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        if (this.getAttribute('href') !== '#') {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ===== Console Welcome Message =====
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

// ===== Lazy Loading Images =====
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.loading = 'lazy';
    });
}

// ===== Handle Window Resize =====
let resizeTimer;
window.addEventListener('resize', function() {
    document.body.classList.add('resize-animation-stopper');
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        document.body.classList.remove('resize-animation-stopper');
    }, 400);
});

// ===== Prevent zoom on double tap for iOS =====
document.addEventListener('touchend', function(e) {
    if (e.target.closest('a, button, .btn, .nav-link, .tool-item')) {
        e.preventDefault();
    }
}, { passive: false });

document.addEventListener('DOMContentLoaded', () => {
    // 1. SELECT ELEMENTS
    const modal = document.getElementById('projectModal');
    const iframe = document.getElementById('projectFrame');
    const closeModal = document.getElementById('closeModal');
    const openNewTab = document.getElementById('openNewTab');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const workCards = document.querySelectorAll('.work-card');
    let currentPath = "";

    // 2. CATEGORY FILTERING LOGIC
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            workCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 3. MODAL LAUNCH LOGIC
    // We use event delegation to ensure even dynamic buttons work
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.open-modal');
        if (btn) {
            currentPath = btn.getAttribute('data-path');
            console.log("Launching:", currentPath); // Check your console (F12) to see if this fires
            
            iframe.src = currentPath;
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        }
    });

    // 4. CLOSE MODAL LOGIC
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        iframe.src = ""; // This kills the process/audio in the iframe
        document.body.style.overflow = 'auto';
    });

    // 5. OPEN IN NEW TAB LOGIC
    openNewTab.addEventListener('click', () => {
        window.open(currentPath, '_blank');
    });

    // Close on click outside the container
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal.click();
    });
});