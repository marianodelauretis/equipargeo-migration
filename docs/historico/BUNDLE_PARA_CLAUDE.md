# BUNDLE PARA CLAUDE — equipargeo migración

Generado: 2026-05-14

---

# PARTE 1 — HERRAMIENTAS

## Herramienta 1: FAJA (Consulta de faja GNSS)

### section.html

```html
<section id="faja-local-tool" style="width:100%;max-width:1100px;margin:40px auto;padding:0 15px;">
<div class="wrap">
<h2>¿Conviene usar una faja local?</h2>
<p class="sub">Calculá si tu punto está a más de ±1° del meridiano central de la faja Gauss-Krüger en Argentina (fajas 1 a 7).</p>
<!-- Acciones principales -->
<div class="actions" style="margin-top:8px">
<button class="btn primary" id="btnUbicacion" type="button">Obtener mi ubicación</button>
<button class="btn" id="btnAnalizar" type="button">Analizar faja Gauss-Krüger</button>
</div>
<!-- Carga manual -->
<div class="manual" style="margin-top:10px">
<label class="small" for="faja_lon_manual">O cargá tu longitud (decimal, Oeste negativa):</label>
<input id="faja_lon_manual" inputmode="decimal" placeholder="-58.500000" step="0.000001" type="number"/>
<button class="btn" id="btnUsarManual" type="button">Usar esta longitud</button>
</div>
<!-- Resultados -->
<div class="grid" style="margin-top:12px">
<div class="card">
<div aria-live="polite" class="out" id="faja_coordenadas"></div>
<div aria-live="polite" class="hint" id="faja_detalle" style="margin-top:6px"></div>
<div class="error" id="faja_error" role="alert"></div>
</div>
<div class="card">
<div aria-live="polite" class="out" id="faja_resultado"></div>
<div aria-live="polite" class="hint" id="faja_sugerencia" style="margin-top:6px"></div>
</div>
</div>
</div>
</section>
```

### style.css

```css

			/* ==========================================================================
   EQUIPARGEO – CSS GLOBAL (VERSIÓN FINAL PULIDA - BRANDING CORREGIDO)
   ========================================================================== */

/* ===== 1. RESET Y ESTRUCTURA DE PÁGINAS (ID 2 y 213) ===== */
body.page-id-2 .page-title,
body.page-id-2 .entry-title,
body.page-id-2 .entry-header,
body.page-id-2 .breadcrumbs,
body.page-id-2 .breadcrumb,
body.page-id-2 .breadcrumb-trail,
body.page-id-2 #secondary,
body.page-id-2 .sidebar,
body.page-id-2 .widget-area,
body.page-id-2 #comments,
body.page-id-2 .comments-area{ display:none!important }

body.page-id-2 #primary,
body.page-id-2 .content-area,
body.page-id-2 .site-content .content-area,
body.page-id-2 .site-main,
body.page-id-2 .content{ width:100%!important; max-width:none!important; float:none!important }

body.page-id-2 .site-content,
body.page-id-2 .content-wrap,
body.page-id-2 .container,
body.page-id-2 .row{ grid-template-columns:1fr!important }

body.page-id-2 .entry-content > *:not(.alignwide):not(.alignfull){
  margin-left:auto; margin-right:auto; max-width:1100px
}

body.page-id-2 .site-content{ padding-top:0 }

/* Página ID 213 */
body.page-id-213 .top-bar,
body.page-id-213 .site-header,
body.page-id-213 header.site-header,
body.page-id-213 .page-header,
body.page-id-213 .entry-header,
body.page-id-213 .page-title,
body.page-id-213 .breadcrumbs,
body.page-id-213 nav.breadcrumb,
body.page-id-213 .td-breadcrumbs,
body.page-id-213 .hero,
body.page-id-213 .hero-header{ display:none!important }

body.page-id-213 #content,
body.page-id-213 .site-content,
body.page-id-213 .content-area,
body.page-id-213 .container,
body.page-id-213 .inner,
body.page-id-213 main{ margin-top:0!important; padding-top:0!important }

@media (max-width:782px){
  body.page-id-213 #content,
  body.page-id-213 .site-content,
  body.page-id-213 .content-area,
  body.page-id-213 main{ padding-top:0!important }
}

/* ===== 2. SECCIÓN MENÚ HERRAMIENTAS (GRID) ===== */
#herramientas .tools-grid{ grid-template-columns:repeat(2,minmax(0,1fr)) }
#herramientas .tool-title{ word-break:break-word; hyphens:auto }
#herramientas .status{ display:inline-block; margin:6px 0; }

@media (max-width:900px){
  #herramientas .tools-grid{ grid-template-columns:1fr!important }
  #herramientas .tools-chips{ justify-content:center }
  #herramientas .actions a, #herramientas .actions span{ width:100%; text-align:center }
}

/* Cards genéricas de herramientas */
.eg-tools-grid{ display:grid; gap:14px; grid-template-columns:repeat(12,1fr); margin-top:10px }
.eg-tool-card{
  grid-column:span 12; background:#fbfdff; border:1px solid #e5e7eb; border-radius:14px;
  padding:16px; box-shadow:0 10px 24px rgba(0,0,0,.06)
}
@media (min-width:900px){ .eg-tool-card{ grid-column:span 6 } }

.eg-badge{
  display:inline-block; background:#e74a4a; color:#fff; border-radius:999px; padding:4px 10px;
  font-size:.78rem; font-weight:800; letter-spacing:.2px; width:max-content
}

/* ==========================================================================
   3. ESTILOS EDUCATIVOS UNIFICADOS (GNSS + TOPOGRAFÍA + FOTOGRAMETRÍA)
   ========================================================================== */
#programa-completo, #cta-curso, #faq-curso,
#programa-topografia, #cta-topo, #faq-topo,
#programa-fotogrametria, #cta-foto, #faq-foto,
#curso-modulo-1, #curso-modulo-2, #curso-modulo-3,
#curso-topo-m1, #curso-topo-m2, #curso-topo-m3,
#curso-foto-m1, #curso-foto-m2, #curso-foto-m3,
#capacitaciones-home, #agenda-stec {
    --azul: #18354a;
    --coral: #f04e4e;
    --gris: #6e7b8d;
    --borde: #e5e7eb;
    --bg-soft: #f8fafc;
    --wsp-green: #25d366;
    /* Nuevo azul tecnológico STEC (Solo para detalles menores si hace falta) */
    --stec-blue: #0052cc; 
    font-family: inherit;
    box-sizing: border-box;
}

/* --- HERO OSCURO (Dark Header) --- */
.mod-hero, .pc-hero-dark, .cap-hero {
    background: linear-gradient(180deg, #1c3a50, #18354a);
    border-radius: 16px; padding: 45px 25px; margin-bottom: 30px;
    color: #fff; text-align: center;
    box-shadow: 0 12px 30px rgba(0,0,0,0.15);
    position: relative; overflow: hidden;
}
.mod-hero h1, .pc-hero-dark h1, .cap-hero h1 {
    color: #fff !important; margin: 0 0 15px;
    font-size: clamp(1.8rem, 5vw, 2.4rem); font-weight: 800; line-height: 1.1;
}
.mod-hero .subtitulo, .pc-hero-dark .sub, .cap-hero p {
    color: #dcebf7 !important; margin: 0 auto 25px;
    font-size: 1.1rem; max-width: 800px; line-height: 1.6;
}
.highlight-mod, .mod-label, .feat-tag {
    color: #81d4fa; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; 
    display: block; margin-bottom: 10px; font-size: 0.9rem;
}
/* Tag específico para tarjetas */
.feat-tag { background: var(--coral); color: #fff; padding: 4px 10px; border-radius: 4px; width: fit-content; color: #fff; }

/* --- INDICADORES DE PASOS (1-2-3) --- */
.mod-steps {
    display: flex; justify-content: center; align-items: center; gap: 12px; margin-bottom: 20px;
}
.step-dot {
    width: 32px; height: 32px; border-radius: 50%;
    background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.5);
    font-weight: 700; font-size: 0.85rem;
    display: flex; align-items: center; justify-content: center;
    border: 1px solid rgba(255,255,255,0.15);
}
.step-dot.active {
    background: var(--coral); color: #fff; border-color: var(--coral);
    transform: scale(1.1); box-shadow: 0 0 15px rgba(240, 78, 78, 0.4);
}
.step-line { width: 25px; height: 2px; background: rgba(255,255,255,0.15); }

/* --- BOTONES (CTA) --- */
/* Estilos base */
.mod-btn, .btn, .btn-main {
    display: inline-block; text-decoration: none; border-radius: 10px;
    padding: 12px 24px; font-weight: 800; text-align: center; transition: all .2s ease; cursor: pointer;
}

/* Nav Superior: REDONDEADO FORZADO */
.pc-nav { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-bottom: 30px; }
.pc-nav a {
    display: inline-block; text-decoration: none; 
    border-radius: 50px !important; 
    padding: 10px 24px; font-weight: 700; text-align: center; 
    transition: all .2s ease; cursor: pointer;
    background: rgba(255,255,255,0.05); color: #fff !important; 
    border: 1px solid rgba(255,255,255,0.4);
}
.pc-nav a:hover { background: #fff; color: var(--azul) !important; border-color: #fff; transform: translateY(-2px); }

/* Primario */
.mod-btn.primary, .btn.primary { 
    background: var(--coral); color: #fff !important; 
    box-shadow: 0 8px 20px rgba(240,78,78,.3); border: 2px solid var(--coral); 
}
.mod-btn.primary:hover, .btn.primary:hover { transform: translateY(-2px); box-shadow: 0 12px 25px rgba(240,78,78,.4); background: #ff5f5f; }

/* Ghost */
.mod-btn.ghost { 
    background: rgba(255,255,255,0.05); color: #fff !important; 
    border: 2px solid rgba(255,255,255,0.4);
}
.mod-btn.ghost:hover { background: #fff; color: var(--azul) !important; border-color: #fff; }

.btn.ghost-dark { background: #eef3f9; color: var(--azul); border: 1px solid var(--borde); }
.btn.ghost-dark:hover { background: #e2eaf5; }

.btn-main { background: var(--azul); color: #fff; border: 2px solid var(--azul); }
.btn-main:hover { background: #2c4a63; transform: translateY(-2px); }

.btn-wsp-green {
    display: inline-block; text-decoration: none; background: var(--wsp-green); color: #fff !important;
    font-weight: 800; padding: 12px 24px; border-radius: 999px; box-shadow: 0 6px 18px rgba(37,211,102,0.25);
    transition: all 0.2s;
}
.btn-wsp-green:hover { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(37,211,102,0.35); }

/* Botón Servicio */
.btn-service {
    background: #4f46e5; color: #fff; text-decoration: none; padding: 12px 24px; 
    border-radius: 50px; font-weight: 700; font-size: 0.95rem; transition: transform 0.2s;
    display: inline-block; box-shadow: 0 4px 10px rgba(79, 70, 229, 0.3);
}
.btn-service:hover { transform: translateY(-2px); background: #4338ca; }

/* --- GRIDS Y LAYOUT --- */
.datos-grid { display: grid; gap: 12px; grid-template-columns: repeat(4, 1fr); margin-bottom: 30px; }
.dato-card, .nota {
    background: #fff; border: 1px solid var(--borde); border-radius: 12px;
    padding: 15px; text-align: center; font-size: 0.95rem; color: #354658;
    box-shadow: 0 4px 10px rgba(0,0,0,0.03);
}
.dato-card b { display: block; color: var(--azul); font-size: 0.8rem; text-transform: uppercase; margin-bottom: 5px; opacity: 0.85; }
@media(max-width: 768px) { .datos-grid { grid-template-columns: 1fr 1fr; } }

.layout-cols, .cuerpo.grid { display: grid; gap: 30px; grid-template-columns: 1.8fr 1.2fr; }
@media(max-width: 900px) { .layout-cols, .cuerpo.grid { grid-template-columns: 1fr; } }

.card-info { background: #fff; border: 1px solid var(--borde); border-radius: 14px; padding: 25px; }
.card-info h3, .cuerpo h3 { color: var(--azul); margin: 0 0 15px; font-size: 1.25rem; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; }

.syllabus-list { padding-left: 0; list-style: none; margin: 0 0 25px; }
.syllabus-list li { margin-bottom: 12px; color: #354658; line-height: 1.5; padding-left: 10px; border-left: 3px solid #eef3f9; }
.syllabus-list b { color: var(--coral); font-weight: 800; margin-right: 5px; }
.std-list, .cuerpo ul { padding-left: 20px; margin: 0 0 25px; color: #354658; line-height: 1.5; }
.std-list li, .cuerpo li { margin-bottom: 8px; }

/* --- TARJETAS DE PRECIOS --- */
.pricing-stack, .info { display: flex; flex-direction: column; gap: 15px; }
.price-panel, .info {
    background: #fff; border: 1px solid var(--borde); border-radius: 14px; padding: 22px;
    position: relative; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.03);
}
.price-panel.destacado { border: 2px solid var(--azul); background: #fbfdff; box-shadow: 0 8px 25px rgba(24, 53, 74, 0.08); }

.price-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px dashed var(--borde); padding-bottom: 10px; }
.price-header h4 { margin: 0; color: var(--azul); font-size: 1.1rem; font-weight: 800; }
.badge-curr { background: #eef3f9; color: var(--azul); font-weight: 700; font-size: 0.75rem; padding: 4px 10px; border-radius: 6px; }

.price-row, .fila { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; font-size: 0.95rem; }
.price-row .label, .fila b { color: #556274; font-weight: 500; }
.price-row .value-old { color: #9aa4b2; text-decoration: line-through; font-size: 0.9rem; }
.final-price { display: block; font-weight: 800; color: var(--azul); font-size: 1.35rem; line-height: 1; }
.off-tag { background: #ffebee; color: #d32f2f; font-size: 0.7rem; padding: 2px 8px; border-radius: 4px; font-weight: 800; display: inline-block; margin-bottom: 3px; }

/* --- ACORDEONES --- */
details { border: 1px solid var(--borde); border-radius: 12px; margin-bottom: 12px; overflow: hidden; background: #fff; }
summary { padding: 16px 20px; font-weight: 800; color: var(--azul); cursor: pointer; list-style: none; position: relative; padding-right: 50px; }
summary::-webkit-details-marker { display: none; }
summary::after { content: '+'; position: absolute; right: 20px; top: 50%; transform: translateY(-50%); font-size: 1.4rem; color: var(--coral); }
details[open] summary::after { content: '-'; color: var(--azul); }
details[open] summary { background: #fbfdff; border-bottom: 1px dashed var(--borde); color: var(--coral); }
.cuerpo { padding: 20px; color: #354658; }

.nota-final, .advisory { font-size: 0.85rem; color: #6e7b8d; background: #f8fafc; padding: 10px; border-radius: 8px; text-align: center; margin-top: 10px; }
.pc-top { display: block; margin: 20px 0 0; text-align: right; }
.pc-top a { text-decoration: none; color: var(--azul); font-weight: 700; font-size: 0.9rem; }
.faq-footer { margin-top: 30px; padding: 25px; background: #f8fbff; border: 1px solid #e5e7eb; border-radius: 16px; text-align: center; }

/* --- BANNER SERVICIO (FOTOGRAMETRÍA) --- */
.service-banner {
    background: #eef2ff; border: 1px solid #c7d2fe; border-radius: 16px;
    padding: 25px 30px; margin-bottom: 40px; display: flex; flex-wrap: wrap; 
    align-items: center; justify-content: space-between; gap: 20px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.04);
}
.sb-content { display: flex; align-items: center; gap: 15px; }
.sb-text h3 { margin: 0 0 5px; color: #3730a3; font-size: 1.15rem; font-weight: 800; }
.sb-text p { margin: 0; color: #4338ca; font-size: 0.95rem; }
@media(max-width: 700px) { .service-banner { flex-direction: column; text-align: center; } .sb-content { flex-direction: column; } .btn-service { width:100%; text-align:center; } }

/* --- BANNER LEAD MAGNET --- */
.free-banner {
    background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px;
    padding: 15px 20px; margin-bottom: 50px; display: flex; flex-wrap: wrap; 
    align-items: center; justify-content: space-between; gap: 15px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.04);
}
.fb-content { display: flex; align-items: center; gap: 12px; }
.fb-icon { font-size: 1.5rem; }
.fb-text h3 { margin: 0; color: #166534; font-size: 1rem; font-weight: 800; }
.fb-text p { margin: 0; color: #15803d; font-size: 0.9rem; }
.btn-free {
    background: #22c55e; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 99px; 
    font-weight: 700; font-size: 0.9rem; transition: transform 0.2s; white-space: nowrap; 
    box-shadow: 0 4px 10px rgba(34, 197, 94, 0.3); display: inline-block;
}
.btn-free:hover { transform: translateY(-2px); background: #16a34a; }
@media(max-width: 700px) { .free-banner { flex-direction: column; text-align: center; } .fb-content { flex-direction: column; } }

/* --- ECOSISTEMA Y AGENDA STEC (ACTUALIZADO - BRANDED CORAL) --- */
#agenda-stec .stec-badge {
    /* CORAL DE MARCA */
    background: linear-gradient(90deg, #f04e4e, #ff6b6b); 
    color: #fff; padding: 5px 12px; border-radius: 4px; 
    font-weight: 800; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px;
    display: inline-block; margin-bottom: 10px;
    box-shadow: 0 4px 12px rgba(240, 78, 78, 0.3);
}
/* Calendario */
.calendar-wrapper {
    background: #fff; border: 1px solid var(--borde); border-radius: 16px;
    overflow: hidden; margin: 30px 0;
    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}
/* Mini Sidebar Cards (Promo Lateral) */
.side-promo { margin-top: 25px; padding-top: 20px; border-top: 1px dashed #cbd5e1; }
.side-title { font-size: 0.85rem; font-weight: 800; text-transform: uppercase; color: #64748b; margin-bottom: 15px; display: block; letter-spacing: 0.5px; }
.mini-card { display: flex; align-items: center; gap: 12px; background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; margin-bottom: 10px; text-decoration: none; transition: all 0.2s ease; }
.mini-card:hover { transform: translateX(5px); border-color: var(--azul); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.mc-icon { width: 36px; height: 36px; background: #f1f5f9; color: var(--azul); border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.mc-icon svg { width: 18px; height: 18px; fill: currentColor; }
.mc-text b { display: block; font-size: 0.9rem; color: var(--azul); line-height: 1.2; }
.mc-text span { font-size: 0.75rem; color: #64748b; }

/* Grid Ecosistema (Fondo) */
.eco-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 20px; }
.eco-card {
    background: #f8fafc; border: 1px solid var(--borde); border-radius: 12px; padding: 25px;
    text-decoration: none; transition: all 0.2s ease; text-align: center;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.eco-card:hover { 
    transform: translateY(-3px); 
    background: #fff; 
    box-shadow: 0 8px 20px rgba(0,0,0,0.08); 
    border-color: var(--azul); 
}
.eco-icon { 
    color: var(--azul); /* Azul Marca */
    width: 45px; height: 45px; margin-bottom: 15px; 
    background: #eef3f9; 
    border-radius: 50%; padding: 10px;
    display: flex; align-items: center; justify-content: center;
}
.eco-icon svg { width: 24px; height: 24px; fill: currentColor; }
.eco-card h4 { color: var(--azul); margin: 0 0 8px; font-size: 1.1rem; font-weight: 800; }
.eco-card p { color: var(--gris); font-size: 0.9rem; margin: 0; line-height: 1.5; }
@media (max-width: 768px) { .eco-grid { grid-template-columns: 1fr; } }


/* --- ESTILOS COMPARTIDOS (Home Capacitaciones) --- */
.courses-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-bottom: 60px; }
.course-card { background: #fff; border: 1px solid var(--borde); border-radius: 14px; padding: 28px; transition: all 0.3s ease; box-shadow: 0 4px 10px rgba(0,0,0,0.03); display: flex; flex-direction: column; position: relative; overflow: hidden; }
.course-card:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.08); border-color: #d0d7e0; }
.icon-box { width: 48px; height: 48px; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; background: #f0f4f8; border-radius: 10px; color: var(--azul); }
.icon-box svg { width: 24px; height: 24px; fill: currentColor; }
.course-card h3 { margin: 0 0 12px; color: var(--azul); font-size: 1.3rem; font-weight: 800; }
.course-card p { color: var(--gris); font-size: 0.95rem; line-height: 1.6; margin-bottom: 25px; flex-grow: 1; }
.btn-course { text-decoration: none; border: 1px solid var(--borde); color: var(--azul); padding: 12px; border-radius: 8px; text-align: center; font-weight: 700; font-size: 0.9rem; transition: all 0.2s; background: #fbfdff; }
.btn-course:hover { border-color: var(--azul); background: #fff; color: var(--azul); }
.btn-course.disabled { background: #f3f4f6; color: #9aa4b2; border-color: transparent; pointer-events: none; }
.tag-soon { display: inline-block; background: #eef3f9; color: #6e7b8d; font-size: 0.7rem; padding: 4px 10px; border-radius: 20px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid #e5e7eb; position: absolute; top: 28px; right: 28px; }
.featured-card { background: #fff; border: 1px solid var(--borde); border-radius: 16px; overflow: hidden; margin-bottom: 60px; box-shadow: 0 8px 25px rgba(0,0,0,0.06); display: grid; grid-template-columns: 1.2fr 1fr; }
.feat-content { padding: 40px; display: flex; flex-direction: column; justify-content: center; }
.feat-links { background: #f8fbff; padding: 40px; border-left: 1px solid var(--borde); display: flex; flex-direction: column; gap: 12px; justify-content: center; }
.mod-link { display: flex; align-items: center; justify-content: space-between; background: #fff; border: 1px solid var(--borde); padding: 14px 18px; border-radius: 10px; text-decoration: none; color: var(--azul); font-weight: 700; transition: all 0.2s ease; }
.mod-link:hover { transform: translateX(5px); border-color: var(--azul); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.mod-arrow { color: var(--coral); font-weight: 900; }
@media (max-width: 860px) { .featured-card { grid-template-columns: 1fr; } .feat-links { border-left: none; border-top: 1px solid var(--borde); } }
.res-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px; }
.res-card { background: #fff; padding: 20px; border-radius: 12px; border: 1px solid var(--borde); text-decoration: none; color: var(--azul); display: flex; align-items: center; gap: 15px; transition: all 0.2s; }
.res-card:hover { border-color: var(--coral); transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.05); }
.res-icon { background: #fff5f5; color: var(--coral); width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
.res-icon svg { width: 20px; height: 20px; fill: currentColor; }
.res-text h4 { margin: 0 0 2px; font-size: 1.05rem; font-weight: 700; }
.res-text span { font-size: 0.85rem; color: var(--gris); }
.sec-title { font-size: 1.8rem; color: var(--azul); margin: 0 0 25px; font-weight: 800; border-left: 5px solid var(--coral); padding-left: 15px; line-height: 1; }

/* ==========================================================================
   4. ESTILOS DE HERRAMIENTAS ESPECÍFICAS (NO TOCAR)
   ========================================================================== */
#faja-local-tool{ --azul:#18354a; --coral:#f04e4e; --gris:#6e7b8d; --borde:#e5e7eb; font-family:inherit; }
#faja-local-tool .wrap{ background:#fff; border:1px solid var(--borde); border-radius:16px; padding:20px; box-shadow:0 10px 24px rgba(0,0,0,.06) }
#faja-local-tool h2{ margin:0 0 6px; color:var(--azul); font-size:1.6rem; line-height:1.15 }
#faja-local-tool .sub{ margin:0 0 14px; color:var(--gris) }
#faja-local-tool .actions{ display:flex; gap:10px; flex-wrap:wrap; margin:6px 0 10px }
#faja-local-tool .btn{ display:inline-block; text-decoration:none; border-radius:10px; padding:10px 14px; font-weight:800; letter-spacing:.2px; border:1px solid var(--borde); background:#eef3f9; color:var(--azul); transition:filter .15s ease, transform .05s ease }
#faja-local-tool .btn:hover{ filter:brightness(.98) }
#faja-local-tool .btn:active{ transform:translateY(1px) }
#faja-local-tool .btn.primary{ background:var(--coral); color:#fff; border-color:transparent; box-shadow:0 10px 22px rgba(240,78,78,.25) }
#faja-local-tool .manual{ display:flex; gap:8px; align-items:center; flex-wrap:wrap }
#faja-local-tool .small{ font-size:.85rem; color:var(--gris) }
#faja-local-tool input[type="number"]{ width:100%; max-width:220px; padding:10px; border:1px solid var(--borde); border-radius:10px; background:#fff; outline:none }
#faja-local-tool input[type="number"]:focus, #faja-local-tool .btn:focus{ outline:2px solid #d8e8f7; outline-offset:2px }
#faja-local-tool .grid{ display:grid; gap:14px; grid-template-columns:1fr 1fr }
@media (max-width:860px){ #faja-local-tool .grid{ grid-template-columns:1fr } }
#faja-local-tool .card{ background:#fbfdff; border:1px solid var(--borde); border-radius:12px; padding:14px }
#faja-local-tool .out{ font-weight:700; color:#1f2f44 }
#faja-local-tool .hint{ color:var(--gris); font-size:.92rem }
#faja-local-tool .error{ color:#b71c1c; font-weight:700; margin-top:6px }
@media (max-width:520px){ #faja-local-tool .actions .btn{ width:100%; text-align:center } #faja-local-tool .manual .btn{ width:100% } #faja-local-tool input[type="number"]{ max-width:none } }

#conv-coord-tool{ --azul:#18354a; --coral:#f04e4e; --gris:#6e7b8d; --borde:#e5e7eb; font-family:inherit }
#conv-coord-tool .wrap{ background:#fff; border:1px solid var(--borde); border-radius:16px; box-shadow:0 10px 24px rgba(0,0,0,.06); padding:20px }
#conv-coord-tool h2{ margin:0 0 6px; color:var(--azul); font-size:1.6rem; line-height:1.15 }
#conv-coord-tool .sub{ margin:0 0 14px; color:var(--gris) }
#conv-coord-tool .grid{ display:grid; gap:14px; grid-template-columns:1fr 1fr }
@media (max-width:860px){ #conv-coord-tool .grid{ grid-template-columns:1fr } }
#conv-coord-tool .card{ background:#fbfdff; border:1px solid var(--borde); border-radius:12px; padding:14px }
#conv-coord-tool .card-title{ margin:0 0 10px; color:#18354a; font-size:1.1rem }
#conv-coord-tool .fields{ display:grid; gap:12px; grid-template-columns:1fr 1fr }
@media (max-width:640px){ #conv-coord-tool .fields{ grid-template-columns:1fr } }
#conv-coord-tool .field label{ display:block; font-size:.9rem; color:#4b596c; margin:0 0 4px }
#conv-coord-tool input, #conv-coord-tool select{ width:100%; padding:10px 12px; border:1px solid var(--borde)!important; border-radius:10px!important; background:#fff!important; box-shadow:none!important; color:#1f2f44; outline:none }
#conv-coord-tool select{ appearance:none; background-image: linear-gradient(45deg,transparent 50%, #8aa0b5 50%), linear-gradient(135deg,#8aa0b5 50%, transparent 50%); background-position: right 14px top 16px, right 8px top 16px; background-size:6px 6px, 6px 6px; background-repeat:no-repeat; padding-right:34px }
#conv-coord-tool .actions{ display:flex; gap:10px; flex-wrap:wrap; margin:10px 0 }
#conv-coord-tool .btn{ display:inline-block; text-decoration:none; border-radius:10px; padding:10px 14px; font-weight:800; letter-spacing:.2px; border:1px solid var(--borde)!important; background:#eef3f9!important; color:var(--azul)!important }
#conv-coord-tool .btn.primary{ background:var(--coral)!important; color:#fff!important; border-color:transparent!important; box-shadow:0 10px 22px rgba(240,78,78,.25) }
#conv-coord-tool input[type="checkbox"]{ accent-color:var(--coral) }
#conv-coord-tool .gk-options label{ display:inline-flex; align-items:center; gap:8px; background:#f6f7f9; border:1px solid var(--borde); border-radius:10px; padding:6px 10px; color:#4b596c; font-size:.9rem }
@media (max-width:640px){ #conv-coord-tool .gk-options{ gap:8px } #conv-coord-tool .gk-options label{ width:100% } }

#gk-posgar07-tool{ --azul:#18354a; --coral:#f04e4e; --gris:#6e7b8d; --borde:#e5e7eb; font-family:inherit }
#gk-posgar07-tool .wrap{ background:#fff; border:1px solid var(--borde); border-radius:16px; box-shadow:0 10px 24px rgba(0,0,0,.06); padding:20px }
#gk-posgar07-tool h2{ margin:0 0 6px; color:#18354a; font-size:1.6rem; line-height:1.15 }
#gk-posgar07-tool .sub{ margin:0 0 14px; color:#6e7b8d }
#gk-posgar07-tool .card{ background:#fbfdff; border:1px solid var(--borde); border-radius:12px; padding:14px }
#gk-posgar07-tool .row{ display:grid; gap:12px; grid-template-columns:1fr 1fr }
@media (max-width:720px){ #gk-posgar07-tool .row{ grid-template-columns:1fr } }
#gk-posgar07-tool label{ display:block; font-size:.9rem; color:#4b596c; margin-bottom:6px }
#gk-posgar07-tool input[type="number"], #gk-posgar07-tool input[type="text"], #gk-posgar07-tool select{ width:100%; padding:10px 12px; border:1px solid var(--borde); border-radius:10px; background:#fff; box-shadow:none; outline:none }
#gk-posgar07-tool .dms{ display:grid; grid-template-columns:1fr auto 1fr auto 1.4fr auto 1fr; gap:8px; align-items:center }
#gk-posgar07-tool .dms .sym{ color:#7b8a9a; min-width:10px; text-align:center }
#gk-posgar07-tool .actions{ display:flex; gap:10px; flex-wrap:wrap; margin:12px 0 }
#gk-posgar07-tool .btn{ display:inline-block; text-decoration:none; border-radius:10px; padding:10px 14px; font-weight:800; letter-spacing:.2px; border:1px solid var(--borde); background:#eef3f9; color:#18354a }
#gk-posgar07-tool .btn.primary{ background:#f04e4e; color:#fff; border-color:transparent; box-shadow:0 10px 22px rgba(240,78,78,.25) }
#gk-posgar07-tool .info{ margin-top:8px; font-weight:700; color:#1f2f44 }
#gk-posgar07-tool .hint{ color:#6e7b8d; font-size:.92rem; margin-top:8px }
#gk-posgar07-tool .result-primary{ border:1px solid #e5e7eb; background:#f8fbff; border-radius:12px; padding:12px; margin:8px 0 4px; box-shadow:0 6px 16px rgba(0,0,0,.04) }
#gk-posgar07-tool .result-primary .badge{ display:inline-block; background:linear-gradient(180deg,#1c3a50,#18354a); color:#fff; font-weight:800; font-size:.78rem; border-radius:999px; padding:4px 10px; margin-bottom:8px }
#gk-posgar07-tool .result-primary .soft{ color:#6e7b8d; font-weight:400 }
#gk-posgar07-tool input[readonly]{ background:#fffdfd }
#gk-posgar07-tool .emph-field label{ color:#18354a; font-weight:900; letter-spacing:.2px }
#gk-posgar07-tool .copy-stack{ display:flex; flex-direction:column; gap:8px; align-items:stretch }
#gk-posgar07-tool #out_y_fmt, #gk-posgar07-tool #out_x_fmt{ background:#fff7ed; border:2px solid #f04e4e; color:#1f2f44; font-weight:800; font-size:1.1rem; padding:14px 12px; border-radius:12px; box-shadow:0 0 0 3px rgba(240,78,78,.12) }
#gk-posgar07-tool #out_y_fmt:focus, #gk-posgar07-tool #out_x_fmt:focus{ outline:none; box-shadow:0 0 0 4px rgba(240,78,78,.22) }
#gk-posgar07-tool .copy-btn{ width:100%; text-align:center; border:1px solid #e5e7eb; background:#eef3f9; color:#18354a; font-weight:800; padding:12px 14px; border-radius:10px; cursor:pointer; transition:.15s ease }
#gk-posgar07-tool .copy-btn:hover{ filter:brightness(.98) }
#gk-posgar07-tool .copy-btn:active{ transform:translateY(1px) }
@media (max-width:600px){ #gk-posgar07-tool #out_y_fmt, #gk-posgar07-tool #out_x_fmt{ font-size:1.15rem; padding:16px 14px } }
@media (prefers-color-scheme:dark){ #gk-posgar07-tool #out_y_fmt, #gk-posgar07-tool #out_x_fmt{ background:#2a1f1c; border-color:#f04e4e; color:#f6f7f9 } }

#asesoria-tecnica { --azul:#18354a; --borde:#e5e7eb }
#asesoria-tecnica h2{ margin:0 0 8px; line-height:1.2 }
#asesoria-tecnica h3{ font-size:1.02rem; margin:0 0 8px }
@media (max-width:920px){ #asesoria-tecnica [style*="grid-template-columns:1fr 1fr"]{ grid-template-columns:1fr!important } }
#asesoria-tecnica ul, #asesoria-tecnica ol{ padding-left:18px; margin:0 }
#asesoria-tecnica li{ margin-bottom:6px; word-break:break-word; hyphens:auto; line-height:1.55 }
#asesoria-tecnica a[href^="#"]{ text-decoration:none }
@media (max-width:640px){ #asesoria-tecnica > div > div > a{ width:100%; text-align:center } #asesoria-tecnica #contacto a{ width:100%; text-align:center } }
#asesoria-tecnica .pill + .pill{ margin-left:8px }
#asesoria-tecnica p{ margin:0 0 10px }

#eg-csv2dxf{ --azul:#18354a; --coral:#f04e4e; --coral-100:#fff1f2; --coral-200:#ffdede; --coral-300:#ffc7c7; --panel:#111827; --bg:#0f172a; --border:#1f		
```

### script.js

```javascript
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

```

### meta.json

```json
{
  "title": "Consulta de faja – Equipargeo",
  "description": null,
  "canonical": "https://equipargeo.com/herramientas-gnss/",
  "og": {},
  "slug_origen": "herramientas-gnss",
  "slug_destino": "faja",
  "section_id": "faja-local-tool",
  "section_extraida": true,
  "section_size_chars": 1402,
  "style_extraido": true,
  "style_size_chars": 29333,
  "script_extraido": true,
  "script_size_chars": 3318
}
```

---

## Herramienta 2: POSGAR07 (Conversor coordenadas)

### section.html

```html
<section id="gk-posgar07-tool" style="width:100%;max-width:1100px;margin:40px auto;padding:0 15px;">
<div class="wrap">
<h2>Coordenadas Geográficas → Gauss-Krüger (POSGAR 07)</h2>
<p class="sub">
      Conversión de coordenadas utilizando <strong>POSGAR 07</strong> – Elipsoide <strong>GRS80</strong>, proyección
      <strong>Gauss-Krüger 3°</strong>, <strong>k₀=1</strong>. Resultados parciales referidos en el eje Y desde el meridiano central, eje X desde el ecuador.<em> Se indican los resultados finales con su respectivo incremento en norte y este junto al prefijo de la faja correspondiente.</em>
</p>
<div class="card">
<!-- Lat/Long DMS -->
<div class="row">
<div class="col">
<label>Latitud (DMS)</label>
<div class="dms">
<input id="lat_d" placeholder="34" step="1" type="number"/><span class="sym">°</span>
<input id="lat_m" placeholder="40" step="1" type="number"/><span class="sym">′</span>
<input id="lat_s" placeholder="20.000000" step="0.0000001" type="number"/><span class="sym">″</span>
<select id="lat_h"><option selected="" value="S">S</option><option value="N">N</option></select>
</div>
</div>
<div class="col">
<label>Longitud (DMS)</label>
<div class="dms">
<input id="lon_d" placeholder="60" step="1" type="number"/><span class="sym">°</span>
<input id="lon_m" placeholder="22" step="1" type="number"/><span class="sym">′</span>
<input id="lon_s" placeholder="20.000000" step="0.0000001" type="number"/><span class="sym">″</span>
<select id="lon_h"><option selected="" value="O">O</option><option value="E">E</option></select>
</div>
</div>
</div>
<!-- Faja / Meridiano -->
<div class="row">
<div class="col">
<label>Faja <span class="soft">(detectada automáticamente)</span></label>
<select aria-label="Faja detectada automáticamente" id="gk_faja">
<option value="1">1 · 72°O</option><option value="2">2 · 69°O</option><option value="3">3 · 66°O</option>
<option value="4">4 · 63°O</option><option selected="" value="5">5 · 60°O</option><option value="6">6 · 57°O</option><option value="7">7 · 54°O</option>
</select>
</div>
<div class="col">
<label>Meridiano central personalizado (°) <span class="soft">(opcional)</span></label>
<input id="gk_cm_custom" placeholder="ej.: -58.300000" step="0.000001" type="number"/>
</div>
</div>
<!-- Acciones -->
<div class="actions">
<button class="btn primary" id="btn_convertir_gk">Convertir a GK (X,Y)</button>
<button class="btn" id="btn_limpiar_gk">Limpiar</button>
</div>
<!-- RESULTADO PRINCIPAL (SIN FALSOS) -->
<div class="result-primary" id="gk_result_primary">
<div class="badge">Resultados parciales</div>
<div class="row">
<div class="col">
<label>Coordenada Y — Este (m) <span class="soft">(sin falsos)</span></label>
<input id="out_y" placeholder="Y" readonly="" type="text"/>
</div>
<div class="col">
<label>Coordenada X — Norte (m) <span class="soft">(sin falsos)</span></label>
<input id="out_x" placeholder="X" readonly="" type="text"/>
</div>
</div>
</div>
<!-- Formatos alternativos para controlador -->
<hr style="border:none;border-top:1px solid #e5e7eb;margin:14px 0"/>
<div class="row">
<div class="col">
<label><input checked="" id="opt_prefijo" type="checkbox"/> Prefijo de faja en Y (Y’ = faja×1 000 000 + Y)</label>
<label style="display:block;margin-top:8px;"><input checked="" id="opt_fn" type="checkbox"/> Aplicar Falso Norte</label>
<input id="val_fn" placeholder="10000000" step="1" type="number" value="10000000"/>
</div>
<div class="col">
<label style="display:block;">Aplicar Falso Este</label>
<input id="val_fe" placeholder="p.ej. 9000000" step="1" type="number" value="0"/>
</div>
</div>
<!-- Campos formateados (resaltados + botón COPIAR debajo) -->
<div class="row" style="margin-top:8px;">
<div class="col emph-field">
<label for="out_y_fmt">Coordenada Y — Este</label>
<div class="copy-stack">
<input id="out_y_fmt" placeholder="Coordenada Y — Este" readonly="" type="text"/>
<button class="copy-btn" data-target="out_y_fmt" type="button">Copiar</button>
</div>
</div>
<div class="col emph-field">
<label for="out_x_fmt">Coordebada X — Norte</label>
<div class="copy-stack">
<input id="out_x_fmt" placeholder="Coordebada X — Norte" readonly="" type="text"/>
<button class="copy-btn" data-target="out_x_fmt" type="button">Copiar</button>
</div>
</div>
</div>
<div class="info" id="out_info"></div>
<!-- Notas técnicas -->
<details style="margin-top:10px;">
<summary style="cursor:pointer;font-weight:700;color:#18354a;">Notas técnicas</summary>
<div style="margin-top:8px;color:#4b596c;line-height:1.55;">
<ul style="margin:0 0 8px 18px;">
<li><strong>Marco / Datum:</strong> POSGAR 07 / SIRGAS, elipsoide <strong>GRS80</strong> (a=6378137.0 m; 1/f=298.257222101).</li>
<li><strong>Proyección:</strong> Transverse Mercator (Gauss-Krüger) de <strong>3°</strong>, <strong>k₀=1</strong>.</li>
<li><strong>Fajas:</strong> 1…7 con meridianos centrales −72°, −69°, −66°, −63°, −60°, −57°, −54°. La faja se <em>detecta por longitud</em>.</li>
<li><strong>Resultado base “sin falsos”:</strong> <em>Y</em> desde el meridiano central (negativa al Oeste, positiva al Este) y <em>X</em> desde el ecuador (en el hemisferio Sur resulta negativa).</li>
<li><strong>Formatos opcionales:</strong> <em>Prefijo de faja en Y</em> (Y’=faja×1 000 000+Y), <em>Falso Norte</em> (típicamente +10 000 000 m en Sur) y <em>Falso Este</em> (según el usuario; p.ej. 9 000 000 m).</li>
<li><strong>Entrada DMS:</strong> 0 ≤ min,seg &lt; 60. Los hemisferios <em>S</em>/<em>O</em> invierten el signo. El cálculo redondea salidas a 0.001 m para visualización.</li>
<li><strong>Uso:</strong> conversión “instantánea” para campo u oficina. Para documentación oficial, verificá con tu software de referencia.</li>
</ul>
</div>
</details>
<p class="hint" style="margin-top:8px;">
<strong>¿Por qué vienen tildadas estas opciones?</strong> En Argentina es frecuente:<br/>
  (1) usar <em>prefijo de faja en Y</em> para evitar ambigüedades entre fajas,<br/>
  (2) aplicar <em>Falso Norte = +10 000 000 m</em> para mantener <em>X</em> positivo en el hemisferio Sur.
  Muchos controladores esperan este formato.
</p>
</div>
</div>
</section>
```

### style.css

```css

			/* ==========================================================================
   EQUIPARGEO – CSS GLOBAL (VERSIÓN FINAL PULIDA - BRANDING CORREGIDO)
   ========================================================================== */

/* ===== 1. RESET Y ESTRUCTURA DE PÁGINAS (ID 2 y 213) ===== */
body.page-id-2 .page-title,
body.page-id-2 .entry-title,
body.page-id-2 .entry-header,
body.page-id-2 .breadcrumbs,
body.page-id-2 .breadcrumb,
body.page-id-2 .breadcrumb-trail,
body.page-id-2 #secondary,
body.page-id-2 .sidebar,
body.page-id-2 .widget-area,
body.page-id-2 #comments,
body.page-id-2 .comments-area{ display:none!important }

body.page-id-2 #primary,
body.page-id-2 .content-area,
body.page-id-2 .site-content .content-area,
body.page-id-2 .site-main,
body.page-id-2 .content{ width:100%!important; max-width:none!important; float:none!important }

body.page-id-2 .site-content,
body.page-id-2 .content-wrap,
body.page-id-2 .container,
body.page-id-2 .row{ grid-template-columns:1fr!important }

body.page-id-2 .entry-content > *:not(.alignwide):not(.alignfull){
  margin-left:auto; margin-right:auto; max-width:1100px
}

body.page-id-2 .site-content{ padding-top:0 }

/* Página ID 213 */
body.page-id-213 .top-bar,
body.page-id-213 .site-header,
body.page-id-213 header.site-header,
body.page-id-213 .page-header,
body.page-id-213 .entry-header,
body.page-id-213 .page-title,
body.page-id-213 .breadcrumbs,
body.page-id-213 nav.breadcrumb,
body.page-id-213 .td-breadcrumbs,
body.page-id-213 .hero,
body.page-id-213 .hero-header{ display:none!important }

body.page-id-213 #content,
body.page-id-213 .site-content,
body.page-id-213 .content-area,
body.page-id-213 .container,
body.page-id-213 .inner,
body.page-id-213 main{ margin-top:0!important; padding-top:0!important }

@media (max-width:782px){
  body.page-id-213 #content,
  body.page-id-213 .site-content,
  body.page-id-213 .content-area,
  body.page-id-213 main{ padding-top:0!important }
}

/* ===== 2. SECCIÓN MENÚ HERRAMIENTAS (GRID) ===== */
#herramientas .tools-grid{ grid-template-columns:repeat(2,minmax(0,1fr)) }
#herramientas .tool-title{ word-break:break-word; hyphens:auto }
#herramientas .status{ display:inline-block; margin:6px 0; }

@media (max-width:900px){
  #herramientas .tools-grid{ grid-template-columns:1fr!important }
  #herramientas .tools-chips{ justify-content:center }
  #herramientas .actions a, #herramientas .actions span{ width:100%; text-align:center }
}

/* Cards genéricas de herramientas */
.eg-tools-grid{ display:grid; gap:14px; grid-template-columns:repeat(12,1fr); margin-top:10px }
.eg-tool-card{
  grid-column:span 12; background:#fbfdff; border:1px solid #e5e7eb; border-radius:14px;
  padding:16px; box-shadow:0 10px 24px rgba(0,0,0,.06)
}
@media (min-width:900px){ .eg-tool-card{ grid-column:span 6 } }

.eg-badge{
  display:inline-block; background:#e74a4a; color:#fff; border-radius:999px; padding:4px 10px;
  font-size:.78rem; font-weight:800; letter-spacing:.2px; width:max-content
}

/* ==========================================================================
   3. ESTILOS EDUCATIVOS UNIFICADOS (GNSS + TOPOGRAFÍA + FOTOGRAMETRÍA)
   ========================================================================== */
#programa-completo, #cta-curso, #faq-curso,
#programa-topografia, #cta-topo, #faq-topo,
#programa-fotogrametria, #cta-foto, #faq-foto,
#curso-modulo-1, #curso-modulo-2, #curso-modulo-3,
#curso-topo-m1, #curso-topo-m2, #curso-topo-m3,
#curso-foto-m1, #curso-foto-m2, #curso-foto-m3,
#capacitaciones-home, #agenda-stec {
    --azul: #18354a;
    --coral: #f04e4e;
    --gris: #6e7b8d;
    --borde: #e5e7eb;
    --bg-soft: #f8fafc;
    --wsp-green: #25d366;
    /* Nuevo azul tecnológico STEC (Solo para detalles menores si hace falta) */
    --stec-blue: #0052cc; 
    font-family: inherit;
    box-sizing: border-box;
}

/* --- HERO OSCURO (Dark Header) --- */
.mod-hero, .pc-hero-dark, .cap-hero {
    background: linear-gradient(180deg, #1c3a50, #18354a);
    border-radius: 16px; padding: 45px 25px; margin-bottom: 30px;
    color: #fff; text-align: center;
    box-shadow: 0 12px 30px rgba(0,0,0,0.15);
    position: relative; overflow: hidden;
}
.mod-hero h1, .pc-hero-dark h1, .cap-hero h1 {
    color: #fff !important; margin: 0 0 15px;
    font-size: clamp(1.8rem, 5vw, 2.4rem); font-weight: 800; line-height: 1.1;
}
.mod-hero .subtitulo, .pc-hero-dark .sub, .cap-hero p {
    color: #dcebf7 !important; margin: 0 auto 25px;
    font-size: 1.1rem; max-width: 800px; line-height: 1.6;
}
.highlight-mod, .mod-label, .feat-tag {
    color: #81d4fa; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; 
    display: block; margin-bottom: 10px; font-size: 0.9rem;
}
/* Tag específico para tarjetas */
.feat-tag { background: var(--coral); color: #fff; padding: 4px 10px; border-radius: 4px; width: fit-content; color: #fff; }

/* --- INDICADORES DE PASOS (1-2-3) --- */
.mod-steps {
    display: flex; justify-content: center; align-items: center; gap: 12px; margin-bottom: 20px;
}
.step-dot {
    width: 32px; height: 32px; border-radius: 50%;
    background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.5);
    font-weight: 700; font-size: 0.85rem;
    display: flex; align-items: center; justify-content: center;
    border: 1px solid rgba(255,255,255,0.15);
}
.step-dot.active {
    background: var(--coral); color: #fff; border-color: var(--coral);
    transform: scale(1.1); box-shadow: 0 0 15px rgba(240, 78, 78, 0.4);
}
.step-line { width: 25px; height: 2px; background: rgba(255,255,255,0.15); }

/* --- BOTONES (CTA) --- */
/* Estilos base */
.mod-btn, .btn, .btn-main {
    display: inline-block; text-decoration: none; border-radius: 10px;
    padding: 12px 24px; font-weight: 800; text-align: center; transition: all .2s ease; cursor: pointer;
}

/* Nav Superior: REDONDEADO FORZADO */
.pc-nav { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-bottom: 30px; }
.pc-nav a {
    display: inline-block; text-decoration: none; 
    border-radius: 50px !important; 
    padding: 10px 24px; font-weight: 700; text-align: center; 
    transition: all .2s ease; cursor: pointer;
    background: rgba(255,255,255,0.05); color: #fff !important; 
    border: 1px solid rgba(255,255,255,0.4);
}
.pc-nav a:hover { background: #fff; color: var(--azul) !important; border-color: #fff; transform: translateY(-2px); }

/* Primario */
.mod-btn.primary, .btn.primary { 
    background: var(--coral); color: #fff !important; 
    box-shadow: 0 8px 20px rgba(240,78,78,.3); border: 2px solid var(--coral); 
}
.mod-btn.primary:hover, .btn.primary:hover { transform: translateY(-2px); box-shadow: 0 12px 25px rgba(240,78,78,.4); background: #ff5f5f; }

/* Ghost */
.mod-btn.ghost { 
    background: rgba(255,255,255,0.05); color: #fff !important; 
    border: 2px solid rgba(255,255,255,0.4);
}
.mod-btn.ghost:hover { background: #fff; color: var(--azul) !important; border-color: #fff; }

.btn.ghost-dark { background: #eef3f9; color: var(--azul); border: 1px solid var(--borde); }
.btn.ghost-dark:hover { background: #e2eaf5; }

.btn-main { background: var(--azul); color: #fff; border: 2px solid var(--azul); }
.btn-main:hover { background: #2c4a63; transform: translateY(-2px); }

.btn-wsp-green {
    display: inline-block; text-decoration: none; background: var(--wsp-green); color: #fff !important;
    font-weight: 800; padding: 12px 24px; border-radius: 999px; box-shadow: 0 6px 18px rgba(37,211,102,0.25);
    transition: all 0.2s;
}
.btn-wsp-green:hover { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(37,211,102,0.35); }

/* Botón Servicio */
.btn-service {
    background: #4f46e5; color: #fff; text-decoration: none; padding: 12px 24px; 
    border-radius: 50px; font-weight: 700; font-size: 0.95rem; transition: transform 0.2s;
    display: inline-block; box-shadow: 0 4px 10px rgba(79, 70, 229, 0.3);
}
.btn-service:hover { transform: translateY(-2px); background: #4338ca; }

/* --- GRIDS Y LAYOUT --- */
.datos-grid { display: grid; gap: 12px; grid-template-columns: repeat(4, 1fr); margin-bottom: 30px; }
.dato-card, .nota {
    background: #fff; border: 1px solid var(--borde); border-radius: 12px;
    padding: 15px; text-align: center; font-size: 0.95rem; color: #354658;
    box-shadow: 0 4px 10px rgba(0,0,0,0.03);
}
.dato-card b { display: block; color: var(--azul); font-size: 0.8rem; text-transform: uppercase; margin-bottom: 5px; opacity: 0.85; }
@media(max-width: 768px) { .datos-grid { grid-template-columns: 1fr 1fr; } }

.layout-cols, .cuerpo.grid { display: grid; gap: 30px; grid-template-columns: 1.8fr 1.2fr; }
@media(max-width: 900px) { .layout-cols, .cuerpo.grid { grid-template-columns: 1fr; } }

.card-info { background: #fff; border: 1px solid var(--borde); border-radius: 14px; padding: 25px; }
.card-info h3, .cuerpo h3 { color: var(--azul); margin: 0 0 15px; font-size: 1.25rem; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; }

.syllabus-list { padding-left: 0; list-style: none; margin: 0 0 25px; }
.syllabus-list li { margin-bottom: 12px; color: #354658; line-height: 1.5; padding-left: 10px; border-left: 3px solid #eef3f9; }
.syllabus-list b { color: var(--coral); font-weight: 800; margin-right: 5px; }
.std-list, .cuerpo ul { padding-left: 20px; margin: 0 0 25px; color: #354658; line-height: 1.5; }
.std-list li, .cuerpo li { margin-bottom: 8px; }

/* --- TARJETAS DE PRECIOS --- */
.pricing-stack, .info { display: flex; flex-direction: column; gap: 15px; }
.price-panel, .info {
    background: #fff; border: 1px solid var(--borde); border-radius: 14px; padding: 22px;
    position: relative; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.03);
}
.price-panel.destacado { border: 2px solid var(--azul); background: #fbfdff; box-shadow: 0 8px 25px rgba(24, 53, 74, 0.08); }

.price-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px dashed var(--borde); padding-bottom: 10px; }
.price-header h4 { margin: 0; color: var(--azul); font-size: 1.1rem; font-weight: 800; }
.badge-curr { background: #eef3f9; color: var(--azul); font-weight: 700; font-size: 0.75rem; padding: 4px 10px; border-radius: 6px; }

.price-row, .fila { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; font-size: 0.95rem; }
.price-row .label, .fila b { color: #556274; font-weight: 500; }
.price-row .value-old { color: #9aa4b2; text-decoration: line-through; font-size: 0.9rem; }
.final-price { display: block; font-weight: 800; color: var(--azul); font-size: 1.35rem; line-height: 1; }
.off-tag { background: #ffebee; color: #d32f2f; font-size: 0.7rem; padding: 2px 8px; border-radius: 4px; font-weight: 800; display: inline-block; margin-bottom: 3px; }

/* --- ACORDEONES --- */
details { border: 1px solid var(--borde); border-radius: 12px; margin-bottom: 12px; overflow: hidden; background: #fff; }
summary { padding: 16px 20px; font-weight: 800; color: var(--azul); cursor: pointer; list-style: none; position: relative; padding-right: 50px; }
summary::-webkit-details-marker { display: none; }
summary::after { content: '+'; position: absolute; right: 20px; top: 50%; transform: translateY(-50%); font-size: 1.4rem; color: var(--coral); }
details[open] summary::after { content: '-'; color: var(--azul); }
details[open] summary { background: #fbfdff; border-bottom: 1px dashed var(--borde); color: var(--coral); }
.cuerpo { padding: 20px; color: #354658; }

.nota-final, .advisory { font-size: 0.85rem; color: #6e7b8d; background: #f8fafc; padding: 10px; border-radius: 8px; text-align: center; margin-top: 10px; }
.pc-top { display: block; margin: 20px 0 0; text-align: right; }
.pc-top a { text-decoration: none; color: var(--azul); font-weight: 700; font-size: 0.9rem; }
.faq-footer { margin-top: 30px; padding: 25px; background: #f8fbff; border: 1px solid #e5e7eb; border-radius: 16px; text-align: center; }

/* --- BANNER SERVICIO (FOTOGRAMETRÍA) --- */
.service-banner {
    background: #eef2ff; border: 1px solid #c7d2fe; border-radius: 16px;
    padding: 25px 30px; margin-bottom: 40px; display: flex; flex-wrap: wrap; 
    align-items: center; justify-content: space-between; gap: 20px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.04);
}
.sb-content { display: flex; align-items: center; gap: 15px; }
.sb-text h3 { margin: 0 0 5px; color: #3730a3; font-size: 1.15rem; font-weight: 800; }
.sb-text p { margin: 0; color: #4338ca; font-size: 0.95rem; }
@media(max-width: 700px) { .service-banner { flex-direction: column; text-align: center; } .sb-content { flex-direction: column; } .btn-service { width:100%; text-align:center; } }

/* --- BANNER LEAD MAGNET --- */
.free-banner {
    background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px;
    padding: 15px 20px; margin-bottom: 50px; display: flex; flex-wrap: wrap; 
    align-items: center; justify-content: space-between; gap: 15px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.04);
}
.fb-content { display: flex; align-items: center; gap: 12px; }
.fb-icon { font-size: 1.5rem; }
.fb-text h3 { margin: 0; color: #166534; font-size: 1rem; font-weight: 800; }
.fb-text p { margin: 0; color: #15803d; font-size: 0.9rem; }
.btn-free {
    background: #22c55e; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 99px; 
    font-weight: 700; font-size: 0.9rem; transition: transform 0.2s; white-space: nowrap; 
    box-shadow: 0 4px 10px rgba(34, 197, 94, 0.3); display: inline-block;
}
.btn-free:hover { transform: translateY(-2px); background: #16a34a; }
@media(max-width: 700px) { .free-banner { flex-direction: column; text-align: center; } .fb-content { flex-direction: column; } }

/* --- ECOSISTEMA Y AGENDA STEC (ACTUALIZADO - BRANDED CORAL) --- */
#agenda-stec .stec-badge {
    /* CORAL DE MARCA */
    background: linear-gradient(90deg, #f04e4e, #ff6b6b); 
    color: #fff; padding: 5px 12px; border-radius: 4px; 
    font-weight: 800; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px;
    display: inline-block; margin-bottom: 10px;
    box-shadow: 0 4px 12px rgba(240, 78, 78, 0.3);
}
/* Calendario */
.calendar-wrapper {
    background: #fff; border: 1px solid var(--borde); border-radius: 16px;
    overflow: hidden; margin: 30px 0;
    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}
/* Mini Sidebar Cards (Promo Lateral) */
.side-promo { margin-top: 25px; padding-top: 20px; border-top: 1px dashed #cbd5e1; }
.side-title { font-size: 0.85rem; font-weight: 800; text-transform: uppercase; color: #64748b; margin-bottom: 15px; display: block; letter-spacing: 0.5px; }
.mini-card { display: flex; align-items: center; gap: 12px; background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; margin-bottom: 10px; text-decoration: none; transition: all 0.2s ease; }
.mini-card:hover { transform: translateX(5px); border-color: var(--azul); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.mc-icon { width: 36px; height: 36px; background: #f1f5f9; color: var(--azul); border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.mc-icon svg { width: 18px; height: 18px; fill: currentColor; }
.mc-text b { display: block; font-size: 0.9rem; color: var(--azul); line-height: 1.2; }
.mc-text span { font-size: 0.75rem; color: #64748b; }

/* Grid Ecosistema (Fondo) */
.eco-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 20px; }
.eco-card {
    background: #f8fafc; border: 1px solid var(--borde); border-radius: 12px; padding: 25px;
    text-decoration: none; transition: all 0.2s ease; text-align: center;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.eco-card:hover { 
    transform: translateY(-3px); 
    background: #fff; 
    box-shadow: 0 8px 20px rgba(0,0,0,0.08); 
    border-color: var(--azul); 
}
.eco-icon { 
    color: var(--azul); /* Azul Marca */
    width: 45px; height: 45px; margin-bottom: 15px; 
    background: #eef3f9; 
    border-radius: 50%; padding: 10px;
    display: flex; align-items: center; justify-content: center;
}
.eco-icon svg { width: 24px; height: 24px; fill: currentColor; }
.eco-card h4 { color: var(--azul); margin: 0 0 8px; font-size: 1.1rem; font-weight: 800; }
.eco-card p { color: var(--gris); font-size: 0.9rem; margin: 0; line-height: 1.5; }
@media (max-width: 768px) { .eco-grid { grid-template-columns: 1fr; } }


/* --- ESTILOS COMPARTIDOS (Home Capacitaciones) --- */
.courses-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-bottom: 60px; }
.course-card { background: #fff; border: 1px solid var(--borde); border-radius: 14px; padding: 28px; transition: all 0.3s ease; box-shadow: 0 4px 10px rgba(0,0,0,0.03); display: flex; flex-direction: column; position: relative; overflow: hidden; }
.course-card:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.08); border-color: #d0d7e0; }
.icon-box { width: 48px; height: 48px; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; background: #f0f4f8; border-radius: 10px; color: var(--azul); }
.icon-box svg { width: 24px; height: 24px; fill: currentColor; }
.course-card h3 { margin: 0 0 12px; color: var(--azul); font-size: 1.3rem; font-weight: 800; }
.course-card p { color: var(--gris); font-size: 0.95rem; line-height: 1.6; margin-bottom: 25px; flex-grow: 1; }
.btn-course { text-decoration: none; border: 1px solid var(--borde); color: var(--azul); padding: 12px; border-radius: 8px; text-align: center; font-weight: 700; font-size: 0.9rem; transition: all 0.2s; background: #fbfdff; }
.btn-course:hover { border-color: var(--azul); background: #fff; color: var(--azul); }
.btn-course.disabled { background: #f3f4f6; color: #9aa4b2; border-color: transparent; pointer-events: none; }
.tag-soon { display: inline-block; background: #eef3f9; color: #6e7b8d; font-size: 0.7rem; padding: 4px 10px; border-radius: 20px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid #e5e7eb; position: absolute; top: 28px; right: 28px; }
.featured-card { background: #fff; border: 1px solid var(--borde); border-radius: 16px; overflow: hidden; margin-bottom: 60px; box-shadow: 0 8px 25px rgba(0,0,0,0.06); display: grid; grid-template-columns: 1.2fr 1fr; }
.feat-content { padding: 40px; display: flex; flex-direction: column; justify-content: center; }
.feat-links { background: #f8fbff; padding: 40px; border-left: 1px solid var(--borde); display: flex; flex-direction: column; gap: 12px; justify-content: center; }
.mod-link { display: flex; align-items: center; justify-content: space-between; background: #fff; border: 1px solid var(--borde); padding: 14px 18px; border-radius: 10px; text-decoration: none; color: var(--azul); font-weight: 700; transition: all 0.2s ease; }
.mod-link:hover { transform: translateX(5px); border-color: var(--azul); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.mod-arrow { color: var(--coral); font-weight: 900; }
@media (max-width: 860px) { .featured-card { grid-template-columns: 1fr; } .feat-links { border-left: none; border-top: 1px solid var(--borde); } }
.res-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px; }
.res-card { background: #fff; padding: 20px; border-radius: 12px; border: 1px solid var(--borde); text-decoration: none; color: var(--azul); display: flex; align-items: center; gap: 15px; transition: all 0.2s; }
.res-card:hover { border-color: var(--coral); transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.05); }
.res-icon { background: #fff5f5; color: var(--coral); width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
.res-icon svg { width: 20px; height: 20px; fill: currentColor; }
.res-text h4 { margin: 0 0 2px; font-size: 1.05rem; font-weight: 700; }
.res-text span { font-size: 0.85rem; color: var(--gris); }
.sec-title { font-size: 1.8rem; color: var(--azul); margin: 0 0 25px; font-weight: 800; border-left: 5px solid var(--coral); padding-left: 15px; line-height: 1; }

/* ==========================================================================
   4. ESTILOS DE HERRAMIENTAS ESPECÍFICAS (NO TOCAR)
   ========================================================================== */
#faja-local-tool{ --azul:#18354a; --coral:#f04e4e; --gris:#6e7b8d; --borde:#e5e7eb; font-family:inherit; }
#faja-local-tool .wrap{ background:#fff; border:1px solid var(--borde); border-radius:16px; padding:20px; box-shadow:0 10px 24px rgba(0,0,0,.06) }
#faja-local-tool h2{ margin:0 0 6px; color:var(--azul); font-size:1.6rem; line-height:1.15 }
#faja-local-tool .sub{ margin:0 0 14px; color:var(--gris) }
#faja-local-tool .actions{ display:flex; gap:10px; flex-wrap:wrap; margin:6px 0 10px }
#faja-local-tool .btn{ display:inline-block; text-decoration:none; border-radius:10px; padding:10px 14px; font-weight:800; letter-spacing:.2px; border:1px solid var(--borde); background:#eef3f9; color:var(--azul); transition:filter .15s ease, transform .05s ease }
#faja-local-tool .btn:hover{ filter:brightness(.98) }
#faja-local-tool .btn:active{ transform:translateY(1px) }
#faja-local-tool .btn.primary{ background:var(--coral); color:#fff; border-color:transparent; box-shadow:0 10px 22px rgba(240,78,78,.25) }
#faja-local-tool .manual{ display:flex; gap:8px; align-items:center; flex-wrap:wrap }
#faja-local-tool .small{ font-size:.85rem; color:var(--gris) }
#faja-local-tool input[type="number"]{ width:100%; max-width:220px; padding:10px; border:1px solid var(--borde); border-radius:10px; background:#fff; outline:none }
#faja-local-tool input[type="number"]:focus, #faja-local-tool .btn:focus{ outline:2px solid #d8e8f7; outline-offset:2px }
#faja-local-tool .grid{ display:grid; gap:14px; grid-template-columns:1fr 1fr }
@media (max-width:860px){ #faja-local-tool .grid{ grid-template-columns:1fr } }
#faja-local-tool .card{ background:#fbfdff; border:1px solid var(--borde); border-radius:12px; padding:14px }
#faja-local-tool .out{ font-weight:700; color:#1f2f44 }
#faja-local-tool .hint{ color:var(--gris); font-size:.92rem }
#faja-local-tool .error{ color:#b71c1c; font-weight:700; margin-top:6px }
@media (max-width:520px){ #faja-local-tool .actions .btn{ width:100%; text-align:center } #faja-local-tool .manual .btn{ width:100% } #faja-local-tool input[type="number"]{ max-width:none } }

#conv-coord-tool{ --azul:#18354a; --coral:#f04e4e; --gris:#6e7b8d; --borde:#e5e7eb; font-family:inherit }
#conv-coord-tool .wrap{ background:#fff; border:1px solid var(--borde); border-radius:16px; box-shadow:0 10px 24px rgba(0,0,0,.06); padding:20px }
#conv-coord-tool h2{ margin:0 0 6px; color:var(--azul); font-size:1.6rem; line-height:1.15 }
#conv-coord-tool .sub{ margin:0 0 14px; color:var(--gris) }
#conv-coord-tool .grid{ display:grid; gap:14px; grid-template-columns:1fr 1fr }
@media (max-width:860px){ #conv-coord-tool .grid{ grid-template-columns:1fr } }
#conv-coord-tool .card{ background:#fbfdff; border:1px solid var(--borde); border-radius:12px; padding:14px }
#conv-coord-tool .card-title{ margin:0 0 10px; color:#18354a; font-size:1.1rem }
#conv-coord-tool .fields{ display:grid; gap:12px; grid-template-columns:1fr 1fr }
@media (max-width:640px){ #conv-coord-tool .fields{ grid-template-columns:1fr } }
#conv-coord-tool .field label{ display:block; font-size:.9rem; color:#4b596c; margin:0 0 4px }
#conv-coord-tool input, #conv-coord-tool select{ width:100%; padding:10px 12px; border:1px solid var(--borde)!important; border-radius:10px!important; background:#fff!important; box-shadow:none!important; color:#1f2f44; outline:none }
#conv-coord-tool select{ appearance:none; background-image: linear-gradient(45deg,transparent 50%, #8aa0b5 50%), linear-gradient(135deg,#8aa0b5 50%, transparent 50%); background-position: right 14px top 16px, right 8px top 16px; background-size:6px 6px, 6px 6px; background-repeat:no-repeat; padding-right:34px }
#conv-coord-tool .actions{ display:flex; gap:10px; flex-wrap:wrap; margin:10px 0 }
#conv-coord-tool .btn{ display:inline-block; text-decoration:none; border-radius:10px; padding:10px 14px; font-weight:800; letter-spacing:.2px; border:1px solid var(--borde)!important; background:#eef3f9!important; color:var(--azul)!important }
#conv-coord-tool .btn.primary{ background:var(--coral)!important; color:#fff!important; border-color:transparent!important; box-shadow:0 10px 22px rgba(240,78,78,.25) }
#conv-coord-tool input[type="checkbox"]{ accent-color:var(--coral) }
#conv-coord-tool .gk-options label{ display:inline-flex; align-items:center; gap:8px; background:#f6f7f9; border:1px solid var(--borde); border-radius:10px; padding:6px 10px; color:#4b596c; font-size:.9rem }
@media (max-width:640px){ #conv-coord-tool .gk-options{ gap:8px } #conv-coord-tool .gk-options label{ width:100% } }

#gk-posgar07-tool{ --azul:#18354a; --coral:#f04e4e; --gris:#6e7b8d; --borde:#e5e7eb; font-family:inherit }
#gk-posgar07-tool .wrap{ background:#fff; border:1px solid var(--borde); border-radius:16px; box-shadow:0 10px 24px rgba(0,0,0,.06); padding:20px }
#gk-posgar07-tool h2{ margin:0 0 6px; color:#18354a; font-size:1.6rem; line-height:1.15 }
#gk-posgar07-tool .sub{ margin:0 0 14px; color:#6e7b8d }
#gk-posgar07-tool .card{ background:#fbfdff; border:1px solid var(--borde); border-radius:12px; padding:14px }
#gk-posgar07-tool .row{ display:grid; gap:12px; grid-template-columns:1fr 1fr }
@media (max-width:720px){ #gk-posgar07-tool .row{ grid-template-columns:1fr } }
#gk-posgar07-tool label{ display:block; font-size:.9rem; color:#4b596c; margin-bottom:6px }
#gk-posgar07-tool input[type="number"], #gk-posgar07-tool input[type="text"], #gk-posgar07-tool select{ width:100%; padding:10px 12px; border:1px solid var(--borde); border-radius:10px; background:#fff; box-shadow:none; outline:none }
#gk-posgar07-tool .dms{ display:grid; grid-template-columns:1fr auto 1fr auto 1.4fr auto 1fr; gap:8px; align-items:center }
#gk-posgar07-tool .dms .sym{ color:#7b8a9a; min-width:10px; text-align:center }
#gk-posgar07-tool .actions{ display:flex; gap:10px; flex-wrap:wrap; margin:12px 0 }
#gk-posgar07-tool .btn{ display:inline-block; text-decoration:none; border-radius:10px; padding:10px 14px; font-weight:800; letter-spacing:.2px; border:1px solid var(--borde); background:#eef3f9; color:#18354a }
#gk-posgar07-tool .btn.primary{ background:#f04e4e; color:#fff; border-color:transparent; box-shadow:0 10px 22px rgba(240,78,78,.25) }
#gk-posgar07-tool .info{ margin-top:8px; font-weight:700; color:#1f2f44 }
#gk-posgar07-tool .hint{ color:#6e7b8d; font-size:.92rem; margin-top:8px }
#gk-posgar07-tool .result-primary{ border:1px solid #e5e7eb; background:#f8fbff; border-radius:12px; padding:12px; margin:8px 0 4px; box-shadow:0 6px 16px rgba(0,0,0,.04) }
#gk-posgar07-tool .result-primary .badge{ display:inline-block; background:linear-gradient(180deg,#1c3a50,#18354a); color:#fff; font-weight:800; font-size:.78rem; border-radius:999px; padding:4px 10px; margin-bottom:8px }
#gk-posgar07-tool .result-primary .soft{ color:#6e7b8d; font-weight:400 }
#gk-posgar07-tool input[readonly]{ background:#fffdfd }
#gk-posgar07-tool .emph-field label{ color:#18354a; font-weight:900; letter-spacing:.2px }
#gk-posgar07-tool .copy-stack{ display:flex; flex-direction:column; gap:8px; align-items:stretch }
#gk-posgar07-tool #out_y_fmt, #gk-posgar07-tool #out_x_fmt{ background:#fff7ed; border:2px solid #f04e4e; color:#1f2f44; font-weight:800; font-size:1.1rem; padding:14px 12px; border-radius:12px; box-shadow:0 0 0 3px rgba(240,78,78,.12) }
#gk-posgar07-tool #out_y_fmt:focus, #gk-posgar07-tool #out_x_fmt:focus{ outline:none; box-shadow:0 0 0 4px rgba(240,78,78,.22) }
#gk-posgar07-tool .copy-btn{ width:100%; text-align:center; border:1px solid #e5e7eb; background:#eef3f9; color:#18354a; font-weight:800; padding:12px 14px; border-radius:10px; cursor:pointer; transition:.15s ease }
#gk-posgar07-tool .copy-btn:hover{ filter:brightness(.98) }
#gk-posgar07-tool .copy-btn:active{ transform:translateY(1px) }
@media (max-width:600px){ #gk-posgar07-tool #out_y_fmt, #gk-posgar07-tool #out_x_fmt{ font-size:1.15rem; padding:16px 14px } }
@media (prefers-color-scheme:dark){ #gk-posgar07-tool #out_y_fmt, #gk-posgar07-tool #out_x_fmt{ background:#2a1f1c; border-color:#f04e4e; color:#f6f7f9 } }

#asesoria-tecnica { --azul:#18354a; --borde:#e5e7eb }
#asesoria-tecnica h2{ margin:0 0 8px; line-height:1.2 }
#asesoria-tecnica h3{ font-size:1.02rem; margin:0 0 8px }
@media (max-width:920px){ #asesoria-tecnica [style*="grid-template-columns:1fr 1fr"]{ grid-template-columns:1fr!important } }
#asesoria-tecnica ul, #asesoria-tecnica ol{ padding-left:18px; margin:0 }
#asesoria-tecnica li{ margin-bottom:6px; word-break:break-word; hyphens:auto; line-height:1.55 }
#asesoria-tecnica a[href^="#"]{ text-decoration:none }
@media (max-width:640px){ #asesoria-tecnica > div > div > a{ width:100%; text-align:center } #asesoria-tecnica #contacto a{ width:100%; text-align:center } }
#asesoria-tecnica .pill + .pill{ margin-left:8px }
#asesoria-tecnica p{ margin:0 0 10px }

#eg-csv2dxf{ --azul:#18354a; --coral:#f04e4e; --coral-100:#fff1f2; --coral-200:#ffdede; --coral-300:#ffc7c7; --panel:#111827; --bg:#0f172a; --border:#1f		
```

### script.js

```javascript

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

```

### meta.json

```json
{
  "title": "Conversor de coordenadas – Equipargeo",
  "description": null,
  "canonical": "https://equipargeo.com/conversor-de-coordenadas-lat-long-gk/",
  "og": {},
  "slug_origen": "conversor-de-coordenadas-lat-long-gk",
  "slug_destino": "posgar07",
  "section_id": "gk-posgar07-tool",
  "section_extraida": true,
  "section_size_chars": 6105,
  "style_extraido": true,
  "style_size_chars": 29333,
  "script_extraido": true,
  "script_size_chars": 7301
}
```

---

## Herramienta 3: PUNTOS-INTERMEDIOS (Generador de puntos intermedios)

### section.html

```html
<section id="herramienta-puntos" style="width:100%;max-width:1100px;margin:40px auto;padding:0 15px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;">
<!-- Card principal -->
<div class="eg-card">
<h3 class="eg-card-title">Generador de puntos intermedios</h3>
<p class="eg-muted" style="margin-top:-6px">
      Calcula puntos equidistantes entre dos coordenadas proyectadas (<strong>POSGAR07 / Gauss-Krüger</strong> u otra proyección métrica).
      Azimut reportado desde el <strong>Norte</strong> en sentido horario (0–360°).
    </p>
<!-- Formulario -->
<div class="eg-grid">
<div class="eg-fieldset">
<div class="eg-field">
<label for="e1">Este (X) P1</label>
<input id="e1" placeholder="Ej: 500000" step="any" type="number"/>
</div>
<div class="eg-field">
<label for="n1">Norte (Y) P1</label>
<input id="n1" placeholder="Ej: 6000000" step="any" type="number"/>
</div>
<div class="eg-field">
<label for="e2">Este (X) P2</label>
<input id="e2" placeholder="Ej: 500050" step="any" type="number"/>
</div>
<div class="eg-field">
<label for="n2">Norte (Y) P2</label>
<input id="n2" placeholder="Ej: 6000050" step="any" type="number"/>
</div>
</div>
<div class="eg-options">
<div class="eg-field">
<label for="intervalo">Intervalo (m)</label>
<select id="intervalo"></select>
</div>
<div class="eg-field">
<label for="intervaloManual">Valor manual (m)</label>
<input id="intervaloManual" placeholder="p.ej. 0.75" step="any" type="number"/>
</div>
<div class="eg-field">
<label for="decimales">Decimales (coords)</label>
<input id="decimales" max="4" min="0" type="number" value="3"/>
</div>
<div class="eg-field">
<label for="incluirExtremos">Incluir extremos</label>
<select id="incluirExtremos">
<option selected="" value="si">Sí (P1 y P2)</option>
<option value="no">No</option>
</select>
</div>
<div class="eg-actions">
<button class="eg-btn eg-btn-primary" id="btnGenerar">Generar puntos</button>
<button class="eg-btn" id="btnLimpiar" type="button">Limpiar</button>
</div>
</div>
</div>
<!-- Resumen -->
<div class="eg-summary" hidden="" id="panelResumen">
<div><strong>Distancia:</strong> <span id="resDist">–</span> m</div>
<div><strong>Azimut (0–360°):</strong> <span id="resAzi">–</span></div>
<div><strong>Puntos:</strong> <span id="resPts">–</span></div>
</div>
<!-- Gráfico -->
<div class="eg-plot">
<canvas height="380" id="canvasXY"></canvas>
</div>
<!-- Controles de vista -->
<div class="eg-toolbar">
<button class="eg-btn" id="btnFit">Ajustar a línea</button>
<button class="eg-btn" id="btnZoomIn">Zoom +</button>
<button class="eg-btn" id="btnZoomOut">Zoom −</button>
<button class="eg-btn" id="btnReset">Reset</button>
<span class="eg-sep"></span>
<button class="eg-btn" id="panUp">Arriba</button>
<button class="eg-btn" id="panLeft">Izquierda</button>
<button class="eg-btn" id="panRight">Derecha</button>
<button class="eg-btn" id="panDown">Abajo</button>
</div>
<!-- Acciones y tabla -->
<div class="eg-table-wrap" hidden="" id="tablaWrap">
<div class="eg-table-actions">
<button class="eg-btn" id="btnDXF">Descargar DXF (R12)</button>
<button class="eg-btn" id="btnCSV">Descargar CSV</button>
<button class="eg-btn" id="btnCopiar">Copiar tabla</button>
</div>
<div class="eg-table-scroll">
<table class="eg-table" id="tablaPuntos">
<thead>
<tr><th>#</th><th>Este (X)</th><th>Norte (Y)</th><th>Progresiva (m)</th></tr>
</thead>
<tbody></tbody>
</table>
</div>
</div>
</div>
</section>
```

### style.css

```css

/* ===== Estilos (alineados a equipargeo.com) ===== */
#herramienta-puntos .eg-card{
  background:#fff;border-radius:16px;margin-top:0;padding:18px;border:1px solid #e7edf3;
  box-shadow:0 8px 24px rgba(0,0,0,.06)
}
#herramienta-puntos .eg-card-title{ margin:0 0 8px;font-size:1.25rem }
#herramienta-puntos .eg-muted{ color:#566b7f }

#herramienta-puntos .eg-grid{ display:grid;grid-template-columns:1.15fr .85fr;gap:16px;margin-top:10px }
@media (max-width: 860px){ #herramienta-puntos .eg-grid{ grid-template-columns:1fr } }

#herramienta-puntos .eg-fieldset{ display:grid;grid-template-columns:repeat(2,1fr);gap:12px }
@media (max-width:560px){ #herramienta-puntos .eg-fieldset{ grid-template-columns:1fr } }

#herramienta-puntos .eg-field{ display:flex;flex-direction:column;gap:6px }
#herramienta-puntos label{ font-size:.9rem;color:#3a5064 }
#herramienta-puntos input,#herramienta-puntos select{
  height:40px;border:1px solid #cfd8e3;border-radius:10px;padding:0 10px;font-size:1rem;background:#f7fafc
}
#herramienta-puntos input:focus,#herramienta-puntos select:focus{
  outline:2px solid #d8e8f7;border-color:#90caf9;background:#fff
}
#herramienta-puntos .eg-actions{ display:flex;gap:8px;margin-top:4px;flex-wrap:wrap }

#herramienta-puntos .eg-btn{
  padding:10px 14px;border:1px solid #cfd8e3;background:#eef5fb;border-radius:10px;cursor:pointer;
  transition:transform .05s ease, background .15s ease; font-weight:600
}
#herramienta-puntos .eg-btn:hover{ background:#e4eef8 }
#herramienta-puntos .eg-btn:active{ transform:scale(.98) }
#herramienta-puntos .eg-btn-primary{ background:#e74a4a;border-color:#e74a4a;color:#fff }
#herramienta-puntos .eg-btn-primary:hover{ background:#d64040 }

#herramienta-puntos .eg-summary{
  margin:14px 0 6px;display:flex;gap:18px;flex-wrap:wrap;padding:10px 12px;border-radius:10px;
  background:#f4f8fb;border:1px solid #e8eef5;color:#2d3e50
}

#herramienta-puntos .eg-plot{ margin-top:8px;background:#0b2232;border-radius:14px;padding:10px;border:1px solid #0f2b3f }
#herramienta-puntos .eg-toolbar{ display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:10px }
#herramienta-puntos .eg-sep{ width:1px;height:28px;background:#d7e2ee }

#herramienta-puntos .eg-table-wrap{ margin-top:12px }
#herramienta-puntos .eg-table-actions{ display:flex;gap:8px;flex-wrap:wrap;margin-bottom:6px }
#herramienta-puntos .eg-table-scroll{ overflow:auto;border:1px solid #e7edf3;border-radius:10px }
#herramienta-puntos table.eg-table{ width:100%;border-collapse:collapse;font-size:.95rem;background:#fff }
#herramienta-puntos .eg-table thead th{
  text-align:left;background:#f2f6fa;padding:10px;border-bottom:1px solid #e7edf3;color:#2c3e50
}
#herramienta-puntos .eg-table tbody td{ padding:8px 10px;border-bottom:1px solid #eef2f7;font-family:ui-monospace, SFMono-Regular, Menlo, monospace }
#herramienta-puntos .eg-table tbody tr:hover{ background:#fafcff }

```

### script.js

```javascript

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

```

### meta.json

```json
{
  "title": "Generador de puntos intermedios – Equipargeo",
  "description": null,
  "canonical": "https://equipargeo.com/herramientas-de-topografia/",
  "og": {},
  "slug_origen": "herramientas-de-topografia",
  "slug_destino": "puntos-intermedios",
  "section_id": "herramienta-puntos",
  "section_extraida": true,
  "section_size_chars": 3426,
  "style_extraido": true,
  "style_size_chars": 2906,
  "script_extraido": true,
  "script_size_chars": 7814
}
```

---

## Herramienta 4: CONVERSOR-DXF (Conversor CSV/TXT a DXF R12)

### section.html

```html
<section aria-label="CSV/TXT a DXF" class="egc2dxf-wrap" id="eg-csv2dxf">
<div class="egc2dxf-card">
<h1 class="egc2dxf-title">CSV/TXT → DXF (R12)</h1>
<p class="egc2dxf-sub">
      Subí un archivo, vinculá columnas y exportá el DXF con capas separadas por <b>código</b>
      (Puntos, Texto nombre, Texto código).
    </p>
<div class="egc2dxf-grid">
<!-- Archivo -->
<div class="egc2dxf-col egc2dxf-col-12">
<label class="egc2dxf-label" for="egc2dxf-file">Archivo CSV/TXT</label>
<input accept=".csv,.txt" class="egc2dxf-file" id="egc2dxf-file" type="file"/>
<div class="egc2dxf-row egc2dxf-hint">
<span class="egc2dxf-pill">Delimitadores: coma, punto y coma, tab, |</span>
<span class="egc2dxf-pill" id="egc2dxf-infoRows"></span>
</div>
</div>
<!-- Mapeo de columnas -->
<div class="egc2dxf-col egc2dxf-col-6">
<label class="egc2dxf-label" for="egc2dxf-colName">Nombre de punto</label>
<select class="egc2dxf-input" id="egc2dxf-colName"></select>
</div>
<div class="egc2dxf-col egc2dxf-col-6">
<label class="egc2dxf-label" for="egc2dxf-colX">Coordenada X / Este</label>
<select class="egc2dxf-input" id="egc2dxf-colX"></select>
</div>
<div class="egc2dxf-col egc2dxf-col-6">
<label class="egc2dxf-label" for="egc2dxf-colY">Coordenada Y / Norte</label>
<select class="egc2dxf-input" id="egc2dxf-colY"></select>
</div>
<div class="egc2dxf-col egc2dxf-col-6">
<label class="egc2dxf-label" for="egc2dxf-colZ">Columna Z / Elevación (opcional)</label>
<select class="egc2dxf-input" id="egc2dxf-colZ"></select>
</div>
<div class="egc2dxf-col egc2dxf-col-6">
<label class="egc2dxf-label" for="egc2dxf-colCode">Columna Código (opcional)</label>
<select class="egc2dxf-input" id="egc2dxf-colCode"></select>
</div>
<!-- Opciones -->
<div class="egc2dxf-col egc2dxf-col-6">
<label class="egc2dxf-label" for="egc2dxf-decSep">Separador decimal</label>
<select class="egc2dxf-input" id="egc2dxf-decSep">
<option value="dot">Punto 12.34</option>
<option value="comma">Coma 12,34</option>
</select>
</div>
<div class="egc2dxf-col egc2dxf-col-6">
<label class="egc2dxf-check">
<input checked="" id="egc2dxf-hasHeader" type="checkbox"/>
          La primera fila es cabecera
        </label>
</div>
<!-- Textos -->
<div class="egc2dxf-col egc2dxf-col-6">
<label class="egc2dxf-check">
<input checked="" id="egc2dxf-addTextName" type="checkbox"/>
          Texto nombre de punto
        </label>
</div>
<div class="egc2dxf-col egc2dxf-col-6">
<label class="egc2dxf-check">
<input id="egc2dxf-addTextCode" type="checkbox"/>
          Texto código
        </label>
</div>
<div class="egc2dxf-col egc2dxf-col-6">
<label class="egc2dxf-label" for="egc2dxf-textH">Altura de texto</label>
<input class="egc2dxf-input" id="egc2dxf-textH" min="0" step="0.01" type="number" value="1.5"/>
</div>
<!-- Acciones -->
<div class="egc2dxf-col egc2dxf-col-12">
<div class="egc2dxf-row">
<button class="egc2dxf-btn" id="egc2dxf-previewBtn" type="button">Ver previsualización</button>
<button class="egc2dxf-btn egc2dxf-primary" id="egc2dxf-exportBtn" type="button">Descargar DXF</button>
<button class="egc2dxf-btn" id="egc2dxf-measureBtn" type="button">Medir distancia/azimut</button>
<button class="egc2dxf-btn" id="egc2dxf-resetMeasureBtn" type="button">Reset medición</button>
<button class="egc2dxf-btn" id="egc2dxf-reframeBtn" type="button">Reencuadrar</button>
<span class="egc2dxf-hint" id="egc2dxf-status"></span>
</div>
</div>
<!-- Control de filas de la tabla -->
<div class="egc2dxf-col egc2dxf-col-12">
<div class="egc2dxf-row" style="gap:8px;align-items:center;margin:8px 0">
<label class="egc2dxf-label" for="egc2dxf-rowsLimit" style="margin:0">Filas en tabla</label>
<select class="egc2dxf-input" id="egc2dxf-rowsLimit" style="max-width:140px">
<option selected="" value="300">300</option>
<option value="1000">1000</option>
<option value="5000">5000</option>
<option value="0">Todos</option>
</select>
</div>
</div>
<!-- Previsualización -->
<div class="egc2dxf-col egc2dxf-col-12 egc2dxf-preview">
<div class="egc2dxf-row" style="justify-content:space-between;align-items:center;margin-bottom:6px">
<span class="egc2dxf-hint">Previsualización 2D (zoom con rueda, pan arrastrando, doble clic reencuadra)</span>
<span class="egc2dxf-pill" id="egc2dxf-prevInfo"></span>
</div>
<div style="margin-bottom:12px;">
<canvas id="egc2dxf-plot"></canvas>
</div>
<div>
<table class="egc2dxf-table" id="egc2dxf-tblPreview">
<thead>
<tr><th>#</th><th>X</th><th>Y</th><th>Z</th><th>Nombre</th><th>Código</th></tr>
</thead>
<tbody></tbody>
</table>
</div>
</div>
</div>
</div>
</section>
```

### style.css

```css

			/* ==========================================================================
   EQUIPARGEO – CSS GLOBAL (VERSIÓN FINAL PULIDA - BRANDING CORREGIDO)
   ========================================================================== */

/* ===== 1. RESET Y ESTRUCTURA DE PÁGINAS (ID 2 y 213) ===== */
body.page-id-2 .page-title,
body.page-id-2 .entry-title,
body.page-id-2 .entry-header,
body.page-id-2 .breadcrumbs,
body.page-id-2 .breadcrumb,
body.page-id-2 .breadcrumb-trail,
body.page-id-2 #secondary,
body.page-id-2 .sidebar,
body.page-id-2 .widget-area,
body.page-id-2 #comments,
body.page-id-2 .comments-area{ display:none!important }

body.page-id-2 #primary,
body.page-id-2 .content-area,
body.page-id-2 .site-content .content-area,
body.page-id-2 .site-main,
body.page-id-2 .content{ width:100%!important; max-width:none!important; float:none!important }

body.page-id-2 .site-content,
body.page-id-2 .content-wrap,
body.page-id-2 .container,
body.page-id-2 .row{ grid-template-columns:1fr!important }

body.page-id-2 .entry-content > *:not(.alignwide):not(.alignfull){
  margin-left:auto; margin-right:auto; max-width:1100px
}

body.page-id-2 .site-content{ padding-top:0 }

/* Página ID 213 */
body.page-id-213 .top-bar,
body.page-id-213 .site-header,
body.page-id-213 header.site-header,
body.page-id-213 .page-header,
body.page-id-213 .entry-header,
body.page-id-213 .page-title,
body.page-id-213 .breadcrumbs,
body.page-id-213 nav.breadcrumb,
body.page-id-213 .td-breadcrumbs,
body.page-id-213 .hero,
body.page-id-213 .hero-header{ display:none!important }

body.page-id-213 #content,
body.page-id-213 .site-content,
body.page-id-213 .content-area,
body.page-id-213 .container,
body.page-id-213 .inner,
body.page-id-213 main{ margin-top:0!important; padding-top:0!important }

@media (max-width:782px){
  body.page-id-213 #content,
  body.page-id-213 .site-content,
  body.page-id-213 .content-area,
  body.page-id-213 main{ padding-top:0!important }
}

/* ===== 2. SECCIÓN MENÚ HERRAMIENTAS (GRID) ===== */
#herramientas .tools-grid{ grid-template-columns:repeat(2,minmax(0,1fr)) }
#herramientas .tool-title{ word-break:break-word; hyphens:auto }
#herramientas .status{ display:inline-block; margin:6px 0; }

@media (max-width:900px){
  #herramientas .tools-grid{ grid-template-columns:1fr!important }
  #herramientas .tools-chips{ justify-content:center }
  #herramientas .actions a, #herramientas .actions span{ width:100%; text-align:center }
}

/* Cards genéricas de herramientas */
.eg-tools-grid{ display:grid; gap:14px; grid-template-columns:repeat(12,1fr); margin-top:10px }
.eg-tool-card{
  grid-column:span 12; background:#fbfdff; border:1px solid #e5e7eb; border-radius:14px;
  padding:16px; box-shadow:0 10px 24px rgba(0,0,0,.06)
}
@media (min-width:900px){ .eg-tool-card{ grid-column:span 6 } }

.eg-badge{
  display:inline-block; background:#e74a4a; color:#fff; border-radius:999px; padding:4px 10px;
  font-size:.78rem; font-weight:800; letter-spacing:.2px; width:max-content
}

/* ==========================================================================
   3. ESTILOS EDUCATIVOS UNIFICADOS (GNSS + TOPOGRAFÍA + FOTOGRAMETRÍA)
   ========================================================================== */
#programa-completo, #cta-curso, #faq-curso,
#programa-topografia, #cta-topo, #faq-topo,
#programa-fotogrametria, #cta-foto, #faq-foto,
#curso-modulo-1, #curso-modulo-2, #curso-modulo-3,
#curso-topo-m1, #curso-topo-m2, #curso-topo-m3,
#curso-foto-m1, #curso-foto-m2, #curso-foto-m3,
#capacitaciones-home, #agenda-stec {
    --azul: #18354a;
    --coral: #f04e4e;
    --gris: #6e7b8d;
    --borde: #e5e7eb;
    --bg-soft: #f8fafc;
    --wsp-green: #25d366;
    /* Nuevo azul tecnológico STEC (Solo para detalles menores si hace falta) */
    --stec-blue: #0052cc; 
    font-family: inherit;
    box-sizing: border-box;
}

/* --- HERO OSCURO (Dark Header) --- */
.mod-hero, .pc-hero-dark, .cap-hero {
    background: linear-gradient(180deg, #1c3a50, #18354a);
    border-radius: 16px; padding: 45px 25px; margin-bottom: 30px;
    color: #fff; text-align: center;
    box-shadow: 0 12px 30px rgba(0,0,0,0.15);
    position: relative; overflow: hidden;
}
.mod-hero h1, .pc-hero-dark h1, .cap-hero h1 {
    color: #fff !important; margin: 0 0 15px;
    font-size: clamp(1.8rem, 5vw, 2.4rem); font-weight: 800; line-height: 1.1;
}
.mod-hero .subtitulo, .pc-hero-dark .sub, .cap-hero p {
    color: #dcebf7 !important; margin: 0 auto 25px;
    font-size: 1.1rem; max-width: 800px; line-height: 1.6;
}
.highlight-mod, .mod-label, .feat-tag {
    color: #81d4fa; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; 
    display: block; margin-bottom: 10px; font-size: 0.9rem;
}
/* Tag específico para tarjetas */
.feat-tag { background: var(--coral); color: #fff; padding: 4px 10px; border-radius: 4px; width: fit-content; color: #fff; }

/* --- INDICADORES DE PASOS (1-2-3) --- */
.mod-steps {
    display: flex; justify-content: center; align-items: center; gap: 12px; margin-bottom: 20px;
}
.step-dot {
    width: 32px; height: 32px; border-radius: 50%;
    background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.5);
    font-weight: 700; font-size: 0.85rem;
    display: flex; align-items: center; justify-content: center;
    border: 1px solid rgba(255,255,255,0.15);
}
.step-dot.active {
    background: var(--coral); color: #fff; border-color: var(--coral);
    transform: scale(1.1); box-shadow: 0 0 15px rgba(240, 78, 78, 0.4);
}
.step-line { width: 25px; height: 2px; background: rgba(255,255,255,0.15); }

/* --- BOTONES (CTA) --- */
/* Estilos base */
.mod-btn, .btn, .btn-main {
    display: inline-block; text-decoration: none; border-radius: 10px;
    padding: 12px 24px; font-weight: 800; text-align: center; transition: all .2s ease; cursor: pointer;
}

/* Nav Superior: REDONDEADO FORZADO */
.pc-nav { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-bottom: 30px; }
.pc-nav a {
    display: inline-block; text-decoration: none; 
    border-radius: 50px !important; 
    padding: 10px 24px; font-weight: 700; text-align: center; 
    transition: all .2s ease; cursor: pointer;
    background: rgba(255,255,255,0.05); color: #fff !important; 
    border: 1px solid rgba(255,255,255,0.4);
}
.pc-nav a:hover { background: #fff; color: var(--azul) !important; border-color: #fff; transform: translateY(-2px); }

/* Primario */
.mod-btn.primary, .btn.primary { 
    background: var(--coral); color: #fff !important; 
    box-shadow: 0 8px 20px rgba(240,78,78,.3); border: 2px solid var(--coral); 
}
.mod-btn.primary:hover, .btn.primary:hover { transform: translateY(-2px); box-shadow: 0 12px 25px rgba(240,78,78,.4); background: #ff5f5f; }

/* Ghost */
.mod-btn.ghost { 
    background: rgba(255,255,255,0.05); color: #fff !important; 
    border: 2px solid rgba(255,255,255,0.4);
}
.mod-btn.ghost:hover { background: #fff; color: var(--azul) !important; border-color: #fff; }

.btn.ghost-dark { background: #eef3f9; color: var(--azul); border: 1px solid var(--borde); }
.btn.ghost-dark:hover { background: #e2eaf5; }

.btn-main { background: var(--azul); color: #fff; border: 2px solid var(--azul); }
.btn-main:hover { background: #2c4a63; transform: translateY(-2px); }

.btn-wsp-green {
    display: inline-block; text-decoration: none; background: var(--wsp-green); color: #fff !important;
    font-weight: 800; padding: 12px 24px; border-radius: 999px; box-shadow: 0 6px 18px rgba(37,211,102,0.25);
    transition: all 0.2s;
}
.btn-wsp-green:hover { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(37,211,102,0.35); }

/* Botón Servicio */
.btn-service {
    background: #4f46e5; color: #fff; text-decoration: none; padding: 12px 24px; 
    border-radius: 50px; font-weight: 700; font-size: 0.95rem; transition: transform 0.2s;
    display: inline-block; box-shadow: 0 4px 10px rgba(79, 70, 229, 0.3);
}
.btn-service:hover { transform: translateY(-2px); background: #4338ca; }

/* --- GRIDS Y LAYOUT --- */
.datos-grid { display: grid; gap: 12px; grid-template-columns: repeat(4, 1fr); margin-bottom: 30px; }
.dato-card, .nota {
    background: #fff; border: 1px solid var(--borde); border-radius: 12px;
    padding: 15px; text-align: center; font-size: 0.95rem; color: #354658;
    box-shadow: 0 4px 10px rgba(0,0,0,0.03);
}
.dato-card b { display: block; color: var(--azul); font-size: 0.8rem; text-transform: uppercase; margin-bottom: 5px; opacity: 0.85; }
@media(max-width: 768px) { .datos-grid { grid-template-columns: 1fr 1fr; } }

.layout-cols, .cuerpo.grid { display: grid; gap: 30px; grid-template-columns: 1.8fr 1.2fr; }
@media(max-width: 900px) { .layout-cols, .cuerpo.grid { grid-template-columns: 1fr; } }

.card-info { background: #fff; border: 1px solid var(--borde); border-radius: 14px; padding: 25px; }
.card-info h3, .cuerpo h3 { color: var(--azul); margin: 0 0 15px; font-size: 1.25rem; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; }

.syllabus-list { padding-left: 0; list-style: none; margin: 0 0 25px; }
.syllabus-list li { margin-bottom: 12px; color: #354658; line-height: 1.5; padding-left: 10px; border-left: 3px solid #eef3f9; }
.syllabus-list b { color: var(--coral); font-weight: 800; margin-right: 5px; }
.std-list, .cuerpo ul { padding-left: 20px; margin: 0 0 25px; color: #354658; line-height: 1.5; }
.std-list li, .cuerpo li { margin-bottom: 8px; }

/* --- TARJETAS DE PRECIOS --- */
.pricing-stack, .info { display: flex; flex-direction: column; gap: 15px; }
.price-panel, .info {
    background: #fff; border: 1px solid var(--borde); border-radius: 14px; padding: 22px;
    position: relative; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.03);
}
.price-panel.destacado { border: 2px solid var(--azul); background: #fbfdff; box-shadow: 0 8px 25px rgba(24, 53, 74, 0.08); }

.price-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px dashed var(--borde); padding-bottom: 10px; }
.price-header h4 { margin: 0; color: var(--azul); font-size: 1.1rem; font-weight: 800; }
.badge-curr { background: #eef3f9; color: var(--azul); font-weight: 700; font-size: 0.75rem; padding: 4px 10px; border-radius: 6px; }

.price-row, .fila { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; font-size: 0.95rem; }
.price-row .label, .fila b { color: #556274; font-weight: 500; }
.price-row .value-old { color: #9aa4b2; text-decoration: line-through; font-size: 0.9rem; }
.final-price { display: block; font-weight: 800; color: var(--azul); font-size: 1.35rem; line-height: 1; }
.off-tag { background: #ffebee; color: #d32f2f; font-size: 0.7rem; padding: 2px 8px; border-radius: 4px; font-weight: 800; display: inline-block; margin-bottom: 3px; }

/* --- ACORDEONES --- */
details { border: 1px solid var(--borde); border-radius: 12px; margin-bottom: 12px; overflow: hidden; background: #fff; }
summary { padding: 16px 20px; font-weight: 800; color: var(--azul); cursor: pointer; list-style: none; position: relative; padding-right: 50px; }
summary::-webkit-details-marker { display: none; }
summary::after { content: '+'; position: absolute; right: 20px; top: 50%; transform: translateY(-50%); font-size: 1.4rem; color: var(--coral); }
details[open] summary::after { content: '-'; color: var(--azul); }
details[open] summary { background: #fbfdff; border-bottom: 1px dashed var(--borde); color: var(--coral); }
.cuerpo { padding: 20px; color: #354658; }

.nota-final, .advisory { font-size: 0.85rem; color: #6e7b8d; background: #f8fafc; padding: 10px; border-radius: 8px; text-align: center; margin-top: 10px; }
.pc-top { display: block; margin: 20px 0 0; text-align: right; }
.pc-top a { text-decoration: none; color: var(--azul); font-weight: 700; font-size: 0.9rem; }
.faq-footer { margin-top: 30px; padding: 25px; background: #f8fbff; border: 1px solid #e5e7eb; border-radius: 16px; text-align: center; }

/* --- BANNER SERVICIO (FOTOGRAMETRÍA) --- */
.service-banner {
    background: #eef2ff; border: 1px solid #c7d2fe; border-radius: 16px;
    padding: 25px 30px; margin-bottom: 40px; display: flex; flex-wrap: wrap; 
    align-items: center; justify-content: space-between; gap: 20px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.04);
}
.sb-content { display: flex; align-items: center; gap: 15px; }
.sb-text h3 { margin: 0 0 5px; color: #3730a3; font-size: 1.15rem; font-weight: 800; }
.sb-text p { margin: 0; color: #4338ca; font-size: 0.95rem; }
@media(max-width: 700px) { .service-banner { flex-direction: column; text-align: center; } .sb-content { flex-direction: column; } .btn-service { width:100%; text-align:center; } }

/* --- BANNER LEAD MAGNET --- */
.free-banner {
    background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px;
    padding: 15px 20px; margin-bottom: 50px; display: flex; flex-wrap: wrap; 
    align-items: center; justify-content: space-between; gap: 15px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.04);
}
.fb-content { display: flex; align-items: center; gap: 12px; }
.fb-icon { font-size: 1.5rem; }
.fb-text h3 { margin: 0; color: #166534; font-size: 1rem; font-weight: 800; }
.fb-text p { margin: 0; color: #15803d; font-size: 0.9rem; }
.btn-free {
    background: #22c55e; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 99px; 
    font-weight: 700; font-size: 0.9rem; transition: transform 0.2s; white-space: nowrap; 
    box-shadow: 0 4px 10px rgba(34, 197, 94, 0.3); display: inline-block;
}
.btn-free:hover { transform: translateY(-2px); background: #16a34a; }
@media(max-width: 700px) { .free-banner { flex-direction: column; text-align: center; } .fb-content { flex-direction: column; } }

/* --- ECOSISTEMA Y AGENDA STEC (ACTUALIZADO - BRANDED CORAL) --- */
#agenda-stec .stec-badge {
    /* CORAL DE MARCA */
    background: linear-gradient(90deg, #f04e4e, #ff6b6b); 
    color: #fff; padding: 5px 12px; border-radius: 4px; 
    font-weight: 800; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px;
    display: inline-block; margin-bottom: 10px;
    box-shadow: 0 4px 12px rgba(240, 78, 78, 0.3);
}
/* Calendario */
.calendar-wrapper {
    background: #fff; border: 1px solid var(--borde); border-radius: 16px;
    overflow: hidden; margin: 30px 0;
    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}
/* Mini Sidebar Cards (Promo Lateral) */
.side-promo { margin-top: 25px; padding-top: 20px; border-top: 1px dashed #cbd5e1; }
.side-title { font-size: 0.85rem; font-weight: 800; text-transform: uppercase; color: #64748b; margin-bottom: 15px; display: block; letter-spacing: 0.5px; }
.mini-card { display: flex; align-items: center; gap: 12px; background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; margin-bottom: 10px; text-decoration: none; transition: all 0.2s ease; }
.mini-card:hover { transform: translateX(5px); border-color: var(--azul); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.mc-icon { width: 36px; height: 36px; background: #f1f5f9; color: var(--azul); border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.mc-icon svg { width: 18px; height: 18px; fill: currentColor; }
.mc-text b { display: block; font-size: 0.9rem; color: var(--azul); line-height: 1.2; }
.mc-text span { font-size: 0.75rem; color: #64748b; }

/* Grid Ecosistema (Fondo) */
.eco-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 20px; }
.eco-card {
    background: #f8fafc; border: 1px solid var(--borde); border-radius: 12px; padding: 25px;
    text-decoration: none; transition: all 0.2s ease; text-align: center;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.eco-card:hover { 
    transform: translateY(-3px); 
    background: #fff; 
    box-shadow: 0 8px 20px rgba(0,0,0,0.08); 
    border-color: var(--azul); 
}
.eco-icon { 
    color: var(--azul); /* Azul Marca */
    width: 45px; height: 45px; margin-bottom: 15px; 
    background: #eef3f9; 
    border-radius: 50%; padding: 10px;
    display: flex; align-items: center; justify-content: center;
}
.eco-icon svg { width: 24px; height: 24px; fill: currentColor; }
.eco-card h4 { color: var(--azul); margin: 0 0 8px; font-size: 1.1rem; font-weight: 800; }
.eco-card p { color: var(--gris); font-size: 0.9rem; margin: 0; line-height: 1.5; }
@media (max-width: 768px) { .eco-grid { grid-template-columns: 1fr; } }


/* --- ESTILOS COMPARTIDOS (Home Capacitaciones) --- */
.courses-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-bottom: 60px; }
.course-card { background: #fff; border: 1px solid var(--borde); border-radius: 14px; padding: 28px; transition: all 0.3s ease; box-shadow: 0 4px 10px rgba(0,0,0,0.03); display: flex; flex-direction: column; position: relative; overflow: hidden; }
.course-card:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.08); border-color: #d0d7e0; }
.icon-box { width: 48px; height: 48px; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; background: #f0f4f8; border-radius: 10px; color: var(--azul); }
.icon-box svg { width: 24px; height: 24px; fill: currentColor; }
.course-card h3 { margin: 0 0 12px; color: var(--azul); font-size: 1.3rem; font-weight: 800; }
.course-card p { color: var(--gris); font-size: 0.95rem; line-height: 1.6; margin-bottom: 25px; flex-grow: 1; }
.btn-course { text-decoration: none; border: 1px solid var(--borde); color: var(--azul); padding: 12px; border-radius: 8px; text-align: center; font-weight: 700; font-size: 0.9rem; transition: all 0.2s; background: #fbfdff; }
.btn-course:hover { border-color: var(--azul); background: #fff; color: var(--azul); }
.btn-course.disabled { background: #f3f4f6; color: #9aa4b2; border-color: transparent; pointer-events: none; }
.tag-soon { display: inline-block; background: #eef3f9; color: #6e7b8d; font-size: 0.7rem; padding: 4px 10px; border-radius: 20px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid #e5e7eb; position: absolute; top: 28px; right: 28px; }
.featured-card { background: #fff; border: 1px solid var(--borde); border-radius: 16px; overflow: hidden; margin-bottom: 60px; box-shadow: 0 8px 25px rgba(0,0,0,0.06); display: grid; grid-template-columns: 1.2fr 1fr; }
.feat-content { padding: 40px; display: flex; flex-direction: column; justify-content: center; }
.feat-links { background: #f8fbff; padding: 40px; border-left: 1px solid var(--borde); display: flex; flex-direction: column; gap: 12px; justify-content: center; }
.mod-link { display: flex; align-items: center; justify-content: space-between; background: #fff; border: 1px solid var(--borde); padding: 14px 18px; border-radius: 10px; text-decoration: none; color: var(--azul); font-weight: 700; transition: all 0.2s ease; }
.mod-link:hover { transform: translateX(5px); border-color: var(--azul); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.mod-arrow { color: var(--coral); font-weight: 900; }
@media (max-width: 860px) { .featured-card { grid-template-columns: 1fr; } .feat-links { border-left: none; border-top: 1px solid var(--borde); } }
.res-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px; }
.res-card { background: #fff; padding: 20px; border-radius: 12px; border: 1px solid var(--borde); text-decoration: none; color: var(--azul); display: flex; align-items: center; gap: 15px; transition: all 0.2s; }
.res-card:hover { border-color: var(--coral); transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.05); }
.res-icon { background: #fff5f5; color: var(--coral); width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
.res-icon svg { width: 20px; height: 20px; fill: currentColor; }
.res-text h4 { margin: 0 0 2px; font-size: 1.05rem; font-weight: 700; }
.res-text span { font-size: 0.85rem; color: var(--gris); }
.sec-title { font-size: 1.8rem; color: var(--azul); margin: 0 0 25px; font-weight: 800; border-left: 5px solid var(--coral); padding-left: 15px; line-height: 1; }

/* ==========================================================================
   4. ESTILOS DE HERRAMIENTAS ESPECÍFICAS (NO TOCAR)
   ========================================================================== */
#faja-local-tool{ --azul:#18354a; --coral:#f04e4e; --gris:#6e7b8d; --borde:#e5e7eb; font-family:inherit; }
#faja-local-tool .wrap{ background:#fff; border:1px solid var(--borde); border-radius:16px; padding:20px; box-shadow:0 10px 24px rgba(0,0,0,.06) }
#faja-local-tool h2{ margin:0 0 6px; color:var(--azul); font-size:1.6rem; line-height:1.15 }
#faja-local-tool .sub{ margin:0 0 14px; color:var(--gris) }
#faja-local-tool .actions{ display:flex; gap:10px; flex-wrap:wrap; margin:6px 0 10px }
#faja-local-tool .btn{ display:inline-block; text-decoration:none; border-radius:10px; padding:10px 14px; font-weight:800; letter-spacing:.2px; border:1px solid var(--borde); background:#eef3f9; color:var(--azul); transition:filter .15s ease, transform .05s ease }
#faja-local-tool .btn:hover{ filter:brightness(.98) }
#faja-local-tool .btn:active{ transform:translateY(1px) }
#faja-local-tool .btn.primary{ background:var(--coral); color:#fff; border-color:transparent; box-shadow:0 10px 22px rgba(240,78,78,.25) }
#faja-local-tool .manual{ display:flex; gap:8px; align-items:center; flex-wrap:wrap }
#faja-local-tool .small{ font-size:.85rem; color:var(--gris) }
#faja-local-tool input[type="number"]{ width:100%; max-width:220px; padding:10px; border:1px solid var(--borde); border-radius:10px; background:#fff; outline:none }
#faja-local-tool input[type="number"]:focus, #faja-local-tool .btn:focus{ outline:2px solid #d8e8f7; outline-offset:2px }
#faja-local-tool .grid{ display:grid; gap:14px; grid-template-columns:1fr 1fr }
@media (max-width:860px){ #faja-local-tool .grid{ grid-template-columns:1fr } }
#faja-local-tool .card{ background:#fbfdff; border:1px solid var(--borde); border-radius:12px; padding:14px }
#faja-local-tool .out{ font-weight:700; color:#1f2f44 }
#faja-local-tool .hint{ color:var(--gris); font-size:.92rem }
#faja-local-tool .error{ color:#b71c1c; font-weight:700; margin-top:6px }
@media (max-width:520px){ #faja-local-tool .actions .btn{ width:100%; text-align:center } #faja-local-tool .manual .btn{ width:100% } #faja-local-tool input[type="number"]{ max-width:none } }

#conv-coord-tool{ --azul:#18354a; --coral:#f04e4e; --gris:#6e7b8d; --borde:#e5e7eb; font-family:inherit }
#conv-coord-tool .wrap{ background:#fff; border:1px solid var(--borde); border-radius:16px; box-shadow:0 10px 24px rgba(0,0,0,.06); padding:20px }
#conv-coord-tool h2{ margin:0 0 6px; color:var(--azul); font-size:1.6rem; line-height:1.15 }
#conv-coord-tool .sub{ margin:0 0 14px; color:var(--gris) }
#conv-coord-tool .grid{ display:grid; gap:14px; grid-template-columns:1fr 1fr }
@media (max-width:860px){ #conv-coord-tool .grid{ grid-template-columns:1fr } }
#conv-coord-tool .card{ background:#fbfdff; border:1px solid var(--borde); border-radius:12px; padding:14px }
#conv-coord-tool .card-title{ margin:0 0 10px; color:#18354a; font-size:1.1rem }
#conv-coord-tool .fields{ display:grid; gap:12px; grid-template-columns:1fr 1fr }
@media (max-width:640px){ #conv-coord-tool .fields{ grid-template-columns:1fr } }
#conv-coord-tool .field label{ display:block; font-size:.9rem; color:#4b596c; margin:0 0 4px }
#conv-coord-tool input, #conv-coord-tool select{ width:100%; padding:10px 12px; border:1px solid var(--borde)!important; border-radius:10px!important; background:#fff!important; box-shadow:none!important; color:#1f2f44; outline:none }
#conv-coord-tool select{ appearance:none; background-image: linear-gradient(45deg,transparent 50%, #8aa0b5 50%), linear-gradient(135deg,#8aa0b5 50%, transparent 50%); background-position: right 14px top 16px, right 8px top 16px; background-size:6px 6px, 6px 6px; background-repeat:no-repeat; padding-right:34px }
#conv-coord-tool .actions{ display:flex; gap:10px; flex-wrap:wrap; margin:10px 0 }
#conv-coord-tool .btn{ display:inline-block; text-decoration:none; border-radius:10px; padding:10px 14px; font-weight:800; letter-spacing:.2px; border:1px solid var(--borde)!important; background:#eef3f9!important; color:var(--azul)!important }
#conv-coord-tool .btn.primary{ background:var(--coral)!important; color:#fff!important; border-color:transparent!important; box-shadow:0 10px 22px rgba(240,78,78,.25) }
#conv-coord-tool input[type="checkbox"]{ accent-color:var(--coral) }
#conv-coord-tool .gk-options label{ display:inline-flex; align-items:center; gap:8px; background:#f6f7f9; border:1px solid var(--borde); border-radius:10px; padding:6px 10px; color:#4b596c; font-size:.9rem }
@media (max-width:640px){ #conv-coord-tool .gk-options{ gap:8px } #conv-coord-tool .gk-options label{ width:100% } }

#gk-posgar07-tool{ --azul:#18354a; --coral:#f04e4e; --gris:#6e7b8d; --borde:#e5e7eb; font-family:inherit }
#gk-posgar07-tool .wrap{ background:#fff; border:1px solid var(--borde); border-radius:16px; box-shadow:0 10px 24px rgba(0,0,0,.06); padding:20px }
#gk-posgar07-tool h2{ margin:0 0 6px; color:#18354a; font-size:1.6rem; line-height:1.15 }
#gk-posgar07-tool .sub{ margin:0 0 14px; color:#6e7b8d }
#gk-posgar07-tool .card{ background:#fbfdff; border:1px solid var(--borde); border-radius:12px; padding:14px }
#gk-posgar07-tool .row{ display:grid; gap:12px; grid-template-columns:1fr 1fr }
@media (max-width:720px){ #gk-posgar07-tool .row{ grid-template-columns:1fr } }
#gk-posgar07-tool label{ display:block; font-size:.9rem; color:#4b596c; margin-bottom:6px }
#gk-posgar07-tool input[type="number"], #gk-posgar07-tool input[type="text"], #gk-posgar07-tool select{ width:100%; padding:10px 12px; border:1px solid var(--borde); border-radius:10px; background:#fff; box-shadow:none; outline:none }
#gk-posgar07-tool .dms{ display:grid; grid-template-columns:1fr auto 1fr auto 1.4fr auto 1fr; gap:8px; align-items:center }
#gk-posgar07-tool .dms .sym{ color:#7b8a9a; min-width:10px; text-align:center }
#gk-posgar07-tool .actions{ display:flex; gap:10px; flex-wrap:wrap; margin:12px 0 }
#gk-posgar07-tool .btn{ display:inline-block; text-decoration:none; border-radius:10px; padding:10px 14px; font-weight:800; letter-spacing:.2px; border:1px solid var(--borde); background:#eef3f9; color:#18354a }
#gk-posgar07-tool .btn.primary{ background:#f04e4e; color:#fff; border-color:transparent; box-shadow:0 10px 22px rgba(240,78,78,.25) }
#gk-posgar07-tool .info{ margin-top:8px; font-weight:700; color:#1f2f44 }
#gk-posgar07-tool .hint{ color:#6e7b8d; font-size:.92rem; margin-top:8px }
#gk-posgar07-tool .result-primary{ border:1px solid #e5e7eb; background:#f8fbff; border-radius:12px; padding:12px; margin:8px 0 4px; box-shadow:0 6px 16px rgba(0,0,0,.04) }
#gk-posgar07-tool .result-primary .badge{ display:inline-block; background:linear-gradient(180deg,#1c3a50,#18354a); color:#fff; font-weight:800; font-size:.78rem; border-radius:999px; padding:4px 10px; margin-bottom:8px }
#gk-posgar07-tool .result-primary .soft{ color:#6e7b8d; font-weight:400 }
#gk-posgar07-tool input[readonly]{ background:#fffdfd }
#gk-posgar07-tool .emph-field label{ color:#18354a; font-weight:900; letter-spacing:.2px }
#gk-posgar07-tool .copy-stack{ display:flex; flex-direction:column; gap:8px; align-items:stretch }
#gk-posgar07-tool #out_y_fmt, #gk-posgar07-tool #out_x_fmt{ background:#fff7ed; border:2px solid #f04e4e; color:#1f2f44; font-weight:800; font-size:1.1rem; padding:14px 12px; border-radius:12px; box-shadow:0 0 0 3px rgba(240,78,78,.12) }
#gk-posgar07-tool #out_y_fmt:focus, #gk-posgar07-tool #out_x_fmt:focus{ outline:none; box-shadow:0 0 0 4px rgba(240,78,78,.22) }
#gk-posgar07-tool .copy-btn{ width:100%; text-align:center; border:1px solid #e5e7eb; background:#eef3f9; color:#18354a; font-weight:800; padding:12px 14px; border-radius:10px; cursor:pointer; transition:.15s ease }
#gk-posgar07-tool .copy-btn:hover{ filter:brightness(.98) }
#gk-posgar07-tool .copy-btn:active{ transform:translateY(1px) }
@media (max-width:600px){ #gk-posgar07-tool #out_y_fmt, #gk-posgar07-tool #out_x_fmt{ font-size:1.15rem; padding:16px 14px } }
@media (prefers-color-scheme:dark){ #gk-posgar07-tool #out_y_fmt, #gk-posgar07-tool #out_x_fmt{ background:#2a1f1c; border-color:#f04e4e; color:#f6f7f9 } }

#asesoria-tecnica { --azul:#18354a; --borde:#e5e7eb }
#asesoria-tecnica h2{ margin:0 0 8px; line-height:1.2 }
#asesoria-tecnica h3{ font-size:1.02rem; margin:0 0 8px }
@media (max-width:920px){ #asesoria-tecnica [style*="grid-template-columns:1fr 1fr"]{ grid-template-columns:1fr!important } }
#asesoria-tecnica ul, #asesoria-tecnica ol{ padding-left:18px; margin:0 }
#asesoria-tecnica li{ margin-bottom:6px; word-break:break-word; hyphens:auto; line-height:1.55 }
#asesoria-tecnica a[href^="#"]{ text-decoration:none }
@media (max-width:640px){ #asesoria-tecnica > div > div > a{ width:100%; text-align:center } #asesoria-tecnica #contacto a{ width:100%; text-align:center } }
#asesoria-tecnica .pill + .pill{ margin-left:8px }
#asesoria-tecnica p{ margin:0 0 10px }

#eg-csv2dxf{ --azul:#18354a; --coral:#f04e4e; --coral-100:#fff1f2; --coral-200:#ffdede; --coral-300:#ffc7c7; --panel:#111827; --bg:#0f172a; --border:#1f		
```

### script.js

```javascript
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

```

### meta.json

```json
{
  "title": "Conversor a DXF – Equipargeo",
  "description": null,
  "canonical": "https://equipargeo.com/conversor-a-dxf/",
  "og": {},
  "slug_origen": "conversor-a-dxf",
  "slug_destino": "conversor-dxf",
  "section_id": "eg-csv2dxf",
  "section_extraida": true,
  "section_size_chars": 4554,
  "style_extraido": true,
  "style_size_chars": 29333,
  "script_extraido": true,
  "script_size_chars": 18403
}
```

---

# PARTE 2 — CURSOS

## Curso 01: programa-completo-curso-gnss

### meta.json

```json
{
  "title": "Programa completo – Curso GNSS – Equipargeo",
  "description": null,
  "canonical": "https://equipargeo.com/programa-completo-curso-gnss/",
  "og": {},
  "slug": "programa-completo-curso-gnss",
  "h1": "Programa completo",
  "content_size_chars": 3162,
  "ctas_count": 11,
  "imagenes_count": 0
}
```

### content.md

```markdown
# Programa completo

Itinerario de formación GNSS en 3 módulos: fundamentos, RTK en campo y post-proceso profesional.

### Objetivo

Comprender constelaciones, marcos y observables; planificar y controlar la calidad de mediciones GNSS.

### Unidades

- **U1 · Sistemas y marcos:**GPS/GLONASS/Galileo/BeiDou, señales; POSGAR 2007, ITRF; proyecciones (Gauss-Krüger / UTM).
- **U2 · Observables y errores:**código y fase, DOP; ionosfera/troposfera, multicamino, relojes; precisiones esperables.
- **U3 · Planificación:**ventanas satelitales, PDOP/HDOP, máscara de elevación, KP y condiciones de campo.
- **U4 · QA/QC básico:**bitácora, chequeos redundantes, control en recepción y validaciones rápidas.

- **U1 · Sistemas y marcos:**GPS/GLONASS/Galileo/BeiDou, señales; POSGAR 2007, ITRF; proyecciones (Gauss-Krüger / UTM).
- **U2 · Observables y errores:**código y fase, DOP; ionosfera/troposfera, multicamino, relojes; precisiones esperables.
- **U3 · Planificación:**ventanas satelitales, PDOP/HDOP, máscara de elevación, KP y condiciones de campo.
- **U4 · QA/QC básico:**bitácora, chequeos redundantes, control en recepción y validaciones rápidas.

### Objetivo

Configurar bases y rovers, operar con NTRIP y validar resultados RTK con tolerancias profesionales.

### Unidades

- **U1 · Configuración:**base/rover, mensajes RTCM, NTRIP; sistemas locales y parámetros del proyecto.
- **U2 · Flujo en obra:**levantamiento y replanteo, control en tiempo real, gestión de códigos y metadatos.
- **U3 · QA/QC en RTK:**chequeos redundantes, control de tolerancias, cierre y entrega.
- **U4 · Troubleshooting:**pérdida de fix, interferencias, soluciones prácticas en campo.

- **U1 · Configuración:**base/rover, mensajes RTCM, NTRIP; sistemas locales y parámetros del proyecto.
- **U2 · Flujo en obra:**levantamiento y replanteo, control en tiempo real, gestión de códigos y metadatos.
- **U3 · QA/QC en RTK:**chequeos redundantes, control de tolerancias, cierre y entrega.
- **U4 · Troubleshooting:**pérdida de fix, interferencias, soluciones prácticas en campo.

### Objetivo

Procesar estático/cinemático con QA/QC, comparar soluciones y entregar reportes técnicos para organismos.

### Unidades

- **U1 · Preparación de datos:**descarga RINEX, efemérides, metadatos; depuración y estructura del proyecto.
- **U2 · Procesamiento:**parámetros, fijado de ambigüedades, análisis de residuos, validaciones.
- **U3 · Comparación de soluciones:**estático vs cinemático, ajustes, control de consistencia.
- **U4 · Reporte final:**QA/QC, anexos y presentación para ARBA/IGN/organismos.

- **U1 · Preparación de datos:**descarga RINEX, efemérides, metadatos; depuración y estructura del proyecto.
- **U2 · Procesamiento:**parámetros, fijado de ambigüedades, análisis de residuos, validaciones.
- **U3 · Comparación de soluciones:**estático vs cinemático, ajustes, control de consistencia.
- **U4 · Reporte final:**QA/QC, anexos y presentación para ARBA/IGN/organismos.

## ¿Listo para sumarte?

Inscribite al módulo que te corresponda o escribinos para despejar dudas rápidas.

## Preguntas frecuentes

Lo más consultado antes de inscribirse.

¿Tu duda no está en la lista?
```

### ctas.json

```json
[
  {
    "text": "Ver módulo 1",
    "href": "/curso-gnss-modulo-1"
  },
  {
    "text": "Inscribirme",
    "href": "#cta-curso"
  },
  {
    "text": "Ver módulo 2",
    "href": "/curso-gnss-modulo-2"
  },
  {
    "text": "Inscribirme",
    "href": "#cta-curso"
  },
  {
    "text": "Ver módulo 3",
    "href": "/curso-gnss-modulo-3"
  },
  {
    "text": "Inscribirme",
    "href": "#cta-curso"
  },
  {
    "text": "↑ Volver al inicio",
    "href": "#programa-completo"
  },
  {
    "text": "Inscribirme ahora",
    "href": "https://forms.gle/wiRnmaW5759EuP2f6"
  },
  {
    "text": "Consultas por WhatsApp",
    "href": "https://api.whatsapp.com/send?phone=5491155722266&text=Hola%20Equipar%2C%20tengo%20consultas%20sobre%20las%20capacitaciones%20GNSS"
  },
  {
    "text": "Escribinos por WhatsApp y te respondemos rápido →",
    "href": "https://api.whatsapp.com/send?phone=5491155722266"
  },
  {
    "text": "↑ Volver arriba",
    "href": "#programa-completo"
  }
]
```

### imagenes.json

```json
[]
```

---

## Curso 02: curso-gnss-modulo-1

### meta.json

```json
{
  "title": "Módulo 1 – Curso Fundamentos y Teoría GNSS – Equipargeo",
  "description": null,
  "canonical": "https://equipargeo.com/curso-gnss-modulo-1/",
  "og": {},
  "slug": "curso-gnss-modulo-1",
  "h1": "Curso Fundamentos y Teoría GNSS",
  "content_size_chars": 1674,
  "ctas_count": 2,
  "imagenes_count": 0
}
```

### content.md

```markdown
# Curso Fundamentos y Teoría GNSS

La base obligatoria. Comprendé constelaciones, marcos de referencia, coordenadas y planificación para realizar mediciones de calidad.

### Objetivos

- Entender cómo funciona realmente el posicionamiento satelital.
- Dominar los marcos de referencia (POSGAR 07, ITRF, WGS84).
- Aprender a planificar campañas y evitar errores comunes en campo.

- Entender cómo funciona realmente el posicionamiento satelital.
- Dominar los marcos de referencia (POSGAR 07, ITRF, WGS84).
- Aprender a planificar campañas y evitar errores comunes en campo.

### Temario resumido

- **Unidad 1 · Sistemas y Marcos:**GPS, GLONASS, Galileo, BeiDou. Señales, POSGAR 2007 y Proyecciones.
- **Unidad 2 · Observables:**Diferencia entre Código y Fase. Dilución de precisión (DOP).
- **Unidad 3 · Errores:**Ionosfera, troposfera, multicamino y relojes. Precisiones esperables.
- **Unidad 4 · Planificación:**Ventanas satelitales, máscaras de elevación y validaciones rápidas.

- **Unidad 1 · Sistemas y Marcos:**GPS, GLONASS, Galileo, BeiDou. Señales, POSGAR 2007 y Proyecciones.
- **Unidad 2 · Observables:**Diferencia entre Código y Fase. Dilución de precisión (DOP).
- **Unidad 3 · Errores:**Ionosfera, troposfera, multicamino y relojes. Precisiones esperables.
- **Unidad 4 · Planificación:**Ventanas satelitales, máscaras de elevación y validaciones rápidas.

### Incluye

- Material didáctico (Slides).
- Checklist de planificación de campaña.
- Certificado de participación oficial de Equipargeo.

- Material didáctico (Slides).
- Checklist de planificación de campaña.
- Certificado de participación oficial de Equipargeo.

#### Argentina

#### Internacional
```

### ctas.json

```json
[
  {
    "text": "Preinscribirme ahora",
    "href": "https://forms.gle/wiRnmaW5759EuP2f6"
  },
  {
    "text": "Envianos tu consulta",
    "href": "https://api.whatsapp.com/send?phone=5491155722266&text=Hola%20Equipar%2C%20consulto%20por%20el%20Modulo%201"
  }
]
```

### imagenes.json

```json
[]
```

---

## Curso 03: curso-gnss-modulo-2

### meta.json

```json
{
  "title": "Módulo 2 – Curso RTK: Configuración y Obra – Equipargeo",
  "description": null,
  "canonical": "https://equipargeo.com/curso-gnss-modulo-2/",
  "og": {},
  "slug": "curso-gnss-modulo-2",
  "h1": "Curso RTK: Configuración y Obra",
  "content_size_chars": 1649,
  "ctas_count": 2,
  "imagenes_count": 0
}
```

### content.md

```markdown
# Curso RTK: Configuración y Obra

Aprendé a configurar bases y rovers, trabajar con NTRIP, replantear en campo y solucionar problemas técnicos en tiempo real.

### Objetivos

- Configurar equipos Base y Rover de cualquier marca.
- Operar con redes NTRIP y enlaces de radio UHF.
- Gestionar sistemas de coordenadas locales y proyecciones en obra.

- Configurar equipos Base y Rover de cualquier marca.
- Operar con redes NTRIP y enlaces de radio UHF.
- Gestionar sistemas de coordenadas locales y proyecciones en obra.

### Temario resumido

- **Unidad 1 · Configuración:**Vinculación de equipos, mensajes RTCM, radio vs NTRIP. Sistemas de coordenadas.
- **Unidad 2 · Flujo en Obra:**Levantamiento de puntos, líneas y polígonos. Replanteo eficiente.
- **Unidad 3 · Control (QA/QC):**Chequeos redundantes en tiempo real. Tolerancias y precisión.
- **Unidad 4 · Troubleshooting:**Solución de problemas comunes (pérdida de fix, radio, interferencias).

- **Unidad 1 · Configuración:**Vinculación de equipos, mensajes RTCM, radio vs NTRIP. Sistemas de coordenadas.
- **Unidad 2 · Flujo en Obra:**Levantamiento de puntos, líneas y polígonos. Replanteo eficiente.
- **Unidad 3 · Control (QA/QC):**Chequeos redundantes en tiempo real. Tolerancias y precisión.
- **Unidad 4 · Troubleshooting:**Solución de problemas comunes (pérdida de fix, radio, interferencias).

### Incluye

- Guías de configuración rápida.
- Plantillas de informe de campo.
- Certificado de participación oficial de Equipargeo.

- Guías de configuración rápida.
- Plantillas de informe de campo.
- Certificado de participación oficial de Equipargeo.

#### Argentina

#### Internacional
```

### ctas.json

```json
[
  {
    "text": "Preinscribirme ahora",
    "href": "https://forms.gle/wiRnmaW5759EuP2f6"
  },
  {
    "text": "Envianos tu consulta",
    "href": "https://api.whatsapp.com/send?phone=5491155722266&text=Hola%20Equipar%2C%20consulto%20por%20el%20Modulo%202"
  }
]
```

### imagenes.json

```json
[]
```

---

## Curso 04: curso-gnss-modulo-3

### meta.json

```json
{
  "title": "Módulo 3 – Curso Post-proceso GNSS Profesional – Equipargeo",
  "description": null,
  "canonical": "https://equipargeo.com/curso-gnss-modulo-3/",
  "og": {},
  "slug": "curso-gnss-modulo-3",
  "h1": "Curso Post-proceso GNSS Profesional",
  "content_size_chars": 1658,
  "ctas_count": 2,
  "imagenes_count": 0
}
```

### content.md

```markdown
# Curso Post-proceso GNSS Profesional

Aprendé a procesar estáticos y cinemáticos con control de calidad (QA/QC), comparar soluciones y generar informes técnicos válidos para organismos.

### Objetivos

- Dominar el flujo de trabajo de gabinete para datos GNSS.
- Realizar ajustes de redes y control de calidad (QA/QC).
- Generar reportes técnicos profesionales para clientes u organismos.

- Dominar el flujo de trabajo de gabinete para datos GNSS.
- Realizar ajustes de redes y control de calidad (QA/QC).
- Generar reportes técnicos profesionales para clientes u organismos.

### Temario resumido

- **Unidad 1 · Preparación:**Descarga de datos, efemérides precisas, metadatos y depuración.
- **Unidad 2 · Procesamiento:**Configuración de parámetros, fijado de ambigüedades y análisis.
- **Unidad 3 · Análisis:**Comparación de soluciones (estático vs cinemático) y control.
- **Unidad 4 · Entrega:**Generación de informe final y anexos para presentación.

- **Unidad 1 · Preparación:**Descarga de datos, efemérides precisas, metadatos y depuración.
- **Unidad 2 · Procesamiento:**Configuración de parámetros, fijado de ambigüedades y análisis.
- **Unidad 3 · Análisis:**Comparación de soluciones (estático vs cinemático) y control.
- **Unidad 4 · Entrega:**Generación de informe final y anexos para presentación.

### Incluye

- Datasets reales para practicar.
- Plantillas de informe editables y checklist de control.
- Certificado de participación oficial de Equipargeo.

- Datasets reales para practicar.
- Plantillas de informe editables y checklist de control.
- Certificado de participación oficial de Equipargeo.

#### Argentina

#### Internacional
```

### ctas.json

```json
[
  {
    "text": "Preinscribirme ahora",
    "href": "https://forms.gle/wiRnmaW5759EuP2f6"
  },
  {
    "text": "Envianos tu consulta",
    "href": "https://api.whatsapp.com/send?phone=5491155722266&text=Hola%20Equipar%2C%20tengo%20dudas%20sobre%20el%20Modulo%203"
  }
]
```

### imagenes.json

```json
[]
```

---

## Curso 05: programa-completo-topografia

### meta.json

```json
{
  "title": "Programa completo – TOPOGRAFIA – Equipargeo",
  "description": null,
  "canonical": "https://equipargeo.com/programa-completo-topografia/",
  "og": {},
  "slug": "programa-completo-topografia",
  "h1": "Programa de Formación en Topografía de Obra",
  "content_size_chars": 2469,
  "ctas_count": 10,
  "imagenes_count": 0
}
```

### content.md

```markdown
# Programa de Formación en Topografía de Obra

Capacitación integral en técnicas de medición, replanteo y control. Desde el nivel óptico hasta la estación total, con enfoque 100% práctico para obra civil.

### Objetivo

Dominar los fundamentos: lectura de planos, cotas, medición de distancias y el uso correcto del nivel óptico para evitar errores comunes.

### Temas principales

- **Conceptos clave:**Planos, cotas, pendientes y escalas.
- **Instrumental:**Introducción al nivel óptico y cintas.
- **Práctica:**Replanteo básico de ejes y niveles.
- **Control:**Buenas prácticas y detección de errores frecuentes.

- **Conceptos clave:**Planos, cotas, pendientes y escalas.
- **Instrumental:**Introducción al nivel óptico y cintas.
- **Práctica:**Replanteo básico de ejes y niveles.
- **Control:**Buenas prácticas y detección de errores frecuentes.

### Objetivo

Especialización en altimetría: manejo avanzado de niveles (óptico, láser, digital) y control estricto de cotas, rasantes y tolerancias en obra.

### Temas principales

- **Nivelación geométrica:**Transporte de cotas y cierre de circuitos.
- **Tecnología:**Uso de nivel láser y niveles digitales.
- **Aplicación:**Control de hormigonado, excavaciones y pendientes.
- **Gabinete:**Registro de datos y planillas de cálculo.

- **Nivelación geométrica:**Transporte de cotas y cierre de circuitos.
- **Tecnología:**Uso de nivel láser y niveles digitales.
- **Aplicación:**Control de hormigonado, excavaciones y pendientes.
- **Gabinete:**Registro de datos y planillas de cálculo.

### Objetivo

Operación de Estación Total para levantamientos y replanteos de precisión. Integración de datos campo-gabinete para obras complejas.

### Temas principales

- **Estación Total:**Instalación, orientación y manejo de programas.
- **Replanteo:**Puntos, ejes, arcos y líneas de referencia.
- **Relevamiento:**Planialtimetría y control geométrico de estructuras.
- **Gabinete:**Procesamiento de datos y generación de informes.

- **Estación Total:**Instalación, orientación y manejo de programas.
- **Replanteo:**Puntos, ejes, arcos y líneas de referencia.
- **Relevamiento:**Planialtimetría y control geométrico de estructuras.
- **Gabinete:**Procesamiento de datos y generación de informes.

## ¿Listo para sumarte?

Inscribite al módulo que necesites o hacé el programa completo para transformar tu perfil profesional.

## Información importante

Detalles sobre la cursada y requisitos.

¿Tenés alguna duda puntual?
```

### ctas.json

```json
[
  {
    "text": "Ver Módulo 1",
    "href": "https://equipargeo.com/modulo-1-topografia-basica/"
  },
  {
    "text": "Inscribirme",
    "href": "#cta-topo"
  },
  {
    "text": "Ver Módulo 2",
    "href": "https://equipargeo.com/modulo-2-nivelacion/"
  },
  {
    "text": "Inscribirme",
    "href": "#cta-topo"
  },
  {
    "text": "Ver Módulo 3",
    "href": "https://equipargeo.com/modulo-3-estacion-total/"
  },
  {
    "text": "Inscribirme",
    "href": "#cta-topo"
  },
  {
    "text": "↑ Volver al inicio",
    "href": "#programa-topografia"
  },
  {
    "text": "Formulario de Inscripción",
    "href": "https://forms.gle/NRRBpNBvAhgd8qst8"
  },
  {
    "text": "Consultar por WhatsApp",
    "href": "https://api.whatsapp.com/send?phone=5491155722266&text=Hola%20Equipar%2C%20tengo%20consultas%20sobre%20el%20curso%20de%20Topograf%C3%ADa"
  },
  {
    "text": "Escribinos por WhatsApp →",
    "href": "https://api.whatsapp.com/send?phone=5491155722266&text=Hola%20Equipar%2C%20tengo%20dudas%20sobre%20Topograf%C3%ADa"
  }
]
```

### imagenes.json

```json
[]
```

---

## Curso 06: modulo-1-topografia-basica

### meta.json

```json
{
  "title": "Módulo 1 – Topografía Básica – Equipargeo",
  "description": null,
  "canonical": "https://equipargeo.com/modulo-1-topografia-basica/",
  "og": {},
  "slug": "modulo-1-topografia-basica",
  "h1": "Módulo 1: Topografía Básica de Obra",
  "content_size_chars": 1145,
  "ctas_count": 2,
  "imagenes_count": 0
}
```

### content.md

```markdown
# Módulo 1: Topografía Básica de Obra

La puerta de entrada a la topografía. Aprendé a interpretar planos, medir correctamente y realizar replanteos básicos sin errores.

### Objetivos

- Comprender los fundamentos de la topografía en construcción.
- Leer e interpretar planos de obra, cotas y escalas.
- Realizar mediciones lineales y angulares con precisión.

- Comprender los fundamentos de la topografía en construcción.
- Leer e interpretar planos de obra, cotas y escalas.
- Realizar mediciones lineales y angulares con precisión.

### Temario

- **Unidad 1:**Conceptos fundamentales. Interpretación de planos y cotas.
- **Unidad 2:**Medición de distancias y ángulos. Instrumental básico.
- **Unidad 3:**Replanteo básico de puntos, ejes y escuadras.
- **Unidad 4:**Introducción al nivel óptico y errores frecuentes en obra.

- **Unidad 1:**Conceptos fundamentales. Interpretación de planos y cotas.
- **Unidad 2:**Medición de distancias y ángulos. Instrumental básico.
- **Unidad 3:**Replanteo básico de puntos, ejes y escuadras.
- **Unidad 4:**Introducción al nivel óptico y errores frecuentes en obra.

#### Argentina

#### Internacional
```

### ctas.json

```json
[
  {
    "text": "Preinscribirme ahora",
    "href": "https://forms.gle/NRRBpNBvAhgd8qst8"
  },
  {
    "text": "Envianos tu consulta",
    "href": "https://api.whatsapp.com/send?phone=5491155722266&text=Info%20Modulo%201%20Topografia"
  }
]
```

### imagenes.json

```json
[]
```

---

## Curso 07: modulo-2-nivelacion

### meta.json

```json
{
  "title": "Módulo 2 – Nivelación – Equipargeo",
  "description": null,
  "canonical": "https://equipargeo.com/modulo-2-nivelacion/",
  "og": {},
  "slug": "modulo-2-nivelacion",
  "h1": "Módulo 2: Nivelación y Control Altimétrico",
  "content_size_chars": 1076,
  "ctas_count": 2,
  "imagenes_count": 0
}
```

### content.md

```markdown
# Módulo 2: Nivelación y Control Altimétrico

Dominá las cotas. Aprendé a usar niveles ópticos, láser y digitales para garantizar la verticalidad y horizontalidad de tu obra.

### Objetivos

- Realizar nivelaciones geométricas de precisión.
- Controlar pendientes, rasantes y excavaciones.
- Organizar libretas de campo y cálculos en gabinete.

- Realizar nivelaciones geométricas de precisión.
- Controlar pendientes, rasantes y excavaciones.
- Organizar libretas de campo y cálculos en gabinete.

### Temario

- **Unidad 1:**Nivelación geométrica aplicada. Transporte de cotas.
- **Unidad 2:**Uso práctico de nivel óptico, láser y digitales.
- **Unidad 3:**Control de obra: cotas, pendientes, losas y excavación.
- **Unidad 4:**Tolerancias, errores y organización de datos.

- **Unidad 1:**Nivelación geométrica aplicada. Transporte de cotas.
- **Unidad 2:**Uso práctico de nivel óptico, láser y digitales.
- **Unidad 3:**Control de obra: cotas, pendientes, losas y excavación.
- **Unidad 4:**Tolerancias, errores y organización de datos.

#### Argentina

#### Internacional
```

### ctas.json

```json
[
  {
    "text": "Preinscribirme ahora",
    "href": "https://forms.gle/NRRBpNBvAhgd8qst8"
  },
  {
    "text": "Envianos tu consulta",
    "href": "https://api.whatsapp.com/send?phone=5491155722266&text=Info%20Modulo%202%20Topografia"
  }
]
```

### imagenes.json

```json
[]
```

---

## Curso 08: modulo-3-estacion-total

### meta.json

```json
{
  "title": "Módulo 3 – Estación Total – Equipargeo",
  "description": null,
  "canonical": "https://equipargeo.com/modulo-3-estacion-total/",
  "og": {},
  "slug": "modulo-3-estacion-total",
  "h1": "Módulo 3: Estación Total y Técnicas Avanzadas",
  "content_size_chars": 1096,
  "ctas_count": 2,
  "imagenes_count": 0
}
```

### content.md

```markdown
# Módulo 3: Estación Total y Técnicas Avanzadas

Tecnología de precisión. Aprendé a operar la Estación Total para relevamientos planialtimétricos complejos y replanteos milimétricos.

### Objetivos

- Operar la Estación Total con soltura y precisión.
- Ejecutar levantamientos y replanteos complejos.
- Integrar el trabajo de campo con software CAD/Gabinete.

- Operar la Estación Total con soltura y precisión.
- Ejecutar levantamientos y replanteos complejos.
- Integrar el trabajo de campo con software CAD/Gabinete.

### Temario

- **Unidad 1:**Introducción y manejo de Estación Total. Configuración.
- **Unidad 2:**Replanteo de puntos, ejes y alineaciones.
- **Unidad 3:**Levantamientos planialtimétricos y control geométrico.
- **Unidad 4:**Integración campo-gabinete y criterios avanzados.

- **Unidad 1:**Introducción y manejo de Estación Total. Configuración.
- **Unidad 2:**Replanteo de puntos, ejes y alineaciones.
- **Unidad 3:**Levantamientos planialtimétricos y control geométrico.
- **Unidad 4:**Integración campo-gabinete y criterios avanzados.

#### Argentina

#### Internacional
```

### ctas.json

```json
[
  {
    "text": "Preinscribirme ahora",
    "href": "https://forms.gle/NRRBpNBvAhgd8qst8"
  },
  {
    "text": "Envianos tu consulta",
    "href": "https://api.whatsapp.com/send?phone=5491155722266&text=Info%20Modulo%203%20Topografia"
  }
]
```

### imagenes.json

```json
[]
```

---

## Curso 09: programa-completo-fotogrametria

### meta.json

```json
{
  "title": "Programa completo – FOTOGRAMETRIA – Equipargeo",
  "description": null,
  "canonical": "https://equipargeo.com/programa-completo-fotogrametria/",
  "og": {},
  "slug": "programa-completo-fotogrametria",
  "h1": "Formación Profesional en Manejo de Drones y Fotogrametría",
  "content_size_chars": 2565,
  "ctas_count": 11,
  "imagenes_count": 0
}
```

### content.md

```markdown
# Formación Profesional en Manejo de Drones y Fotogrametría

Capacitación integral para relevamientos técnicos: vuelo, captura, procesamiento y generación de productos para topografía e ingeniería.

### ¿Necesitás procesar imágenes ya?

Consultá por nuestro**Servicio de Procesamiento**. Entregamos ortomosaicos, nubes de puntos y asesoría incluida.

### Objetivo

Conocer los sistemas aéreos, principios de vuelo, seguridad operativa y normativa para planificar misiones exitosas sin riesgos.

### Temas principales

- **Intro:**Tipos de drones, sensores y principios de vuelo.
- **Configuración:**Chequeos previos, calibración y seguridad.
- **Operación:**Buenas prácticas y normativa vigente.
- **Planificación:**Conceptos básicos de vuelo automatizado.

- **Intro:**Tipos de drones, sensores y principios de vuelo.
- **Configuración:**Chequeos previos, calibración y seguridad.
- **Operación:**Buenas prácticas y normativa vigente.
- **Planificación:**Conceptos básicos de vuelo automatizado.

### Objetivo

Aprender a capturar imágenes con calidad técnica para fotogrametría: configuración de cámara, solapes, GSD y uso de puntos de control.

### Temas principales

- **Fotogrametría:**Principios, resolución (GSD) y alturas.
- **Planificación:**Vuelos para ortomosaicos y modelos 3D.
- **Precisión:**Uso de Puntos de Control (GCP) y sistemas GNSS/PPK.
- **Campo:**Buenas prácticas durante el relevamiento.

- **Fotogrametría:**Principios, resolución (GSD) y alturas.
- **Planificación:**Vuelos para ortomosaicos y modelos 3D.
- **Precisión:**Uso de Puntos de Control (GCP) y sistemas GNSS/PPK.
- **Campo:**Buenas prácticas durante el relevamiento.

### Objetivo

Procesar datos en gabinete para generar productos profesionales: Nubes de puntos, Modelos Digitales (DTM/DSM) y Ortomosaicos precisos.

### Temas principales

- **Procesamiento:**Flujo de trabajo en software fotogramétrico.
- **Productos:**Ortomosaicos, Nubes de puntos y Mallas texturizadas.
- **Análisis:**Modelos digitales de terreno y superficie.
- **Entregables:**Integración con CAD/GIS y control de calidad.

- **Procesamiento:**Flujo de trabajo en software fotogramétrico.
- **Productos:**Ortomosaicos, Nubes de puntos y Mallas texturizadas.
- **Análisis:**Modelos digitales de terreno y superficie.
- **Entregables:**Integración con CAD/GIS y control de calidad.

## ¿Listo para sumarte?

Inscribite al módulo que necesites o hacé el programa completo para dominar los relevamientos aéreos.

## Información importante

Detalles sobre la cursada y requisitos.

¿Tenés alguna duda puntual?
```

### ctas.json

```json
[
  {
    "text": "Solicitar Servicio",
    "href": "https://api.whatsapp.com/send?phone=5491155722266&text=Hola%20Equipar%2C%20me%20interesa%20el%20servicio%20de%20procesamiento%20de%20im%C3%A1genes"
  },
  {
    "text": "Ver Módulo 1",
    "href": "https://equipargeo.com/modulo-1-manejo-basico-de-drones/"
  },
  {
    "text": "Inscribirme",
    "href": "#cta-foto"
  },
  {
    "text": "Ver Módulo 2",
    "href": "https://equipargeo.com/modulo-2-captura-de-datos-y-fotogrametria-aplicada/"
  },
  {
    "text": "Inscribirme",
    "href": "#cta-foto"
  },
  {
    "text": "Ver Módulo 3",
    "href": "https://equipargeo.com/modulo-3-procesamiento-y-productos-avanzados/"
  },
  {
    "text": "Inscribirme",
    "href": "#cta-foto"
  },
  {
    "text": "↑ Volver al inicio",
    "href": "#programa-fotogrametria"
  },
  {
    "text": "Formulario de Inscripción",
    "href": "https://forms.gle/JrB1bAoPzcWBi78k6"
  },
  {
    "text": "Consultar por WhatsApp",
    "href": "https://api.whatsapp.com/send?phone=5491155722266&text=Hola%20Equipar%2C%20tengo%20consultas%20sobre%20el%20curso%20de%20Drones"
  },
  {
    "text": "Escribinos por WhatsApp →",
    "href": "https://api.whatsapp.com/send?phone=5491155722266&text=Hola%20Equipar%2C%20tengo%20dudas%20sobre%20el%20curso%20de%20Drones"
  }
]
```

### imagenes.json

```json
[]
```

---

## Curso 10: modulo-1-manejo-basico-de-drones

### meta.json

```json
{
  "title": "Módulo 1 – Manejo Básico de Drones – Equipargeo",
  "description": null,
  "canonical": "https://equipargeo.com/modulo-1-manejo-basico-de-drones/",
  "og": {},
  "slug": "modulo-1-manejo-basico-de-drones",
  "h1": "Módulo 1: Manejo Básico de Drones",
  "content_size_chars": 1078,
  "ctas_count": 2,
  "imagenes_count": 0
}
```

### content.md

```markdown
# Módulo 1: Manejo Básico de Drones

Introducción completa a los sistemas aéreos. Aprendé principios de vuelo, seguridad operativa, normativa y configuración inicial.

### Objetivos

- Conocer los tipos de drones y sensores del mercado.
- Entender la normativa y seguridad para operar sin riesgos.
- Realizar configuraciones y chequeos previos al vuelo.

- Conocer los tipos de drones y sensores del mercado.
- Entender la normativa y seguridad para operar sin riesgos.
- Realizar configuraciones y chequeos previos al vuelo.

### Temario

- **Unidad 1:**Introducción a sistemas de drones (RPAS/UAV).
- **Unidad 2:**Principios básicos de vuelo y sensores.
- **Unidad 3:**Configuración inicial, apps y chequeos pre-vuelo.
- **Unidad 4:**Seguridad operativa, normativa y planificación básica.

- **Unidad 1:**Introducción a sistemas de drones (RPAS/UAV).
- **Unidad 2:**Principios básicos de vuelo y sensores.
- **Unidad 3:**Configuración inicial, apps y chequeos pre-vuelo.
- **Unidad 4:**Seguridad operativa, normativa y planificación básica.

#### Argentina

#### Internacional
```

### ctas.json

```json
[
  {
    "text": "Preinscribirme ahora",
    "href": "https://forms.gle/JrB1bAoPzcWBi78k6"
  },
  {
    "text": "Envianos tu consulta",
    "href": "https://api.whatsapp.com/send?phone=5491155722266&text=Info%20Modulo%201%20Drones"
  }
]
```

### imagenes.json

```json
[]
```

---

## Curso 11: modulo-2-captura-de-datos-y-fotogrametria-aplicada

### meta.json

```json
{
  "title": "Módulo 2 – Captura de Datos y Fotogrametría Aplicada – Equipargeo",
  "description": null,
  "canonical": "https://equipargeo.com/modulo-2-captura-de-datos-y-fotogrametria-aplicada/",
  "og": {},
  "slug": "modulo-2-captura-de-datos-y-fotogrametria-aplicada",
  "h1": "Módulo 2: Captura de Datos y Fotogrametría",
  "content_size_chars": 1135,
  "ctas_count": 2,
  "imagenes_count": 0
}
```

### content.md

```markdown
# Módulo 2: Captura de Datos y Fotogrametría

Planificá y ejecutá vuelos técnicos. Aprendé sobre GSD, solapes, puntos de control y cómo capturar imágenes de calidad para topografía.

### Objetivos

- Planificar vuelos fotogramétricos automatizados.
- Entender la relación entre altura, sensor y resolución (GSD).
- Usar puntos de control (GCP) para georreferenciación precisa.

- Planificar vuelos fotogramétricos automatizados.
- Entender la relación entre altura, sensor y resolución (GSD).
- Usar puntos de control (GCP) para georreferenciación precisa.

### Temario

- **Unidad 1:**Principios de fotogrametría aérea. Concepto de GSD.
- **Unidad 2:**Planificación de vuelos: Apps, alturas y solapes.
- **Unidad 3:**Precisión: Puntos de control (GCP) y sistemas GNSS/PPK.
- **Unidad 4:**Buenas prácticas en campo y captura de datos.

- **Unidad 1:**Principios de fotogrametría aérea. Concepto de GSD.
- **Unidad 2:**Planificación de vuelos: Apps, alturas y solapes.
- **Unidad 3:**Precisión: Puntos de control (GCP) y sistemas GNSS/PPK.
- **Unidad 4:**Buenas prácticas en campo y captura de datos.

#### Argentina

#### Internacional
```

### ctas.json

```json
[
  {
    "text": "Preinscribirme ahora",
    "href": "https://forms.gle/JrB1bAoPzcWBi78k6"
  },
  {
    "text": "Envianos tu consulta",
    "href": "https://api.whatsapp.com/send?phone=5491155722266&text=Info%20Modulo%202%20Drones"
  }
]
```

### imagenes.json

```json
[]
```

---

## Curso 12: modulo-3-procesamiento-y-productos-avanzados

### meta.json

```json
{
  "title": "Módulo 3 – Procesamiento y Productos Avanzados – Equipargeo",
  "description": null,
  "canonical": "https://equipargeo.com/modulo-3-procesamiento-y-productos-avanzados/",
  "og": {},
  "slug": "modulo-3-procesamiento-y-productos-avanzados",
  "h1": "Módulo 3: Procesamiento y Productos Avanzados",
  "content_size_chars": 1135,
  "ctas_count": 2,
  "imagenes_count": 0
}
```

### content.md

```markdown
# Módulo 3: Procesamiento y Productos Avanzados

Del dato al entregable. Procesamiento fotogramétrico en gabinete, generación de nubes de puntos, modelos digitales y ortomosaicos.

### Objetivos

- Dominar el flujo de trabajo en software fotogramétrico.
- Generar y exportar productos (Ortomosaicos, DSM, DTM).
- Integrar resultados en software CAD, GIS y técnico.

- Dominar el flujo de trabajo en software fotogramétrico.
- Generar y exportar productos (Ortomosaicos, DSM, DTM).
- Integrar resultados en software CAD, GIS y técnico.

### Temario

- **Unidad 1:**Procesamiento en gabinete. Flujo de trabajo y parámetros.
- **Unidad 2:**Generación de Nubes de Puntos densas y Mallas.
- **Unidad 3:**Modelos Digitales (Terreno/Superficie) y Ortomosaicos.
- **Unidad 4:**Control de calidad, precisión y exportación a CAD/SIG.

- **Unidad 1:**Procesamiento en gabinete. Flujo de trabajo y parámetros.
- **Unidad 2:**Generación de Nubes de Puntos densas y Mallas.
- **Unidad 3:**Modelos Digitales (Terreno/Superficie) y Ortomosaicos.
- **Unidad 4:**Control de calidad, precisión y exportación a CAD/SIG.

#### Argentina

#### Internacional
```

### ctas.json

```json
[
  {
    "text": "Preinscribirme ahora",
    "href": "https://forms.gle/JrB1bAoPzcWBi78k6"
  },
  {
    "text": "Envianos tu consulta",
    "href": "https://api.whatsapp.com/send?phone=5491155722266&text=Info%20Modulo%203%20Drones"
  }
]
```

### imagenes.json

```json
[]
```

---

# PARTE 3 — AUXILIARES (con contenido real)

## asesoria-tecnica

### meta.json

```json
{
  "title": "Asesoría técnica – Equipargeo",
  "description": null,
  "canonical": "https://equipargeo.com/asesoria-tecnica/",
  "og": {},
  "slug": "asesoria-tecnica",
  "h1": null,
  "content_size_chars": 3086,
  "ctas_count": 7,
  "imagenes_count": 0,
  "forms_count": 0
}
```

### content.md

```markdown
## Asesoría técnica

Te acompañamos en la elección de**equipos GNSS**, definición de**flujo de trabajo**(RTK/PPK), proyecciones y
      control de calidad, para que tu proyecto salga a la primera.

### Alcance

- Relevamiento de uso, entorno, precisión objetivo y presupuesto.
- Definición de flujo RTK/PPK, redes/estaciones y formatos de intercambio (CSV, DXF, RINEX).
- Parámetros cartográficos:**POSGAR 07/SIRGAS – GRS80**,**Gauss-Krüger 3°**, UTM, faja local, falsos y prefijos.
- Selección comparada de receptores, controladoras, antenas y accesorios.
- Control de calidad: chequeos, repetibilidad, checklist y reportes.
- Integración CAD/GIS y postproceso cuando aplique.

- Relevamiento de uso, entorno, precisión objetivo y presupuesto.
- Definición de flujo RTK/PPK, redes/estaciones y formatos de intercambio (CSV, DXF, RINEX).
- Parámetros cartográficos:**POSGAR 07/SIRGAS – GRS80**,**Gauss-Krüger 3°**, UTM, faja local, falsos y prefijos.
- Selección comparada de receptores, controladoras, antenas y accesorios.
- Control de calidad: chequeos, repetibilidad, checklist y reportes.
- Integración CAD/GIS y postproceso cuando aplique.

### Proceso

- Reunión inicial (30–45 min) + formulario breve de requerimientos.
- Propuesta comparada de opciones y plan de trabajo (48–72 h hábiles).
- Implementación: configuración, plantillas, pruebas y capacitación corta.
- Acompañamiento de arranque y soporte inicial.

- Reunión inicial (30–45 min) + formulario breve de requerimientos.
- Propuesta comparada de opciones y plan de trabajo (48–72 h hábiles).
- Implementación: configuración, plantillas, pruebas y capacitación corta.
- Acompañamiento de arranque y soporte inicial.

### Entregables

- Informe técnico con alternativas y recomendación.
- Parámetros y perfiles para controlador (faja, falsos, sistemas y formatos).
- Plantillas de proyecto / checklist de campo y control de calidad.
- Plan de capacitación y materiales de referencia.

- Informe técnico con alternativas y recomendación.
- Parámetros y perfiles para controlador (faja, falsos, sistemas y formatos).
- Plantillas de proyecto / checklist de campo y control de calidad.
- Plan de capacitación y materiales de referencia.

### Modalidad & honorarios

- Remoto o presencial (según disponibilidad y ubicación).
- Tiempo típico: 3–7 días hábiles de punta a punta.
- Honorarios según alcance.*Bonificables parcial/totalmente si adquirís equipamiento o capacitación con nuestros partners.*
- Incluye seguimiento de arranque.

- Remoto o presencial (según disponibilidad y ubicación).
- Tiempo típico: 3–7 días hábiles de punta a punta.
- Honorarios según alcance.*Bonificables parcial/totalmente si adquirís equipamiento o capacitación con nuestros partners.*
- Incluye seguimiento de arranque.

### Preguntas frecuentes

**Aviso:**la asesoría es técnica y orientativa según la información provista. No sustituye el juicio profesional ni constituye garantía de resultado.
        Para documentación oficial o actuaciones con responsabilidad, se requiere verificación independiente por un profesional competente.
```

### ctas.json

```json
[
  {
    "text": "Alcance",
    "href": "#alcance"
  },
  {
    "text": "Proceso",
    "href": "#proceso"
  },
  {
    "text": "Entregables",
    "href": "#entregables"
  },
  {
    "text": "FAQ",
    "href": "#faq"
  },
  {
    "text": "Contactar",
    "href": "#contacto"
  },
  {
    "text": "Quiero asesoría",
    "href": "https://api.whatsapp.com/send?phone=5491155722266&text=Hola%20Equipargeo%2C%20quiero%20asesor%C3%ADa%20t%C3%A9cnica%20para%20mi%20proyecto"
  },
  {
    "text": "Volver a Consultoría & Equipamiento",
    "href": "https://equipargeo.com/consultoria-y-equipamiento/"
  }
]
```

### forms.json

```json
[]
```

### imagenes.json

```json
[]
```

---

## consultoria-y-equipamiento

### meta.json

```json
{
  "title": "Consultoría y equipamiento – Equipargeo",
  "description": null,
  "canonical": "https://equipargeo.com/consultoria-y-equipamiento/",
  "og": {},
  "slug": "consultoria-y-equipamiento",
  "h1": null,
  "content_size_chars": 2107,
  "ctas_count": 7,
  "imagenes_count": 0,
  "forms_count": 0
}
```

### content.md

```markdown
## Consultoría & Equipamiento

Te ayudamos a elegir**equipos GNSS**(base/rover), controladoras, antenas y accesorios; definimos el**flujo de trabajo**y la**capacitación**adecuada a tu proyecto.

### Qué cubrimos

- Selección de receptores GNSS, bases/rovers y controladoras.
- Antenas, bastones, radios, energía y accesorios.
- Flujo de trabajo RTK/PPK, redes y estaciones de referencia.
- Capacitación y puesta en marcha.

- Selección de receptores GNSS, bases/rovers y controladoras.
- Antenas, bastones, radios, energía y accesorios.
- Flujo de trabajo RTK/PPK, redes y estaciones de referencia.
- Capacitación y puesta en marcha.

### Cómo trabajamos

- Relevamos tu uso, entorno y presupuesto.
- Proponemos combinaciones de equipo y capacitación.
- Coordinamos demo o pruebas cuando aplica.
- Acompañamos la compra y el arranque en campo.

- Relevamos tu uso, entorno y presupuesto.
- Proponemos combinaciones de equipo y capacitación.
- Coordinamos demo o pruebas cuando aplica.
- Acompañamos la compra y el arranque en campo.

### Casos típicos

- Migración a RTK con controladora Android.
- Base propia + rover para obra o catastro.
- PPK para zonas con mala cobertura.
- Integración con GIS y postproceso.

- Migración a RTK con controladora Android.
- Base propia + rover para obra o catastro.
- PPK para zonas con mala cobertura.
- Integración con GIS y postproceso.

### Modalidad y tiempos

- Reuniones remotas o presenciales.
- Informe con opciones comparadas.
- Implementación y capacitación breve.
- Soporte posterior según necesidad.

- Reuniones remotas o presenciales.
- Informe con opciones comparadas.
- Implementación y capacitación breve.
- Soporte posterior según necesidad.

¿Vas a adquirir instrumental? Somos nexo con proveedores: te ayudamos a conseguir el mejor precio o el equipo adecuado; si corresponde, te acercamos un
        cupón de descuento para la compra.[Consultar por precio o cupón](https://api.whatsapp.com/send?phone=5491155722266&text=Hola%20Equipargeo%2C%20voy%20a%20comprar%20equipamiento%20y%20quisiera%20asesoramiento%20y%20mejor%20precio%20%2F%20cup%C3%B3n)
```

### ctas.json

```json
[
  {
    "text": "Asesoría técnica",
    "href": "https://equipargeo.com/asesoria-tecnica/"
  },
  {
    "text": "Equipos y accesorios",
    "href": "https://equipargeo.com/consultoria-y-equipamiento/"
  },
  {
    "text": "Contacto rápido",
    "href": "https://api.whatsapp.com/send?phone=5491155722266&text=Hola%20Equipargeo%2C%20necesito%20asesor%C3%ADa%20para%20equipos%20GNSS%20y%20flujo%20de%20trabajo"
  },
  {
    "text": "Quiero asesoría",
    "href": "https://api.whatsapp.com/send?phone=5491155722266&text=Hola%20Equipargeo%2C%20quiero%20asesor%C3%ADa%20t%C3%A9cnica%20para%20elegir%20equipos%20y%20definir%20flujo%20de%20trabajo"
  },
  {
    "text": "Ver Asesoría técnica",
    "href": "https://equipargeo.com/asesoria-tecnica/"
  },
  {
    "text": "Equipos y accesorios",
    "href": "https://equipargeo.com/consultoria-y-equipamiento/"
  },
  {
    "text": "Consultar por precio o cupón",
    "href": "https://api.whatsapp.com/send?phone=5491155722266&text=Hola%20Equipargeo%2C%20voy%20a%20comprar%20equipamiento%20y%20quisiera%20asesoramiento%20y%20mejor%20precio%20%2F%20cup%C3%B3n"
  }
]
```

### forms.json

```json
[]
```

### imagenes.json

```json
[]
```

---

# PARTE 4 — RESUMEN DE EXTRACCIÓN

```json
{
  "herramientas": [
    {
      "title": "Consulta de faja – Equipargeo",
      "description": null,
      "canonical": "https://equipargeo.com/herramientas-gnss/",
      "og": {},
      "slug_origen": "herramientas-gnss",
      "slug_destino": "faja",
      "section_id": "faja-local-tool",
      "section_extraida": true,
      "section_size_chars": 1402,
      "style_extraido": true,
      "style_size_chars": 29333,
      "script_extraido": true,
      "script_size_chars": 3318
    },
    {
      "title": "Conversor de coordenadas – Equipargeo",
      "description": null,
      "canonical": "https://equipargeo.com/conversor-de-coordenadas-lat-long-gk/",
      "og": {},
      "slug_origen": "conversor-de-coordenadas-lat-long-gk",
      "slug_destino": "posgar07",
      "section_id": "gk-posgar07-tool",
      "section_extraida": true,
      "section_size_chars": 6105,
      "style_extraido": true,
      "style_size_chars": 29333,
      "script_extraido": true,
      "script_size_chars": 7301
    },
    {
      "title": "Generador de puntos intermedios – Equipargeo",
      "description": null,
      "canonical": "https://equipargeo.com/herramientas-de-topografia/",
      "og": {},
      "slug_origen": "herramientas-de-topografia",
      "slug_destino": "puntos-intermedios",
      "section_id": "herramienta-puntos",
      "section_extraida": true,
      "section_size_chars": 3426,
      "style_extraido": true,
      "style_size_chars": 2906,
      "script_extraido": true,
      "script_size_chars": 7814
    },
    {
      "title": "Conversor a DXF – Equipargeo",
      "description": null,
      "canonical": "https://equipargeo.com/conversor-a-dxf/",
      "og": {},
      "slug_origen": "conversor-a-dxf",
      "slug_destino": "conversor-dxf",
      "section_id": "eg-csv2dxf",
      "section_extraida": true,
      "section_size_chars": 4554,
      "style_extraido": true,
      "style_size_chars": 29333,
      "script_extraido": true,
      "script_size_chars": 18403
    }
  ],
  "cursos": [
    {
      "title": "Programa completo – Curso GNSS – Equipargeo",
      "description": null,
      "canonical": "https://equipargeo.com/programa-completo-curso-gnss/",
      "og": {},
      "slug": "programa-completo-curso-gnss",
      "h1": "Programa completo",
      "content_size_chars": 3162,
      "ctas_count": 11,
      "imagenes_count": 0
    },
    {
      "title": "Módulo 1 – Curso Fundamentos y Teoría GNSS – Equipargeo",
      "description": null,
      "canonical": "https://equipargeo.com/curso-gnss-modulo-1/",
      "og": {},
      "slug": "curso-gnss-modulo-1",
      "h1": "Curso Fundamentos y Teoría GNSS",
      "content_size_chars": 1674,
      "ctas_count": 2,
      "imagenes_count": 0
    },
    {
      "title": "Módulo 2 – Curso RTK: Configuración y Obra – Equipargeo",
      "description": null,
      "canonical": "https://equipargeo.com/curso-gnss-modulo-2/",
      "og": {},
      "slug": "curso-gnss-modulo-2",
      "h1": "Curso RTK: Configuración y Obra",
      "content_size_chars": 1649,
      "ctas_count": 2,
      "imagenes_count": 0
    },
    {
      "title": "Módulo 3 – Curso Post-proceso GNSS Profesional – Equipargeo",
      "description": null,
      "canonical": "https://equipargeo.com/curso-gnss-modulo-3/",
      "og": {},
      "slug": "curso-gnss-modulo-3",
      "h1": "Curso Post-proceso GNSS Profesional",
      "content_size_chars": 1658,
      "ctas_count": 2,
      "imagenes_count": 0
    },
    {
      "title": "Programa completo – TOPOGRAFIA – Equipargeo",
      "description": null,
      "canonical": "https://equipargeo.com/programa-completo-topografia/",
      "og": {},
      "slug": "programa-completo-topografia",
      "h1": "Programa de Formación en Topografía de Obra",
      "content_size_chars": 2469,
      "ctas_count": 10,
      "imagenes_count": 0
    },
    {
      "title": "Módulo 1 – Topografía Básica – Equipargeo",
      "description": null,
      "canonical": "https://equipargeo.com/modulo-1-topografia-basica/",
      "og": {},
      "slug": "modulo-1-topografia-basica",
      "h1": "Módulo 1: Topografía Básica de Obra",
      "content_size_chars": 1145,
      "ctas_count": 2,
      "imagenes_count": 0
    },
    {
      "title": "Módulo 2 – Nivelación – Equipargeo",
      "description": null,
      "canonical": "https://equipargeo.com/modulo-2-nivelacion/",
      "og": {},
      "slug": "modulo-2-nivelacion",
      "h1": "Módulo 2: Nivelación y Control Altimétrico",
      "content_size_chars": 1076,
      "ctas_count": 2,
      "imagenes_count": 0
    },
    {
      "title": "Módulo 3 – Estación Total – Equipargeo",
      "description": null,
      "canonical": "https://equipargeo.com/modulo-3-estacion-total/",
      "og": {},
      "slug": "modulo-3-estacion-total",
      "h1": "Módulo 3: Estación Total y Técnicas Avanzadas",
      "content_size_chars": 1096,
      "ctas_count": 2,
      "imagenes_count": 0
    },
    {
      "title": "Programa completo – FOTOGRAMETRIA – Equipargeo",
      "description": null,
      "canonical": "https://equipargeo.com/programa-completo-fotogrametria/",
      "og": {},
      "slug": "programa-completo-fotogrametria",
      "h1": "Formación Profesional en Manejo de Drones y Fotogrametría",
      "content_size_chars": 2565,
      "ctas_count": 11,
      "imagenes_count": 0
    },
    {
      "title": "Módulo 1 – Manejo Básico de Drones – Equipargeo",
      "description": null,
      "canonical": "https://equipargeo.com/modulo-1-manejo-basico-de-drones/",
      "og": {},
      "slug": "modulo-1-manejo-basico-de-drones",
      "h1": "Módulo 1: Manejo Básico de Drones",
      "content_size_chars": 1078,
      "ctas_count": 2,
      "imagenes_count": 0
    },
    {
      "title": "Módulo 2 – Captura de Datos y Fotogrametría Aplicada – Equipargeo",
      "description": null,
      "canonical": "https://equipargeo.com/modulo-2-captura-de-datos-y-fotogrametria-aplicada/",
      "og": {},
      "slug": "modulo-2-captura-de-datos-y-fotogrametria-aplicada",
      "h1": "Módulo 2: Captura de Datos y Fotogrametría",
      "content_size_chars": 1135,
      "ctas_count": 2,
      "imagenes_count": 0
    },
    {
      "title": "Módulo 3 – Procesamiento y Productos Avanzados – Equipargeo",
      "description": null,
      "canonical": "https://equipargeo.com/modulo-3-procesamiento-y-productos-avanzados/",
      "og": {},
      "slug": "modulo-3-procesamiento-y-productos-avanzados",
      "h1": "Módulo 3: Procesamiento y Productos Avanzados",
      "content_size_chars": 1135,
      "ctas_count": 2,
      "imagenes_count": 0
    }
  ],
  "auxiliares": [
    {
      "title": "Asesoría técnica – Equipargeo",
      "description": null,
      "canonical": "https://equipargeo.com/asesoria-tecnica/",
      "og": {},
      "slug": "asesoria-tecnica",
      "h1": null,
      "content_size_chars": 3086,
      "ctas_count": 7,
      "imagenes_count": 0,
      "forms_count": 0
    },
    {
      "title": "Consultoría y equipamiento – Equipargeo",
      "description": null,
      "canonical": "https://equipargeo.com/consultoria-y-equipamiento/",
      "og": {},
      "slug": "consultoria-y-equipamiento",
      "h1": null,
      "content_size_chars": 2107,
      "ctas_count": 7,
      "imagenes_count": 0,
      "forms_count": 0
    },
    {
      "title": "Agendá tu curso – Equipargeo",
      "description": null,
      "canonical": "https://equipargeo.com/agenda-tu-curso/",
      "og": {},
      "slug": "agenda-tu-curso",
      "h1": null,
      "content_size_chars": 94,
      "ctas_count": 0,
      "imagenes_count": 0,
      "forms_count": 1
    },
    {
      "title": "Experiencias – Equipargeo",
      "description": null,
      "canonical": null,
      "og": {},
      "slug": "experiencias",
      "h1": null,
      "content_size_chars": 81,
      "ctas_count": 0,
      "imagenes_count": 0,
      "forms_count": 0
    },
    {
      "title": "Home – Equipargeo",
      "description": null,
      "canonical": "https://equipargeo.com/home/",
      "og": {},
      "slug": "home",
      "h1": "Cursos, asesoramiento y herramientaspara profesionales del territorio",
      "content_size_chars": 2069,
      "ctas_count": 15,
      "imagenes_count": 6,
      "forms_count": 0
    }
  ]
}
```
