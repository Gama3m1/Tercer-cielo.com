// ======================================================================
// 1. FUNCIONALIDAD DEL MENÚ DE NAVEGACIÓN (HAMBURGUESA) Y RESALTADO
// ======================================================================

document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu-link');

    if (navToggle && navMenu) {
        // Toggle de la visibilidad del menú
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('visible'); // Usa la clase 'visible' de tu CSS
        });

        // Cierra el menú cuando se hace clic en un enlace (útil en móvil)
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('visible')) {
                    navMenu.classList.remove('visible');
                }
            });
        });
    }

    // --- Funcionalidad de Resaltado Activo (Link Activo) ---
    function updateActiveLink() {
        // Obtiene la ruta de la página actual (ej: /HTML/radio.html)
        const currentPagePath = window.location.pathname.toUpperCase(); 

        navLinks.forEach((link) => {
            const linkHref = link.getAttribute("href").toUpperCase();
            
            // 1. Quitar la clase 'active' de todos
            link.classList.remove("active");

            // 2. Comprobar si es un enlace a la página actual (sin anclas)
            if (linkHref === currentPagePath || linkHref.includes(currentPagePath)) {
                
                // Si la URL es la misma (Ej. index.html) y no es un ancla
                if (!linkHref.includes('#')) {
                     link.classList.add("active");
                }
            } 
            
            // 3. Comprobar enlaces con anclas (solo en la página de inicio)
            if (currentPagePath.endsWith('INDEX.HTML') || currentPagePath === '/') {
                if (linkHref.startsWith("#")) {
                    const section = document.querySelector(linkHref.toLowerCase());
                    const scrollY = window.scrollY;

                    if (section) {
                        const sectionTop = section.offsetTop - 100; // Ajuste para el header
                        const sectionHeight = section.clientHeight;
                        
                        // Si el scroll está dentro de la sección, la activa
                        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                            link.classList.add("active");
                        }
                    }
                }
            }

        });
    }

    // Ejecutar la función cuando el usuario hace scroll o cuando la página carga
    window.addEventListener("scroll", updateActiveLink);
    window.addEventListener("load", updateActiveLink);


// ======================================================================
// 2. FUNCIONALIDAD DEL REPRODUCTOR DE RADIO (HOWLER.JS)
// ======================================================================

    // La URL de tu stream de radio (confirmada)
    const STREAM_URL = "http://78.129.237.51:21395/"; 
    const radioBtn = document.getElementById('radio-play-btn');

    // Inicializar Howler SOLAMENTE si el botón de radio existe en la página actual (radio.html)
    if (radioBtn) {
        
        const radioIcon = radioBtn.querySelector('.material-icons');
        let isPlaying = false;

        // Inicializar el objeto Howl con la URL del Stream
        const sound = new Howl({
            src: [STREAM_URL],
            html5: true, // Importante para streams en vivo
            volume: 0.8,
            autoplay: false,
            format: ['mp3', 'aac'], 

            // Evento cuando la reproducción comienza
            onplay: function() {
                isPlaying = true;
                // Actualiza el texto y la clase para indicar que está sonando
                radioBtn.innerHTML = '<i class="material-icons">pause</i> Detener Transmisión';
                radioBtn.classList.add('playing');
                console.log('Reproduciendo radio...');
            },

            // Evento cuando la reproducción se pausa
            onpause: function() {
                isPlaying = false;
                // Actualiza el texto y la clase para indicar que está pausado
                radioBtn.innerHTML = '<i class="material-icons">play_arrow</i> Iniciar Transmisión';
                radioBtn.classList.remove('playing');
                console.log('Radio pausada.');
            },
            
            // Evento de carga (para el spinner inicial si quieres añadir uno)
            onload: function() {
                console.log('Stream de radio cargado y listo.');
            },

            // Manejo de errores de carga del stream
            onloaderror: function(id, err) {
                console.error("Error al cargar el stream:", err);
                radioBtn.innerHTML = '<i class="material-icons">error</i> ERROR DE STREAM';
                radioBtn.disabled = true;
                radioBtn.classList.remove('playing');
            }
        });

        // Lógica de Reproducir/Pausar al hacer clic en el botón
        radioBtn.addEventListener('click', () => {
            if (!isPlaying) {
                // Iniciar reproducción
                sound.play();
            } else {
                // Detener reproducción
                sound.pause();
            }
        });
    }
});