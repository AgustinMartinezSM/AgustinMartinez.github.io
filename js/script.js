// --- Lógica para el Menú Hamburguesa ---
const menuToggleButton = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('header nav ul');

if (menuToggleButton && mainNav) {
    menuToggleButton.addEventListener('click', () => {
        mainNav.classList.toggle('active');
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
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
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
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    };
    const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);
    animatedElements.forEach(el => {
        scrollObserver.observe(el);
    });
}

// --- Datos de los Proyectos para las Modales ---
const projectsData = [
    {
        id: "project1",
        title: "Hotel Management Application",
        image: "images/ManagerHotelApp.png",
        description: `
            <p>This system is designed to streamline the organization of a hotel by efficiently managing its rooms, guests, and customer interactions. It provides a comprehensive suite of features to handle daily hotel operations.</p>
            <strong>Key functionalities include:</strong>
            <ul>
                <li>Room reservations and booking management.</li>
                <li>Guest check-in and check-out processes.</li>
                <li>Real-time tracking of room status: occupied, available, or unavailable (with reasons for unavailability).</li>
                <li>Reporting on room availability for specified periods.</li>
                <li>Generation of detailed guest reports (name, ID, origin, address, etc.).</li>
                <li>Optional feature: maintaining a history of guest stays at the hotel.</li>
            </ul>
            <p>This project is currently being finalized, focusing on robust performance and user-friendly interface.</p>
        `,
        technologies: ["Java (OOP)", "Spring Boot (Example)", "MySQL (Example)"],
        githubLink: "#",
        githubLinkText: "Code (In Progress)",
        demoLink: "#",
        demoLinkText: "Demo (Coming Soon)"
    },
    {
        id: "project2",
        title: "My Personal Landing Page",
        image: "images/MiLandingPage.png",
        description: `
            <p>This landing page serves as my personal digital portfolio, developed entirely from scratch. The primary goal was to create a clean, modern, and easily navigable platform to showcase my programming skills, projects, and professional background.</p>
            <p>It features a responsive design adaptable to all devices, a theme switcher for light/dark modes, subtle scroll animations for a dynamic user experience, and a typewriter effect for the hero section subtitle using Typed.js. The contact form is validated client-side for enhanced usability.</p>
        `,
        technologies: ["HTML5", "CSS3 (Flexbox, Grid, Variables)", "JavaScript (ES6+)", "Typed.js", "Font Awesome", "Git/GitHub"],
        githubLink: "https://github.com/AgustinMartinezSM/AgustinMartinez.github.io",
        githubLinkText: "View Code (GitHub)",
        demoLink: "https://agustinmartinezsm.github.io/",
        demoLinkText: "View Live Demo"
    }
];


// --- Lógica Principal que depende del DOM ---
document.addEventListener('DOMContentLoaded', () => {

    // --- Lógica para Copiar Email al Portapapeles en la Tarjeta de Contacto ---
        const emailCardButton = document.getElementById('email-me-card'); // El ID que le dimos al <a>

        if (emailCardButton) {
            const emailParagraph = emailCardButton.querySelector('p[data-email]');
            const emailToCopy = emailParagraph ? emailParagraph.dataset.email : null;
            const notificationElement = emailCardButton.querySelector('.copy-notification');

            if (emailToCopy && notificationElement) { // Solo proceder si tenemos el email y el elemento de notificación
                emailCardButton.addEventListener('click', (event) => {
                    event.preventDefault(); // Prevenir la acción por defecto del enlace '#'

                    if (!navigator.clipboard) {
                        // Fallback para navegadores muy antiguos o si la API no está disponible (ej. en HTTP no seguro)
                        console.error('Clipboard API not available or page is not secure (HTTPS).');
                        // Podrías mostrar un mensaje de error más amigable al usuario aquí si quieres
                        notificationElement.textContent = 'Cannot copy automatically.';
                        notificationElement.style.color = '#ff6b6b'; // Color de error
                        notificationElement.style.display = 'inline'; // o 'block'
                        notificationElement.style.opacity = '1';
                        setTimeout(() => {
                            notificationElement.style.opacity = '0';
                            setTimeout(() => {
                                notificationElement.style.display = 'none';
                                notificationElement.style.color = 'var(--color-accent)'; // Restaurar color
                            }, 300); // Coincidir con la duración de la transición de opacidad del CSS
                        }, 3000);
                        return;
                    }

                    navigator.clipboard.writeText(emailToCopy).then(() => {
                        // Éxito al copiar
                        notificationElement.textContent = 'Email copied!';
                        notificationElement.style.color = 'var(--color-accent)'; // Asegurar color de éxito
                        notificationElement.style.display = 'inline'; // O 'block', según tu CSS

                        // Forzar reflow para que la transición de opacidad funcione al cambiar display
                        // void notificationElement.offsetWidth; // Descomentar si la opacidad no transiciona bien

                        notificationElement.style.opacity = '1'; // Hacer visible con transición

                        // Ocultar la notificación después de unos segundos
                        setTimeout(() => {
                            notificationElement.style.opacity = '0'; // Iniciar fundido de salida
                            // Esperar a que termine la transición de opacidad antes de display:none
                            setTimeout(() => {
                               if (notificationElement.style.opacity === '0') { // Doble check por si acaso
                                   notificationElement.style.display = 'none';
                               }
                            }, 300); // Debe ser igual o un poco mayor que la duración de la transición de opacidad
                        }, 2000); // Mostrar por 2 segundos

                    }).catch(err => {
                        // Error al copiar
                        console.error('Error al intentar copiar el email: ', err);
                        notificationElement.textContent = 'Failed to copy!';
                        notificationElement.style.color = '#ff6b6b'; // Un color de error
                        notificationElement.style.display = 'inline'; // O 'block'
                        notificationElement.style.opacity = '1';

                        setTimeout(() => {
                            notificationElement.style.opacity = '0';
                             setTimeout(() => {
                               if (notificationElement.style.opacity === '0') {
                                   notificationElement.style.display = 'none';
                                   notificationElement.style.color = 'var(--color-accent)'; // Restaurar color por defecto
                               }
                            }, 300);
                        }, 3000); // Mostrar error por 3 segundos
                    });
                });
            } else {
                if (!emailToCopy) console.error("No se pudo encontrar el email para copiar en data-email.");
                if (!notificationElement) console.error("Elemento .copy-notification no encontrado dentro de #email-me-card.");
            }
        } else {
            console.warn("Elemento #email-me-card no encontrado para la funcionalidad de copiar email.");
        }

    // --- Lógica para Efecto Máquina de Escribir (Typed.js) ---
    const heroSubtitleElement = document.getElementById('hero-subtitle');
    if (heroSubtitleElement) {
        const typedOptions = {
            strings: [
                "Full Stack Developer",
                "Passionate Programming Student",
                "Tech Educator at UTN",
                "Building Digital Solutions",
                "Always Learning & Coding"
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 1500,
            startDelay: 500,
            loop: true,
        };
        new Typed('#hero-subtitle', typedOptions);
    } else {
        console.error("Elemento #hero-subtitle no encontrado para Typed.js");
    }

    // --- Lógica para Botón Volver Arriba ---
    const backToTopButton = document.querySelector('#back-to-top-btn');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });
        function smoothScrollTo(targetY, duration) {
            const startY = window.scrollY;
            const distance = targetY - startY;
            let startTime = null;
            function animationStep(currentTime) {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                let progress = Math.min(timeElapsed / duration, 1);
                let ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
                window.scrollTo(0, startY + distance * ease);
                if (timeElapsed < duration) {
                    requestAnimationFrame(animationStep);
                }
            }
            requestAnimationFrame(animationStep);
        }
        backToTopButton.addEventListener('click', (event) => {
            event.preventDefault();
            smoothScrollTo(0, 800);
        });
    } else {
        console.error("Botón #back-to-top-btn no encontrado.");
    }

    // --- Lógica para Modo Claro / Modo Oscuro ---
    const themeToggleButton = document.getElementById('theme-toggle');
    const bodyElement = document.body;
    const sunIcon = "fas fa-sun";
    const moonIcon = "fas fa-moon";

    if (themeToggleButton && bodyElement) {
        const applyTheme = (theme) => {
            if (theme === 'light') {
                bodyElement.classList.add('light-mode');
                themeToggleButton.innerHTML = `<i class="${moonIcon}"></i>`;
                themeToggleButton.setAttribute('aria-label', 'Switch to dark mode');
            } else {
                bodyElement.classList.remove('light-mode');
                themeToggleButton.innerHTML = `<i class="${sunIcon}"></i>`;
                themeToggleButton.setAttribute('aria-label', 'Switch to light mode');
            }
        };
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            applyTheme(savedTheme);
        } else {
            applyTheme('dark'); // Default theme
        }
        themeToggleButton.addEventListener('click', () => {
            let newTheme = bodyElement.classList.contains('light-mode') ? 'dark' : 'light';
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    } else {
        console.error("Botón #theme-toggle o body no encontrado.");
    }

    // --- Lógica para Validación Avanzada del Formulario de Contacto ---
    const contactForm = document.forms['contact']; // El formulario original
    if (contactForm) { // Solo si el formulario original existe (por si lo ocultamos condicionalmente y no está en el DOM al inicio)
        const nameInput = contactForm.elements['name'];
        const emailInput = contactForm.elements['email'];
        const messageInput = contactForm.elements['message'];
        const nameError = document.getElementById('name-error');
        const emailError = document.getElementById('email-error');
        const messageError = document.getElementById('message-error');

        const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const setFieldError = (field, errorElement, message) => {
            if (errorElement) {
                 errorElement.textContent = message || '';
            }
            if (field) {
                if (message) {
                    field.classList.add('input-error');
                } else {
                    field.classList.remove('input-error');
                }
            }
        };

        const validateForm = () => {
            let isValid = true;
            if (!nameInput || !nameInput.value.trim()) {
                setFieldError(nameInput, nameError, 'Please enter your name.');
                isValid = false;
            } else {
                setFieldError(nameInput, nameError, '');
            }
            if (!emailInput || !emailInput.value.trim()) {
                setFieldError(emailInput, emailError, 'Please enter your email.');
                isValid = false;
            } else if (!isValidEmail(emailInput.value.trim())) {
                setFieldError(emailInput, emailError, 'Please enter a valid email.');
                isValid = false;
            } else {
                setFieldError(emailInput, emailError, '');
            }
            if (!messageInput || !messageInput.value.trim()) {
                setFieldError(messageInput, messageError, 'Please write a message.');
                isValid = false;
            } else {
                setFieldError(messageInput, messageError, '');
            }
            return isValid;
        };
        contactForm.addEventListener('submit', (event) => {
            setFieldError(nameInput, nameError, '');
            setFieldError(emailInput, emailError, '');
            setFieldError(messageInput, messageError, '');
            if (!validateForm()) {
                event.preventDefault();
                console.log('Form invalid. Submission stopped.');
            } else {
                console.log('Form valid. Submitting to Netlify...');
            }
        });
    } else {
        // No mostramos error si el formulario es opcional y no está presente inicialmente
        // console.warn("Form 'contact' no encontrado para validación avanzada, pero puede ser intencional.");
    }

    // --- Lógica para la Modal de Proyectos ---
    const modalOverlay = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalImageContainer = document.getElementById('modal-image-container');
    const modalDescription = document.getElementById('modal-description');
    const modalTechList = document.getElementById('modal-tech-list');
    const modalGithubLink = document.getElementById('modal-github-link');
    const modalDemoLink = document.getElementById('modal-demo-link');
    const modalCloseBtn = document.querySelector('.modal-close-btn');
    const moreDetailsButtons = document.querySelectorAll('.btn-details');

    function openModal(projectId) {
        const project = projectsData.find(p => p.id === projectId);
        if (!project) {
            console.error("Project not found with ID:", projectId);
            return;
        }
        if(modalTitle) modalTitle.textContent = project.title;
        if(modalImageContainer) {
            if (project.image && project.image.trim() !== "") {
                modalImageContainer.innerHTML = `<img src="${project.image}" alt="Image of ${project.title}">`;
                modalImageContainer.style.display = 'block';
            } else {
                modalImageContainer.innerHTML = '';
                modalImageContainer.style.display = 'none';
            }
        }
        if(modalDescription) modalDescription.innerHTML = project.description;
        if(modalTechList) {
            modalTechList.innerHTML = '';
            project.technologies.forEach(tech => {
                const li = document.createElement('li');
                li.textContent = tech;
                modalTechList.appendChild(li);
            });
        }
        if(modalGithubLink){
            if (project.githubLinkText) { // Priorizar LinkText
                modalGithubLink.style.display = 'inline-block';
                modalGithubLink.textContent = project.githubLinkText;
                modalGithubLink.href = (project.githubLink && project.githubLink !== "#" && project.githubLink.trim() !== "") ? project.githubLink : "#";
                if (modalGithubLink.href === "#") modalGithubLink.classList.add('btn-disabled-visual'); else modalGithubLink.classList.remove('btn-disabled-visual');
            } else if (project.githubLink && project.githubLink !== "#" && project.githubLink.trim() !== "") {
                modalGithubLink.href = project.githubLink;
                modalGithubLink.style.display = 'inline-block';
                modalGithubLink.textContent = 'View Code (GitHub)';
                modalGithubLink.classList.remove('btn-disabled-visual');
            } else {
                modalGithubLink.style.display = 'none';
            }
        }
        if(modalDemoLink){
            if (project.demoLinkText) { // Priorizar LinkText
                modalDemoLink.style.display = 'inline-block';
                modalDemoLink.textContent = project.demoLinkText;
                modalDemoLink.href = (project.demoLink && project.demoLink !== "#" && project.demoLink.trim() !== "") ? project.demoLink : "#";
                if (modalDemoLink.href === "#") modalDemoLink.classList.add('btn-disabled-visual'); else modalDemoLink.classList.remove('btn-disabled-visual');
            } else if (project.demoLink && project.demoLink !== "#" && project.demoLink.trim() !== "") {
                modalDemoLink.href = project.demoLink;
                modalDemoLink.style.display = 'inline-block';
                modalDemoLink.textContent = 'View Demo';
                modalDemoLink.classList.remove('btn-disabled-visual');
            } else {
                modalDemoLink.style.display = 'none';
            }
        }
        if (modalOverlay) {
            modalOverlay.classList.add('active');
            modalOverlay.setAttribute('aria-hidden', 'false');
            document.body.classList.add('modal-active');
        }
    }

    function closeModal() {
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
            modalOverlay.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('modal-active');
        }
    }

    if (moreDetailsButtons.length > 0 && typeof projectsData !== 'undefined' && projectsData) {
        moreDetailsButtons.forEach(button => {
            button.addEventListener('click', function(event) {
                event.preventDefault();
                const projectId = this.dataset.projectId;
                openModal(projectId);
            });
        });
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(event) {
            if (event.target === modalOverlay) {
                closeModal();
            }
        });
    }
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

    // --- Lógica para Desplegar/Colapsar Biografía en "About Me" ---
    const toggleBioBtn = document.getElementById('toggle-bio-btn');
    const moreBioContent = document.getElementById('more-bio-content');

    if (toggleBioBtn && moreBioContent) {
        toggleBioBtn.addEventListener('click', () => {
            const isExpanded = toggleBioBtn.getAttribute('aria-expanded') === 'true';

            toggleBioBtn.setAttribute('aria-expanded', !isExpanded);
            moreBioContent.classList.toggle('visible');

            if (!isExpanded) {
                moreBioContent.style.display = 'block';
                toggleBioBtn.innerHTML = 'Read Less <i class="fas fa-chevron-up"></i>';
                toggleBioBtn.classList.add('expanded');
            } else {
                toggleBioBtn.innerHTML = 'Read More <i class="fas fa-chevron-down"></i>';
                toggleBioBtn.classList.remove('expanded');
                // Opcional: Ocultar con display:none después de la transición
                // setTimeout(() => { if (!moreBioContent.classList.contains('visible')) moreBioContent.style.display = 'none'; }, 500);
            }
        });
    }

    // --- Lógica para Mostrar/Ocultar Formulario de Contacto ---
    const showContactFormBtn = document.getElementById('show-contact-form-btn');
    const contactFormContainer = document.getElementById('contact-form'); // El form tiene el ID ahora

    if (showContactFormBtn && contactFormContainer) {
        showContactFormBtn.addEventListener('click', () => {
            const isVisible = contactFormContainer.classList.toggle('visible');

            if (isVisible) {
                // contactFormContainer.style.display = 'block'; // El CSS con .visible se encarga del display
                showContactFormBtn.textContent = 'Hide Contact Form';
                showContactFormBtn.setAttribute('aria-expanded', 'true');
                contactFormContainer.setAttribute('aria-hidden', 'false');
            } else {
                showContactFormBtn.textContent = 'Show Contact Form';
                showContactFormBtn.setAttribute('aria-expanded', 'false');
                contactFormContainer.setAttribute('aria-hidden', 'true');
                // La transición de max-height a 0 en la clase .hidden-form (que se quita/pone con .visible) lo oculta
            }
        });
    }

}); // Fin del addEventListener DOMContentLoaded principal