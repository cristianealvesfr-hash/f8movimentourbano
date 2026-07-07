/**
 * ============================================================
 * F8 MOVIMENTO URBANO — Main JavaScript
 * Landing page premium com tema escuro para eventos esportivos
 * Vanilla JS · Sem dependências externas
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    // ========================================================
    // 1. REFERÊNCIAS GLOBAIS DO DOM
    // ========================================================
    const header       = document.querySelector('.header');
    const mobileBtn    = document.querySelector('.mobile-menu-btn');
    const mobileNav    = document.querySelector('.mobile-nav');
    const heroSection  = document.querySelector('.hero');
    const heroBg       = document.querySelector('.hero-bg');
    const heroTitle    = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');


    // ========================================================
    // 2. EFEITO DE SCROLL NO HEADER
    //    Adiciona a classe 'scrolled' ao header quando o
    //    usuário rola mais de 50px, criando um efeito de
    //    fundo sólido / sombra.
    // ========================================================
    const SCROLL_THRESHOLD = 50;

    const handleHeaderScroll = () => {
        if (!header) return;

        if (window.scrollY > SCROLL_THRESHOLD) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    // Executa imediatamente caso a página já esteja rolada (ex.: reload)
    handleHeaderScroll();


    // ========================================================
    // 3. MENU MOBILE (HAMBÚRGUER)
    //    - Alterna .active no botão e no nav
    //    - Trava o scroll do body quando o menu está aberto
    //    - Fecha o menu ao clicar em qualquer link interno
    // ========================================================
    const toggleMobileMenu = () => {
        if (!mobileBtn || !mobileNav) return;

        const isOpen = mobileNav.classList.toggle('active');
        mobileBtn.classList.toggle('active', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    const closeMobileMenu = () => {
        if (!mobileBtn || !mobileNav) return;

        mobileNav.classList.remove('active');
        mobileBtn.classList.remove('active');
        document.body.style.overflow = '';
    };

    mobileBtn?.addEventListener('click', toggleMobileMenu);

    // Fecha o menu ao clicar em qualquer link dentro do nav mobile
    mobileNav?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });


    // ========================================================
    // 4. SMOOTH SCROLL PARA ÂNCORAS
    //    Todos os links que começam com '#' rolam suavemente
    //    até o destino, compensando a altura fixa do header.
    // ========================================================
    const HEADER_OFFSET = 72; // px — altura fixa do header

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            // Ignora links como "#" sozinho
            if (!href || href === '#') return;

            const targetEl = document.querySelector(href);
            if (!targetEl) return;

            e.preventDefault();

            const targetPosition = targetEl.getBoundingClientRect().top
                                 + window.pageYOffset
                                 - HEADER_OFFSET;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });


    // ========================================================
    // 5. SCROLL REVEAL — ANIMAÇÕES DE ENTRADA
    //    Elementos com a classe .reveal recebem .active quando
    //    entram no viewport. Uma vez revelados, são removidos
    //    do observer para poupar performance.
    // ========================================================
    const revealElements = document.querySelectorAll('.reveal');

    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }


    // ========================================================
    // 6. CONTADOR ANIMADO (STAT NUMBERS)
    //    Anima de 0 até o valor definido em data-target usando
    //    requestAnimationFrame com easing easeOutExpo.
    //    Suporta prefixo (data-prefix) e sufixo (data-suffix).
    //    Cada contador anima apenas uma vez.
    // ========================================================

    /**
     * Anima o valor numérico de um elemento de 0 até data-target.
     * @param {HTMLElement} element — elemento com data-target
     */
    function animateCounter(element) {
        const target    = parseInt(element.dataset.target);
        const prefix    = element.dataset.prefix || '';
        const suffix    = element.dataset.suffix || '';
        const duration  = 2000; // ms
        const startTime = performance.now();

        /**
         * Curva de easing exponencial (saída suave).
         * @param {number} t — progresso normalizado [0,1]
         * @returns {number}
         */
        function easeOutExpo(t) {
            return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        }

        function update(currentTime) {
            const elapsed      = currentTime - startTime;
            const progress     = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutExpo(progress);
            const currentValue = Math.floor(easedProgress * target);

            element.textContent = prefix + currentValue.toLocaleString('pt-BR') + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                // Garante que o valor final exato seja exibido
                element.textContent = prefix + target.toLocaleString('pt-BR') + suffix;
            }
        }

        requestAnimationFrame(update);
    }

    // Observer para disparar os contadores quando visíveis
    const statNumbers = document.querySelectorAll('.stat-number');

    if (statNumbers.length > 0) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        statNumbers.forEach(el => counterObserver.observe(el));
    }


    // ========================================================
    // 7. SWITCH B2B / B2C  (ATLETA ↔ ORGANIZADOR)
    //    Alterna o conteúdo visível com base no modo selecionado.
    //    Atualiza também o título e subtítulo do hero.
    // ========================================================
    const switchToggle = document.querySelector('.switch-toggle');

    if (switchToggle) {
        const switchBtns = switchToggle.querySelectorAll('button');

        // Conteúdos dinâmicos do Hero para cada modo
        const heroContent = {
            atleta: {
                title:    'Movimente sua vida. <span>Desafie a cidade.</span>',
                subtitle: 'Encontre seu próximo desafio, acompanhe seus resultados e conecte-se com a comunidade esportiva.'
            },
            organizador: {
                title:    'Organize eventos <span>inesquecíveis.</span>',
                subtitle: 'Cronometragem por chip, logística completa e tecnologia para eventos esportivos de alto nível.'
            }
        };

        /**
         * Alterna o modo de exibição entre Atleta e Organizador.
         * @param {string} mode — 'atleta' | 'organizador'
         */
        const switchMode = (mode) => {
            // Atualiza botões ativos
            switchBtns.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.mode === mode);
            });

            // Seleciona todos os elementos com data-view
            const viewElements = document.querySelectorAll('[data-view]');

            viewElements.forEach(el => {
                const view = el.dataset.view;

                if (view === 'both') {
                    // Elementos marcados como "both" ficam sempre visíveis
                    el.classList.remove('fade-out');
                    el.classList.add('fade-in');
                    el.style.display = '';
                } else if (view === mode) {
                    // Mostra com fade-in
                    el.style.display = '';
                    // Força reflow antes de adicionar a classe de transição
                    void el.offsetWidth;
                    el.classList.remove('fade-out');
                    el.classList.add('fade-in');
                } else {
                    // Esconde com fade-out
                    el.classList.remove('fade-in');
                    el.classList.add('fade-out');
                    // Esconde após a transição terminar
                    el.addEventListener('transitionend', function handler() {
                        if (el.classList.contains('fade-out')) {
                            el.style.display = 'none';
                        }
                        el.removeEventListener('transitionend', handler);
                    });
                }
            });

            // Atualiza título e subtítulo do Hero com transição
            const content = heroContent[mode];
            if (content) {
                if (heroTitle) {
                    heroTitle.classList.add('fade-out');
                    setTimeout(() => {
                        heroTitle.innerHTML = content.title;
                        heroTitle.classList.remove('fade-out');
                        heroTitle.classList.add('fade-in');
                        // Remove a classe de fade-in após a transição
                        setTimeout(() => heroTitle.classList.remove('fade-in'), 400);
                    }, 300);
                }
                if (heroSubtitle) {
                    heroSubtitle.classList.add('fade-out');
                    setTimeout(() => {
                        heroSubtitle.textContent = content.subtitle;
                        heroSubtitle.classList.remove('fade-out');
                        heroSubtitle.classList.add('fade-in');
                        setTimeout(() => heroSubtitle.classList.remove('fade-in'), 400);
                    }, 300);
                }
            }
        };

        // Adiciona listener em cada botão do switch
        switchBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const mode = btn.dataset.mode;
                if (mode) switchMode(mode);
            });
        });
    }


    // ========================================================
    // 8. CARROSSEL DE EVENTOS
    //    Scroll horizontal controlado por botões prev/next.
    //    Calcula a largura do card + gap para rolar exatamente
    //    um card por clique.
    // ========================================================
    const eventsCarousel = document.querySelector('.events-carousel');

    if (eventsCarousel) {
        const prevBtn   = document.querySelector('.carousel-btn.prev');
        const nextBtn   = document.querySelector('.carousel-btn.next');
        const GAP       = 24; // px — gap entre os cards

        /**
         * Retorna a largura total de rolagem por clique
         * (largura do primeiro card + gap).
         */
        const getScrollAmount = () => {
            const firstCard = eventsCarousel.querySelector('.event-card');
            if (!firstCard) return 300; // fallback
            return firstCard.offsetWidth + GAP;
        };

        prevBtn?.addEventListener('click', () => {
            eventsCarousel.scrollBy({
                left: -getScrollAmount(),
                behavior: 'smooth'
            });
        });

        nextBtn?.addEventListener('click', () => {
            eventsCarousel.scrollBy({
                left: getScrollAmount(),
                behavior: 'smooth'
            });
        });
    }


    // ========================================================
    // 9. CARROSSEL DE DEPOIMENTOS (AUTO-SCROLL HORIZONTAL)
    // ========================================================
    const testimonialsGrid = document.querySelector('.testimonials-grid');
    if (testimonialsGrid) {
        let autoRotateTimer = null;
        
        const startTestimonialScroll = () => {
            if (autoRotateTimer) clearInterval(autoRotateTimer);
            autoRotateTimer = setInterval(() => {
                // maxScrollLeft is the maximum distance the container can scroll
                const maxScrollLeft = testimonialsGrid.scrollWidth - testimonialsGrid.clientWidth;
                
                // If we are at the end (or very close), go back to start
                if (testimonialsGrid.scrollLeft >= maxScrollLeft - 10) {
                    testimonialsGrid.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    // Scroll exactly one card width + gap
                    const card = testimonialsGrid.querySelector('.testimonial-card');
                    const scrollAmount = card ? (card.offsetWidth + 24) : 320; 
                    testimonialsGrid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                }
            }, 4000);
        };

        const stopTestimonialScroll = () => {
            if (autoRotateTimer) clearInterval(autoRotateTimer);
        };

        // Pause on hover or touch
        testimonialsGrid.addEventListener('mouseenter', stopTestimonialScroll);
        testimonialsGrid.addEventListener('mouseleave', startTestimonialScroll);
        testimonialsGrid.addEventListener('touchstart', stopTestimonialScroll, { passive: true });
        testimonialsGrid.addEventListener('touchend', startTestimonialScroll, { passive: true });

        // Start the carousel
        startTestimonialScroll();
    }


    // ========================================================
    // 10. BARRA DE BUSCA
    //     Valida o input — se vazio, aplica animação de shake.
    //     Se preenchido, exibe o termo buscado.
    // ========================================================
    const searchForm  = document.querySelector('.search-form');
    const searchInput = document.getElementById('search-input');
    const searchBtn   = document.getElementById('btn-search');

    /**
     * Processa a busca: valida o campo e exibe resultado.
     * @param {Event} [e] — evento de submit ou click
     */
    const handleSearch = (e) => {
        e?.preventDefault();

        if (!searchInput) return;

        const value = searchInput.value.trim();

        if (!value) {
            // Campo vazio — aplica efeito de shake
            searchInput.classList.add('shake');
            searchInput.focus();
            // Remove a classe após a animação terminar (~600 ms)
            setTimeout(() => searchInput.classList.remove('shake'), 600);
            return;
        }

        // Busca válida
        console.log(`🔍 Buscando: ${value}`);
        alert(`Buscando: ${value}`);
    };

    searchForm?.addEventListener('submit', handleSearch);
    searchBtn?.addEventListener('click', handleSearch);


    // ========================================================
    // 11. EFEITO PARALLAX NO HERO
    //     Move o background do hero a uma velocidade diferente
    //     do scroll, criando profundidade visual.
    //     Desativado em telas ≤ 768 px para melhor performance.
    // ========================================================
    const PARALLAX_FACTOR  = 0.3;
    const PARALLAX_BREAKPOINT = 768; // px

    const handleParallax = () => {
        if (!heroBg) return;
        if (window.innerWidth <= PARALLAX_BREAKPOINT) {
            // Reseta a transformação em mobile
            heroBg.style.transform = '';
            return;
        }

        const scrollY = window.scrollY;
        heroBg.style.transform = `translateY(${scrollY * PARALLAX_FACTOR}px)`;
    };

    window.addEventListener('scroll', handleParallax, { passive: true });
    window.addEventListener('resize', handleParallax, { passive: true });
    // Executa imediatamente
    handleParallax();


    // ========================================================
    // 12. COOKIE CONSENT BANNER
    // ========================================================
    const cookieBanner = document.getElementById('cookie-banner');
    const btnAcceptCookies = document.getElementById('btn-accept-cookies');

    if (cookieBanner && btnAcceptCookies) {
        // Verifica se o usuário já aceitou os cookies
        const hasAccepted = localStorage.getItem('f8_cookie_consent');
        
        if (!hasAccepted) {
            // Mostra o banner com um pequeno delay para a animação
            cookieBanner.style.display = 'block';
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 100);
        }

        btnAcceptCookies.addEventListener('click', () => {
            // Salva no localStorage
            localStorage.setItem('f8_cookie_consent', 'true');
            // Remove o banner com animação
            cookieBanner.classList.remove('show');
            setTimeout(() => {
                cookieBanner.style.display = 'none';
            }, 400); // 400ms = tempo da transição no CSS
        });
    }

    // ========================================================
    // LOG DE INICIALIZAÇÃO
    // ========================================================
    console.log('⚡ F8 Movimento Urbano — JS carregado com sucesso.');

}); // Fim do DOMContentLoaded
