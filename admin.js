let site = null;

const $ = selector => document.querySelector(selector);
const projectsEl = $("#projects");
const btsEl = $("#btsItems");
const experiencesEl = $("#experiences");
const awardsEl = $("#awardsList");
const projectExperienceEl = $("#projectExperienceList");
const skillsEl = $("#skillsList");

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2600);
}

function slugify(value) {
  return String(value || "project").trim().toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, "-").replace(/^-+|-+$/g, "") || `project-${Date.now()}`;
}

function fillValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value || "";
}

function readProfile() {
  site.profile.brandName = $("#brandName").value.trim();
  site.profile.heroTitle = $("#heroTitle").value.trim();
  site.profile.name = $("#name").value.trim();
  site.profile.location = $("#location").value.trim();
  site.profile.contactEmail = $("#contactEmail").value.trim();
  site.profile.wechat = $("#wechat").value.trim();
  site.profile.copyright = $("#copyright").value.trim();
  site.profile.socials = {
    imdb: $("#imdb").value.trim(),
    vimeo: $("#vimeo").value.trim(),
    instagram: $("#instagram").value.trim()
  };
  site.about = {
    title: $("#aboutTitle").value.trim(),
    body: $("#aboutBody").value.trim()
  };
  site.bts = site.bts || { title: "", items: [] };
  site.bts.title = $("#btsTitle").value.trim();
}

function renderProfile() {
  fillValue("brandName", site.profile.brandName);
  fillValue("heroTitle", site.profile.heroTitle);
  fillValue("name", site.profile.name);
  fillValue("location", site.profile.location);
  fillValue("contactEmail", site.profile.contactEmail);
  fillValue("wechat", site.profile.wechat);
  fillValue("copyright", site.profile.copyright);
  fillValue("imdb", site.profile.socials && site.profile.socials.imdb);
  fillValue("vimeo", site.profile.socials && site.profile.socials.vimeo);
  fillValue("instagram", site.profile.socials && site.profile.socials.instagram);
  fillValue("aboutTitle", site.about && site.about.title);
  fillValue("aboutBody", site.about && site.about.body);
  fillValue("btsTitle", site.bts && site.bts.title);
}

async function uploadAsset(file) {
  const maxSize = 500 * 1024 * 1024;
  const allowed = /^(image\/(?:png|jpeg|jpg|webp|gif)|video\/(?:mp4|webm|ogg|quicktime))$/;
  if (file.size > maxSize) throw new Error("文件太大，请上传 500MB 以内的视频或图片。");
  if (!allowed.test(file.type)) throw new Error("只支持 png、jpg、webp、gif 图片，以及 mp4、webm、ogg、mov 视频。");

  const formData = new FormData();
  formData.append("asset", file, file.name);
  const response = await fetch("/api/assets", {
    method: "POST",
    body: formData
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "上传失败");
  return payload.url;
}

function projectTemplate(project, index) {
  return `
    <article class="project" data-index="${index}">
      <div class="cover">
        <img src="${escapeHtml(project.cover || "")}" alt="${escapeHtml(project.title || "作品封面")}">
        <input type="file" accept="image/*" data-action="upload-cover">
        <label>封面地址<input data-field="cover" value="${escapeHtml(project.cover || "")}"></label>
        <input type="file" accept="video/mp4,video/webm,video/ogg,video/quicktime,.mov" data-action="upload-video">
        <label>视频地址<input data-field="videoUrl" value="${escapeHtml(project.videoUrl || "")}"></label>
      </div>
      <div class="project-fields">
        <label>作品名称<input data-field="title" value="${escapeHtml(project.title || "")}"></label>
        <label>作品类型<input data-field="category" value="${escapeHtml(project.category || "")}"></label>
        <label>摄影机 / 技术规格<input data-field="camera" value="${escapeHtml(project.camera || "")}"></label>
        <label>是否在首页显示
          <select data-field="featured">
            <option value="true" ${project.featured !== false ? "selected" : ""}>显示</option>
            <option value="false" ${project.featured === false ? "selected" : ""}>隐藏</option>
          </select>
        </label>
        <label class="wide">作品说明<textarea data-field="description" rows="4">${escapeHtml(project.description || "")}</textarea></label>
        <div class="row">
          <span>${escapeHtml(project.id || "")}</span>
          <button class="remove" data-action="remove" type="button">删除作品</button>
        </div>
      </div>
    </article>`;
}

function renderProjects() {
  projectsEl.innerHTML = site.projects.map(projectTemplate).join("");
}

function btsTemplate(item, index) {
  return `
    <article class="project compact-card" data-collection="bts" data-index="${index}">
      <div class="cover">
        <img src="${escapeHtml(item.image || "")}" alt="${escapeHtml(item.label || "花絮图片")}">
        <input type="file" accept="image/*" data-action="upload-bts">
        <label>图片地址<input data-field="image" value="${escapeHtml(item.image || "")}"></label>
      </div>
      <div class="project-fields">
        <label class="wide">标签<input data-field="label" value="${escapeHtml(item.label || "")}"></label>
        <div class="row"><span>花絮 ${index + 1}</span><button class="remove" data-action="remove-bts" type="button">删除花絮</button></div>
      </div>
    </article>`;
}

function experienceTemplate(item, index) {
  return `
    <article class="project compact-card" data-collection="experiences" data-index="${index}">
      <div class="project-fields full">
        <label>时间<input data-field="period" value="${escapeHtml(item.period || "")}"></label>
        <label>标题<input data-field="title" value="${escapeHtml(item.title || "")}"></label>
        <label class="wide">说明<textarea data-field="description" rows="3">${escapeHtml(item.description || "")}</textarea></label>
        <div class="row"><span>经历 ${index + 1}</span><button class="remove" data-action="remove-experience" type="button">删除经历</button></div>
      </div>
    </article>`;
}

function awardTemplate(item, index) {
  return `
    <article class="project compact-card" data-collection="awards" data-index="${index}">
      <div class="project-fields full">
        <label>荣誉标题<input data-field="title" value="${escapeHtml(item.title || "")}"></label>
        <label>荣誉说明<input data-field="description" value="${escapeHtml(item.description || "")}"></label>
        <div class="row"><span>荣誉 ${index + 1}</span><button class="remove" data-action="remove-award" type="button">删除荣誉</button></div>
      </div>
    </article>`;
}

function projectExperienceTemplate(item, index) {
  return `
    <article class="project compact-card" data-collection="projectExperience" data-index="${index}">
      <div class="project-fields full">
        <label>项目名称<input data-field="name" value="${escapeHtml(item.name || "")}"></label>
        <label>角色 / 职责<input data-field="role" value="${escapeHtml(item.role || "")}"></label>
        <label class="wide">负责内容<textarea data-field="description" rows="3">${escapeHtml(item.description || "")}</textarea></label>
        <div class="row"><span>项目经验 ${index + 1}</span><button class="remove" data-action="remove-project-experience" type="button">删除项目经验</button></div>
      </div>
    </article>`;
}

function skillTemplate(group, index) {
  return `
    <article class="project compact-card" data-collection="skills" data-index="${index}">
      <div class="project-fields full">
        <label>技能组名称<input data-field="title" value="${escapeHtml(group.title || "")}"></label>
        <label>图标名称<input data-field="icon" value="${escapeHtml(group.icon || "")}"></label>
        <label class="wide">技能条目（每行一个）<textarea data-field="items" rows="5">${escapeHtml((group.items || []).join("\n"))}</textarea></label>
        <div class="row"><span>技能组 ${index + 1}</span><button class="remove" data-action="remove-skill" type="button">删除技能组</button></div>
      </div>
    </article>`;
}

function renderBts() {
  btsEl.innerHTML = (site.bts.items || []).map(btsTemplate).join("");
}

function renderExperiences() {
  experiencesEl.innerHTML = site.experiences.map(experienceTemplate).join("");
}

function renderAwards() {
  awardsEl.innerHTML = site.awards.map(awardTemplate).join("");
}

function renderProjectExperience() {
  projectExperienceEl.innerHTML = site.projectExperience.map(projectExperienceTemplate).join("");
}

function renderSkills() {
  skillsEl.innerHTML = site.skills.map(skillTemplate).join("");
}

function renderAllCollections() {
  renderBts();
  renderExperiences();
  renderAwards();
  renderProjectExperience();
  renderSkills();
}

function syncProject(index, field, value) {
  const project = site.projects[index];
  if (!project) return;
  project[field] = field === "featured" ? value === "true" : value;
  if (field === "title") project.id = project.id || slugify(value);
}

async function loadSite() {
  const response = await fetch("/api/site", { cache: "no-store" });
  site = await response.json();
  site.profile = site.profile || {};
  site.profile.socials = site.profile.socials || {};
  site.about = site.about || {};
  site.projects = Array.isArray(site.projects) ? site.projects : [];
  site.bts = site.bts || { title: "拍摄花絮", items: [] };
  site.bts.items = Array.isArray(site.bts.items) ? site.bts.items : [];
  site.experiences = Array.isArray(site.experiences) ? site.experiences : [];
  site.awards = Array.isArray(site.awards) ? site.awards : [];
  site.projectExperience = Array.isArray(site.projectExperience) ? site.projectExperience : [];
  site.skills = Array.isArray(site.skills) ? site.skills : [];
  site.projects.forEach(project => {
    if (!Object.prototype.hasOwnProperty.call(project, "videoUrl")) project.videoUrl = "";
  });
  renderProfile();
  renderProjects();
  renderAllCollections();
}

async function saveSite() {
  readProfile();
  const response = await fetch("/api/site", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(site)
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "保存失败");
  showToast("已保存，主页刷新后生效。");
}

$("#saveBtn").addEventListener("click", () => {
  saveSite().catch(error => showToast(error.message));
});

$("#addProject").addEventListener("click", () => {
  const id = `project-${Date.now()}`;
  site.projects.unshift({
    id,
    title: "新作品",
    category: "作品类型",
    description: "",
    camera: "",
    cover: "",
    videoUrl: "",
    featured: true
  });
  renderProjects();
});

$("#addBts").addEventListener("click", () => {
  site.bts.items.unshift({ label: "新花絮", image: "" });
  renderBts();
});

$("#addExperience").addEventListener("click", () => {
  site.experiences.unshift({ period: "年份", title: "经历标题", description: "" });
  renderExperiences();
});

$("#addAward").addEventListener("click", () => {
  site.awards.unshift({ title: "荣誉标题", description: "" });
  renderAwards();
});

$("#addProjectExperience").addEventListener("click", () => {
  site.projectExperience.unshift({ name: "新项目", role: "负责角色", description: "" });
  renderProjectExperience();
});

$("#addSkill").addEventListener("click", () => {
  site.skills.unshift({ title: "新技能组", icon: "check_circle", items: ["技能条目"] });
  renderSkills();
});

projectsEl.addEventListener("input", event => {
  const projectEl = event.target.closest(".project");
  const field = event.target.dataset.field;
  if (!projectEl || !field) return;
  syncProject(Number(projectEl.dataset.index), field, event.target.value);
  if (field === "cover") projectEl.querySelector("img").src = event.target.value;
});

projectsEl.addEventListener("change", async event => {
  const projectEl = event.target.closest(".project");
  if (!projectEl) return;
  const index = Number(projectEl.dataset.index);
  if (event.target.dataset.field === "featured") {
    syncProject(index, "featured", event.target.value);
  }

  if ((event.target.dataset.action === "upload-cover" || event.target.dataset.action === "upload-video") && event.target.files[0]) {
    try {
      const isVideo = event.target.dataset.action === "upload-video";
      showToast(isVideo ? "正在上传视频..." : "正在上传封面...");
      const url = await uploadAsset(event.target.files[0]);
      const field = isVideo ? "videoUrl" : "cover";
      site.projects[index][field] = url;
      projectEl.querySelector(`input[data-field="${field}"]`).value = url;
      if (!isVideo) projectEl.querySelector("img").src = url;
      showToast(isVideo ? "视频已上传，记得保存全部。" : "封面已上传，记得保存全部。");
    } catch (error) {
      showToast(error.message);
    }
  }
});

projectsEl.addEventListener("click", event => {
  if (event.target.dataset.action !== "remove") return;
  const projectEl = event.target.closest(".project");
  site.projects.splice(Number(projectEl.dataset.index), 1);
  renderProjects();
});

function syncCollectionInput(event) {
  const card = event.target.closest("[data-collection]");
  const field = event.target.dataset.field;
  if (!card || !field) return;
  const index = Number(card.dataset.index);
  const collection = card.dataset.collection;
  const target = collection === "bts" ? site.bts.items[index] : site[collection][index];
  if (!target) return;
  target[field] = field === "items"
    ? event.target.value.split(/\r?\n/).map(item => item.trim()).filter(Boolean)
    : event.target.value;
  if (collection === "bts" && field === "image") card.querySelector("img").src = event.target.value;
}

[btsEl, experiencesEl, awardsEl, projectExperienceEl, skillsEl].forEach(container => {
  container.addEventListener("input", syncCollectionInput);
});

btsEl.addEventListener("change", async event => {
  const card = event.target.closest("[data-collection='bts']");
  if (!card || event.target.dataset.action !== "upload-bts" || !event.target.files[0]) return;
  const index = Number(card.dataset.index);
  try {
    showToast("正在上传花絮图片...");
    const url = await uploadAsset(event.target.files[0]);
    site.bts.items[index].image = url;
    card.querySelector('input[data-field="image"]').value = url;
    card.querySelector("img").src = url;
    showToast("花絮图片已上传，记得保存全部。");
  } catch (error) {
    showToast(error.message);
  }
});

btsEl.addEventListener("click", event => {
  if (event.target.dataset.action !== "remove-bts") return;
  site.bts.items.splice(Number(event.target.closest("[data-collection]").dataset.index), 1);
  renderBts();
});

experiencesEl.addEventListener("click", event => {
  if (event.target.dataset.action !== "remove-experience") return;
  site.experiences.splice(Number(event.target.closest("[data-collection]").dataset.index), 1);
  renderExperiences();
});

awardsEl.addEventListener("click", event => {
  if (event.target.dataset.action !== "remove-award") return;
  site.awards.splice(Number(event.target.closest("[data-collection]").dataset.index), 1);
  renderAwards();
});

projectExperienceEl.addEventListener("click", event => {
  if (event.target.dataset.action !== "remove-project-experience") return;
  site.projectExperience.splice(Number(event.target.closest("[data-collection]").dataset.index), 1);
  renderProjectExperience();
});

skillsEl.addEventListener("click", event => {
  if (event.target.dataset.action !== "remove-skill") return;
  site.skills.splice(Number(event.target.closest("[data-collection]").dataset.index), 1);
  renderSkills();
});

loadSite().catch(error => showToast(error.message));
