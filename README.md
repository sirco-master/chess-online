# Chess Online

A complete, deployable web-based chess game featuring single-player mode against AI (Stockfish) with 10 difficulty levels and local 2-player mode.

## Features

- **Three Screens**:
  - Home screen with Play button and Settings menu (SFX toggle)
  - Mode/Difficulty selection with 10 bot difficulties (150-3000 ELO) + 2-player mode
  - Game screen with wooden theme

- **Single-Player Mode**: 
  - Play against Stockfish AI with 10 difficulty levels
  - Hint button (3 uses per game) - shows best move
  - Undo button (5 uses per game) - reverts moves
  
- **2-Player Mode**: 
  - Local pass-and-play
  - No hints or undo

- **Features**:
  - Wooden theme throughout
  - Sound effects with persistent toggle (localStorage)
  - Responsive design
  - Full chess rules via chess.js

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Chess Engine**: Stockfish.js (browser-based web worker)
- **Chess Logic**: chess.js
- **Chess UI**: react-chessboard
- **Backend**: Express.js (serves static files)

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
- **Move**: Drag and drop pieces
- **Hint** (💡): Shows best move (3 uses per game)
- **Undo** (↶): Reverts last move pair (5 uses per game)
- **New Game** (🔄): Start a fresh game
- **Back**: Return to main menu

### 2-Player Mode
- **Move**: Drag and drop pieces (players alternate)
- **New Game** (🔄): Start a fresh game
- **Back**: Return to main menu

## Bot Difficulty Levels

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
