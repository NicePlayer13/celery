/* Bäckerei alpascha – Interaktion & Bewegung (ohne Libraries) */
(function () {
  "use strict";

  var cfg = window.ALPASCHA_CONFIG || { whatsapp: "", formEndpoint: "", jobs: [] };
  var lang = document.documentElement.lang === "ar" ? "ar" : "de";
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = matchMedia("(hover: hover) and (pointer: fine)").matches;

  var T = {
    de: {
      required: "Bitte füllen Sie dieses Feld aus.",
      email: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
      tel: "Bitte geben Sie eine gültige Telefonnummer ein (mind. 7 Ziffern).",
      consent: "Bitte bestätigen Sie die Datenschutzhinweise.",
      summary: "Bitte prüfen Sie die markierten Felder.",
      network: "Die Anfrage konnte nicht gesendet werden. Bitte rufen Sie uns an oder schreiben Sie eine E-Mail.",
      sending: "Wird gesendet …",
      wa: "Platzhalter: Die WhatsApp-Nummer wird noch ergänzt.",
      waText: "Grüezi, ich interessiere mich für Ihr Fladenbrot und Ihre Produkte.",
      jobOpen: "Offene Stelle",
      jobApply: "Jetzt bewerben",
      jobsSome: "Aktuell offene Stellen:"
    },
    ar: {
      required: "يرجى ملء هذا الحقل.",
      email: "يرجى إدخال بريد إلكتروني صحيح.",
      tel: "يرجى إدخال رقم هاتف صحيح (7 أرقام على الأقل).",
      consent: "يرجى الموافقة على سياسة الخصوصية.",
      summary: "يرجى مراجعة الحقول المُعلَّمة.",
      network: "تعذّر إرسال الطلب. يرجى الاتصال بنا هاتفياً أو مراسلتنا عبر البريد الإلكتروني.",
      sending: "جارٍ الإرسال …",
      wa: "ملاحظة: سيُضاف رقم واتساب لاحقاً.",
      waText: "مرحباً، أنا مهتم بالخبز العربي ومنتجاتكم.",
      jobOpen: "وظيفة شاغرة",
      jobApply: "قدِّم الآن",
      jobsSome: "الوظائف الشاغرة حالياً:"
    }
  }[lang];

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Toast ---------- */
  var toastEl;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      toastEl.setAttribute("role", "status");
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add("is-visible");
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(function () { toastEl.classList.remove("is-visible"); }, 3500);
  }

  /* ---------- Hero-Auftritt: sobald Schriften bereit sind ---------- */
  function loaded() { document.body.classList.add("is-loaded"); }
  if (document.fonts && document.fonts.ready) {
    Promise.race([document.fonts.ready, new Promise(function (r) { setTimeout(r, 900); })]).then(loaded);
  } else { loaded(); }

  /* ---------- Navigation ---------- */
  var header = $(".site-header");
  var toggle = $(".nav-toggle");
  var nav = $("#site-nav");
  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
    header.classList.toggle("menu-open", open);
    document.documentElement.style.overflow = open ? "hidden" : "";
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () { setMenu(toggle.getAttribute("aria-expanded") !== "true"); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { setMenu(false); toggle.focus(); }
    });
  }

  /* Aktiver Menüpunkt je nach Sektion */
  var navLinks = $$('.site-nav a[href*="#"]');
  if ("IntersectionObserver" in window && navLinks.length) {
    var byId = {};
    navLinks.forEach(function (a) { byId[a.hash.slice(1)] = a; });
    var navIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var a = byId[en.target.id];
        if (a && en.isIntersecting) {
          navLinks.forEach(function (l) { l.classList.remove("is-active"); });
          a.classList.add("is-active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(byId).forEach(function (id) { var s = document.getElementById(id); if (s) navIo.observe(s); });
  }

  /* ---------- WhatsApp-Links ---------- */
  $$("[data-whatsapp]").forEach(function (a) {
    if (cfg.whatsapp) {
      a.href = "https://wa.me/" + cfg.whatsapp + "?text=" + encodeURIComponent(T.waText);
      a.target = "_blank";
      a.rel = "noopener";
    } else {
      a.addEventListener("click", function (e) { e.preventDefault(); toast(T.wa); });
    }
  });

  /* ---------- Scroll-Reveals ---------- */
  // Ein komplett per clip-path verdecktes Bild gilt für den Observer als unsichtbar –
  // darum wird bei .wipe das Elternelement beobachtet und alle .wipe darin aufgedeckt.
  var reveals = $$(".reveal, .wipe");
  if ("IntersectionObserver" in window && !reduce) {
    var targets = [];
    reveals.forEach(function (el) {
      var t = el.classList.contains("wipe") ? el.parentElement : el;
      if (!t._reveal) { t._reveal = []; targets.push(t); }
      t._reveal.push(el);
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target._reveal.forEach(function (el) { el.classList.add("is-visible"); });
        io.unobserve(en.target);
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.05 });
    targets.forEach(function (t) { io.observe(t); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Zitat in Wörter zerlegen ---------- */
  var quote = $("[data-words]");
  var words = [];
  if (quote && !reduce) {
    var parts = quote.textContent.trim().split(/(\s+)/);
    quote.textContent = "";
    parts.forEach(function (p) {
      if (/^\s+$/.test(p)) { quote.appendChild(document.createTextNode(" ")); return; }
      var s = document.createElement("span");
      s.className = "w";
      s.textContent = p;
      quote.appendChild(s);
      words.push(s);
    });
  }

  /* ---------- Scroll-gekoppelte Effekte (ein rAF-Loop) ---------- */
  var hero = $(".hero");
  var progress = $(".scroll-progress");
  var parallax = $$("[data-parallax]");
  var steps = $(".steps");
  var stepItems = steps ? $$("li", steps) : [];
  var lastY = window.scrollY;
  var ticking = false;

  if (steps && reduce) {
    steps.style.setProperty("--p", 1);
    stepItems.forEach(function (li) { li.classList.add("is-reached"); });
  }

  function frame() {
    ticking = false;
    var y = window.scrollY;
    var vh = window.innerHeight;

    if (header) {
      if (hero) header.classList.toggle("is-top", y < hero.offsetHeight - header.offsetHeight);
      if (!header.classList.contains("menu-open")) {
        if (y > lastY + 4 && y > 500) header.classList.add("is-hidden");
        else if (y < lastY - 4 || y < 500) header.classList.remove("is-hidden");
      }
    }
    lastY = y;
    if (progress) {
      var max = document.documentElement.scrollHeight - vh;
      progress.style.setProperty("--progress", max > 0 ? (y / max).toFixed(4) : 0);
    }
    if (reduce) return;

    parallax.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -300 || r.top > vh + 300) return;
      var c = r.top + r.height / 2 - vh / 2;
      el.style.transform = "translate3d(0," + (c * -parseFloat(el.dataset.parallax)).toFixed(1) + "px,0)";
    });

    if (steps) {
      var sr = steps.getBoundingClientRect();
      var p = Math.min(1, Math.max(0, (vh * 0.72 - sr.top) / Math.max(sr.height, 1)));
      steps.style.setProperty("--p", p.toFixed(3));
      var n = stepItems.length;
      stepItems.forEach(function (li, i) { li.classList.toggle("is-reached", p > 0.02 && p >= (n > 1 ? i / (n - 1) : 0) * 0.97); });
    }

    if (words.length) {
      var qr = quote.getBoundingClientRect();
      var qp = (vh * 0.88 - qr.top) / (vh * 0.45 + qr.height * 0.7);
      var on = Math.round(Math.min(1, Math.max(0, qp)) * words.length);
      words.forEach(function (w, i) { w.classList.toggle("on", i < on); });
    }
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  frame();

  /* ---------- Zeiger-Effekte (nur Maus/Trackpad) ---------- */
  if (fine && !reduce) {
    // Licht im Hero folgt der Maus, die Szene neigt sich leicht
    var scene = $(".scene");
    if (hero) {
      hero.addEventListener("pointermove", function (e) {
        var r = hero.getBoundingClientRect();
        hero.style.setProperty("--mx", (e.clientX - r.left) + "px");
        hero.style.setProperty("--my", (e.clientY - r.top) + "px");
        if (scene) {
          var nx = (e.clientX - r.left) / r.width - 0.5;
          var ny = (e.clientY - r.top) / r.height - 0.5;
          scene.style.transform = "perspective(1000px) rotateY(" + (nx * 8).toFixed(2) + "deg) rotateX(" + (-ny * 6).toFixed(2) + "deg)";
        }
      });
      hero.addEventListener("pointerleave", function () { if (scene) scene.style.transform = ""; });
      if (scene) scene.style.transition = "transform .9s cubic-bezier(.16,1,.3,1)";
    }

    // Magnetische Buttons
    $$("[data-magnetic]").forEach(function (b) {
      b.style.transition += ", transform .5s cubic-bezier(.16,1,.3,1)";
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2);
        var dy = e.clientY - (r.top + r.height / 2);
        b.style.transform = "translate(" + (dx * 0.22).toFixed(1) + "px," + (dy * 0.35).toFixed(1) + "px)";
      });
      b.addEventListener("pointerleave", function () { b.style.transform = ""; });
    });

    // Produktkarten kippen leicht zur Maus
    $$("[data-tilt]").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        var nx = (e.clientX - r.left) / r.width - 0.5;
        var ny = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = "perspective(900px) rotateY(" + (nx * 7).toFixed(2) + "deg) rotateX(" + (-ny * 7).toFixed(2) + "deg) translateY(-4px)";
      });
      card.addEventListener("pointerleave", function () { card.style.transform = ""; });
    });
  }

  /* ---------- Produkt "anfragen" -> Formular vorbelegen ---------- */
  $$("[data-product]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var box = document.querySelector('input[name="produkte"][value="' + btn.dataset.product + '"]');
      if (box) {
        box.checked = true;
        var label = box.closest(".check");
        if (label) { label.classList.remove("is-pulse"); void label.offsetWidth; label.classList.add("is-pulse"); }
      }
      var target = document.getElementById("anfrage");
      if (target) {
        target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
        var first = document.getElementById("f-firma");
        if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 600);
      }
    });
  });

  /* ---------- Karte erst nach Klick laden (revDSG) ---------- */
  var mapBtn = $("[data-load-map]");
  if (mapBtn) {
    mapBtn.addEventListener("click", function () {
      var wrap = mapBtn.closest(".map");
      var iframe = document.createElement("iframe");
      iframe.src = mapBtn.dataset.loadMap;
      iframe.title = mapBtn.dataset.title || "Karte";
      iframe.loading = "lazy";
      iframe.referrerPolicy = "no-referrer-when-downgrade";
      wrap.appendChild(iframe);
      wrap.querySelector(".map__consent").remove();
    });
  }

  /* ---------- Jobs aus site-config.js ---------- */
  var jobsList = $("#jobs-list");
  var jobsStatus = $("#jobs-status-text");
  if (jobsList && cfg.jobs && cfg.jobs.length) {
    var mail = jobsList.dataset.mail;
    jobsList.innerHTML = "";
    cfg.jobs.forEach(function (job) {
      var j = job[lang] || job.de;
      var li = document.createElement("li");
      li.className = "job";
      li.innerHTML = '<span class="job__badge job__badge--open"></span><h3></h3><p class="job__text"></p><p class="job__type"></p><a class="text-link" href=""></a>';
      li.querySelector(".job__badge").textContent = T.jobOpen;
      li.querySelector("h3").textContent = j.title;
      li.querySelector(".job__text").textContent = j.text || "";
      li.querySelector(".job__type").textContent = j.type || "";
      var a = li.querySelector("a");
      a.textContent = T.jobApply;
      a.href = "mailto:" + mail + "?subject=" + encodeURIComponent((lang === "ar" ? "طلب توظيف: " : "Bewerbung: ") + j.title);
      jobsList.appendChild(li);
    });
    if (jobsStatus) jobsStatus.textContent = T.jobsSome;
  }

  /* ---------- Anfrageformular ---------- */
  var form = $("#anfrage-form");
  if (!form) return;
  var summary = $(".form-summary", form);

  function errorEl(field) { return document.getElementById(field.getAttribute("aria-describedby").split(" ").pop()); }

  function check(field) {
    var msg = "";
    var v = (field.value || "").trim();
    if (field.type === "checkbox") {
      if (field.required && !field.checked) msg = T.consent;
    } else if (field.required && !v) {
      msg = T.required;
    } else if (v && field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
      msg = T.email;
    } else if (v && field.type === "tel" && (v.replace(/\D/g, "").length < 7 || /[^\d\s+()\/.-]/.test(v))) {
      msg = T.tel;
    }
    field.setAttribute("aria-invalid", msg ? "true" : "false");
    var err = errorEl(field);
    if (err) err.textContent = msg;
    return !msg;
  }

  var fields = $$("[data-validate]", form);
  fields.forEach(function (f) {
    f.addEventListener("blur", function () { if (f.getAttribute("aria-invalid")) check(f); });
    f.addEventListener("change", function () { if (f.getAttribute("aria-invalid") === "true") check(f); });
    f.addEventListener("input", function () { if (f.getAttribute("aria-invalid") === "true") check(f); });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var firstBad = null;
    fields.forEach(function (f) { if (!check(f) && !firstBad) firstBad = f; });
    if (firstBad) {
      summary.textContent = T.summary;
      summary.classList.add("is-visible");
      firstBad.focus();
      return;
    }
    summary.classList.remove("is-visible");

    // Honeypot: Bots füllen das versteckte Feld aus
    if (form.querySelector('[name="website"]').value) return;

    var btn = form.querySelector('[type="submit"]');
    var label = btn.innerHTML;
    btn.setAttribute("aria-busy", "true");
    btn.textContent = T.sending;

    var done = function () {
      var success = document.getElementById("form-success");
      form.hidden = true;
      if (form.previousElementSibling) form.previousElementSibling.hidden = true;
      success.hidden = false;
      success.querySelector("h3").focus();
    };
    var fail = function () {
      btn.removeAttribute("aria-busy");
      btn.innerHTML = label;
      summary.textContent = T.network;
      summary.classList.add("is-visible");
      summary.focus();
    };

    if (!cfg.formEndpoint) {
      // Konzept-Modus: nichts wird übermittelt
      setTimeout(done, 700);
      return;
    }
    fetch(cfg.formEndpoint, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    }).then(function (r) { r.ok ? done() : fail(); }).catch(fail);
  });

})();
