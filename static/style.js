document.addEventListener("DOMContentLoaded", () => {
    // Core Elements
    const body = document.body;
    const select = document.getElementById("category-select");
    const form = document.getElementById("summarizer-form");
    const card = document.getElementById("main-card");
    const cardContainer = document.querySelector(".card-tilt-container");
    const loadingOverlay = document.getElementById("loading-overlay");
    const summaryBox = document.getElementById("summary-content");
    const copyBtn = document.getElementById("copy-summary-btn");

    // Initialize Active Class on Body
    if (select) {
        body.className = select.value;
    }

    /* ==========================================================================
       1. CANVAS PARTICLE BACKGROUND SYSTEM
       ========================================================================== */
    const canvas = document.getElementById("bg-canvas");
    const ctx = canvas.getContext("2d");

    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };

    // Theme Particle Settings
    const themeConfigs = {
        general: {
            particleColor: "rgba(0, 255, 170, 0.4)",
            lineColor: "rgba(157, 0, 255, 0.15)",
            speedFactor: 0.8,
            density: 85,
            connectionDist: 110
        },
        study: {
            particleColor: "rgba(0, 210, 255, 0.35)",
            lineColor: "rgba(121, 40, 202, 0.12)",
            speedFactor: 0.4,
            density: 120, // Calmer starfield density
            connectionDist: 85
        },
        music: {
            particleColor: "rgba(255, 0, 127, 0.55)",
            lineColor: "rgba(255, 85, 0, 0.2)",
            speedFactor: 1.6, // Energetic speed
            density: 75,
            connectionDist: 135
        }
    };

    let activeConfig = themeConfigs[select?.value || "general"];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    }

    class Particle {
        constructor() {
            this.reset(true);
        }

        reset(isInitial = false) {
            this.x = Math.random() * canvas.width;
            this.y = isInitial ? Math.random() * canvas.height : canvas.height + 10;
            this.size = Math.random() * 2.5 + 1.2;
            
            // Random direction
            const angle = Math.random() * Math.PI * 2;
            const speed = (Math.random() * 0.8 + 0.2) * activeConfig.speedFactor;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed - (select?.value === "music" ? 0.3 : 0.05); // Subtle upward drift
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Repel / Attract slightly based on mouse
            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.hypot(dx, dy);
                if (distance < mouse.radius) {
                    let force = (mouse.radius - distance) / mouse.radius;
                    // Push particles away
                    this.x -= (dx / distance) * force * 1.5;
                    this.y -= (dy / distance) * force * 1.5;
                }
            }

            // Screen boundary checks
            if (this.x < 0 || this.x > canvas.width || this.y < -10 || this.y > canvas.height + 10) {
                this.reset(false);
            }
        }

        draw() {
            ctx.fillStyle = activeConfig.particleColor;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.shadowBlur = select?.value === "music" ? 6 : 0;
            ctx.shadowColor = activeConfig.particleColor;
            ctx.fill();
            ctx.shadowBlur = 0; // Reset shadow
        }
    }

    function initParticles() {
        particles = [];
        const count = Math.min((canvas.width * canvas.height) / 11000, activeConfig.density);
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function connectParticles() {
        const dist = activeConfig.connectionDist;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let distance = Math.hypot(dx, dy);

                if (distance < dist) {
                    let alpha = (1 - (distance / dist)) * 0.55;
                    ctx.strokeStyle = activeConfig.lineColor.replace(/[\d.]+\)$/, `${alpha})`);
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        requestAnimationFrame(animateParticles);
    }

    // Event Listeners for Canvas
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    window.addEventListener("mouseleave", () => {
        mouse.x = null;
        mouse.y = null;
    });

    resizeCanvas();
    animateParticles();

    /* ==========================================================================
       2. DYNAMIC THEME SWITCHER
       ========================================================================== */
    if (select) {
        select.addEventListener("change", (e) => {
            const theme = e.target.value;
            body.className = theme;
            document.documentElement.setAttribute("data-theme", theme);
            
            // Smoothly update particle configurations
            activeConfig = themeConfigs[theme];
            
            // Re-init particles with new densities/speeds
            initParticles();
        });
    }

    /* ==========================================================================
       3. 3D CARD TILT EFFECT (DESKTOP ONLY)
       ========================================================================== */
    if (card && cardContainer) {
        const handleTilt = (e) => {
            const rect = cardContainer.getBoundingClientRect();
            const x = e.clientX - rect.left; // mouse x within card
            const y = e.clientY - rect.top;  // mouse y within card
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate tilt angle (max 10 degrees)
            const rotateX = ((centerY - y) / centerY) * 8; 
            const rotateY = ((x - centerX) / centerX) * 8;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            
            // Dynamically adjust shadow offset opposite of tilt
            const shadowX = -rotateY * 2.5;
            const shadowY = rotateX * 2.5;
            card.style.boxShadow = `${shadowX}px ${shadowY}px 40px rgba(0, 0, 0, 0.45), 
                                    0 0 35px ${activeConfig.particleColor.replace(/[\d.]+\)$/, "0.15")},
                                    inset 0 1px 2px rgba(255, 255, 255, 0.08)`;
        };

        const resetTilt = () => {
            card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
            card.style.boxShadow = `0 20px 50px rgba(0,0,0,0.4), 
                                    0 0 40px rgba(0,0,0,0.1),
                                    inset 0 1px 2px rgba(255, 255, 255, 0.08)`;
        };

        cardContainer.addEventListener("mousemove", handleTilt);
        cardContainer.addEventListener("mouseleave", resetTilt);
    }

    /* ==========================================================================
       4. CYBERSPACE LOADING OVERLAY (REAL FORM INTERCEPTION)
       ========================================================================== */
    if (form) {
        form.addEventListener("submit", (e) => {
            // Unhide loading overlay
            loadingOverlay.classList.add("active");
            
            // Start cyberpunk terminal logging animations
            const logLines = [
                // Phase 1: Connections
                [
                    "> COGNITIVE SYNAPSE INITIALIZED.",
                    "> ESTABLISHING YOUTUBE STREAM PARSER...",
                    "> HANDSHAKE VERIFIED: STREAM ACQUIRED."
                ],
                // Phase 2: Transcribing / Extracting
                [
                    "> DECRYPTING AUDIO WAVELET BLOCKS...",
                    "> FEEDING PARSED SYNAPSE TO COGNITIVE MODEL...",
                    "> RUNNING SEMANTIC CHUNK ANALYSIS..."
                ],
                // Phase 3: Writing / Formatting
                [
                    "> RETRIEVING RESPONSE NODES...",
                    "> COOKING UP PURE SUMMARY GOLD...",
                    "> FINALIZING PARALLEL SUMMARIZATION..."
                ]
            ];

            const line1 = document.getElementById("terminal-line-1");
            const line2 = document.getElementById("terminal-line-2");
            const line3 = document.getElementById("terminal-line-3");

            let currentPhase = 0;

            function cycleLogs() {
                if (currentPhase < logLines.length) {
                    const phaseLines = logLines[currentPhase];
                    
                    line1.textContent = phaseLines[0];
                    line1.className = "terminal-line";
                    
                    setTimeout(() => {
                        line2.textContent = phaseLines[1];
                        line2.className = "terminal-line cyan-log";
                    }, 800);

                    setTimeout(() => {
                        line3.textContent = phaseLines[2];
                        line3.className = "terminal-line yellow-log";
                    }, 1600);

                    currentPhase++;
                    setTimeout(cycleLogs, 3500);
                }
            }

            cycleLogs();
        });
    }

    /* ==========================================================================
       5. MARKDOWN-TO-HTML SUMMARY PARSER
       ========================================================================== */
    if (summaryBox) {
        let text = summaryBox.innerHTML.trim();

        // Safe Custom Markdown Parser for Awwwards Aesthetic
        // 1. Headers: '## Heading' -> '<h2>Heading</h2>'
        text = text.replace(/^##\s+(.+)$/gm, "<h2>$1</h2>");
        text = text.replace(/^###\s+(.+)$/gm, "<h3>$1</h3>");
        
        // 2. Bold text: '**text**' -> '<strong>text</strong>'
        text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        
        // 3. Bullet Lists
        // Split text by line, trace bullet points and group them in <ul>
        const lines = text.split("\n");
        let formattedHtml = "";
        let insideList = false;

        for (let line of lines) {
            const cleaned = line.trim();
            if (cleaned.startsWith("- ") || cleaned.startsWith("* ")) {
                if (!insideList) {
                    formattedHtml += "<ul>";
                    insideList = true;
                }
                const content = cleaned.replace(/^[-*]\s+/, "");
                formattedHtml += `<li>${content}</li>`;
            } else {
                if (insideList) {
                    formattedHtml += "</ul>";
                    insideList = false;
                }
                
                // Don't wrap headings in paragraphs
                if (cleaned.startsWith("<h2") || cleaned.startsWith("<h3")) {
                    formattedHtml += cleaned;
                } else if (cleaned !== "") {
                    formattedHtml += `<p>${cleaned}</p>`;
                }
            }
        }
        if (insideList) {
            formattedHtml += "</ul>";
        }

        summaryBox.innerHTML = formattedHtml;
    }

    /* ==========================================================================
       6. COPY SUMMARY TO CLIPBOARD
       ========================================================================== */
    if (copyBtn && summaryBox) {
        copyBtn.addEventListener("click", () => {
            // Get text content without HTML tags
            const textToCopy = summaryBox.innerText;
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = `<span class="copy-icon">✓</span> Copied!`;
                copyBtn.classList.add("copied");

                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                    copyBtn.classList.remove("copied");
                }, 2000);
            }).catch(err => {
                console.error("Failed to copy summary: ", err);
            });
        });
    }
});
