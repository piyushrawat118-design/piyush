/* =======================================================
   PIYUSH RAWAT PORTFOLIO – MASTER SCRIPT
   ======================================================= */

(function () {
    'use strict';

    /* -------------------------------------------------------
       0. CURTAIN INTRO
       ------------------------------------------------------- */
    const curtain = document.getElementById('curtain');

    // After the loader fills (~2.9s) open curtains
    setTimeout(() => curtain.classList.add('open'), 2900);
    // After curtains slide away, hide completely
    setTimeout(() => {
        curtain.classList.add('away');
        setTimeout(() => { curtain.style.display = 'none'; }, 600);
    }, 3900);

    /* -------------------------------------------------------
       1. PARTICLE NETWORK BACKGROUND (mouse-repellent)
       ------------------------------------------------------- */
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    let mx = -999, my = -999;

    window.addEventListener('resize', () => {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
        buildParticles();
    });
    window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    let pts = [];

    function buildParticles() {
        const count = Math.min(70, Math.floor(W * H / 18000));
        pts = Array.from({ length: count }, () => ({
            x: Math.random() * W,
            y: Math.random() * H,
            vx: (Math.random() - .5) * .35,
            vy: (Math.random() - .5) * .35,
            r:  Math.random() * 1.5 + .5,
            a:  Math.random() * .45 + .15,
        }));
    }
    buildParticles();

    function tick() {
        ctx.clearRect(0, 0, W, H);

        // Move + repel
        for (const p of pts) {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
            if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

            const dx = mx - p.x, dy = my - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 110) {
                const f = (110 - dist) / 110 * .04;
                p.x -= dx * f; p.y -= dy * f;
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(99,102,241,${p.a})`;
            ctx.fill();
        }

        // Connect nearby particles
        for (let i = 0; i < pts.length; i++) {
            for (let j = i + 1; j < pts.length; j++) {
                const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < 140) {
                    ctx.beginPath();
                    ctx.moveTo(pts[i].x, pts[i].y);
                    ctx.lineTo(pts[j].x, pts[j].y);
                    ctx.strokeStyle = `rgba(34,211,238,${0.07 * (1 - d / 140)})`;
                    ctx.lineWidth = .6;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(tick);
    }
    tick();

    /* -------------------------------------------------------
       2. CUSTOM CURSOR
       ------------------------------------------------------- */
    const dot  = document.getElementById('cDot');
    const ring = document.getElementById('cRing');

    if (dot && ring) {
        document.addEventListener('mousemove', e => {
            dot.style.left  = e.clientX + 'px';
            dot.style.top   = e.clientY + 'px';
            ring.animate(
                { left: e.clientX + 'px', top: e.clientY + 'px' },
                { duration: 350, fill: 'forwards' }
            );
        });

        const hovered = 'a,button,.glass-card,.tool-box,.info-row,.photo-frame,.tag-cloud span,.chips span';
        document.querySelectorAll(hovered).forEach(el => {
            el.addEventListener('mouseenter', () => ring.classList.add('big'));
            el.addEventListener('mouseleave', () => ring.classList.remove('big'));
        });
    }

    /* -------------------------------------------------------
       3. TYPING EFFECT
       ------------------------------------------------------- */
    const typedEl = document.getElementById('typed');
    if (typedEl) {
        const lines = [
            'Digital Marketing Fresher',
            'SEO Enthusiast',
            'WordPress Blogger',
            'Social Media Marketer',
            'AI Tools User',
            'Ready to Work!',
        ];
        let li = 0, ci = 0, del = false;

        (function typeIt() {
            const cur = lines[li];
            typedEl.textContent = del
                ? cur.slice(0, --ci)
                : cur.slice(0, ++ci);

            let wait = del ? 38 : 85;
            if (!del && ci === cur.length) { wait = 2200; del = true; }
            else if (del && ci === 0)     { del = false; li = (li + 1) % lines.length; wait = 400; }

            setTimeout(typeIt, wait);
        })();
    }

    /* -------------------------------------------------------
       4. PHOTO 3D MOUSE-TRACK
       ------------------------------------------------------- */
    const photoScene = document.getElementById('photoScene');
    const photoFrame = document.getElementById('photoFrame');

    if (photoScene && photoFrame) {
        photoScene.addEventListener('mousemove', e => {
            const r  = photoScene.getBoundingClientRect();
            const rx = ((e.clientY - r.top)  / r.height - .5) * -28;
            const ry = ((e.clientX - r.left) / r.width  - .5) *  28;
            photoFrame.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.04)`;
        });
        photoScene.addEventListener('mouseleave', () => {
            photoFrame.style.transform = 'perspective(700px) rotateX(0) rotateY(0) scale(1)';
        });
    }

    /* -------------------------------------------------------
       5. SCROLL REVEAL (stagger + fade-in directions)
       ------------------------------------------------------- */
    const reveals = document.querySelectorAll('.stagger,.fade-in-left,.fade-in-right');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el  = entry.target;
                const del = parseFloat(el.dataset.delay || 0);
                setTimeout(() => el.classList.add('go'), del * 1000);
            }
        });
    }, { threshold: 0.12 });

    reveals.forEach(el => observer.observe(el));

    /* -------------------------------------------------------
       6. ACTIVE NAV LINK ON SCROLL
       ------------------------------------------------------- */
    const navLinks = document.querySelectorAll('.nav-list a');
    const sections = document.querySelectorAll('section[id]');
    const nav = document.getElementById('nav');

    window.addEventListener('scroll', () => {
        // Shrink nav
        nav.classList.toggle('scrolled', scrollY > 40);

        // Highlight active link
        let active = '';
        sections.forEach(s => {
            if (scrollY >= s.offsetTop - s.clientHeight / 3) active = s.id;
        });
        navLinks.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + active);
        });
    });

    /* -------------------------------------------------------
       7. MOBILE HAMBURGER MENU
       ------------------------------------------------------- */
    const ham   = document.getElementById('hamburger');
    const mMenu = document.getElementById('mobileMenu');
    if (ham && mMenu) {
        ham.addEventListener('click', () => mMenu.classList.toggle('show'));
        mMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mMenu.classList.remove('show')));
    }

    /* -------------------------------------------------------
       8. GLASS CARD TILT (JS-driven, smooth on all cards)
       ------------------------------------------------------- */
    document.querySelectorAll('.tilt-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r  = card.getBoundingClientRect();
            const rx = ((e.clientY - r.top)  / r.height - .5) * -14;
            const ry = ((e.clientX - r.left) / r.width  - .5) *  14;
            card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(12px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });

    /* -------------------------------------------------------
       9. CONTACT FORM SUBMIT ANIMATION
       ------------------------------------------------------- */
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const orig = btn.textContent;
            btn.textContent = 'Sending…';
            btn.style.opacity = '.7';
            setTimeout(() => {
                btn.textContent = '✅ Message Sent!';
                btn.style.background = 'linear-gradient(135deg,#10b981,#059669)';
                btn.style.opacity = '1';
                form.reset();
                setTimeout(() => {
                    btn.textContent = orig;
                    btn.style.background = '';
                }, 3000);
            }, 1200);
        });
    }

})();
