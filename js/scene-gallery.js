(() => {
  'use strict';
  const catalog = window.NEREID_SCENES;
  const grid = document.querySelector('#scene-gallery');
  if (!catalog || !grid) return;
  const filters = document.querySelector('#scene-filters');
  const count = document.querySelector('#scene-count');
  const motionButton = document.querySelector('#scene-motion-toggle');
  const dialog = document.querySelector('#scene-dialog');
  const dialogMedia = document.querySelector('#scene-dialog-media');
  const dialogCaption = document.querySelector('#scene-dialog-caption');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const categoryNames = new Map(catalog.categories.map(category => [category.id, category.label]));
  const playable = item => typeof item.src === 'string' && item.src.trim().length > 0;
  let activeFilter = 'all', pausedByUser = false, overrideReduced = false, tiles = [], returnFocus = null;
  const create = (tag, cls, text) => {
    const element = document.createElement(tag);
    if (cls) element.className = cls;
    if (text !== undefined) element.textContent = text;
    return element;
  };
  const makeButton = (cls, text) => {
    const element = create('button', cls, text); element.type = 'button'; return element;
  };
  const pauseAll = () => tiles.forEach(tile => tile.video?.pause());
  const load = tile => {
    if (!tile.loaded) {
      tile.video.src = tile.item.src; tile.video.load(); tile.loaded = true;
    }
  };
  const play = tile => {
    if (!tile.video || tile.failed || tile.pending || !tile.video.paused) return;
    load(tile); tile.pending = true;
    const pending = tile.video.play();
    if (pending) pending.catch(error => {
      if (error.name !== 'AbortError' && !tile.failed) {
        tile.toggle.textContent = 'Play';
        tile.toggle.setAttribute('aria-label', `Play ${tile.item.title} preview`);
      }
    }).finally(() => {tile.pending = false;});
    else tile.pending = false;
  };
  function syncMotion() {
    const canAutoPlay = !pausedByUser && (!reduced.matches || overrideReduced) && !document.hidden && !dialog.open;
    let admitted = 0;
    for (const tile of tiles) {
      if (!tile.video) continue;
      if (canAutoPlay && tile.visible && !tile.failed && admitted < 6) {admitted++; play(tile);}
      else tile.video.pause();
    }
    const canMove = !pausedByUser && (!reduced.matches || overrideReduced);
    motionButton.textContent = canMove ? 'Pause previews' : 'Play previews';
    motionButton.setAttribute('aria-pressed', String(!canMove));
    motionButton.hidden = !catalog.scenes.some(playable);
  }
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    for (const entry of entries) {
      const tile = tiles.find(tile => tile.element === entry.target);
      if (tile) tile.visible = entry.isIntersecting;
    }
    syncMotion();
  }, {threshold: .15}) : null;
  function closeDialogMedia() {
    dialogMedia.querySelectorAll('video').forEach(video => {video.pause();video.removeAttribute('src');video.load();});
    dialogMedia.replaceChildren();
  }
  function openScene(item, trigger) {
    if (!dialog.showModal) {window.open(item.src || item.poster, '_blank', 'noopener'); return;}
    returnFocus = trigger; pauseAll(); closeDialogMedia();
    document.querySelector('#scene-dialog-title').textContent = item.title;
    document.querySelector('#scene-dialog-category').textContent = categoryNames.get(item.category) || 'Simulation';
    dialogCaption.textContent = item.sourceLabel || 'Simulation scene view';
    if (playable(item)) {
      const video = create('video'); video.controls = true; video.playsInline = true;
      video.preload = 'metadata'; video.muted = true; video.poster = item.poster; video.src = item.src;
      video.setAttribute('aria-label', item.title);
      video.addEventListener('error', () => {dialogCaption.textContent = 'This clip could not be loaded. Close the preview and try again.';});
      dialogMedia.append(video);
    } else {
      const image = create('img'); image.src = item.poster; image.alt = item.alt || item.title;
      dialogMedia.append(image);
    }
    dialog.showModal(); document.querySelector('#scene-dialog-close').focus();
  }
  function makeTile(item) {
    const element = create('article', 'scene-tile');
    const visual = create('div', 'scene-tile-visual');
    const image = create('img', 'scene-poster');
    image.src = item.poster; image.alt = item.alt || item.title;
    image.width = 640; image.height = 360; image.loading = 'lazy'; image.decoding = 'async';
    const open = makeButton('scene-open', '');
    open.setAttribute('aria-label', `Open ${item.title.toLowerCase()} ${playable(item) ? 'clip' : 'image'}`);
    open.setAttribute('aria-haspopup', 'dialog');
    const title = create('span', 'scene-tile-title', item.title);
    const family = create('span', 'scene-tile-family', categoryNames.get(item.category) || 'Simulation');
    const expand = create('span', 'scene-expand', '⤢'); expand.setAttribute('aria-hidden', 'true');
    open.append(title, family, expand); visual.append(image);
    const tile = {element, item, loaded: false, pending: false, visible: !observer, failed: false};
    if (playable(item)) {
      const video = create('video', 'scene-mini-video');
      video.preload = 'none'; video.muted = true; video.defaultMuted = true; video.loop = true;
      video.playsInline = true; video.poster = item.poster;
      video.setAttribute('muted', ''); video.setAttribute('playsinline', ''); video.setAttribute('aria-hidden', 'true');
      tile.video = video;
      const toggle = makeButton('scene-mini-toggle', 'Play'); tile.toggle = toggle;
      toggle.setAttribute('aria-label', `Play ${item.title} preview`);
      toggle.addEventListener('click', () => {
        if (video.paused) {tile.failed = false;play(tile);} else video.pause();
      });
      video.addEventListener('playing', () => {video.classList.add('has-frames');toggle.textContent = 'Pause';toggle.setAttribute('aria-label', `Pause ${item.title} preview`);});
      video.addEventListener('pause', () => {if (tile.failed) return;toggle.textContent = 'Play';toggle.setAttribute('aria-label', `Play ${item.title} preview`);});
      video.addEventListener('error', () => {
        tile.failed = true; video.classList.remove('has-frames'); toggle.textContent = 'Retry';
        toggle.setAttribute('aria-label', `Retry ${item.title} preview`); tile.loaded = false;
      });
      visual.append(video, open, toggle);
    } else visual.append(open);
    element.append(visual);
    open.addEventListener('click', () => openScene(item, open));
    return tile;
  }
  function render() {
    pauseAll(); observer?.disconnect();
    for (const tile of tiles) if (tile.video && tile.loaded) {tile.video.removeAttribute('src');tile.video.load();}
    const items = catalog.scenes.filter(item => item.poster && (activeFilter === 'all' || item.category === activeFilter));
    tiles = items.map(makeTile); grid.replaceChildren(...tiles.map(tile => tile.element));
    count.textContent = `${items.length} ${items.length === 1 ? 'view' : 'views'}`;
    filters.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === activeFilter)));
    tiles.forEach(tile => observer?.observe(tile.element)); syncMotion();
  }
  for (const category of [{id: 'all', label: 'All environments'}, ...catalog.categories]) {
    const button = makeButton('scene-filter', category.label); button.dataset.filter = category.id;
    button.setAttribute('aria-controls', grid.id);
    button.addEventListener('click', () => {activeFilter = category.id; render();}); filters.append(button);
  }
  motionButton.addEventListener('click', () => {
    const playing = !pausedByUser && (!reduced.matches || overrideReduced);
    pausedByUser = playing;
    overrideReduced = !playing && reduced.matches;
    syncMotion();
  });
  document.querySelector('#scene-dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {closeDialogMedia();returnFocus?.focus({preventScroll:true});syncMotion();});
  document.addEventListener('visibilitychange', syncMotion);
  reduced.addEventListener('change', () => {overrideReduced = false;syncMotion();});
  render();
})();
