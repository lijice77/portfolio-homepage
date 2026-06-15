(async function () {
  const cardClasses = "relative group overflow-hidden bg-surface-container-high aspect-anamorphic hover-scale-img cursor-pointer border border-transparent hover:border-tertiary/50 hover:shadow-[0_0_30px_rgba(233,193,118,0.15)] transition-all duration-500";
  let projects = [];

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function text(selector, value) {
    const el = document.querySelector(selector);
    if (el && value) el.textContent = value;
  }

  function setHref(selector, value) {
    const el = document.querySelector(selector);
    if (el && value) el.setAttribute("href", value);
  }

  function renderHeroTitle(value) {
    const heading = document.querySelector("h1");
    if (!heading || !value) return;
    const title = String(value).trim();
    const midpoint = Math.ceil(title.length / 2);
    heading.textContent = title;
    heading.dataset.mobileTitleA = title.slice(0, midpoint);
    heading.dataset.mobileTitleB = title.slice(midpoint);
  }

  function listItems(items) {
    return (items || []).map(item => `<li>${escapeHtml(item)}</li>`).join("");
  }

  function createPlayerModal() {
    const modal = document.createElement("div");
    modal.id = "project-player";
    modal.className = "fixed inset-0 z-[100] hidden bg-black/85 backdrop-blur-md px-4 py-6 md:px-10";
    modal.innerHTML = `
      <div class="absolute inset-0" data-player-close></div>
      <div class="relative mx-auto flex h-full max-w-6xl flex-col justify-center">
        <div class="mb-4 flex items-start justify-between gap-4">
          <div>
            <p id="player-category" class="font-technical-sm text-technical-sm text-tertiary uppercase tracking-[0.2em]"></p>
            <h3 id="player-title" class="font-headline-md text-headline-md text-primary uppercase"></h3>
            <p id="player-description" class="mt-2 max-w-3xl text-sm leading-6 text-on-surface-variant"></p>
          </div>
          <button aria-label="关闭播放器" class="border border-tertiary px-3 py-2 text-tertiary hover:bg-tertiary hover:text-on-tertiary" data-player-close>
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <div class="relative overflow-hidden border border-surface bg-black shadow-2xl">
          <video id="player-video" class="hidden aspect-video w-full bg-black" controls playsinline preload="metadata"></video>
          <div id="player-empty" class="hidden aspect-video w-full place-items-center bg-surface-container-lowest p-8 text-center">
            <div>
              <span class="material-symbols-outlined mb-4 text-5xl text-tertiary">movie</span>
              <p class="font-body-lg text-primary">这个作品还没有上传视频</p>
              <p class="mt-2 text-sm text-on-surface-variant">请在后台为这个作品上传 mp4、webm 或 ogg 视频。</p>
            </div>
          </div>
        </div>
        <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p id="player-camera" class="font-technical-sm text-technical-sm text-on-surface-variant uppercase tracking-widest"></p>
          <button id="player-fullscreen" class="border border-surface px-4 py-2 font-technical-sm text-technical-sm uppercase tracking-widest text-primary hover:border-tertiary hover:text-tertiary">
            全屏播放
          </button>
        </div>
      </div>`;
    document.body.appendChild(modal);
    modal.addEventListener("click", event => {
      if (event.target.closest("[data-player-close]")) closePlayer();
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && !modal.classList.contains("hidden")) closePlayer();
    });
    document.getElementById("player-fullscreen").addEventListener("click", () => {
      const video = document.getElementById("player-video");
      if (!video.classList.contains("hidden") && video.requestFullscreen) video.requestFullscreen();
    });
  }

  function openPlayer(project) {
    const modal = document.getElementById("project-player");
    const video = document.getElementById("player-video");
    const empty = document.getElementById("player-empty");
    text("#player-category", project.category || "作品");
    text("#player-title", project.title || "未命名作品");
    text("#player-description", project.description || "");
    text("#player-camera", project.camera || "");

    video.pause();
    video.removeAttribute("src");
    video.load();
    if (project.videoUrl) {
      video.src = project.videoUrl;
      video.poster = project.cover || "";
      video.classList.remove("hidden");
      empty.classList.add("hidden");
    } else {
      video.classList.add("hidden");
      empty.classList.remove("hidden");
      empty.classList.add("grid");
    }

    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closePlayer() {
    const modal = document.getElementById("project-player");
    const video = document.getElementById("player-video");
    if (video) {
      video.pause();
      video.removeAttribute("src");
      video.load();
    }
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }

  function projectCard(project, index) {
    const cover = project.cover || "https://lh3.googleusercontent.com/aida-public/AB6AXuAbPvquxq4hS9eB2s4PaluuzqyWH9YsBLRc4H851AM1ZI50L_FY-bqx-7pN_WnMk2roi1BAGM_Nz7ylIRpRrBRBqqojJqfnKCZygEw58JL42SMlygBAHVlnraplMC26jVxzod9kK-DDnhCGWAoXD_gcDS8ZNwolKq1RRuk-OUkB6q4bRwt4Gm5j9zyxdiOi7C1k2znyCHfvNwxp4tcaog1_KT0Qk2dk1_cCH91xB9w54FgyP5-MfWjFw245BSC-82mh0F7EbOswQg";
    const category = escapeHtml(project.category || "作品");
    const title = escapeHtml(project.title || "未命名作品");
    const camera = escapeHtml(project.camera || "");
    const description = escapeHtml(project.description || "");
    return `
      <article class="${cardClasses}" data-project-index="${index}" data-project-id="${escapeHtml(project.id || "")}" tabindex="0" role="button" aria-label="播放 ${title}">
        <img alt="${title}" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" src="${escapeHtml(cover)}"/>
        <div class="absolute inset-0 flex items-center justify-center bg-black/40 transition-colors duration-500 group-hover:bg-black/10">
          <span class="material-symbols-outlined text-5xl text-white opacity-0 drop-shadow-lg transition-opacity duration-300 group-hover:opacity-100" style='font-variation-settings: "FILL" 1;'>${project.videoUrl ? "play_circle" : "movie"}</span>
        </div>
        <div class="absolute bottom-4 left-4 right-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p class="font-technical-sm text-technical-sm mb-1 uppercase tracking-widest text-white">${category}</p>
            <h3 class="font-headline-md text-[24px] uppercase text-primary">${title}</h3>
            ${description ? `<p class="mt-2 max-w-md text-xs leading-5 text-white/75">${description}</p>` : ""}
          </div>
          ${camera ? `<div class="w-fit border border-surface bg-black/50 px-2 py-1 backdrop-blur-sm">
            <span class="font-technical-sm text-[10px] text-secondary">${camera}</span>
          </div>` : ""}
        </div>
      </article>`;
  }

  function btsCard(item) {
    return `
      <div class="group relative">
        <div class="aspect-[3/4] overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 group-hover:border-tertiary">
          <img alt="${escapeHtml(item.label || "拍摄花絮")}" class="bts-parallax h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" src="${escapeHtml(item.image || "")}"/>
          <div class="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <p class="font-technical-sm text-[10px] uppercase tracking-widest text-tertiary">${escapeHtml(item.label || "")}</p>
          </div>
        </div>
      </div>`;
  }

  function renderBts(bts) {
    text('[data-cms="bts-title"]', bts?.title || "拍摄花絮");
    const grid = document.querySelector("#bts-grid");
    const items = Array.isArray(bts?.items) ? bts.items : [];
    if (grid) grid.innerHTML = items.map(btsCard).join("");
  }

  function moveBtsAfterSkills() {
    const btsSection = document.querySelector("#bts");
    const skillsSection = document.querySelector("#skills");
    if (btsSection && skillsSection && skillsSection.nextElementSibling !== btsSection) {
      skillsSection.insertAdjacentElement("afterend", btsSection);
    }
    if (btsSection) {
      btsSection.className = "w-full border-t border-surface py-[128px] px-margin-mobile md:px-margin-desktop";
      const grid = btsSection.querySelector("#bts-grid");
      if (grid) {
        grid.className = "mx-auto grid w-full max-w-container-max grid-cols-1 gap-8 md:grid-cols-3";
      }
    }
  }

  function renderAwardsAndExperience(site) {
    const section = document.querySelector("#awards");
    if (!section) return;
    const experiences = Array.isArray(site.experiences) ? site.experiences : [];
    const brands = Array.isArray(site.serviceBrands) ? site.serviceBrands : [];
    section.innerHTML = `
      <div class="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
        <h2 class="font-headline-md text-headline-md mb-12 flex items-center gap-4 uppercase text-primary">
          <span class="material-symbols-outlined text-sm text-tertiary">military_tech</span>工作经历
        </h2>
        <div class="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
          <div class="space-y-8">
            ${experiences.map((item, index) => `
              <div class="relative border-l border-surface pl-8">
                <div class="absolute left-[-5px] top-0 h-2 w-2 ${index === 0 ? "rounded-full bg-tertiary" : "rounded-full border border-tertiary bg-surface"}"></div>
                <p class="font-technical-sm mb-1 text-tertiary">${escapeHtml(item.period || "")}</p>
                <h4 class="font-body-lg text-primary">${escapeHtml(item.title || "")}</h4>
                <p class="text-body-md leading-7 text-secondary">${escapeHtml(item.description || "")}</p>
              </div>`).join("")}
          </div>
          <div class="lg:pt-1">
            <div class="mb-7 flex items-center gap-3 text-tertiary">
              <span class="material-symbols-outlined">verified</span>
              <h3 class="font-technical-sm uppercase tracking-widest">服务过的品牌</h3>
            </div>
            <div class="grid grid-cols-2 gap-px overflow-hidden border border-surface bg-surface md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              ${brands.map(brand => `
                <article class="flex min-h-[132px] flex-col items-center justify-center gap-4 bg-background/80 p-5 text-center transition-colors duration-300 hover:bg-surface-container-lowest">
                  <div class="relative flex h-16 w-full max-w-[150px] items-center justify-center px-2 py-2 text-xs font-bold text-tertiary">
                    ${brand.logo ? `<img class="relative z-10 max-h-full max-w-full object-contain" alt="${escapeHtml(brand.name || "品牌")} logo" src="${escapeHtml(brand.logo)}" onload="this.nextElementSibling.style.display='none';" onerror="this.style.display='none';">` : ""}
                    <span class="brand-fallback flex items-center justify-center text-center leading-4">${escapeHtml(brand.shortName || (brand.name || "").slice(0, 2))}</span>
                  </div>
                  <p class="font-technical-sm text-[10px] leading-4 text-on-surface-variant">${escapeHtml(brand.name || "")}</p>
                </article>`).join("")}
            </div>
          </div>
        </div>
      </div>`;
  }

  function renderProjectExperience(items) {
    const skillsSection = document.querySelector("#skills");
    if (!skillsSection) return;
    let section = document.querySelector("#project-experience");
    if (!section) {
      section = document.createElement("section");
      section.id = "project-experience";
      section.className = "py-[128px] border-t border-surface";
      skillsSection.parentNode.insertBefore(section, skillsSection);
    }
    const projects = Array.isArray(items) ? items : [];
    section.innerHTML = `
      <div class="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
        <h2 class="font-headline-md text-headline-md mb-12 flex items-center gap-4 uppercase text-primary">
          <span class="material-symbols-outlined text-sm text-tertiary">movie_filter</span>部分项目经验
        </h2>
        <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
          ${projects.map(item => `
            <article class="border border-surface bg-surface-container-lowest p-6 transition-colors duration-300 hover:border-tertiary/60">
              <p class="font-technical-sm mb-3 text-technical-sm uppercase tracking-widest text-tertiary">${escapeHtml(item.role || "")}</p>
              <h3 class="font-body-lg mb-3 text-primary">${escapeHtml(item.name || "")}</h3>
              <p class="text-body-md leading-7 text-on-surface-variant">${escapeHtml(item.description || "")}</p>
            </article>`).join("")}
        </div>
      </div>`;
  }

  function renderSkills(skills) {
    const section = document.querySelector("#skills");
    if (!section) return;
    const groups = Array.isArray(skills) ? skills : [];
    section.innerHTML = `
      <div class="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
        <h2 class="font-headline-md text-headline-md mb-12 flex items-center gap-4 uppercase text-primary">
          <span class="material-symbols-outlined text-sm text-tertiary">architecture</span>专业技能
        </h2>
        <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          ${groups.map(group => `
            <div class="space-y-4">
              <div class="flex items-center gap-3 text-tertiary">
                <span class="material-symbols-outlined">${escapeHtml(group.icon || "check_circle")}</span>
                <h4 class="font-technical-sm uppercase tracking-widest">${escapeHtml(group.title || "技能")}</h4>
              </div>
              <ul class="font-body-md space-y-2 text-on-surface-variant">${listItems(group.items)}</ul>
            </div>`).join("")}
        </div>
      </div>`;
  }

  function renderContact(profile) {
    const footerBlock = document.querySelector("footer .mb-8");
    if (!footerBlock) return;
    let contact = document.querySelector("#contact-details");
    if (!contact) {
      contact = document.createElement("p");
      contact.id = "contact-details";
      contact.className = "mb-6 text-center text-sm leading-6 text-on-surface-variant";
      footerBlock.insertAdjacentElement("afterend", contact);
    }
    const parts = [];
    if (profile.contactEmail) parts.push(`邮箱：${escapeHtml(profile.contactEmail)}`);
    if (profile.wechat) parts.push(`微信：${escapeHtml(profile.wechat)}`);
    contact.innerHTML = parts.join(" <span class=\"text-surface\">/</span> ");
  }

  try {
    createPlayerModal();
    const response = await fetch("/data/site.json", { cache: "no-store" });
    if (!response.ok) return;
    const site = await response.json();
    const profile = site.profile || {};

    document.title = `${profile.brandName || "作品集"} - 作品集主页`;
    text("nav .font-headline-md", profile.brandName);
    text("footer .font-headline-md", profile.brandName);
    renderHeroTitle(profile.heroTitle);
    text("main section p.font-technical-sm", `${profile.name || ""} — ${profile.location || ""}`.trim());

    const contactEmail = profile.contactEmail || "hello@example.com";
    setHref('a[href^="mailto:"]', `mailto:${contactEmail}?subject=Portfolio%20Contact`);
    setHref('footer a[href*="imdb.com"]', profile.socials && profile.socials.imdb);
    setHref('footer a[href*="vimeo.com"]', profile.socials && profile.socials.vimeo);
    setHref('footer a[href*="instagram.com"]', profile.socials && profile.socials.instagram);
    text("footer .tracking-widest.text-center", profile.copyright);
    renderContact(profile);

    const about = site.about || {};
    const aboutSection = document.querySelector("#about .md\\:col-span-8");
    if (aboutSection && (about.title || about.body)) {
      aboutSection.innerHTML = `
        <p class="font-technical-sm mb-4 uppercase tracking-[0.2em] text-tertiary">${escapeHtml(about.title || "关于我")}</p>
        <p class="font-body-lg max-w-3xl leading-8 text-on-surface">${escapeHtml(about.body || "")}</p>`;
    }

    renderBts(site.bts);
    renderAwardsAndExperience(site);
    renderProjectExperience(site.projectExperience);
    renderSkills(site.skills);
    moveBtsAfterSkills();

    const grid = document.querySelector("#showreel .grid");
    projects = Array.isArray(site.projects) ? site.projects.filter(project => project.featured !== false) : [];
    if (grid) {
      grid.innerHTML = projects.length
        ? projects.map(projectCard).join("")
        : `<div class="col-span-full border border-surface p-10 text-center text-on-surface-variant">后台还没有添加作品。</div>`;
    }

    document.querySelector("#showreel .grid")?.addEventListener("click", event => {
      const card = event.target.closest("[data-project-index]");
      if (card) openPlayer(projects[Number(card.dataset.projectIndex)]);
    });
    document.querySelector("#showreel .grid")?.addEventListener("keydown", event => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const card = event.target.closest("[data-project-index]");
      if (card) {
        event.preventDefault();
        openPlayer(projects[Number(card.dataset.projectIndex)]);
      }
    });
  } catch (error) {
    console.warn("无法读取后台数据，已显示静态默认内容。", error);
  }
})();
