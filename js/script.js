"use strict";
const copy = {
 "pt-br": {projects:"Projetos",about:"Sobre",contact:"Contato",eyebrow:"ENGENHARIA • DESENVOLVIMENTO • DESIGN",headline:"Engenharia de software.",headline2:"Experiência em design.",intro:"Sou Adriano Caversan. Há mais de 25 anos, conecto tecnologia e criação para desenvolver aplicações, experiências digitais e sistemas que fazem parte do mundo real.",explore:"Explorar projetos ↗",cv:"Currículo PDF",note:"Do código à experiência.<br>Da ideia à aplicação.",selected:"TRABALHOS SELECIONADOS",projectsHeading:"Tecnologia em prática.",projectsIntro:"Software, interfaces e comunicação visual. Diferentes meios, a mesma atenção aos detalhes.",gallery:"Explorar a galeria de trabalhos",skillsLabel:"COMPETÊNCIAS",skillsHeading:"Tecnologia + criação.",allSkills:"Ver conhecimentos técnicos completos",aboutLabel:"SOBRE MIM",aboutHeading:"Um olhar amplo. Uma base técnica.",contactLocation:"Osasco - SP - Brasil",contactCrea:"Profissional registrado no CREA-SP",opportunities:"Áreas de interesse",path:"TRAJETÓRIA",experienceHeading:"Experiência que se conecta.",allExperience:"Ver trajetória completa",educationLabel:"FORMAÇÃO",educationHeading:"Formação universitária",coursesHeading:"Cursos complementares",allCourses:"Ver cursos complementares",talk:"Vamos conversar?",footer:"Engenharia, código e criação.",playMines:"Jogue Mines",open:"Ver trabalho ↗",details:"Ver contribuições",error:"Não foi possível carregar o conteúdo. Verifique sua conexão e tente trocar o idioma novamente."},
 en:{projects:"Projects",about:"About",contact:"Contact",eyebrow:"ENGINEERING • DEVELOPMENT • DESIGN",headline:"Software engineering.",headline2:"A background in design.",intro:"I'm Adriano Caversan. For over 25 years, I've connected technology and creativity to build applications, digital experiences and systems for the real world.",explore:"Explore projects ↗",cv:"Résumé PDF",note:"From code to experience.<br>From idea to application.",selected:"SELECTED WORK",projectsHeading:"Technology in practice.",projectsIntro:"Software, interfaces and visual communication. Different media, the same attention to detail.",gallery:"Explore the work gallery",skillsLabel:"EXPERTISE",skillsHeading:"Technology + creativity.",allSkills:"View full technical skills",aboutLabel:"ABOUT ME",aboutHeading:"A broad perspective. A technical foundation.",contactLocation:"Osasco - SP - Brazil",contactCrea:"Professional registered with CREA-SP",opportunities:"Areas of interest",path:"CAREER",experienceHeading:"Experience that connects.",allExperience:"View full career",educationLabel:"EDUCATION",educationHeading:"University education",coursesHeading:"Additional courses",allCourses:"View additional courses",talk:"Let's talk.",footer:"Engineering, code and creativity.",playMines:"Play Mines",open:"View work ↗",details:"View contributions",error:"Unable to load content. Check your connection and try selecting the language again."}
};
const $ = id => document.getElementById(id);
const escapeText = value => String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const cache = {};
let request = 0, currentLanguage = "pt-br";
const modal = $("media-modal");
function mediaLink(item, image = true) {
 const pdf = /\.pdf$/i.test(item.content);
 const video = /\.mp4$/i.test(item.content);
 const en = currentLanguage === "en";
 const action = pdf ? (en ? "Open PDF ↗" : "Abrir PDF ↗") : video ? (en ? "Watch video ▶" : "Assistir ao vídeo ▶") : (en ? "Enlarge image ⤢" : "Ampliar imagem ⤢");
 return `<a class="media-link" href="${escapeText(item.content)}" ${pdf ? 'target="_blank" rel="noopener"' : 'data-media="true"'} data-title="${escapeText(item.title)}">${image ? `<img loading="lazy" src="${escapeText(item.thumb)}" alt="${escapeText(item.title)}">` : ''}<span class="open-label">${action}</span></a>`;
}
function experience(item) {
 const logos = [[/In-Haus/i,"inhaus.jpg"],[/Whirlpool/i,"whirlpool.jpg"],[/Eletromidia/i,"eletromidia.webp"],[/Hogarth/i,"hogart.webp"],[/Ortiz/i,"ortiz.jpg"],[/Atmo/i,"atmo.webp"],[/Unidas/i,"unidas.webp"],[/Elemidia/i,"elemidia.webp"]];
 const logo = logos.find(([company]) => company.test(item.title));
 return `<article class="experience-row"><div class="experience-heading">${logo ? `<div class="experience-logo"><img src="img/logos/${logo[1]}" alt="" loading="lazy" width="62" height="62"></div>` : ''}<h3>${item.title}</h3></div><details><summary>${copy[currentLanguage].details}</summary><p>${item.description}</p>${item.link ? `<a href="${escapeText(item.link)}" target="_blank" rel="noopener">${escapeText(item.link)} ↗</a>` : ''}</details></article>`;
}
function render(data, lang) {
 const languageChanged = lang !== currentLanguage;
 currentLanguage = lang;
 const en = lang === "en", t = copy[lang];
 document.documentElement.lang = en ? "en" : "pt-BR";
 document.title = en ? "Caversan | Software Development — Adriano Caversan" : "Caversan | Desenvolvimento de Software — Adriano Caversan";
 document.querySelectorAll("[data-copy]").forEach(el => { el.innerHTML = t[el.dataset.copy]; });
 document.querySelectorAll("[data-lang]").forEach(el => el.setAttribute("aria-pressed", String(el.dataset.lang === lang)));
 document.querySelectorAll(".cv").forEach(el => { el.href = data.pdf; });
 const groups = data.sections.portifolio.grid;
 const signage = groups[1].grid[0], banners = groups[0].grid[0];
 const cards = [
 {label:"IN-HAUS INDUSTRIAL / GRUPO GPS",title:en?"Systems for facilities":"Sistemas para facilities",description:en?"Fullstack development of production tracking, kitchen kanban and digital menus for industrial restaurants, across desktop and embedded devices.":"Desenvolvimento fullstack de apontamento de produção, kanban de cozinha e cardápios digitais para restaurantes industriais, em desktop e dispositivos embarcados.",item:{content:"img/portifolio/dmeal.webp",thumb:"img/portifolio/dmeal.webp",title:en?"Dmeal facilities system":"Sistema Dmeal para facilities"},tags:"React · Tauri / Rust · Node.js · SSE · Azure"},
 {label:"ELETROMIDIA / ELEMIDIA / ATMO",title:"Digital signage",description:signage.description,item:signage,tags:".NET · ActionScript · JavaScript · Multimídia"},
 {label:"WHIRLPOOL",title:"E-commerce",description:en?"Development of VTEX stores for Consul, Brastemp, KitchenAid and Compra Certa, combining frontend development and cloud services.":"Desenvolvimento de lojas VTEX para Consul, Brastemp, KitchenAid e Compra Certa, conectando interfaces web e serviços em nuvem.",item:{content:"img/portifolio/brastemp.webp",thumb:"img/portifolio/brastemp.webp",title:en?"Brastemp online store":"Loja virtual Brastemp"},tags:"VTEX · React · Node.js · AWS"},
 {label:en?"DESIGN / MULTIMEDIA":"DESIGN / MULTIMÍDIA",title:en?"Visual experiences":"Experiências visuais",description:banners.description,item:banners,tags:"HTML5 · CSS3 · GSAP · Adobe Animate"}
 ];
 $("featured").innerHTML = cards.map(c => `<article class="project">${c.item ? mediaLink(c.item) : `<div class="text-art ${c.art === 'Commerce' ? 'commerce' : ''}"><span>${c.label}</span><strong>${c.art}</strong><span>${en?'SOFTWARE DEVELOPMENT':'DESENVOLVIMENTO DE SOFTWARE'}</span></div>`}<div class="project-copy"><p class="eyebrow">${c.label}</p><h3>${c.title}</h3><p>${c.description}</p><div class="tags">${c.tags}</div></div></article>`).join("");
 $("gallery").innerHTML = groups.map(g => `<div class="gallery-group"><h3>${g.title}</h3><div class="gallery-grid">${g.grid.map(i => `<article class="gallery-item">${mediaLink(i)}<h4>${i.title}</h4><p>${i.description}</p></article>`).join('')}</div></div>`).join('');
 const skills = en ? [["Web & software","Fullstack applications with React, Node.js, Python and SQL / NoSQL databases. Cloud, automation and CI/CD."],["IoT & automation","Embedded systems, electronics, firmware, sensors and control systems. Connecting software and hardware."],["Design & multimedia","Interfaces, motion design, digital signage and games. Adobe tools, Figma, Blender, Godot, Unreal and Unity."]] : [["Web e software","Aplicações fullstack com React, Node.js, Python e bancos SQL / NoSQL. Cloud, automação e CI/CD."],["IoT e automação","Sistemas embarcados, eletrônica, firmware, sensores e controle. Conectando software e hardware."],["Design e multimídia","Interfaces, motion design, sinalização digital e jogos. Ferramentas Adobe, Figma, Blender, Godot, Unreal e Unity."]];
 const skillImages = ["web", "iot", "multimidia"];
 $("skill-cards").innerHTML = skills.map(([title, text], i) => `<article class="skill-card"><img class="skill-image" src="img/skills/${skillImages[i]}.webp" alt="" width="1672" height="941" loading="lazy" decoding="async"><div class="skill-copy"><h3>${title}</h3><p>${text}</p></div></article>`).join('');
 for(const [id, section] of [["all-skills","skills"],["opportunities","opportunity"]]) $(id).innerHTML = data.sections[section].grid.map(i => `<li>${i}</li>`).join('');
 $("bio").innerHTML = data.sections.profile.description;
 const jobs = data.sections.experience.grid;
 $("recent-experience").innerHTML = jobs.slice(0,3).map(experience).join('');
 $("past-experience").innerHTML = jobs.slice(3).map(experience).join('');
 const degrees = data.sections.graduation.grid;
 const universityLogos = [[/USP/i,"usp.webp"],[/Univesp/i,"univesp.webp"],[/FATEC/i,"fatec.webp"],[/Anhanguera/i,"anhanguera.webp"],[/Unip/i,"unip.jpg"],[/SENAC/i,"senac.webp"]];
 $("degrees").innerHTML = degrees.map(i => {
  const logo = universityLogos.find(([university]) => university.test(i.description));
  return `<article class="degree">${logo ? `<div class="experience-logo"><img src="img/logos/${logo[1]}" alt="" loading="lazy" width="62" height="62"></div>` : ''}<div class="degree-copy"><h3>${i.title}</h3><p>${i.description}</p></div></article>`;
 }).join('');
 $("courses").innerHTML = data.sections.courses.grid.map(i => `<li><b>${i.title}</b><br>${i.description}</li>`).join('');
 $("socials").innerHTML = ["linkedin","github","lattes"].map(k => `<a target="_blank" rel="noopener" href="${escapeText(data.profile[k].description)}"><span class="icon icon-${k}" aria-hidden="true"></span><span>${escapeText(data.profile[k].title)}</span></a>`).join('') + `<a href="tel:+${data.profile.phone.description.replace(/\D/g,'')}"><span class="icon icon-phone" aria-hidden="true"></span><span>${escapeText(data.profile.phone.description)}</span></a>`;
 const publications = data.sections.publications;
 $("publications-label").textContent = en ? "PUBLICATIONS" : "PUBLICAÇÕES";
 $("publications-title").textContent = publications.title;
 $("publications-intro").textContent = publications.description;
 $("publication-cards").innerHTML = publications.grid.map(item => `<article class="publication-card"><p class="eyebrow">${escapeText(item.source)}</p><p class="publication-type">${escapeText(item.type)}</p><h3>${escapeText(item.title)}</h3><p>${escapeText(item.description)}</p><a class="button primary" href="${escapeText(item.link)}" target="_blank" rel="noopener noreferrer">${escapeText(item.action)}</a></article>`).join("");
 $("load-status").textContent = "";
 if (languageChanged) document.dispatchEvent(new Event("portfolio:language-changed"));
}
async function loadLanguage(lang) {
 const token = ++request;
 try {
  if(!cache[lang]) { const response = await fetch(`js/data/${lang}/data.json?v=20261006-1`); if(!response.ok) throw new Error(response.status); cache[lang] = await response.json(); }
  if(token === request) render(cache[lang],lang);
 } catch(error) { if(token === request) $("load-status").textContent = copy[lang].error; console.error("Portfolio:",error); }
}
document.querySelectorAll("[data-lang]").forEach(button => button.addEventListener("click", () => loadLanguage(button.dataset.lang)));
document.addEventListener("click", event => {
 const link = event.target.closest("a[data-media]");
 if(!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
 event.preventDefault();
 const video = /\.mp4$/i.test(link.getAttribute("href"));
 const element = document.createElement(video ? "video" : "img");
 element.src = link.getAttribute("href");
 if(video) { element.controls = true; element.autoplay = true; element.playsInline = true; } else element.alt = link.dataset.title;
 $("media-title").textContent = link.dataset.title;
 $("media-content").replaceChildren(element); modal.showModal();
});
$("close-modal").addEventListener("click", () => modal.close());
modal.addEventListener("click",event => { const rect = modal.getBoundingClientRect(); if(event.target === modal && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) modal.close(); });
modal.addEventListener("close", () => { const video = modal.querySelector("video"); if(video) video.pause(); $("media-content").replaceChildren(); });
$("year").textContent = new Date().getFullYear();
// O HTML inicial já contém o conteúdo em português gerado por build-seo.cjs.
// Renderizar novamente na abertura substitui os elementos usados na restauração da rolagem.
