/* Loads /data/content.json and fills in the editable parts of the page.
   This is what lets the CMS (admin/) change your content without you
   touching the HTML by hand. */
(function () {
  function setText(selector, value) {
    if (value === undefined || value === null) return;
    var el = document.querySelector(selector);
    if (el) el.textContent = value;
  }

  function fillHero(hero) {
    if (!hero) return;
    var portrait = document.querySelector('[data-testid="hero-portrait"]');
    if (portrait && hero.portrait_url) portrait.src = hero.portrait_url;

    var locationTag = document.querySelector('.portrait-wrap .absolute.bottom-4');
    if (locationTag && hero.location_tag) locationTag.textContent = hero.location_tag;

    var typewriter = document.querySelector('.typewriter');
    if (typewriter && hero.tagline_words) {
      typewriter.setAttribute('data-words', hero.tagline_words);
      typewriter.textContent = hero.tagline_words.split(',')[0];
    }

    var stat0 = document.querySelector('[data-testid="hero-stat-0"] .count-up');
    if (stat0 && hero.stat_0_value) stat0.setAttribute('data-target', hero.stat_0_value);
    var stat0Label = document.querySelector('[data-testid="hero-stat-0"] div:last-child');
    if (stat0Label && hero.stat_0_label) stat0Label.textContent = hero.stat_0_label;

    var stat1 = document.querySelector('[data-testid="hero-stat-1"] .count-up');
    if (stat1 && hero.stat_1_value) stat1.setAttribute('data-target', hero.stat_1_value);
    var stat1Label = document.querySelector('[data-testid="hero-stat-1"] div:last-child');
    if (stat1Label && hero.stat_1_label) stat1Label.textContent = hero.stat_1_label;
  }

  function fillAbout(about) {
    if (!about) return;
    var bio = document.querySelector('#about .md\\:col-span-8 > .reveal:first-child p');
    if (bio && about.bio) bio.textContent = about.bio;

    (about.education || []).forEach(function (item, i) {
      var root = document.querySelector('[data-testid="education-item-' + i + '"]');
      if (!root) return;
      var children = root.children;
      if (children[0] && item.status) children[0].textContent = item.status;
      if (children[1] && item.degree) children[1].textContent = item.degree;
      if (children[2] && item.school) children[2].textContent = item.school;
      if (children[3] && item.detail) children[3].textContent = item.detail;
    });
  }

  function fillSkills(skills) {
    (skills || []).forEach(function (group, i) {
      var root = document.querySelector('[data-testid="skill-group-' + i + '"]');
      if (!root) return;
      var heading = root.querySelector('.font-serif');
      if (heading && group.title) heading.textContent = group.title;
      var tagWrap = root.querySelector('.flex.flex-wrap');
      if (tagWrap && Array.isArray(group.tags)) {
        tagWrap.innerHTML = group.tags
          .map(function (t) { return '<span class="tag tag-hover">' + t + '</span>'; })
          .join('');
      }
    });
  }

  function fillExperience(experience) {
    (experience || []).forEach(function (item, i) {
      var root = document.querySelector('[data-testid="experience-item-' + i + '"]');
      if (!root) return;
      var title = root.querySelector('.font-serif');
      if (title && item.title) title.textContent = item.title;
      var org = root.querySelector('.text-zinc-600');
      if (org && item.org) org.textContent = item.org;
      var period = root.querySelector('.text-zinc-500');
      if (period && item.period) period.textContent = item.period;
      var list = root.querySelector('ul');
      if (list && Array.isArray(item.bullets)) {
        list.innerHTML = item.bullets
          .map(function (b) {
            return '<li class="flex gap-3"><span class="dot mt-2 shrink-0"></span><span>' + b + '</span></li>';
          })
          .join('');
      }
    });
  }

  function fillProjects(projects) {
    (projects || []).forEach(function (p, i) {
      var root = document.querySelector('[data-testid="project-card-' + i + '"]');
      if (!root) return;
      var img = root.querySelector('img');
      if (img && p.image_url) img.src = p.image_url;
      if (img && p.title) img.alt = p.title;
      var tagWrap = root.querySelector('.p-6 > div:first-child');
      if (tagWrap && Array.isArray(p.tags)) {
        tagWrap.innerHTML = p.tags.map(function (t) { return '<span class="tag">' + t + '</span>'; }).join('');
      }
      var heading = root.querySelector('h3');
      if (heading && p.title) heading.textContent = p.title;
      var desc = root.querySelector('p');
      if (desc && p.description) desc.textContent = p.description;
      var demo = document.querySelector('[data-testid="project-demo-' + i + '"]');
      if (demo && p.demo_url) demo.href = p.demo_url;
      var gh = document.querySelector('[data-testid="project-github-' + i + '"]');
      if (gh && p.github_url) gh.href = p.github_url;
    });
  }

  function fillCertifications(certifications) {
    (certifications || []).forEach(function (c, i) {
      var root = document.querySelector('[data-testid="cert-card-' + i + '"]');
      if (!root) return;
      var title = root.querySelector('.font-serif');
      if (title && c.title) title.textContent = c.title;
      var issuer = root.querySelector('.text-zinc-500');
      if (issuer && c.issuer) issuer.textContent = c.issuer;
    });
  }

  fetch('data/content.json', { cache: 'no-store' })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      fillHero(data.hero);
      fillAbout(data.about);
      fillSkills(data.skills);
      fillExperience(data.experience);
      fillProjects(data.projects);
      fillCertifications(data.certifications);
    })
    .catch(function (err) {
      console.warn('Could not load content.json, showing default content.', err);
    });
})();
