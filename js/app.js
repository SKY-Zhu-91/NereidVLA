'use strict';
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#nav');
function closeMenu() {nav.classList.remove('open');menuButton.setAttribute('aria-expanded', 'false');}
menuButton.addEventListener('click', () => {const open = nav.classList.toggle('open');menuButton.setAttribute('aria-expanded', String(open));});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {if(event.key === 'Escape') closeMenu();});
const navLinks = [...nav.querySelectorAll('a')];
if ('IntersectionObserver' in window) {
 const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
   if(entry.isIntersecting) navLinks.forEach(link => {
    const active = link.hash === '#' + entry.target.id;
    link.classList.toggle('active', active);
    if(active) link.setAttribute('aria-current', 'location');else link.removeAttribute('aria-current');
   });
  });
 }, {rootMargin: '-12% 0px -60% 0px', threshold: 0});
 navLinks.forEach(link => {const section = document.querySelector(link.hash);if(section) observer.observe(section);});
}
const copyButton = document.querySelector('#copy-citation');
copyButton.addEventListener('click', async () => {
 const text = document.querySelector('#bibtex').textContent;
 const status = document.querySelector('#copy-status');
 let copied = false;
 try {if (navigator.clipboard && window.isSecureContext) {await navigator.clipboard.writeText(text);copied = true;}} catch (_) { /* Use the local-file compatible fallback below. */ }
 if (!copied) {
  const input = document.createElement('textarea');input.value = text;input.setAttribute('readonly','');input.style.cssText='position:fixed;top:0;left:-9999px';document.body.append(input);input.select();
  try {copied = document.execCommand('copy');} catch (_) {copied = false;}
  input.remove();copyButton.focus();
 }
 if(copied) {status.textContent = 'BibTeX copied to clipboard.';copyButton.textContent = 'Copied!';}
 else {const range=document.createRange();range.selectNodeContents(document.querySelector('#bibtex'));const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);status.textContent='Automatic copy is unavailable. The citation is selected; press Ctrl+C (Windows) or Command+C (Mac).';}
});
