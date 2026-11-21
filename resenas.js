/* Reseñas de Google Maps de Mo' Glam. Se pinta en cualquier <div id="resenas"></div>. */
(function () {
  var caja = document.getElementById('resenas');
  if (!caja) return;
  var API = 'https://script.google.com/macros/s/AKfycbyOj2Dwt9iSgLBEh7tc0ou-jjd3Xd24gurcXprvk64Iy-sLNKv1t5maGV9YVLvRtbUmBQ/exec';
  var css = document.createElement('style');
  css.textContent =
    '.rs{margin:26px 0}.rs-cab{display:flex;flex-direction:column;align-items:center;text-align:center;gap:6px}' +
    '.rs-cab h2{margin:0}.rs-nota{display:flex;align-items:center;gap:8px;font-size:15px;color:var(--muted)}' +
    '.rs-nota b{font-size:22px;color:var(--ink)}.rs-est{color:#C9A24D;letter-spacing:1px}' +
    '.rs-fila{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(260px,82%);gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;padding:14px 2px 6px;scrollbar-width:none}' +
    '.rs-fila::-webkit-scrollbar{display:none}@media (min-width:760px){.rs-fila{grid-auto-columns:minmax(260px,1fr)}}' +
    '.rs-c{scroll-snap-align:start;background:var(--card);border:1px solid var(--line);border-radius:16px;padding:16px;display:flex;flex-direction:column;gap:8px}' +
    '.rs-a{display:flex;align-items:center;gap:10px}.rs-a img,.rs-ini{width:36px;height:36px;border-radius:50%;object-fit:cover;flex:none}' +
    '.rs-ini{display:flex;align-items:center;justify-content:center;background:#E8CBA0;color:#4E3238;font-weight:600}' +
    '.rs-a span{display:block;font-size:12px;color:var(--muted)}.rs-t{margin:0;font-size:15px;line-height:1.5;color:var(--ink);display:-webkit-box;-webkit-line-clamp:6;-webkit-box-orient:vertical;overflow:hidden}' +
    '.rs-c a.rs-mas{font-size:13px;color:var(--gold);margin-top:auto}' +
    '.rs-btns{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin-top:12px}.rs-g{font-size:12px;color:var(--muted);text-align:center;margin-top:8px}';
  document.head.appendChild(css);
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function estrellas(n) { n = Math.round(n || 0); return '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n); }
  function seguro(u) { return /^https:\/\//.test(u || '') ? u : ''; }
  fetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, credentials: 'omit', body: JSON.stringify({ fn: 'resenas', args: [] }) })
    .then(function (r) { return r.json(); })
    .then(function (j) {
      var d = j && j.ok && j.data;
      if (!d || !d.conectada || !d.resenas || !d.resenas.length) return;
      var s = el('section', 'rs'); s.setAttribute('aria-labelledby', 'rs-t');
      var cab = el('div', 'rs-cab');
      var h = el('h2', null, 'Lo que dicen nuestras clientas'); h.id = 'rs-t'; cab.appendChild(h);
      if (d.rating) {
        var nt = el('div', 'rs-nota');
        nt.appendChild(el('b', null, String(d.rating).replace('.', ',')));
        nt.appendChild(el('span', 'rs-est', estrellas(d.rating)));
        nt.appendChild(el('span', null, d.total + ' reseñas en Google'));
        cab.appendChild(nt);
      }
      s.appendChild(cab);
      var fila = el('div', 'rs-fila');
      d.resenas.forEach(function (x) {
        if (!x.texto) return;
        var c = el('article', 'rs-c');
        var a = el('div', 'rs-a');
        if (seguro(x.foto)) { var im = new Image(); im.src = x.foto; im.alt = ''; im.referrerPolicy = 'no-referrer'; im.loading = 'lazy'; a.appendChild(im); }
        else a.appendChild(el('div', 'rs-ini', (x.autor || '?').charAt(0).toUpperCase()));
        var who = el('div'); who.appendChild(el('strong', null, x.autor || 'Clienta'));
        who.appendChild(el('span', null, estrellas(x.estrellas) + (x.hace ? ' · ' + x.hace : '')));
        a.appendChild(who); c.appendChild(a);
        c.appendChild(el('p', 'rs-t', x.texto));
        if (seguro(x.link)) { var m = el('a', 'rs-mas', 'Leer en Google'); m.href = x.link; m.target = '_blank'; m.rel = 'noopener'; c.appendChild(m); }
        fila.appendChild(c);
      });
      if (!fila.children.length) return;
      s.appendChild(fila);
      var b = el('div', 'rs-btns');
      if (seguro(d.resenaUrl)) { var w = el('a', 'btn fill', 'Déjanos tu reseña'); w.href = d.resenaUrl; w.target = '_blank'; w.rel = 'noopener'; b.appendChild(w); }
      if (seguro(d.url)) { var v = el('a', 'btn line', 'Ver todas en Google Maps'); v.href = d.url; v.target = '_blank'; v.rel = 'noopener'; b.appendChild(v); }
      s.appendChild(b);
      s.appendChild(el('div', 'rs-g', 'Reseñas de Google'));
      caja.appendChild(s);
    })
    .catch(function () {});
})();
