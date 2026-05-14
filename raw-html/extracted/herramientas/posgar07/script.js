
// ===== Geográficas (DMS) → Gauss-Krüger (POSGAR07 / GRS80, k0=1) =====
(function(){
  // Elipsoide GRS80 (POSGAR 07 / SIRGAS)
  const a  = 6378137.0;
  const f  = 1/298.257222101;
  const e2 = f*(2-f);
  const ep2 = e2/(1-e2);
  const k0 = 1.0;

  const toRad = d => d*Math.PI/180;

  // ---- Utilitarios
  function normNum(v){
    if (v===undefined || v===null) return NaN;
    return parseFloat(String(v).replace(',', '.'));
  }

  function dmsToDec(d,m,s,hem, etiqueta){
    d = normNum(d); m = normNum(m); s = normNum(s);
    if([d,m,s].some(v => Number.isNaN(v))) {
      alert(`Completá ${etiqueta} (grados, minutos y segundos).`);
      return null;
    }
    if(m < 0 || m >= 60 || s < 0 || s >= 60){
      alert(`${etiqueta}: minutos y segundos deben estar en el rango 0 ≤ min,sec < 60.`);
      return null;
    }
    let dec = Math.abs(d) + Math.abs(m)/60 + Math.abs(s)/3600;
    if(hem==='S' || hem==='O' || hem==='W') dec = -dec; // hemisferio
    if (d < 0) dec = -dec; // si pusieron grados con signo
    return dec;
  }

  // Faja 1..7 por longitud (meridianos: -72,-69,-66,-63,-60,-57,-54)
  function fajaFromLon(lon){
    const f = Math.round((lon + 75)/3);
    return Math.min(7, Math.max(1,f));
  }
  function lon0FromFaja(f){ return -75 + 3*parseInt(f,10); } // grados
  function lam0FromParams(faja, cmCustomDeg){
    const cmDeg = (cmCustomDeg!==null && cmCustomDeg!=='' && !Number.isNaN(Number(cmCustomDeg)))
      ? parseFloat(cmCustomDeg) : lon0FromFaja(faja);
    return toRad(cmDeg);
  }

  function meridionalArc(phi){
    const e4 = e2*e2, e6 = e4*e2;
    return a*((1 - e2/4 - 3*e4/64 - 5*e6/256)*phi
      - (3*e2/8 + 3*e4/32 + 45*e6/1024)*Math.sin(2*phi)
      + (15*e4/256 + 45*e6/1024)*Math.sin(4*phi)
      - (35*e6/3072)*Math.sin(6*phi));
  }

  function LLtoGK(lat, lon, faja, cmCustomDeg){
    const phi  = toRad(lat);
    const lam  = toRad(lon);
    const lam0 = lam0FromParams(faja, cmCustomDeg);

    const N = a / Math.sqrt(1 - e2*Math.sin(phi)**2);
    const T = Math.tan(phi)**2;
    const C = ep2 * Math.cos(phi)**2;
    const A = Math.cos(phi) * (lam - lam0);
    const M = meridionalArc(phi);

    const Y = k0 * N * (A + (1 - T + C)*A**3/6 + (5 - 18*T + T*T + 72*C - 58*ep2)*A**5/120);
    const X = k0 * (M + N*Math.tan(phi)*(A**2/2 + (5 - T + 9*C + 4*C*C)*A**4/24 + (61 - 58*T + T*T + 600*C - 330*ep2)*A**6/720));
    return {X, Y};
  }

  // ==== UI ====
  document.addEventListener('DOMContentLoaded', function(){
    const $   = id => document.getElementById(id);
    const fmt = v => (Math.round(v*1000)/1000).toLocaleString('es-AR');

    // Caja del resultado principal
    const resultBox = document.getElementById('gk_result_primary') ||
                      document.querySelector('#gk-posgar07-tool .result-primary');

    // Defaults: prefijo y FN
    if ($('opt_prefijo')) $('opt_prefijo').checked = true;
    if ($('opt_fn'))      $('opt_fn').checked      = true;
    if ($('val_fn'))      $('val_fn').value        = 10000000;
    if ($('val_fe'))      $('val_fe').value        = 0;

    // Selector de faja solo informativo
    if ($('gk_faja')) $('gk_faja').disabled = true;

    let lastBase = null; // {X,Y,faja}

    function leerDMS(){
      const lat = dmsToDec(normNum($('lat_d').value), normNum($('lat_m').value), normNum($('lat_s').value), $('lat_h').value, 'Latitud');
      if (lat === null) return null;
      const lon = dmsToDec(normNum($('lon_d').value), normNum($('lon_m').value), normNum($('lon_s').value), $('lon_h').value, 'Longitud');
      if (lon === null) return null;

      if (Math.abs(lat)>90 || Math.abs(lon)>180){
        alert('Revisá rangos: lat ∈ [-90,90], lon ∈ [-180,180].');
        return null;
      }
      return {lat, lon};
    }

    function aplicarFormatos(baseX, baseY, faja){
      const prefijo = $('opt_prefijo')?.checked;
      const usarFN  = $('opt_fn')?.checked;
      const FN = parseFloat($('val_fn')?.value) || 0;
      const FE = parseFloat($('val_fe')?.value) || 0;

      const yFmt = baseY + FE + (prefijo ? faja*1000000 : 0);
      const xFmt = baseX + (usarFN ? FN : 0);

      $('out_y_fmt') && ($('out_y_fmt').value = fmt(yFmt));
      $('out_x_fmt') && ($('out_x_fmt').value = fmt(xFmt));
    }

    $('btn_convertir_gk')?.addEventListener('click', ()=>{
      const dms = leerDMS();
      if (!dms) return;

      const {lat, lon} = dms;

      // faja SIEMPRE por longitud (auto)
      const faja = fajaFromLon(lon);
      if ($('gk_faja')) $('gk_faja').value = String(faja); // solo informativo

      const cmCustom = $('gk_cm_custom')?.value;

      const {X, Y} = LLtoGK(lat, lon, faja, cmCustom);

      // Resultado principal (sin falsos)
      $('out_x').value = fmt(X);
      $('out_y').value = fmt(Y);

      lastBase = {X, Y, faja};
      aplicarFormatos(X, Y, faja);

      const cm = (cmCustom!=='' && !Number.isNaN(Number(cmCustom))) ? parseFloat(cmCustom) : lon0FromFaja(faja);
      $('out_info').textContent = `Faja utilizada: ${faja} (meridiano central ${cm.toFixed(6)}°). GRS80 · k₀=1. Base sin falsos.`;

      // Scroll al resultado principal
      resultBox?.scrollIntoView({behavior:'smooth', block:'start'});
    });

    $('btn_limpiar_gk')?.addEventListener('click', ()=>{
      ['lat_d','lat_m','lat_s','lon_d','lon_m','lon_s','gk_cm_custom',
       'out_x','out_y','out_x_fmt','out_y_fmt'].forEach(id=>{ const el=$(id); if(el) el.value=''; });

      $('lat_h').value='S'; $('lon_h').value='O';
      if ($('gk_faja')) { $('gk_faja').value=''; $('gk_faja').disabled = true; }

      // Defaults
      if ($('opt_prefijo')) $('opt_prefijo').checked = true;
      if ($('opt_fn'))      $('opt_fn').checked      = true;
      if ($('val_fn'))      $('val_fn').value        = 10000000;
      if ($('val_fe'))      $('val_fe').value        = 0;

      $('out_info').textContent='';
      lastBase = null;
    });

    // Recalcular formateados al cambiar opciones (si ya hay base)
    ['opt_prefijo','opt_fn','val_fn','val_fe'].forEach(id=>{
      $(id)?.addEventListener('input', ()=>{
        if (!lastBase) return;
        aplicarFormatos(lastBase.X, lastBase.Y, lastBase.faja);
      });
    });

    // -----------------------------
    // Botones "Copiar" (Y/X formateadas)
    // -----------------------------
    function copyToClipboard(targetId){
      const el = document.getElementById(targetId);
      if(!el || !el.value){ return; }
      const text = el.value; // copiamos tal cual se ve (formateado)
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(text).then(()=> feedback(targetId));
      }else{
        // Fallback
        el.focus(); el.select();
        try { document.execCommand('copy'); feedback(targetId); } catch(e){}
      }
    }
    function feedback(targetId){
      const btn = document.querySelector('#gk-posgar07-tool .copy-btn[data-target="'+targetId+'"]');
      if(!btn) return;
      const prev = btn.textContent;
      btn.textContent = 'Copiado';
      btn.disabled = true;
      setTimeout(()=>{ btn.textContent = prev; btn.disabled = false; }, 1200);
    }
    // Listeners
    document.querySelectorAll('#gk-posgar07-tool .copy-btn').forEach(btn=>{
      btn.addEventListener('click', ()=> copyToClipboard(btn.dataset.target));
    });
  });
})();
