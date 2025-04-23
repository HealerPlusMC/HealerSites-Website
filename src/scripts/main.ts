/**
      * HealerSites Portfolio - Main JavaScript Controller
      * Handles all front-end interactivity including:
      * - Theme management (light/dark mode)
      * - Responsive navigation
      * - Form submission handling
      * - Scroll behaviors and animations
      * - Enhanced visual effects
      */
document.addEventListener('DOMContentLoaded', () => {
    // 1. INITIALIZATION AND BASIC SETUP
    const currentYear: number = new Date().getFullYear();
    const yearElement: HTMLElement | null = document.getElementById('year');
    if (yearElement) {
      yearElement.textContent = currentYear.toString();
    }

    // 2. THEME MANAGEMENT SYSTEM
    const themeToggle: HTMLElement | null = document.querySelector('.theme-toggle');
    const bodyElement = document.body as HTMLBodyElement;

    const initializeTheme = () => {
      const savedTheme: string = localStorage.getItem('theme') || 'light';
      bodyElement.setAttribute('data-theme', savedTheme);
    };

    const toggleTheme = () => {
      const currentTheme: string = bodyElement.getAttribute('data-theme') || 'light';
      const newTheme: string = currentTheme === 'light' ? 'dark' : 'light';
      bodyElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      bodyElement.style.transition = 'background 0.5s ease';
      setTimeout(() => (bodyElement.style.transition = ''), 500);
    };

    initializeTheme();
    if (themeToggle) {
      themeToggle.addEventListener('click', toggleTheme);
    }

    // 3. RESPONSIVE NAVIGATION SYSTEM
    const hamburgerMenu: HTMLElement | null = document.querySelector('.hamburger');
    const navigationLinks: HTMLElement | null = document.querySelector('.nav-links');
    interface NavigationElements {
      navItems: NodeListOf<HTMLAnchorElement>;
    }

    const navItems: NavigationElements['navItems'] = document.querySelectorAll('.nav-links a');

    const toggleMobileMenu = () => {
      hamburgerMenu?.classList.toggle('active');
      navigationLinks?.classList.toggle('active');
    };

    const closeMobileMenu = () => {
      hamburgerMenu?.classList.remove('active');
      navigationLinks?.classList.remove('active');
    };

    hamburgerMenu?.addEventListener('click', toggleMobileMenu);
    navItems.forEach(item => item.addEventListener('click', closeMobileMenu));

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        closeMobileMenu();
      }
    });

    // 4. CONTACT FORM HANDLING WITH WEB3FORMS
    const contactForm: HTMLFormElement | null = document.getElementById('contactForm') as HTMLFormElement;
    const formStatusMessage: HTMLElement | null = document.getElementById('formMessage');

    if (contactForm && formStatusMessage) {
      let messageTimeout: NodeJS.Timeout;

      const handleFormSubmit = async (event: Event) => {
        event.preventDefault();
        clearTimeout(messageTimeout);

        formStatusMessage.textContent = 'جاري إرسال رسالتك...';
        formStatusMessage.style.display = 'block';
        formStatusMessage.style.color = '#3498db';
        formStatusMessage.style.animation = 'pulse 1s infinite';

        try {
          const formData: FormData = new FormData(contactForm);

          if (!navigator.onLine) {
            throw new Error('لا يوجد اتصال بالإنترنت');
          }

          const response: Response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData,
            headers: { Accept: 'application/json' }
          });

          if (!response.ok) {
            throw new Error(`خطأ HTTP! الحالة: ${response.status}`);
          }

          const responseData: { success: boolean; message?: string } = await response.json();

          if (responseData.success) {
            formStatusMessage.textContent = 'تم إرسال الرسالة بنجاح!';
            formStatusMessage.style.color = 'green';
            formStatusMessage.style.animation = 'none';
            contactForm.reset();
          } else {
            throw new Error(responseData.message || 'فشل إرسال النموذج');
          }
        } catch (error: any) {
          console.error('خطأ في إرسال النموذج:', error);
          let errorMessage: string = 'تم استلام الرسالة! (فشل التأكيد)';
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

    // 5. SCROLL-RELATED FUNCTIONALITIES
    const headerElement: HTMLElement | null = document.querySelector('.header');
    window.addEventListener('scroll', () => {
      if (headerElement) {
        headerElement.classList.toggle('scrolled', window.scrollY > 100);
      }
    });

    const backToTopButton: HTMLAnchorElement | null = document.querySelector('.back-to-top');
    window.addEventListener('scroll', () => {
      if (backToTopButton) {
        backToTopButton.classList.toggle('active', window.pageYOffset > 300);
      }
    });

    backToTopButton?.addEventListener('click', (e: Event) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    (document.querySelectorAll('a[href^="#"]') as NodeListOf<HTMLAnchorElement>).forEach(anchor => {
      anchor.addEventListener('click', function (e: Event) {
        e.preventDefault();
        const targetId: string = this.getAttribute('href')!;
        if (targetId === '#') return;

        const targetElement: HTMLElement | null = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - clamp(60, 10, 100),
            behavior: 'smooth'
          });
        }
      });
    });

    // 6. ANIMATIONS AND VISUAL EFFECTS
    const animateSkillBars = () => {
      const skillBars: NodeListOf<HTMLElement> = document.querySelectorAll('.skill-level');
      skillBars.forEach(bar => {
        const targetWidth: string = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
          bar.style.width = targetWidth;
          bar.style.transition = 'width 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        }, 100);
      });
    };

    const setupIntersectionObserver = () => {
      const observer: IntersectionObserver = new IntersectionObserver(
        (entries: IntersectionObserverEntry[]) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate__visible');
              if (entry.target.classList.contains('about-content')) {
                animateSkillBars();
              }
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );

      document.querySelectorAll('.about-content').forEach(el => observer.observe(el));
    };

    setupIntersectionObserver();

    const addTouchSupport = () => {
      const hoverElements: NodeListOf<HTMLElement> = document.querySelectorAll('.btn, .social-links a');
      hoverElements.forEach(el => {
        el.addEventListener('touchstart', () => el.classList.add('hover'), { passive: true });
        el.addEventListener('touchend', () => el.classList.remove('hover'), { passive: true });
      });
    };

    addTouchSupport();
  });

  function clamp(min: number, val: number, max: number): number {
    return Math.min(Math.max(val, min), max);
  }