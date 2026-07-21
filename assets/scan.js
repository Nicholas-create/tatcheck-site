/* TatCheck hero: perform one scan. Vanilla, ~no weight. */
(function () {
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var stage = document.querySelector(".stage-holder");
  if (!stage) return;
  var card = stage.querySelector(".stage");
  var l1 = stage.querySelector(".l1");
  var l2 = stage.querySelector(".l2");
  var profit = stage.querySelector(".profit");
  var replay = stage.querySelector(".replay");
  var timers = [];

  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }

  function type(el, text, speed, done) {
    el.textContent = "";
    el.classList.add("caret");
    var i = 0;
    (function tick() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i++);
        timers.push(setTimeout(tick, speed));
      } else {
        el.classList.remove("caret");
        if (done) done();
      }
    })();
  }

  function countProfit() {
    var lo = 0, hi = 0, steps = 22, n = 0;
    (function tick() {
      n++;
      lo = Math.round(14 * n / steps);
      hi = Math.round(21 * n / steps);
      profit.textContent = "+£" + lo + " to £" + hi;
      if (n < steps) timers.push(setTimeout(tick, 26));
    })();
  }

  function reset() {
    timers.forEach(clearTimeout);
    timers = [];
    card.classList.remove("scanning", "stuck", "priced", "verdicted");
    replay.classList.remove("show");
    l1.textContent = "";
    l2.textContent = "";
    profit.textContent = "";
    void card.offsetWidth; /* restart CSS animations */
  }

  function play() {
    reset();
    if (reduced) {
      l1.textContent = "Levi's 501 Jeans";
      l2.textContent = "W32 L32 · dark wash";
      profit.textContent = "+£14 to £21";
      card.classList.add("stuck", "priced", "verdicted");
      return;
    }
    card.classList.add("scanning");
    later(function () { type(l1, "Levi's 501 Jeans", 42, function () {
      type(l2, "W32 L32 · dark wash", 34);
    }); }, 700);
    later(function () { card.classList.add("stuck"); }, 2450);
    later(function () { card.classList.add("priced"); }, 2950);
    later(function () { card.classList.add("verdicted"); countProfit(); }, 3650);
    later(function () { replay.classList.add("show"); }, 4400);
  }

  replay.addEventListener("click", play);
  /* start once the stage is on screen */
  if ("IntersectionObserver" in window) {
    var started = false;
    new IntersectionObserver(function (entries, obs) {
      if (!started && entries[0].isIntersecting) { started = true; play(); obs.disconnect(); }
    }, { threshold: 0.4 }).observe(stage);
  } else {
    play();
  }

  /* Scrollytelling: crossfade phone screenshots per beat */
  var beats = document.querySelectorAll(".beat");
  var shots = document.querySelectorAll(".tour-phone img");
  if (beats.length && shots.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var want = e.target.getAttribute("data-shot");
          shots.forEach(function (img) {
            img.classList.toggle("active", img.getAttribute("data-shot") === want);
          });
        }
      });
    }, { threshold: 0.55 });
    beats.forEach(function (b) { io.observe(b); });
  } else {
    if (shots[0]) shots[0].classList.add("active");
  }
})();
