# Chess World 🌍♟️

A complete, modern web-based chess game featuring:
- **50 Unique Bots** - 36 personality bots + 14 engine difficulty levels
- **Online Multiplayer** - Real-time WebSocket gameplay
- **Social Features** - Clubs, friends, DM system (in development)
- **Multiple Game Modes** - Single-player, 2-player local, online play
- **Time Controls** - Normal, Rapid, Blitz, Bullet
- **Game Analysis** - Move quality evaluation with Stockfish
- **Profile System** - Track ELO, medals, and achievements
- **Mobile-Ready** - Responsive design with smooth animations
- **App-Store Ready** - Expo/React Native configuration included

## 🎮 Game Modes

### Play Bots
Challenge AI opponents with unique personalities and difficulty levels:
- **36 Personality Bots** across 6 categories (Beginner to RzPlay Staff)
- **14 Engine Levels** with precise ELO ratings (150-3200+)
- **Normal Mode** - Earn medals, no hints/takebacks
- **Friendly Mode** - Unlimited hints/takebacks, practice freely

### Play Online 🌐
- **Quick Match** - Automatic matchmaking with random opponents
- **Private Lobbies** - 5-digit codes to play with friends
- **Real-time Sync** - WebSocket-based move synchronization
- **In-game Chat** - Communicate with opponents
- **Time Controls** - Choose your preferred pace

### Play Locally
- **2-Player Mode** - Pass-and-play on same device
- **Auto-flip Board** - Board rotates for each player
- **Friendly Mode** - Relaxed practice games

## 🏆 Social Features (New!)

### Clubs
- **Create or Join Clubs** - Up to 30 members per club
- **Club Roles** - President, Senior, Member with customizable permissions
- **Club Matches** - 5v5, 10v10, 20v20, 30v30 team battles
- **Trophy System** - Winners +10, losers -5 trophies
- **Visibility Settings** - Open, Invite-Only, or Closed clubs
- **Club Management** - Promote/demote members, manage permissions

### Friends & Messaging (Coming Soon)
- **Friend System** - Send and accept friend requests
- **Direct Messages** - Private 1-on-1 conversations
- **User Search** - Find players by username
- **Profile Viewing** - View other players' stats and achievements
- **Blocking** - Prevent unwanted contact
- **DM Settings** - Control who can message you

### RZTV (Coming Soon)
- **Live Streaming** - Watch top players in action
- **Tournament Broadcasts** - Follow competitive events
- **Educational Content** - Learn from the pros
- **VOD Library** - Replay memorable games

## 🎨 User Interface

### Modern, Animated Design
- **Welcome Screen** - Centered play button with gradient background
- **Main Menu** - Vertical navigation with smooth transitions
- **Settings Gear** - Persistent settings access (top-right)
- **Mobile-Optimized** - Touch-friendly with responsive layouts
- **Smooth Animations** - CSS-based transitions and effects

### Navigation Flow
```
Welcome Screen → Main Menu → Specific Features
     ↓              ↓
   Play         Play Online
                Play Locally
                Play Bots
                Clubs
                Match History
                Profile
                Chat
                RZTV
```

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

## 📱 Mobile & App Deployment

Chess World is ready for mobile deployment! See [MOBILE_DEPLOYMENT.md](./MOBILE_DEPLOYMENT.md) for detailed instructions.

### Deployment Options:
1. **Progressive Web App (PWA)** - Install directly from browser
2. **Native App with Expo** - Deploy to iOS App Store and Google Play
3. **Hybrid App with Capacitor** - Alternative native wrapper

### Mobile Features:
- **Touch-Optimized** - All interactions work smoothly on mobile
- **Responsive Design** - Adapts to any screen size
- **Smooth Animations** - GPU-accelerated CSS transitions
- **Offline Support** - Play bots without internet
- **App-Store Ready** - Configuration files included

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Chess Engine**: Stockfish.js (browser-based web worker)
- **Chess Logic**: chess.js
- **Chess UI**: react-chessboard
- **Backend**: Express.js + Socket.io (WebSocket server)
- **Real-time Communication**: Socket.io (WebSocket)
- **Storage**: localStorage (for game history, settings, profiles, clubs)
- **Mobile**: Expo/React Native ready

## 🚀 Local Development

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

## 📂 Project Structure

```
chess-online/
├── public/              # Static assets
│   ├── stockfish.js    # Stockfish web worker
│   ├── move.mp3        # Sound effect
│   └── chess-icon.svg  # Favicon
├── src/
│   ├── components/     # React components
│   │   ├── WelcomeScreen.tsx      # Landing screen
│   │   ├── MainMenuScreen.tsx     # Main navigation
│   │   ├── HomeScreen.tsx         # Legacy home (kept for compatibility)
│   │   ├── ModeSelectionScreen.tsx
│   │   ├── GameScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── ClubListScreen.tsx     # Club browser
│   │   ├── ChatScreen.tsx         # Friends & DM (placeholder)
│   │   ├── RZTVScreen.tsx         # Streaming (placeholder)
│   │   ├── GameLogScreen.tsx
│   │   ├── OnlineSetupScreen.tsx
│   │   └── OnlineLobbyScreen.tsx
│   ├── utils/
│   │   ├── stockfish.ts           # Stockfish integration
│   │   ├── gameStorage.ts         # Game data & profiles
│   │   ├── clubStorage.ts         # Club management
│   │   ├── friendsStorage.ts      # Friends & DM system
│   │   ├── websocket.ts           # WebSocket client
│   │   └── useOnlineGame.ts       # Online game hook
│   ├── App.tsx         # Main app component & routing
│   ├── main.tsx        # Entry point
│   ├── types.ts        # TypeScript definitions
│   └── index.css       # Global styles
├── server/
│   ├── index.js        # Express server
│   └── gameServer.js   # WebSocket game logic
├── app.json            # Expo configuration
├── metro.config.js     # Metro bundler config
├── MOBILE_DEPLOYMENT.md # Mobile deployment guide
├── index.html          # HTML template
├── package.json        # Dependencies
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript config
└── render.yaml         # Render deployment config
```

## 🎯 Roadmap & TODOs

### In Progress
- Club detail screens (view members, manage club)
- Club match system (team battles)
- User search functionality
- Friend request system
- Direct messaging implementation
- Profile viewing (other users)
- Blocking system integration

### Planned Features
- RZTV live streaming
- Tournament system
- Leaderboards
- Achievement badges
- Push notifications (mobile)
- Voice chat (online matches)
- Puzzle mode
- Opening explorer
- Game database
- Export games as PGN

## 🤝 Contributing

Contributions are welcome! Areas that need work:
1. Complete club management features
2. Implement full friends/DM system
3. Add RZTV functionality
4. Improve mobile UX
5. Add more personality bots
6. Enhance game analysis
7. Add puzzle mode
8. Implement tournaments

## 📄 License

MIT

## 🙏 Acknowledgments

- Stockfish chess engine
- chess.js for move validation
- react-chessboard for the board UI
- Socket.io for real-time communication
- The open-source chess community
