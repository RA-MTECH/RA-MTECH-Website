(function () {
    function init() {
        // Mobile dropdown toggle
        const dropdownToggle = document.querySelector('.dropdown-toggle');
        const dropdown = document.querySelector('.dropdown');

        if (dropdownToggle && dropdown) {
            dropdownToggle.addEventListener('click', function (e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', function (e) {
            if (dropdown && !dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });

        // Handle window resize
        window.addEventListener('resize', function () {
            if (window.innerWidth > 768 && dropdown) {
                dropdown.classList.remove('active');
            }
        });

        // Fade-in on scroll (IntersectionObserver)
        const revealEls = document.querySelectorAll('.reveal');
        if (revealEls.length) {
            const io = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('in-view');
                            io.unobserve(entry.target); // animate once, then stay
                        }
                    });
                },
                { threshold: 0.15 }
            );
            revealEls.forEach((el) => io.observe(el));
        }

        // Book-a-pilot form handling + gtag
        const pilotForm = document.getElementById('cs-pilot-form');
        if (pilotForm) {
            const successEl = pilotForm.querySelector('.success-message');
            pilotForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                // Basic email validation using browser's built-in checks
                if (!pilotForm.checkValidity()) {
                    pilotForm.reportValidity();
                    return;
                }

                const emailInput = pilotForm.querySelector('input[type="email"]');
                const email = emailInput?.value?.trim();

                // Fire analytics event if gtag/GTMs are present
                if (typeof window.gtag === 'function') {
                    window.gtag('event', 'pilot_signup', {
                        event_category: 'engagement',
                        event_label: 'case_study',
                        value: 1,
                        email_provided: !!email
                    });
                }
                if (Array.isArray(window.dataLayer)) {
                    window.dataLayer.push({
                        event: 'pilot_signup',
                        form_location: 'case_study',
                        email_present: !!email
                    });
                }

                // TODO: Integrate backend/API call here to actually submit the email
                // For now, show success and clear
                if (successEl) {
                    successEl.style.display = 'block';
                }
                pilotForm.reset();
            });
        }
    }

    // Ensure init runs even if script is injected after DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();