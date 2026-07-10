/* ==========================================================================
   RA&MTECH — Shared site script (loaded with `defer` on every page)
   --------------------------------------------------------------------------
   1. Navbar (mobile menu, dropdown, scrolled state, active link)
   2. Scroll-reveal animations (.reveal → .in-view)
   3. Cookie consent banner (injected + wired to Google Consent Mode)
   4. Email forms (any <form data-email-form> — EmailJS + GA4 event)
   ========================================================================== */
(function () {
    'use strict';

    /* ------------------------------------------------------------------
       1. NAVBAR
    ------------------------------------------------------------------ */
    function initNav() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        // Mobile hamburger
        const menuToggle = navbar.querySelector('.menu-toggle');
        menuToggle?.addEventListener('click', () => {
            const open = navbar.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', String(open));
        });

        // Dropdown (click toggles on all sizes; hover handled by CSS on desktop)
        const dropdown = navbar.querySelector('.dropdown');
        const dropdownToggle = navbar.querySelector('.dropdown-toggle');
        dropdownToggle?.addEventListener('click', (e) => {
            e.preventDefault();
            const active = dropdown.classList.toggle('active');
            dropdownToggle.setAttribute('aria-expanded', String(active));
        });

        // Close menus when clicking outside
        document.addEventListener('click', (e) => {
            if (dropdown && !dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
                dropdownToggle?.setAttribute('aria-expanded', 'false');
            }
            if (window.innerWidth <= 768 && !navbar.contains(e.target)) {
                navbar.classList.remove('open');
                menuToggle?.setAttribute('aria-expanded', 'false');
            }
        });

        // Reset mobile menu when resizing up to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) navbar.classList.remove('open');
        });

        // Solid navbar once the page is scrolled
        const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 10);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        // Highlight the current page in the nav.
        // Uses a.pathname (browser-resolved), so relative links work at any
        // folder depth — locally with Live Server or live on the domain.
        const path = location.pathname.replace(/\/+$/, '') || '/';
        navbar.querySelectorAll('.nav-links a').forEach((a) => {
            if (a.hash) return; // skip #home / #services anchors
            const href = a.pathname.replace(/\/+$/, '') || '/';
            if (href === path) a.classList.add('active');
        });
    }

    /* ------------------------------------------------------------------
       2. SCROLL-REVEAL
    ------------------------------------------------------------------ */
    function initReveal() {
        const els = document.querySelectorAll('.reveal');
        if (!els.length) return;

        if (!('IntersectionObserver' in window)) {
            els.forEach((el) => el.classList.add('in-view'));
            return;
        }

        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        els.forEach((el) => io.observe(el));
    }

    /* ------------------------------------------------------------------
       3. COOKIE CONSENT BANNER
       Injected by JS so every page gets it without duplicate markup.
    ------------------------------------------------------------------ */
    function initConsent() {
        const KEY = 'ra_consent_choice'; // 'granted' | 'denied'
        if (localStorage.getItem(KEY)) return; // choice already made

        const banner = document.createElement('div');
        banner.className = 'consent-banner';
        banner.innerHTML =
            '<div class="consent-inner">' +
            '<p>We use cookies to improve your experience and analyze site traffic. ' +
            'By accepting, you consent to our use of cookies.</p>' +
            '<div class="consent-actions">' +
            '<button type="button" class="consent-btn accept">Accept</button>' +
            '<button type="button" class="consent-btn reject">Reject</button>' +
            '</div></div>';
        document.body.appendChild(banner);

        const setConsent = (choice) => {
            localStorage.setItem(KEY, choice);
            if (typeof window.gtag === 'function') {
                window.gtag('consent', 'update', {
                    analytics_storage: choice,
                    ad_storage: 'denied',
                    ad_user_data: 'denied',
                    ad_personalization: 'denied'
                });
            }
            banner.remove();
        };

        banner.querySelector('.accept').addEventListener('click', () => setConsent('granted'));
        banner.querySelector('.reject').addEventListener('click', () => setConsent('denied'));
    }

    /* ------------------------------------------------------------------
       4. EMAIL FORMS (EmailJS)
       Any <form data-email-form> is wired automatically. Optional attributes:
         data-event="waitlist_signup"   GA4 event name (default: email_signup)
         data-success="Thanks!"         success message
       Requires the EmailJS CDN script on the page.
    ------------------------------------------------------------------ */
    const EMAILJS_PUBLIC_KEY = '1St8aSSLxAAWWK4nc';
    const EMAILJS_SERVICE = 'service_359kggr';
    const EMAILJS_TEMPLATE_USER = 'template_z9vh42q';
    const EMAILJS_TEMPLATE_ADMIN = 'template_e8n4jdl';

    function initEmailForms() {
        const forms = document.querySelectorAll('form[data-email-form]');
        if (!forms.length) return;

        if (window.emailjs && typeof emailjs.init === 'function') {
            emailjs.init(EMAILJS_PUBLIC_KEY);
        }

        forms.forEach((form) => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                if (!form.checkValidity()) {
                    form.reportValidity();
                    return;
                }

                const email = form.querySelector('input[type="email"]')?.value.trim();
                const status = form.querySelector('.form-status');
                const button = form.querySelector('button[type="submit"]');
                if (!email) return;

                const showStatus = (msg, ok) => {
                    if (!status) return;
                    status.textContent = msg;
                    status.classList.remove('success', 'error');
                    status.classList.add(ok ? 'success' : 'error');
                };

                if (!window.emailjs) {
                    showStatus('Oops! Something went wrong. Please try again.', false);
                    return;
                }

                button && (button.disabled = true);
                const params = { email: email };

                emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE_USER, params)
                    .then(() => emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE_ADMIN, params))
                    .then(() => {
                        if (typeof window.gtag === 'function') {
                            window.gtag('event', form.dataset.event || 'email_signup', {
                                method: 'emailjs',
                                page_location: window.location.href,
                                page_title: document.title
                            });
                        }
                        showStatus(form.dataset.success || "Thank you! We'll be in touch shortly.", true);
                        form.reset();
                    })
                    .catch((err) => {
                        console.error('EmailJS error:', err);
                        showStatus('Oops! Something went wrong. Please try again.', false);
                    })
                    .finally(() => {
                        button && (button.disabled = false);
                    });
            });
        });
    }

    /* ------------------------------------------------------------------
       5. WAVE TEXT (.wave-text)
       Tracks the cursor over wave headlines so the blue wave layer parts
       around the mouse (see .wave-text in style.css). The wave animation
       itself is pure CSS and never stops.
    ------------------------------------------------------------------ */
    function initWaveText() {
        document.querySelectorAll('.wave-text').forEach((el) => {
            el.addEventListener('mousemove', (e) => {
                const r = el.getBoundingClientRect();
                el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
                el.style.setProperty('--my', (e.clientY - r.top) + 'px');
            });
            el.addEventListener('mouseleave', () => {
                el.style.setProperty('--mx', '-999px');
                el.style.setProperty('--my', '-999px');
            });
        });
    }

    /* ------------------------------------------------------------------
       INIT
    ------------------------------------------------------------------ */
    function init() {
        initNav();
        initReveal();
        initConsent();
        initEmailForms();
        initWaveText();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
