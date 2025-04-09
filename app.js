// GSAP Animations will be initialized here

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed. Ready for GSAP!");

    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger, Draggable, ScrollToPlugin);

    // Run injection first IF on a legal page
    // injectSharedElements();

    // Attach listeners needed on ALL pages (like mobile menu)
    attachMobileMenuListener();

    // Attach smooth scroll ONLY if NOT on a legal page
    // if (!document.querySelector('.legal-container')) { ... }
    const navLinksAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
    navLinksAnchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            // Simple check if target is on the *current* page
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Use traditional check instead of optional chaining
                const headerElement = document.querySelector('.header');
                const headerHeight = headerElement ? headerElement.offsetHeight : 0;
                gsap.to(window, { duration: 1, scrollTo: { y: targetElement.offsetTop - headerHeight } });
            } else {
                // If target is not on current page (e.g., linking back to index from legal)
                // Allow default link behavior
                window.location.href = this.href;
            }
        });
    });

    // --- Snowflake Animation --- 
    if (document.querySelector('.hero')) {
        const heroBackground = document.querySelector('.hero-background');
        let snowflakeCount = 0;
        const maxSnowflakes = 500;
        const snowflakeInterval = 100;
        let snowflakeTimer = null;

        function addSnowflake() {
            if (!heroBackground || snowflakeCount >= maxSnowflakes) {
                if (snowflakeTimer) {
                    clearInterval(snowflakeTimer);
                    snowflakeTimer = null;
                }
                return;
            }

            const snowflakeChars = ['❄️', '❅', '❆'];
            let flake = document.createElement('div');
            flake.className = 'snowflake';
            flake.textContent = snowflakeChars[Math.floor(Math.random() * snowflakeChars.length)];
            flake.style.left = Math.random() * 100 + 'vw';
            flake.style.fontSize = (Math.random() * 1 + 0.5) + 'rem';
            flake.style.top = '-10px';
            heroBackground.appendChild(flake);
            snowflakeCount++;

            gsap.to(flake, {
                y: () => heroBackground.offsetHeight + 10,
                x: "random(-30, 30)",
                rotation: "random(-180, 180)",
                opacity: "random(0.5, 1)",
                duration: Math.random() * 8 + 6,
                ease: "none",
                onComplete: () => {
                    // Fade out and REMOVE the snowflake completely
                    gsap.to(flake, {
                        opacity: 0,
                        duration: 0.5,
                        onComplete: () => {
                            flake.remove(); // Remove from DOM
                        }
                    });
                }
            });
        }

        if (heroBackground) {
            snowflakeTimer = setInterval(addSnowflake, snowflakeInterval);
        }

        // --- Hero Content Animation --- 
        // Animate title lines individually
        const heroTitle = document.querySelector(".hero-title");
        if (heroTitle) {
            // Split title into lines if needed (simple split by <br> for now)
            // For more complex splitting (by word/char), consider GSAP SplitText plugin
            const lines = heroTitle.innerHTML.split(/<br\s*\/?>/i); // Split by <br>
            heroTitle.innerHTML = lines.map(line => `<span class="title-line-wrapper"><span class="title-line">${line.trim()}</span></span>`).join('');

            gsap.from(".title-line", {
                y: '100%', // Start below
                opacity: 0,
                duration: 0.8,
                ease: "power3.out",
                stagger: 0.2, // Animate lines one after another
                delay: 0.5 // Start after a short delay
            });
        }

        // Animate subtitle, buttons, reviews (similar to before but maybe tweak delay/ease)
        gsap.from(".hero-subtitle", { opacity: 0, y: 30, duration: 1, ease: "power2.out", delay: 1.0 });
        gsap.from(".hero-buttons .btn", {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.15,
            delay: 1.2, // Ensure delay isn't preventing visibility
            clearProps: "opacity,transform" // Add clearProps to ensure styles are removed after animation
        });
        gsap.from(".hero-reviews", {
            opacity: 0,
            scale: 0.5,
            duration: 0.8,
            ease: "back.out(1.7)",
            delay: 1.5,
            clearProps: "opacity,transform"
        });
    }

    // --- Partners Logo Animation --- 
    // REMOVED GSAP ANIMATION for partner logos to ensure visibility
    // We rely on CSS for sizing now.

    // --- Success Metrics Animation --- 
    if (document.querySelector('.success-metrics-section')) {
        gsap.from(".success-metrics-section > .container > *", {
            scrollTrigger: { trigger: ".success-metrics-section", start: "top 80%", toggleActions: "play none none none" },
            opacity: 0,
            y: 40,
            duration: 0.8,
            stagger: 0.2
        });
    }

    // --- Winning Tickets Marquee (Draggable ONLY) --- 
    if (document.querySelector('.ticket-gallery-wrapper')) {
        const ticketRows = gsap.utils.toArray(".ticket-row");

        ticketRows.forEach(row => {
            // Make it draggable
            Draggable.create(row, {
                type: "x",
                edgeResistance: 0.65,
                bounds: ".ticket-gallery-wrapper",
                inertia: true,
                throwProps: true // Enable inertia physics
                    // Removed auto-scroll tween and related callbacks (onPress, onDrag, etc.)
            });

            // No hover listeners needed as auto-scroll is removed
        });
    }

    // --- Research & Teamwork Animation (Creative Transition Example) ---
    if (document.querySelector('.research-teamwork-section')) {
        const researchSection = document.querySelector(".research-teamwork-section");
        gsap.from(".research-teamwork-section > .container > *", {
            scrollTrigger: {
                trigger: ".research-teamwork-section",
                start: "top 70%", // TRIGGER EARLIER
                toggleActions: "play none none none"
            },
            opacity: 0,
            y: 40,
            duration: 0.8,
            stagger: 0.2
        });
        // Adjust content animation triggers slightly if needed based on new section start
        gsap.from(".research-text h2", { scrollTrigger: { trigger: researchSection, start: "top 70%" }, opacity: 0, y: 30, duration: 0.6 });
        gsap.from(".research-text p", { scrollTrigger: { trigger: researchSection, start: "top 65%" }, opacity: 0, y: 30, duration: 0.6, delay: 0.1 });
        gsap.from(".phone-container", { scrollTrigger: { trigger: researchSection, start: "top 50%" }, opacity: 0, scale: 0.8, duration: 0.8, ease: "back.out(1.5)" });
        gsap.from(".teamwork-text", { scrollTrigger: { trigger: researchSection, start: "top 40%" }, opacity: 0, y: 30, duration: 0.6 });
    }

    // --- Pricing Cards Animation --- 
    if (document.querySelector('.pricing-plans-section')) {
        gsap.from(".pricing-plans-section > .container > *:not(.pricing-cards-container)", { // Animate title/logo first
            scrollTrigger: { trigger: ".pricing-plans-section", start: "top 80%", toggleActions: "play none none none" },
            opacity: 0,
            y: 40,
            duration: 0.8,
            stagger: 0.2
        });
        gsap.from(".pricing-card", { // Then animate cards
            scrollTrigger: {
                trigger: ".pricing-cards-container", // Trigger when container is visible
                start: "top 85%",
                toggleActions: "play none none none",
            },
            opacity: 0,
            y: 60,
            duration: 0.7,
            stagger: 0.1, // Stagger the cards
            ease: "power2.out"
        });
    }

    // --- Community Reviews Marquee (Draggable ONLY) --- 
    if (document.querySelector('.reviews-slider-wrapper')) {
        const reviewRows = gsap.utils.toArray(".review-row");
        reviewRows.forEach(row => {
            // Make it draggable
            Draggable.create(row, {
                type: "x",
                edgeResistance: 0.65,
                bounds: ".reviews-slider-wrapper",
                inertia: true,
                throwProps: true
                    // Removed auto-scroll tween and related callbacks
            });
            // No hover listeners needed
        });
    }

    // --- Footer Animation --- 
    if (document.querySelector('.footer')) {
        gsap.from(".footer-content > div", { // Animate each column
            scrollTrigger: {
                trigger: ".footer",
                start: "top 90%",
                toggleActions: "play none none none",
            },
            opacity: 0,
            y: 40,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out"
        });
    }

    // --- Loader Animation --- 
    const loader = document.querySelector('.loader');
    const loaderLogo = document.querySelector('.loader-logo');

    if (loader && loaderLogo) {
        // Initial state (optional, CSS handles opacity 0)
        gsap.set(loaderLogo, { scale: 0.5 });

        const loaderTl = gsap.timeline();
        loaderTl
            .to(loaderLogo, { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" })
            .to(loaderLogo, { rotation: 360, duration: 1.5, ease: "power1.inOut" }, "-=0.5") // Spin
            .to(loaderLogo, { scale: 50, opacity: 0, duration: 1, ease: "power2.in" }, "-=0.7"); // Grow and fade

        // Hide loader when window (including images) is fully loaded
        window.onload = () => {
            loaderTl.play(); // Start animation now

            // Add a slight delay after animation finishes before hiding loader 
            // and restoring scroll. Adjust delay as needed.
            gsap.delayedCall(loaderTl.duration() - 0.3, () => {
                gsap.to(loader, {
                    opacity: 0,
                    duration: 0.5,
                    onComplete: () => {
                        loader.style.display = 'none'; // Hide completely
                        document.body.classList.add('loaded'); // Restore scrollbar
                    }
                });
            });
        };
    }
});

// --- Inject Header/Footer into Legal Pages --- 
/*
function injectSharedElements() { ... }
*/

// Function to attach menu listener 
function attachMobileMenuListener() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    console.log("Attach listener Check: Found Toggle:", !!menuToggle, "Found Links:", !!navLinks);

    if (menuToggle && navLinks) {
        // Clear any previous listeners (more robust)
        const newToggle = menuToggle.cloneNode(true);
        menuToggle.parentNode.replaceChild(newToggle, menuToggle);

        console.log("Attaching NEW click listener to menu toggle.");
        newToggle.addEventListener('click', () => {
            console.log("Menu toggle clicked!"); // Debug click
            navLinks.classList.toggle('active');
            newToggle.classList.toggle('active');
        });

        // Re-select navLinks in case they were cloned/replaced elsewhere (unlikely here)
        const currentNavLinks = document.querySelector('.nav-links');
        if (currentNavLinks) {
            currentNavLinks.querySelectorAll('a').forEach(link => {
                // Remove old listeners before adding new
                const newLink = link.cloneNode(true);
                link.parentNode.replaceChild(newLink, link);

                newLink.addEventListener('click', (e) => {
                    // Close menu on link click
                    currentNavLinks.classList.remove('active');
                    newToggle.classList.remove('active');

                    // Smooth scroll logic (only if # link and on index)
                    if (newLink.getAttribute('href').startsWith('#') && !document.querySelector('.legal-content-main')) {
                        // Smooth scroll code is handled by the separate listener in DOMContentLoaded
                    } else {
                        // Allow default behavior for external links or links on legal pages
                    }
                });
            });
        }

    } else {
        console.error("Mobile menu toggle or nav links not found!");
    }
}