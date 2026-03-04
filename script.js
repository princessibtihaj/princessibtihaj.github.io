/*
Princess Ibtihaj
CS492
Prof. Madi
File Name: style.css
File Explanation: Stylesheet that handles the layout and Bangladesh-inspired look of my site.
*/
// run when page is ready
document.addEventListener("DOMContentLoaded", function() {
  var navToggle = document.querySelector(".nav__toggle");
  var navLinks = document.querySelector(".nav__links");
  var themeBtn = document.getElementById("themeToggle");
  var boat = document.querySelector(".river-map__boat");
  var tooltip = document.getElementById("riverTooltip");
  var stages = document.querySelectorAll(".river-map__stages li");
  var form = document.getElementById("contactForm");
  var formMsg = document.getElementById("formStatus");
  var scrollBtns = document.querySelectorAll("[data-scroll-target]");
  var hero3d = document.getElementById("hero3d");

  // mobile menu - close when they click a link
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function() {
      navLinks.classList.toggle("is-open");
    });
    navLinks.addEventListener("click", function(e) {
      if (e.target.tagName === "A") navLinks.classList.remove("is-open");
    });
  }

  // boat moves along "river" on each click, highlights next stage
  if (boat && stages.length) {
    var step = 0;
    boat.addEventListener("click", function() {
      step = (step + 1) % stages.length;
      stages.forEach(function(li, i) {
        li.classList.toggle("is-active", i === step);
      });
      if (tooltip) {
        tooltip.textContent = step === stages.length - 1
          ? "End of the line (for now)"
          : "Stage " + (step + 1) + " — keep going";
      }
      // move boat position a bit so it feels like progress
      var parent = boat.parentElement;
      if (parent) {
        var rect = parent.getBoundingClientRect();
        var t = step / Math.max(stages.length - 1, 1);
        boat.style.position = "absolute";
        boat.style.left = (24 + t * (rect.width - 100)) + "px";
        boat.style.top = (rect.height / 2 + Math.sin(t * Math.PI) * (rect.height / 4) - 16) + "px";
      }
    });
  }

  // contact form - fallback helper for any form without an action
  if (form && formMsg && !form.getAttribute("action")) {
    form.addEventListener("submit", function(e) {
      e.preventDefault();
      var name = (new FormData(form)).get("name");
      formMsg.textContent = name
        ? "Thanks " + name + "! Your message was recorded."
        : "Thanks for your message!";
      form.reset();
    });
  }

  // smooth scroll for "explore journey" type buttons
  scrollBtns.forEach(function(btn) {
    btn.addEventListener("click", function() {
      var id = btn.getAttribute("data-scroll-target");
      if (id) {
        var el = document.querySelector(id);
        if (el && el.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // simple Three.js scene in hero: BD flag as 3D panel
  if (hero3d && window.THREE) {
    var scene = new THREE.Scene();
    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    var width = hero3d.clientWidth || 280;
    var height = hero3d.clientHeight || width;
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    hero3d.appendChild(renderer.domElement);

    var camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.z = 3.2;

    // green background panel
    // group so we can rotate the whole flag together
    var flagGroup = new THREE.Group();
    var flagGeom = new THREE.PlaneGeometry(2.2, 1.3);
    var flagMat = new THREE.MeshStandardMaterial({
      color: 0x006a4e,
      side: THREE.DoubleSide
    });
    var flag = new THREE.Mesh(flagGeom, flagMat);
    flagGroup.add(flag);

    // red circle on front and back
    var sunGeom = new THREE.CircleGeometry(0.45, 64);
    var sunMat = new THREE.MeshStandardMaterial({
      color: 0xe63946,
      side: THREE.DoubleSide
    });
    var sunFront = new THREE.Mesh(sunGeom, sunMat);
    sunFront.position.set(0.1, 0, 0.02);
    flagGroup.add(sunFront);
    var sunBack = new THREE.Mesh(sunGeom, sunMat);
    sunBack.position.set(0.1, 0, -0.02);
    flagGroup.add(sunBack);

    flagGroup.rotation.x = -0.3;
    flagGroup.rotation.y = 0.5;
    scene.add(flagGroup);

    var light = new THREE.DirectionalLight(0xffffff, 0.9);
    light.position.set(2, 3, 4);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));

    function resizeHero3d() {
      var w = hero3d.clientWidth || 280;
      var h = hero3d.clientHeight || w;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }

    window.addEventListener("resize", resizeHero3d);

    function animateFlag() {
      requestAnimationFrame(animateFlag);
      flagGroup.rotation.y += 0.005;
      renderer.render(scene, camera);
    }

    animateFlag();
  }
});
