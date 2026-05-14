(function(){
  let lat=null, lon=null;
  const FAJAS=[{faja:1,centro:-72},{faja:2,centro:-69},{faja:3,centro:-66},{faja:4,centro:-63},{faja:5,centro:-60},{faja:6,centro:-57},{faja:7,centro:-54}];
  const $=id=>document.getElementById(id);

  function toDMS(x,t){const a=Math.abs(x),g=Math.floor(a),mD=(a-g)*60,m=Math.floor(mD),s=((mD-m)*60).toFixed(2),h=t==='lat'?(x>=0?'N':'S'):(x>=0?'E':'O');return `${g}° ${m}' ${s}" ${h}`;}
  function toDMSabs(x){const a=Math.abs(x),g=Math.floor(a),mD=(a-g)*60,m=Math.floor(mD),s=((mD-m)*60).toFixed(2);return `${g}° ${m}' ${s}"`;}

  function reset(){['faja_error','faja_resultado','faja_sugerencia','faja_coordenadas','faja_detalle'].forEach(id=>{const el=$(id);if(el){el.textContent='';el.innerHTML='';}});}

  function obtenerUbicacion(){
    reset();
    if(!navigator.geolocation){$('faja_error').textContent='Tu navegador no soporta geolocalización.';return;}
    navigator.geolocation.getCurrentPosition(
      pos=>{
        lat=pos.coords.latitude; lon=pos.coords.longitude;
        $('faja_coordenadas').innerHTML=`Latitud: <strong>${toDMS(lat,'lat')}</strong> &nbsp;·&nbsp; Longitud: <strong>${toDMS(lon,'lon')}</strong>`;
        $('faja_detalle').textContent='Ubicación capturada. Ahora presioná Analizar faja Gauss-Krüger.';
      },
      ()=>{ $('faja_error').textContent='No se pudo obtener la ubicación. Verificá permisos o cargá la longitud manualmente.'; }
    );
  }

  function usarManual(){
    reset();
    const v=parseFloat($('faja_lon_manual').value);
    if(Number.isNaN(v)){ $('faja_error').textContent='Ingresá una longitud válida en decimal (ej: -58.5).'; return; }
    lon=v;
    $('faja_coordenadas').innerHTML=`Longitud manual: <strong>${toDMS(lon,'lon')}</strong>`;
    $('faja_detalle').textContent='Listo. Ahora presioná Analizar faja Gauss-Krüger.';
  }

  function analizar(){
    $('faja_resultado').textContent='';
    $('faja_sugerencia').textContent='';
    if(lon===null){$('faja_resultado').textContent='Primero obtené tu ubicación o cargá una longitud.';return;}

    const lonO=-Math.abs(lon); // Oeste negativa
    const z=FAJAS.find(f=>lonO>=f.centro-1.5 && lonO<f.centro+1.5);
    if(!z){$('faja_resultado').textContent='Estás fuera del rango de fajas Gauss-Krüger argentinas (1–7).';return;}

    const dif=Math.abs(lonO-z.centro);
    $('faja_resultado').innerHTML=`Faja ${z.faja} (meridiano central ${Math.abs(z.centro)}°O). Diferencia: <strong>${toDMSabs(dif)}</strong>`;

    if(dif>1){
      $('faja_sugerencia').innerHTML=`Recomendación: usar faja local con meridiano central en <strong>${toDMS(lonO,'lon')}</strong>.<br>Nombre sugerido: <strong>Faja Local ${Math.abs(lonO).toFixed(2)}°O</strong>.`;
    }else{
      $('faja_sugerencia').textContent='Dentro de ±1° del meridiano central. Podés usar la faja estándar sin faja local.';
    }
  }

  document.addEventListener('DOMContentLoaded', function(){
    const root=document.getElementById('faja-local-tool'); if(!root) return;
    const ub=document.getElementById('btnUbicacion');
    const an=document.getElementById('btnAnalizar');
    const man=document.getElementById('btnUsarManual');
    if(ub) ub.addEventListener('click', obtenerUbicacion);
    if(an) an.addEventListener('click', analizar);
    if(man) man.addEventListener('click', usarManual);
  });
})();
