/* Shared behaviour for every page. Content comes from data/site-data.js (window.GROVE). */
(function () {
  "use strict";

  var G = window.GROVE;
  if (!G) return;

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };

  // Things to switch off before one page's content is swapped for another's (timers, observers).
  var teardowns = [];
  // Set by music(): refreshes the music buttons after a page swap.
  var musicPaint = null;

  /* ---------- Hours ---------- */

  function toMinutes(hhmm) {
    var p = hhmm.split(":");
    return Number(p[0]) * 60 + Number(p[1]);
  }

  function fmtTime(hhmm) {
    var p = hhmm.split(":");
    var h = Number(p[0]);
    var m = p[1];
    var suffix = h >= 12 ? "PM" : "AM";
    var h12 = h % 12 === 0 ? 12 : h % 12;
    return h12 + (m === "00" ? "" : ":" + m) + " " + suffix;
  }

  function nowAtRestaurant() {
    var parts = new Intl.DateTimeFormat("en-US", {
      timeZone: G.timezone, weekday: "long", hour: "2-digit", minute: "2-digit", hourCycle: "h23"
    }).formatToParts(new Date());
    var get = function (type) {
      for (var i = 0; i < parts.length; i++) if (parts[i].type === type) return parts[i].value;
      return "";
    };
    var dayIndex = 0;
    G.hours.forEach(function (d, i) { if (d.day === get("weekday")) dayIndex = i; });
    return { dayIndex: dayIndex, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
  }

  function openStatus() {
    var now = nowAtRestaurant();
    var today = G.hours[now.dayIndex];
    if (!today.closed && now.minutes >= toMinutes(today.open) && now.minutes < toMinutes(today.close)) {
      return { state: "open", text: "Open now · until " + fmtTime(today.close), dayIndex: now.dayIndex };
    }
    if (!today.closed && now.minutes < toMinutes(today.open)) {
      return { state: "closed", text: "Closed · opens " + fmtTime(today.open), dayIndex: now.dayIndex };
    }
    for (var step = 1; step <= 7; step++) {
      var next = G.hours[(now.dayIndex + step) % 7];
      if (!next.closed) {
        var when = step === 1 ? "tomorrow" : next.day;
        return { state: "closed", text: "Closed · opens " + when + " " + fmtTime(next.open), dayIndex: now.dayIndex };
      }
    }
    return { state: "closed", text: "Closed", dayIndex: now.dayIndex };
  }

  /* ---------- Shared chrome: ribbon, header, footer, order box, phone bar ---------- */

  // A pair of beamed music notes, drawn in whatever colour the button text is.
  function noteSvg(strokeWidth) {
    return '<path d="M9 17.5V5.2l10-2v12.3" fill="none" stroke="currentColor" stroke-width="' + strokeWidth +
      '" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<circle cx="6.5" cy="17.5" r="2.6" fill="currentColor"/><circle cx="16.5" cy="15.5" r="2.6" fill="currentColor"/>';
  }

  var NAV = [
    { href: "menu.html", text: "Menu", page: "menu.html" },
    { href: "index.html#events", text: "Events" },
    { href: "catering.html", text: "Catering", page: "catering.html" },
    { href: "index.html#vip", text: "VIP Club" },
    { href: "index.html#visit", text: "Visit" }
  ];

  function buildChrome() {
    var navLinks = NAV.map(function (n) {
      return '<a href="' + n.href + '">' + n.text + "</a>";
    }).join("");

    var header =
      '<a class="skip" href="#main">Skip to content</a>' +
      (G.draft ? '<div class="draft-ribbon">Preview draft for The Grove\'s review · not the live site yet</div>' : "") +
      '<header class="site-header"><div class="wrap site-header__bar">' +
        '<a class="brand" href="index.html" aria-label="' + esc(G.name) + ' home">' +
          '<img src="images/logo-sign.jpg" alt="' + esc(G.name) + '" width="877" height="569"></a>' +
        '<nav class="nav" id="site-nav" aria-label="Main">' + navLinks + "</nav>" +
        '<div class="header-actions">' +
          (G.anthem && G.anthem.src
            ? '<button type="button" class="music-toggle" data-music aria-pressed="false">' +
                // Plain note = press to play. Note in a crossed circle = press to turn the music off.
                '<svg class="music-toggle__icon music-toggle__icon--play" viewBox="0 0 24 24" aria-hidden="true">' + noteSvg(2) + "</svg>" +
                '<svg class="music-toggle__icon music-toggle__icon--mute" viewBox="0 0 24 24" aria-hidden="true">' +
                  '<g transform="translate(5.3 5.5) scale(0.56)">' + noteSvg(3) + "</g>" +
                  '<circle cx="12" cy="12" r="10.3" fill="none" stroke="currentColor" stroke-width="2"/>' +
                  '<path d="M4.8 4.8l14.4 14.4" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>' +
                '<span class="music-toggle__text" data-music-verb>Play music</span></button>'
            : "") +
          '<span class="open-chip" data-open-chip></span>' +
          '<button type="button" class="btn btn--gold btn--small" data-order>Order online</button>' +
        "</div>" +
        '<button type="button" class="nav-toggle" aria-expanded="false" aria-controls="site-nav" aria-label="Open navigation"><span></span></button>' +
      "</div></header>";

    var footer =
      '<footer class="site-footer"><div class="wrap">' +
        '<div class="footer__grid">' +
          '<div class="footer__brand">' +
            '<img src="images/logo-sign.jpg" alt="' + esc(G.name) + '" width="877" height="569" loading="lazy">' +
            '<p class="script">Great food · Great flavor · Great times</p>' +
          "</div>" +
          '<div class="footer__col"><h3>Find us</h3>' +
            '<a data-directions target="_blank" rel="noopener">' + esc(G.address.street) + "<br>" + esc(G.address.cityLine) + "</a>" +
            "<a data-phone></a>" +
            "<span data-open-line></span>" +
          "</div>" +
          '<div class="footer__col"><h3>Explore</h3>' + navLinks +
            (G.instagram ? '<a href="' + esc(G.instagram) + '" target="_blank" rel="noopener">Instagram</a>' : "") +
            (G.facebook ? '<a href="' + esc(G.facebook) + '" target="_blank" rel="noopener">Facebook</a>' : "") +
          "</div>" +
        "</div>" +
        '<div class="footer__fine"><span>© ' + new Date().getFullYear() + " " + esc(G.name) + "</span>" +
          (G.draft ? "<span>Preview draft. Hours and offers still to be confirmed.</span>" : "") +
        "</div>" +
      "</div></footer>" +

      '<div class="action-bar">' +
        "<a data-phone-bare>Call</a>" +
        '<a data-directions target="_blank" rel="noopener">Directions</a>' +
        '<button type="button" class="is-primary" data-order>Order</button>' +
      "</div>" +

      '<dialog class="order-dialog" id="order-dialog" aria-labelledby="order-title"><div class="order-dialog__body">' +
        '<button type="button" class="order-dialog__close" data-close>Close ✕</button>' +
        '<p class="label" style="color:var(--red-600)">Take out · Curbside pickup</p>' +
        '<h2 id="order-title">Call it in. We\'ll have it hot.</h2>' +
        "<p>Tell us what you want and when you want it. Pick up at the counter or stay in the car and we'll walk it out.</p>" +
        '<a class="btn btn--red" data-phone-cta></a>' +
        '<a class="btn btn--dark" href="menu.html">See the menu first</a>' +
        '<p class="form__fine" data-open-line></p>' +
      "</div></dialog>" +

      '<dialog class="lightbox" id="flyer-box" aria-label="Full size photo">' +
        '<button type="button" class="lightbox__close" data-close-flyer>Close ✕</button>' +
        '<img alt="" data-flyer-img>' +
      "</dialog>";

    var top = $("#site-header");
    var bottom = $("#site-footer");
    if (top) top.outerHTML = header;
    if (bottom) bottom.outerHTML = footer;
  }

  /* ---------- Fill in shared facts ---------- */

  function fillFacts() {
    var status = openStatus();

    $$("[data-phone]").forEach(function (a) { a.textContent = G.phone; a.href = G.phoneHref; });
    $$("[data-phone-bare]").forEach(function (a) { a.href = G.phoneHref; });
    $$("[data-phone-cta]").forEach(function (a) { a.textContent = "Call " + G.phone; a.href = G.phoneHref; });
    $$("[data-directions]").forEach(function (a) { a.href = G.links.directions; });
    $$("[data-reviews]").forEach(function (a) { a.href = G.links.reviews; });
    $$("[data-instagram]").forEach(function (a) { a.href = G.instagram; });
    $$("[data-street]").forEach(function (el) { el.textContent = G.address.street; });
    $$("[data-city]").forEach(function (el) { el.textContent = G.address.cityLine; });
    $$("[data-rating-score]").forEach(function (el) { el.textContent = G.rating.score; });
    $$("[data-rating-count]").forEach(function (el) { el.textContent = G.rating.count; });
    $$("[data-open-chip]").forEach(function (el) { el.textContent = status.text; el.setAttribute("data-state", status.state); });
    $$("[data-open-line]").forEach(function (el) { el.textContent = status.text; });

    $$("[data-hours]").forEach(function (table) {
      // Show Monday first, the way people read a week.
      var order = [1, 2, 3, 4, 5, 6, 0];
      table.innerHTML = "<caption class=\"label\" style=\"text-align:left;color:var(--gold-300);padding-bottom:6px\">Hours</caption>" +
        order.map(function (i) {
          var d = G.hours[i];
          var span = d.closed ? "Closed" : fmtTime(d.open) + " – " + fmtTime(d.close);
          return '<tr class="' + (i === status.dayIndex ? "is-today" : "") + '"><th scope="row">' + d.day + "</th><td>" + span + "</td></tr>";
        }).join("");
    });

    $$("[data-services]").forEach(function (ul) {
      ul.innerHTML = G.services.map(function (s) { return '<li class="fact">' + esc(s) + "</li>"; }).join("");
    });

    $$("[data-map]").forEach(function (frame) { frame.src = G.links.mapEmbed; });

    $$("[data-happy-headline]").forEach(function (el) { el.textContent = G.happyHour.headline; });
    $$("[data-happy-detail]").forEach(function (el) { el.textContent = G.happyHour.detail; });
    $$("[data-happy-when]").forEach(function (el) { el.textContent = G.happyHour.when; });
  }

  /* ---------- Home page pieces ---------- */

  function favCard(f, lead) {
    return '<article class="fav' + (lead ? " fav--lead" : "") + '">' +
      (f.img ? '<img class="fav__img" src="' + esc(f.img) + '" alt="' + esc(f.alt || f.name) + '" loading="lazy">' : "") +
      '<div class="fav__body">' +
        (f.mentions ? '<span class="fav__mentions">Named in ' + f.mentions + " Google reviews</span>" : "") +
        (f.tag ? '<span class="fav__mentions fav__tag">' + esc(f.tag) + "</span>" : "") +
        '<h3 class="fav__name">' + esc(f.name) + "</h3>" +
        "<p>" + esc(f.blurb) + "</p>" +
        '<p class="fav__price">' + esc(f.price) + "</p>" +
      "</div></article>";
  }

  function renderHome() {
    var favs = $("[data-favorites]");
    if (favs && G.favorites.length) {
      favs.innerHTML = favCard(G.favorites[0], true) +
        '<div class="fav-list">' + G.favorites.slice(1).map(function (f) { return favCard(f, false); }).join("") + "</div>";
    }

    var events = $("[data-weekly]");
    if (events && G.weekly) {
      events.innerHTML =
        '<div class="board__head"><h3 class="board__title">This week</h3>' +
        (G.weeklyIsSample ? '<span class="board__tag">Sample lineup</span>' : "") + "</div>" +
        G.weekly.map(function (e) {
          return '<div class="event"><span class="event__day">' + esc(e.day) + "</span><div>" +
            '<p class="event__title">' + esc(e.title) + "</p>" +
            (e.note ? '<p class="event__note">' + esc(e.note) + "</p>" : "") + "</div></div>";
        }).join("");
    }

    var mentions = $("[data-mentions]");
    if (mentions) {
      mentions.innerHTML = G.rating.mentions.map(function (m) {
        return "<li>" + esc(m.dish) + " <b>" + m.count + "</b></li>";
      }).join("");
    }
    $$("[data-quote]").forEach(function (el) { el.textContent = "“" + G.rating.quote + "”"; });

    var themes = $("[data-themes]");
    if (themes && G.rating.themes) {
      themes.innerHTML = G.rating.themes.map(function (t) {
        return '<li class="theme"><h3 class="theme__title">' + esc(t.title) + "</h3><p>" + esc(t.text) + "</p></li>";
      }).join("");
    }

    var featured = $("[data-featured]");
    if (featured && G.rating.featured && G.rating.featured.length) {
      featured.innerHTML = G.rating.featured.map(function (r) {
        return '<figure class="featured__card" style="margin:0"><span class="stars" aria-label="5 stars">★★★★★</span>' +
          '<blockquote style="margin:0">' + esc(r.text) + "</blockquote>" +
          '<figcaption class="featured__name">' + esc(r.name || "Google review") + "</figcaption></figure>";
      }).join("");
    }

    var gallery = $("[data-gallery]");
    if (gallery) {
      gallery.innerHTML = G.gallery.map(function (g) {
        var cls = g.size === "wide" ? "is-wide" : g.size === "tall" ? "is-tall" : "";
        return '<figure class="' + cls + '"><img src="' + esc(g.src) + '" alt="' + esc(g.alt) + '" loading="lazy"></figure>';
      }).join("");
    }
  }

  /* ---------- Events: coming up and past ---------- */

  function todayAtRestaurant() {
    var parts = new Intl.DateTimeFormat("en-US", {
      timeZone: G.timezone, year: "numeric", month: "2-digit", day: "2-digit"
    }).formatToParts(new Date());
    var get = function (type) {
      for (var i = 0; i < parts.length; i++) if (parts[i].type === type) return parts[i].value;
      return "";
    };
    return get("year") + "-" + get("month") + "-" + get("day");
  }

  function fmtDate(iso) {
    var p = iso.split("-");
    var d = new Date(Date.UTC(Number(p[0]), Number(p[1]) - 1, Number(p[2])));
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "UTC", weekday: "short", month: "short", day: "numeric", year: "numeric"
    }).format(d);
  }

  function eventCard(e, past) {
    var when = e.ongoing
      ? (e.badge || "Happening now")
      : (e.when || fmtDate(e.date) + (e.end ? " to " + fmtDate(e.end) : "")) + (e.time ? " · " + e.time : "");
    var flyer = e.img
      ? '<button type="button" class="event-card__flyer" data-flyer="' + esc(e.img) + '" data-flyer-alt="' + esc(e.alt || e.title) +
          '" aria-label="View full size: ' + esc(e.title) + '"><img src="' + esc(e.img) + '" alt="' + esc(e.alt || "") + '" loading="lazy"></button>'
      : "";
    return '<article class="event-card' + (past ? " event-card--past" : "") + '">' + flyer +
      '<div class="event-card__body">' +
        '<p class="event-card__when' + (e.ongoing ? " is-live" : "") + '">' + esc(when) + "</p>" +
        '<h4 class="event-card__title">' + esc(e.title) + "</h4>" +
        (e.blurb ? "<p>" + esc(e.blurb) + "</p>" : "") +
        (!past && e.cta ? '<a class="text-link" href="' + esc(e.cta.href) + '">' + esc(e.cta.text) + "</a>" : "") +
      "</div></article>";
  }

  function renderEvents() {
    var upBox = $("[data-events-upcoming]");
    var pastBox = $("[data-events-past]");
    if (!upBox || !pastBox || !G.events) return;

    var today = todayAtRestaurant();
    var upcoming = [];
    var past = [];
    G.events.forEach(function (e) {
      var last = e.end || e.date;
      if (e.ongoing || (last && last >= today)) upcoming.push(e); else past.push(e);
    });
    // Dated events first, soonest at the top; open-ended ones after. Past events newest first.
    upcoming.sort(function (a, b) {
      if (!!a.ongoing !== !!b.ongoing) return a.ongoing ? 1 : -1;
      return (a.date || "") < (b.date || "") ? -1 : 1;
    });
    past.sort(function (a, b) { return (a.date || "") < (b.date || "") ? 1 : -1; });

    upBox.innerHTML = upcoming.length
      ? upcoming.map(function (e) { return eventCard(e, false); }).join("")
      : '<p class="events__empty">New dates are on the way. Follow us on Instagram or join the VIP Club to hear first.</p>';
    pastBox.innerHTML = past.map(function (e) { return eventCard(e, true); }).join("");
    $$("[data-events-past-wrap]").forEach(function (el) { el.hidden = !past.length; });
  }

  /* ---------- Wall of fame: well-known guests ---------- */

  function renderVisitors() {
    var wrap = $("[data-visitors-wrap]");
    var box = $("[data-visitors]");
    if (!wrap || !box) return;

    var list = G.visitors || [];
    // With no photos yet, the draft shows empty frames so the owner can see the layout.
    // The finished site hides the whole section until there is a photo to show.
    var sample = !list.length && !!G.draft;
    wrap.hidden = !list.length && !sample;
    $$("[data-visitors-sample]", wrap).forEach(function (el) { el.hidden = !sample; });

    if (sample) {
      box.innerHTML = [1, 2, 3, 4].map(function () {
        return '<figure class="snap snap--empty"><div class="snap__photo"><span>Guest photo</span></div>' +
          '<figcaption><span class="snap__name">Guest name</span>' +
          '<span class="snap__note">Who they are · when they came by</span></figcaption></figure>';
      }).join("");
      return;
    }

    box.innerHTML = list.map(function (v) {
      var note = [v.note, v.when].filter(Boolean).join(" · ");
      var alt = v.alt || (v.name ? v.name + " at The Grove" : "A guest at The Grove");
      return '<figure class="snap">' +
        '<button type="button" class="snap__photo" data-flyer="' + esc(v.img) + '" data-flyer-alt="' + esc(alt) +
          '" aria-label="View full size: ' + esc(v.name || "guest photo") + '"><img src="' + esc(v.img) + '" alt="' + esc(alt) + '" loading="lazy"></button>' +
        "<figcaption>" + (v.name ? '<span class="snap__name">' + esc(v.name) + "</span>" : "") +
          (note ? '<span class="snap__note">' + esc(note) + "</span>" : "") + "</figcaption></figure>";
    }).join("");
  }

  /* ---------- The anthem ---------- */

  function music() {
    var A = G.anthem;
    if (!A || !A.src) return;

    var audio = new Audio();
    audio.preload = "none";
    audio.loop = true;
    audio.volume = 0.7;
    audio.src = A.src;

    // "visit" is forgotten when the tab closes; "keep" is remembered on this device.
    function box(area) {
      return {
        get: function (k) { try { return window[area].getItem(k); } catch (e) { return null; } },
        set: function (k, v) { try { window[area].setItem(k, v); } catch (e) { /* private mode */ } },
        drop: function (k) { try { window[area].removeItem(k); } catch (e) { /* private mode */ } }
      };
    }
    var visit = box("sessionStorage");
    var keep = box("localStorage");

    // Should the song be playing? Turning it off is remembered on this device, so nobody has to
    // switch it off twice. Otherwise it is on by default (autoplay) or because they pressed play.
    function wanted() {
      if (keep.get("grove-anthem") === "off") return false;
      return !!A.autoplay || visit.get("grove-anthem") === "on";
    }

    function clock(s) {
      s = Math.max(0, Math.floor(s || 0));
      return Math.floor(s / 60) + ":" + ("0" + (s % 60)).slice(-2);
    }

    function tick() {
      var total = isFinite(audio.duration) && audio.duration ? audio.duration : (A.seconds || 0);
      var frac = total ? Math.min(1, audio.currentTime / total) : 0;
      $$("[data-music-progress]").forEach(function (el) { el.style.transform = "scaleX(" + frac + ")"; });
      $$("[data-music-time]").forEach(function (el) { el.textContent = clock(audio.currentTime) + " / " + clock(total); });
    }

    function paint() {
      var on = !audio.paused;
      document.body.classList.toggle("is-music-on", on);
      $$("[data-music]").forEach(function (b) {
        b.setAttribute("aria-pressed", String(on));
        b.setAttribute("aria-label", on ? "Turn the music off" : "Play " + A.title);
        b.setAttribute("title", on ? "Turn the music off" : "Play the music");
      });
      $$("[data-music-verb]").forEach(function (el) { el.textContent = on ? "Mute music" : "Play music"; });
      $$("[data-music-state]").forEach(function (el) { el.textContent = on ? "Now playing" : "Tap the record to play"; });
      tick();
    }

    function start() {
      keep.drop("grove-anthem");
      visit.set("grove-anthem", "on");
      var attempt = audio.play();
      if (attempt && attempt.catch) attempt.catch(function () { paint(); startOnFirstTouch(); });
    }

    function stop() {
      keep.set("grove-anthem", "off");
      visit.set("grove-anthem", "off");
      audio.pause();
    }

    // Browsers refuse to play sound until the visitor has tapped, clicked or pressed a key.
    // When that blocks the song, start it on their first touch of the page instead.
    var waiting = false;
    var TOUCHES = ["pointerup", "click", "keydown"];
    function startOnFirstTouch() {
      if (waiting) return;
      waiting = true;
      var go = function (e) {
        waiting = false;
        TOUCHES.forEach(function (t) { document.removeEventListener(t, go, true); });
        // A tap on the music button itself is handled by the button.
        if (e.target && e.target.closest && e.target.closest("[data-music]")) return;
        if (wanted() && audio.paused) start();
      };
      TOUCHES.forEach(function (t) { document.addEventListener(t, go, true); });
    }

    document.addEventListener("click", function (e) {
      if (e.target.closest("[data-music]")) {
        if (audio.paused) start(); else stop();
        return;
      }
      var bar = e.target.closest("[data-music-seek]");
      if (bar && isFinite(audio.duration) && audio.duration) {
        var box = bar.getBoundingClientRect();
        audio.currentTime = Math.min(1, Math.max(0, (e.clientX - box.left) / box.width)) * audio.duration;
        tick();
      }
    });

    audio.addEventListener("play", paint);
    audio.addEventListener("pause", paint);
    audio.addEventListener("timeupdate", tick);
    window.addEventListener("pagehide", function () { visit.set("grove-anthem-at", String(audio.currentTime || 0)); });

    var resumeAt = parseFloat(visit.get("grove-anthem-at") || "0") || 0;
    audio.addEventListener("loadedmetadata", function () {
      if (resumeAt > 0 && resumeAt < audio.duration) audio.currentTime = resumeAt;
      resumeAt = 0;
      tick();
    });

    musicPaint = paint;
    paint();
    if (wanted()) start();
  }

  /* ---------- Hero slideshow (home page) ---------- */

  var ICON_PAUSE = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M1 0h3.5v12H1zM7.5 0H11v12H7.5z"/></svg>';
  var ICON_PLAY = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 0l10 6-10 6z"/></svg>';

  function heroSlideshow() {
    var hero = $("[data-hero]");
    var holder = $("[data-hero-slides]");
    var slides = G.heroSlides || [];
    if (!hero || !holder || !slides.length) return;

    var seconds = G.heroSeconds || 6.5;
    var fadeMs = 1300;
    var still = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    hero.style.setProperty("--slide-time", seconds + "s");
    hero.style.setProperty("--pan-time", (seconds + fadeMs / 1000 + 1.2) + "s");
    if (still || slides.length < 2) hero.classList.add("is-static");

    // The first photo loads right away; the others load just before they are needed.
    holder.innerHTML = slides.map(function (s, i) {
      var srcAttr = i === 0 ? "src" : "data-src";
      var setAttr = i === 0 ? "srcset" : "data-srcset";
      return '<picture class="hero__slide" data-pan="' + esc(s.pan || "right") + '">' +
        (s.tall ? '<source media="(max-width: 700px)" ' + setAttr + '="' + esc(s.tall) + '">' : "") +
        "<img " + srcAttr + '="' + esc(s.src) + '" alt="' + esc(s.alt || "") + '"' +
        (s.focus ? ' style="object-position:' + esc(s.focus) + '"' : "") + (i === 0 ? ' fetchpriority="high"' : "") + "></picture>";
    }).join("");
    var nodes = $$(".hero__slide", holder);

    var caption = $("[data-hero-caption]");
    var dotsBox = $("[data-hero-dots]");
    var toggle = $("[data-hero-toggle]");
    if (dotsBox) {
      dotsBox.innerHTML = slides.map(function (s, i) {
        return '<button type="button" class="hero__dot" aria-label="Show photo ' + (i + 1) + ": " + esc(s.caption || "") + '"></button>';
      }).join("");
    }
    var dots = dotsBox ? $$(".hero__dot", dotsBox) : [];

    function load(i) {
      var node = nodes[i];
      $$("[data-srcset]", node).forEach(function (el) { el.srcset = el.getAttribute("data-srcset"); el.removeAttribute("data-srcset"); });
      $$("[data-src]", node).forEach(function (el) { el.src = el.getAttribute("data-src"); el.removeAttribute("data-src"); });
    }

    var current = -1;
    var timer = null;
    var paused = false;

    function schedule() {
      clearTimeout(timer);
      if (paused || still || slides.length < 2) return;
      timer = setTimeout(function () { show(current + 1); }, seconds * 1000);
    }

    function show(i) {
      var prev = nodes[current];
      current = (i + slides.length) % slides.length;
      var node = nodes[current];
      load(current);
      load((current + 1) % slides.length);

      // Restart the pan on the incoming photo; the outgoing one keeps moving while it fades.
      if (prev !== node) {
        node.classList.remove("is-panning");
        void node.offsetWidth;
      }
      node.classList.add("is-panning", "is-active");
      if (prev && prev !== node) {
        prev.classList.remove("is-active");
        setTimeout(function () {
          if (!prev.classList.contains("is-active")) prev.classList.remove("is-panning");
        }, fadeMs + 100);
      }

      if (caption) caption.textContent = slides[current].caption || "";
      dots.forEach(function (d, n) {
        d.removeAttribute("aria-current");
        if (n === current) { void d.offsetWidth; d.setAttribute("aria-current", "true"); }
      });
      schedule();
    }

    function setPaused(value) {
      paused = value;
      hero.classList.toggle("is-paused", paused);
      if (toggle) {
        toggle.setAttribute("aria-label", paused ? "Play slideshow" : "Pause slideshow");
        toggle.innerHTML = paused ? ICON_PLAY : ICON_PAUSE;
      }
      if (paused) clearTimeout(timer); else show(current + 1);
    }

    dots.forEach(function (d, n) { d.addEventListener("click", function () { show(n); }); });
    if (toggle) {
      toggle.innerHTML = ICON_PAUSE;
      toggle.addEventListener("click", function () { setPaused(!paused); });
    }
    // Hold the slideshow while the page is in a background tab.
    var onVisibility = function () {
      if (document.hidden) clearTimeout(timer); else schedule();
    };
    document.addEventListener("visibilitychange", onVisibility);
    teardowns.push(function () {
      still = true;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    });

    show(0);
  }

  /* ---------- Menu page ---------- */

  // sub: true tucks a row under the item above it (combos, sizes, add-ons).
  function itemRow(it) {
    return '<div class="item' + (it.sub ? " item--sub" : "") + '"><span class="item__what"><span class="item__name">' + esc(it.name) + "</span>" +
      (it.detail ? ' <span class="item__detail">' + esc(it.detail) + "</span>" : "") + "</span>" +
      (it.price ? '<span class="item__dots" aria-hidden="true"></span><span class="item__price">$' + esc(it.price) + "</span>" : "") +
      "</div>";
  }

  function renderMenu() {
    var grid = $("[data-menu]");
    if (!grid) return;

    var cards = G.menu.map(function (sec) {
      var body = "";
      if (sec.note) body += '<p class="menu-card__note">' + esc(sec.note) + "</p>";
      if (sec.items) body += sec.items.map(itemRow).join("");
      if (sec.plain) body += '<ul class="chips">' + sec.plain.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ul>";
      if (sec.chips) {
        body += '<p class="chips-label">' + esc(sec.chipsLabel || "") + "</p>" +
          '<ul class="chips">' + sec.chips.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("") + "</ul>";
      }
      if (sec.footnote) body += '<p class="menu-card__foot">' + esc(sec.footnote) + "</p>";
      var photo = sec.img ? '<img class="menu-card__img" src="' + esc(sec.img) + '" alt="' + esc(sec.imgAlt || "") + '" loading="lazy">' : "";
      return '<section class="menu-card" id="' + esc(sec.id) + '"><div class="menu-card__head"><h2 class="menu-card__title">' +
        esc(sec.title) + "</h2></div>" + photo + '<div class="menu-card__body">' + body + "</div></section>";
    });

    var bar = G.bar;
    cards.push(
      '<section class="menu-card menu-card--bar" id="cocktails"><div class="menu-card__head"><h2 class="menu-card__title">Cocktails</h2></div>' +
      (bar.cocktailImg ? '<img class="menu-card__img" style="object-position:50% 38%" src="' + esc(bar.cocktailImg) + '" alt="' + esc(bar.cocktailImgAlt || "") + '" loading="lazy">' : "") +
      '<div class="menu-card__body">' +
      (bar.cocktailNote ? '<p class="menu-card__note">' + esc(bar.cocktailNote) + "</p>" : "") +
      bar.cocktails.map(function (c) {
        return '<div class="cocktail"><p class="cocktail__name"><span>' + esc(c.name) +
          (c.tag ? '<span class="cocktail__tag">' + esc(c.tag) + "</span>" : "") + "</span>" +
          (c.price ? '<span class="item__dots" aria-hidden="true"></span><span class="item__price">$' + esc(c.price) + "</span>" : "") + "</p>" +
          '<p class="cocktail__detail">' + esc(c.detail) + "</p></div>";
      }).join("") + "</div></section>"
    );
    cards.push(
      '<section class="menu-card menu-card--bar" id="beer"><div class="menu-card__head"><h2 class="menu-card__title">Beer &amp; Seltzers</h2></div>' +
      '<div class="menu-card__body"><p class="menu-card__note">' + esc(G.happyHour.headline) + " at happy hour.</p>" +
      bar.beer.map(itemRow).join("") + "</div></section>"
    );
    grid.innerHTML = cards.join("");

    var nav = $("[data-menu-nav]");
    if (nav) {
      var links = G.menu.map(function (s) { return { id: s.id, title: s.nav || s.title }; })
        .concat([{ id: "cocktails", title: "Cocktails" }, { id: "beer", title: "Beer" }]);
      nav.innerHTML = links.map(function (l) { return '<li><a href="#' + l.id + '">' + esc(l.title) + "</a></li>"; }).join("");
    }
  }

  /* ---------- Behaviour ---------- */

  function wireUp() {
    // The logo plaque tucks up into the header once the page is scrolled.
    var headerEl = $(".site-header");
    if (headerEl) {
      var onScroll = function () { headerEl.classList.toggle("is-scrolled", window.scrollY > 60); };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    var toggle = $(".nav-toggle");
    var nav = $("#site-nav");
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        var open = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(open));
      });
      nav.addEventListener("click", function (e) {
        if (e.target.closest("a")) { nav.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); }
      });
    }

    var dialog = $("#order-dialog");
    document.addEventListener("click", function (e) {
      if (e.target.closest("[data-order]")) {
        if (G.orderUrl) { window.open(G.orderUrl, "_blank", "noopener"); return; }
        if (dialog && dialog.showModal) dialog.showModal(); else location.href = G.phoneHref;
      }
      if (dialog && (e.target.closest("[data-close]") || e.target === dialog)) dialog.close();

      // Event flyers open full size.
      var flyerBox = $("#flyer-box");
      var flyerBtn = e.target.closest("[data-flyer]");
      if (flyerBox && flyerBtn && flyerBox.showModal) {
        var big = $("[data-flyer-img]", flyerBox);
        big.src = flyerBtn.getAttribute("data-flyer");
        big.alt = flyerBtn.getAttribute("data-flyer-alt") || "";
        flyerBox.showModal();
      }
      if (flyerBox && (e.target.closest("[data-close-flyer]") || e.target === flyerBox)) flyerBox.close();
    });

    // The forms are a working demo only: nothing is sent anywhere until a form service is connected.
    document.addEventListener("submit", function (e) {
      var form = e.target.closest && e.target.closest("[data-demo-form]");
      if (!form) return;
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      form.classList.add("is-sent");
      var done = $(".form__done", form);
      if (done) { done.setAttribute("tabindex", "-1"); done.focus(); }
    });
  }

  /* ---------- Each page's own content ---------- */

  // "/grove-grill/" and "/grove-grill/index.html" are the same page.
  function pageKey(url) { return url.pathname.replace(/index\.html$/, ""); }
  var shownPage = pageKey(location);

  function markCurrent() {
    $$("#site-nav a, .footer__col a").forEach(function (a) {
      var u = new URL(a.href, location.href);
      if (u.origin === location.origin && !u.hash && pageKey(u) === shownPage) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  // Runs on first load and again every time another page's content is swapped in.
  function initPage() {
    fillFacts();
    renderHome();
    renderEvents();
    renderVisitors();
    heroSlideshow();
    renderMenu();
    markCurrent();
    if (musicPaint) musicPaint();

    var items = $$(".reveal");
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
      }, { rootMargin: "0px 0px -8% 0px" });
      items.forEach(function (el) { io.observe(el); });
      teardowns.push(function () { io.disconnect(); });
    } else {
      items.forEach(function (el) { el.classList.add("is-in"); });
    }
  }

  /* ---------- Moving between pages without reloading ----------
     A normal link loads a brand new page, which cuts the song off (and phones then keep it
     silent until the next tap). Instead, links to our own pages fetch the next page and swap
     its content in, so the header, the footer and the music carry on untouched.            */

  var pageCache = {};

  function fetchPage(url) {
    var key = pageKey(url);
    if (!pageCache[key]) {
      pageCache[key] = fetch(url.pathname, { credentials: "same-origin" }).then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.text();
      });
      pageCache[key].catch(function () { delete pageCache[key]; });
    }
    return pageCache[key];
  }

  // glide = true scrolls smoothly (same page); false jumps straight there (a new page).
  function scrollToPlace(hash, glide) {
    var how = glide ? "smooth" : "instant";
    var target = null;
    if (hash && hash.length > 1) {
      try { target = document.getElementById(decodeURIComponent(hash.slice(1))); } catch (e) { target = null; }
    }
    try {
      if (target) target.scrollIntoView({ behavior: how, block: "start" });
      else window.scrollTo({ top: 0, left: 0, behavior: how });
    } catch (e) {
      if (target) target.scrollIntoView(); else window.scrollTo(0, 0);
    }
  }

  function goTo(url, addToHistory) {
    $$("dialog[open]").forEach(function (d) { d.close(); });

    // Same page: only the place on the page changes.
    if (pageKey(url) === shownPage) {
      if (addToHistory && url.href !== location.href) history.pushState(null, "", url.href);
      scrollToPlace(url.hash, true);
      return;
    }

    fetchPage(url).then(function (html) {
      var next = new DOMParser().parseFromString(html, "text/html");
      var incoming = next.querySelector("main");
      var main = $("main");
      if (!incoming || !main) throw new Error("no page content");

      teardowns.forEach(function (stop) { stop(); });
      teardowns = [];

      main.innerHTML = incoming.innerHTML;
      document.title = next.title;
      var desc = next.querySelector('meta[name="description"]');
      var mine = $('meta[name="description"]');
      if (desc && mine) mine.setAttribute("content", desc.getAttribute("content"));

      if (addToHistory) history.pushState(null, "", url.href);
      shownPage = pageKey(url);
      initPage();
      scrollToPlace(url.hash, false);
    }).catch(function () {
      // If the swap fails for any reason, fall back to an ordinary page load.
      location.href = url.href;
    });
  }

  function router() {
    if (!window.fetch || !window.DOMParser || !window.history || !history.pushState) return;

    document.addEventListener("click", function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest && e.target.closest("a[href]");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      var url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (!/(\/|\.html)$/.test(url.pathname)) return;
      // A jump within the page we are already on: the browser handles that fine by itself.
      if (url.hash && url.pathname === location.pathname && url.search === location.search) return;
      e.preventDefault();
      goTo(url, true);
    });

    // Back and forward buttons.
    window.addEventListener("popstate", function () { goTo(new URL(location.href), false); });

    // Fetch the other pages quietly in the background so switching is instant.
    var warm = function () {
      $$("#site-nav a").forEach(function (a) {
        var u = new URL(a.href, location.href);
        if (pageKey(u) !== shownPage) fetchPage(u).catch(function () {});
      });
    };
    if (window.requestIdleCallback) requestIdleCallback(warm, { timeout: 4000 }); else setTimeout(warm, 2500);
  }

  buildChrome();
  music();
  wireUp();
  initPage();
  router();
})();
