function setupExistingWindows() {
    // Setup media player windows
    setupMediaPlayerWindow('video');
    setupMediaPlayerWindow('Videos');
    
    // Regular window controls
    document.querySelectorAll('.window-btn.close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const window = e.target.closest('.window');
            if (window) {
                const appName = window.id.replace('window-', '');
                closeWindow(appName);
            }
        });
    });

    document.querySelectorAll('.window-btn.minimize').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const window = e.target.closest('.window');
            if (window) {
                const appName = window.id.replace('window-', '');
                minimizeWindow(appName);
            }
        });
    });

    // Make windows draggable and resizable (desktop only)
    document.querySelectorAll('.window, .media-player-window').forEach(window => {
        if (!window.IS_MOBILE_DEVICE) {
            makeWindowDraggable(window);
            makeWindowResizable(window);
        }
    });
}

function setupMediaPlayerWindow(playerType) {
    const window = document.getElementById(`window-${playerType}`);
    const taskbarBtn = document.getElementById(`taskbar-${playerType}`);

    if (!window) return;

    // Use the correct button selectors based on window type
    let closeBtn, minimizeBtn;
    
    closeBtn = window.querySelector('.media-btn.close');
    minimizeBtn = window.querySelector('.media-btn.minimize');

    if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        // Pause the appropriate video player before closing
        if (playerType === 'video' && mainPlayer && mainPlayer.pauseVideo) {
            mainPlayer.pauseVideo();
        } else if (playerType === 'Videos' && VideosPlayer && VideosPlayer.pauseVideo) {
            VideosPlayer.pauseVideo();
        }
        
        window.style.display = 'none';
        if (taskbarBtn && taskbarBtn.parentNode) {
            taskbarBtn.remove();
        }
    });
}

    if (minimizeBtn) {
        minimizeBtn.addEventListener('click', () => {
            window.style.display = 'none';
            if (taskbarBtn) taskbarBtn.classList.remove('active');
        });
    }

    if (taskbarBtn) {
        taskbarBtn.addEventListener('click', () => {
            if (window.style.display === 'none') {
                window.style.display = 'block';
                window.style.zIndex = ++zIndex;
                taskbarBtn.classList.add('active');
            } else {
                window.style.zIndex = ++zIndex;
            }
        });
    }
}

// Window management
let zIndex = 1000;
const taskbarApps = document.getElementById('taskbarApps');

function openWindow(appName) {
    console.log('Opening window for:', appName);
    const windowId = `window-${appName}`;
    let window = document.getElementById(windowId);
    
    if (!window) {
        createWindow(appName);
        window = document.getElementById(windowId);
    }
    
    if (window) {
        // FIXED: Mobile-specific positioning and sizing
        if (window.IS_MOBILE_DEVICE) {
            // Mobile: centered positioning that covers icons
            window.style.position = 'fixed';
            window.style.top = '10px';
            window.style.left = '10px';
            window.style.width = 'calc(100vw - 20px)';
            window.style.height = 'calc(100vh - 64px)';
            window.style.maxWidth = 'calc(100vw - 20px)';
            window.style.maxHeight = 'calc(100vh - 64px)';
            window.style.minWidth = 'unset';
            window.style.minHeight = 'unset';
            window.style.transform = 'none';
        } else {
            // Desktop: Random positioning and sizing (except video)
            if (appName !== 'video') {
                let randomWidth, randomHeight;
                
                // Personal bio windows get tall and lean format
                if (['Swampfoot', 'Owen-Givens', 'Mannisupreme', 'Jordan-walker'].includes(appName)) {
                    randomWidth = Math.floor(Math.random() * 150) + 450; // 450-600px (narrower)
                    randomHeight = Math.floor(Math.random() * 200) + 650; // 650-850px (taller)
                } else {
                    // Other windows use regular random sizing
                    randomWidth = Math.floor(Math.random() * 400) + 400; // 400-800px
                    randomHeight = Math.floor(Math.random() * 300) + 300; // 300-600px
                }
                
                const randomX = Math.floor(Math.random() * (window.innerWidth - randomWidth - 50));
                const randomY = Math.floor(Math.random() * (window.innerHeight - randomHeight - 100));
                
                window.style.width = randomWidth + 'px';
                window.style.height = randomHeight + 'px';
                window.style.left = randomX + 'px';
                window.style.top = randomY + 'px';
            }
        }
        
        window.style.display = 'block';
        window.style.zIndex = ++zIndex;
        addToTaskbar(appName);
        
        console.log('Window opened successfully for:', appName);
    } else {
        console.error('Failed to create/find window for:', appName);
    }
    
    const startMenu = document.getElementById('startMenu');
    const startBtn = document.getElementById('startBtn');
    if (startMenu) startMenu.style.display = 'none';
    if (startBtn) startBtn.classList.remove('active');
}

function addToTaskbar(appName) {
        // Skip adding taskbar apps on mobile
    if (window.IS_MOBILE_DEVICE) return;
    
    if (document.getElementById(`taskbar-${appName}`)) return;
    if (document.getElementById(`taskbar-${appName}`)) return;
    
    const taskbarBtn = document.createElement('button');
    taskbarBtn.className = 'taskbar-app';
    taskbarBtn.id = `taskbar-${appName}`;
    taskbarBtn.textContent = appName.charAt(0).toUpperCase() + appName.slice(1).replace('-', ' ');
    taskbarBtn.addEventListener('click', () => {
        const window = document.getElementById(`window-${appName}`);
        if (window.style.display === 'none') {
            window.style.display = 'block';
            window.style.zIndex = ++zIndex;
            taskbarBtn.classList.add('active');
        } else {
            window.style.zIndex = ++zIndex;
        }
    });
    
    if (taskbarApps) {
        taskbarApps.appendChild(taskbarBtn);
        taskbarBtn.classList.add('active');
    }
}

function closeWindow(appName) {
    const window = document.getElementById(`window-${appName}`);
    const taskbarBtn = document.getElementById(`taskbar-${appName}`);
    
    if (window) {
        window.style.display = 'none';
        // Special handling for Videos window
        if (appName === 'Videos') {
            window.classList.add('hidden-window');
        }
    }
    if (taskbarBtn) taskbarBtn.remove();
}

function minimizeWindow(appName) {
    const window = document.getElementById(`window-${appName}`);
    const taskbarBtn = document.getElementById(`taskbar-${appName}`);
    
    if (window) window.style.display = 'none';
    if (taskbarBtn) taskbarBtn.classList.remove('active');
}

function createWindow(appName) {
    if (document.getElementById(`window-${appName}`)) return;
    
    console.log('Creating window for:', appName);
    
    const windowDiv = document.createElement('div');
    windowDiv.className = 'window draggable resizable';
    windowDiv.id = `window-${appName}`;
    
    const icons = {
        'Videos': '📹', 'forum': '💬', 'store': '🛒', 'tracks': '💿', 
        'lounge': '🎵', 'contact': '📞', 'about': 'ℹ️',
        'Swampfoot': '👑', 'Owen-Givens': '🎸', 'Mannisupreme': '🔥', 'Jordan-walker': '🎤'
    };
    const icon = icons[appName] || '📁';
    
    const displayName = appName.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    // Check if this app should load a website in iframe
    if (WEBSITE_URLS[appName] && !EXTERNAL_APPS.includes(appName) && appName !== 'Videos') {
        windowDiv.innerHTML = `
            <div class="window-header">
                <div class="window-title">${icon} ${displayName}</div>
                <div class="window-controls">
                    <button class="window-btn minimize">_</button>
                    <button class="window-btn maximize">□</button>
                    <button class="window-btn close">×</button>
                </div>
            </div>
            <div class="window-content">
                <iframe class="web-iframe" src="${WEBSITE_URLS[appName]}" title="${appName} Website" frameborder="0" allowfullscreen></iframe>
            </div>
        `;
    } else if (appName === 'lounge') {
    windowDiv.className = 'media-player-window draggable resizable';
    windowDiv.innerHTML = `
        <div class="media-player-header">
            <div class="media-player-title">🎵 Music Lounge - Live Streams</div>
            <div class="media-player-controls">
                <button class="media-btn minimize">_</button>
                <button class="media-btn maximize">□</button>
                <button class="media-btn close">×</button>
            </div>
        </div>
        <div class="media-player-content">
            <!-- Toggle Buttons -->
            <div style="display: flex; gap: 5px; padding: 8px; background: #c0c0c0; border-bottom: 2px solid #808080;">
                <button id="showYouTubeBtn" onclick="switchLoungeEmbed('youtube')" style="flex: 1; padding: 8px; background: #ff0000; color: white; border: 2px outset #ff0000; cursor: pointer; font-weight: bold; font-size: 11px;">
                    ▶️ YouTube View
                </button>
                <button id="showTwitchBtn" onclick="switchLoungeEmbed('twitch')" style="flex: 1; padding: 8px; background: #808080; color: white; border: 2px inset #808080; cursor: pointer; font-weight: bold; font-size: 11px;">
                    📺 Twitch View
                </button>
            </div>
            
            <!-- YouTube Embed (visible by default) -->
            <div id="loungeYouTubeEmbed" class="video-display">
                <div id="loungeVideoPlayer" class="media-iframe"></div>
            </div>
            
            <!-- Twitch Embed (hidden by default) -->
            <div id="loungeTwitchEmbed" class="video-display" style="display: none;">
                <iframe 
                    id="loungeTwitchPlayer"
                    src="https://player.twitch.tv/?channel=uselessradio&parent=uselessradio.com&parent=www.uselessradio.com&parent=127.0.0.1&parent=localhost&autoplay=false&muted=true"
                    class="media-iframe"
                    style="width: 100%; height: 100%; border: none;"
                    allowfullscreen>
                </iframe>
            </div>
            
            <div class="media-controls">
                <div class="control-buttons">
                    <button class="control-btn" id="loungePlayPauseBtn">▶</button>
                    <button class="control-btn" id="loungeStopBtn">⏹</button>
                </div>
                <div class="progress-section">
                    <span class="time-display">--:--</span>
                    <div class="progress-bar-container">
                        <div class="progress-bar"></div>
                        <input type="range" class="progress-slider" min="0" max="100" value="0" disabled>
                    </div>
                    <span class="time-display">--:--</span>
                </div>
                <div class="volume-section">
                    <button class="control-btn" id="loungeMuteBtn">🔇</button>
                </div>
            </div>
            <div class="media-info" style="flex-direction: column; align-items: stretch; padding: 12px; gap: 10px; height: auto; border-top: 2px solid #c0c0c0;">
                <div class="now-playing" id="loungeNowPlaying" style="text-align: center; margin-bottom: 8px; font-weight: bold;">🎵 YouTube Player Ready</div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <button onclick="window.open('https://www.youtube.com/@uselessradio/streams', '_blank')" style="padding: 12px 20px; background: #ff0000; color: white; border: 2px outset #ff0000; cursor: pointer; font-weight: bold; font-size: 12px;">
                        ▶️ YouTube Live
                    </button>
                    <button onclick="window.open('https://www.twitch.tv/uselessradio', '_blank')" style="padding: 12px 20px; background: #9146ff; color: white; border: 2px outset #9146ff; cursor: pointer; font-weight: bold; font-size: 12px;">
                        📺 Twitch
                    </button>
                </div>
                <div class="media-status" style="text-align: center; margin-top: 8px; font-size: 10px;">Toggle between YouTube/Twitch or click buttons for live streams</div>
            </div>
        </div>
    `;

    // Add to desktop FIRST
    const desktop = document.querySelector('.desktop');
    if (desktop) {
        desktop.appendChild(windowDiv);
    }

    // NOW setup YouTube player and controls AFTER window exists in DOM
    setTimeout(() => {
        if (document.getElementById('loungeVideoPlayer') && !loungePlayer) {
            loungePlayer = new YT.Player('loungeVideoPlayer', {
                videoId: 'OzjqHjUvPUw',
                playerVars: {
                    autoplay: 0,
                    mute: 1,
                    controls: 1,
                    modestbranding: 1,
                    rel: 0
                },
                events: {
                    onReady: function(event) {
                        event.target.mute();
                        console.log('Lounge YouTube player ready!');
                        mediaPlayerStates.lounge = { playing: false, volume: 100, muted: true };
                        
                        // Setup controls AFTER player is ready
                        const playPauseBtn = document.getElementById('loungePlayPauseBtn');
                        const stopBtn = document.getElementById('loungeStopBtn');
                        const muteBtn = document.getElementById('loungeMuteBtn');
                        
                        if (playPauseBtn) {
                            playPauseBtn.addEventListener('click', () => {
                                try {
                                    const playerState = loungePlayer.getPlayerState();
                                    if (playerState === YT.PlayerState.PLAYING) {
                                        loungePlayer.pauseVideo();
                                        playPauseBtn.textContent = '▶';
                                    } else {
                                        loungePlayer.playVideo();
                                        playPauseBtn.textContent = '⏸';
                                    }
                                } catch (e) {
                                    console.error('Lounge play/pause error:', e);
                                }
                            });
                        }
                        
                        if (stopBtn) {
                            stopBtn.addEventListener('click', () => {
                                try {
                                    loungePlayer.stopVideo();
                                    if (playPauseBtn) playPauseBtn.textContent = '▶';
                                } catch (e) {
                                    console.error('Lounge stop error:', e);
                                }
                            });
                        }
                        
                        if (muteBtn) {
                            muteBtn.addEventListener('click', () => {
                                try {
                                    if (loungePlayer.isMuted()) {
                                        loungePlayer.unMute();
                                        loungePlayer.setVolume(100);
                                        muteBtn.textContent = '🔊';
                                    } else {
                                        loungePlayer.mute();
                                        muteBtn.textContent = '🔇';
                                    }
                                } catch (e) {
                                    console.error('Lounge mute error:', e);
                                }
                            });
                        }
                    },
                    
                    
                    onError: function(event) {
                        console.error('YouTube lounge error:', event.data);
                    },
                    onStateChange: function(event) {
                        const playPauseBtn = document.getElementById('loungePlayPauseBtn');
                        if (event.data === YT.PlayerState.PLAYING) {
                            if (playPauseBtn) playPauseBtn.textContent = '⏸';
                        } else if (event.data === YT.PlayerState.PAUSED) {
                            if (playPauseBtn) playPauseBtn.textContent = '▶';
                        }
                    }
                }
            });
        }
        
        // Add progress bar tracking for lounge
        const progressSlider = document.querySelector('#window-lounge .progress-slider');
        const progressBar = document.querySelector('#window-lounge .progress-bar');
        const timeDisplays = document.querySelectorAll('#window-lounge .time-display');
        let isDragging = false;

        if (progressSlider) {
            progressSlider.disabled = false;
            progressSlider.style.opacity = '0';
            
            progressSlider.addEventListener('mousedown', () => { isDragging = true; });
            progressSlider.addEventListener('mouseup', () => { isDragging = false; });
            document.addEventListener('mouseup', () => { isDragging = false; });
            
            progressSlider.addEventListener('input', (e) => {
                if (loungePlayer && loungePlayer.getDuration) {
                    const duration = loungePlayer.getDuration();
                    const seekTime = (e.target.value / 100) * duration;
                    loungePlayer.seekTo(seekTime, true);
                    if (progressBar) progressBar.style.width = e.target.value + '%';
                }
            });
        }

        // Update progress regularly
        setInterval(() => {
            if (loungePlayer && loungePlayer.getCurrentTime && loungePlayer.getDuration && !isDragging) {
                try {
                    const currentTime = loungePlayer.getCurrentTime();
                    const duration = loungePlayer.getDuration();
                    
                    if (duration > 0) {
                        const progressPercent = (currentTime / duration) * 100;
                        if (progressBar) progressBar.style.width = progressPercent + '%';
                        if (progressSlider) progressSlider.value = progressPercent;
                        
                        if (timeDisplays.length >= 2) {
                            timeDisplays[0].textContent = formatTime(currentTime);
                            timeDisplays[1].textContent = formatTime(duration);
                        }
                    }
                } catch (e) {}
            }
        }, 100)
        // Setup window close/minimize buttons
        const loungeWindow = document.getElementById('window-lounge');
        if (loungeWindow) {
            const closeBtn = loungeWindow.querySelector('.media-btn.close');
            const minimizeBtn = loungeWindow.querySelector('.media-btn.minimize');
            
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    if (loungePlayer && loungePlayer.pauseVideo) {
                        loungePlayer.pauseVideo();
                    }
                    loungeWindow.style.display = 'none';
                    const taskbarBtn = document.getElementById('taskbar-lounge');
                    if (taskbarBtn) taskbarBtn.remove();
                });
            }
            
            if (minimizeBtn) {
                minimizeBtn.addEventListener('click', () => {
                    loungeWindow.style.display = 'none';
                    const taskbarBtn = document.getElementById('taskbar-lounge');
                    if (taskbarBtn) taskbarBtn.classList.remove('active');
                });
            }
        }
    }, 1000);
    
    // Don't process the rest of createWindow - return early
    return;
    } else if (appName === 'forum') {
        windowDiv.innerHTML = `
            <div class="window-header">
                <div class="window-title">&#128172; Forum</div>
                <div class="window-controls">
                    <button class="window-btn minimize">_</button>
                    <button class="window-btn maximize">&#9633;</button>
                    <button class="window-btn close">&#215;</button>
                </div>
            </div>
            <div class="forum-container">
                <div class="forum-messages" id="forumMessages">
                    <div class="forum-loading">Loading messages...</div>
                </div>
                <div class="forum-toolbar">
                    <div class="forum-emoji-row">
                        <!-- CUSTOM EMOJI 1: replace emoji text with <img src="emoji1.png" class="forum-emoji-img" alt="emoji"> for a custom icon -->
                        <button class="forum-emoji-btn" onclick="forumAddEmoji('&#127925;')" title="Music Note">&#127925;</button>
                        <!-- CUSTOM EMOJI 2 -->
                        <button class="forum-emoji-btn" onclick="forumAddEmoji('&#128293;')" title="Fire">&#128293;</button>
                        <!-- CUSTOM EMOJI 3 -->
                        <button class="forum-emoji-btn" onclick="forumAddEmoji('&#128128;')" title="Skull">&#128128;</button>
                        <!-- CUSTOM EMOJI 4 -->
                        <button class="forum-emoji-btn" onclick="forumAddEmoji('&#128126;')" title="Alien">&#128126;</button>
                        <!-- CUSTOM EMOJI 5 -->
                        <button class="forum-emoji-btn" onclick="forumAddEmoji('&#127928;')" title="Guitar">&#127928;</button>
                        <!-- CUSTOM EMOJI 6 -->
                        <button class="forum-emoji-btn" onclick="forumAddEmoji('&#129304;')" title="Rock On">&#129304;</button>
                        <!-- CUSTOM EMOJI 7 -->
                        <button class="forum-emoji-btn" onclick="forumAddEmoji('&#128191;')" title="CD">&#128191;</button>
                        <!-- CUSTOM EMOJI 8 -->
                        <button class="forum-emoji-btn" onclick="forumAddEmoji('&#128251;')" title="Radio">&#128251;</button>
                    </div>
                    <div class="forum-input-row">
                        <textarea class="forum-input" id="forumInput"
                            placeholder="Sign in as a member to post..."
                            disabled rows="2"
                            onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();forumSubmitPost();}"></textarea>
                        <!-- SEND ARROW: swap for custom icon — <img src="send.png" style="width:16px;height:16px;"> -->
                        <button class="forum-action-icon-btn" id="forumSendBtn"
                                onclick="forumSubmitPost()" disabled title="Send (Enter)">&#9658;</button>
                        <!-- UPLOAD: swap for custom icon — <img src="upload.png" style="width:16px;height:16px;"> -->
                        <button class="forum-action-icon-btn" id="forumUploadBtn"
                                title="Attach image (coming soon)" disabled>&#128206;</button>
                        <!-- TRASH / CLEAR: swap for custom icon — <img src="trash.png" style="width:16px;height:16px;"> -->
                        <button class="forum-action-icon-btn"
                                onclick="forumClearInput()" title="Clear message">&#128465;</button>
                    </div>
                    <div class="forum-status-bar">
                        <span id="forumStatusText">Not signed in &#8212; members only</span>
                    </div>
                </div>
            </div>
        `;
    } else if (appName === 'about') {
        // ABOUT SECTION WITH CUSTOM CONTENT
        windowDiv.innerHTML = `
            <div class="window-header">
                <div class="window-title">${icon} About Useless Radio</div>
                <div class="window-controls">
                    <button class="window-btn minimize">_</button>
                    <button class="window-btn maximize">□</button>
                    <button class="window-btn close">×</button>
                </div>
            </div>
            <div class="window-content" style="padding: 20px; line-height: 1.6;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h2 style="color: #000080; font-size: 24px; margin-bottom: 10px;">Welcome to Useless Radio</h2>
                    <div style="width: 60px; height: 3px; background: #000080; margin: 0 auto;"></div>
                </div>
                
                <div style="background: #f0f0f0; border: 1px inset #c0c0c0; padding: 20px; margin-bottom: 25px;">
                    <h3 style="color: #000080; margin-bottom: 15px; font-size: 16px;">🎵 Our Mission</h3>
                    <p style="margin-bottom: 15px;">[useless radio] is a collection of creatives—web designers, producers, musicians, filmmakers, and more—who grew up watching weird sh*t (except for Manni).</p>
                    <p> Our mission is to bring a fresh take on rap music and create a space that feels like home—through sounds and aesthetics.</p>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
                    <div style="background: white; border: 1px inset #c0c0c0; padding: 15px;">
                        <h4 style="color: #000080; margin-bottom: 10px;">🎤 What We Do</h4>
                        <ul style="margin-left: 15px; color: #333;">
                            <li>Live radio shows and podcasts</li>
                            <li>Music video production</li>
                            <li>Artist interviews & features</li>
                            <li>Community events & showcases</li>
                        </ul>
                    </div>
                    <div style="background: white; border: 1px inset #c0c0c0; padding: 15px;">
                        <h4 style="color: #000080; margin-bottom: 10px;">🌟 Our Values</h4>
                        <ul style="margin-left: 15px; color: #333;">
                            <li>Authentic</li>
                            <li>Timeless</li>
                            <li>Energetic</li>
                            <li>Bold</li>
                        </ul>
                    </div>
                </div>

                <div style="background: #e6f3ff; border: 1px inset #c0c0c0; padding: 20px; margin-bottom: 20px;">
                    <h3 style="color: #000080; margin-bottom: 15px; font-size: 16px;">📻 The Useless Radio Experience</h3>
                    <p style="margin-bottom: 10px;">
                        If you're here you just stumbled upon Atlanta's newest platform for obscure media.
                        Expect to see a fusion of Atlanta's underground rap meshing with an eclectic group of
                        filmmakers.</p>
                    <p><strong>You already know who we are.</strong></p>
                </div>

                <div style="text-align: center; background: #c0c0c0; border: 1px inset #c0c0c0; padding: 15px;">
                    <p style="font-style: italic; color: #666; margin-bottom: 10px;">""You're here because you got nothing better to do""</p>
                    <p style="font-size: 12px; color: #000080; font-weight: bold;">- [useless radio]</p>
                </div>
            </div>
        `;
    } else if (appName === 'Camera Roll') {
        windowDiv.innerHTML = `
            <div class="window-header">
                <div class="window-title">📷 Camera Roll</div>
                <div class="window-controls">
                    <button class="window-btn minimize">_</button>
                    <button class="window-btn maximize">□</button>
                    <button class="window-btn close">×</button>
                </div>
            </div>
            <div class="window-content" style="padding: 0; overflow: hidden;">
                <div class="camera-toolbar" style="background: #c0c0c0; border-bottom: 2px groove #808080; padding: 4px; display: flex; gap: 4px; flex-wrap: wrap;">
                    <button class="camera-tool-btn" onclick="cameraRoll.prevPhoto()" title="Previous">◄</button>
                    <button class="camera-tool-btn" onclick="cameraRoll.nextPhoto()" title="Next">►</button>
                    <span style="padding: 4px 8px; border: 1px inset #c0c0c0; font-size: 11px;" id="photoCounter">1 / 1</span>
                    <div style="width: 1px; height: 24px; background: #808080; margin: 0 4px;"></div>
                    <button class="camera-tool-btn" onclick="cameraRoll.setTool('pen')" id="toolPen" title="Pen">✏️</button>
                    <button class="camera-tool-btn" onclick="cameraRoll.setTool('eraser')" id="toolEraser" title="Eraser">🧹</button>
                    <button class="camera-tool-btn" onclick="cameraRoll.setTool('line')" id="toolLine" title="Line">📏</button>
                    <button class="camera-tool-btn" onclick="cameraRoll.setTool('rect')" id="toolRect" title="Rectangle">▭</button>
                    <button class="camera-tool-btn" onclick="cameraRoll.setTool('circle')" id="toolCircle" title="Circle">○</button>
                    <div style="width: 1px; height: 24px; background: #808080; margin: 0 4px;"></div>
                    <input type="color" id="drawColor" value="#000000" style="width: 32px; height: 24px; border: 1px inset #c0c0c0; cursor: pointer;" onchange="cameraRoll.setColor(this.value)">
                    <input type="range" id="brushSize" min="1" max="20" value="2" style="width: 80px;" oninput="cameraRoll.setBrushSize(this.value)">
                    <span style="font-size: 10px; padding: 4px;">Size: <span id="brushSizeDisplay">2</span>px</span>
                    <div style="width: 1px; height: 24px; background: #808080; margin: 0 4px;"></div>
                    <button class="camera-tool-btn" onclick="cameraRoll.clearDrawing()" title="Clear Drawing">🗑️</button>
                    <button class="camera-tool-btn" onclick="cameraRoll.saveImage()" title="Save Image">💾</button>
                </div>
                <div class="camera-view" style="position: relative; width: 100%; height: calc(100% - 40px); overflow: auto; background: #808080;">
                    <canvas id="cameraCanvas" style="display: block; margin: auto; cursor: crosshair; max-width: 100%; max-height: 100%;"></canvas>
                </div>
            </div>
        `;
    } else if (appName === 'tracks') {
    windowDiv.innerHTML = `
        <div class="window-header">
            <div class="window-title">💿 Tracks</div>
            <div class="window-controls">
                <button class="window-btn minimize">_</button>
                <button class="window-btn maximize">□</button>
                <button class="window-btn close">×</button>
            </div>
        </div>
        <div class="window-content">
            <div style="padding: 15px;">
                <h3 style="color: #000080; margin-bottom: 15px;">🎵 Music Library</h3>
                
                <!-- MUSIC PLATFORM BUTTONS AT TOP -->
                <div style="display: flex; gap: 10px; margin-bottom: 20px; justify-content: center;">
                    <button onclick="window.open('https://open.spotify.com/artist/1cZ23G8hbCiABSPB5VVhJ8', '_blank')" style="padding: 10px 20px; background: #1DB954; color: white; border: 2px outset #1DB954; cursor: pointer; font-weight: bold; font-size: 12px;">
                        🎵 Open Spotify
                    </button>
                    <button onclick="window.open('https://soundcloud.com/uselessradio', '_blank')" style="padding: 10px 20px; background: #ff5500; color: white; border: 2px outset #ff5500; cursor: pointer; font-weight: bold; font-size: 12px;">
                        🔊 Open SoundCloud
                    </button>
                </div>

                <!-- ALBUM COVERS GRID -->
                <h4 style="color: #000080; margin-bottom: 10px; font-size: 12px;">📀 Albums</h4>
                <div class="tracks-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 20px; margin-top: 15px;">
                    ${TRACKS_ITEMS.filter(item => item.type === 'album').map(item => `
                        <div class="track-item" onclick="window.open('${item.url}', '_blank')" style="cursor: pointer; text-align: center; padding: 10px; border: 1px solid transparent; background: #c0c0c0;">
                            <div class="track-cover" style="width: 120px; height: 120px; border: 2px inset #c0c0c0; background: white; padding: 2px; margin: 0 auto 8px;">
                                <img src="${item.image}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%22 y=%2255%22 text-anchor=%22middle%22 font-size=%2210%22%3EAlbum%3C/text%3E%3C/svg%3E'">
                            </div>
                            <div class="track-title" style="font-size: 11px; font-weight: bold; color: #000080; margin-bottom: 4px; word-wrap: break-word;">${item.title}</div>
                            <div class="track-type" style="font-size: 10px; color: #666; text-transform: uppercase;">${item.type}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    } else if (appName === 'contact') {
        windowDiv.innerHTML = `
            <div class="window-header">
                <div class="window-title">${icon} Contact</div>
                <div class="window-controls">
                    <button class="window-btn minimize">_</button>
                    <button class="window-btn maximize">□</button>
                    <button class="window-btn close">×</button>
                </div>
            </div>
            <div class="window-content" style="padding: 20px;">
                <h3>Get In Touch</h3>
                <p style="margin-bottom: 20px;">Ready to connect with the Useless Radio collective? We'd love to hear from you!</p>
                
                <div style="background: white; border: 1px inset #c0c0c0; padding: 20px; margin-bottom: 20px;">
                    <h4 style="color: #000080; margin-bottom: 15px;">📧 Contact Information</h4>
                    <div style="margin-bottom: 10px;"><strong>Email:</strong> hellouselessradio@gmail.com</div>
                    <div style="margin-bottom: 10px;"><strong>Instagram:</strong> @useless.radio</div>
                    <div style="margin-bottom: 10px;"> </div>
                    <div style="margin-bottom: 14px;"><strong>CREDITS</strong></div>
                    <div style="margin-bottom: 10px;"><strong>Web-design:</strong> ethanfountain03@gmail.com</div>
                    <div style="margin-bottom: 10px;"><strong>Artist Graphics:</strong> hellocinzanol@gmail.com</div>
                </div>

                <div style="background: #f0f0f0; border: 1px inset #c0c0c0; padding: 20px;">
                    <h4 style="color: #000080; margin-bottom: 15px;">🤝 Collaborate With Us</h4>
                    <p style="margin-bottom: 10px;">Whether you're an artist looking for a platform, a creative wanting to collaborate, or just a fan who wants to say hello - we're always open to new connections.</p>
                    <p><strong>Follow us on our social platforms and join the community!</strong></p>
                </div>
            </div>
        `;
    
    } else {
        // Personal icons and other generic windows
        let personalContent = '';
        
        if (['Swampfoot', 'Owen-Givens', 'Mannisupreme', 'Jordan-walker'].includes(appName)) {
            const memberInfo = {
                'Swampfoot': {
                    role: 'Producer/Musician',
                    bio: 'Master of beats and the sonic architect of our sound. Hey guys, I\'m Swamp. Go listen to my music nigga I have nothing else to say to you.',
                    skills: 'I can make beats, I can do a backflip, I can spontaneously combust in flames on command.',
                    image: 'z.Swampfootpic.jpg',
                    imageSize: '400px'
                },
                'Owen-Givens': {
                    role: 'Creative',
                    bio: 'Born out of a test tube straight from the labs of Warner Robins GA. IT is speculated the father\'s donated specimen was that of Justin Timberlake\'s, which is what many believe to be the reason why Owen has such an angelic singing voice.',
                    skills: 'Singing, Fencing, Dog-Whispering',
                    image: 'z.owenhead.png',
                    imageSize: '400px'
                },
                'Mannisupreme': {
                    role: 'Host/Co-creator',
                    bio: 'The youngest radio personality in america with a full time radio slot who is aiming to make radio great again',
                    skills: 'Black Belt, Bicycle enthusiast, can eat three icecream cones and not get brain freeze',
                    image: 'z.manni2.png',
                    imageSize: '400px'
                },
                'Jordan-walker': {
                    role: 'Creative Director/CO-Creator',
                    bio: 'I hate bios, I\'m going to use this opportunity to plug my other ventures that you can find on cinzanol.xyz!',
                    skills: 'Debate, Ride a bike with no hands, Skribbling',
                    image: 'z.jordan2.png',
                    imageSize: '400px'
                }
            };
            
            const info = memberInfo[appName];
            if (info) {
                // Get custom size from IMAGE_SIZES config
                const bioSize = IMAGE_SIZES.bio[appName] || { width: 200, height: 200 };
                
                personalContent = `
                    <div style="text-align: center; padding: 20px;">
                        <div style="margin-bottom: 20px;">
                            <img src="${info.image}" alt="${displayName}" style="width: ${bioSize.width}px; height: ${bioSize.height}px; object-fit: cover; border-radius: 8px; border: 2px solid #000080; box-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                        </div>
                        <h2 style="margin-bottom: 10px; font-size: 18px; color: #000080;">${displayName}</h2>
                        <h3 style="margin-bottom: 15px; font-size: 14px; color: #666; font-style: italic;">${info.role}</h3>
                        <p style="margin-bottom: 20px; line-height: 1.4; color: #333; white-space: pre-line;">${info.bio}</p>
                        <div style="border: 1px inset #c0c0c0; padding: 15px; background: #f0f0f0; text-align: left;">
                            <strong>Skills:</strong><br>
                            <span style="color: #666;">${info.skills}</span>
                        </div>
                    </div>
                `;
            } else {
                personalContent = `
                    <p>Welcome to ${displayName}!</p>
                    <p>The ${appName} section is coming soon. Please check back regularly.</p>
                `;
            }
        } else {
            personalContent = `
                <p>Welcome to ${displayName}!</p>
                <p>The ${appName} section is coming soon. Please check back regularly.</p>
            `;
        }
        
        windowDiv.innerHTML = `
            <div class="window-header">
                <div class="window-title">${icon} ${displayName}</div>
                <div class="window-controls">
                    <button class="window-btn minimize">_</button>
                    <button class="window-btn maximize">□</button>
                    <button class="window-btn close">×</button>
                </div>
            </div>
            <div class="window-content">
                ${personalContent}
            </div>
        `;
    }
    
    const desktop = document.querySelector('.desktop');
    if (desktop) {
        desktop.appendChild(windowDiv);
        
        const closeBtn = windowDiv.querySelector('.window-btn.close');
        const minimizeBtn = windowDiv.querySelector('.window-btn.minimize');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => closeWindow(appName));
        }
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', () => minimizeWindow(appName));
        }
        
        // Only make draggable/resizable on desktop
        if (!window.IS_MOBILE_DEVICE) {
            makeWindowDraggable(windowDiv);
            makeWindowResizable(windowDiv);
            
        }
        if (appName === 'Camera Roll') {
            setTimeout(() => initCameraRoll(), 100);
        }
        if (appName === 'forum') {
            setTimeout(() => initForum(), 200);
        }

console.log('Window created and added to desktop for:', appName);
        
}}

function makeWindowDraggable(windowElement) {
    const header = windowElement.querySelector('.window-header, .media-player-header');
    if (!header) return;
    
    let isDragging = false;
    let currentX, currentY, initialX, initialY;
    
    header.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('window-btn') || e.target.classList.contains('media-btn')) return;
        isDragging = true;
        windowElement.style.zIndex = ++zIndex;
        initialX = e.clientX - windowElement.offsetLeft;
        initialY = e.clientY - windowElement.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            
            const maxX = window.innerWidth - windowElement.offsetWidth;
            const maxY = window.innerHeight - windowElement.offsetHeight - 36;
            
            currentX = Math.max(0, Math.min(currentX, maxX));
            currentY = Math.max(0, Math.min(currentY, maxY));
            
            windowElement.style.left = currentX + 'px';
            windowElement.style.top = currentY + 'px';
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}

function makeWindowResizable(windowElement) {
    let isResizing = false;
    let currentX, currentY, initialX, initialY, initialWidth, initialHeight;
    
    // Create resize handle if it doesn't exist
    let resizeHandle = windowElement.querySelector('.resize-handle');
    if (!resizeHandle) {
        resizeHandle = document.createElement('div');
        resizeHandle.className = 'resize-handle';
        resizeHandle.style.cssText = `
            position: absolute;
            bottom: 0;
            right: 0;
            width: 20px;
            height: 20px;
            cursor: se-resize;
            z-index: 10;
            background: linear-gradient(-45deg, transparent 0%, transparent 40%, #808080 40%, #808080 60%, transparent 60%, transparent 100%);
        `;
        windowElement.appendChild(resizeHandle);
    }
    
    resizeHandle.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        isResizing = true;
        initialX = e.clientX;
        initialY = e.clientY;
        initialWidth = parseInt(window.getComputedStyle(windowElement).width, 10);
        initialHeight = parseInt(window.getComputedStyle(windowElement).height, 10);
        windowElement.style.zIndex = ++zIndex;
    });

    document.addEventListener('mousemove', (e) => {
        if (isResizing) {
            e.preventDefault();
            const deltaX = e.clientX - initialX;
            const deltaY = e.clientY - initialY;
            
            const newWidth = Math.max(300, initialWidth + deltaX);
            const newHeight = Math.max(200, initialHeight + deltaY);
            
            windowElement.style.width = newWidth + 'px';
            windowElement.style.height = newHeight + 'px';
        }
    });

    document.addEventListener('mouseup', () => {
        isResizing = false;
    });
}

// Make global functions accessible
window.closeMannivirusPopup = closeMannivirusPopup;
window.closeEventPromoPopup = closeEventPromoPopup;// IMPROVED DESKTOP DETECTION - Replace the code at the top of your script.js
// This fixes the window minimizing issues and startup video problems

// SIMPLE MOBILE DETECTION - Replace the code at the top of your script.js
// This fixes window issues with a minimal approach

(function() {
    // Simple mobile detection
    function isTrueMobileDevice() {
        const userAgent = navigator.userAgent.toLowerCase();
        return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(userAgent);
    }
    
    // Set global flag and CSS class
    window.IS_MOBILE_DEVICE = isTrueMobileDevice();
    
    if (window.IS_MOBILE_DEVICE) {
        document.body.classList.add('mobile-device');
    } else {
        document.body.classList.add('desktop-device');
        
        // Force minimum width for desktop
        document.body.style.minWidth = '1024px';
        
        // Set viewport for desktop
        let viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
            viewport = document.createElement('meta');
            viewport.name = 'viewport';
            viewport.content = 'width=1024';
            document.head.appendChild(viewport);
        } else {
            viewport.setAttribute('content', 'width=1024');
        }
    }
})();
// ⚡ WEBSITE CONFIGURATION - CHANGE YOUR URLS HERE ⚡
const WEBSITE_URLS = {
    'videos': [
        'https://www.youtube.com/embed/Burqi3TxQN4',
        'https://www.youtube.com/embed/_eZm9cpJtC0', // Updated LILSCRRT Interview video
        'https://www.youtube.com/embed/QMLRuMPrYF0',
        'https://www.youtube.com/embed/CPw1wHqulxg',
        'https://www.youtube.com/embed/dqHhRDJyIjc'
    ],
    // FIXED: Changed from recursive 'uselessradio.com/store/' to absolute URL
    'store': 'https://uselessradio.com/store/',
    'lounge': null,
    'tracks': null,
    // Personal icons
    'Swampfoot': null,
    'Owen-Givens': null,
    'Mannisupreme': null,
    'Jordan-walker': null
};

// ⚡ ALBUM PROMO POPUP CONFIGURATION ⚡
const EVENT_PROMO = {
    eventTitle: "[useless] Listening Party",
    eventDate: "October 31, 2025",
    eventLocation: "RSVP for Location",
    eventUrl: "",
    flyerImage: "z.eventflyer1.jpg", // Your event flyer image
    delayAfterStartup: 3000
};

// ⚡ IMAGE SIZE CONFIGURATION ⚡
const IMAGE_SIZES = {
    // Personal bio image sizes (width x height in pixels)
    bio: {
        'Swampfoot': { width: 300, height: 300 },
        'Owen-Givens': { width: 220, height: 220 },
        'Mannisupreme': { width: 250, height: 250 }, // Adjust z.manni2.png size here
        'Jordan-walker': { width: 225, height: 225 }
    },
    // Taskbar icon sizes (width x height in pixels)
    taskbar: {
        'Swampfoot': { width: 36, height: 36 }, // Desktop size
        'Owen-Givens': { width: 36, height: 36 }, // Desktop size
        'Mannisupreme': { width: 36, height: 36 }, // Desktop size
        'Jordan-walker': { width: 36, height: 36 } // Desktop size (perfect reference)
    },
    // Mobile taskbar icon sizes
    taskbarMobile: {
        'Swampfoot': { width: 44, height: 44 }, // Mobile size
        'Owen-Givens': { width: 44, height: 44 }, // Mobile size
        'Mannisupreme': { width: 44, height: 44 }, // Mobile size
        'Jordan-walker': { width: 44, height: 44 } // Mobile size
    }
};

// Video IDs extracted for YouTube API - FIXED TO MATCH WEBSITE_URLS.Videos
const Videos_VIDEO_IDS = [
    'tYPUF0uabOE',
    'Burqi3TxQN4',
    '_eZm9cpJtC0',
    'QMLRuMPrYF0',
    'CPw1wHqulxg',
    'dqHhRDJyIjc',
    'dT8jfcYV4RU',
    'yIUFj8oDi90',
    'OE_lExi_Dpg'
];

const MAIN_VIDEO_ID = 'OE_lExi_Dpg';

// Camera Roll Photos - Add your image paths here
const CAMERA_ROLL_PHOTOS = [
    'Lookbook/Lookbook39.JPEG',
    'Lookbook/WhiteTee2.png',
    'Lookbook/Lookbook18.jpeg',
    'Lookbook/Lookbook19.jpeg',
    'Lookbook/Lookbook40.jpg',
    'Lookbook/Lookbook29.PNG',
    'Lookbook/Lookbook5.JPEG',
    'Lookbook/Lookbook9.jpg',
    'Lookbook/Lookbook38.JPG',
    'Lookbook/Lookbook2.JPEG',
    'Lookbook/Lookbook1.JPEG',
    'Lookbook/Lookbook8.jpg',
    'Lookbook/Lookbook37.JPG',
    'MLookbook/Lookbook10.jpg',
    'Lookbook/Lookbook12.jpeg',
    'Lookbook/Lookbook14.jpeg',
    'Lookbook/Lookbook36.jpg',
    'Lookbook/Lookbook22.jpeg',
    'Lookbook/Lookbook16.JPG',
    'Lookbook/Lookbook35.PNG',
    'Lookbook/Lookbook4.JPEG',
    'Lookbook/Lookbook3.JPEG',
    'Lookbook/Lookbook11.jpg'
    
];

// Video titles for Videos playlist
const Videos_TITLES = [
    'Die Good Vol1 Release Party',
    'LILSCRRT Interview',
    'SPRAYGROUND BOOKBAGS & ATL',
    'In the Woods w/ Tony Snow',
    'Die Good Vol 2: Commercial',
    '2046 Soul Train feat. B6 and C12'
];

// Tracks configuration
const TRACKS_ITEMS = [
    {
        title: "Die Good Vol.1",
        url: "https://soundcloud.com/uselessradio/sets/die-good-vol-1",
        image: "z.DIE GOOD ALBUM COVER.png",
        type: "album"
    },
    {
        title: "Die Good Vol.2",
        url: "https://distrokid.com/hyperfollow/uselessradio/die-good-vol-2-foundin-fathers-2/",
        image: "z.DieGoodVol2AlbumCover.jpg",
        type: "album"
    }
];

// Apps that should open in new tabs instead of iframes
const EXTERNAL_APPS = [];

// Startup sequence variables
let startupComplete = false;

// Mannivirus system
let mannivirusTriggered = false;
let popupCount = 0;
let popupZIndex = 15000;

// Media Player State
let currentVideosIndex = 0;
let mediaPlayerStates = {
    main: { playing: true, volume: 100, muted: true },
    Videos: { playing: false, volume: 100, muted: true },
    startup: { playing: false, volume: 33, muted: true },
    lounge: { playing: false, volume: 100, muted: true }
};

// YouTube Players
let mainPlayer = null;
let VideosPlayer = null;
let loungePlayer = null;
let youTubeAPIReady = false;

// ⚡ COUNTDOWN TIMER CONFIGURATION ⚡
// Set your target drop date here (YYYY-MM-DD format)
const DROP_DATE_CONFIG = {
    enabled: false, // Set to true when you have a drop date, false for TBA
    date: new Date('2025-09-26T00:00:00'), // Your drop date when enabled
    tbaText: '[TBA]' // Text to show when no drop is scheduled
};

// Load YouTube API
function loadYouTubeAPI() {
    if (window.YT) {
        youTubeAPIReady = true;
        return;
    }
    
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// YouTube API Ready Callback
window.onYouTubeIframeAPIReady = function() {
    youTubeAPIReady = true;
    initializeYouTubePlayers();
};

function initializeYouTubePlayers() {
    // Initialize main video player
    if (document.getElementById('mainVideoPlayer')) {
        mainPlayer = new YT.Player('mainVideoPlayer', {
            videoId: MAIN_VIDEO_ID,
            playerVars: {
                autoplay: 1,
                mute: 1,
                loop: 1,
                playlist: MAIN_VIDEO_ID,
                controls: 0,
                modestbranding: 1,
                rel: 0
            },
            events: {
                onReady: function(event) {
                    event.target.setVolume(0); // Start muted
                    event.target.mute(); // Ensure muted
                    updateMediaStatus('main', 'Playing (Muted)');
                },
                onStateChange: function(event) {
                    const playPauseBtn = document.getElementById('mainPlayPauseBtn');
                    if (event.data === YT.PlayerState.PLAYING) {
                        if (playPauseBtn) playPauseBtn.textContent = '⏸';
                        mediaPlayerStates.main.playing = true;
                        updateMediaStatus('main', mediaPlayerStates.main.muted ? 'Playing (Muted)' : 'Playing');
                    } else if (event.data === YT.PlayerState.PAUSED) {
                        if (playPauseBtn) playPauseBtn.textContent = '▶';
                        mediaPlayerStates.main.playing = false;
                        updateMediaStatus('main', 'Paused');
                    }
                }
            }

        });
    }


    // Initialize Videos player
    if (document.getElementById('VideosVideoPlayer')) {
        VideosPlayer = new YT.Player('VideosVideoPlayer', {
            videoId: Videos_VIDEO_IDS[0],
            playerVars: {
                controls: 0,
                modestbranding: 1,
                rel: 0,
                mute: 1 // Start muted
            },
            events: {
                onReady: function(event) {
                    event.target.mute(); // Ensure muted
                    updateMediaStatus('Videos', 'Ready (Muted)');
                },
                onStateChange: function(event) {
                    const playPauseBtn = document.getElementById('VideosPlayPauseBtn');
                    if (event.data === YT.PlayerState.PLAYING) {
                        if (playPauseBtn) playPauseBtn.textContent = '⏸';
                        mediaPlayerStates.Videos.playing = true;
                        updateMediaStatus('Videos', mediaPlayerStates.Videos.muted ? 'Playing (Muted)' : 'Playing');
                    } else if (event.data === YT.PlayerState.PAUSED) {
                        if (playPauseBtn) playPauseBtn.textContent = '▶';
                        mediaPlayerStates.Videos.playing = false;
                        updateMediaStatus('Videos', 'Paused');
                    }
                }
            }
        });
    }

}

// Initialize startup sequence when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadYouTubeAPI(); // Load YouTube API first
    initializeStartup();
});

// Startup sequence
function initializeStartup() {
    const startupScreen = document.getElementById('startupScreen');
    const mainDesktop = document.getElementById('mainDesktop');
    const loadingBar = document.getElementById('loadingBar');
    const startupSound = document.getElementById('startupSound');

    mainDesktop.style.display = 'none';

    // Try to play startup sound
    if (startupSound) {
        document.addEventListener('click', () => {
            startupSound.play().catch(err => {
                console.log('Audio autoplay prevented:', err);
            });
        }, { once: true });
        
        startupSound.play().catch(err => {
            console.log('Audio autoplay prevented:', err);
        });
    }
    
    // Animate loading bar
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        
        loadingBar.style.width = progress + '%';
        
        if (progress >= 100) {
            clearInterval(loadingInterval);
            setTimeout(() => {
                finishStartup();
            }, 1000);
        }
    }, 200);
    
    // Backup timeout
    setTimeout(() => {
        if (!startupComplete) {
            finishStartup();
        }
    }, 8000);
}

function finishStartup() {
    if (startupComplete) return;
    startupComplete = true;
    
    const startupScreen = document.getElementById('startupScreen');
    const mainDesktop = document.getElementById('mainDesktop');
    
    // Instantly swap - no transitions
    startupScreen.style.display = 'none';
    mainDesktop.style.display = 'block';
    
    // Initialize desktop immediately
    try { initializeDesktop(); } catch(e) { console.error('initializeDesktop error:', e); }

    // Launch startup video popup
    try { launchStartupVideo(); } catch(e) { console.error('launchStartupVideo error:', e); }
}

// ========== STARTUP VIDEO POPUP (self-contained) ==========
function launchStartupVideo() {
    var VIDEO_ID = 'GzNPzBnhq2Y';
    var isMobile = window.IS_MOBILE_DEVICE;

    // Inject scoped styles
    var style = document.createElement('style');
    style.textContent = '#sv-popup{position:fixed;z-index:99999;background:#c0c0c0;border:2px outset #dfdfdf;box-shadow:3px 3px 8px rgba(0,0,0,.5);font-family:Tahoma,sans-serif;font-size:11px}#sv-popup.sv-desktop{top:60px;right:30px;width:560px;height:420px}#sv-popup.sv-mobile{top:8px;left:4px;width:calc(100vw - 8px);height:55vh}#sv-header{display:flex;justify-content:space-between;align-items:center;background:#c0c0c0;border-bottom:1px solid #808080;color:#000;padding:2px 4px;cursor:default;user-select:none;-webkit-user-select:none}#sv-header span{font-weight:bold;font-size:11px}#sv-btns button{background:#c0c0c0;border:2px outset #dfdfdf;width:18px;height:16px;font-size:10px;line-height:1;cursor:pointer;margin-left:2px;padding:0}#sv-btns button:active{border-style:inset}#sv-body{background:#000;width:100%;height:calc(100% - 22px)}#sv-body iframe{width:100%;height:100%;border:none}';
    document.head.appendChild(style);

    // Build popup
    var popup = document.createElement('div');
    popup.id = 'sv-popup';
    popup.className = isMobile ? 'sv-mobile' : 'sv-desktop';

    var header = document.createElement('div');
    header.id = 'sv-header';

    var title = document.createElement('span');
    title.textContent = 'Windows Media Player';

    var btns = document.createElement('div');
    btns.id = 'sv-btns';

    var minBtn = document.createElement('button');
    minBtn.textContent = '_';
    minBtn.title = 'Minimize';

    var closeBtn = document.createElement('button');
    closeBtn.textContent = 'x';
    closeBtn.title = 'Close';

    btns.appendChild(minBtn);
    btns.appendChild(closeBtn);
    header.appendChild(title);
    header.appendChild(btns);

    var body = document.createElement('div');
    body.id = 'sv-body';

    var iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube.com/embed/' + VIDEO_ID + '?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1';
    iframe.allow = 'autoplay; encrypted-media';
    iframe.allowFullscreen = true;
    body.appendChild(iframe);

    popup.appendChild(header);
    popup.appendChild(body);
    document.body.appendChild(popup);

    closeBtn.onclick = function() { popup.remove(); style.remove(); };
    minBtn.onclick = function() { popup.style.display = 'none'; };

    // Draggable on desktop
    if (!isMobile) {
        var dragging = false, dx = 0, dy = 0;
        header.onmousedown = function(e) {
            if (e.target.tagName === 'BUTTON') return;
            dragging = true;
            dx = e.clientX - popup.offsetLeft;
            dy = e.clientY - popup.offsetTop;
            popup.style.left = popup.offsetLeft + 'px';
            popup.style.right = 'auto';
        };
        document.addEventListener('mousemove', function(e) {
            if (!dragging) return;
            popup.style.left = Math.max(0, Math.min(e.clientX - dx, window.innerWidth - popup.offsetWidth)) + 'px';
            popup.style.top = Math.max(0, Math.min(e.clientY - dy, window.innerHeight - popup.offsetHeight)) + 'px';
        });
        document.addEventListener('mouseup', function() { dragging = false; });
    }
}
// ========== END STARTUP VIDEO POPUP ==========

function initializeDesktop() {
    updateClock();
    setInterval(updateClock, 1000);
    createMannivirusPixels();
    setupEventListeners();
    setupMediaPlayers();
    applyTaskbarIconSizes();
    
    // Event promo popup — DISABLED (event passed). Uncomment and update EVENT_PROMO config for future events.
    // setTimeout(() => {
    //     createEventPromoPopup();
    // }, EVENT_PROMO.delayAfterStartup);
}

// Apply custom sizes to taskbar icons
function applyTaskbarIconSizes() {
    const isMobile = window.IS_MOBILE_DEVICE;
    document.querySelectorAll('.personal-icon').forEach(icon => {
        const appName = icon.dataset.app;
        const img = icon.querySelector('.personal-icon-img');
        // Use mobile sizes if on mobile device, otherwise use desktop sizes
        const sizeSource = isMobile ? IMAGE_SIZES.taskbarMobile : IMAGE_SIZES.taskbar;
        if (img && sizeSource && sizeSource[appName]) {
            const size = sizeSource[appName];
            img.style.width = size.width + 'px';
            img.style.height = size.height + 'px';
        }
    });
}

function setupMediaPlayers() {
    setupMainVideoPlayer();
    setupVideosPlayer();
    setupLoungeVideoPlayer();
}

function setupMainVideoPlayer() {
    const playPauseBtn = document.getElementById('mainPlayPauseBtn');
    const stopBtn = document.getElementById('mainStopBtn');
    const muteBtn = document.getElementById('mainMuteBtn');
    const progressSlider = document.querySelector('#window-video .progress-slider');
    const progressBar = document.querySelector('#window-video .progress-bar');
    const timeDisplays = document.querySelectorAll('#window-video .time-display');
    
    let isDragging = false;
    
    if (muteBtn) {
        muteBtn.textContent = '🔇'; // Start with muted icon
    }
    
    // Enable and setup progress slider
    if (progressSlider) {
        progressSlider.disabled = false;
        progressSlider.style.opacity = '0'; // Keep invisible but functional
        
        progressSlider.addEventListener('mousedown', () => { isDragging = true; });
        progressSlider.addEventListener('mouseup', () => { isDragging = false; });
        document.addEventListener('mouseup', () => { isDragging = false; });
        
        progressSlider.addEventListener('input', (e) => {
            if (mainPlayer && mainPlayer.getDuration) {
                const duration = mainPlayer.getDuration();
                const seekTime = (e.target.value / 100) * duration;
                mainPlayer.seekTo(seekTime, true);
                if (progressBar) progressBar.style.width = e.target.value + '%';
            }
        });
    }
    
    // Update progress regularly
    const mainProgressInterval = setInterval(() => {
        if (mainPlayer && mainPlayer.getCurrentTime && mainPlayer.getDuration && !isDragging) {
            try {
                const currentTime = mainPlayer.getCurrentTime();
                const duration = mainPlayer.getDuration();
                
                if (duration > 0) {
                    const progressPercent = (currentTime / duration) * 100;
                    if (progressBar) progressBar.style.width = progressPercent + '%';
                    if (progressSlider) progressSlider.value = progressPercent;
                    
                    if (timeDisplays.length >= 2) {
                        timeDisplays[0].textContent = formatTime(currentTime);
                        timeDisplays[1].textContent = formatTime(duration);
                    }
                }
            } catch (e) {
                // Ignore errors when player isn't ready
            }
        }
    }, 100); // Faster update for smoother slider
    
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
            if (!mainPlayer) return;  // ← FIXED!
            
            if (mediaPlayerStates.main.playing) {
                mainPlayer.pauseVideo();
            } else {
                mainPlayer.playVideo();
            }
        });
    }
        
    if (stopBtn) {
        stopBtn.addEventListener('click', () => {
            if (!mainPlayer) return;
            mainPlayer.stopVideo();
            playPauseBtn.textContent = '▶';
            mediaPlayerStates.main.playing = false;
            updateMediaStatus('main', 'Stopped');
        });
    }
    
    if (muteBtn) {
        muteBtn.addEventListener('click', () => {
            if (!mainPlayer) return;
            
            if (mediaPlayerStates.main.muted) {
                mainPlayer.unMute();
                muteBtn.textContent = '🔊';
                mediaPlayerStates.main.muted = false;
                mainPlayer.setVolume(mediaPlayerStates.main.volume);
                updateMediaStatus('main', 'Playing');
            } else {
                mainPlayer.mute();
                muteBtn.textContent = '🔇';
                mediaPlayerStates.main.muted = true;
                updateMediaStatus('main', 'Playing (Muted)');
            }
        });
    }
}

function setupVideosPlayer() {
    const videoselector = document.getElementById('videoselector');
    const prevVideoBtn = document.getElementById('prevVideoBtn');
    const nextVideoBtn = document.getElementById('nextVideoBtn');
    const playlistCounter = document.getElementById('playlistCounter');
    const playPauseBtn = document.getElementById('VideosPlayPauseBtn');
    const stopBtn = document.getElementById('VideosStopBtn');
    const prevBtn = document.getElementById('VideosPrevBtn');
    const nextBtn = document.getElementById('VideosNextBtn');
    const muteBtn = document.getElementById('VideosMuteBtn');
    const nowPlaying = document.getElementById('VideosNowPlaying');
    const progressSlider = document.querySelector('#window-Videos .progress-slider');
    const progressBar = document.querySelector('#window-Videos .progress-bar');
    const timeDisplays = document.querySelectorAll('#window-Videos .time-display');
    
    let isDragging = false;
    
    if (muteBtn) {
        muteBtn.textContent = '🔇'; // Start with muted icon
    }
    
    // Enable and setup progress slider
    if (progressSlider) {
        progressSlider.disabled = false;
        progressSlider.style.opacity = '0'; // Keep invisible but functional
        
        progressSlider.addEventListener('mousedown', () => { isDragging = true; });
        progressSlider.addEventListener('mouseup', () => { isDragging = false; });
        document.addEventListener('mouseup', () => { isDragging = false; });
        
        progressSlider.addEventListener('input', (e) => {
            if (VideosPlayer && VideosPlayer.getDuration) {
                const duration = VideosPlayer.getDuration();
                const seekTime = (e.target.value / 100) * duration;
                VideosPlayer.seekTo(seekTime, true);
                if (progressBar) progressBar.style.width = e.target.value + '%';
            }
        });
    }
    
    // Update progress regularly
    const VideosProgressInterval = setInterval(() => {
        if (VideosPlayer && VideosPlayer.getCurrentTime && VideosPlayer.getDuration && !isDragging) {
            try {
                const currentTime = VideosPlayer.getCurrentTime();
                const duration = VideosPlayer.getDuration();
                
                if (duration > 0) {
                    const progressPercent = (currentTime / duration) * 100;
                    if (progressBar) progressBar.style.width = progressPercent + '%';
                    if (progressSlider) progressSlider.value = progressPercent;
                    
                    if (timeDisplays.length >= 2) {
                        timeDisplays[0].textContent = formatTime(currentTime);
                        timeDisplays[1].textContent = formatTime(duration);
                    }
                }
            } catch (e) {
                // Ignore errors when player isn't ready
            }
        }
    }, 100); // Faster update for smoother slider
    
    // Populate video selector dropdown with correct options
    if (videoselector) {
        videoselector.innerHTML = '';
        Videos_TITLES.forEach((title, index) => {
            const option = document.createElement('option');
            option.value = index.toString();
            option.textContent = `Video ${index + 1} - ${title}`;
            videoselector.appendChild(option);
        });
        videoselector.value = '0';
    }
    
    updatePlaylistDisplay();
    
    if (videoselector) {
        videoselector.addEventListener('change', (e) => {
            const newIndex = parseInt(e.target.value);
            console.log('Video selector changed to index:', newIndex, 'Video ID:', Videos_VIDEO_IDS[newIndex]);
            currentVideosIndex = newIndex; // Update the global index
            if (VideosPlayer && Videos_VIDEO_IDS[newIndex]) {
                VideosPlayer.loadVideoById(Videos_VIDEO_IDS[newIndex]);
                const nowPlaying = document.getElementById('VideosNowPlaying');
                if (nowPlaying) {
                    nowPlaying.textContent = `Now Playing: ${Videos_TITLES[newIndex] || `Video ${newIndex + 1}`}`;
                }
                updatePlaylistDisplay();
                
                const playPauseBtn = document.getElementById('VideosPlayPauseBtn');
                if (playPauseBtn) {
                    playPauseBtn.textContent = '⏸';
                    mediaPlayerStates.Videos.playing = true;
                    updateMediaStatus('Videos', mediaPlayerStates.Videos.muted ? 'Playing (Muted)' : 'Playing');
                }
            }
        });
    }


    
    if (prevVideoBtn) {
        prevVideoBtn.addEventListener('click', () => {
            if (currentVideosIndex > 0) {
                const newIndex = currentVideosIndex - 1;
                console.log('Previous button clicked, switching to index:', newIndex);
                switchToVideos(newIndex);
            }
        });
    }
    
    if (nextVideoBtn) {
        nextVideoBtn.addEventListener('click', () => {
            if (currentVideosIndex < Videos_VIDEO_IDS.length - 1) {
                const newIndex = currentVideosIndex + 1;
                console.log('Next button clicked, switching to index:', newIndex);
                switchToVideos(newIndex);
            }
        });
    }
    
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
            if (!VideosPlayer) return;
            
            if (mediaPlayerStates.Videos.playing) {
                VideosPlayer.pauseVideo();
            } else {
                VideosPlayer.playVideo();
            }
        });
    }
    
    if (stopBtn) {
        stopBtn.addEventListener('click', () => {
            if (!VideosPlayer) return;
            VideosPlayer.stopVideo();
            playPauseBtn.textContent = '▶';
            mediaPlayerStates.Videos.playing = false;
            updateMediaStatus('Videos', 'Stopped');
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentVideosIndex > 0) {
                const newIndex = currentVideosIndex - 1;
                console.log('Videos previous button clicked, switching to index:', newIndex);
                switchToVideos(newIndex);
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentVideosIndex < Videos_VIDEO_IDS.length - 1) {
                const newIndex = currentVideosIndex + 1;
                console.log('Videos next button clicked, switching to index:', newIndex);
                switchToVideos(newIndex);
            }
        });
    }
    
    if (muteBtn) {
        muteBtn.addEventListener('click', () => {
            if (!VideosPlayer) return;
            
            if (mediaPlayerStates.Videos.muted) {
                VideosPlayer.unMute();
                muteBtn.textContent = '🔊';
                mediaPlayerStates.Videos.muted = false;
                VideosPlayer.setVolume(mediaPlayerStates.Videos.volume);
                updateMediaStatus('Videos', 'Playing');
            } else {
                VideosPlayer.mute();
                muteBtn.textContent = '🔇';
                mediaPlayerStates.Videos.muted = true;
                updateMediaStatus('Videos', 'Playing (Muted)');
            }
        });
    }
}
function switchToVideos(index) {
    if (!VideosPlayer || !Videos_VIDEO_IDS[index]) {
        console.error('Cannot switch to Videos:', index, 'Video ID:', Videos_VIDEO_IDS[index]);
        return;
    }
    
    console.log('Switching to Videos index:', index, 'Video ID:', Videos_VIDEO_IDS[index]);
    
    const videoselector = document.getElementById('videoselector');
    const nowPlaying = document.getElementById('VideosNowPlaying');
    
    currentVideosIndex = index;
    VideosPlayer.loadVideoById(Videos_VIDEO_IDS[index]);
    
    if (videoselector) {
        videoselector.value = index.toString();
    }
    
    if (nowPlaying) {
        nowPlaying.textContent = `Now Playing: ${Videos_TITLES[index] || `Video ${index + 1}`}`;
    }
    
    updatePlaylistDisplay();
    
    const playPauseBtn = document.getElementById('VideosPlayPauseBtn');
    if (playPauseBtn) {
        playPauseBtn.textContent = '⏸';
        mediaPlayerStates.Videos.playing = true;
        updateMediaStatus('Videos', mediaPlayerStates.Videos.muted ? 'Playing (Muted)' : 'Playing');
    }
}

function updatePlaylistDisplay() {
    const playlistCounter = document.getElementById('playlistCounter');
    const prevVideoBtn = document.getElementById('prevVideoBtn');
    const nextVideoBtn = document.getElementById('nextVideoBtn');
    
    if (playlistCounter) {
        playlistCounter.textContent = `${currentVideosIndex + 1} / ${Videos_VIDEO_IDS.length}`;
    }
    
    if (prevVideoBtn) {
        prevVideoBtn.disabled = currentVideosIndex === 0;
        prevVideoBtn.style.opacity = currentVideosIndex === 0 ? '0.5' : '1';
    }
    
    if (nextVideoBtn) {
        nextVideoBtn.disabled = currentVideosIndex === Videos_VIDEO_IDS.length - 1;
        nextVideoBtn.style.opacity = currentVideosIndex === Videos_VIDEO_IDS.length - 1 ? '0.5' : '1';
    }
}

function updateMediaStatus(player, status) {
    const statusElement = document.querySelector(`#window-${player === 'main' ? 'video' : player} .media-status`);
    if (statusElement) {
        statusElement.textContent = status;
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Album Promo Popup Functions
function createEventPromoPopup() {
    const popup = document.createElement('div');
    popup.className = 'album-promo-popup';
    popup.id = 'eventPromoPopup';
    
    if (window.IS_MOBILE_DEVICE) {
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
    } else {
        const x = Math.random() * (window.innerWidth - 500) + 50;
        const y = Math.random() * (window.innerHeight - 400) + 50;
        popup.style.left = x + 'px';
        popup.style.top = y + 'px';
    }
    
    popup.style.zIndex = '15000';
    popup.style.width = '300px';
    popup.style.height = '450px';
    
    popup.innerHTML = `
        <div class="album-popup-header">
            <div class="album-popup-title">
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23ff0000'%3E%3Cpath d='M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zM7 4h2v5H7V4zM7 11h2v2H7v-2z'/%3E%3C/svg%3E" class="error-icon" alt="Event">
                🎉 Upcoming Event Alert!
            </div>
            <button class="album-popup-close" onclick="closeEventPromoPopup()">×</button>
        </div>
        <div class="album-popup-content">
            <div class="event-flyer-container" onclick="window.open('${EVENT_PROMO.eventUrl}', '_blank')" style="cursor: pointer;">
                <img src="${EVENT_PROMO.flyerImage}" alt="${EVENT_PROMO.eventTitle}" style="width: 100%; height: auto; border: 2px inset #c0c0c0;">
            </div>
            <div class="event-details" style="margin-top: 10px; text-align: center;">
                <h3 style="color: #000080; margin-bottom: 5px;">${EVENT_PROMO.eventTitle}</h3>
                <p style="margin-bottom: 3px;"><strong>Date:</strong> ${EVENT_PROMO.eventDate}</p>
                <p style="margin-bottom: 10px;"><strong>Location:</strong> ${EVENT_PROMO.eventLocation}</p>
                <button onclick="window.open('${EVENT_PROMO.eventUrl}', '_blank')" style="padding: 8px 16px; background: #c0c0c0; border: 2px outset #c0c0c0; cursor: pointer; font-weight: bold;">
                    Get Tickets / More Info
                </button>
            </div>
            <div class="album-popup-footer">
                <p style="font-size: 10px; color: #666; margin-top: 15px;">
                    Click anywhere on the flyer for details. Auto-close in 30 seconds.
                </p>
            </div>
        </div>
    `;
    
    document.body.appendChild(popup);
    makeAlbumPopupDraggable(popup);
    
    setTimeout(() => {
        closeEventPromoPopup();
    }, 30000);
    
    return popup;
}

// Close album promo popup function
function closeEventPromoPopup() {
    const popup = document.getElementById('eventPromoPopup');
    if (popup) {
        popup.remove();
    }
}

// Make album popup draggable
function makeAlbumPopupDraggable(popup) {
    const header = popup.querySelector('.album-popup-header');
    let isDragging = false;
    let currentX, currentY, initialX, initialY;
    
    header.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('album-popup-close')) return;
        isDragging = true;
        popup.style.zIndex = '15001';
        initialX = e.clientX - popup.offsetLeft;
        initialY = e.clientY - popup.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            
            const maxX = window.innerWidth - popup.offsetWidth;
            const maxY = window.innerHeight - popup.offsetHeight - 36;
            
            currentX = Math.max(0, Math.min(currentX, maxX));
            currentY = Math.max(0, Math.min(currentY, maxY));
            
            popup.style.left = currentX + 'px';
            popup.style.top = currentY + 'px';
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}

// Enhanced clock and countdown functionality
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const clockElement = document.getElementById('clock');
    if (clockElement) {
        clockElement.textContent = timeString;
    }
    
    // Update countdown
    updateCountdown();
}

function updateCountdown() {
    const nextDateElement = document.getElementById('nextDate');
    if (!nextDateElement) return;
    
    // Check if countdown is disabled or no date is set
    if (!DROP_DATE_CONFIG.enabled || !DROP_DATE_CONFIG.date) {
        nextDateElement.textContent = DROP_DATE_CONFIG.tbaText;
        nextDateElement.style.color = "#0000ff";
        nextDateElement.style.fontWeight = "normal";
        nextDateElement.style.animation = "none";
        return;
    }
    
    const now = new Date();
    const timeLeft = DROP_DATE_CONFIG.date - now;
    
    if (timeLeft <= 0) {
        // Drop date has passed
        nextDateElement.textContent = "DROPPED!";
        nextDateElement.style.color = "#ff0000";
        nextDateElement.style.fontWeight = "bold";
        nextDateElement.style.animation = "flash 1s infinite";
        return;
    }
    
    // Calculate time units
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    // Format the countdown display
    let countdownText = "";
    
    if (days > 0) {
        countdownText = `${days}d ${hours}h`;
    } else if (hours > 0) {
        countdownText = `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
        countdownText = `${minutes}m ${seconds}s`;
    } else {
        countdownText = `${seconds}s`;
    }
    
    nextDateElement.textContent = countdownText;
    
    // Add visual effects as we get closer
    if (minutes < 10 && days === 0 && hours === 0) {
        // Less than 10 minutes - RED AND FLASHING!
        nextDateElement.style.color = "#ff0000";
        nextDateElement.style.fontWeight = "bold";
        nextDateElement.style.animation = "flash 0.5s infinite";
    } else if (days === 0 && hours < 1) {
        // Less than 1 hour - make it red and bold (no flash yet)
        nextDateElement.style.color = "#ff0000";
        nextDateElement.style.fontWeight = "bold";
        nextDateElement.style.animation = "none";
    } else if (days === 0) {
        // Same day - make it orange
        nextDateElement.style.color = "#ff6600";
        nextDateElement.style.fontWeight = "bold";
        nextDateElement.style.animation = "none";
    } else if (days < 7) {
        // Less than a week - make it blue
        nextDateElement.style.color = "#0000ff";
        nextDateElement.style.fontWeight = "bold";
        nextDateElement.style.animation = "none";
    } else {
        // Normal styling
        nextDateElement.style.color = "black";
        nextDateElement.style.fontWeight = "normal";
        nextDateElement.style.animation = "none";
    }
}

// Optional: Function to programmatically enable/disable countdown
function setDropCountdown(enabled, dateString = null, customTbaText = null) {
    DROP_DATE_CONFIG.enabled = enabled;
    
    if (enabled && dateString) {
        DROP_DATE_CONFIG.date = new Date(dateString);
    }
    
    if (customTbaText) {
        DROP_DATE_CONFIG.tbaText = customTbaText;
    }
    
    // Immediately update display
    updateCountdown();
}

// Create mannivirus pixels
function createMannivirusPixels() {
    const pixelContainer = document.querySelector('.mannivirus-pixels');
    if (!pixelContainer) return;
    
    const numPixels = 8;
    
    for (let i = 0; i < numPixels; i++) {
        const pixel = document.createElement('div');
        pixel.className = 'mannivirus-pixel';
        
        const x = Math.random() * (window.innerWidth - 10);
        const y = Math.random() * (window.innerHeight - 50);
        
        pixel.style.left = x + 'px';
        pixel.style.top = y + 'px';
        
        pixel.addEventListener('click', triggerMannivirus);
        
        pixelContainer.appendChild(pixel);
    }
}

// Trigger the mannivirus
function triggerMannivirus() {
    if (mannivirusTriggered) return;
    mannivirusTriggered = true;
    
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const popupWidth = 320;
    const popupHeight = 240;
    
    const cols = Math.floor(screenWidth / popupWidth);
    const rows = Math.floor((screenHeight - 36) / popupHeight);
    
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            setTimeout(() => {
                createMannivirusPopup(col * popupWidth, row * popupHeight);
            }, (row * cols + col) * 50);
        }
    }
}

// Create a mannivirus popup
function createMannivirusPopup(x = null, y = null) {
    popupCount++;
    
    const popup = document.createElement('div');
    popup.className = 'popup-window';
    popup.id = `popup-${popupCount}`;
    popup.style.zIndex = popupZIndex++;
    
    if (x !== null && y !== null) {
        popup.style.left = x + 'px';
        popup.style.top = y + 'px';
    } else {
        popup.style.left = Math.random() * (window.innerWidth - 320) + 'px';
        popup.style.top = Math.random() * (window.innerHeight - 276) + 'px';
    }
    
    const errorMessages = [
        "SYSTEM ERROR: Memory overflow detected!",
        "WARNING: Mannivirus infection spreading...",
        "ERROR 404: Sanity not found",
        "CRITICAL: Desktop contamination in progress",
        "ALERT: Recursive popup syndrome activated",
        "VIRUS DETECTED: Please do not resist",
        "SYSTEM FAILURE: Too many windows open",
        "MANNIVIRUS.EXE has performed an illegal operation"
    ];
    
    const randomMessage = errorMessages[Math.floor(Math.random() * errorMessages.length)];
    
    popup.innerHTML = `
        <div class="popup-header">
            <div class="popup-title">⚠️ System Error ${popupCount}</div>
            <button class="popup-close" onclick="closeMannivirusPopup('${popup.id}')">×</button>
        </div>
        <div class="popup-content">
            <h2>MANNIVIRUS DETECTED</h2>
            <p>${randomMessage}</p>
            <p>Error Code: 0x${Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase().padStart(6, '0')}</p>
            <p style="font-size: 10px; color: #666; margin-top: 15px;">
                Closing this window will spawn another.<br>
                Refresh the page to stop the madness.
            </p>
        </div>
    `;
    
    document.body.appendChild(popup);
    makePopupDraggable(popup);
}

// Close popup and create new one
function closeMannivirusPopup(popupId) {
    const popup = document.getElementById(popupId);
    if (popup) {
        popup.remove();
        setTimeout(() => {
            createMannivirusPopup();
        }, 100);
    }
}

// Make popup draggable
function makePopupDraggable(popup) {
    const header = popup.querySelector('.popup-header');
    let isDragging = false;
    let currentX, currentY, initialX, initialY;
    
    header.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('popup-close')) return;
        isDragging = true;
        popup.style.zIndex = popupZIndex++;
        initialX = e.clientX - popup.offsetLeft;
        initialY = e.clientY - popup.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            
            const maxX = window.innerWidth - popup.offsetWidth;
            const maxY = window.innerHeight - popup.offsetHeight - 36;
            
            currentX = Math.max(0, Math.min(currentX, maxX));
            currentY = Math.max(0, Math.min(currentY, maxY));
            
            popup.style.left = currentX + 'px';
            popup.style.top = currentY + 'px';
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}
// Toggle between YouTube and Twitch embeds in lounge
function switchLoungeEmbed(platform) {
    const youtubeEmbed = document.getElementById('loungeYouTubeEmbed');
    const twitchEmbed = document.getElementById('loungeTwitchEmbed');
    const youtubeBtn = document.getElementById('showYouTubeBtn');
    const twitchBtn = document.getElementById('showTwitchBtn');
    const nowPlaying = document.getElementById('loungeNowPlaying');
    
    if (platform === 'youtube') {
        // Show YouTube, hide Twitch
        youtubeEmbed.style.display = 'block';
        twitchEmbed.style.display = 'none';
        
        // Update button styles
        youtubeBtn.style.background = '#ff0000';
        youtubeBtn.style.border = '2px outset #ff0000';
        twitchBtn.style.background = '#808080';
        twitchBtn.style.border = '2px inset #808080';
        
        // Update text
        if (nowPlaying) nowPlaying.textContent = '🎵 YouTube Player Active';
        
        // Resume YouTube player if it exists
        if (loungePlayer && loungePlayer.playVideo) {
            loungePlayer.playVideo();
        }
    } else if (platform === 'twitch') {
        // Show Twitch, hide YouTube
        youtubeEmbed.style.display = 'none';
        twitchEmbed.style.display = 'block';
        
        // Update button styles
        twitchBtn.style.background = '#9146ff';
        twitchBtn.style.border = '2px outset #9146ff';
        youtubeBtn.style.background = '#808080';
        youtubeBtn.style.border = '2px inset #808080';
        
        // Update text
        if (nowPlaying) nowPlaying.textContent = '📺 Twitch Clip Active';
        
        // Pause YouTube player if it exists
        if (loungePlayer && loungePlayer.pauseVideo) {
            loungePlayer.pauseVideo();
        }
    }
}
function setupEventListeners() {
    // Start menu functionality
    const startBtn = document.getElementById('startBtn');
    const startMenu = document.getElementById('startMenu');

    if (startBtn && startMenu) {
        startBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            startMenu.style.display = startMenu.style.display === 'none' ? 'block' : 'none';
            startBtn.classList.toggle('active');
        });

        document.addEventListener('click', () => {
            startMenu.style.display = 'none';
            startBtn.classList.remove('active');
        });

        startMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // FIXED: Icon click handlers with proper mobile support
    document.querySelectorAll('.icon').forEach(icon => {
        // Mobile: single tap to open
        if (window.IS_MOBILE_DEVICE) {
            icon.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const appName = icon.dataset.app;
                console.log('Mobile icon clicked:', appName);
                openWindow(appName);
            });
        } else {
            // Desktop: double-click to open, single-click to select
            icon.addEventListener('dblclick', () => {
                const appName = icon.dataset.app;
                openWindow(appName);
            });
            
            icon.addEventListener('click', () => {
                document.querySelectorAll('.icon').forEach(i => i.classList.remove('selected'));
                icon.classList.add('selected');
            });
        }
    });

    // FIXED: Personal icons click handlers with mobile support
    document.querySelectorAll('.personal-icon').forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const appName = icon.dataset.app;
            console.log('Personal icon clicked:', appName);
            openWindow(appName);
        });
    });

    // Start menu item click handlers
    document.querySelectorAll('.start-menu-item[data-app]').forEach(item => {
        item.addEventListener('click', () => {
            const appName = item.dataset.app;
            openWindow(appName);
        });
    });

    // Setup existing window handlers
    setupExistingWindows();

    // Clear desktop selection when clicking on empty space (desktop only)
    if (!window.IS_MOBILE_DEVICE) {
        document.querySelector('.desktop').addEventListener('click', (e) => {
            if (e.target.classList.contains('desktop') || e.target.classList.contains('desktop-icons')) {
                document.querySelectorAll('.icon').forEach(icon => icon.classList.remove('selected'));
            }
        });
    }
}
// Camera Roll System
const cameraRoll = {
    currentIndex: 0,
    canvas: null,
    ctx: null,
    currentTool: 'pen',
    isDrawing: false,
    lastX: 0,
    lastY: 0,
    color: '#000000',
    brushSize: 2,
    startX: 0,
    startY: 0,
    tempCanvas: null,
    
    init() {
        this.canvas = document.getElementById('cameraCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.tempCanvas = document.createElement('canvas');
        
        this.canvas.addEventListener('mousedown', (e) => this.startDraw(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDraw());
        this.canvas.addEventListener('mouseout', () => this.stopDraw());
        
        // Touch support
        this.canvas.addEventListener('touchstart', (e) => { e.preventDefault(); this.startDraw(e.touches[0]); });
        this.canvas.addEventListener('touchmove', (e) => { e.preventDefault(); this.draw(e.touches[0]); });
        this.canvas.addEventListener('touchend', () => this.stopDraw());
        
        this.loadPhoto(0);
    },
    
    loadPhoto(index) {
        if (index < 0 || index >= CAMERA_ROLL_PHOTOS.length) return;
        this.currentIndex = index;
        
        const img = new Image();
        img.onload = () => {
            this.canvas.width = img.width;
            this.canvas.height = img.height;
            this.ctx.drawImage(img, 0, 0);
            
            this.tempCanvas.width = img.width;
            this.tempCanvas.height = img.height;
        };
        img.src = CAMERA_ROLL_PHOTOS[index];
        
        const counter = document.getElementById('photoCounter');
        if (counter) counter.textContent = `${index + 1} / ${CAMERA_ROLL_PHOTOS.length}`;
    },
    
    prevPhoto() {
        if (this.currentIndex > 0) this.loadPhoto(this.currentIndex - 1);
    },
    
    nextPhoto() {
        if (this.currentIndex < CAMERA_ROLL_PHOTOS.length - 1) this.loadPhoto(this.currentIndex + 1);
    },
    
    setTool(tool) {
        this.currentTool = tool;
        document.querySelectorAll('.camera-tool-btn').forEach(btn => btn.style.background = '#c0c0c0');
        const btn = document.getElementById('tool' + tool.charAt(0).toUpperCase() + tool.slice(1));
        if (btn) btn.style.background = '#808080';
    },
    
    setColor(color) {
        this.color = color;
    },
    
    setBrushSize(size) {
        this.brushSize = size;
        const display = document.getElementById('brushSizeDisplay');
        if (display) display.textContent = size;
    },
    
    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    },
    
    startDraw(e) {
        this.isDrawing = true;
        const pos = this.getMousePos(e);
        this.lastX = pos.x;
        this.lastY = pos.y;
        this.startX = pos.x;
        this.startY = pos.y;
        
        // Save current state for shape tools
        this.tempCanvas.getContext('2d').drawImage(this.canvas, 0, 0);
    },
    
    draw(e) {
        if (!this.isDrawing) return;
        
        const pos = this.getMousePos(e);
        this.ctx.strokeStyle = this.color;
        this.ctx.fillStyle = this.color;
        this.ctx.lineWidth = this.brushSize;
        this.ctx.lineCap = 'round';
        
        if (this.currentTool === 'pen') {
            this.ctx.beginPath();
            this.ctx.moveTo(this.lastX, this.lastY);
            this.ctx.lineTo(pos.x, pos.y);
            this.ctx.stroke();
        } else if (this.currentTool === 'eraser') {
            this.ctx.clearRect(pos.x - this.brushSize/2, pos.y - this.brushSize/2, this.brushSize, this.brushSize);
        } else if (this.currentTool === 'line') {
            this.ctx.putImageData(this.tempCanvas.getContext('2d').getImageData(0, 0, this.canvas.width, this.canvas.height), 0, 0);
            this.ctx.beginPath();
            this.ctx.moveTo(this.startX, this.startY);
            this.ctx.lineTo(pos.x, pos.y);
            this.ctx.stroke();
        } else if (this.currentTool === 'rect') {
            this.ctx.putImageData(this.tempCanvas.getContext('2d').getImageData(0, 0, this.canvas.width, this.canvas.height), 0, 0);
            this.ctx.strokeRect(this.startX, this.startY, pos.x - this.startX, pos.y - this.startY);
        } else if (this.currentTool === 'circle') {
            this.ctx.putImageData(this.tempCanvas.getContext('2d').getImageData(0, 0, this.canvas.width, this.canvas.height), 0, 0);
            const radius = Math.sqrt(Math.pow(pos.x - this.startX, 2) + Math.pow(pos.y - this.startY, 2));
            this.ctx.beginPath();
            this.ctx.arc(this.startX, this.startY, radius, 0, 2 * Math.PI);
            this.ctx.stroke();
        }
        
        this.lastX = pos.x;
        this.lastY = pos.y;
    },
    
    stopDraw() {
        this.isDrawing = false;
    },
    
    clearDrawing() {
        this.loadPhoto(this.currentIndex);
    },
    
    saveImage() {
        const link = document.createElement('a');
        link.download = `edited-photo-${this.currentIndex + 1}.png`;
        link.href = this.canvas.toDataURL();
        link.click();
    }
};

function initCameraRoll() {
    cameraRoll.init();
}

window.cameraRoll = cameraRoll;
window.switchLoungeEmbed = switchLoungeEmbed;
// Forum tab switching function
function switchForumTab(tab) {
    const feedView = document.getElementById('feedView');
    const fullView = document.getElementById('fullView');
    const feedTab = document.getElementById('feedTab');
    const fullTab = document.getElementById('fullTab');
    
    if (!feedView || !fullView || !feedTab || !fullTab) return;
    
    if (tab === 'feed') {
        feedView.style.display = 'block';
        fullView.style.display = 'none';
        feedTab.style.background = '#fff';
        feedTab.style.borderStyle = 'inset';
        feedTab.style.fontWeight = 'bold';
        fullTab.style.background = '#c0c0c0';
        fullTab.style.borderStyle = 'outset';
        fullTab.style.fontWeight = 'normal';
    } else {
        feedView.style.display = 'none';
        fullView.style.display = 'block';
        feedTab.style.background = '#c0c0c0';
        feedTab.style.borderStyle = 'outset';
        feedTab.style.fontWeight = 'normal';
        fullTab.style.background = '#fff';
        fullTab.style.borderStyle = 'inset';
        fullTab.style.fontWeight = 'bold';
    }
}

window.switchForumTab = switchForumTab;

/* ============================================================
   FORUM — Members-only live chat backed by Supabase
   ============================================================ */

let _forumSub     = null;          // Realtime channel handle
let _forumInited  = false;         // Has the initial load run?
let _forumPostIds = new Set();     // Tracks IDs already rendered

/* Called when the forum window opens (or re-opens) */
async function initForum() {
    if (!_forumInited) {
        _forumInited = true;
        await _forumLoadAll();
        _forumSubscribeRealtime();
    }
    forumUpdateInputState();
}

/* Fetch all posts oldest → newest and render them */
async function _forumLoadAll() {
    const container = document.getElementById('forumMessages');
    if (!container) return;

    container.innerHTML = '<div class="forum-loading">Loading messages...</div>';
    _forumPostIds.clear();

    const { data, error } = await supabaseClient
        .from('forum_posts')
        .select('*')
        .order('created_at', { ascending: true });

    container.innerHTML = '';

    if (error) {
        container.innerHTML = '<div class="forum-empty">Could not load messages. Try again later.</div>';
        console.error('Forum load error:', error);
        return;
    }

    if (!data || data.length === 0) {
        container.innerHTML = '<div class="forum-empty">No messages yet — be the first to post!</div>';
        return;
    }

    data.forEach(post => {
        container.appendChild(_forumBuildEl(post));
        _forumPostIds.add(post.id);
    });

    // Scroll to bottom so newest message is visible
    container.scrollTop = container.scrollHeight;
}

/* Subscribe to real-time INSERT / UPDATE / DELETE */
function _forumSubscribeRealtime() {
    if (_forumSub) supabaseClient.removeChannel(_forumSub);

    _forumSub = supabaseClient
        .channel('forum_posts_rt')
        .on('postgres_changes',
            { event: '*', schema: 'public', table: 'forum_posts' },
            payload => {
                const container = document.getElementById('forumMessages');
                if (!container) return;

                if (payload.eventType === 'INSERT') {
                    if (_forumPostIds.has(payload.new.id)) return;
                    const empty = container.querySelector('.forum-empty');
                    if (empty) empty.remove();
                    container.appendChild(_forumBuildEl(payload.new));
                    _forumPostIds.add(payload.new.id);
                    // Auto-scroll only if the user is already near the bottom
                    const nearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 80;
                    if (nearBottom) container.scrollTop = container.scrollHeight;

                } else if (payload.eventType === 'UPDATE') {
                    const textEl = document.getElementById('forum-text-' + payload.new.id);
                    if (textEl) textEl.textContent = payload.new.content;

                } else if (payload.eventType === 'DELETE') {
                    const el = container.querySelector('[data-forum-id="' + payload.old.id + '"]');
                    if (el) el.remove();
                    _forumPostIds.delete(payload.old.id);
                }
            })
        .subscribe();
}

/* Build a single message DOM element */
function _forumBuildEl(post) {
    const currentUserId = Auth.currentUser ? Auth.currentUser.id : null;
    const isOwn = !!currentUserId && post.user_id === currentUserId;

    const wrapper = document.createElement('div');
    wrapper.className = 'forum-msg' + (isOwn ? ' forum-own' : '');
    wrapper.dataset.forumId = post.id;

    // Timestamp
    const d = new Date(post.created_at);
    const timeStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Avatar
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'forum-avatar';
    if (post.avatar_url) {
        const img = document.createElement('img');
        img.src = post.avatar_url;
        img.alt = post.display_name || 'avatar';
        avatarDiv.appendChild(img);
    } else {
        avatarDiv.textContent = '\uD83D\uDC64'; // 👤
    }

    // Bubble wrap
    const bubbleWrap = document.createElement('div');
    bubbleWrap.className = 'forum-bubble-wrap';

    // Meta row (name + time)
    const metaRow = document.createElement('div');
    metaRow.className = 'forum-meta-row';
    const authorSpan = document.createElement('span');
    authorSpan.className = 'forum-author';
    authorSpan.textContent = post.display_name || 'Anonymous';
    const timeSpan = document.createElement('span');
    timeSpan.className = 'forum-time';
    timeSpan.textContent = timeStr;
    metaRow.appendChild(authorSpan);
    metaRow.appendChild(timeSpan);

    // Text bubble
    const bubble = document.createElement('div');
    bubble.className = 'forum-bubble';
    const textSpan = document.createElement('span');
    textSpan.className = 'forum-text';
    textSpan.id = 'forum-text-' + post.id;
    textSpan.textContent = post.content;
    bubble.appendChild(textSpan);

    bubbleWrap.appendChild(metaRow);
    bubbleWrap.appendChild(bubble);

    // Edit / Delete buttons (own messages only)
    if (isOwn) {
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'forum-msg-actions';

        const editBtn = document.createElement('button');
        editBtn.className = 'forum-msg-act-btn';
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', function() { forumEditPost(post.id); });

        const delBtn = document.createElement('button');
        delBtn.className = 'forum-msg-act-btn forum-del-btn';
        delBtn.textContent = 'Delete';
        delBtn.addEventListener('click', function() { forumDeletePost(post.id); });

        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(delBtn);
        bubbleWrap.appendChild(actionsDiv);
    }

    wrapper.appendChild(avatarDiv);
    wrapper.appendChild(bubbleWrap);
    return wrapper;
}

/* Enable / disable input based on current auth + role */
function forumUpdateInputState() {
    const input   = document.getElementById('forumInput');
    const sendBtn = document.getElementById('forumSendBtn');
    const uploadBtn = document.getElementById('forumUploadBtn');
    const status  = document.getElementById('forumStatusText');
    if (!input) return;

    const user     = Auth.currentUser;
    const profile  = Auth.currentProfile;
    const isMember = profile && profile.role === 'member';

    if (!user) {
        input.disabled    = true;
        input.placeholder = 'Sign in to post in the forum...';
        if (sendBtn)   sendBtn.disabled   = true;
        if (uploadBtn) uploadBtn.disabled = true;
        if (status)    status.textContent = 'Not signed in \u2014 members only';
    } else if (!isMember) {
        input.disabled    = true;
        input.placeholder = 'Only members can post \u2014 contact us to get member status';
        if (sendBtn)   sendBtn.disabled   = true;
        if (uploadBtn) uploadBtn.disabled = true;
        if (status)    status.textContent = 'Signed in as ' + (profile ? profile.display_name || user.email : user.email) + ' (groupie) \u2014 member status required to post';
    } else {
        input.disabled    = false;
        input.placeholder = 'Type a message\u2026 (Enter to send, Shift+Enter for new line)';
        if (sendBtn)   sendBtn.disabled   = false;
        if (uploadBtn) uploadBtn.disabled = false;
        if (status)    status.textContent = 'Posting as ' + (profile.display_name || user.email);
    }
}

/* Submit a new post */
async function forumSubmitPost() {
    const input = document.getElementById('forumInput');
    if (!input || input.disabled) return;

    const content = input.value.trim();
    if (!content) return;

    const user    = Auth.currentUser;
    const profile = Auth.currentProfile;
    if (!user || !profile || profile.role !== 'member') return;

    const sendBtn = document.getElementById('forumSendBtn');
    if (sendBtn) sendBtn.disabled = true;
    input.disabled = true;

    const { error } = await supabaseClient.from('forum_posts').insert({
        user_id:      user.id,
        display_name: profile.display_name || user.email,
        avatar_url:   profile.avatar_url   || null,
        content:      content
    });

    input.disabled = false;
    if (sendBtn) sendBtn.disabled = false;

    if (!error) {
        input.value = '';
        input.focus();
    } else {
        console.error('Forum post error:', error);
        const statusEl = document.getElementById('forumStatusText');
        if (statusEl) statusEl.textContent = 'Error sending \u2014 ' + error.message;
    }
}

/* Insert an emoji at the cursor position in the textarea */
function forumAddEmoji(emoji) {
    const input = document.getElementById('forumInput');
    if (!input || input.disabled) return;
    const start = input.selectionStart;
    const end   = input.selectionEnd;
    input.value = input.value.slice(0, start) + emoji + input.value.slice(end);
    input.selectionStart = input.selectionEnd = start + emoji.length;
    input.focus();
}

/* Clear the textarea (trash button) */
function forumClearInput() {
    const input = document.getElementById('forumInput');
    if (input) { input.value = ''; input.focus(); }
}

/* Enter edit mode on a post */
function forumEditPost(postId) {
    const msgEl  = document.querySelector('[data-forum-id="' + postId + '"]');
    const textEl = document.getElementById('forum-text-' + postId);
    if (!textEl || !msgEl) return;

    const original = textEl.textContent;
    msgEl.dataset.originalContent = original;

    const bubble = textEl.closest('.forum-bubble');
    if (!bubble) return;

    // Replace bubble contents with a textarea + Save/Cancel
    bubble.innerHTML = '';

    const ta = document.createElement('textarea');
    ta.className = 'forum-edit-ta';
    ta.id   = 'forum-edit-ta-' + postId;
    ta.rows = 2;
    ta.value = original;

    const btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;gap:2px;margin-top:3px;justify-content:flex-end;';

    const saveBtn = document.createElement('button');
    saveBtn.className   = 'forum-msg-act-btn';
    saveBtn.textContent = 'Save';
    saveBtn.addEventListener('click', function() { forumSaveEdit(postId); });

    const cancelBtn = document.createElement('button');
    cancelBtn.className   = 'forum-msg-act-btn';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', function() { forumCancelEdit(postId); });

    btnRow.appendChild(saveBtn);
    btnRow.appendChild(cancelBtn);
    bubble.appendChild(ta);
    bubble.appendChild(btnRow);

    ta.focus();
    ta.setSelectionRange(ta.value.length, ta.value.length);
}

/* Save an edited post */
async function forumSaveEdit(postId) {
    const ta = document.getElementById('forum-edit-ta-' + postId);
    if (!ta) return;
    const newContent = ta.value.trim();
    if (!newContent) return;

    const { error } = await supabaseClient
        .from('forum_posts')
        .update({ content: newContent, updated_at: new Date().toISOString() })
        .eq('id', postId);

    if (!error) {
        // Update DOM immediately (realtime will also fire but this is instant)
        const msgEl = document.querySelector('[data-forum-id="' + postId + '"]');
        const bubble = msgEl ? msgEl.querySelector('.forum-bubble') : null;
        if (bubble) {
            bubble.innerHTML = '';
            const span = document.createElement('span');
            span.className = 'forum-text';
            span.id        = 'forum-text-' + postId;
            span.textContent = newContent;
            bubble.appendChild(span);
        }
    } else {
        console.error('Forum edit error:', error);
        forumCancelEdit(postId); // restore original on failure
    }
}

/* Cancel edit — restore original text */
function forumCancelEdit(postId) {
    const msgEl = document.querySelector('[data-forum-id="' + postId + '"]');
    if (!msgEl) return;
    const original = msgEl.dataset.originalContent || '';
    const bubble   = msgEl.querySelector('.forum-bubble');
    if (!bubble) return;
    bubble.innerHTML = '';
    const span = document.createElement('span');
    span.className   = 'forum-text';
    span.id          = 'forum-text-' + postId;
    span.textContent = original;
    bubble.appendChild(span);
}

/* Delete a post (own posts only) */
async function forumDeletePost(postId) {
    if (!confirm('Delete this message?')) return;

    const { error } = await supabaseClient
        .from('forum_posts')
        .delete()
        .eq('id', postId);

    if (!error) {
        const el = document.querySelector('[data-forum-id="' + postId + '"]');
        if (el) el.remove();
        _forumPostIds.delete(postId);
    } else {
        console.error('Forum delete error:', error);
    }
}

// Expose to global scope (used by inline onclick handlers in the toolbar)
window.initForum           = initForum;
window.forumUpdateInputState = forumUpdateInputState;
window.forumSubmitPost     = forumSubmitPost;
window.forumAddEmoji       = forumAddEmoji;
window.forumClearInput     = forumClearInput;
window.forumEditPost       = forumEditPost;
window.forumSaveEdit       = forumSaveEdit;
window.forumCancelEdit     = forumCancelEdit;
window.forumDeletePost     = forumDeletePost;

// Ticket popup: creates a release-style popup with a square image and a "Get Tickets Here!" link.
function createTicketPopup(options = {}) {
    // Do not create if a similar popup already exists
    if (document.querySelector('.album-promo-popup') || document.getElementById('ticketPopup')) return;

    const imageSrc = options.image || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="100%" height="100%" fill="%23f0f0f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="20" fill="%23666">Add your image here</text></svg>';
    const ticketUrl = options.url || 'https://ticketmaster.com/super-duper-useless-show-atlanta-georgia-02-06-2026/event/0E006427C015711F?brid=g23Qt_2aWQwsu-rijvk7pA';

    const popup = document.createElement('div');
    popup.className = 'album-promo-popup';
    popup.id = 'ticketPopup';
    popup.style.left = '50%';
    popup.style.top = '80px';
    popup.style.transform = 'translateX(-50%)';

    popup.innerHTML = `
        <div class="album-popup-header">
            <div class="album-popup-title">🎟 Upcoming Drop</div>
            <button class="album-popup-close" id="ticketPopupClose">×</button>
        </div>
        <div class="album-popup-content" style="display: flex !important; flex-direction: column !important; align-items: center !important; justify-content: center !important; text-align: center !important; padding: 20px;">
            <div class="ticket-inner" style="display: flex !important; flex-direction: column !important; align-items: center !important; justify-content: center !important; gap: 15px !important; width: 100%;">
                <div class="ticket-image-frame" style="width: 200px !important; height: 200px !important; border: 2px inset #c0c0c0 !important; background: white !important; display: flex !important; align-items: center !important; justify-content: center !important; padding: 4px !important;">
                    <img id="ticketPopupImg" src="${imageSrc}" alt="Ticket Image" style="width: 100% !important; height: 100% !important; object-fit: cover !important; display: block !important;" />
                </div>
                <div class="ticket-text-area" style="display: flex !important; flex-direction: column !important; align-items: center !important; gap: 12px !important; width: 100% !important; text-align: center !important;">
                    <div class="ticket-desc" style="font-size: 14px !important; font-weight: bold !important; line-height: 1.4 !important; animation: flashRedWhite 1s infinite !important; -webkit-animation: flashRedWhite 1s infinite !important;">Come See B6 and BABY KIA Live at The SUPER DUPER USELESS SHOW! Friday February 06, Get Tickets Below!</div>
                    <a id="ticketPopupLink" href="${ticketUrl}" target="_blank" rel="noopener" class="ticket-btn" style="display: inline-block !important; padding: 8px 16px !important; background: #000080 !important; color: white !important; border: 2px outset #000080 !important; text-decoration: none !important; font-weight: bold !important; text-align: center !important; font-size: 12px !important; cursor: pointer !important;">Get Tickets Here!</a>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(popup);

    // Center vertically if possible (desktop), mobile CSS will override
    setTimeout(() => {
        if (popup.offsetWidth) {
            popup.style.left = `calc(50%)`;
            popup.style.transform = 'translateX(-50%)';
        }
    }, 50);

    // Flash text red and white
    const textDesc = popup.querySelector('.ticket-desc');
    if (textDesc) {
        let isRed = true;
        setInterval(() => {
            textDesc.style.color = isRed ? '#ff0000' : '#ffffff';
            isRed = !isRed;
        }, 500);
    }

    const closeBtn = document.getElementById('ticketPopupClose');
    function closePopup() {
        if (!popup) return;
        popup.remove();
    }

    if (closeBtn) closeBtn.addEventListener('click', closePopup);

    // Auto-close after 30 seconds
    setTimeout(() => {
        closePopup();
    }, 30000);
}

// Ticket popup auto-trigger — DISABLED (event passed). Uncomment and update for future ticket drops.
// document.addEventListener('DOMContentLoaded', () => {
//     if (!document.querySelector('.album-promo-popup') && !document.getElementById('ticketPopup')) {
//         createTicketPopup({
//             image: 'z.SuperDuperUselessPromo.png',
//             url: 'https://ticketmaker.com/your-event-url'
//         });
//     }
// });

/* ============================================================
   AUTH — Supabase Google Sign-In + Profile Modal
   Requires: supabase-config.js loaded before script.js
============================================================ */

const Auth = {
    currentUser: null,
    currentProfile: null,

    async init() {
        // Bind click handlers immediately — before any async calls
        // so buttons work even if Supabase is slow or throws
        this._bindHandlers();

        try {
            // Pick up existing session (also handles the OAuth redirect token exchange)
            const { data: { session } } = await supabaseClient.auth.getSession();
            if (session) {
                this.currentUser = session.user;
                await this._loadProfile(session.user.id);
            }
            this._updateUI();

            // React to future sign-in / sign-out events
            supabaseClient.auth.onAuthStateChange(async (event, session) => {
                if (event === 'SIGNED_IN' && session) {
                    this.currentUser = session.user;
                    await this._loadProfile(session.user.id);
                    this._updateUI();
                    // Clean OAuth tokens out of the URL bar after redirect
                    if (window.location.hash || window.location.search.includes('code=')) {
                        history.replaceState(null, '', window.location.pathname);
                    }
                } else if (event === 'SIGNED_OUT') {
                    this.currentUser = null;
                    this.currentProfile = null;
                    this._updateUI();
                }
            });
        } catch (e) {
            console.error('Auth init error:', e);
        }
    },

    async signInWithGoogle() {
        const { error } = await supabaseClient.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: window.location.origin + window.location.pathname }
        });
        if (error) console.error('Sign-in error:', error);
    },

    async signOut() {
        const { error } = await supabaseClient.auth.signOut();
        if (error) console.error('Sign-out error:', error);
    },

    async _loadProfile(userId) {
        const { data, error } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        if (!error && data) this.currentProfile = data;
    },

    _updateUI() {
        const isSignedIn = !!this.currentUser;
        const displayName = this.currentProfile?.display_name
            || this.currentUser?.user_metadata?.full_name
            || 'User';
        const role = this.currentProfile?.role || 'groupie';
        const isMember = role === 'member';
        // Members get their avatar; groupies always get the default icon
        const avatarUrl = isMember
            ? (this.currentProfile?.avatar_url || this.currentUser?.user_metadata?.avatar_url || null)
            : null;

        // Start menu header: user name
        const userNameEl = document.querySelector('.user-name');
        if (userNameEl) userNameEl.textContent = isSignedIn ? displayName : 'User';

        // Start menu header: avatar (members only) / icon
        const userIconEl = document.querySelector('.user-icon');
        if (userIconEl) {
            userIconEl.innerHTML = (isSignedIn && avatarUrl)
                ? `<img src="${avatarUrl}" alt="Profile" class="user-avatar-img">`
                : '👤';
        }

        // Taskbar auth button (desktop)
        const authBtn = document.getElementById('authTaskbarBtn');
        if (authBtn) {
            authBtn.classList.toggle('signed-in', isSignedIn);
            authBtn.title = isSignedIn ? `${displayName} — Settings` : 'Sign In';
        }

        // Start menu auth item text (mobile primary)
        const startMenuAuthText = document.getElementById('startMenuAuthText');
        if (startMenuAuthText) startMenuAuthText.textContent = isSignedIn ? displayName : 'Sign In';

        // Refresh forum input state if the forum window is open
        if (typeof forumUpdateInputState === 'function') forumUpdateInputState();
    },

    _closeStartMenu() {
        const menu = document.getElementById('startMenu');
        if (menu) menu.style.display = 'none';
        document.getElementById('startBtn')?.classList.remove('active');
    },

    _bindHandlers() {
        // Taskbar auth icon
        document.getElementById('authTaskbarBtn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            ProfileModal.open();
        });

        // Start menu auth item
        document.getElementById('startMenuAuthBtn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            this._closeStartMenu();
            ProfileModal.open();
        });

        // Settings menu item — same modal
        document.getElementById('settingsMenuBtn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            this._closeStartMenu();
            ProfileModal.open();
        });
    }
};

/* ---- Profile / Settings Modal ---- */

const ProfileModal = {
    modal: null,

    init() {
        this.modal = document.getElementById('profileModal');
        document.getElementById('profileModalClose')?.addEventListener('click', () => this.close());
        // Close on backdrop click
        this.modal?.addEventListener('click', (e) => { if (e.target === this.modal) this.close(); });
    },

    open() {
        if (!this.modal) return;
        this._render();
        this.modal.style.display = 'flex';
    },

    close() {
        if (!this.modal) return;
        this.modal.style.display = 'none';
    },

    _render() {
        const body = document.getElementById('profileModalBody');
        if (!body) return;
        if (!Auth.currentUser) {
            body.innerHTML = this._signInHTML();
            document.getElementById('googleSignInBtn')?.addEventListener('click', async () => {
                const btn = document.getElementById('googleSignInBtn');
                const errEl = document.getElementById('signInError');
                if (btn) { btn.disabled = true; btn.textContent = 'Redirecting...'; }
                if (errEl) errEl.textContent = '';
                try {
                    const { error } = await supabaseClient.auth.signInWithOAuth({
                        provider: 'google',
                        options: { redirectTo: window.location.href }
                    });
                    if (error) throw error;
                } catch (e) {
                    if (btn) { btn.disabled = false; btn.innerHTML = btn.innerHTML.replace('Redirecting...', 'Sign in with Google'); }
                    if (errEl) errEl.textContent = 'Error: ' + (e.message || e);
                    console.error('OAuth error:', e);
                }
            });
        } else {
            body.innerHTML = this._profileHTML();
            document.getElementById('saveProfileBtn')?.addEventListener('click', () => this._save());
            document.getElementById('signOutBtn')?.addEventListener('click', async () => { await Auth.signOut(); this.close(); });
            document.getElementById('cancelProfileBtn')?.addEventListener('click', () => this.close());
            // Live preview when a file is picked
            document.getElementById('profileAvatarFile')?.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const preview = document.getElementById('avatarPreview');
                const empty   = document.getElementById('avatarEmpty');
                if (preview) { preview.src = URL.createObjectURL(file); preview.style.display = 'block'; }
                if (empty)   empty.style.display = 'none';
            });
        }
    },

    _signInHTML() {
        return `
            <div class="auth-signin-panel">
                <p class="auth-signin-heading">👤 Sign In</p>
                <p class="auth-signin-sub">Sign in to set your display name<br>and personalize your experience.</p>
                <button class="auth-google-btn" id="googleSignInBtn">
                    <svg width="16" height="16" viewBox="0 0 24 24" style="flex-shrink:0">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Sign in with Google
                </button>
                <p id="signInError" style="color:#cc0000;font-size:11px;margin-top:10px;min-height:14px;"></p>
            </div>`;
    },

    _profileHTML() {
        const p = Auth.currentProfile;
        const u = Auth.currentUser;
        const esc = (s) => String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
        const role = p?.role || 'groupie';
        const isMember = role === 'member';

        const avatarSection = isMember ? `
                <label>Profile Picture</label>
                <div class="auth-avatar-upload">
                    <img  id="avatarPreview" class="auth-avatar-preview"
                          src="${esc(p?.avatar_url || '')}" alt="Avatar"
                          ${p?.avatar_url ? '' : 'style="display:none"'}>
                    <div id="avatarEmpty" class="auth-avatar-empty"
                         ${p?.avatar_url ? 'style="display:none"' : ''}>👤</div>
                    <div>
                        <label for="profileAvatarFile" class="auth-btn auth-file-label">Browse...</label>
                        <input type="file" id="profileAvatarFile"
                               accept="image/jpeg,image/png,image/gif,image/webp"
                               style="display:none">
                        <div class="auth-field-hint">JPG, PNG or GIF — max 2MB</div>
                    </div>
                </div>
        ` : '';

        return `
            <div class="auth-profile-panel">
                <label for="profileDisplayName">Display Name</label>
                <input type="text" id="profileDisplayName" class="auth-field"
                    value="${esc(p?.display_name || u?.user_metadata?.full_name || '')}"
                    placeholder="Your name" maxlength="50">

                <label for="profileEmail">Email</label>
                <input type="email" id="profileEmail" class="auth-field"
                    value="${esc(u?.email || '')}" disabled>
                <div class="auth-field-hint">Managed by your Google account</div>

                <label for="profileBio">Bio</label>
                <textarea id="profileBio" class="auth-field" rows="3"
                    placeholder="Say something..." maxlength="200">${esc(p?.bio || '')}</textarea>

                ${avatarSection}

                <div id="profileStatusMsg" class="auth-status-msg"></div>
                <div class="auth-profile-actions">
                    <button class="auth-btn auth-btn-danger" id="signOutBtn">Sign Out</button>
                    <button class="auth-btn" id="cancelProfileBtn">Cancel</button>
                    <button class="auth-btn auth-btn-primary" id="saveProfileBtn">Save</button>
                </div>
            </div>`;
    },

    async _save() {
        const displayName = document.getElementById('profileDisplayName')?.value?.trim();
        const bio = document.getElementById('profileBio')?.value?.trim();
        const statusMsg = document.getElementById('profileStatusMsg');
        const saveBtn = document.getElementById('saveProfileBtn');

        if (!displayName) {
            if (statusMsg) { statusMsg.textContent = 'Display name cannot be empty.'; statusMsg.className = 'auth-status-msg error'; }
            return;
        }
        if (saveBtn) saveBtn.disabled = true;

        const saveData = {
            id: Auth.currentUser.id,
            display_name: displayName,
            bio: bio || '',
            email: Auth.currentUser.email,
            updated_at: new Date().toISOString()
            // NOTE: 'role' is intentionally omitted — only set server-side
        };
        // Members can upload a profile picture to Supabase Storage
        if (Auth.currentProfile?.role === 'member') {
            const file = document.getElementById('profileAvatarFile')?.files?.[0];
            if (file) {
                if (file.size > 2 * 1024 * 1024) {
                    if (statusMsg) { statusMsg.textContent = 'Image must be under 2MB.'; statusMsg.className = 'auth-status-msg error'; }
                    if (saveBtn) saveBtn.disabled = false;
                    return;
                }
                if (statusMsg) { statusMsg.textContent = 'Uploading image...'; statusMsg.className = 'auth-status-msg'; }
                const ext  = file.name.split('.').pop().toLowerCase();
                const path = `${Auth.currentUser.id}/avatar.${ext}`;
                const { error: uploadErr } = await supabaseClient.storage
                    .from('avatars')
                    .upload(path, file, { upsert: true, contentType: file.type });
                if (uploadErr) {
                    if (statusMsg) { statusMsg.textContent = 'Upload failed — ' + uploadErr.message; statusMsg.className = 'auth-status-msg error'; }
                    if (saveBtn) saveBtn.disabled = false;
                    return;
                }
                const { data: urlData } = supabaseClient.storage.from('avatars').getPublicUrl(path);
                saveData.avatar_url = urlData.publicUrl;
            }
        }
        const { error } = await supabaseClient.from('profiles').upsert(saveData);

        if (saveBtn) saveBtn.disabled = false;

        if (error) {
            if (statusMsg) { statusMsg.textContent = 'Error saving — please try again.'; statusMsg.className = 'auth-status-msg error'; }
            console.error('Profile save error:', error);
        } else {
            await Auth._loadProfile(Auth.currentUser.id);
            Auth._updateUI();
            if (statusMsg) { statusMsg.textContent = 'Saved!'; statusMsg.className = 'auth-status-msg success'; }
            setTimeout(() => this.close(), 900);
        }
    }
};

// Boot after DOM is ready
(function initAuth() {
    function run() { ProfileModal.init(); Auth.init(); }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run);
    } else {
        run();
    }
})();
