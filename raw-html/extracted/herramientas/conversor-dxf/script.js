(function(){
  const rootId='eg-csv2dxf';
  const $=(s,c=document)=>c.querySelector(s);

  /* ============ Cache de elementos ============ */
  function els(){
    const r=document.getElementById(rootId); if(!r) return null;
    return {
      r,
      file:$('#egc2dxf-file',r), infoRows:$('#egc2dxf-infoRows',r), hasHeader:$('#egc2dxf-hasHeader',r),
      colName:$('#egc2dxf-colName',r), colX:$('#egc2dxf-colX',r), colY:$('#egc2dxf-colY',r), colZ:$('#egc2dxf-colZ',r), colCode:$('#egc2dxf-colCode',r),
      decSep:$('#egc2dxf-decSep',r), addTextName:$('#egc2dxf-addTextName',r), addTextCode:$('#egc2dxf-addTextCode',r), textH:$('#egc2dxf-textH',r),
      tblBody:$('#egc2dxf-tblPreview tbody',r), prevInfo:$('#egc2dxf-prevInfo',r), plot:$('#egc2dxf-plot',r),
      previewBtn:$('#egc2dxf-previewBtn',r), exportBtn:$('#egc2dxf-exportBtn',r),
      measureBtn:$('#egc2dxf-measureBtn',r), resetMeasureBtn:$('#egc2dxf-resetMeasureBtn',r), reframeBtn:$('#egc2dxf-reframeBtn',r),
      rowsLimit:$('#egc2dxf-rowsLimit',r),
      status:$('#egc2dxf-status',r),
    };
  }

  /* ============ Lectura robusta de archivo ============ */
  async function readFileSmart(file){
    const buf=await file.arrayBuffer();
    const tryDec=(enc)=>{
      try{
        const td=new TextDecoder(enc,{fatal:false});
        let s=td.decode(buf);
        s=s.replace(/^\uFEFF/,'').replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F]/g,'');
        const bad=(s.match(/\uFFFD/g)||[]).length;
        return {s,bad};
      }catch{ return {s:null,bad:Infinity}; }
    };
    const cand=['utf-8','iso-8859-1','windows-1252'].map(tryDec).sort((a,b)=>a.bad-b.bad);
    return cand[0].s || await file.text();
  }

  /* ======================= CSV helpers ======================= */
  function detectDelimiter(text){
    const head=text.split(/\r?\n/).slice(0,12).join('\n');
    const counts={ ',':(head.match(/,/g)||[]).length, ';':(head.match(/;/g)||[]).length, '\t':(head.match(/\t/g)||[]).length, '|':(head.match(/\|/g)||[]).length };
    return Object.entries(counts).sort((a,b)=>b[1]-a[1])[0]?.[0] || ',';
  }
  function toNumber(v,sep){
    if(v==null||v==='') return NaN;
    let s=(''+v).trim();
    s=s.replace(/\s(?=\d{3}(?:\D|$))/g,''); // separador miles con espacio
    if(sep==='comma'){ s=s.replace(/\./g,'').replace(/,/g,'.'); }
    return Number(s);
  }
  // CSV con comillas y escape "" → "
  function parseCSV(text,delim,hasHeader){
    const d=(delim==='\t')?'\t':delim;
    const lines=text.split(/\r?\n/).filter(l=>l.trim()!=='');
    const rows=lines.map(line=>{
      const out=[]; let cur='',q=false;
      for(let i=0;i<line.length;i++){
        const ch=line[i];
        if(ch==='\"'){
          if(q && line[i+1]==='\"'){ cur+='\"'; i++; continue; }
          q=!q; continue;
        }
        if(!q && ch===d){ out.push(cur); cur=''; } else cur+=ch;
      }
      out.push(cur);
      return out;
    });
    const header = hasHeader ? rows.shift()
                             : (rows[0]?.map((_,i)=>`col_${i+1}`) || []);
    return {header,rows};
  }

  /* =========== Mapeo de columnas =========== */
  function fillSelect(sel, header){
    sel.innerHTML='';
    const o0=document.createElement('option'); o0.value=''; o0.textContent='— sin usar —'; sel.appendChild(o0);
    header.forEach((h,i)=>{
      const o=document.createElement('option'); o.value=String(i); o.textContent=`${i+1}: ${h}`; sel.appendChild(o);
    });
  }
  function autoMap(E){
    if(!table) return;
    const lower=table.header.map(h=>(h||'').toLowerCase());
    const f=rx=>lower.findIndex(h=>rx.test(h));
    const iName=f(/(^|\b)(nombre|name|id|pto|punto)($|\b)/);
    const iX   =f(/(^|\b)(x|este|easting|lon|longitud)($|\b)/);
    const iY   =f(/(^|\b)(y|norte|northing|lat|latitud)($|\b)/);
    const iZ   =f(/(^|\b)(z|cota|altura|elev)($|\b)/);
    const iCode=f(/(^|\b)(cod|código|codigo|code)($|\b)/);
    if(iName>=0) E.colName.value=String(iName);
    if(iX>=0)    E.colX.value=String(iX);
    if(iY>=0)    E.colY.value=String(iY);
    if(iZ>=0)    E.colZ.value=String(iZ);
    if(iCode>=0) E.colCode.value=String(iCode);
  }
  function getMap(E){
    const pick=sel=> sel.value!==''?Number(sel.value):null;
    return { iname:pick(E.colName), ix:pick(E.colX), iy:pick(E.colY), iz:pick(E.colZ), icode:pick(E.colCode) };
  }

  /* ===================== Estado ===================== */
  let table=null, delim=',';
  let pts=[]; let bounds=null, view=null; let screenPts=[];
  let measureMode=false, selA=null, selB=null, hover=null;
  let rowsLimitVal = 300;  // límite de filas en tabla
  const pad=20;

  /* ====================== Geometría / vista ====================== */
  function computeBounds(arr){
    let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
    for(const p of arr){
      if(!Number.isFinite(p.x)||!Number.isFinite(p.y)) continue;
      if(p.x<minX)minX=p.x; if(p.x>maxX)maxX=p.x;
      if(p.y<minY)minY=p.y; if(p.y>maxY)maxY=p.y;
    }
    if(!isFinite(minX)||!isFinite(minY)) return null;
    if(minX===maxX){minX-=1;maxX+=1}
    if(minY===maxY){minY-=1;maxY+=1}
    return {minX,maxX,minY,maxY};
  }
  function fitView(){
    if(!bounds) return;
    const dx=bounds.maxX-bounds.minX, dy=bounds.maxY-bounds.minY;
    view={ minX:bounds.minX-dx*0.05, maxX:bounds.maxX+dx*0.05, minY:bounds.minY-dy*0.05, maxY:bounds.maxY+dy*0.05 };
  }
  function setupCanvas(cv){
    const w=cv.clientWidth||600,h=cv.clientHeight||380;
    cv.width=w*devicePixelRatio; cv.height=h*devicePixelRatio;
    const ctx=cv.getContext('2d'); ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
    return {ctx,w,h};
  }
  function worldToScreenFactory(cv){
    const w=cv.clientWidth||600,h=cv.clientHeight||380;
    const vx=view; if(!vx) return ()=>({x:0,y:0});
    const sx=(w-2*pad)/(vx.maxX-vx.minX), sy=(h-2*pad)/(vx.maxY-vx.minY);
    const s=Math.min(sx,sy);
    const ox=pad + (w-2*pad - s*(vx.maxX-vx.minX))/2;
    const oy=pad + (h-2*pad - s*(vx.maxY-vx.minY))/2;
    return (x,y)=>({ x: ox + (x-vx.minX)*s, y: (h - (oy + (y-vx.minY)*s)) });
  }
  function screenToWorldFactory(cv){
    const w=cv.clientWidth||600,h=cv.clientHeight||380;
    const vx=view; if(!vx) return ()=>({x:0,y:0});
    const sx=(w-2*pad)/(vx.maxX-vx.minX), sy=(h-2*pad)/(vx.maxY-vx.minY);
    const s=Math.min(sx,sy);
    const ox=pad + (w-2*pad - s*(vx.maxX-vx.minX))/2;
    const oy=pad + (h-2*pad - s*(vx.maxY-vx.minY))/2;
    return (px,py)=>({ x: vx.minX + (px-ox)/s, y: vx.minY + ((h - py) - oy)/s });
  }
  function nearestPoint(px,py,r=10){
    let best=null, bestD=Infinity;
    for(const sp of screenPts){
      const d=Math.hypot(sp.sx-px, sp.sy-py);
      if(d<r && d<bestD){ bestD=d; best=sp; }
    }
    return best;
  }

  /* ======================= Tabla / puntos ======================= */
  function toPoints(E){
    if(!table) throw new Error('Cargá un archivo primero.');
    const {iname,ix,iy,iz,icode}=getMap(E);
    if(ix==null||iy==null) throw new Error('Indicá columnas X e Y.');
    const dec=E.decSep.value;
    const out=[]; let bad=0;
    for(const r of table.rows){
      const x=toNumber(r[ix],dec), y=toNumber(r[iy],dec);
      if(Number.isFinite(x)&&Number.isFinite(y)){
        const z=(iz!=null)?toNumber(r[iz],dec):NaN;
        const name=(iname!=null)?String(r[iname]??''):'';
        const code=(icode!=null)?String(r[icode]??''):'';
        out.push({x,y,z,name,code});
      } else bad++;
    }
    return {points:out,bad};
  }
  function fillTable(E, arr){
    const max = (rowsLimitVal && rowsLimitVal>0) ? rowsLimitVal : arr.length;
    const f=n=> Number.isFinite(n)?n.toFixed(3):'';
    E.tblBody.innerHTML='';
    arr.slice(0,max).forEach((p,i)=>{
      const tr=document.createElement('tr');
      tr.innerHTML=`<td>${i+1}</td><td>${f(p.x)}</td><td>${f(p.y)}</td><td>${f(p.z)}</td><td>${p.name||''}</td><td>${p.code||''}</td>`;
      E.tblBody.appendChild(tr);
    });
    E.prevInfo.textContent = arr.length ? `${arr.length} registros (se muestran ${Math.min(arr.length,max)})` : 'Sin registros válidos';
  }

  /* ========================== Dibujo ========================== */
  function draw(E){
    const cv=E.plot; const {ctx,w,h}=setupCanvas(cv);
    ctx.clearRect(0,0,w,h);
    if(!pts.length||!view) return;

    ctx.strokeStyle='rgba(255,255,255,.12)'; ctx.lineWidth=1; ctx.strokeRect(8,8,w-16,h-16);

    const map=worldToScreenFactory(cv);
    screenPts=pts.map(p=>{ const s=map(p.x,p.y); return {...p,sx:s.x,sy:s.y}; });

    ctx.fillStyle='rgba(255,255,255,.92)';
    for(const sp of screenPts){ ctx.beginPath(); ctx.arc(sp.sx,sp.sy,2,0,Math.PI*2); ctx.fill(); }

    if(selA){ ctx.fillStyle='#22c55e'; ctx.beginPath(); ctx.arc(selA.sx,selA.sy,4,0,Math.PI*2); ctx.fill(); }
    if(selB){ ctx.fillStyle='#f04e4e'; ctx.beginPath(); ctx.arc(selB.sx,selB.sy,4,0,Math.PI*2); ctx.fill(); }

    if(hover){
      const label = hover.name ? `Nombre: ${hover.name}` :
                    hover.code ? `Código: ${hover.code}` :
                    `X ${hover.x.toFixed(3)} · Y ${hover.y.toFixed(3)}`;
      ctx.font='12px system-ui,-apple-system,Segoe UI,Roboto,Arial';
      const wtxt=ctx.measureText(label).width + 10;
      ctx.fillStyle='rgba(17,24,39,.9)'; ctx.fillRect(hover.sx+10, hover.sy-18, wtxt, 18);
      ctx.fillStyle='#fff'; ctx.fillText(label, hover.sx+15, hover.sy-5);
    }

    if(selA && selB){
      ctx.strokeStyle='#ef4444'; ctx.lineWidth=2;
      ctx.beginPath(); ctx.moveTo(selA.sx,selA.sy); ctx.lineTo(selB.sx,selB.sy); ctx.stroke();
      const dx=selB.x-selA.x, dy=selB.y-selA.y;
      const dist=Math.hypot(dx,dy), az=((Math.atan2(dx,dy)*180/Math.PI)+360)%360;
      const mx=(selA.sx+selB.sx)/2, my=(selA.sy+selB.sy)/2;
      const label=`${dist.toFixed(3)} | Az ${az.toFixed(2)}°`;
      ctx.font='12px system-ui,-apple-system,Segoe UI,Roboto,Arial';
      const lw=ctx.measureText(label).width+10;
      ctx.fillStyle='rgba(17,24,39,.9)'; ctx.fillRect(mx-lw/2,my-18,lw,18);
      ctx.fillStyle='#fff'; ctx.fillText(label, mx-lw/2+5, my-5);
    }
  }

  /* ===================== Interacción canvas ===================== */
  function attachCanvasHandlers(E){
    const cv=E.plot;
    let dragging=false, dragStartW=null, viewStart=null;
    cv.style.cursor='grab';

    cv.addEventListener('mousedown',(e)=>{
      if(e.button!==0) return;
      dragging=true; cv.style.cursor='grabbing';
      dragStartW=screenToWorldFactory(cv)(e.offsetX,e.offsetY);
      viewStart={...view};
    });
    window.addEventListener('mouseup',()=>{ dragging=false; cv.style.cursor='grab'; });
    cv.addEventListener('mousemove',(e)=>{
      hover = nearestPoint(e.offsetX,e.offsetY,10) || null;
      if(dragging && view){
        const curW=screenToWorldFactory(cv)(e.offsetX,e.offsetY);
        const dx=curW.x-dragStartW.x, dy=curW.y-dragStartW.y;
        view.minX=viewStart.minX-dx; view.maxX=viewStart.maxX-dx;
        view.minY=viewStart.minY-dy; view.maxY=viewStart.maxY-dy;
      }
      draw(E);
    });
    cv.addEventListener('wheel',(e)=>{
      if(!view) return; e.preventDefault();
      const factor=e.deltaY<0? 1/1.15 : 1.15;
      const sw=screenToWorldFactory(cv)(e.offsetX,e.offsetY);
      const w=view.maxX-view.minX, h=view.maxY-view.minY;
      const nw=w*factor, nh=h*factor;
      const rx=(sw.x-view.minX)/w, ry=(sw.y-view.minY)/h;
      view.minX=sw.x-rx*nw; view.maxX=view.minX+nw;
      view.minY=sw.y-ry*nh; view.maxY=view.minY+nh;
      draw(E);
    },{passive:false});
    cv.addEventListener('dblclick',()=>{ fitView(); draw(E); });
    cv.addEventListener('click',(e)=>{
      const near=nearestPoint(e.offsetX,e.offsetY,10); if(!near) return;
      if(!measureMode){ selA=near; selB=null; draw(E); return; }
      if(!selA){ selA=near; selB=null; draw(E); return; }
      if(!selB){ selB=near; draw(E); return; }
      selA=near; selB=null; draw(E);
    });
  }

  /* ===================== DXF R12 seguro ===================== */
  const NL='\r\n';
  function stripAccents(s){ try{ return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,''); }catch{ return String(s); } }
  function sanitizeText(txt){
    let s = stripAccents(txt ?? '');
    s = s.replace(/\r?\n/g,' ').replace(/[\u0000-\u001F]/g,' ').replace(/[^\x20-\x7E]/g,'').replace(/\s+/g,' ').trim();
    return s.slice(0,255);
  }
  function sanitizeCode(code){
    let s = stripAccents(code ?? 'SIN_CODIGO').trim();
    s = s.replace(/[^\x20-\x7E]/g,'').replace(/[^A-Za-z0-9_-]/g,'_').replace(/^_+|_+$/g,'');
    if(!s) s='SIN_CODIGO';
    return s;
  }
  function hashStr(t){ let h=0; for(let i=0;i<t.length;i++){ h=((h<<5)-h)+t.charCodeAt(i); h|=0; } return Math.abs(h).toString(36).toUpperCase(); }
  function makeLayerName(prefix, raw){
    const base = sanitizeCode(raw);
    let name = `${prefix}${base}`;
    if(name.length<=31) return name;
    const tag = hashStr(base).slice(0,5);
    const maxBase = Math.max(1, 31 - (prefix.length + 1 + tag.length));
    return `${prefix}${base.slice(0,maxBase)}_${tag}`;
  }
  function colorFromCode(key){
    const s=String(key); let h=0; for(let i=0;i<s.length;i++) h=(h*31 + s.charCodeAt(i))>>>0;
    const aci=[1,2,3,4,5,6,8,9,10,30,140,141,190,200,210,220,230,240];
    return aci[h % aci.length];
  }
  function headerWithLayers(layerMap){
    const out=[];
    out.push('0','SECTION','2','HEADER','9','$ACADVER','1','AC1009','0','ENDSEC');
    out.push('0','SECTION','2','TABLES');
      out.push('0','TABLE','2','LTYPE','70','1');
        out.push('0','LTYPE','2','CONTINUOUS','70','0','3','Continuous','72','65','73','0','40','0');
      out.push('0','ENDTAB');
      out.push('0','TABLE','2','STYLE','70','1');
        out.push('0','STYLE','2','STANDARD','70','0','40','0','41','1','50','0','71','0','42','0','3','txt','4','');
      out.push('0','ENDTAB');
      out.push('0','TABLE','2','LAYER','70', String(1 + layerMap.size));
        out.push('0','LAYER','2','0','70','0','62','7','6','CONTINUOUS');
        for(const [name,color] of layerMap.entries()){
          out.push('0','LAYER','2',name,'70','0','62',String(color),'6','CONTINUOUS');
        }
      out.push('0','ENDTAB');
    out.push('0','ENDSEC');
    out.push('0','SECTION','2','BLOCKS','0','ENDSEC');
    out.push('0','SECTION','2','ENTITIES');
    return out;
  }
  function dxfFooter(out){ out.push('0','ENDSEC','0','EOF'); }
  function entPOINT(out,x,y,z,layer){ out.push('0','POINT','8',layer,'10',String(x),'20',String(y),'30',Number.isFinite(z)?String(z):'0'); }
  function entTEXT(out,x,y,h,txt,layer){ out.push('0','TEXT','8',layer,'10',String(x),'20',String(y),'40',String(h),'1',sanitizeText(txt),'7','STANDARD','50','0'); }

  function exportDXF(E){
    const {points,bad}=toPoints(E);
    const addName=E.addTextName?.checked ?? true;
    const addCode=E.addTextCode?.checked ?? false;
    const h=parseFloat(E.textH?.value)||1.5;

    const layers=new Map();
    for(const p of points){
      const key=sanitizeCode(p.code);
      const col=colorFromCode(key);
      layers.set(makeLayerName('EG_PUNTOS_', key), col);
      if(addName && p.name) layers.set(makeLayerName('EG_TXT_NOMBRE_', key), col);
      if(addCode && p.code) layers.set(makeLayerName('EG_TXT_CODIGO_', key), col);
    }

    const out = headerWithLayers(layers);
    for(const p of points){
      const key=sanitizeCode(p.code);
      const lPts=makeLayerName('EG_PUNTOS_', key);
      const lNom=makeLayerName('EG_TXT_NOMBRE_', key);
      const lCod=makeLayerName('EG_TXT_CODIGO_', key);
      entPOINT(out,p.x,p.y,p.z,lPts);
      if(addName && p.name) entTEXT(out,p.x,p.y,h,p.name,lNom);
      if(addCode && p.code) entTEXT(out,p.x,p.y,h,p.code,lCod);
    }
    dxfFooter(out);

    const body = out.join(NL);
    const blob = new Blob([body],{type:'application/dxf'});
    const url = URL.createObjectURL(blob);
    const a=document.createElement('a'); a.href=url; a.download='export_R12_por_codigo.dxf'; a.click();
    setTimeout(()=>URL.revokeObjectURL(url),1500);

    if (E?.status){
      E.status.innerHTML = `<span style="color:#86efac">${points.length} puntos</span>` +
        (bad?` · <span style="color:#fca5a5">${bad} filas ignoradas</span>`:'');
    }
  }

  /* =================== Render / ciclo principal =================== */
  function renderAll(E){
    try{
      const res=toPoints(E);
      pts=res.points; bounds=computeBounds(pts); fitView();
      selA=null; selB=null; hover=null;
      fillTable(E, pts); draw(E);
    }catch(err){ E.prevInfo.textContent=err.message; }
  }

  /* ============================= Init ============================= */
  function init(){
    const E=els(); if(!E) return;

    attachCanvasHandlers(E);

    E.previewBtn?.addEventListener('click',()=>renderAll(E));
    E.exportBtn?.addEventListener('click',()=>{ try{ exportDXF(E); }catch(e){ E.status.textContent=e.message; }});
    E.measureBtn?.addEventListener('click',()=>{ measureMode=!measureMode; E.measureBtn.classList.toggle('egc2dxf-primary',measureMode); selA=null; selB=null; draw(E); });
    E.resetMeasureBtn?.addEventListener('click',()=>{ selA=null; selB=null; draw(E); });
    E.reframeBtn?.addEventListener('click',()=>{ fitView(); draw(E); });
    window.addEventListener('resize',()=>draw(E));

    // Cambiar límite de filas de tabla
    E.rowsLimit?.addEventListener('change', ()=>{
      rowsLimitVal = Number(E.rowsLimit.value)||0; // 0 = todos
      fillTable(E, pts);
    });

    ['egc2dxf-colName','egc2dxf-colX','egc2dxf-colY','egc2dxf-colZ','egc2dxf-colCode','egc2dxf-decSep']
      .forEach(id=>document.getElementById(id)?.addEventListener('change',()=>renderAll(E)));

    E.file.addEventListener('change', async e=>{
      const f=e.target.files[0]; if(!f) return;
      const text=await readFileSmart(f);
      delim=detectDelimiter(text);
      table=parseCSV(text, delim, E.hasHeader.checked);

      ['egc2dxf-colName','egc2dxf-colX','egc2dxf-colY','egc2dxf-colZ','egc2dxf-colCode']
        .forEach(id=>fillSelect(document.getElementById(id), table.header));

      autoMap(E);
      E.infoRows.textContent=`${table.rows.length} filas`;
      view=null; selA=null; selB=null; hover=null;
      renderAll(E);
    });

    E.hasHeader?.addEventListener('change',()=>{
      if(!E.file.files.length) return;
      E.file.dispatchEvent(new Event('change'));
    });
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();
