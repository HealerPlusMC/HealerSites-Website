/**
 * HealerSites Portfolio - Main JavaScript Controller
 * Handles all front-end interactivity including:
 * - Theme management (light/dark mode)
 * - Responsive navigation
 * - Form submission handling
 * - Scroll behaviors and animations
 * - Enhanced visual effects
 */

document.addEventListener('DOMContentLoaded', function() {
    // ===========================================
    // 1. INITIALIZATION AND BASIC SETUP
    // ===========================================
    
    // Set current year in footer copyright
    const currentYear = new Date().getFullYear();
    document.getElementById('year').textContent = currentYear;

    // ===========================================
    // 2. THEME MANAGEMENT SYSTEM
    // ===========================================
    const themeToggle = document.querySelector('.theme-toggle');
    const bodyElement = document.body;

    // Initialize theme from localStorage or default to light
    const initializeTheme = () => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        bodyElement.setAttribute('data-theme', savedTheme);
    };

    // Toggle between light and dark themes
    const toggleTheme = () => {
        const currentTheme = bodyElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        bodyElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        // Trigger animation on theme toggle
        bodyElement.style.transition = 'background 0.5s ease';
        setTimeout(() => bodyElement.style.transition = '', 500);
    };

    // Initialize and set up event listener
    initializeTheme();
    themeToggle.addEventListener('click', toggleTheme);

    // ===========================================
    // 3. RESPONSIVE NAVIGATION SYSTEM
    // ===========================================
    const hamburgerMenu = document.querySelector('.hamburger');
    const navigationLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    // Toggle mobile menu visibility
    const toggleMobileMenu = () => {
        hamburgerMenu.classList.toggle('active');
        navigationLinks.classList.toggle('active');
    };

    // Close mobile menu when a link is clicked
    const closeMobileMenu = () => {
        hamburgerMenu.classList.remove('active');
        navigationLinks.classList.remove('active');
    };

    // Set up event listeners
    hamburgerMenu.addEventListener('click', toggleMobileMenu);
    navItems.forEach(item => item.addEventListener('click', closeMobileMenu));

    // Close mobile menu on resize if screen is large
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });

    // ===========================================
    // 4. CONTACT FORM HANDLING WITH WEB3FORMS
    // ===========================================
    const contactForm = document.getElementById('contactForm');
    const formStatusMessage = document.getElementById('formMessage');

    if (contactForm) {
        let messageTimeout;

        const handleFormSubmit = async (event) => {
            event.preventDefault();
            clearTimeout(messageTimeout);

            formStatusMessage.textContent = 'جاري إرسال رسالتك...';
            formStatusMessage.style.display = 'block';
            formStatusMessage.style.color = '#3498db';
            formStatusMessage.style.animation = 'pulse 1s infinite';

            try {
                const formData = new FormData(contactForm);
                
                if (!navigator.onLine) {
                    throw new Error('لا يوجد اتصال بالإنترنت');
                }

                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (!response.ok) {
                    throw new Error(`خطأ HTTP! الحالة: ${response.status}`);
                }

                const responseData = await response.json();

                if (responseData.success) {
                    formStatusMessage.textContent = 'تم إرسال الرسالة بنجاح!';
                    formStatusMessage.style.color = 'green';
                    formStatusMessage.style.animation = 'none';
                    contactForm.reset();
                } else {
                    throw new Error(responseData.message || 'فشل إرسال النموذج');
                }
            } catch (error) {
                console.error('خطأ في إرسال النموذج:', error);
                let errorMessage = 'تم استلام الرسالة! (فشل التأكيد)';
                if (error.message.includes('internet')) {
                    errorMessage = 'خطأ في الشبكة - يرجى التحقق من اتصالك';
                }
                formStatusMessage.textContent = errorMessage;
                formStatusMessage.style.color = 'orange';
                formStatusMessage.style.animation = 'none';
            } finally {
                messageTimeout = setTimeout(() => {
                    formStatusMessage.style.display = 'none';
                    formStatusMessage.style.animation = 'none';
                }, 5000);
            }
        };

        contactForm.addEventListener('submit', handleFormSubmit);
    }

    // ===========================================
    // 5. SCROLL-RELATED FUNCTIONALITIES
    // ===========================================
    
    // Sticky header on scroll
    const headerElement = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        headerElement.classList.toggle('scrolled', window.scrollY > 100);
    });

    // Back-to-top button functionality
    const backToTopButton = document.querySelector('.back-to-top');
    window.addEventListener('scroll', () => {
        backToTopButton.classList.toggle('active', window.pageYOffset > 300);
    });

    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - clamp(60, 10, 100),
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===========================================
    // 6. ANIMATIONS AND VISUAL EFFECTS
    // ===========================================
    
    // Skill bar animations
    const animateSkillBars = () => {
        const skillBars = document.querySelectorAll('.skill-level');
        skillBars.forEach(bar => {
            const targetWidth = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => {
                bar.style.width = targetWidth;
                bar.style.transition = 'width 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            }, 100);
        });
    };

    // Intersection Observer for scroll animations
    const setupIntersectionObserver = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate__visible');
                    if (entry.target.classList.contains('about-content')) {
                        animateSkillBars();
                    }
                    if (entry.target.classList.contains('service-card') || entry.target.classList.contains('portfolio-item')) {
                        entry.target.style.animation = 'float 3s infinite';
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        document.querySelectorAll('.service-card, .portfolio-item, .about-content').forEach(el => observer.observe(el));
    };

    // Initialize animations
    setupIntersectionObserver();

    // Add touch support for hover effects on mobile
    const addTouchSupport = () => {
        const hoverElements = document.querySelectorAll('.btn, .service-card, .portfolio-item, .social-links a');
        hoverElements.forEach(el => {
            el.addEventListener('touchstart', () => el.classList.add('hover'), { passive: true });
            el.addEventListener('touchend', () => el.classList.remove('hover'), { passive: true });
        });
    };

    addTouchSupport();
});

// Utility function to clamp values
function clamp(min, val, max) {
    return Math.min(Math.max(val, min), max);
}