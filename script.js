(() => {
  /* --- FIREBASE CONFIGURATION --- */
  const firebaseConfig = {
    apiKey: "AIzaSyDb4H4DoPfQddNELl40BQeqpC4UkVeY4Ak",
    authDomain: "mafin-clown-cloe.firebaseapp.com",
    databaseURL:
      "https://mafin-clown-cloe-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "mafin-clown-cloe",
    storageBucket: "mafin-clown-cloe.firebasestorage.app",
    messagingSenderId: "409129169060",
    appId: "1:409129169060:web:c19eefa26750489745f631",
    measurementId: "G-CGYJXZ5QNC",
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const appCheck = firebase.appCheck();
  appCheck.activate(
    new firebase.appCheck.ReCaptchaEnterpriseProvider(
      "6LelGNEsAAAAADZ6Ts-VleJQAojEEQorbYpcdvwU",
    ),
    true,
  );

  const database = firebase.database();
  const analytics = firebase.analytics();
  const globalHitsRef = database.ref("clowncloe_global_hits");

  /* --- DOM ELEMENTS --- */
  const slapButton = document.querySelector(".slap-button");
  const emojiSpan = document.querySelector(".button-icon");
  const btnEn = document.querySelector(".en-button");
  const btnEs = document.querySelector(".es-button");
  const soundBtn = document.querySelector(".sound-toggle");
  const translatableElements = document.querySelectorAll("[data-i18n]");

  const currentHitsEl = document.querySelector(".current-slaps");
  const userTotalHitsEl = document.querySelector(".local-total-slaps");
  const worldTotalHitsEl = document.querySelector(".global-total-slaps");

  const clownMusic = document.querySelector(".clown-music");
  const tomatoSquash = document.querySelector(".tomato-squash");
  const videoContainer = document.querySelector(".video-container");

  const makeup = document.querySelector(".clown-makeup");
  const wig = document.querySelector(".clown-wig");
  const bowtie = document.querySelector(".clown-bowtie");
  const nose = document.querySelector(".clown-nose");
  const canvas = document.querySelector(".splat-canvas");

  const bubblePlayBtn = document.querySelector(".bubble-play-button");
  const videoModal = document.querySelector(".video-modal");
  const modalCloseBtn = document.querySelector(".close-modal-button");
  const finaVideoPlayer = document.querySelector(".fina-video-player");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");

  /* --- APP STATE --- */
  let sessionHits = 0;
  let lastHitTime = 0;
  let userTotalHits = localStorage.getItem("clowncloe_user_hits")
    ? parseInt(localStorage.getItem("clowncloe_user_hits")) || 0
    : 0;
  let isMuted = localStorage.getItem("clowncloe_muted") === "true";

  const videoPlaylist = [
    "./assets/fina-sarcastic1.mp4",
    "./assets/fina-sarcastic2.mp4",
    "./assets/fina-sarcastic3.mp4",
    "./assets/fina-sarcastic4.mp4",
  ];
  let currentVideoIndex = 0;

  /* --- CORE FUNCTIONS --- */
  function resizeCanvas() {
    if (!canvas) return;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    if (canvas.width === w && canvas.height === h) return;
    const imageData =
      canvas.width > 0 && canvas.height > 0
        ? canvas
            .getContext("2d")
            .getImageData(0, 0, canvas.width, canvas.height)
        : null;
    canvas.width = w;
    canvas.height = h;
    if (imageData) canvas.getContext("2d").putImageData(imageData, 0, 0);
  }

  window.clearTomatoes = function () {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  function drawSplat(ctx, x, y) {
    ctx.save();
    ctx.globalAlpha = 0.88;
    ctx.fillStyle = "#c0392b";
    ctx.beginPath();
    const rx = 9 + Math.random() * 4;
    const ry = 7 + Math.random() * 3;
    ctx.ellipse(x, y, rx, ry, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
    for (let i = 0; i < 3; i++) {
      const ang = Math.random() * Math.PI * 2;
      const dist = 8 + Math.random() * 12;
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.arc(
        x + Math.cos(ang) * dist,
        y + Math.sin(ang) * dist,
        2 + Math.random() * 3,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
    ctx.fillStyle = "#f5e6a0";
    ctx.globalAlpha = 0.7;
    for (let i = 0; i < 2; i++) {
      ctx.beginPath();
      ctx.ellipse(
        x + (Math.random() - 0.5) * 6,
        y + (Math.random() - 0.5) * 4,
        2,
        1,
        Math.random() * Math.PI,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
    ctx.restore();
  }

  function setLanguage(lang) {
    if (btnEn) btnEn.classList.toggle("active", lang === "en");
    if (btnEs) btnEs.classList.toggle("active", lang === "es");

    if (typeof translations !== "undefined") {
      translatableElements.forEach((el) => {
        const key = el.getAttribute("data-i18n");
        if (key && translations[lang] && translations[lang][key]) {
          el.innerHTML = translations[lang][key];
        }
      });
    }
    localStorage.setItem("clowncloe_lang", lang);
  }

  const closeModal = () => {
    if (videoModal) videoModal.classList.remove("show");
    if (finaVideoPlayer) {
      finaVideoPlayer.pause();
      finaVideoPlayer.currentTime = 0;
    }
  };

  function processHit() {
    sessionHits++;
    userTotalHits++;

    if (currentHitsEl) currentHitsEl.textContent = sessionHits.toLocaleString();
    if (userTotalHitsEl)
      userTotalHitsEl.textContent = userTotalHits.toLocaleString();

    localStorage.setItem("clowncloe_user_hits", userTotalHits);

    globalHitsRef.transaction((v) => (v || 0) + 1);

    if ([10, 20, 30, 40, 50].includes(sessionHits)) {
      analytics.logEvent("cloe_milestone", { milestone: sessionHits });
    }

    if (
      sessionHits >= 10 &&
      makeup &&
      !makeup.classList.contains("is-visible")
    ) {
      makeup.classList.add("is-visible");
      if (emojiSpan) emojiSpan.textContent = "🦱";
    }
    if (sessionHits >= 20 && wig && !wig.classList.contains("is-visible")) {
      wig.classList.add("is-visible");
      if (emojiSpan) emojiSpan.textContent = "🎀";
    }
    if (
      sessionHits >= 30 &&
      bowtie &&
      !bowtie.classList.contains("is-visible")
    ) {
      bowtie.classList.add("is-visible");
      if (emojiSpan) emojiSpan.textContent = "🔴";
    }
    if (sessionHits >= 40 && nose && !nose.classList.contains("is-visible")) {
      nose.classList.add("is-visible");
      if (emojiSpan) emojiSpan.textContent = "🤡";
    }

    if (sessionHits >= 50) {
      if (makeup && !makeup.classList.contains("fade-out")) {
        makeup.classList.add("fade-out");
        if (wig) wig.classList.add("fade-out");
        if (bowtie) bowtie.classList.add("fade-out");
        if (nose) nose.classList.add("fade-out");
        if (emojiSpan) emojiSpan.textContent = "🍅";

        const bubble = document.querySelector(".speech-bubble");
        if (bubble) bubble.classList.add("show-bubble");
      }

      if (!canvas) return;
      resizeCanvas();
      const ctx = canvas.getContext("2d");

      let targetPixelX, targetPixelY;

      const patternCoords =
        typeof getNextPatternCoordinate === "function"
          ? getNextPatternCoordinate(canvas.offsetWidth, canvas.offsetHeight)
          : null;

      if (patternCoords !== null) {
        targetPixelX = patternCoords.x;
        targetPixelY = patternCoords.y;
      } else {
        if (emojiSpan) emojiSpan.textContent = "🍅";
        const randX = 32 + Math.random() * 18;
        const randY = 20 + Math.random() * 30;
        targetPixelX = (randX / 100) * canvas.offsetWidth;
        targetPixelY = (randY / 100) * canvas.offsetHeight;
      }

      const flying = document.createElement("div");
      flying.textContent = "🍅";
      flying.style.position = "absolute";
      flying.style.fontSize = "28px";
      flying.style.zIndex = "30";
      flying.style.pointerEvents = "none";
      flying.style.transform = "translate(-50%, -50%)";
      if (videoContainer) videoContainer.appendChild(flying);

      const startX = canvas.offsetWidth / 2;
      const startY = canvas.offsetHeight + 40;
      const start = performance.now();
      const dur = 250;

      function step(now) {
        const t = Math.min((now - start) / dur, 1);
        const x = startX + (targetPixelX - startX) * t;
        const arc = Math.sin(t * Math.PI) * 20;
        const y = startY + (targetPixelY - startY) * t - arc;

        flying.style.left = x + "px";
        flying.style.top = y + "px";

        if (t < 1) {
          requestAnimationFrame(step);
        } else {
          flying.remove();
          drawSplat(ctx, targetPixelX, targetPixelY);
        }
      }
      requestAnimationFrame(step);
    }
  }

  /* --- EVENT LISTENERS --- */
  window.addEventListener("resize", resizeCanvas);

  if (btnEn) btnEn.addEventListener("click", () => setLanguage("en"));
  if (btnEs) btnEs.addEventListener("click", () => setLanguage("es"));

  if (soundBtn) {
    soundBtn.addEventListener("click", () => {
      isMuted = !isMuted;
      localStorage.setItem("clowncloe_muted", isMuted);
      soundBtn.textContent = isMuted ? "🔇" : "🔊";
      soundBtn.classList.toggle("is-muted", isMuted);

      if (isMuted) {
        if (clownMusic) clownMusic.pause();
      } else {
        if (
          sessionHits > 0 &&
          sessionHits <= 49 &&
          clownMusic &&
          clownMusic.paused
        ) {
          clownMusic.play();
        }
      }
    });
  }

  if (slapButton) {
    slapButton.addEventListener("click", (e) => {
      if (!e.isTrusted) return;

      const now = Date.now();
      if (now - lastHitTime < 80) return;
      lastHitTime = now;

      const isModalOpen = videoModal && videoModal.classList.contains("show");

      if (!isMuted) {
        if (sessionHits < 49) {
          if (clownMusic) {
            clownMusic.volume = 0.5;
            if (clownMusic.paused) clownMusic.play();
            if (clownMusic.playbackRate < 2.5) clownMusic.playbackRate += 0.02;
          }
        } else {
          if (clownMusic && !clownMusic.paused) clownMusic.pause();

          if (tomatoSquash && !isModalOpen) {
            const squashClone = new Audio(tomatoSquash.src);
            squashClone.volume = 0.7;
            squashClone.play();
            squashClone.onended = () => squashClone.remove();
          }
        }
      } else {
        if (clownMusic && !clownMusic.paused) clownMusic.pause();
      }

      processHit();
    });
  }

  const martaContainer = document.querySelector(".marta-flip-container");
  const martaFlipper = document.querySelector(".marta-flipper");

  if (martaContainer && martaFlipper) {
    martaContainer.addEventListener("click", () => {
      martaFlipper.classList.toggle("is-flipped");
    });
  }

  // MODAL & SLIDER
  if (bubblePlayBtn && videoModal) {
    bubblePlayBtn.addEventListener("click", () => {
      videoModal.classList.add("show");
      if (clownMusic && !clownMusic.paused) clownMusic.pause();
      if (finaVideoPlayer) {
        finaVideoPlayer.volume = 1.0;
        finaVideoPlayer.play();
      }
    });

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener("click", closeModal);
    }

    document.addEventListener("click", (e) => {
      if (
        videoModal.classList.contains("show") &&
        !videoModal.contains(e.target) &&
        !bubblePlayBtn.contains(e.target) &&
        !slapButton?.contains(e.target)
      ) {
        closeModal();
      }
    });

    if (prevBtn && nextBtn && finaVideoPlayer) {
      prevBtn.addEventListener("click", () => {
        currentVideoIndex =
          (currentVideoIndex - 1 + videoPlaylist.length) % videoPlaylist.length;
        finaVideoPlayer.src = videoPlaylist[currentVideoIndex];
        finaVideoPlayer.play();
      });

      nextBtn.addEventListener("click", () => {
        currentVideoIndex = (currentVideoIndex + 1) % videoPlaylist.length;
        finaVideoPlayer.src = videoPlaylist[currentVideoIndex];
        finaVideoPlayer.play();
      });
    }
  }

  /* --- INITIALIZATION --- */
  if (userTotalHitsEl)
    userTotalHitsEl.textContent = userTotalHits.toLocaleString();
  if (soundBtn) {
    soundBtn.textContent = isMuted ? "🔇" : "🔊";
    if (isMuted) soundBtn.classList.add("is-muted");
  }

  const savedLang = localStorage.getItem("clowncloe_lang") || "es";
  setLanguage(savedLang);

  globalHitsRef.on(
    "value",
    (snapshot) => {
      const data = snapshot.val();
      if (data !== null && worldTotalHitsEl) {
        worldTotalHitsEl.textContent = data.toLocaleString();
      }
    },
    (error) => {
      console.error("Firebase Sync Error:", error);
    },
  );

  window.addEventListener("load", () => {
    setTimeout(() => {
      const marta = document.querySelector(".marta-flip-container");
      if (marta) {
        marta.classList.add("show-marta");
      }
    }, 500);
  });
})();
