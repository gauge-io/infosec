# Scripts

## fetch-ghost-posts.js

Standalone script to fetch posts from Ghost CMS. Can be run manually or scheduled as a cron job.

### Manual Execution

```bash
npm run fetch-ghost
```

Or directly:
```bash
node scripts/fetch-ghost-posts.js
```

### Setting Up as a Cron Job (24-hour interval)

#### On macOS/Linux:

1. Open your crontab:
```bash
crontab -e
```

2. Add the following line to run daily at 2 AM:
```cron
0 2 * * * cd /Users/gauge/Documents/GitHub/infosec && /usr/local/bin/node scripts/fetch-ghost-posts.js >> /tmp/ghost-fetch.log 2>&1
```

3. Adjust the path to your Node.js installation and project directory as needed.

#### Alternative: Using a Task Scheduler

For macOS, you can also use `launchd`:

1. Create a plist file at `~/Library/LaunchAgents/com.gauge.ghost-fetch.plist`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.gauge.ghost-fetch</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/node</string>
        <string>/Users/gauge/Documents/GitHub/infosec/scripts/fetch-ghost-posts.js</string>
    </array>
    <key>StartInterval</key>
    <integer>86400</integer>
    <key>RunAtLoad</key>
    <true/>
</dict>
</plist>
```

2. Load the service:
```bash
launchctl load ~/Library/LaunchAgents/com.gauge.ghost-fetch.plist
```

### Note

The React component (`BlogSection`) also automatically refetches posts every 24 hours when the page is open. This script is useful for:
- Pre-fetching data before builds
- Logging fetch operations
- Running independently of the web application

