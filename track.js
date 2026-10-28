/* Contador de visitas anónimo de moglam.com.mx (no guarda datos personales). */
(function () {
  var API = 'https://script.google.com/macros/s/AKfycbyOj2Dwt9iSgLBEh7tc0ou-jjd3Xd24gurcXprvk64Iy-sLNKv1t5maGV9YVLvRtbUmBQ/exec';
  var nc = false;
  try {
    var q = new URLSearchParams(location.search);
    if (q.has('nocontar')) {
      localStorage.setItem('mg_nocontar', q.get('nocontar') === '0' ? '0' : '1');
      var on = q.get('nocontar') !== '0';
      document.addEventListener('DOMContentLoaded', function () {
        var m = document.createElement('div');
        m.textContent = on ? 'Listo: las visitas desde este aparato ya no se cuentan.' : 'Listo: este aparato vuelve a contar visitas.';
        m.style.cssText = 'position:fixed;left:50%;bottom:18px;transform:translateX(-50%);background:#f4ead8;color:#1a0c0f;border-radius:10px;padding:10px 14px;font:14px system-ui,sans-serif;z-index:99;max-width:90%;text-align:center';
        document.body.appendChild(m); setTimeout(function () { m.remove(); }, 5000);
      });
    }
    nc = localStorage.getItem('mg_nocontar') === '1';
  } catch (e) {}
  var pag = location.pathname.replace(/\.html$/, '').replace(/\/+$/, '').split('/').pop() || 'inicio';
  var ua = navigator.userAgent || '';
  var disp = /Mobi|Android|iPhone|iPad|iPod/i.test(ua) ? 'movil' : 'compu';
  function origen() {
    var src = '';
    try { src = (new URLSearchParams(location.search).get('src') || '').toLowerCase(); } catch (e) {}
    if (src) return /^(instagram|ig)$/.test(src) ? 'instagram' : /^(facebook|fb)$/.test(src) ? 'facebook' : /^(google|maps|gmaps)$/.test(src) ? 'google' : /^(whatsapp|wa)$/.test(src) ? 'whatsapp' : /^tiktok$/.test(src) ? 'tiktok' : 'otro';
    var r = '';
    try { r = document.referrer ? new URL(document.referrer).hostname : ''; } catch (e) {}
    if (r && r === location.hostname) return 'interno';
    if (/Instagram/i.test(ua) || /instagram\./.test(r)) return 'instagram';
    if (/FBAN|FBAV|FB_IAB|FBIOS/i.test(ua) || /facebook\.|fb\.com|fb\.me/.test(r)) return 'facebook';
    if (/WhatsApp/i.test(ua) || /whatsapp|wa\.me/.test(r)) return 'whatsapp';
    if (/tiktok|musical_ly|BytedanceWebview/i.test(ua) || /tiktok\./.test(r)) return 'tiktok';
    if (/(^|\.)google\./.test(r)) return 'google';
    return r ? 'otro' : 'directo';
  }
  var org = origen();
  function enviar(ev) {
    if (nc) return;
    try {
      fetch(API, { method: 'POST', mode: 'no-cors', credentials: 'omit', keepalive: true,
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ fn: 'visita', args: [{ p: pag, e: ev, o: org, d: disp }] }) });
    } catch (e) {}
  }
  var hecho = {};
  window.mgEvento = function (ev) { if (hecho[ev]) return; hecho[ev] = 1; enviar(ev); };
  window.mgEvento('vista');
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest && e.target.closest('a[href*="wa.me"],a[href*="whatsapp.com"]');
    if (a) enviar('whatsapp');
  }, true);
})();
