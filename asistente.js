/* Asistente de Mo' Glam: burbuja de chat que responde dudas y agenda citas. Solo aparece si está encendido en el panel. */
(function () {
  var API = 'https://script.google.com/macros/s/AKfycbyOj2Dwt9iSgLBEh7tc0ou-jjd3Xd24gurcXprvk64Iy-sLNKv1t5maGV9YVLvRtbUmBQ/exec';
  var CLAVE = 'mg_chat';
  function llamar(p) {
    return fetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, credentials: 'omit',
      body: JSON.stringify({ fn: 'asistente', args: [p] }) }).then(function (r) { return r.json(); });
  }
  function leer() { try { return JSON.parse(sessionStorage.getItem(CLAVE) || 'null'); } catch (e) { return null; } }
  function guardar() { try { sessionStorage.setItem(CLAVE, JSON.stringify(st)); } catch (e) {} }
  var st = leer() || { sid: Math.random().toString(36).slice(2) + Date.now().toString(36), msgs: [], citas: [] };

  llamar({ ping: true }).then(function (j) {
    if (!(j && j.ok && j.data && j.data.activo)) return;
    montar();
  }).catch(function () {});

  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }

  function montar() {
    var css = document.createElement('style');
    css.textContent =
      '.mgc-b{position:fixed;right:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:50;display:flex;align-items:center;gap:8px;' +
      'background:#2A1418;color:#F7E4E6;border:1px solid #8A6424;border-radius:999px;padding:12px 16px;font:600 14px/1 system-ui,sans-serif;box-shadow:0 6px 20px rgba(42,20,24,.25);cursor:pointer}' +
      '.mgc-b span{font-size:18px}' +
      '.mgc-p{position:fixed;right:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:60;width:min(380px,calc(100vw - 24px));height:min(560px,calc(100vh - 90px));' +
      'background:#FBF1F2;border:1px solid #E2C9A6;border-radius:20px;box-shadow:0 12px 40px rgba(42,20,24,.3);display:flex;flex-direction:column;overflow:hidden;font:15px/1.45 system-ui,sans-serif;color:#2A1418}' +
      '@media (max-width:520px){.mgc-p{right:12px;left:12px;width:auto;bottom:12px;height:calc(100vh - 80px)}}' +
      '.mgc-h{display:flex;align-items:center;gap:10px;padding:12px 14px;background:#2A1418;color:#F7E4E6}' +
      '.mgc-h b{flex:1;font-size:15px}.mgc-h small{display:block;font-weight:400;font-size:12px;opacity:.8}' +
      '.mgc-x{background:none;border:0;color:#F7E4E6;font-size:22px;cursor:pointer;line-height:1;padding:4px}' +
      '.mgc-m{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:8px}' +
      '.mgc-m div{max-width:85%;padding:9px 12px;border-radius:14px;white-space:pre-wrap;word-wrap:break-word}' +
      '.mgc-u{align-self:flex-end;background:#8A6424;color:#fff;border-bottom-right-radius:4px}' +
      '.mgc-a{align-self:flex-start;background:#fff;border:1px solid #E2C9A6;border-bottom-left-radius:4px}' +
      '.mgc-c{align-self:stretch!important;max-width:none!important;background:#F7E4E6;border:1px solid #8A6424}' +
      '.mgc-c a{color:#8A6424;font-weight:600}' +
      '.mgc-s{display:flex;flex-wrap:wrap;gap:6px;padding:0 14px 8px}' +
      '.mgc-s button{background:#fff;border:1px solid #E2C9A6;color:#2A1418;border-radius:999px;padding:6px 10px;font:13px system-ui,sans-serif;cursor:pointer}' +
      '.mgc-f{display:flex;gap:8px;padding:10px;border-top:1px solid #E2C9A6;background:#FBF1F2}' +
      '.mgc-f input{flex:1;border:1px solid #E2C9A6;border-radius:999px;padding:10px 14px;font:16px system-ui,sans-serif;background:#fff;color:#2A1418;min-width:0}' +
      '.mgc-f button{background:#2A1418;color:#F7E4E6;border:0;border-radius:999px;padding:0 16px;font:600 14px system-ui,sans-serif;cursor:pointer}' +
      '.mgc-f button:disabled{opacity:.5}.mgc-n{font-size:11px;color:#6B4A50;text-align:center;padding:0 10px 8px}';
    document.head.appendChild(css);

    var burbuja = el('button', 'mgc-b'); burbuja.type = 'button';
    burbuja.appendChild(el('span', null, '💅')); burbuja.appendChild(document.createTextNode('¿Agendamos tu cita?'));
    burbuja.setAttribute('aria-label', 'Abrir el asistente de Mo Glam');
    document.body.appendChild(burbuja);

    var panel = el('div', 'mgc-p'); panel.style.display = 'none'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', "Asistente de Mo' Glam");
    var cab = el('div', 'mgc-h');
    var tt = el('b', null, "Asistente de Mo' Glam"); tt.appendChild(el('small', null, 'Te ayudo con precios, horarios y citas'));
    cab.appendChild(tt);
    var cerrar = el('button', 'mgc-x', '×'); cerrar.type = 'button'; cerrar.setAttribute('aria-label', 'Cerrar');
    cab.appendChild(cerrar); panel.appendChild(cab);
    var caja = el('div', 'mgc-m'); caja.setAttribute('aria-live', 'polite'); panel.appendChild(caja);
    var sug = el('div', 'mgc-s'); panel.appendChild(sug);
    var form = el('form', 'mgc-f');
    var inp = el('input'); inp.placeholder = 'Escribe tu mensaje…'; inp.maxLength = 500; inp.setAttribute('aria-label', 'Mensaje');
    var env = el('button', null, 'Enviar'); env.type = 'submit';
    form.appendChild(inp); form.appendChild(env); panel.appendChild(form);
    panel.appendChild(el('div', 'mgc-n', 'Asistente con IA. Para algo especial escríbenos por WhatsApp.'));
    document.body.appendChild(panel);

    function burbujaMsg(clase, texto) { var d = el('div', clase, texto); caja.appendChild(d); caja.scrollTop = caja.scrollHeight; return d; }
    function tarjetaCita(c) {
      var d = el('div', 'mgc-c');
      d.appendChild(el('strong', null, '✓ Cita agendada · folio ' + c.folio));
      d.appendChild(document.createElement('br'));
      d.appendChild(document.createTextNode(c.servicios + '\n' + c.fecha + ' · ' + c.hora + '\nTotal aprox. $' + c.total));
      if (c.anticipo) {
        d.appendChild(document.createTextNode('\n\nPara apartar tu lugar envía el anticipo de $' + c.anticipo + (c.datosAnticipo ? ':\n' + c.datosAnticipo : '') + '\n'));
      }
      if (c.whatsapp) {
        d.appendChild(document.createTextNode('\n'));
        var a = el('a', null, c.anticipo ? 'Enviar comprobante por WhatsApp' : 'Escribirnos por WhatsApp');
        a.href = 'https://wa.me/52' + c.whatsapp + '?text=' + encodeURIComponent('Hola, agendé con el asistente. Folio ' + c.folio);
        a.target = '_blank'; a.rel = 'noopener'; d.appendChild(a);
      }
      caja.appendChild(d); caja.scrollTop = caja.scrollHeight;
    }
    function pintarTodo() {
      caja.textContent = '';
      burbujaMsg('mgc-a', '¡Hola! 💕 Soy la asistente de Mo\' Glam. Puedo contarte de nuestros servicios y precios, o agendarte una cita ahorita mismo. ¿Qué te gustaría hacerte?');
      st.msgs.forEach(function (m) { burbujaMsg(m.r === 'u' ? 'mgc-u' : 'mgc-a', m.t); });
      st.citas.forEach(tarjetaCita);
      sug.textContent = '';
      if (!st.msgs.length) {
        ['Quiero agendar', '¿Cuánto cuesta un gelish?', '¿Dónde están?', '¿Qué horario tienen?'].forEach(function (t) {
          var b = el('button', null, t); b.type = 'button';
          b.onclick = function () { enviar(t); };
          sug.appendChild(b);
        });
      }
    }
    var ocupado = false;
    function enviar(texto) {
      texto = String(texto || '').trim();
      if (!texto || ocupado) return;
      ocupado = true; env.disabled = true; sug.textContent = '';
      st.msgs.push({ r: 'u', t: texto }); guardar();
      burbujaMsg('mgc-u', texto);
      var esp = burbujaMsg('mgc-a', 'Escribiendo…');
      llamar({ sid: st.sid, msgs: st.msgs.slice(-20) }).then(function (j) {
        esp.remove();
        var d = j && j.ok && j.data;
        var t = (d && d.texto) || 'Ahorita no puedo responder 🙏 Escríbenos por WhatsApp y con gusto te atendemos.';
        st.msgs.push({ r: 'm', t: t });
        burbujaMsg('mgc-a', t);
        if (d && d.cita) { st.citas.push(d.cita); tarjetaCita(d.cita); }
        guardar();
      }).catch(function () {
        esp.textContent = 'Se fue el internet un momento. Intenta de nuevo, por favor.';
        st.msgs.pop(); guardar();
      }).then(function () { ocupado = false; env.disabled = false; inp.focus(); });
    }
    form.addEventListener('submit', function (e) { e.preventDefault(); var t = inp.value; inp.value = ''; enviar(t); });
    burbuja.onclick = function () { panel.style.display = 'flex'; burbuja.style.display = 'none'; pintarTodo(); setTimeout(function () { inp.focus(); }, 50); };
    cerrar.onclick = function () { panel.style.display = 'none'; burbuja.style.display = 'flex'; };
  }
})();
