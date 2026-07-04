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

    // Upgraded Features Elements
    const soundToggle = document.getElementById("sound-toggle");
    const soundIcon = document.getElementById("sound-icon");
    const urlInput = document.getElementById("youtube-url");
    const videoPreview = document.getElementById("video-preview");
    const previewImg = document.getElementById("preview-img");
    const previewId = document.getElementById("preview-id");
    const previewTitle = document.getElementById("preview-title");
    
    const sliderSpeed = document.getElementById("particle-speed-range");
    const nodeCountDisplay = document.getElementById("particle-count-display");
    const telTemp = document.getElementById("tel-temp");
    const telPing = document.getElementById("tel-ping");
    const telThreads = document.getElementById("tel-threads");

    // Ultimate HUD & History Drawer Elements
    const historyToggle = document.getElementById("history-toggle");
    const historyDrawer = document.getElementById("history-drawer");
    const drawerClose = document.getElementById("drawer-close");
    const historyList = document.getElementById("history-list");
    const clearHistoryBtn = document.getElementById("clear-history-btn");
    const downloadBtn = document.getElementById("download-summary-btn");
    const errorCard = document.getElementById("error-card");

    // Luxury Cursor Elements
    const cursorRing = document.getElementById("custom-cursor");
    const cursorDot = document.getElementById("cursor-dot");

    // Initialize Active Class on Body
    if (select) {
        body.className = select.value;
    }

    /* ==========================================================================
       1. WEB AUDIO API SYNTHESIZER (7-STAR LUXURY CHIMES)
       ========================================================================== */
    let audioCtx = null;
    let soundMuted = true; // Default muted to comply with browser autoplay blocks

    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function playSynthSound(type) {
        if (soundMuted) return;
        
        try {
            initAudio();
            const now = audioCtx.currentTime;

            if (type === "click") {
                // Luxury organic click (Wood-like tactile transient)
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                const filter = audioCtx.createBiquadFilter();
                
                osc.type = "sine";
                osc.frequency.setValueAtTime(1200, now);
                osc.frequency.exponentialRampToValueAtTime(100, now + 0.02);
                
                filter.type = "bandpass";
                filter.frequency.setValueAtTime(800, now);
                filter.Q.setValueAtTime(3, now);

                gain.gain.setValueAtTime(0.015, now);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);
                
                osc.connect(filter);
                filter.connect(gain);
                gain.connect(audioCtx.destination);
                
                osc.start(now);
                osc.stop(now + 0.03);

            } else if (type === "sweep") {
                // Organic high-end deep-space sweep
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                const filter = audioCtx.createBiquadFilter();
                
                osc.type = "sine";
                osc.frequency.setValueAtTime(80, now);
                osc.frequency.exponentialRampToValueAtTime(320, now + 0.5);
                
                filter.type = "lowpass";
                filter.frequency.setValueAtTime(280, now);
                filter.frequency.exponentialRampToValueAtTime(800, now + 0.5);

                gain.gain.setValueAtTime(0.04, now);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
                
                osc.connect(filter);
                filter.connect(gain);
                gain.connect(audioCtx.destination);
                
                osc.start(now);
                osc.stop(now + 0.55);

            } else if (type === "success") {
                // Luxury metallic FM chime (metallic bell vibe)
                const carrier = audioCtx.createOscillator();
                const modulator = audioCtx.createOscillator();
                const modGain = audioCtx.createGain();
                const mainGain = audioCtx.createGain();

                carrier.type = "sine";
                carrier.frequency.setValueAtTime(587.33, now); // D5

                modulator.type = "sine";
                modulator.frequency.setValueAtTime(880, now); // A5

                modGain.gain.setValueAtTime(300, now);
                modGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

                mainGain.gain.setValueAtTime(0.025, now);
                mainGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

                modulator.connect(modGain);
                modGain.connect(carrier.frequency);
                carrier.connect(mainGain);
                mainGain.connect(audioCtx.destination);

                modulator.start(now);
                carrier.start(now);

                modulator.stop(now + 0.6);
                carrier.stop(now + 0.6);

            } else if (type === "error") {
                // Low digital alarm buzz
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                
                osc.type = "sawtooth";
                osc.frequency.setValueAtTime(110, now);
                osc.frequency.linearRampToValueAtTime(80, now + 0.3);
                
                gain.gain.setValueAtTime(0.06, now);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
                
                const filter = audioCtx.createBiquadFilter();
                filter.type = "lowpass";
                filter.frequency.setValueAtTime(300, now);

                osc.connect(filter);
                filter.connect(gain);
                gain.connect(audioCtx.destination);
                
                osc.start(now);
                osc.stop(now + 0.35);
            }
        } catch (e) {
            console.warn("AudioContext block: ", e);
        }
    }

    if (soundToggle) {
        soundToggle.addEventListener("click", () => {
            soundMuted = !soundMuted;
            if (!soundMuted) {
                initAudio();
                soundToggle.classList.add("sound-on");
                soundIcon.textContent = "🔊";
                setTimeout(() => playSynthSound("success"), 50);
            } else {
                soundToggle.classList.remove("sound-on");
                soundIcon.textContent = "🔇";
            }
        });
    }

    const interactiveElements = document.querySelectorAll('.cyber-btn, .cyber-select, .cyber-input, .copy-btn, .sound-toggle-btn, .history-toggle-btn, .clear-history-btn, .drawer-close-btn');
    interactiveElements.forEach(el => {
        el.addEventListener("mouseenter", () => playSynthSound("click"));
        el.addEventListener("focus", () => playSynthSound("click"));
    });

    if (errorCard) {
        setTimeout(() => {
            soundMuted = false;
            initAudio();
            playSynthSound("error");
            soundMuted = true;
        }, 600);
    }

    /* ==========================================================================
       2. LIQUID MAGNETIC CURSOR ENGINE (DESKTOP ONLY)
       ========================================================================== */
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let dotX = 0, dotY = 0;

    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Custom animation physics loop for custom cursor follower
    function animateCursor() {
        // Smooth interpolation physics (lerping)
        dotX += (mouseX - dotX) * 0.35;
        dotY += (mouseY - dotY) * 0.35;

        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;

        if (cursorDot) {
            cursorDot.style.left = `${dotX}px`;
            cursorDot.style.top = `${dotY}px`;
        }

        if (cursorRing) {
            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;
        }

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Attach magnetic hover properties to interactive items
    function attachCursorHovers() {
        const hoverTargets = document.querySelectorAll('.cyber-btn, .cyber-select, .cyber-input, .copy-btn, .sound-toggle-btn, .history-toggle-btn, .clear-history-btn, .drawer-close-btn, .history-item-card');
        hoverTargets.forEach(target => {
            target.addEventListener("mouseenter", () => {
                cursorRing.classList.add("cursor-hover");
            });
            target.addEventListener("mouseleave", () => {
                cursorRing.classList.remove("cursor-hover");
            });
        });
    }
    attachCursorHovers();

    window.addEventListener("mousedown", () => {
        if (cursorRing) cursorRing.classList.add("cursor-active");
    });
    window.addEventListener("mouseup", () => {
        if (cursorRing) cursorRing.classList.remove("cursor-active");
    });

    /* ==========================================================================
       3. CANVAS INTERACTIVE STAR WARP SYSTEM (SPACE JUMP)
       ========================================================================== */
    const canvas = document.getElementById("bg-canvas");
    const ctx = canvas.getContext("2d");

    let stars = [];
    let canvasMouse = { x: null, y: null };
    
    let warpCenterX = window.innerWidth / 2;
    let warpCenterY = window.innerHeight / 2;
    let targetWarpCenterX = warpCenterX;
    let targetWarpCenterY = warpCenterY;

    // Theme Star Settings
    const themeConfigs = {
        general: {
            starColor: "rgba(243, 244, 246, 0.7)", // Silver stars
            glowColor: "#f3f4f6",
            baseSpeed: 5,
            density: 220,
            depthMax: 1000
        },
        study: {
            starColor: "rgba(59, 130, 246, 0.65)", // Blue stars
            glowColor: "#3b82f6",
            baseSpeed: 1.5,
            density: 300,
            depthMax: 1200
        },
        music: {
            starColor: "rgba(223, 177, 91, 0.75)", // Amber Gold stars
            glowColor: "#dfb15b",
            baseSpeed: 9,
            density: 180,
            depthMax: 800
        }
    };

    let activeConfig = themeConfigs[select?.value || "general"];

    let userSpeedMultiplier = 1;
    if (sliderSpeed) {
        sliderSpeed.addEventListener("input", (e) => {
            userSpeedMultiplier = e.target.value / 10;
            playSynthSound("click");
        });
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        targetWarpCenterX = canvas.width / 2;
        targetWarpCenterY = canvas.height / 2;
        warpCenterX = targetWarpCenterX;
        warpCenterY = targetWarpCenterY;
        initStars();
    }

    class Star {
        constructor() {
            this.reset(true);
        }

        reset(isInitial = false) {
            this.x = (Math.random() - 0.5) * canvas.width * 2;
            this.y = (Math.random() - 0.5) * canvas.height * 2;
            this.z = isInitial ? Math.random() * activeConfig.depthMax : activeConfig.depthMax;
            this.size = Math.random() * 1.2 + 0.4;
        }

        update(speed) {
            this.z -= speed;
            if (this.z <= 0) {
                this.reset(false);
            }
        }

        draw(speed) {
            const k = 400;
            const px = (this.x / this.z) * k + warpCenterX;
            const py = (this.y / this.z) * k + warpCenterY;

            if (px < 0 || px > canvas.width || py < 0 || py > canvas.height) return;

            const prevZ = this.z + speed;
            const pXPrev = (this.x / prevZ) * k + warpCenterX;
            const pYPrev = (this.y / prevZ) * k + warpCenterY;

            const alpha = (1 - (this.z / activeConfig.depthMax)) * 0.9;
            ctx.strokeStyle = activeConfig.starColor.replace(/[\d.]+\)$/, `${alpha})`);
            ctx.lineWidth = this.size * (1 - (this.z / activeConfig.depthMax)) * 2.5;
            
            ctx.beginPath();
            ctx.moveTo(pXPrev, pYPrev);
            ctx.lineTo(px, py);
            ctx.stroke();

            // Metallic glow core for stars in Music theme
            if (select?.value === "music" && this.z < activeConfig.depthMax * 0.2) {
                ctx.fillStyle = "#fff";
                ctx.beginPath();
                ctx.arc(px, py, this.size * 0.7, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    function initStars() {
        stars = [];
        const count = activeConfig.density;
        if (nodeCountDisplay) {
            nodeCountDisplay.textContent = count;
        }
        for (let i = 0; i < count; i++) {
            stars.push(new Star());
        }
    }

    let audioWavePhase = 0;
    function drawMusicVisualizer() {
        if (select?.value !== "music") return;
        
        audioWavePhase += 0.08;
        ctx.fillStyle = "rgba(223, 177, 91, 0.02)";
        ctx.strokeStyle = "rgba(223, 177, 91, 0.08)";
        ctx.lineWidth = 1.5;
        
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        
        for (let x = 0; x < canvas.width; x += 20) {
            let y = canvas.height - 40 - Math.sin(x * 0.005 + audioWavePhase) * 15 - Math.cos(x * 0.015 - audioWavePhase) * 8;
            ctx.lineTo(x, y);
        }
        
        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    function animateStars() {
        ctx.fillStyle = activeConfig === themeConfigs.music ? "rgba(7, 5, 3, 0.22)" : (activeConfig === themeConfigs.study ? "rgba(3, 4, 12, 0.22)" : "rgba(5, 5, 8, 0.22)");
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        warpCenterX += (targetWarpCenterX - warpCenterX) * 0.08;
        warpCenterY += (targetWarpCenterY - warpCenterY) * 0.08;

        const currentSpeed = activeConfig.baseSpeed * userSpeedMultiplier;

        stars.forEach(s => {
            s.update(currentSpeed);
            s.draw(currentSpeed);
        });

        drawMusicVisualizer();
        requestAnimationFrame(animateStars);
    }

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", (e) => {
        const mouseOffsetFactor = 0.22;
        const deltaX = e.clientX - canvas.width / 2;
        const deltaY = e.clientY - canvas.height / 2;
        
        targetWarpCenterX = canvas.width / 2 + deltaX * mouseOffsetFactor;
        targetWarpCenterY = canvas.height / 2 + deltaY * mouseOffsetFactor;
    });
    window.addEventListener("mouseleave", () => {
        targetWarpCenterX = canvas.width / 2;
        targetWarpCenterY = canvas.height / 2;
    });

    resizeCanvas();
    animateStars();

    /* ==========================================================================
       3. DYNAMIC THEME SWITCHER
       ========================================================================== */
    if (select) {
        select.addEventListener("change", (e) => {
            const theme = e.target.value;
            body.className = theme;
            document.documentElement.setAttribute("data-theme", theme);
            
            activeConfig = themeConfigs[theme];
            initStars();
            
            playSynthSound("success");
        });
    }

    /* ==========================================================================
       4. YOUTUBE URL PREVIEW DETECTOR
       ========================================================================== */
    function getYoutubeId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    if (urlInput) {
        urlInput.addEventListener("input", (e) => {
            const url = e.target.value.trim();
            const id = getYoutubeId(url);

            if (id) {
                previewImg.src = `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
                previewId.textContent = `STREAMING ID: ${id}`;
                previewTitle.textContent = "DECODING RESOURCE FEED";
                
                videoPreview.classList.remove("hidden");
                playSynthSound("success");
                
                // Re-bind hover logic for preview cards
                setTimeout(attachCursorHovers, 100);
            } else {
                videoPreview.classList.add("hidden");
            }
        });
    }

    /* ==========================================================================
       5. 3D CARD TILT EFFECT
       ========================================================================== */
    if (card && cardContainer) {
        const handleTilt = (e) => {
            const rect = cardContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((centerY - y) / centerY) * 8; 
            const rotateY = ((x - centerX) / centerX) * 8;
            
            card.style.transform = `perspective(1500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            
            const shadowX = -rotateY * 2.5;
            const shadowY = rotateX * 2.5;
            card.style.boxShadow = `${shadowX}px ${shadowY}px 50px rgba(0, 0, 0, 0.45), 
                                    0 0 35px ${activeConfig.starColor.replace(/[\d.]+\)$/, "0.1")},
                                    inset 0 1px 2px rgba(255, 255, 255, 0.08)`;
        };

        const resetTilt = () => {
            card.style.transform = "perspective(1500px) rotateX(0deg) rotateY(0deg)";
            card.style.boxShadow = `0 30px 60px rgba(0,0,0,0.4), 
                                    inset 0 1px 2px rgba(255, 255, 255, 0.05)`;
        };

        cardContainer.addEventListener("mousemove", handleTilt);
        cardContainer.addEventListener("mouseleave", resetTilt);
    }

    /* ==========================================================================
       6. CYBERSPACE LOADING OVERLAY (WITH SFX)
       ========================================================================== */
    if (form) {
        form.addEventListener("submit", (e) => {
            playSynthSound("sweep");
            loadingOverlay.classList.add("active");
            
            const logLines = [
                [
                    "> COGNITIVE SYNAPSE INITIALIZED.",
                    "> ESTABLISHING YOUTUBE STREAM PARSER...",
                    "> HANDSHAKE VERIFIED: STREAM ACQUIRED."
                ],
                [
                    "> DECRYPTING AUDIO WAVELET BLOCKS...",
                    "> FEEDING PARSED SYNAPSE TO COGNITIVE MODEL...",
                    "> RUNNING SEMANTIC CHUNK ANALYSIS..."
                ],
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
                        playSynthSound("click");
                    }, 800);

                    setTimeout(() => {
                        line3.textContent = phaseLines[2];
                        line3.className = "terminal-line yellow-log";
                        playSynthSound("click");
                    }, 1600);

                    currentPhase++;
                    setTimeout(cycleLogs, 3500);
                }
            }

            cycleLogs();
        });
    }

    /* ==========================================================================
       7. MARKDOWN-TO-HTML PARSER & HIGH-TECH SCRAMBLE DECRYPT REVEAL
       ========================================================================== */
    function decryptText(element) {
        const textNodes = [];
        
        function findTextNodes(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                if (node.nodeValue.trim().length > 0) {
                    textNodes.push(node);
                }
            } else {
                node.childNodes.forEach(findTextNodes);
            }
        }
        findTextNodes(element);
        
        textNodes.forEach(node => {
            const originalText = node.nodeValue;
            const length = originalText.length;
            let currentIteration = 0;
            const maxIterations = 14;
            const chars = "01$#@!%^&*()<>?/[]{}XYZ";
            
            const interval = setInterval(() => {
                let scrambled = "";
                for (let i = 0; i < length; i++) {
                    if (originalText[i] === " " || originalText[i] === "\n") {
                        scrambled += originalText[i];
                        continue;
                    }
                    
                    if (i < (currentIteration / maxIterations) * length) {
                        scrambled += originalText[i];
                    } else {
                        scrambled += chars[Math.floor(Math.random() * chars.length)];
                    }
                }
                
                node.nodeValue = scrambled;
                
                if (currentIteration >= maxIterations) {
                    node.nodeValue = originalText;
                    clearInterval(interval);
                }
                currentIteration++;
            }, 30);
        });
    }

    function parseAndFormatMarkdown(box) {
        let text = box.innerHTML.trim();

        text = text.replace(/^##\s+(.+)$/gm, "<h2>$1</h2>");
        text = text.replace(/^###\s+(.+)$/gm, "<h3>$1</h3>");
        text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        
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

        box.innerHTML = formattedHtml;
    }

    if (summaryBox) {
        setTimeout(() => playSynthSound("success"), 500);
        parseAndFormatMarkdown(summaryBox);
        decryptText(summaryBox);
    }

    /* ==========================================================================
       8. PERSISTENT HISTORY DRAWER & CACHE MANAGER (LOCAL STORAGE)
       ========================================================================== */
    const cacheKey = "yt_summarizer_history";

    function getHistoryCache() {
        const data = localStorage.getItem(cacheKey);
        return data ? JSON.parse(data) : [];
    }

    function saveHistoryCache(cache) {
        localStorage.setItem(cacheKey, JSON.stringify(cache));
    }

    function renderHistory() {
        const cache = getHistoryCache();
        historyList.innerHTML = "";

        if (cache.length === 0) {
            historyList.innerHTML = '<div class="history-empty">Registry is vacant. Initiate summary to index a node.</div>';
            return;
        }

        cache.forEach(item => {
            const card = document.createElement("div");
            card.className = "history-item-card";
            card.innerHTML = `
                <img class="history-thumb" src="${item.thumbnail}" alt="Thumb">
                <div class="history-details">
                    <h4 class="history-item-title">${item.title}</h4>
                    <span class="history-item-category cat-${item.category}">${item.category}</span>
                </div>
            `;

            card.addEventListener("click", () => {
                playSynthSound("success");
                
                if (urlInput) urlInput.value = `https://www.youtube.com/watch?v=${item.id}`;
                if (select) {
                    select.value = item.category;
                    body.className = item.category;
                    document.documentElement.setAttribute("data-theme", item.category);
                    activeConfig = themeConfigs[item.category];
                    initStars();
                }

                previewImg.src = item.thumbnail;
                previewId.textContent = `STREAMING ID: ${item.id}`;
                previewTitle.textContent = "DECODING RESOURCE FEED";
                videoPreview.classList.remove("hidden");

                let summaryContainer = document.querySelector(".summary-container");
                if (!summaryContainer) {
                    const wrap = document.createElement("div");
                    wrap.className = "summary-container fade-in";
                    wrap.innerHTML = `
                        <div class="summary-card" id="summary-card">
                            <div class="summary-header">
                                <div class="summary-status">
                                    <span class="status-dot pulsing"></span>
                                    <span class="status-text">AI Synthesis Resolved</span>
                                </div>
                                <div class="summary-actions">
                                    <button class="copy-btn hover-magnetic" id="copy-summary-btn">
                                        <span class="copy-icon">📋</span> Copy
                                    </button>
                                    <button class="copy-btn hover-magnetic" id="download-summary-btn">
                                        <span class="copy-icon">💾</span> Download
                                    </button>
                                </div>
                            </div>
                            <div class="summary-box" id="summary-content"></div>
                        </div>
                    `;
                    document.querySelector(".container").appendChild(wrap);
                    
                    const newCopy = document.getElementById("copy-summary-btn");
                    const newDownload = document.getElementById("download-summary-btn");
                    const newContent = document.getElementById("summary-content");

                    newCopy.addEventListener("click", () => triggerCopy(newContent, newCopy));
                    newDownload.addEventListener("click", () => triggerDownload(newContent));
                }

                const activeSummaryContent = document.getElementById("summary-content");
                activeSummaryContent.innerHTML = item.summary;
                parseAndFormatMarkdown(activeSummaryContent);
                decryptText(activeSummaryContent);

                document.getElementById("summary-card").scrollIntoView({ behavior: "smooth" });
                historyDrawer.classList.remove("drawer-open");
                
                // Rebind hovers to newly created copy/download buttons
                setTimeout(attachCursorHovers, 100);
            });

            historyList.appendChild(card);
        });

        // Rebind cursor listeners for newly created list items
        setTimeout(attachCursorHovers, 100);
    }

    if (summaryBox && urlInput) {
        const id = getYoutubeId(urlInput.value);
        if (id) {
            const rawSummary = summaryBox.innerText;
            const activeCategory = select ? select.value : "general";
            const thumbnail = `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
            const title = `YouTube Stream (${id})`;

            const cache = getHistoryCache();
            const filtered = cache.filter(item => item.id !== id);
            
            filtered.unshift({
                id,
                title,
                category: activeCategory,
                summary: rawSummary,
                thumbnail,
                timestamp: Date.now()
            });

            if (filtered.length > 15) filtered.pop();
            saveHistoryCache(filtered);
        }
    }

    if (historyToggle) {
        historyToggle.addEventListener("click", () => {
            playSynthSound("success");
            renderHistory();
            historyDrawer.classList.add("drawer-open");
        });
    }

    if (drawerClose) {
        drawerClose.addEventListener("click", () => {
            playSynthSound("click");
            historyDrawer.classList.remove("drawer-open");
        });
    }

    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener("click", () => {
            playSynthSound("sweep");
            localStorage.removeItem(cacheKey);
            renderHistory();
        });
    }

    /* ==========================================================================
       9. DOWNLOAD NOTES BUTTON (MARKDOWN EXPORTER)
       ========================================================================== */
    function triggerDownload(contentBox) {
        playSynthSound("success");
        const rawText = contentBox.innerText;
        const videoURL = urlInput ? urlInput.value.trim() : "YouTube Resource";
        
        const markdown = `# Video Summary Notes\n\n**Source URL:** ${videoURL}\n\n## Summary\n\n${rawText}\n\n---\n*Notes generated by ytsummarizer.ai*`;
        
        const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        
        link.href = url;
        link.setAttribute("download", `ytsummarizer_notes.md`);
        document.body.appendChild(link);
        link.click();
        
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    if (downloadBtn && summaryBox) {
        downloadBtn.addEventListener("click", () => triggerDownload(summaryBox));
    }

    /* ==========================================================================
       10. COPY SUMMARY TO CLIPBOARD
       ========================================================================== */
    function triggerCopy(contentBox, button) {
        const textToCopy = contentBox.innerText;
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            playSynthSound("success");
            const originalText = button.innerHTML;
            button.innerHTML = `<span class="copy-icon">✓</span> Copied!`;
            button.classList.add("copied");

            setTimeout(() => {
                button.innerHTML = originalText;
                button.classList.remove("copied");
            }, 2000);
        }).catch(err => {
            console.error("Failed to copy summary: ", err);
        });
    }

    if (copyBtn && summaryBox) {
        copyBtn.addEventListener("click", () => triggerCopy(summaryBox, copyBtn));
    }

    /* ==========================================================================
       11. LIVE TELEMETRY DECORATION FLUCTUATION
       ========================================================================== */
    function updateTelemetry() {
        if (telTemp) {
            const tempVal = Math.floor(Math.random() * 5) + 36; // 36 to 40
            telTemp.textContent = `${tempVal}°C`;
        }
        if (telPing) {
            const pingVal = Math.floor(Math.random() * 8) + 8; // 8ms to 16ms
            telPing.textContent = `${pingVal}ms`;
        }
        if (telThreads) {
            const threadsVal = Math.floor(Math.random() * 4) + 14;
            telThreads.textContent = `${threadsVal} ACTIVE`;
        }
        
        const telRatio = document.getElementById("dia-ratio");
        if (telRatio) {
            const ratioVal = (99 + Math.random() * 0.99).toFixed(2);
            telRatio.textContent = `${ratioVal}%`;
        }

        setTimeout(updateTelemetry, Math.random() * 3000 + 2000);
    }
    updateTelemetry();
});
