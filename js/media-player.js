(() => {
  'use strict';
  const catalog = window.NEREID_MEDIA;
  if (!catalog) return;
  const clock = seconds => {
    const n = Math.max(0, Math.floor(Number(seconds) || 0));
    return `${Math.floor(n / 60)}:${String(n % 60).padStart(2, '0')}`;
  };
  const node = (tag, cls, text) => {
    const element = document.createElement(tag);
    if (cls) element.className = cls;
    if (text !== undefined) element.textContent = text;
    return element;
  };
  const button = (cls, label) => {
    const element = node('button', cls, label); element.type = 'button'; return element;
  };
  const available = item => item && typeof item.src === 'string' && item.src.trim() && item.poster && item.instruction;
  const players = [];
  class RecordingPlayer {
    constructor(host, prefix) {
      this.host = host; this.prefix = prefix; this.generation = 0; this.loaded = false;
      this.panel = node('div', 'recording-panel'); this.panel.id = `${prefix}-panel`;
      this.heading = node('h3', 'recording-title'); this.heading.id = `${prefix}-title`;
      this.frame = node('div', 'media-player');
      this.canvas = node('div', 'media-canvas');
      this.video = node('video');
      this.video.preload = 'none'; this.video.muted = true; this.video.defaultMuted = true;
      this.video.playsInline = true; this.video.setAttribute('playsinline', ''); this.video.setAttribute('muted', '');
      this.video.setAttribute('aria-labelledby', this.heading.id); this.video.tabIndex = 0;
      this.overlay = button('media-start', 'Play video');
      const triangle = node('span', 'play-glyph', '▶'); triangle.setAttribute('aria-hidden', 'true');
      this.overlay.prepend(triangle);
      this.error = node('div', 'media-error'); this.error.hidden = true; this.error.setAttribute('role', 'alert');
      this.error.append(node('strong', '', 'This recording could not be played.'), node('p', '', 'Check your connection, then retry or open the MP4 directly.'));
      this.retry = button('media-retry', 'Retry video'); this.direct = node('a', '', 'Open MP4');
      this.error.append(this.retry, this.direct);
      this.busy = node('span', 'media-loading', 'Loading video…'); this.busy.hidden = true;
      this.canvas.append(this.video, this.overlay, this.busy, this.error);
      this.controls = node('div', 'media-controls'); this.controls.setAttribute('role', 'group'); this.controls.setAttribute('aria-label', 'Video controls');
      this.toggle = button('media-toggle', 'Play');
      this.seek = node('input', 'media-seek'); this.seek.type = 'range'; this.seek.min = '0'; this.seek.max = '1000'; this.seek.step = '1'; this.seek.value = '0'; this.seek.disabled = true;
      this.seek.setAttribute('aria-label', 'Video progress'); this.seek.setAttribute('aria-valuetext', 'Not started');
      this.time = node('span', 'media-time'); this.time.setAttribute('aria-live', 'off');
      this.full = button('media-fullscreen', 'Full screen');
      this.controls.append(this.toggle, this.seek, this.time, this.full); this.frame.append(this.canvas, this.controls);
      this.badges = node('div', 'recording-badges'); this.kind = node('span', 'recording-kind'); this.view = node('span'); this.badges.append(this.kind, this.view);
      this.prompt = node('div', 'recording-instruction'); this.instructionLabel = node('span', 'instruction-label', 'LANGUAGE INSTRUCTION'); this.prompt.append(this.instructionLabel);
      this.quote = node('blockquote'); this.prompt.append(this.quote); this.note = node('p', 'instruction-note');
      this.status = node('p', 'media-status sr-only'); this.status.setAttribute('role', 'status'); this.status.setAttribute('aria-live', 'polite');
      this.caseDetails = node('details', 'scene-records'); this.caseDetails.append(node('summary', '', 'View the four scenes and their recorded instructions')); this.caseList = node('div', 'scene-record-list'); this.caseDetails.append(this.caseList);
      this.sceneViews = node('div', 'scene-view-controls'); this.sceneViews.setAttribute('role', 'group'); this.sceneViews.setAttribute('aria-label', 'Enlarge a scene in this task');
      this.info = node('div', 'recording-info'); this.info.append(this.badges, this.heading, this.sceneViews, this.prompt, this.note, this.caseDetails);
      this.panel.append(this.frame, this.info, this.status); this.host.append(this.panel); players.push(this);
      this.overlay.addEventListener('click', () => this.play());
      this.toggle.addEventListener('click', () => this.video.paused ? this.play() : this.pause());
      this.retry.addEventListener('click', () => {const item = this.item; this.select(item); this.play();});
      this.seek.addEventListener('input', () => {if (Number.isFinite(this.video.duration)) {this.video.currentTime = Number(this.seek.value) / 1000 * this.video.duration; this.updateTime();}});
      this.full.addEventListener('click', () => this.fullscreen());
      this.video.addEventListener('keydown', event => {if (event.key === ' ' || event.key === 'k') {event.preventDefault(); this.toggle.click();}});
      this.video.addEventListener('playing', () => {if (!this.loaded || this.video.paused || this.video.error || !this.error.hidden) return; this.loading(false); this.frame.classList.add('is-playing'); this.overlay.hidden = true; this.toggle.textContent = 'Pause'; this.status.textContent = `Playing: ${this.item.title}.`;});
      this.video.addEventListener('pause', () => {this.loading(false); this.frame.classList.remove('is-playing'); this.overlay.hidden = !this.error.hidden; this.toggle.textContent = 'Play'; if(this.loaded && this.error.hidden) this.status.textContent = `Paused: ${this.item.title}.`;});
      this.video.addEventListener('ended', () => {this.status.textContent = 'Video finished. Play to watch again.'; this.toggle.textContent = 'Replay';});
      this.video.addEventListener('waiting', () => {if (!this.video.paused) this.loading(true);});
      this.video.addEventListener('canplay', () => this.loading(false));
      this.video.addEventListener('loadedmetadata', () => {this.seek.disabled = false; if (this.pendingSeek !== undefined) {this.video.currentTime = this.pendingSeek; this.pendingSeek = undefined;} this.updateTime();});
      this.video.addEventListener('timeupdate', () => this.updateTime());
      this.video.addEventListener('error', () => {if (this.loaded && this.video.error) this.fail();});
      this.frame.addEventListener('fullscreenchange', () => {this.full.textContent = document.fullscreenElement === this.frame ? 'Exit full screen' : 'Full screen';});
    }
    loading(value) {this.busy.hidden = !value; this.overlay.disabled = value; this.frame.setAttribute('aria-busy', String(value));}
    select(item) {
      this.generation++; this.video.pause(); this.loaded = false;
      this.video.removeAttribute('src'); this.video.load(); this.item = item;
      this.video.poster = item.poster; this.video.muted = true;
      this.kind.textContent = item.kind; this.view.textContent = `${item.view || 'Recorded video'} · ${clock(item.duration)} · ${item.playbackLabel || '1×'}`;
      this.heading.textContent = item.title || item.label;
      this.instructionLabel.textContent = item.instructionLabel || 'LANGUAGE INSTRUCTION'; this.quote.textContent = item.instruction; this.note.textContent = item.instructionNote || ''; this.note.hidden = !item.instructionNote;
      this.prompt.hidden = Boolean(item.cases?.length || item.chapters?.length);
      this.caseDetails.hidden = !item.cases?.length; this.caseList.replaceChildren();
      this.sceneViews.replaceChildren(); this.sceneViews.hidden = !item.cases?.length; this.canvas.classList.remove('is-zoomed');
      if(item.cases?.length === 4) {
        const choices = [{label:'All four scenes'}, ...item.cases.map((entry,i)=>({label:entry.sceneCode || entry.label, index:i, title:entry.label}))];
        const viewButtons = choices.map((choice,i) => {const b=button('scene-view-button',choice.label); b.title=choice.title || choice.label; b.setAttribute('aria-pressed',String(i===0)); b.addEventListener('click',()=>{viewButtons.forEach((other,j)=>other.setAttribute('aria-pressed',String(i===j))); this.canvas.classList.toggle('is-zoomed',i!==0); if(i!==0){this.canvas.style.setProperty('--zoom-x',choice.index%2?'-50%':'0%');this.canvas.style.setProperty('--zoom-y',choice.index>1?'-50%':'0%');}});this.sceneViews.append(b);return b;});
      }
      (item.cases || []).forEach((entry, index) => {const article = node('article', 'scene-record'); article.append(node('h4', '', `${['Top left', 'Top right', 'Bottom left', 'Bottom right'][index]} · ${entry.label}`), node('p', '', entry.instruction)); const link = node('a', '', 'Watch this scene'); link.href = entry.src; link.target = '_blank'; link.rel = 'noopener'; article.append(link); this.caseList.append(article);});
      this.pendingSeek = undefined;
      this.direct.href = item.src; this.error.hidden = true; this.overlay.hidden = false;
      this.toggle.textContent = 'Play'; this.toggle.disabled = false; this.loading(false);
      this.frame.classList.remove('is-playing'); this.seek.value = '0'; this.seek.disabled = true;
      this.status.textContent = 'Ready. Click play to load the recording.';
      this.updateTime();
      this.frame.classList.remove('media-enter'); void this.frame.offsetWidth; this.frame.classList.add('media-enter');
    }
    async play(startTime) {
      if (Number.isFinite(startTime)) {if (this.loaded && Number.isFinite(this.video.duration)) this.video.currentTime = startTime; else this.pendingSeek = startTime;}
      const generation = this.generation;
      players.forEach(player => {if(player !== this) player.pause();});
      this.error.hidden = true; this.loading(true); this.status.textContent = 'Loading video…';
      if (!this.loaded) {this.loaded = true; this.video.src = this.item.src; this.video.load();}
      try {await this.video.play();}
      catch (error) {
        if (generation !== this.generation || error.name === 'AbortError') return;
        if (error.name === 'NotAllowedError') {this.loading(false); this.status.textContent = 'Your browser blocked playback. Press Play again.';}
        else this.fail();
      }
    }
    pause() {this.video.pause(); this.loading(false);}
    updateTime() {
      const duration = this.loaded && Number.isFinite(this.video.duration) ? this.video.duration : this.item?.duration || 0;
      const current = this.loaded ? this.video.currentTime : 0;
      this.time.textContent = `${clock(current)} / ${clock(duration)}`;
      if (duration && this.loaded) this.seek.value = String(Math.round(current / duration * 1000));
      this.seek.setAttribute('aria-valuetext', `${clock(current)} of ${clock(duration)}`);
    }
    fail() {
      this.video.pause(); this.loading(false); this.error.hidden = false; this.overlay.hidden = true;
      this.toggle.textContent = 'Unavailable'; this.toggle.disabled = true; this.seek.disabled = true; this.status.textContent = 'Playback failed. Retry or open the MP4 directly.';
    }
    async fullscreen() {
      try {
        if (document.fullscreenElement) await document.exitFullscreen();
        else if (this.frame.requestFullscreen) await this.frame.requestFullscreen();
        else if (this.video.webkitEnterFullscreen && this.loaded) {this.video.controls = true; this.video.webkitEnterFullscreen();}
        else this.status.textContent = 'Full screen is unavailable in this browser. Open the MP4 directly for the native player.';
      } catch (_) {this.status.textContent = 'Full screen was blocked by your browser. Use the native MP4 player instead.';}
    }
  }
  function gallery(host, items, prefix) {
    if (!host || !items.length) return;
    const tabs = node('div', 'recording-tabs'); tabs.setAttribute('role', 'tablist'); tabs.setAttribute('aria-label', prefix === 'sim' ? 'Simulation task videos' : 'Real-robot task videos');
    host.append(tabs); const player = new RecordingPlayer(host, prefix); player.panel.setAttribute('role', 'tabpanel');
    const buttons = items.map((item, index) => {
      const tab = button('recording-tab', item.label); tab.id = `${prefix}-tab-${item.id}`;
      tab.setAttribute('role', 'tab'); tab.setAttribute('aria-controls', player.panel.id);
      tab.addEventListener('click', () => select(index));
      tab.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % items.length;
        if (event.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = items.length - 1;
        if (next !== undefined) {event.preventDefault(); select(next); buttons[next].focus();}
      });
      tabs.append(tab); return tab;
    });
    function select(index) {
      buttons.forEach((tab, i) => {tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1;});
      player.panel.setAttribute('aria-labelledby', buttons[index].id); player.select(items[index]);
    }
    select(0);
  }
  const featured = typeof catalog.featured === 'object' ? (available(catalog.featured) ? catalog.featured : null) : catalog.simulation.find(item => item.id === catalog.featured && available(item));
  const featuredHost = document.querySelector('#featured-recording');
  if (featured && featuredHost) {
    const player = new RecordingPlayer(featuredHost, 'featured'); player.select(featured);
    if (featured.chapters?.length) {
      const chapters = node('div', 'recording-chapters'); chapters.setAttribute('role', 'group'); chapters.setAttribute('aria-label', 'Demo chapters');
      const buttons = featured.chapters.map(chapter => {const b = button('recording-chapter', `${clock(chapter.start)}  ${chapter.label}`); b.addEventListener('click', () => player.play(chapter.start)); chapters.append(b); return b;});
      featuredHost.prepend(chapters);
      const update = () => {let current = 0; featured.chapters.forEach((chapter, i) => {if(player.video.currentTime >= chapter.start) current = i;}); buttons.forEach((b, i) => {if(i === current) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');});};
      player.video.addEventListener('timeupdate', update); update();
    }
    document.addEventListener('nereid:select-recording', event => {
      const item = catalog.simulation.find(entry => entry.id === event.detail?.id && available(entry));
      if (!item) return;
      const chapter = featured.chapters?.find(entry => entry.label === item.label);
      if (chapter) {
        if (player.item.id !== featured.id) player.select(featured);
        player.play(chapter.start);
      } else player.select(item);
    });
  }
  gallery(document.querySelector('#simulation-recordings'), catalog.simulation.filter(available), 'sim');
  const real = catalog.realWorld.filter(available);
  if (real.length) {
    gallery(document.querySelector('#real-recordings'), real, 'real');
    document.querySelector('#real-video-unavailable').hidden = true;
  }
  document.addEventListener('play', event => {players.forEach(player => {if (player.video !== event.target) player.pause();});}, true);
  document.addEventListener('visibilitychange', () => {if (document.hidden) players.forEach(player => player.pause());});
})();
