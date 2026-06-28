document.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement;
  const body = document.body;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const storageKey = "vak_cookie_choice";

  const dom = {
    yearNodes: document.querySelectorAll("[data-current-year]"),
    langButtons: document.querySelectorAll("[data-set-lang]"),
    translatable: document.querySelectorAll("[data-lang]"),
    mobileMenuButton: document.getElementById("mobile-menu-button"),
    mobileMenu: document.getElementById("mobile-menu"),
    mobileMenuLinks: document.querySelectorAll("#mobile-menu a"),
    fadeInSections: document.querySelectorAll(".fade-in-section"),
    particleCanvas: document.getElementById("particle-canvas"),
    imprintModal: document.getElementById("imprint-modal"),
    imprintOpeners: document.querySelectorAll("[data-open-imprint]"),
    imprintClosers: document.querySelectorAll("[data-close-imprint]"),
    cookieBanner: document.getElementById("cookie-consent-banner"),
    acceptCookiesBtn: document.getElementById("accept-cookies"),
    declineCookiesBtn: document.getElementById("decline-cookies"),
    cookieSettingsButtons: document.querySelectorAll("[data-cookie-settings]"),
    facebookMounts: document.querySelectorAll("[data-facebook-embed]"),
    facebookButtons: document.querySelectorAll("[data-facebook-placeholder-btn]"),
  };

  let currentLang = "hu";
  let activeModal = null;
  let modalInvoker = null;
  let particles = [];
  let particleContext = null;
  let particleAnimationFrame = null;

  initCurrentYear();
  initLanguage();
  initMobileMenu();
  initFadeInObserver();
  initParticleCanvas();
  initModal();
  initCookies();
  initFacebookEmbeds();

  function initCurrentYear() {
    const year = new Date().getFullYear();
    dom.yearNodes.forEach((node) => {
      node.textContent = String(year);
    });
  }

  function initLanguage() {
    if (!dom.langButtons.length || !dom.translatable.length) {
      return;
    }

    dom.langButtons.forEach((button) => {
      button.addEventListener("click", () => setLanguage(button.dataset.setLang || "hu"));
    });

    setLanguage("hu");
  }

  function setLanguage(language) {
    currentLang = language;
    dom.translatable.forEach((node) => {
      node.classList.toggle("hidden", node.dataset.lang !== language);
    });
    dom.langButtons.forEach((button) => {
      const isActive = button.dataset.setLang === language;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
    html.lang = language;
  }

  function initMobileMenu() {
    if (!dom.mobileMenuButton || !dom.mobileMenu) {
      return;
    }

    dom.mobileMenuButton.addEventListener("click", toggleMobileMenu);
    dom.mobileMenuLinks.forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    });
  }

  function toggleMobileMenu() {
    const willOpen = dom.mobileMenu.classList.contains("hidden");
    dom.mobileMenu.classList.toggle("hidden", !willOpen);
    dom.mobileMenuButton.setAttribute("aria-expanded", willOpen ? "true" : "false");
  }

  function closeMobileMenu() {
    if (!dom.mobileMenu || !dom.mobileMenuButton) {
      return;
    }
    dom.mobileMenu.classList.add("hidden");
    dom.mobileMenuButton.setAttribute("aria-expanded", "false");
  }

  function initFadeInObserver() {
    if (!dom.fadeInSections.length || !("IntersectionObserver" in window)) {
      dom.fadeInSections.forEach((section) => section.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.12 },
    );

    dom.fadeInSections.forEach((section) => observer.observe(section));
  }

  function initParticleCanvas() {
    if (!dom.particleCanvas || reducedMotion.matches) {
      return;
    }

    particleContext = dom.particleCanvas.getContext("2d");
    if (!particleContext) {
      return;
    }

    window.addEventListener("resize", setupParticles);
    reducedMotion.addEventListener("change", () => {
      if (reducedMotion.matches) {
        cancelParticleAnimation();
        clearParticleCanvas();
      }
    });

    setupParticles();
    animateParticles();
  }

  function setupParticles() {
    if (!dom.particleCanvas || !particleContext) {
      return;
    }

    const canvas = dom.particleCanvas;
    const parent = canvas.parentElement;
    if (!parent) {
      return;
    }

    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;

    const particleCount = Math.max(18, Math.round((canvas.width * canvas.height) / 16500));
    particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1,
      speedX: Math.random() * 0.35 - 0.175,
      speedY: Math.random() * 0.35 - 0.175,
    }));
  }

  function animateParticles() {
    if (!dom.particleCanvas || !particleContext || reducedMotion.matches) {
      return;
    }

    const canvas = dom.particleCanvas;
    particleContext.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      if (particle.x < 0 || particle.x > canvas.width) {
        particle.speedX *= -1;
      }
      if (particle.y < 0 || particle.y > canvas.height) {
        particle.speedY *= -1;
      }

      particleContext.beginPath();
      particleContext.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      particleContext.fillStyle = "rgba(96, 165, 250, 0.42)";
      particleContext.fill();
    });

    for (let index = 0; index < particles.length; index += 1) {
      for (let second = index + 1; second < particles.length; second += 1) {
        const firstParticle = particles[index];
        const secondParticle = particles[second];
        const deltaX = firstParticle.x - secondParticle.x;
        const deltaY = firstParticle.y - secondParticle.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance < 110) {
          particleContext.strokeStyle = `rgba(96, 165, 250, ${1 - distance / 110})`;
          particleContext.lineWidth = 1;
          particleContext.beginPath();
          particleContext.moveTo(firstParticle.x, firstParticle.y);
          particleContext.lineTo(secondParticle.x, secondParticle.y);
          particleContext.stroke();
        }
      }
    }

    particleAnimationFrame = window.requestAnimationFrame(animateParticles);
  }

  function clearParticleCanvas() {
    if (!dom.particleCanvas || !particleContext) {
      return;
    }
    particleContext.clearRect(0, 0, dom.particleCanvas.width, dom.particleCanvas.height);
  }

  function cancelParticleAnimation() {
    if (particleAnimationFrame) {
      window.cancelAnimationFrame(particleAnimationFrame);
      particleAnimationFrame = null;
    }
  }

  function initModal() {
    if (!dom.imprintModal) {
      return;
    }

    dom.imprintOpeners.forEach((button) => {
      button.addEventListener("click", () => openModal(dom.imprintModal, button));
    });

    dom.imprintClosers.forEach((button) => {
      button.addEventListener("click", () => closeModal(dom.imprintModal));
    });

    dom.imprintModal.addEventListener("click", (event) => {
      if (event.target === dom.imprintModal) {
        closeModal(dom.imprintModal);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && activeModal) {
        closeModal(activeModal);
      }
      if (event.key === "Tab" && activeModal) {
        trapFocus(event, activeModal);
      }
    });
  }

  function openModal(modal, opener) {
    activeModal = modal;
    modalInvoker = opener || document.activeElement;
    modal.classList.remove("hidden");
    body.classList.add("modal-open");
    const firstFocusable = getFocusableElements(modal)[0];
    if (firstFocusable) {
      firstFocusable.focus();
    } else {
      modal.focus();
    }
  }

  function closeModal(modal) {
    modal.classList.add("hidden");
    body.classList.remove("modal-open");
    activeModal = null;
    if (modalInvoker && typeof modalInvoker.focus === "function") {
      modalInvoker.focus();
    }
  }

  function trapFocus(event, modal) {
    const focusable = getFocusableElements(modal);
    if (!focusable.length) {
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function getFocusableElements(container) {
    return Array.from(
      container.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, details summary, [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element) => !element.hasAttribute("hidden"));
  }

  function initCookies() {
    if (!dom.cookieBanner) {
      return;
    }

    const choice = readCookieChoice();
    if (!choice) {
      showCookieBanner();
    }

    dom.acceptCookiesBtn?.addEventListener("click", () => {
      saveCookieChoice("accepted");
      hideCookieBanner();
      loadFacebookEmbeds();
    });

    dom.declineCookiesBtn?.addEventListener("click", () => {
      saveCookieChoice("declined");
      hideCookieBanner();
      unloadFacebookEmbeds();
    });

    dom.cookieSettingsButtons.forEach((button) => {
      button.addEventListener("click", () => {
        window.localStorage.removeItem(storageKey);
        unloadFacebookEmbeds();
        showCookieBanner();
      });
    });
  }

  function initFacebookEmbeds() {
    dom.facebookButtons.forEach((button) => {
      button.addEventListener("click", () => {
        saveCookieChoice("accepted");
        hideCookieBanner();
        loadFacebookEmbeds();
      });
    });

    if (readCookieChoice() === "accepted") {
      loadFacebookEmbeds();
    }
  }

  function loadFacebookEmbeds() {
    dom.facebookMounts.forEach((mount) => {
      if (mount.dataset.loaded === "true") {
        return;
      }

      const frameWidth = Math.max(280, Math.min(500, Math.floor(mount.getBoundingClientRect().width - 32)));
      const iframe = document.createElement("iframe");
      iframe.src = facebookEmbedUrl(mount.dataset.facebookSrc || "", frameWidth);
      iframe.width = String(frameWidth);
      iframe.height = "517";
      iframe.style.border = "none";
      iframe.style.overflow = "hidden";
      iframe.style.backgroundColor = "#ffffff";
      iframe.setAttribute("scrolling", "no");
      iframe.setAttribute("frameborder", "0");
      iframe.setAttribute("allowfullscreen", "true");
      iframe.setAttribute(
        "allow",
        "autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share",
      );
      iframe.loading = "lazy";
      iframe.className = "facebook-frame";
      const shell = document.createElement("div");
      shell.className = "facebook-frame-shell";
      shell.appendChild(iframe);
      mount.innerHTML = "";
      mount.appendChild(shell);
      mount.dataset.loaded = "true";
    });
  }

  function facebookEmbedUrl(src, width) {
    try {
      const url = new URL(src);
      url.searchParams.set("width", String(width));
      return url.toString();
    } catch {
      return src;
    }
  }

  function unloadFacebookEmbeds() {
    dom.facebookMounts.forEach((mount) => {
      if (mount.dataset.loaded !== "true") {
        return;
      }
      mount.innerHTML = "";
      mount.dataset.loaded = "false";
    });
  }

  function showCookieBanner() {
    dom.cookieBanner?.classList.remove("hidden");
  }

  function hideCookieBanner() {
    dom.cookieBanner?.classList.add("hidden");
  }

  function saveCookieChoice(choice) {
    window.localStorage.setItem(storageKey, choice);
  }

  function readCookieChoice() {
    return window.localStorage.getItem(storageKey);
  }
});
