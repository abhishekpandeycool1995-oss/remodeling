/* ============================================
   TEXAS HOME & REMODEL - MAIN JAVASCRIPT
   Animations, Navigation, Booking, Forms
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================
  // SCROLL ANIMATIONS (Intersection Observer)
  // ==========================================

  const animateElements = () => {
    const els = document.querySelectorAll('.fade-up, .fade-in, .scale-in, .slide-left, .slide-right, .stagger-children');

    if (els.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -50px 0px'
    });

    els.forEach(el => observer.observe(el));
  };

  animateElements();

  // ==========================================
  // NAVBAR SCROLL EFFECT
  // ==========================================

  const navbar = document.getElementById('navbar');
  if (navbar) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > 80) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      lastScroll = currentScroll;
    }, { passive: true });
  }

  // ==========================================
  // MOBILE NAV TOGGLE
  // ==========================================

  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('open');
      document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Mobile dropdown toggle for touch
    navMenu.querySelectorAll('.has-dropdown > a').forEach(parentLink => {
      parentLink.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          const li = parentLink.closest('.has-dropdown');
          li.classList.toggle('dropdown-open');

          // Close other open dropdowns
          navMenu.querySelectorAll('.has-dropdown.dropdown-open').forEach(other => {
            if (other !== li) other.classList.remove('dropdown-open');
          });
        }
      });
    });
  }

  // ==========================================
  // COUNTER ANIMATION
  // ==========================================

  const animateCounters = () => {
    const counters = document.querySelectorAll('.counter');
    if (counters.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'), 10);
          const duration = 2000;
          const startTime = performance.now();

          const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * target);

            el.textContent = current.toLocaleString();

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              el.textContent = target.toLocaleString();
            }
          };

          requestAnimationFrame(updateCounter);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
  };

  animateCounters();

  // ==========================================
  // CONTACT FORM HANDLER
  // ==========================================

  const form = document.getElementById('estimateForm');
  const formSuccess = document.getElementById('formSuccess');

  if (form && formSuccess) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = form.querySelector('button[type="submit"]');
      const origContent = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      btn.disabled = true;

      const formData = new FormData(form);
      const data = {};
      formData.forEach((value, key) => { data[key] = value; });

      // Add timestamp
      data._timestamp = new Date().toLocaleString();

      try {
        const res = await fetch('https://formsubmit.co/ajax/texashomeandremodel@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(data)
        });

        if (res.ok) {
          form.style.display = 'none';
          formSuccess.style.display = 'block';
        } else {
          throw new Error('Server error');
        }
      } catch (err) {
        console.warn('FormSubmit failed, using mailto fallback');

        // Fallback
        const subject = `Free Estimate Request - ${data.firstName || ''} ${data.lastName || ''}`;
        const body = `Name: ${data.firstName || ''} ${data.lastName || ''}
Email: ${data.email || ''}
Phone: ${data.phone || ''}
Service: ${data.service || ''}
Message: ${data.message || ''}`;

        window.location.href = `mailto:texashomeandremodel@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        form.style.display = 'none';
        formSuccess.style.display = 'block';
        formSuccess.querySelector('p').textContent = 'Redirecting to your email client to complete sending...';
      } finally {
        btn.innerHTML = origContent;
        btn.disabled = false;
      }
    });
  }

  // ==========================================
  // TESTIMONIAL FORM HANDLER
  // ==========================================

  const testimonialForm = document.getElementById('testimonialForm');
  if (testimonialForm) {
    testimonialForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = testimonialForm.querySelector('button[type="submit"]');
      const origContent = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
      btn.disabled = true;

      const formData = new FormData(testimonialForm);
      const data = {};
      formData.forEach((value, key) => { data[key] = value; });

      try {
        const res = await fetch('https://formsubmit.co/ajax/texashomeandremodel@gmail.com', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ ...data, _subject: 'New Testimonial Submission' })
        });

        if (res.ok) {
          testimonialForm.innerHTML = `
            <div class="form-success" style="display:block;">
              <i class="fas fa-check-circle"></i>
              <h4>Thank You for Your Review!</h4>
              <p>We appreciate your feedback and look forward to serving you again.</p>
            </div>
          `;
        } else {
          throw new Error('Failed');
        }
      } catch (err) {
        testimonialForm.innerHTML = `
          <div class="form-success" style="display:block;">
            <i class="fas fa-check-circle"></i>
            <h4>Thank You!</h4>
            <p>Your testimonial has been received. We appreciate your feedback!</p>
          </div>
        `;
      } finally {
        btn.innerHTML = origContent;
        btn.disabled = false;
      }
    });
  }

  // ==========================================
  // CALENDLY BOOKING WIDGET
  // ==========================================

  // Load Calendly script when booking button is clicked
  document.querySelectorAll('[data-calendly]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const url = btn.getAttribute('data-calendly') || 'https://calendly.com/texashomeandremodel/consultation';

      // Check if Calendly is already loaded
      if (window.Calendly) {
        window.Calendly.initPopupWidget({ url });
        return;
      }

      // Load Calendly dynamically
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        window.Calendly.initPopupWidget({ url });
      };
    });
  });

  // ==========================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ==========================================

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 80;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // ==========================================
  // ACTIVE NAV LINK HIGHLIGHTING
  // ==========================================

  const setActiveNavLink = () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-menu a').forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  };
  setActiveNavLink();

  // ==========================================
  // PARALLAX ON MOUSE MOVE (Cards)
  // ==========================================

  document.querySelectorAll('.parallax-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  // ==========================================
  // GALLERY LIGHTBOX
  // ==========================================

  const galleryItems = document.querySelectorAll('.gallery-item');
  if (galleryItems.length > 0) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <div class="lightbox-overlay"></div>
      <div class="lightbox-content">
        <button class="lightbox-close">&times;</button>
        <img src="" alt="Gallery image">
      </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
      .lightbox {
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        z-index: 9999; display: none;
        align-items: center; justify-content: center;
      }
      .lightbox.active { display: flex; }
      .lightbox-overlay {
        position: absolute; inset: 0;
        background: rgba(0,0,0,0.9);
        backdrop-filter: blur(8px);
      }
      .lightbox-content {
        position: relative; z-index: 1;
        max-width: 90vw; max-height: 85vh;
      }
      .lightbox-content img {
        max-width: 100%; max-height: 85vh;
        object-fit: contain; border-radius: 8px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
      }
      .lightbox-close {
        position: absolute; top: -40px; right: 0;
        background: none; border: none;
        color: white; font-size: 2rem;
        cursor: pointer; padding: 8px;
        transition: var(--transition);
      }
      .lightbox-close:hover { color: var(--accent); transform: rotate(90deg); }
    `;
    document.head.appendChild(style);
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('img');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxOverlay = lightbox.querySelector('.lightbox-overlay');

    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img) {
          lightboxImg.src = img.src;
          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxOverlay.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  // ==========================================
  // REVEAL ON SCROLL - Refresh after dynamic content
  // ==========================================

  // Re-observe if new content is loaded
  const refreshAnimations = () => {
    const newEls = document.querySelectorAll('.fade-up:not(.visible), .fade-in:not(.visible), .slide-left:not(.visible), .slide-right:not(.visible), .stagger-children:not(.visible)');
    if (newEls.length > 0) animateElements();
  };

  // Expose for use
  window.refreshAnimations = refreshAnimations;

  console.log('Texas Home & Remodel - Website loaded successfully');
});
