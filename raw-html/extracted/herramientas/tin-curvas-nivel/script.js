
(function(){
  const $ = (s,c=document)=>c.querySelector(s);
  const R = id => document.getElementById(id);

  // ====== Estado ======
  let table=null, delim=',';
  let pts=[], tin=[], contours=[];
  let bounds=null, view=null, screenPts=[];
  let profileLine=[];
  const pad=20;

  // ====== Lectura robusta ======
  async function readFileSmart(file){
    const buf=await file.arrayBuffer();
    const tryDec = enc=>{
      try{ const s=new TextDecoder(enc,{fatal:false}).decode(buf);
           const bad=(s.match(/\uFFFD/g)||[]).length; return {s,bad}; }
      catch{ return {s:null,bad:1e9}; }
    };
    const cand=['utf-8','iso-8859-1','windows-1252'].map(tryDec).sort((a,b)=>a.bad-b.bad);
    return cand[0].s || await file.text();
  }
  function detectDelimiter(text){
    const head=text.split(/\r?\n/).slice(0,6).join('\n');
    const c={',':(head.match(/,/g)||[]).length,';':(head.match(/;/g)||[]).length,'\t':(head.match(/\t/g)||[]).length};
    return Object.entries(c).sort((a,b)=>b[1]-a[1])[0]?.[0] || ',';
  }
  function toNumber(v,dec){
    if(v==null||v==='') return NaN;
    let s=(''+v).trim();
    if(dec==='comma'){ s=s.replace(/\./g,'').replace(/,/g,'.'); }
    return Number(s);
  }
  function parseCSV(text,delim,hasHeader){
    const lines=text.split(/\r?\n/).filter(l=>l.trim()!=='');
    const d = (delim==='\t')?'\t':delim;
    const rows = lines.map(l=>{
      const out=[]; let cur='',q=false;
      for(let i=0;i<l.length;i++){
        const ch=l[i];
        if(ch==='"'){
          if(q && l[i+1]==='"'){ cur+='"'; i++; continue; }
          q=!q; continue;
        }
        if(!q && ch===d){ out.push(cur); cur=''; } else cur+=ch;
      }
      out.push(cur); return out;
    });
    const header = hasHeader ? rows.shift() : (rows[0]?.map((_,i)=>`col_${i+1}`) || []);
    return {header,rows};
  }

  // ====== UI helpers ======
  function getEls(){
    return {
      file:R('egs-file'), nrows:R('egs-nrows'),
      colName:R('egs-col-name'), colX:R('egs-col-x'), colY:R('egs-col-y'), colZ:R('egs-col-z'), colCode:R('egs-col-code'),
      hasHeader:R('egs-has-header'), dec:R('egs-dec'),
      breakCodes:R('egs-break-codes'),
      maxEdge:R('egs-max-edge'),
      eq:R('egs-eq'), masterN:R('egs-master-n'), smooth:R('egs-smooth'),
      genCurves:R('egs-gen-curves'),
      profStep:R('egs-prof-step'), profExport:R('egs-prof-export'), profReset:R('egs-prof-reset'),
      makeTIN:R('egs-make-tin'), expDXF:R('egs-export-dxf'),
      showPts:R('egs-show-pts'), showTIN:R('egs-show-tin'), showBrk:R('egs-show-brk'), showCur:R('egs-show-cur'),
      rowsSel:R('egs-rows'),
      canvas:R('egs-canvas'), table:R('egs-table').querySelector('tbody'),
      status:R('egs-status'), curvInfo:R('egs-curv-info')
    };
  }
  function fillSelect(sel, header){
    sel.innerHTML='';
    const o0=document.createElement('option'); o0.value=''; o0.textContent='— sin usar —';
    sel.appendChild(o0);
    header.forEach((h,i)=>{ const o=document.createElement('option'); o.value=String(i); o.textContent=`${i+1}: ${h}`; sel.appendChild(o); });
  }
  function autoMap(){
    const E = getEls(); if(!table) return;
    const lower = table.header.map(h=>(h||'').toLowerCase());
    const f = rx=> lower.findIndex(h=>rx.test(h));
    const iName=f(/(^|\b)(nombre|name|pto|punto|id)($|\b)/);
    const iX=f(/(^|\b)(x|este|easting|longitud|lon)($|\b)/);
    const iY=f(/(^|\b)(y|norte|northing|latitud|lat)($|\b)/);
    const iZ=f(/(^|\b)(z|cota|altura|elev|alt)($|\b)/);
    const iC=f(/(^|\b)(cod|código|codigo|code)($|\b)/);
    if(iName>=0) E.colName.value=String(iName);
    if(iY>=0)    E.colY.value=String(iY);
    if(iX>=0)    E.colX.value=String(iX);
    if(iZ>=0)    E.colZ.value=String(iZ);
    if(iC>=0)    E.colCode.value=String(iC);
  }

  // ====== Datos → puntos ======
  function toPoints(){
    const E=getEls(); if(!table) throw new Error('Cargá un archivo primero.');
    const pick=sel=> sel.value!==''?Number(sel.value):null;
    const ix=pick(E.colX), iy=pick(E.colY), iz=pick(E.colZ), iname=pick(E.colName), icode=pick(E.colCode);
    if(ix==null||iy==null) throw new Error('Indicá columnas X e Y.');
    const dec=E.dec.value;
    const out=[]; let bad=0;
    for(const r of table.rows){
      const x=toNumber(r[ix],dec), y=toNumber(r[iy],dec);
      if(Number.isFinite(x)&&Number.isFinite(y)){
        const z=(iz!=null)?toNumber(r[iz],dec):NaN;
        const name=(iname!=null)?r[iname]:'';
        const code=(icode!=null)?r[icode]:'';
        out.push({x,y,z,name,code});
      } else bad++;
    }
    return {points:out,bad};
  }
  function fillTable(arr){
    const E=getEls(); const max=Number(E.rowsSel.value||500);
    const f=n=> Number.isFinite(n)?n.toFixed(3):'';
    E.table.innerHTML='';
    arr.slice(0,max).forEach((p,i)=>{
      const tr=document.createElement('tr');
      tr.innerHTML=`<td>${i+1}</td><td>${f(p.x)}</td><td>${f(p.y)}</td><td>${f(p.z)}</td><td>${p.name||''}</td><td>${p.code||''}</td>`;
      E.table.appendChild(tr);
    });
  }

  // ====== Bounds & vista ======
  function computeBounds(arr){
    let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
    for(const p of arr){ if(!Number.isFinite(p.x)||!Number.isFinite(p.y)) continue;
      if(p.x<minX)minX=p.x;if(p.x>maxX)maxX=p.x; if(p.y<minY)minY=p.y;if(p.y>maxY)maxY=p.y;
    }
    if(!isFinite(minX)||!isFinite(minY)) return null;
    if(minX===maxX){minX-=1;maxX+=1} if(minY===maxY){minY-=1;maxY+=1}
    return {minX,maxX,minY,maxY};
  }
  function fitView(){ if(!bounds) return;
    const dx=bounds.maxX-bounds.minX, dy=bounds.maxY-bounds.minY;
    view = {minX:bounds.minX-dx*0.05, maxX:bounds.maxX+dx*0.05, minY:bounds.minY-dy*0.05, maxY:bounds.maxY+dy*0.05};
  }
  function setupCanvas(cv){ const w=cv.clientWidth||600,h=cv.clientHeight||380;
    cv.width=w*devicePixelRatio; cv.height=h*devicePixelRatio;
    const ctx=cv.getContext('2d'); ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
    return {ctx,w,h};
  }
  function worldToScreenFactory(cv){
    const w=cv.clientWidth||600,h=cv.clientHeight||380, vx=view;
    if(!vx) return ()=>({x:0,y:0});
    const sx=(w-2*pad)/(vx.maxX-vx.minX), sy=(h-2*pad)/(vx.maxY-vx.minY);
    const s=Math.min(sx,sy); const ox=pad + (w-2*pad - s*(vx.maxX-vx.minX))/2; const oy=pad + (h-2*pad - s*(vx.maxY-vx.minY))/2;
    return (x,y)=>({ x: ox + (x-vx.minX)*s, y:(h - (oy + (y-vx.minY)*s)) });
  }

  // ====== Delaunay (Bowyer–Watson) ======
  function delaunay(points, maxEdge=0){
    const P=[...points];
    let minX=1e9,minY=1e9,maxX=-1e9,maxY=-1e9;
    for(const p of P){ if(p.x<minX)minX=p.x;if(p.x>maxX)maxX=p.x;if(p.y<minY)minY=p.y;if(p.y>maxY)maxY=p.y; }
    const dx=maxX-minX, dy=maxY-minY, d=Math.max(dx,dy)*10;
    const p1={x:minX-1,y:minY-1-d}, p2={x:minX-1-d,y:maxY+1+d}, p3={x:maxX+1+d,y:maxY+1};
    const pts=[...P,p1,p2,p3];
    let tris=[{a:pts.length-3,b:pts.length-2,c:pts.length-1}];

    function circum(a,b,c){
      const d=2*(a.x*(b.y-c.y)+b.x*(c.y-a.y)+c.x*(a.y-b.y));
      if(Math.abs(d)<1e-12) return {x:0,y:0,r2:Infinity};
      const ux=((a.x*a.x+a.y*a.y)*(b.y-c.y)+(b.x*b.x+b.y*b.y)*(c.y-a.y)+(c.x*c.x+c.y*c.y)*(a.y-b.y))/d;
      const uy=((a.x*a.x+a.y*a.y)*(c.x-b.x)+(b.x*b.x+b.y*b.y)*(a.x-c.x)+(c.x*c.x+c.y*c.y)*(b.x-a.x))/d;
      const r2=(ux-a.x)**2+(uy-a.y)**2; return {x:ux,y:uy,r2};
    }
    for(let i=0;i<P.length;i++){
      const p=P[i]; const bad=[]; const edges=[];
      for(const t of tris){
        const cc=circum(pts[t.a],pts[t.b],pts[t.c]);
        if((p.x-cc.x)**2 + (p.y-cc.y)**2 <= cc.r2) bad.push(t);
      }
      function addEdge(u,v){ const k=u<v?`${u},${v}`:`${v},${u}`; edges[k]=(edges[k]||0)+1; }
      for(const t of bad){ addEdge(t.a,t.b); addEdge(t.b,t.c); addEdge(t.c,t.a); }
      tris = tris.filter(t=>!bad.includes(t));
      for(const k in edges){ if(edges[k]!==1) continue; const [u,v]=k.split(',').map(n=>+n); tris.push({a:u,b:v,c:i}); }
    }
    const superIdx=[pts.length-3,pts.length-2,pts.length-1];
    tris = tris.filter(t=>!superIdx.includes(t.a)&&!superIdx.includes(t.b)&&!superIdx.includes(t.c));

    if(maxEdge>0){
      tris = tris.filter(t=>{
        const A=pts[t.a],B=pts[t.b],C=pts[t.c];
        return Math.hypot(A.x-B.x,A.y-B.y)<=maxEdge &&
               Math.hypot(B.x-C.x,B.y-C.y)<=maxEdge &&
               Math.hypot(C.x-A.x,C.y-A.y)<=maxEdge;
      });
    }
    return tris;
  }

  // ====== Convex hull (Andrew) + point-in-polygon ======
  function convexHull(P){
    const pts=P.map(p=>[p.x,p.y]).sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
    if(pts.length<=1) return pts;
    const cross=(o,a,b)=> (a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]);
    const lower=[]; for(const p of pts){ while(lower.length>=2 && cross(lower[lower.length-2], lower[lower.length-1], p)<=0) lower.pop(); lower.push(p); }
    const upper=[]; for(let i=pts.length-1;i>=0;i--){ const p=pts[i]; while(upper.length>=2 && cross(upper[upper.length-2], upper[upper.length-1], p)<=0) upper.pop(); upper.push(p); }
    upper.pop(); lower.pop(); return lower.concat(upper);
  }
  function pointInPoly(pt, poly){
    let inside=false;
    for(let i=0,j=poly.length-1;i<poly.length;j=i++){
      const xi=poly[i][0], yi=poly[i][1], xj=poly[j][0], yj=poly[j][1];
      const intersect = ((yi>pt[1])!=(yj>pt[1])) && (pt[0] < (xj-xi)*(pt[1]-yi)/(yj-yi+1e-12) + xi);
      if(intersect) inside=!inside;
    }
    return inside;
  }

  // ====== Grid IDW + Marching Squares + suavizado ======
  function gridIDW(points, cell){
    const bb=computeBounds(points);
    const nx=Math.max(2,Math.ceil((bb.maxX-bb.minX)/cell)), ny=Math.max(2,Math.ceil((bb.maxY-bb.minY)/cell));
    const gx=[], gy=[]; for(let i=0;i<=nx;i++) gx.push(bb.minX+i*cell); for(let j=0;j<=ny;j++) gy.push(bb.minY+j*cell);
    const g=new Array((nx+1)*(ny+1)).fill(0);
    for(let j=0;j<=ny;j++){
      for(let i=0;i<=nx;i++){
        const x=gx[i], y=gy[j];
        let num=0, den=0;
        for(const p of points){
          if(!Number.isFinite(p.z)) continue;
          const d2=(x-p.x)*(x-p.x)+(y-p.y)*(y-p.y);
          const w= d2<1e-9 ? 1e9 : 1/d2;
          num+=w*p.z; den+=w;
        }
        g[j*(nx+1)+i]= num/den;
      }
    }
    return {gx,gy,g,nx,ny};
  }
  function marchingSquares(G, levels){
    const {gx,gy,g,nx,ny}=G; const lines=[];
    function val(i,j){ return g[j*(nx+1)+i]; }
    for(let j=0;j<ny;j++){
      for(let i=0;i<nx;i++){
        const z00=val(i,j), z10=val(i+1,j), z01=val(i,j+1), z11=val(i+1,j+1);
        for(const L of levels){
          let idx=0;
          if(z00>L) idx|=1; if(z10>L) idx|=2; if(z11>L) idx|=4; if(z01>L) idx|=8;
          if(idx===0 || idx===15) continue;
          const xp=t=>(gx[i]+t*(gx[i+1]-gx[i])), yp=t=>(gy[j]+t*(gy[j+1]-gy[j]));
          const lerp=(a,b)=> (L-a)/(b-a);
          const edges=[
            [xp(lerp(z00,z10)), gy[j]],        // bottom
            [gx[i+1], yp(lerp(z10,z11))],      // right
            [xp(lerp(z01,z11)), gy[j+1]],      // top
            [gx[i], yp(lerp(z00,z01))]         // left
          ];
          const cases={
            1:[[3,0]], 2:[[0,1]], 3:[[3,1]], 4:[[1,2]], 5:[[3,0],[1,2]], 6:[[0,2]],
            7:[[3,2]], 8:[[2,3]], 9:[[0,2]],10:[[1,3],[0,2]],11:[[1,3]],12:[[1,0]],13:[[2,0]],14:[[2,3]]
          };
          (cases[idx]||[]).forEach(([a,b])=>{ lines.push([edges[a],edges[b],L]); });
        }
      }
    }
    return lines;
  }
  function stitchSegments(segs){
    const key = p => `${p[0].toFixed(6)},${p[1].toFixed(6)}`;
    const map = new Map(); const used=new Set(); const res=[];
    segs.forEach((s,i)=>{ const k1=key(s[0]), k2=key(s[1]); (map.get(k1)||map.set(k1,[]),map.get(k1)).push([i,0]); (map.get(k2)||map.set(k2,[]),map.get(k2)).push([i,1]); });
    for(let i=0;i<segs.length;i++){
      if(used.has(i)) continue;
      let a=segs[i][0], b=segs[i][1]; used.add(i);
      const poly=[a,b];
      function extend(end){
        let p = end===0? poly[0] : poly[poly.length-1];
        while(true){
          const k=key(p); const cand=(map.get(k)||[]).filter(([idx])=>!used.has(idx));
          if(!cand.length) break;
          const [idx]=cand[0]; used.add(idx);
          const s=segs[idx]; const nxt = (key(s[0])===k)? s[1] : s[0];
          if(end===0) poly.unshift(nxt); else poly.push(nxt);
          p=nxt;
        }
      }
      extend(0); extend(1);
      res.push({z:segs[i][2], pts:poly});
    }
    return res;
  }
  function smoothChaikin(poly, iters){
    let P=[...poly];
    for(let k=0;k<iters;k++){
      const Q=[]; Q.push(P[0]);
      for(let i=0;i<P.length-1;i++){
        const p=P[i], r=P[i+1];
        const q1=[0.75*p[0]+0.25*r[0], 0.75*p[1]+0.25*r[1]];
        const q2=[0.25*p[0]+0.75*r[0], 0.25*p[1]+0.75*r[1]];
        Q.push(q1,q2);
      }
      Q.push(P[P.length-1]); P=Q;
    }
    return P;
  }

  // ====== DXF ======
  const NL='\r\n';
  function headerR12(layerMap){
    const out=['0','SECTION','2','HEADER','9','$ACADVER','1','AC1009','0','ENDSEC',
      '0','SECTION','2','TABLES',
      '0','TABLE','2','LTYPE','70','1','0','LTYPE','2','CONTINUOUS','70','0','3','Continuous','72','65','73','0','40','0','0','ENDTAB',
      '0','TABLE','2','STYLE','70','1','0','STYLE','2','STANDARD','70','0','40','0','41','1','50','0','71','0','42','0','3','txt','4','', '0','ENDTAB',
      '0','TABLE','2','LAYER','70', String(1+layerMap.size),'0','LAYER','2','0','70','0','62','7','6','CONTINUOUS'];
    for(const [name,col] of layerMap.entries()){ out.push('0','LAYER','2',name,'70','0','62',String(col),'6','CONTINUOUS'); }
    out.push('0','ENDTAB','0','ENDSEC','0','SECTION','2','ENTITIES'); return out.join(NL);
  }
  function footerR12(){ return ['0','ENDSEC','0','EOF'].join(NL); }
  function ent3DFACE(a,b,c,layer){ return ['0','3DFACE','8',layer,'10',a.x,'20',a.y,'30',a.z||0,'11',b.x,'21',b.y,'31',b.z||0,'12',c.x,'22',c.y,'32',c.z||0,'13',c.x,'23',c.y,'33',c.z||0].join(NL); }
  function entPLINE3D(pts,layer){ const out=['0','POLYLINE','8',layer,'66','1','10','0','20','0','30','0','70','8'];
    for(const p of pts){ out.push('0','VERTEX','8',layer,'10',p[0],'20',p[1],'30',0); }
    out.push('0','SEQEND'); return out.join(NL); }
  function exportDXF(){
    const layers=new Map(); layers.set('EG_TIN',7); layers.set('EG_BRK',5); if(contours.length) layers.set('EG_CURVAS',4);
    let body=headerR12(layers);
    for(const t of tin){ const A=pts[t.a],B=pts[t.b],C=pts[t.c]; body+=NL+ent3DFACE(A,B,C,'EG_TIN'); }
    // breaklines por código
    for(const [code, arr] of breaklinesByCode()){
      const pl = arr.map(p=>[p.x,p.y]); body+=NL+entPLINE3D(pl,'EG_BRK');
    }
    if(contours.length){ for(const c of contours){ body+=NL+entPLINE3D(c.pts,'EG_CURVAS'); } }
    body+=NL+footerR12();
    const blob=new Blob([body],{type:'application/dxf'}); const url=URL.createObjectURL(blob);
    const a=document.createElement('a'); a.href=url; a.download='superficies_R12.dxf'; a.click(); setTimeout(()=>URL.revokeObjectURL(url),1200);
  }

  // ====== Breaklines ======
  function parseCodes(){
    const raw = getEls().breakCodes.value || '';
    return raw.split(',').map(s=>s.trim().toLowerCase()).filter(Boolean);
  }
  function breaklinesByCode(){
    const codes=parseCodes(); const m=new Map();
    if(!codes.length) return m;
    for(const p of pts){
      const code=(p.code||'').toLowerCase();
      const hit=codes.find(c=>code.includes(c)); if(!hit) continue;
      if(!m.has(hit)) m.set(hit,[]); m.get(hit).push(p);
    }
    return m;
  }

  // ====== Dibujo ======
  function setupAndMap(){ const cv=getEls().canvas; const w=cv.clientWidth||600,h=cv.clientHeight||380;
    cv.width=w*devicePixelRatio; cv.height=h*devicePixelRatio;
    const ctx=cv.getContext('2d'); ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
    const map=worldToScreenFactory(cv); return {ctx,w,h,map};
  }
  function draw(){
    const E=getEls(); const cv=E.canvas; const {ctx,w,h,map}=setupAndMap();
    ctx.clearRect(0,0,w,h); if(!view) return;

    // TIN (verde suave)
    if(E.showTIN.checked && tin.length){
      ctx.strokeStyle='#22c55e'; ctx.lineWidth=1;
      ctx.beginPath();
      for(const t of tin){
        const A=map(pts[t.a].x,pts[t.a].y), B=map(pts[t.b].x,pts[t.b].y), C=map(pts[t.c].x,pts[t.c].y);
        ctx.moveTo(A.x,A.y); ctx.lineTo(B.x,B.y); ctx.lineTo(C.x,C.y); ctx.lineTo(A.x,A.y);
      }
      ctx.stroke();
    }

    // Breaklines (azul)
    if(E.showBrk.checked){
      ctx.strokeStyle='#60a5fa'; ctx.lineWidth=1.6;
      for(const [,arr] of breaklinesByCode()){
        ctx.beginPath();
        arr.forEach((p,i)=>{ const s=map(p.x,p.y); if(i===0) ctx.moveTo(s.x,s.y); else ctx.lineTo(s.x,s.y); });
        ctx.stroke();
      }
    }

    // Curvas (azules, maestras más fuertes)
    if(E.showCur.checked && contours.length){
      const eq = Math.max(0.001, Number(getEls().eq.value||0.5));
      const masterN = Math.max(1, parseInt(getEls().masterN.value||5));
      for(const c of contours){
        const idx = Math.round(c.z/eq);
        ctx.lineWidth = (idx % masterN === 0) ? 1.6 : 1.1;
        ctx.strokeStyle = (idx % masterN === 0) ? '#2563eb' : '#3b82f6';
        ctx.beginPath();
        c.pts.forEach((p,i)=>{ const s=map(p[0],p[1]); if(i===0) ctx.moveTo(s.x,s.y); else ctx.lineTo(s.x,s.y); });
        ctx.stroke();
      }
    }

    // Puntos
    if(E.showPts.checked){
      const f=2;
      ctx.fillStyle='#0f2236'; ctx.strokeStyle='#fff'; ctx.lineWidth=0.8;
      for(const p of pts){ const s=map(p.x,p.y); ctx.beginPath(); ctx.arc(s.x,s.y,f,0,6.283); ctx.fill(); ctx.stroke(); }
    }
  }

  // ====== Recalcular ======
  function recomputeTIN(){
    const E=getEls(); const maxE = Number(E.maxEdge.value||0);
    tin = delaunay(pts, maxE>0?maxE:0);
    E.showTIN.checked = true; // se activa al generar
    draw(); E.status.textContent = `${tin.length} triángulos`;
  }
  function rebuildAll(){
    try{
      const res=toPoints(); pts=res.points;
      bounds=computeBounds(pts); fitView(); fillTable(pts);
      tin=[]; contours=[];
      const E=getEls(); E.showTIN.checked=false; E.showCur.checked=false;
      draw(); E.status.textContent = `${pts.length} puntos cargados`;
    }catch(err){ getEls().status.textContent = err.message; }
  }

  // ======

