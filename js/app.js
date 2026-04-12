/* 
   ZAYARA MAISON SOIREE - Premium VCard JS (v2)
   Navy & Gold · Cotizador + Overlays
*/

// ============================================
// SPLASH & INIT
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    var splash = document.getElementById('intro');
    var splashLogo = document.getElementById('splash-logo');
    var splashTag = document.getElementById('splash-tag');
    var app = document.getElementById('app');

    // Animate splash
    gsap.to(splashLogo, {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'elastic.out(1, 0.6)',
        delay: 0.3
    });

    gsap.to(splashTag, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 1.2
    });

    // Fade out splash, show app
    gsap.to(splash, {
        opacity: 0,
        delay: 2.8,
        duration: 0.8,
        onComplete: function() {
            splash.style.display = 'none';
            app.style.opacity = '1';
            app.style.visibility = 'visible';
            initReveal();
            initTilt();
        }
    });
});

// ============================================
// REVEAL ON SCROLL
// ============================================
function initReveal() {
    var reveals = document.querySelectorAll('.reveal');
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                gsap.to(entry.target, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power3.out'
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    reveals.forEach(function(el) { observer.observe(el); });
}

// ============================================
// VANILLA TILT
// ============================================
function initTilt() {
    var tiltEls = document.querySelectorAll('[data-tilt]');
    if (window.VanillaTilt) {
        VanillaTilt.init(tiltEls, {
            max: 10,
            speed: 400,
            glare: true,
            'max-glare': 0.12,
            gyroscope: true
        });
    }
}

// ============================================
// MENU OVERLAY
// ============================================
function openMenu() {
    document.getElementById('menu-view').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeMenu() {
    document.getElementById('menu-view').classList.remove('open');
    document.body.style.overflow = '';
}

// ============================================
// LIGHTBOX
// ============================================
function openLightbox(src) {
    var lb = document.getElementById('lightbox');
    document.getElementById('lightbox-img').src = src;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('open');
    document.body.style.overflow = '';
}

// ============================================
// COTIZADOR — MULTI-STEP FORM
// ============================================
var routePath = [1, 2, 3, 4, 5, 6];
var currentRouteIndex = 0;

var formData = {
    evento: '',
    servicios: [],
    snacks: [],
    invitados: '',
    fecha: '',
    ubicacion: '',
    salon: '',
    nombre: '',
    whatsapp: ''
};

function openForm() {
    document.getElementById('form-view').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeForm() {
    document.getElementById('form-view').classList.remove('open');
    document.body.style.overflow = '';
    // Reset
    currentRouteIndex = 0;
    routePath = [1, 2, 3, 4, 5, 6];
    formData.evento = '';
    formData.servicios = [];
    formData.snacks = [];
    formData.invitados = '';
    formData.fecha = '';
    formData.ubicacion = '';
    formData.salon = '';
    formData.nombre = '';
    formData.whatsapp = '';
    showStep(1);
    document.querySelectorAll('.option-card.selected').forEach(function(el) { el.classList.remove('selected'); });
    document.querySelectorAll('.pill-option.selected').forEach(function(el) { el.classList.remove('selected'); });
    document.querySelectorAll('.form-input').forEach(function(el) { el.value = ''; });
}

function showStep(n) {
    document.querySelectorAll('.step').forEach(function(s) { s.classList.remove('active'); });
    var step = document.getElementById('step-' + n);
    if (step) step.classList.add('active');

    // Progress
    var stepNumber = currentRouteIndex + 1;
    var totalRealSteps = routePath.length;
    var pct = (stepNumber / totalRealSteps) * 100;
    document.getElementById('form-progress').style.width = pct + '%';
    document.getElementById('step-counter').textContent = stepNumber + ' / ' + totalRealSteps;

    // Prev button
    document.getElementById('btn-prev').style.visibility = currentRouteIndex > 0 ? 'visible' : 'hidden';

    // Next button
    var nextBtn = document.getElementById('btn-next');
    if (currentRouteIndex === totalRealSteps - 1) {
        nextBtn.textContent = 'Enviar por WhatsApp';
        nextBtn.classList.add('btn-wa-send');
        nextBtn.disabled = false;
        buildSummary();
    } else {
        nextBtn.textContent = n === 'snacks' && formData.snacks.length === 0 ? 'Omitir y Siguiente' : 'Siguiente';
        nextBtn.classList.remove('btn-wa-send');
        validateStep(n);
    }
}

function changeStep(dir) {
    var nextIndex = currentRouteIndex + dir;
    if (nextIndex < 0 || nextIndex >= routePath.length + 1) return;

    if (nextIndex === routePath.length) {
        sendWhatsApp();
        return;
    }

    currentRouteIndex = nextIndex;
    showStep(routePath[currentRouteIndex]);
}

var snackLimits = { f:0, b:0, d:0, c:0, g:0, v:0 };
var snackCounts = { f:0, b:0, d:0, c:0, g:0, v:0 };

function selectSnackPackage(el, packageType, limits, invitadosStr) {
    document.querySelectorAll('#snacks-package-selector .px-option').forEach(function(c) { 
        c.classList.remove('selected'); 
    });
    el.classList.add('selected');
    
    formData.snacksPackage = el.dataset.val;
    
    routePath = [1, 2, 'snacks'];
    if(packageType !== 'custom') {
        formData.invitados = invitadosStr;
        routePath.push(4, 5, 6);
        
        snackLimits = limits;
        snackCounts = { f:0, b:0, d:0, c:0, g:0, v:0 };
        document.querySelectorAll('#step-snacks .pill-option').forEach(function(c) {
            c.classList.remove('selected');
        });
        
        ['f', 'b', 'd', 'c', 'g', 'v'].forEach(function(cat) {
            var elCounter = document.getElementById('count-' + cat);
            if(elCounter) elCounter.textContent = '0/' + limits[cat];
        });
        
        var vContainer = document.getElementById('verduras-container');
        if(vContainer) {
            vContainer.style.display = limits.v > 0 ? 'block' : 'none';
        }
        
        document.getElementById('snacks-selections-container').style.display = 'block';
    } else {
        formData.invitados = '';
        routePath.push(3, 4, 5, 6);
        
        document.getElementById('snacks-selections-container').style.display = 'none';
    }
    
    // Update step counter UI since routePath might have changed
    var stepNumber = currentRouteIndex + 1;
    var totalRealSteps = routePath.length;
    var pct = (stepNumber / totalRealSteps) * 100;
    document.getElementById('form-progress').style.width = pct + '%';
    document.getElementById('step-counter').textContent = stepNumber + ' / ' + totalRealSteps;
    
    updateSnackFormData();
}

function toggleSnackItem(el, cat) {
    var isSelected = el.classList.contains('selected');
    
    if(!isSelected) {
        if(snackCounts[cat] >= snackLimits[cat]) {
            el.parentElement.style.transform = 'translateX(5px)';
            setTimeout(function(){ el.parentElement.style.transform = ''; }, 150);
            return;
        }
        snackCounts[cat]++;
    } else {
        snackCounts[cat]--;
    }
    
    el.classList.toggle('selected');
    document.getElementById('count-' + cat).textContent = snackCounts[cat] + '/' + snackLimits[cat];
    
    updateSnackFormData();
}

function updateSnackFormData() {
    formData.snacks = [];
    document.querySelectorAll('#snacks-selections-container .pill-option.selected').forEach(function(c) {
        formData.snacks.push(c.dataset.val);
    });
    validateStep('snacks');
}


// ============================================
// STEP SELECTION HANDLERS
// ============================================
function selectStepOption(el, step) {
    el.parentElement.querySelectorAll('.option-card, .pill-option').forEach(function(c) { c.classList.remove('selected'); });
    el.classList.add('selected');

    var val = el.dataset.val;
    if (step === 1) formData.evento = val;
    if (step === 3) formData.invitados = val;

    validateStep(step);
}

function toggleService(el) {
    el.classList.toggle('selected');
    
    formData.servicios = [];
    var needsSnacks = false;
    document.querySelectorAll('#step-2 .option-card.selected').forEach(function(card) {
        formData.servicios.push(card.dataset.val);
        if(card.dataset.val === 'Mesa de snacks') needsSnacks = true;
    });
    
    routePath = [1, 2];
    if (needsSnacks) {
        routePath.push('snacks');
        
        var selectedPx = document.querySelector('#snacks-package-selector .px-option.selected');
        if (selectedPx && selectedPx.dataset.val !== 'Personalizado') {
            routePath.push(4, 5, 6);
        } else {
            routePath.push(3, 4, 5, 6);
        }
    } else {
        routePath.push(3, 4, 5, 6);
    }

    validateStep(2);
}

// ============================================
// VALIDATE STEPS
// ============================================
function validateStep(step) {
    var nextBtn = document.getElementById('btn-next');
    var valid = false;

    switch (step) {
        case 'snacks':
            valid = true;
            if(formData.snacksPackage) {
                if(formData.snacksPackage === 'Personalizado') {
                    nextBtn.textContent = 'Siguiente';
                } else if(formData.snacks.length > 0) {
                    nextBtn.textContent = 'Siguiente';
                } else {
                    nextBtn.textContent = 'Omitir y Siguiente';
                }
            } else {
                valid = false;
            }
            break;
        case 1:
            valid = formData.evento !== '';
            break;
        case 2:
            valid = formData.servicios.length > 0;
            break;
        case 3:
            valid = formData.invitados !== '';
            break;
        case 4:
            var date = document.getElementById('event-date').value;
            var loc = document.getElementById('event-location').value.trim();
            formData.fecha = date;
            formData.ubicacion = loc;
            formData.salon = document.getElementById('event-venue').value.trim();
            valid = date !== '' && loc.length >= 3;
            break;
        case 5:
            var name = document.getElementById('contact-name').value.trim();
            var wa = document.getElementById('contact-wa').value.trim();
            formData.nombre = name;
            formData.whatsapp = wa;
            valid = name.length >= 2 && wa.length >= 10;
            break;
    }

    nextBtn.disabled = !valid;
}

// ============================================
// BUILD SUMMARY
// ============================================
function buildSummary() {
    var summary = document.getElementById('quote-summary');
    
    var dateStr = '-';
    if (formData.fecha) {
        var parts = formData.fecha.split('-');
        dateStr = parts[2] + '/' + parts[1] + '/' + parts[0];
    }

    var ubicStr = formData.ubicacion;
    if (formData.salon) ubicStr += ' - ' + formData.salon;

    var snacksInfo = '';
    if (formData.servicios.includes('Mesa de snacks') && formData.snacksPackage) {
        snacksInfo = '<div class="quote-row"><span class="label">Paquete Botanas</span><span class="value">' + formData.snacksPackage + '</span></div>';
        if(formData.snacks.length > 0) {
            snacksInfo += '<div class="quote-row" style="margin-top:-8px; border-top:none;"><span class="label" style="opacity:0.6;">Seleccion (<small>' + formData.snacks.length + '</small>)</span><span class="value" style="font-size:0.8rem; color:#aaa;">' + formData.snacks.join(', ') + '</span></div>';
        }
    }

    summary.innerHTML = 
        '<div class="quote-row"><span class="label">Evento</span><span class="value">' + formData.evento + '</span></div>' +
        '<div class="quote-row"><span class="label">Servicios</span><span class="value">' + formData.servicios.join(', ') + '</span></div>' +
        snacksInfo +
        '<div class="quote-row"><span class="label">Invitados</span><span class="value">' + formData.invitados + ' personas</span></div>' +
        '<div class="quote-row"><span class="label">Fecha</span><span class="value">' + dateStr + '</span></div>' +
        '<div class="quote-row"><span class="label">Ubicacion</span><span class="value">' + ubicStr + '</span></div>' +
        '<div class="quote-row"><span class="label">Contacto</span><span class="value">' + formData.nombre + '</span></div>' +
        '<div class="quote-row"><span class="label">WhatsApp</span><span class="value">' + formData.whatsapp + '</span></div>';
}

// ============================================
// SEND WHATSAPP
// ============================================
function sendWhatsApp() {
    var dateStr = '-';
    if (formData.fecha) {
        var parts = formData.fecha.split('-');
        dateStr = parts[2] + '/' + parts[1] + '/' + parts[0];
    }

    var salonLine = '';
    if (formData.salon) {
        salonLine = '\nSalon: ' + formData.salon;
    }

    var snacksCtx = '';
    if (formData.servicios.includes('Mesa de snacks') && formData.snacksPackage) {
        snacksCtx = '\nPaquete Botanas: ' + formData.snacksPackage;
        if(formData.snacks.length > 0) {
            snacksCtx += '\nSeleccion (' + formData.snacks.length + '): ' + formData.snacks.join(', ');
        }
    }

    var msg = 'Hola ZAYARA, me gustaria cotizar un evento:' +
        '\n\nTipo de evento: ' + formData.evento +
        '\nServicios: ' + formData.servicios.join(', ') +
        snacksCtx +
        '\nInvitados: ' + formData.invitados + ' personas' +
        '\nFecha: ' + dateStr +
        '\nUbicacion: ' + formData.ubicacion +
        salonLine +
        '\n\nNombre: ' + formData.nombre +
        '\nWhatsApp: ' + formData.whatsapp +
        '\n\nPodrian darme una cotizacion personalizada?';

    var encoded = encodeURIComponent(msg);
    var url = 'https://wa.me/522294118697?text=' + encoded;

    // Confetti
    if (window.confetti) {
        confetti({
            particleCount: 80,
            spread: 65,
            origin: { y: 0.6 },
            colors: ['#C9A86C', '#1B2A4A', '#E2D1AD', '#ffffff']
        });
    }

    setTimeout(function() {
        window.open(url, '_blank');
        closeForm();
    }, 800);
}

// ============================================
// INTERACTIVE GUIDED TOUR
// ============================================
var tourSteps = [
    {
        target: '.brand-prof-unit',
        title: 'Tu Logo con Ring LED',
        desc: 'Este es tu logo principal. Aparece con un efecto de luz dorada que le da presencia y elegancia a tu marca.',
        position: 'bottom'
    },
    {
        target: '.action-grid',
        title: 'Botones de Contacto',
        desc: 'Tus clientes pueden tocarte en Instagram, WhatsApp, ver el catálogo de snacks o llamarte directamente con un solo toque.',
        position: 'bottom'
    },
    {
        target: '.btn-secondary',
        title: 'Catálogo de Snacks',
        desc: 'Este botón abre el menú completo de tu mesa de snacks con todas las categorías y productos disponibles.',
        position: 'bottom'
    },
    {
        target: '.catalogue-section',
        title: 'Tus Servicios',
        desc: 'Aquí se muestran todas las categorías de servicios que ofreces: decoraciones, centros de mesa, snacks y asesorías.',
        position: 'top'
    },
    {
        target: '.video-capsule-container',
        title: 'Video Promocional',
        desc: 'Tu video se reproduce automáticamente en formato cinematográfico. Perfecto para que tus clientes vean la calidad de tu trabajo.',
        position: 'top'
    },
    {
        target: '.main-gallery',
        title: 'Galería de Eventos',
        desc: 'Tus mejores fotos de bodas, XV años, bautizos y fiestas. Tus clientes pueden tocar cualquier imagen para verla en grande.',
        position: 'top'
    },
    {
        target: '.btn-boutique',
        title: 'Cotizador Inteligente',
        desc: 'La función más poderosa. Tus clientes arman su cotización paso a paso y te llega todo organizado a tu WhatsApp.',
        position: 'top'
    },
    {
        target: '#theme-btn',
        title: 'Modo Oscuro / Claro',
        desc: 'Tus clientes pueden cambiar entre modo claro y oscuro según su preferencia. Se ve premium en ambos.',
        position: 'bottom'
    }
];

var currentTourStep = 0;
var tourActive = false;

function startTour() {
    currentTourStep = 0;
    tourActive = true;
    document.getElementById('tour-overlay').classList.add('active');
    renderTourProgress();
    showTourStep(0);
}

function endTour() {
    tourActive = false;
    document.getElementById('tour-overlay').classList.remove('active');
    document.getElementById('tour-tooltip').classList.remove('visible');
    document.getElementById('tour-spotlight').style.cssText = 'display:none';
}

function nextTourStep() {
    currentTourStep++;
    if (currentTourStep >= tourSteps.length) {
        endTour();
        return;
    }
    showTourStep(currentTourStep);
}

function showTourStep(index) {
    var step = tourSteps[index];
    var el = document.querySelector(step.target);
    if (!el) { nextTourStep(); return; }

    // Scroll element into view
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });

    setTimeout(function() {
        var rect = el.getBoundingClientRect();
        var pad = 10;

        // Position spotlight
        var spot = document.getElementById('tour-spotlight');
        spot.style.display = 'block';
        spot.style.top = (rect.top - pad) + 'px';
        spot.style.left = (rect.left - pad) + 'px';
        spot.style.width = (rect.width + pad * 2) + 'px';
        spot.style.height = (rect.height + pad * 2) + 'px';

        // Update tooltip content
        document.getElementById('tour-step-label').textContent = 'Paso ' + (index + 1) + ' de ' + tourSteps.length;
        document.getElementById('tour-title').textContent = step.title;
        document.getElementById('tour-desc').textContent = step.desc;

        // Update button text
        var nextBtn = document.getElementById('tour-next-btn');
        nextBtn.textContent = (index === tourSteps.length - 1) ? '¡Listo!' : 'Siguiente';

        // Position tooltip
        var tooltip = document.getElementById('tour-tooltip');
        tooltip.classList.remove('visible');
        var tooltipW = Math.min(320, window.innerWidth * 0.9);
        var tooltipLeft = Math.max(10, Math.min(rect.left + rect.width / 2 - tooltipW / 2, window.innerWidth - tooltipW - 10));

        tooltip.style.left = tooltipLeft + 'px';
        tooltip.style.width = tooltipW + 'px';

        if (step.position === 'bottom') {
            tooltip.style.top = (rect.bottom + pad + 15) + 'px';
            tooltip.style.bottom = 'auto';
        } else {
            var estimatedH = 200;
            tooltip.style.top = Math.max(10, rect.top - pad - estimatedH - 15) + 'px';
            tooltip.style.bottom = 'auto';
        }

        // Update progress dots
        var dots = document.querySelectorAll('.tour-dot');
        dots.forEach(function(d, i) {
            d.classList.toggle('active', i === index);
        });

        // Show with delay for smooth animation
        setTimeout(function() {
            tooltip.classList.add('visible');
        }, 300);

    }, 500);
}

function renderTourProgress() {
    var container = document.getElementById('tour-progress');
    container.innerHTML = '';
    for (var i = 0; i < tourSteps.length; i++) {
        var dot = document.createElement('div');
        dot.className = 'tour-dot' + (i === 0 ? ' active' : '');
        container.appendChild(dot);
    }
}
