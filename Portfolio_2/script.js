document.addEventListener('DOMContentLoaded', () => {

    // Console welcome message
    console.log('🎉 Welcome to my portfolio! Thanks for checking out the code!');
    console.log('💻 Built with vanilla HTML, CSS, and JavaScript');
    console.log('🚀 Ready to push to GitHub!');

    /* ======================== */
    /* --- Smooth Scrolling --- */
    /* ======================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    /* ======================== */
    /* --- Parallax Effect --- */
    /* ======================== */
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }

    /* ======================== */
    /* --- Intersection Observer for Animations --- */
    /* ======================== */
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('project-card')) {
                    entry.target.classList.add('fade-in');
                } else if (entry.target.classList.contains('skill-item')) {
                    entry.target.classList.add('scale-in');
                }
            }
        });
    }, observerOptions);

    // Observe all elements we want to animate
    document.querySelectorAll('.project-card, .skill-item').forEach(el => {
        observer.observe(el);
    });

    /* ======================== */
    /* --- Fun Interactivity --- */
    /* ======================== */
    // Add a click counter for the CTA button
    let clickCount = 0;
    const ctaButton = document.querySelector('.cta-button');
    const originalButtonText = ctaButton.textContent;

    if (ctaButton) {
        ctaButton.addEventListener('click', (e) => {
            e.preventDefault();
            clickCount++;
            ctaButton.textContent = `Clicked ${clickCount} times! 🎉`;
            
            setTimeout(() => {
                ctaButton.textContent = originalButtonText;
            }, 2000);
        });
    }

    // Add some sparkle effects when hovering over project cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.background = 'linear-gradient(45deg, #fff, #f8f9ff)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.background = 'white';
        });
    });

});