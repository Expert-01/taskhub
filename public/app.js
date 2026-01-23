   // Mobile Menu Toggle
    document.addEventListener('DOMContentLoaded', () => {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileNav = document.getElementById('mobileNav');
        let overlay = null;

        // Create overlay element
        function createOverlay() {
            overlay = document.createElement('div');
            overlay.className = 'mobile-nav-overlay';
            overlay.addEventListener('click', closeMobileMenu);
            document.body.appendChild(overlay);
        }

        // Toggle mobile menu
        function toggleMobileMenu() {
            const isActive = mobileNav.classList.contains('active');
            
            if (isActive) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        }

        // Open mobile menu
        function openMobileMenu() {
            if (!overlay) createOverlay();
            
            mobileMenuBtn.classList.add('active');
            mobileNav.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        }

        // Close mobile menu
        function closeMobileMenu() {
            mobileMenuBtn.classList.remove('active');
            mobileNav.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }

        // Event listener for menu button
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        }

        // Close menu when clicking on a nav link
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
                closeMobileMenu();
            }
        });

    });



//Animations

  const faders = document.querySelectorAll('.fade-in');

  const appearOptions = {
    threshold: 0.2,
  };

  const appearOnScroll = new IntersectionObserver(function (
    entries,
    observer
  ) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    });
  },
  appearOptions);

  faders.forEach(fader => {
    appearOnScroll.observe(fader);
  });


// Parallax Scroll Effect
document.addEventListener('DOMContentLoaded', () => {
  const parallaxContainer = document.getElementById('parallaxContainer');
  const parallaxBg = document.querySelector('.parallax-bg');
  const parallaxContent = document.querySelector('.parallax-content');

  if (parallaxContainer && parallaxBg && parallaxContent) {
    window.addEventListener('scroll', () => {
      const scrollPosition = window.scrollY;
      const containerPosition = parallaxContainer.getBoundingClientRect().top + scrollPosition;
      const elementPosition = scrollPosition - (containerPosition - window.innerHeight);
      
      // Background moves slower (parallax effect)
      parallaxBg.style.transform = `translateY(${elementPosition * 0.5}px)`;
      
      // Content fades in/out and scales based on scroll
      const fadeAmount = Math.min(Math.max(elementPosition / 200, 0), 1);
      parallaxContent.style.opacity = fadeAmount * 0.5;
      parallaxContent.style.transform = `translateY(${-elementPosition * 0.3}px) scale(${0.8 + fadeAmount * 0.2})`;
    });
  }
});