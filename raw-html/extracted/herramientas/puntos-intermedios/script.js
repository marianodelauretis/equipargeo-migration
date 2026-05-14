
(() => {
  const $ = (s) => document.querySelector(s);
  let chart = null, puntos = [];
  let dist = 0, azi = 0;
  let lastInput = null;

  if (window['chartjs-plugin-zoom']) { Chart.register(window['chartjs-plugin-zoom']); }

  // Intervalos comunes
  const sel = $('#intervalo');
  [0.2, 0.25, 0.5, 1, 2, 5, 10].forEach(v => {
    const o = document.createElement('option'); o.value = v; o.textContent = v; sel.appendChild(o);
  });
  sel.value = 1;

  const round = (v, d) => +v.toFixed(d);
  function azimutDesdeNorte(e1,n1,e2,n2){
    const dx = e2 - e1, dy = n2 - n1;
    let deg = Math.atan2(dx, dy) * 180 / Math.PI; // desde Norte, horario
    if (deg < 0) deg += 360;
    return deg;
  }

  function generar() {
    const e1 = parseFloat($('#e1').value);
    const n1 = parseFloat($('#n1').value);
    const e2 = parseFloat($('#e2').value);
    const n2 = parseFloat($('#n2').value);
    const dec = Math.min(4, Math.max(0, parseInt($('#decimales').value || '3',10)));
    const man = parseFloat($('#intervaloManual').value);
    const paso = isNaN(man) ? parseFloat($('#intervalo').value) : man;
    const incluirExt = $('#incluirExtremos').value === 'si';

    if ([e1,n1,e2,n2,paso].some(isNaN) || paso <= 0) {
      alert('Completá correctamente las coordenadas y el intervalo.');
      return;
    }

    lastInput = {e1,n1,e2,n2,dec};

    const dx = e2 - e1, dy = n2 - n1;
    dist = Math.hypot(dx, dy);
    azi = azimutDesdeNorte(e1,n1,e2,n2);

    const nSeg = Math.floor(dist / paso);
    if (nSeg < 1) { alert('La distancia es corta para el intervalo elegido.'); return; }

    puntos = [];
    if (incluirExt) {
      const internos = Math.max(0, nSeg - 1);
      puntos.push({ label: 'P1', x: round(e1, dec), y: round(n1, dec), prog: 0.00 });
      for (let k = 1; k <= internos; k++) {
        const s = k * paso, f = s / dist;
        puntos.push({ label: `P${k+1}`, x: round(e1 + dx * f, dec), y: round(n1 + dy * f, dec), prog: round(s, 2) });
      }
      puntos.push({ label: `P${internos+2}`, x: round(e2, dec), y: round(n2, dec), prog: round(dist,2) });
    } else if (nSeg > 1) {
      for (let k = 1; k <= nSeg - 1; k++) {
        const s = k * paso, f = s / dist;
        puntos.push({ label: `P${k}`, x: round(e1 + dx * f, dec), y: round(n1 + dy * f, dec), prog: round(s, 2) });
      }
    }

    // Resumen
    $('#panelResumen').hidden = false;
    $('#resDist').textContent = round(dist, 3);
    $('#resAzi').textContent  = round(azi, 2) + '°';
    $('#resPts').textContent  = puntos.length;

    // Tabla
    const tb = $('#tablaPuntos tbody'); tb.innerHTML = '';
    puntos.forEach((p,i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${i+1}</td><td>${p.x}</td><td>${p.y}</td><td>${p.prog}</td>`;
      tb.appendChild(tr);
    });
    $('#tablaWrap').hidden = false;

    // Gráfico
    renderChart(); fitLine();
  }

  function renderChart(){
    const ctx = $('#canvasXY').getContext('2d');
    if (chart) chart.destroy();
    chart = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Trayectoria',
          data: puntos.map(p => ({x: p.x, y: p.y})),
          showLine: true, borderWidth: 2,
          pointRadius: 3, pointHoverRadius: 5
        }]
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          zoom: { pan: { enabled: true, mode: 'xy' }, zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'xy' } },
          tooltip: { callbacks: { label: (c) => { const p = puntos[c.dataIndex]; return `${p.label}: (${p.x}, ${p.y})  —  ${p.prog} m`; } } }
        },
        scales: {
          x: { title: { display: true, text: 'Este (X) [m]' } },
          y: { title: { display: true, text: 'Norte (Y) [m]' } }
        }
      }
    });
  }

  function fitLine(){
    if (!chart || puntos.length === 0) return;
    const xs = puntos.map(p=>p.x), ys = puntos.map(p=>p.y);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    const padX = (maxX - minX) * 0.1 || 1;
    const padY = (maxY - minY) * 0.1 || 1;
    chart.options.scales.x.min = minX - padX;
    chart.options.scales.x.max = maxX + padX;
    chart.options.scales.y.min = minY - padY;
    chart.options.scales.y.max = maxY + padY;
    chart.update();
  }

  function limpiar(){
    puntos = [];
    $('#tablaPuntos tbody').innerHTML = '';
    $('#tablaWrap').hidden = true;
    $('#panelResumen').hidden = true;
    if (chart){ chart.destroy(); chart = null; }
  }

  // Copiar y CSV
  $('#btnCopiar').addEventListener('click', ()=>{
    if (!puntos.length) return;
    const rows = [['#','X','Y','Progresiva']];
    puntos.forEach((p,i)=> rows.push([i+1,p.x,p.y,p.prog]));
    const txt = rows.map(r=>r.join('\t')).join('\n');
    navigator.clipboard.writeText(txt).then(()=> alert('Tabla copiada al portapapeles.'));
  });
  $('#btnCSV').addEventListener('click', ()=>{
    if (!puntos.length) return;
    const header = 'N;X;Y;Progresiva_m';
    const lines = puntos.map((p,i)=>`${i+1};${p.x};${p.y};${p.prog}`);
    const csv = [header, ...lines].join('\n');
    const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'puntos_intermedios.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  });

  // DXF R12 (polilínea + puntos + rótulos)
  function descargarDXF(){
    if (!lastInput || puntos.length === 0){ alert('Generá los puntos primero.'); return; }
    const {e1,n1,e2,n2} = lastInput;
    const hTxt = 0.5, off = 0.3, rot = 0;

    const L = [];
    L.push('0','SECTION','2','HEADER','9','$ACADVER','1','AC1009','0','ENDSEC');
    L.push('0','SECTION','2','ENTITIES');
    L.push('0','POLYLINE','8','EQUIPARGEO_LINE','66','1','70','0');
    L.push('0','VERTEX','8','EQUIPARGEO_LINE','10',String(e1),'20',String(n1));
    L.push('0','VERTEX','8','EQUIPARGEO_LINE','10',String(e2),'20',String(n2));
    L.push('0','SEQEND');
    puntos.forEach(p=>{
      L.push('0','POINT','8','EQUIPARGEO_PTS','10',String(p.x),'20',String(p.y));
      L.push('0','TEXT','8','EQUIPARGEO_TXT','10',String(p.x + off),'20',String(p.y + off),'40',String(hTxt),'1',String(p.label),'50',String(rot));
    });
    L.push('0','ENDSEC','0','EOF');

    const dxf = L.join('\n') + '\n';
    const blob = new Blob([dxf], {type:'application/dxf;charset=utf-8;'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'puntos_intermedios_R12.dxf';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  // Toolbar
  $('#btnGenerar').addEventListener('click', (e)=>{ e.preventDefault(); generar(); });
  $('#btnLimpiar').addEventListener('click', (e)=>{ e.preventDefault(); limpiar(); });
  $('#btnFit').addEventListener('click', (e)=>{ e.preventDefault(); fitLine(); });
  $('#btnZoomIn').addEventListener('click', (e)=>{ e.preventDefault(); if(chart) chart.zoom(1.2); });
  $('#btnZoomOut').addEventListener('click', (e)=>{ e.preventDefault(); if(chart) chart.zoom(0.8); });
  $('#btnReset').addEventListener('click', (e)=>{ e.preventDefault(); if(chart) chart.resetZoom(); fitLine(); });
  const panStep = 50;
  $('#panUp').addEventListener('click',  e=>{ e.preventDefault(); chart && chart.pan({x:0,y: panStep}); });
  $('#panDown').addEventListener('click',e=>{ e.preventDefault(); chart && chart.pan({x:0,y:-panStep}); });
  $('#panLeft').addEventListener('click',e=>{ e.preventDefault(); chart && chart.pan({x: panStep,y:0}); });
  $('#panRight').addEventListener('click',e=>{ e.preventDefault(); chart && chart.pan({x:-panStep,y:0}); });
  $('#btnDXF').addEventListener('click', (e)=>{ e.preventDefault(); descargarDXF(); });
})();
