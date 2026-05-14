// Verificador ISO de Ángulos · Equipargeo (scope #ang-verif-tool)
(function(){
  const root = document.getElementById('ang-verif-tool'); if(!root) return;
  const $ = sel => root.querySelector(sel);

  // ===== Unidades =====
  const UNITS = {
    deg: { FULL: 360.0, HALF: 180.0, label: "°", secLabel: '″' },
    gon: { FULL: 400.0, HALF: 200.0, label: "gon", secLabel: 'cc' }
  };

  // ===== Helpers numéricos / ángulos =====
  function parseNumberFlexible(str){
    if (str === null || str === undefined) return NaN;
    if (typeof str === "number") return str;
    const s = (""+str).trim().replace(',', '.');
    if (s === "") return NaN;
    return Number(s);
  }
  function normalizeAngle(val, unit){
    const FULL = UNITS[unit].FULL;
    let x = val % FULL;
    if (x < 0) x += FULL;
    return x;
  }
  function formatAngle(val, unit, decimals=6){ return normalizeAngle(val, unit).toFixed(decimals); }
  function toArcSeconds(val, unit){ return (unit==='deg') ? val*3600 : val*10000; }
  function fromArcSeconds(sec, unit){ return (unit==='deg') ? sec/3600 : sec/10000; }
  function angularDiff(a,b,unit){
    const FULL = UNITS[unit].FULL, HALF = UNITS[unit].HALF;
    let d = (a - b) % FULL;
    if (d <= -HALF) d += FULL;
    if (d >   HALF) d -= FULL;
    return d;
  }
  function adjustFRtoFD(FD, FR, unit){
    const HALF = UNITS[unit].HALF;
    const FRp = normalizeAngle(FR + HALF, unit);
    const FRm = normalizeAngle(FR - HALF, unit);
    const d1 = Math.abs(angularDiff(FD, FRp, unit));
    const d2 = Math.abs(angularDiff(FD, FRm, unit));
    return (d1 <= d2) ? FRp : FRm;
  }
  const mean = arr => arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : NaN;
  function stddev(arr){
    const n = arr.length; if (n<2) return NaN;
    const mu = mean(arr); const v = arr.reduce((acc,x)=>acc+(x-mu)*(x-mu),0)/(n-1);
    return Math.sqrt(v);
  }
  const clamp = (x,a,b) => Math.max(a, Math.min(b,x));
  const escapeHTML = s => (s ?? '').toString().replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));

  // ===== DMS parser =====
  function parseDMS(str){
    // Acepta: 12°34'56.78", 12 34 56.78, 12:34:56.78, 12 34, 12
    if (str == null) return NaN;
    let s = (""+str).trim().replace(',', '.');
    if (!s) return NaN;
    const neg = /^-/.test(s);
    s = s.replace(/^[+-]/,'');
    s = s.replace(/[°ºd]/gi,' ').replace(/[′']+/g,' ').replace(/[″"]+/g,' ').replace(/:/g,' ');
    s = s.replace(/\s+/g,' ').trim();
    const parts = s.split(' ');
    const D = parseFloat(parts[0] || '0');
    const M = parseFloat(parts[1] || '0');
    const S = parseFloat(parts[2] || '0');
    if (Number.isNaN(D) || Number.isNaN(M) || Number.isNaN(S)) return NaN;
    const val = (Math.abs(D) + (M/60) + (S/3600)) * (neg ? -1 : 1);
    return val;
  }

  // Entrada flexible según formato y unidad
  function parseAngleInput(str, unit, format){
    if (format === 'dms'){
      let degVal = parseDMS(str);
      if (Number.isNaN(degVal)){ // fallback por si cargan decimal igual
        const dec = parseNumberFlexible(str);
        if (Number.isNaN(dec)) return NaN;
        // si la unidad es gon, el número ya vendría en gon
        return (unit==='deg') ? dec : dec; 
      }
      // Convertir a la unidad elegida
      return (unit==='deg') ? degVal : (degVal/0.9); // 1 gon = 0.9°
    }
    // decimal
    return parseNumberFlexible(str);
  }

  // ===== Estado =====
  const state = {
    units: 'deg', inputFormat: 'dms', vertType: 'zenith',
    numTargets: 2, numSeries: 3,
    targets: ['B1','B2'],
    obs: []
  };

  // ===== Elementos =====
  const unitsSelect = $('#av_unitsSelect');
  const inputFormat = $('#av_inputFormat');
  const formatBadge = $('#av_formatBadge');
  const vertType    = $('#av_vertType');
  const numTargets  = $('#av_numTargets');
  const numSeries   = $('#av_numSeries');
  const targetsNames= $('#av_targetsNames');
  const buildGridBtn= $('#av_buildGridBtn');
  const obsSection  = $('#av_obsSection');
  const obsGrid     = $('#av_obsGrid');
  const resultsSection = $('#av_resultsSection');
  const globalResults  = $('#av_globalResults');
  const targetsResults = $('#av_targetsResults');
  const calcBtn     = $('#av_calcBtn');
  const clearAllBtn = $('#av_clearAllBtn');
  const printBtn    = $('#av_printBtn');
  const exportJsonBtn= $('#av_exportJsonBtn');
  const importJsonInput= $('#av_importJsonInput');
  const demoBtn     = $('#av_demoBtn');

  const ins_marca   = $('#av_ins_marca');
  const ins_modelo  = $('#av_ins_modelo');
  const ins_serie   = $('#av_ins_serie');
  const prec_nominal= $('#av_prec_nominal');
  const umbral_apto = $('#av_umbral_apto');

  // ===== Init =====
  function init(){
    unitsSelect.value = state.units;
    inputFormat.value = state.inputFormat;
    vertType.value    = state.vertType;
    numTargets.value  = state.numTargets;
    numSeries.value   = state.numSeries;

    renderTargetsNames();
    buildObsModel();
    buildObsGrid();
    updatePlaceholders();
    updateFormatBadge();

    unitsSelect.addEventListener('change', () => { state.units = unitsSelect.value; updatePlaceholders(); });
    inputFormat.addEventListener('change', () => { state.inputFormat = inputFormat.value; updatePlaceholders(); updateFormatBadge(); });
    vertType.addEventListener('change', () => { state.vertType = vertType.value; });

    numTargets.addEventListener('input', () => {
      const n = clamp(Number(numTargets.value), 1, 6);
      state.numTargets = n;
      while (state.targets.length < n) state.targets.push(`B${state.targets.length+1}`);
      state.targets = state.targets.slice(0,n);
      renderTargetsNames();
    });

    numSeries.addEventListener('input', () => {
      const s = clamp(Number(numSeries.value), 1, 12);
      state.numSeries = s;
    });

    buildGridBtn.addEventListener('click', () => {
      readTargetsNames();
      buildObsModel(true);
      buildObsGrid();
      updatePlaceholders();
      obsSection.hidden = false;
      resultsSection.hidden = false;
    });

    calcBtn.addEventListener('click', onCalculate);
    clearAllBtn.addEventListener('click', clearAll);
    printBtn.addEventListener('click', () => window.print());
    exportJsonBtn.addEventListener('click', exportJSON);
    importJsonInput.addEventListener('change', importJSON);
    demoBtn.addEventListener('click', loadDemo);
  }

  function updateFormatBadge(){
    if (!formatBadge) return;
    formatBadge.textContent = (state.inputFormat==='dms') ? 'DMS (D° M\' S")' : 'Decimal';
  }
  function updatePlaceholders(){
    const ph = (state.inputFormat==='dms') ? 'DD° MM\' SS.SSS"' : '12.123456';
    obsGrid.querySelectorAll('input.angle').forEach(i=> i.placeholder = ph);
  }

  function renderTargetsNames(){
    const n = state.numTargets;
    targetsNames.innerHTML = '';
    for (let i=0;i<n;i++){
      const wrap = document.createElement('label');
      wrap.textContent = `Blanco ${i+1}`;
      const inp = document.createElement('input');
      inp.value = state.targets[i] || `B${i+1}`;
      inp.dataset.idx = i;
      wrap.appendChild(inp);
      targetsNames.appendChild(wrap);
    }
  }
  function readTargetsNames(){
    const inputs = targetsNames.querySelectorAll('input');
    state.targets = Array.from(inputs).map((el,i)=> (el.value || `B${i+1}`).trim());
  }
  function buildObsModel(reset=false){
    const nT = state.numTargets, nS = state.numSeries;
    if (reset || !state.obs.length){
      state.obs = Array.from({length:nT}, ()=> Array.from({length:nS}, ()=>({hz_fd:'',vz_fd:'',hz_fr:'',vz_fr:''})));
    }else{
      if (state.obs.length < nT){
        const add = nT - state.obs.length;
        for (let k=0;k<add;k++){
          state.obs.push(Array.from({length: state.numSeries}, () => ({hz_fd:'',vz_fd:'',hz_fr:'',vz_fr:''})));
        }
      }else if (state.obs.length > nT){
        state.obs = state.obs.slice(0, nT);
      }
      for (let t=0;t<nT;t++){
        const arr = state.obs[t];
        if (arr.length < nS){
          const add = nS - arr.length;
          for (let k=0;k<add;k++) arr.push({hz_fd:'',vz_fd:'',hz_fr:'',vz_fr:''});
        }else if (arr.length > nS){
          state.obs[t] = arr.slice(0, nS);
        }
      }
    }
  }
  function buildObsGrid(){
    obsGrid.innerHTML = '';
    for (let t=0;t<state.numTargets;t++){
      const name = state.targets[t] || `B${t+1}`;
      const table = document.createElement('table');
      table.className = 'obs-table mono';
      const caption = document.createElement('caption');
      caption.textContent = `Blanco ${t+1}: ${name}`;
      table.appendChild(caption);
      const thead = document.createElement('thead');
      thead.innerHTML = `<tr><th>Serie</th><th>Hz_FD</th><th>Vz_FD</th><th>Hz_FR</th><th>Vz_FR</th></tr>`;
      table.appendChild(thead);
      const tbody = document.createElement('tbody');
      for (let s=0;s<state.numSeries;s++){
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${s+1}</td>
          <td><input class="angle" data-t="${t}" data-s="${s}" data-k="hz_fd" /></td>
          <td><input class="angle" data-t="${t}" data-s="${s}" data-k="vz_fd" /></td>
          <td><input class="angle" data-t="${t}" data-s="${s}" data-k="hz_fr" /></td>
          <td><input class="angle" data-t="${t}" data-s="${s}" data-k="vz_fr" /></td>
        `;
        tbody.appendChild(tr);
      }
      table.appendChild(tbody);
      obsGrid.appendChild(table);
    }
    updatePlaceholders();
    obsGrid.querySelectorAll('input.angle').forEach(inp=>{
      const t = Number(inp.dataset.t);
      const s = Number(inp.dataset.s);
      const k = inp.dataset.k;
      const val = state.obs?.[t]?.[s]?.[k] ?? '';
      inp.value = val;
      inp.addEventListener('input', e => {
        state.obs[t][s][k] = e.target.value;
      });
    });
  }

  function blinkMissing(){
    obsGrid.querySelectorAll('input.angle').forEach(inp=>{
      if (!inp.value.trim()){
        inp.style.boxShadow = '0 0 0 3px rgba(239,68,68,.35)';
        setTimeout(()=>{ inp.style.boxShadow='none'; }, 800);
      }
    });
  }

  function getThreshold(){
    const unit = state.units;
    const p = parseNumberFlexible(prec_nominal.value);
    const u = parseNumberFlexible(umbral_apto.value);
    let th = (!Number.isNaN(u) && u>0) ? u : (!Number.isNaN(p) ? p : NaN);
    return th; // ″ o cc
  }

  function onCalculate(){
    readTargetsNames();
    const unit = state.units;
    const FULL = UNITS[unit].FULL;

    const c_list = [], i_list = [];
    const perTargetD = [];
    const perTargetSeriesRows = [];
    let anyError = false;

    for (let t=0; t<state.numTargets; t++){
      const Dvals = []; const rows = [];
      for (let s=0; s<state.numSeries; s++){
        const rec = state.obs[t][s];
        // PARSE flexible (DMS/Decimal)
        const hz_fd = parseAngleInput(rec.hz_fd, unit, state.inputFormat);
        const vz_fd = parseAngleInput(rec.vz_fd, unit, state.inputFormat);
        const hz_fr = parseAngleInput(rec.hz_fr, unit, state.inputFormat);
        const vz_fr = parseAngleInput(rec.vz_fr, unit, state.inputFormat);
        const valid = [hz_fd,vz_fd,hz_fr,vz_fr].every(v => !Number.isNaN(v));
        if (!valid){ anyError = true; continue; }

        const HZ_FD = normalizeAngle(hz_fd, unit);
        const VZ_FD = normalizeAngle(vz_fd, unit);
        const HZ_FR = normalizeAngle(hz_fr, unit);
        const VZ_FR = normalizeAngle(vz_fr, unit);

        const HZ_FR_adj = adjustFRtoFD(HZ_FD, HZ_FR, unit);
        const c = angularDiff(HZ_FD, HZ_FR_adj, unit) / 2.0;
        const i = ((VZ_FD + VZ_FR) - FULL) / 2.0; // cenital
        const D = normalizeAngle((HZ_FD + HZ_FR_adj)/2.0, unit);

        c_list.push(c); i_list.push(i); Dvals.push(D);
        rows.push({serie:s+1, HZ_FD, VZ_FD, HZ_FR, VZ_FR, HZ_FR_adj, c, i, D});
      }
      perTargetD.push(Dvals);
      perTargetSeriesRows.push(rows);
    }
    if (anyError) blinkMissing();

    const c_mean = mean(c_list), c_sd = stddev(c_list);
    const i_mean = mean(i_list), i_sd = stddev(i_list);
    renderGlobal(c_mean, c_sd, i_mean, i_sd);

    const threshold = getThreshold();
    renderPerTarget(perTargetD, perTargetSeriesRows, threshold);
  }

  function renderGlobal(c_mean, c_sd, i_mean, i_sd){
    const unit = state.units, lab = UNITS[unit].label, secLabel = UNITS[unit].secLabel;
    const items = [];
    items.push({
      label:`Colimación (c) media`,
      value: (!Number.isNaN(c_mean)) ? `${formatAngle(c_mean, unit, 6)} ${lab} · ${toArcSeconds(c_mean, unit).toFixed(2)} ${secLabel}` : '—'
    });
    items.push({label:`Colimación (c) σ`, value: (!Number.isNaN(c_sd) ? `${toArcSeconds(c_sd, unit).toFixed(2)} ${secLabel}` : '—')});
    items.push({
      label:`Índice vertical (i) medio`,
      value: (!Number.isNaN(i_mean)) ? `${formatAngle(i_mean, unit, 6)} ${lab} · ${toArcSeconds(i_mean, unit).toFixed(2)} ${secLabel}` : '—'
    });
    items.push({label:`Índice vertical (i) σ`, value: (!Number.isNaN(i_sd) ? `${toArcSeconds(i_sd, unit).toFixed(2)} ${secLabel}` : '—')});
    globalResults.innerHTML = items.map(it=>`
      <div class="stat">
        <div class="label">${it.label}</div>
        <div class="value mono">${it.value}</div>
      </div>
    `).join('');
  }

  function renderPerTarget(perTargetD, perTargetRows, threshold){
    const unit = state.units, lab = UNITS[unit].label, secLabel = UNITS[unit].secLabel;
    let html = '';
    for (let t=0; t<state.numTargets; t++){
      const name = state.targets[t] || `B${t+1}`;
      const Dvals = perTargetD[t];
      const mu = mean(Dvals); const sd = stddev(Dvals);
      let badgeClass='warn', badgeText='Sin datos';
      if (!Number.isNaN(sd) && !Number.isNaN(threshold)){
        if (sd <= fromArcSeconds(threshold, unit)) { badgeClass='ok'; badgeText='APTO'; }
        else { badgeClass='bad'; badgeText='NO APTO'; }
      }else if (!Number.isNaN(sd)){ badgeClass='warn'; badgeText='Revisar umbral'; }

      html += `
        <div class="target-card">
          <header>
            <div><strong>Blanco ${t+1}:</strong> ${escapeHTML(name)}</div>
            <div class="badge ${badgeClass}">${badgeText}</div>
          </header>
          <table class="mono">
            <thead>
              <tr>
                <th>Serie</th>
                <th>Hz_FD</th>
                <th>Vz_FD</th>
                <th>Hz_FR</th>
                <th>Vz_FR</th>
                <th>FR<sub>adj</sub></th>
                <th>c</th>
                <th>i</th>
                <th>D</th>
              </tr>
            </thead>
            <tbody>
              ${perTargetRows[t].map(r=>`
                <tr>
                  <td>${r.serie}</td>
                  <td>${formatAngle(r.HZ_FD, unit, 6)} ${lab}</td>
                  <td>${formatAngle(r.VZ_FD, unit, 6)} ${lab}</td>
                  <td>${formatAngle(r.HZ_FR, unit, 6)} ${lab}</td>
                  <td>${formatAngle(r.VZ_FR, unit, 6)} ${lab}</td>
                  <td>${formatAngle(r.HZ_FR_adj, unit, 6)} ${lab}</td>
                  <td>${toArcSeconds(r.c, unit).toFixed(2)} ${secLabel}</td>
                  <td>${toArcSeconds(r.i, unit).toFixed(2)} ${secLabel}</td>
                  <td>${formatAngle(r.D, unit, 6)} ${lab}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr>
                <th colspan="9" style="text-align:left">
                  Media de D: ${Number.isNaN(mu) ? '—' : `${formatAngle(mu, unit, 6)} ${lab}`} ·
                  s<sub>D</sub>: ${Number.isNaN(sd) ? '—' : `${toArcSeconds(sd, unit).toFixed(2)} ${secLabel}`}
                  ${(!Number.isNaN(threshold)) ? ` · Umbral: ${threshold} ${secLabel}` : ''}
                </th>
              </tr>
            </tfoot>
          </table>
        </div>
      `;
    }
    targetsResults.innerHTML = html;
  }

  // Exportar / importar
  function exportJSON(){
    const data = {
      meta: { app:"Verificador ISO de Ángulos · Equipargeo", units:state.units, inputFormat:state.inputFormat, vertType:state.vertType, ts:new Date().toISOString() },
      instrumento: {
        marca: ins_marca.value, modelo: ins_modelo.value, serie: ins_serie.value,
        precision_nominal: prec_nominal.value, umbral_apto: umbral_apto.value
      },
      config: { numTargets: state.numTargets, numSeries: state.numSeries, targets: state.targets.slice() },
      obs: state.obs
    };
    const blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'verificacion_angulos_equipar.json';
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  }
  function importJSON(e){
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try{
        const data = JSON.parse(reader.result);
        state.units       = data?.meta?.units || 'deg';
        state.inputFormat = data?.meta?.inputFormat || 'dms';
        state.vertType    = data?.meta?.vertType || 'zenith';
        unitsSelect.value = state.units; inputFormat.value = state.inputFormat; vertType.value = state.vertType;
        updateFormatBadge();

        ins_marca.value = data?.instrumento?.marca || '';
        ins_modelo.value= data?.instrumento?.modelo || '';
        ins_serie.value = data?.instrumento?.serie || '';
        prec_nominal.value = data?.instrumento?.precision_nominal || '';
        umbral_apto.value  = data?.instrumento?.umbral_apto || '';

        state.numTargets = clamp(Number(data?.config?.numTargets || 2), 1, 6);
        state.numSeries  = clamp(Number(data?.config?.numSeries || 3), 1, 12);
        state.targets    = Array.isArray(data?.config?.targets) ? data.config.targets.slice(0, state.numTargets) : Array.from({length: state.numTargets}, (_,i)=>`B${i+1}`);
        state.obs        = data?.obs || [];
        numTargets.value = state.numTargets; numSeries.value = state.numSeries;
        renderTargetsNames(); buildObsModel();
        const nT = state.numTargets, nS = state.numSeries;
        for (let t=0;t<nT;t++) for (let s=0;s<nS;s++){
          state.obs[t][s] = state.obs?.[t]?.[s] || {hz_fd:'',vz_fd:'',hz_fr:'',vz_fr:''};
        }
        buildObsGrid(); updatePlaceholders(); obsSection.hidden=false; resultsSection.hidden=false;
      }catch(err){ alert('No se pudo leer el JSON.'); console.error(err); }
      e.target.value = '';
    };
    reader.readAsText(file);
  }

  // Limpieza y demo
  function clearAll(){
    ins_marca.value = ''; ins_modelo.value=''; ins_serie.value='';
    prec_nominal.value=''; umbral_apto.value='';
    state.units='deg'; state.inputFormat='dms'; state.vertType='zenith';
    unitsSelect.value='deg'; inputFormat.value='dms'; vertType.value='zenith'; updateFormatBadge();
    state.numTargets=2; state.numSeries=3;
    numTargets.value=2; numSeries.value=3;
    state.targets=['B1','B2']; renderTargetsNames();
    buildObsModel(true); buildObsGrid(); updatePlaceholders();
    obsSection.hidden=true; resultsSection.hidden=true;
    globalResults.innerHTML=''; targetsResults.innerHTML='';
  }

  function loadDemo(){
    ins_marca.value='Leica'; ins_modelo.value='TS07'; ins_serie.value='24A01234';
    prec_nominal.value='2'; umbral_apto.value='';
    state.units='deg'; unitsSelect.value='deg';
    state.inputFormat='dms'; inputFormat.value='dms'; updateFormatBadge();
    state.numTargets=2; state.numSeries=4;
    numTargets.value=2; numSeries.value=4;
    state.targets=['B1','B2']; renderTargetsNames();
    buildObsModel(true);
    // Demo en DMS (equivalente a los decimales anteriores)
    const d = (deg,min,sec)=>`${deg} ${min} ${sec}`;
    const demo = [
      [
        {hz_fd:d(12,7,24.24), vz_fd:d(100,0,0), hz_fr:d(192,7,7.68), vz_fr:d(260,0,7.2)},
        {hz_fd:d(12,7,25.68), vz_fd:d(100,0,7.2), hz_fr:d(192,7,8.4), vz_fr:d(259,59,56.4)},
        {hz_fd:d(12,7,26.4),  vz_fd:d(100,0,3.6), hz_fr:d(192,7,8.76),vz_fr:d(260,0,3.6)},
        {hz_fd:d(12,7,25.0),  vz_fd:d(99,59,56.4), hz_fr:d(192,7,7.0), vz_fr:d(260,0,0)}
      ],
      [
        {hz_fd:d(85,30,0),    vz_fd:d(95,0,0),    hz_fr:d(265,30,4.32), vz_fr:d(265,0,0)},
        {hz_fd:d(85,30,1.8),  vz_fd:d(95,0,5.4),  hz_fr:d(265,30,3.24), vz_fr:d(265,0,1.8)},
        {hz_fd:d(85,30,1.8),  vz_fd:d(94,59,58.2),hz_fr:d(265,30,3.6),  vz_fr:d(265,0,2.88)},
        {hz_fd:d(85,29,59.64),vz_fd:d(95,0,0.72), hz_fr:d(265,30,0.72), vz_fr:d(265,0,0.36)}
      ]
    ];
    for (let t=0; t<state.numTargets; t++) for (let s=0; s<state.numSeries; s++) state.obs[t][s]=demo[t][s];
    buildObsGrid(); updatePlaceholders(); obsSection.hidden=false; resultsSection.hidden=false;
  }

  // Go
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
