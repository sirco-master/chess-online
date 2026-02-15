# Chess Online

A complete, deployable web-based chess game featuring:
- **Single-player** against AI (Stockfish) with 10 difficulty levels or 6 personality bots
- **Local 2-player mode** 
- **Online multiplayer** with real-time WebSocket gameplay
- **Time controls** (Normal, Rapid, Blitz, Bullet)
- **Game analysis** with move quality evaluation
- **Game history** tracking
- **In-game chat** for online matches
- **Click-to-move** and drag-and-drop support
- **Mobile-optimized** responsive design

## Features

### Game Modes

#### Single-Player Mode (vs AI)
- **Personality Bots**: Choose from 6 unique opponents with distinct playing styles:
  - 👩 **Amelia** - Aggressive Attacker (Intermediate)
  - 👨 **Boris** - Solid Positional (Moderate) 
  - 🧔 **Avi** - Endgame Specialist (Tough)
  - 👩‍🦰 **Elena** - Creative Genius (Hard)
  - 🤴 **Magnus** - Universal Player (Extreme)
  - 👸 **Sophia** - Strategic Planner (Insane)

- **Classic Difficulty**: Traditional ELO-based opponents (150-3000 ELO)
  - Practice (150), Beginner (300), Easy (500), Intermediate (800)
  - Moderate (1200), Tough (1500), Hard (1800), Insane (2100)
  - Extreme (2500), Impossible (3000)

- **Features**:
  - Choose your color (white or black)
  - Hint button (3 uses per game) - shows best move
  - Undo button (5 uses per game) - reverts last two moves
  
#### 2-Player Mode
- Local pass-and-play
- No hints or undo
- Board auto-flips for each player

#### Online Multiplayer Mode 🌐 NEW!
- **Public Matchmaking**: Quick match with random opponent
  - Automatic pairing from matchmaking queue
  - Random color assignment
  - Default Blitz time control (3+2)
  
- **Private Lobbies**: Play with friends
  - Host generates 5-digit code
  - Friends join using the code
  - Choose time control before creating
  - Host plays as white

- **Real-time Features**:
  - WebSocket-based move synchronization
  - In-game chat with opponent
  - Live chess clocks
  - Disconnect/reconnect handling
  - Opponent resignation notification

- **Setup**:
  - Choose username (2-20 characters)
  - Select avatar from 15 emoji options
  - Settings saved in localStorage

### Time Controls
Choose from four time control options before each game:
- **Normal** - No clock, unlimited time
- **Rapid** - 10 minutes + 5 seconds increment
- **Blitz** - 3 minutes + 2 seconds increment  
- **Bullet** - 1 minute + 1 second increment

Time runs during your turn with increment added after each move.

### Post-Game Features

#### Game Analysis
- Analyze your games with Stockfish (once per 24 hours)
- Move quality labels: [Best], [Great], [Good], [Inaccuracy], [Mistake], [Blunder]
- Accuracy scores for both players
- Detailed move-by-move breakdown

#### Game History
- Tracks last 10 games with details:
  - Opponent name
  - Result (win/loss/draw)
  - Your color
  - Time control
  - Move count
  - Timestamp
- Summary format: "You beat Boris bot in Blitz!"

### UI/UX Features
- **Move Options**: 
  - Drag-and-drop pieces (traditional)
  - Click-to-move: Click piece, then destination (with green dots showing valid moves)
- **Settings**:
  - Sound effects toggle
  - Click-to-move toggle
  - Show move hints (green dots) toggle
- **Post-game modals**: Styled victory/defeat/draw notifications
- **Responsive design**: Optimized for mobile and desktop
- **Touch-friendly**: Large buttons and controls for mobile devices

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Chess Engine**: Stockfish.js (browser-based web worker)
- **Chess Logic**: chess.js
- **Chess UI**: react-chessboard
- **Backend**: Express.js + Socket.io (WebSocket server)
- **Real-time Communication**: Socket.io (WebSocket)
- **Storage**: localStorage (for game history, settings, analysis cooldown, online username)

## Local Development

### Prerequisites
- Node.js 16+ and npm

### Setup and Run

1. Clone the repository:
```bash
git clone <repository-url>
cd chess-online
```

2. Install dependencies:
```bash
npm install
```

3. Run in development mode:
```bash
npm run dev
```

This will start the Vite dev server at http://localhost:3000

4. Build for production:
```bash
npm run build
```

5. Test production build locally:
```bash
npm start
```

This will start the Express server at http://localhost:3000

## Deployment to Render

### Option 1: Using render.yaml (Recommended)

1. Push your code to a Git repository (GitHub, GitLab, etc.)

2. In Render dashboard:
   - Click "New +" → "Blueprint"
   - Connect your repository
   - Render will automatically detect `render.yaml` and configure the service

3. Deploy!

### Option 2: Manual Setup

1. Push your code to a Git repository

2. In Render dashboard:
   - Click "New +" → "Web Service"
   - Connect your repository
   - Configure:
     - **Name**: chess-online
     - **Environment**: Node
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm start`
     - **Environment Variables**: NODE_ENV=production

3. Deploy!

### After Deployment

Your chess game will be available at: `https://your-app-name.onrender.com`

## Game Controls

### Single-Player Mode
- **Move**: Drag and drop pieces OR click piece then click destination
- **Hint** (💡): Shows best move (3 uses per game)
- **Undo** (↶): Reverts last move pair (5 uses per game)
- **New Game** (🔄): Start a fresh game
- **History** (📊): View game history
- **Back**: Return to main menu
- **Analyze** (🔍): Analyze game after completion (once per 24 hours)

### 2-Player Mode
- **Move**: Drag and drop pieces OR click to move (players alternate)
- **New Game** (🔄): Start a fresh game
- **History** (📊): View game history  
- **Back**: Return to main menu

### Online Multiplayer Mode
- **Move**: Drag and drop pieces OR click to move (only on your turn)
- **Chat** (💬): Send messages to opponent
- **New Game** (🔄): Start a fresh game
- **History** (📊): View game history
- **Back**: Return to main menu
- Real-time synchronization with opponent
- Chess clocks with time controls
- Resign option available

## Bot Difficulty Levels

### Personality Bots
| Bot | Style | Difficulty | Description |
|-----|-------|------------|-------------|
| Amelia | Aggressive Attacker | Intermediate (800) | Loves tactical fireworks and sacrificial attacks |
| Boris | Solid Positional | Moderate (1200) | Patient and methodical, focuses on structure |
| Avi | Endgame Specialist | Tough (1500) | Trades pieces to reach endgames |
| Elena | Creative Genius | Hard (1800) | Unpredictable with unusual openings |
| Magnus | Universal Player | Extreme (2500) | Adaptable and strong in all phases |
| Sophia | Strategic Planner | Insane (2100) | Thinks many moves ahead |

### Classic Difficulty

| Difficulty | ELO | Description |
|------------|-----|-------------|
| Practice | 150 | Perfect for absolute beginners |
| Beginner | 300 | Learning the basics |
| Easy | 500 | Casual play |
| Intermediate | 800 | Some challenge |
| Moderate | 1200 | Club player level |
| Tough | 1500 | Strong club player |
| Hard | 1800 | Expert level |
| Insane | 2100 | Master level |
| Extreme | 2500 | Grandmaster level |
| Impossible | 3000 | Maximum strength |

## Project Structure

```
chess-online/
├── public/              # Static assets
│   ├── stockfish.js    # Stockfish web worker
│   ├── move.mp3        # Sound effect
│   └── chess-icon.svg  # Favicon
├── src/
│   ├── components/     # React components
│   │   ├── HomeScreen.tsx
│   │   ├── ModeSelectionScreen.tsx
│   │   └── GameScreen.tsx
│   ├── utils/
│   │   └── stockfish.ts # Stockfish integration
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── server/
│   └── index.js        # Express server
├── index.html          # HTML template
├── package.json        # Dependencies
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript config
└── render.yaml         # Render deployment config
```

## Troubleshooting

### Stockfish not working
- Ensure browser supports Web Workers
- Check browser console for errors
- Try a different browser (Chrome, Firefox, Edge recommended)

### Build fails
- Ensure Node.js 16+ is installed
- Delete `node_modules` and `package-lock.json`, then run `npm install` again
- Check for TypeScript errors: `npm run build`

### Sound not playing
- Check SFX toggle in Settings
- Ensure browser allows audio playback
- Some browsers require user interaction before playing audio

## License

MIT
