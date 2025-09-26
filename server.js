const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Handle wildcard subdomain routing for lyrics BEFORE static files
app.get('*', (req, res) => {
    const host = req.get('host');
    console.log('Host:', host);
    console.log('URL:', req.url);

    // Check if it's a lyrics subdomain (both production and localhost)
    const isLyricsSubdomain = host && (host.includes('.lyrics.unmaintained.app') || host.includes('.localhost:3000'));

    if (isLyricsSubdomain) {
        // Serve the same static lyrics page for ALL subdomains - JavaScript will handle the dynamic content
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Lyrics</title>
                <style>
                    body {
                        margin: 0;
                        padding: 80px;
                        background: black;
                        font-family: 'Arial', sans-serif;
                        color: white;
                        text-align: left;
                    }

                    .container {
                        margin-top: 40px;
                        margin-left: 60px;
                    }

                    .instruction {
                        font-size: 2rem;
                        opacity: 0.8;
                        animation: fadeInOut 3s ease-in-out infinite;
                    }

                    @keyframes fadeInOut {
                        0%, 100% { opacity: 0.3; }
                        50% { opacity: 0.8; }
                    }

                    .arrow {
                        font-size: 3rem;
                        margin-bottom: 20px;
                    }

                    .mock-url-bar {
                        background: #2a2a2a;
                        border-radius: 20px;
                        padding: 12px 20px;
                        margin: 30px 0;
                        font-family: monospace;
                        font-size: 14px;
                        color: #ccc;
                        border: 1px solid #444;
                        width: calc(100% - 40px);
                        overflow: hidden;
                        white-space: nowrap;
                        position: relative;
                    }

                    .fallback-text {
                        font-size: 1rem;
                        opacity: 0.6;
                        margin-top: 10px;
                        font-style: italic;
                    }

                    .mock-url-bar::before {
                        content: "🔒";
                        margin-right: 8px;
                        color: #4CAF50;
                    }

                    .mock-url {
                        color: white;
                    }
                </style>
            </head>
            <body>
                <script defer data-domain="lyrics.unmaintained.app" src="https://a.dbuidl.com/js/script.js"></script>
                <div class="container">
                    <div class="arrow">↑</div>
                    <div class="instruction">Look up here for lyrics</div>

                    <div class="mock-url-bar">
                        <span class="mock-url">loading...</span>
                    </div>
                    <div class="fallback-text">
                        (or alternatively here if it doesn't show correctly in the url bar)
                    </div>
                </div>

                <script>
                    // Extract lyric from URL and update display
                    function updateLyricDisplay() {
                        const host = window.location.host;
                        if (host.includes('.localhost:3000') || host.includes('.lyrics.unmaintained.app')) {
                            const subdomain = host.split('.')[0];
                            const lyricText = subdomain.replace(/-/g, ' ');

                            // Update title
                            document.title = lyricText;

                            // Update mock URL bar
                            document.querySelector('.mock-url').textContent = subdomain + '.lyrics.unmaintained.app';
                        }
                    }

                    // Listen for URL changes (when parent window navigates this tab)
                    let lastUrl = window.location.href;
                    setInterval(() => {
                        if (window.location.href !== lastUrl) {
                            lastUrl = window.location.href;
                            updateLyricDisplay();
                        }
                    }, 50);

                    // Initial update
                    updateLyricDisplay();

                    // Listen for postMessage from parent window
                    window.addEventListener('message', (event) => {
                        if (event.data.type === 'updateLyric') {
                            // Update URL using History API
                            window.history.pushState({}, '', event.data.url);
                            // Update display
                            updateLyricDisplay();
                        }
                    });
                </script>
            </body>
            </html>
        `);
    } else {
        // Serve the main homepage
        res.sendFile(path.join(__dirname, 'index.html'));
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Main site: http://localhost:${PORT}`);
    console.log(`Lyrics subdomains: http://*.lyrics.unmaintained.app:${PORT}`);
});