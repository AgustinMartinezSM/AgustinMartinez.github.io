// --- Lógica para el Menú Hamburguesa ---

// 1. Seleccionar los elementos del DOM
const menuToggleButton = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('header nav ul');

// 2. Añadir un 'escuchador de eventos' al botón
if (menuToggleButton && mainNav) { // Comprobar si ambos elementos existen
    menuToggleButton.addEventListener('click', () => {
        // 3. Cuando se hace clic, añadir o quitar la clase 'active' a la navegación
        mainNav.classList.toggle('active');

        // Opcional: Cambiar el aria-label para accesibilidad
        if (mainNav.classList.contains('active')) {
            menuToggleButton.setAttribute('aria-label', 'Cerrar menú');
        } else {
            menuToggleButton.setAttribute('aria-label', 'Mostrar menú');
        }
    });
} else {
    console.error("No se encontró el botón de menú o la lista de navegación.");
}

document.querySelectorAll('header nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // Previene el salto brusco por defecto

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth' // Hace que el scroll sea animado
            });

            // Opcional: cerrar el menú móvil después de hacer clic en un enlace
            if (mainNav && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                menuToggleButton.setAttribute('aria-label', 'Mostrar menú');
            }
        }
    });
});

// --- Lógica para Animaciones al Hacer Scroll ---

const animatedElements = document.querySelectorAll('.scroll-animate');

if (animatedElements.length > 0) {
    const observerOptions = {
        root: null, // Observa la intersección con el viewport
        rootMargin: '0px',
        threshold: 0.1 // Se activa cuando al menos el 10% del elemento está visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Deja de observar una vez animado (opcional, para rendimiento)
            }
        });
    };

    const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);

    animatedElements.forEach(el => {
        scrollObserver.observe(el);
    });
}

// --- Lógica para Efecto Máquina de Escribir (Typed.js) ---

document.addEventListener('DOMContentLoaded', () => { // Asegura que el HTML esté cargado

    const heroSubtitleElement = document.querySelector('#hero-subtitle');

    if (heroSubtitleElement) {
        // Opciones de Typed.js (puedes personalizar)
        const options = {
            strings: [
                "Full Stack Developer",
                    "Passionate Programming Student",
                    "Tech Educator at UTN", // "Tech Educator" suena moderno
                    "Building Digital Solutions",
                    "Always Learning & Coding" // Un toque extra
            ],
            typeSpeed: 50,   // Velocidad de escritura (milisegundos por caracter)
            backSpeed: 30,   // Velocidad de borrado
            backDelay: 1500, // Pausa antes de empezar a borrar
            startDelay: 500, // Pausa antes de empezar a escribir la primera vez
            loop: true,      // Repetir el ciclo de frases
            // showCursor: true, // Mostrar cursor parpadeante (por defecto es true)
            // cursorChar: '|', // Caracter del cursor
        };

        // Inicializar Typed.js
        const typed = new Typed('#hero-subtitle', options);

    } else {
        console.error("Elemento #hero-subtitle no encontrado para Typed.js");
    }

}); // Fin del addEventListener DOMContentLoaded

// --- Lógica para Botón Volver Arriba (CON SCROLL JS PERSONALIZADO) ---

const backToTopButton = document.querySelector('#back-to-top-btn');

if (backToTopButton) {
    // Mostrar/Ocultar botón según el scroll (ESTA PARTE QUEDA IGUAL)
    window.addEventListener('scroll', () => {
        const scrollThreshold = 300; // Píxeles a bajar para que aparezca el botón
        if (window.scrollY > scrollThreshold) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    // Función para la animación de scroll suave personalizada
    function smoothScrollTo(targetY, duration) {
        const startY = window.scrollY;
        const distance = targetY - startY;
        let startTime = null;

        function animationStep(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            // Aplicar easing (ease-in-out quadratic) para un movimiento más suave
            // progress va de 0 a 1
            let progress = Math.min(timeElapsed / duration, 1);
            let ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;

            window.scrollTo(0, startY + distance * ease);

            if (timeElapsed < duration) {
                requestAnimationFrame(animationStep); // Siguiente cuadro de animación
            }
        }
        requestAnimationFrame(animationStep); // Inicia la animación
    }

    // Hacer scroll suave al inicio al hacer clic
    backToTopButton.addEventListener('click', (event) => {
        event.preventDefault(); // Previene que el '#' del href afecte la URL
        smoothScrollTo(0, 800); // Llama a la función personalizada: 0 es la posición Y (top), 800 son milisegundos de duración
    });

} else {
    console.error("Botón #back-to-top-btn no encontrado.");
}

// --- Lógica para Modo Claro / Modo Oscuro ---

const themeToggleButton = document.getElementById('theme-toggle');
const bodyElement = document.body;
const sunIcon = "fas fa-sun"; // Clase para el icono de sol
const moonIcon = "fas fa-moon"; // Clase para el icono de luna

if (themeToggleButton) {
    // Función para aplicar el tema (y actualizar icono)
    const applyTheme = (theme) => {
        if (theme === 'light') {
            bodyElement.classList.add('light-mode');
            themeToggleButton.innerHTML = `<i class="${moonIcon}"></i>`; // Mostrar luna en modo claro
            themeToggleButton.setAttribute('aria-label', 'Cambiar a modo oscuro');
        } else {
            bodyElement.classList.remove('light-mode');
            themeToggleButton.innerHTML = `<i class="${sunIcon}"></i>`;  // Mostrar sol en modo oscuro
            themeToggleButton.setAttribute('aria-label', 'Cambiar a modo claro');
        }
    };

    // Cargar el tema guardado al iniciar la página
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        // Si no hay tema guardado, aplica el oscuro por defecto (o el que prefieras)
        // y actualiza el icono por si acaso el HTML inicial no coincide.
        applyTheme('dark');
    }


    // Evento al hacer clic en el botón
    themeToggleButton.addEventListener('click', () => {
        let newTheme;
        if (bodyElement.classList.contains('light-mode')) {
            newTheme = 'dark';
        } else {
            newTheme = 'light';
        }
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme); // Guardar la nueva preferencia
    });

} else {
    console.error("Botón #theme-toggle no encontrado.");
}

// --- Lógica para Validación Avanzada del Formulario de Contacto ---

const contactForm = document.forms['contact']; // Accedemos al formulario por su nombre

if (contactForm) {
    const nameInput = contactForm.elements['name'];
    const emailInput = contactForm.elements['email'];
    const messageInput = contactForm.elements['message'];

    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');

    // Función para validar email con una expresión regular simple
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Función para mostrar/ocultar errores
    const setFieldError = (field, errorElement, message) => {
        if (message) {
            errorElement.textContent = message;
            field.classList.add('input-error');
        } else {
            errorElement.textContent = '';
            field.classList.remove('input-error');
        }
    };

    const validateForm = () => {
        let isValid = true;

        // Validar Nombre
        if (nameInput.value.trim() === '') {
            setFieldError(nameInput, nameError, 'Por favor, ingresa tu nombre.');
            isValid = false;
        } else {
            setFieldError(nameInput, nameError, ''); // Limpiar error
        }

        // Validar Email
        if (emailInput.value.trim() === '') {
            setFieldError(emailInput, emailError, 'Por favor, ingresa tu email.');
            isValid = false;
        } else if (!isValidEmail(emailInput.value.trim())) {
            setFieldError(emailInput, emailError, 'Por favor, ingresa un email válido.');
            isValid = false;
        } else {
            setFieldError(emailInput, emailError, ''); // Limpiar error
        }

        // Validar Mensaje
        if (messageInput.value.trim() === '') {
            setFieldError(messageInput, messageError, 'Por favor, escribe un mensaje.');
            isValid = false;
        } else {
            setFieldError(messageInput, messageError, ''); // Limpiar error
        }

        return isValid;
    };

    contactForm.addEventListener('submit', (event) => {
        // Primero, limpiamos errores previos para una nueva validación
        setFieldError(nameInput, nameError, '');
        setFieldError(emailInput, emailError, '');
        setFieldError(messageInput, messageError, '');

        if (!validateForm()) {
            event.preventDefault(); // Detiene el envío del formulario si hay errores
            console.log('Formulario no válido. Envío detenido.');
        } else {
            // Si es válido, el formulario se enviará normalmente a Netlify
            // (No se necesita hacer nada más aquí para el envío a Netlify)
            console.log('Formulario válido. Enviando a Netlify...');
        }
    });

    // Opcional: Validación en tiempo real mientras se escribe (on input)
    // Descomenta si quieres esta funcionalidad
    /*
    [nameInput, emailInput, messageInput].forEach(input => {
        input.addEventListener('input', () => {
            // Validar solo el campo que se está modificando para no mostrar todos los errores de golpe
            if (input === nameInput && nameInput.value.trim() !== '') setFieldError(nameInput, nameError, '');
            if (input === emailInput && isValidEmail(emailInput.value.trim())) setFieldError(emailInput, emailError, '');
            if (input === messageInput && messageInput.value.trim() !== '') setFieldError(messageInput, messageError, '');
        });
    });
    */

} else {
    console.warn("Formulario 'contact' no encontrado para validación avanzada.");
}