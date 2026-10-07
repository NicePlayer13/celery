/* Bäckerei alpascha – Interaktion (ohne Libraries, ~5 KB) */
(function () {
  "use strict";

  var cfg = window.ALPASCHA_CONFIG || { whatsapp: "", formEndpoint: "", jobs: [] };
  var lang = document.documentElement.lang === "ar" ? "ar" : "de";

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
      jobsNone: "Zurzeit sind keine Stellen offen.",
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
      jobsNone: "لا توجد حالياً وظائف شاغرة.",
      jobsSome: "الوظائف الشاغرة حالياً:"
    }
  }[lang];

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

  /* ---------- Navigation ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
    };
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { setOpen(false); toggle.focus(); }
    });
  }

  /* ---------- WhatsApp-Links ---------- */
  document.querySelectorAll("[data-whatsapp]").forEach(function (a) {
    if (cfg.whatsapp) {
      a.href = "https://wa.me/" + cfg.whatsapp + "?text=" + encodeURIComponent(T.waText);
      a.target = "_blank";
      a.rel = "noopener";
    } else {
      a.addEventListener("click", function (e) { e.preventDefault(); toast(T.wa); });
    }
  });

  /* ---------- Scroll-Reveal ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Produkt "anfragen" -> Formular vorbelegen ---------- */
  document.querySelectorAll("[data-product]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var box = document.querySelector('input[name="produkte"][value="' + btn.dataset.product + '"]');
      if (box) box.checked = true;
      var target = document.getElementById("anfrage");
      if (target) {
        target.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
        var first = document.getElementById("f-firma");
        if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 450);
      }
    });
  });

  /* ---------- Karte erst nach Klick laden (revDSG) ---------- */
  var mapBtn = document.querySelector("[data-load-map]");
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
  var jobsList = document.getElementById("jobs-list");
  var jobsStatus = document.getElementById("jobs-status-text");
  if (jobsList && cfg.jobs && cfg.jobs.length) {
    var mail = jobsList.dataset.mail;
    jobsList.innerHTML = "";
    cfg.jobs.forEach(function (job) {
      var j = job[lang] || job.de;
      var li = document.createElement("li");
      li.className = "job";
      li.innerHTML =
        '<span class="job__badge job__badge--open"></span><h3></h3><p class="job__text"></p><p class="job__type"></p>' +
        '<a class="text-link" href=""></a>';
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
  var form = document.getElementById("anfrage-form");
  if (!form) return;
  var summary = form.querySelector(".form-summary");

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

  var fields = form.querySelectorAll("[data-validate]");
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
