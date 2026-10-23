/* =========================================================
   NUVCORE | Scripts do site
   ========================================================= */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  /* ---------- Configuração ---------- */
  var WHATSAPP = "5511912830541"; // DDI + DDD + número, só dígitos

  /* ---------- Mensagens personalizadas do WhatsApp ---------- */
  function saudacao() {
    var h = new Date().getHours();
    if (h >= 5 && h < 12) return "Bom dia";
    if (h >= 12 && h < 18) return "Boa tarde";
    return "Boa noite";
  }

  function mensagemGeral() {
    return saudacao() + ", Nuvcore! Vim pelo site e gostaria de conversar sobre um projeto para a minha empresa.";
  }

  function mensagemServico(servico) {
    return saudacao() + ", Nuvcore! Vim pelo site e tenho interesse em *" + servico + "*. Gostaria de entender como funciona e receber uma proposta.";
  }

  function linkWhatsApp(texto) {
    return "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(texto);
  }

  function abrirWhatsApp(texto) {
    var url = linkWhatsApp(texto);
    var win = window.open(url, "_blank", "noopener");
    if (!win) window.location.href = url;
  }

  document.querySelectorAll("[data-wa]").forEach(function (el) {
    var tipo = el.getAttribute("data-wa");
    var montar = function () { return tipo === "geral" ? mensagemGeral() : mensagemServico(tipo); };
    el.setAttribute("href", linkWhatsApp(montar()));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
    // Atualiza a saudação no momento do clique
    el.addEventListener("click", function () { el.setAttribute("href", linkWhatsApp(montar())); });
  });

  /* ---------- Formulário de contato ---------- */
  var form = document.getElementById("form-contato");
  if (form) {
    var erro = document.getElementById("form-error");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var nome = form.nome.value.trim();
      var empresa = form.empresa.value.trim();
      var servico = form.servico.value;
      var msg = form.mensagem.value.trim();

      form.nome.classList.toggle("is-invalid", !nome);
      form.servico.classList.toggle("is-invalid", !servico);
      if (!nome || !servico) {
        erro.hidden = false;
        (!nome ? form.nome : form.servico).focus();
        return;
      }
      erro.hidden = true;

      var linhas = [
        saudacao() + ", Nuvcore! Vim pelo site e gostaria de solicitar uma proposta.",
        "",
        "*Nome:* " + nome
      ];
      if (empresa) linhas.push("*Empresa:* " + empresa);
      linhas.push("*Serviço de interesse:* " + servico);
      if (msg) { linhas.push(""); linhas.push("*Sobre o projeto:*"); linhas.push(msg); }

      abrirWhatsApp(linhas.join("\n"));
    });

    ["nome", "servico"].forEach(function (n) {
      form[n].addEventListener("input", function () { form[n].classList.remove("is-invalid"); });
      form[n].addEventListener("change", function () { form[n].classList.remove("is-invalid"); });
    });
  }

  /* ---------- Header e botão flutuante ---------- */
  var header = document.querySelector(".site-header");
  var waFloat = document.querySelector(".wa-float");
  var hero = document.querySelector(".hero");
  var ticking = false;

  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 12);
    if (waFloat && hero) waFloat.classList.toggle("is-visible", y > hero.offsetHeight * 0.6);
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("menu");

  function fecharMenu() {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menu");
    document.body.classList.remove("menu-open");
  }

  toggle.addEventListener("click", function () {
    var aberto = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", aberto ? "true" : "false");
    toggle.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
    document.body.classList.toggle("menu-open", aberto);
  });
  nav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", fecharMenu); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") fecharMenu(); });
  window.addEventListener("resize", function () { if (window.innerWidth > 960) fecharMenu(); });

  /* ---------- Link ativo no menu ---------- */
  var links = nav.querySelectorAll("ul a");
  var alvos = Array.prototype.map.call(links, function (a) { return document.querySelector(a.getAttribute("href")); });
  if ("IntersectionObserver" in window) {
    var navObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id); });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    alvos.forEach(function (s) { if (s) navObs.observe(s); });
  }

  /* ---------- Revelar elementos ao rolar (descendo e subindo) ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
        } else if (en.boundingClientRect.top > 0 || en.boundingClientRect.bottom < 0) {
          // Só reinicia quando o elemento saiu totalmente da tela
          en.target.classList.remove("is-in");
        }
      });
    }, { threshold: 0, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { obs.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- Voltar ao topo (Início e logo) ---------- */
  document.querySelectorAll("[data-top]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      var reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduz ? "auto" : "smooth" });
      if (history.replaceState) history.replaceState(null, "", window.location.pathname + window.location.search);
    });
  });

  /* ---------- Ano no rodapé ---------- */
  var ano = document.getElementById("ano");
  if (ano) ano.textContent = new Date().getFullYear();
})();
