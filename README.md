# dawikk-draughts

A comprehensive JavaScript library for draughts/checkers game logic, inspired by the popular chess.js library. Supports multiple variants, FEN notation, and provides a chess.js-like API for easy integration.

## Features

- 🎮 **Multiple Game Variants**: International, Russian, American, Spanish, Italian, Brazilian, Turkish
- 📏 **Flexible Board Sizes**: 6×6, 8×8, 10×10, 12×12
- 🎨 **Color Themes**: Classic, Forest, Midnight, Sunset, Monochrome
- 📝 **FEN Support**: Complete import/export functionality
- ✅ **Rule Validation**: Mandatory captures, flying kings, backward captures
- 📊 **Game Statistics**: Capture count, king count, move history
- 🔄 **Undo/Redo**: Full move history with undo functionality
- 🖨️ **ASCII Display**: Debug-friendly board representation
- 📱 **Framework Agnostic**: Works with React, React Native, Vue, Angular, or vanilla JS

## Installation

```bash
npm install dawikk-draughts
```

```bash
yarn add dawikk-draughts
```

## Quick Start

```javascript
import Draughts, { GAME_VARIANTS, BOARD_THEMES } from 'dawikk-draughts';

// Create a new game
const game = new Draughts({
  variant: GAME_VARIANTS.INTERNATIONAL,
  boardSize: 10,
  theme: BOARD_THEMES.CLASSIC
});

// Make moves
game.move('c3-d4');
game.move('f6-e5');

// Check game state
console.log(game.turn());        // Current player: 'r' or 'b'
console.log(game.isGameOver());  // false
console.log(game.moves());       // All possible moves

// Export/Import positions
const fen = game.fen();
game.load(fen);

// Display board
console.log(game.ascii());
```

## Game Variants

### International/Polish Draughts (10×10)
```javascript
const game = new Draughts({
  variant: GAME_VARIANTS.INTERNATIONAL,
  boardSize: 10
});
```
- Flying kings (move any distance)
- Mandatory captures with longest sequence
- Backward captures allowed
- 4 rows of pieces

### Russian Draughts (8×8)
```javascript
const game = new Draughts({
  variant: GAME_VARIANTS.RUSSIAN,
  boardSize: 8
});
```
- Flying kings
- Mandatory captures with longest sequence
- Backward captures allowed
- 3 rows of pieces

### American/English Draughts (8×8)
```javascript
const game = new Draughts({
  variant: GAME_VARIANTS.AMERICAN,
  boardSize: 8
});
```
- Non-flying kings (one square moves)
- Mandatory captures (any sequence)
- Forward captures only
- 3 rows of pieces

### Turkish Draughts (8×8)
```javascript
const game = new Draughts({
  variant: GAME_VARIANTS.TURKISH,
  boardSize: 8
});
```
- Orthogonal movement (not diagonal)
- Flying kings
- Mandatory captures
- Special piece setup

## API Reference

### Constructor

```javascript
const game = new Draughts(config);
```

**Config options:**
- `variant`: Game variant object (default: `GAME_VARIANTS.INTERNATIONAL`)
- `boardSize`: Board size number (default: 8)
- `theme`: Color theme object (default: `BOARD_THEMES.CLASSIC`)

### Game State Methods

#### `board()`
Returns a copy of the current board as a 2D array.

```javascript
const board = game.board();
// [
//   ['-', 'b', '-', 'b', '-', 'b', '-', 'b'],
//   ['b', '-', 'b', '-', 'b', '-', 'b', '-'],
//   ...
// ]
```

#### `turn()`
Returns the current player: `'r'` (red/first player) or `'b'` (black/second player).

#### `moves(square?)`
Returns all possible moves. If `square` is provided, returns moves only for that square.

```javascript
const allMoves = game.moves();
const a3Moves = game.moves('a3');
// [
//   {
//     from: 'a3',
//     to: 'b4',
//     piece: 'r',
//     type: 'normal',
//     captures: []
//   }
// ]
```

#### `isGameOver()`
Returns `true` if the game is finished.

#### `winner()`
Returns the winner (`'r'` or `'b'`) or `null` if no winner.

### Move Methods

#### `move(notation)`
Makes a move. Accepts string notation or move object.

```javascript
// String notation
game.move('a3-b4');
game.move('a3xc5');  // capture notation

// Move object
game.move({
  from: 'a3',
  to: 'b4',
  captures: ['c5']
});
```

#### `undo()`
Undoes the last move. Returns `true` if successful.

```javascript
const success = game.undo();
```

#### `isLegalMove(notation)`
Checks if a move is legal without making it.

```javascript
const isLegal = game.isLegalMove('a3-b4');
```

### Utility Methods

#### `fen()`
Returns the current position in FEN notation.

```javascript
const fen = game.fen();
// "W:W31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50:B1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20"
```

#### `load(fen)`
Loads a position from FEN notation.

```javascript
const success = game.load("W:W31,32,33:B1,2,3:K4,5");
```

#### `ascii()`
Returns an ASCII representation of the board.

```javascript
console.log(game.ascii());
//    a b c d e f g h 
// 8  . b . b . b . b  8
// 7  b . b . b . b .  7
// 6  . b . b . b . b  6
// 5  . . . . . . . .  5
// 4  . . . . . . . .  4
// 3  r . r . r . r .  3
// 2  . r . r . r . r  2
// 1  r . r . r . r .  1
//    a b c d e f g h
```

#### `reset()`
Resets the game to the initial position.

#### `history()`
Returns the move history array.

#### `stats()`
Returns game statistics.

```javascript
const stats = game.stats();
// {
//   captures: { r: 2, b: 1 },
//   kings: { r: 0, b: 1 }
// }
```

### Configuration Methods

#### `setVariant(variant)`
Changes the game variant and resets the board.

#### `setBoardSize(size)`
Changes the board size and resets the board.

#### `setTheme(theme)`
Changes the color theme.

#### `getConfig()`
Returns the current configuration.

#### `getCaptures()`
Returns information about mandatory captures.

```javascript
const captures = game.getCaptures();
// {
//   captures: [...],
//   maxLength: 2,
//   mandatory: true
// }
```

## FEN Notation

The library supports draughts FEN notation for position import/export:

### Format
```
W:W31,32,33:B1,2,3:K4,5:F1
```

- **W/B**: Current player (W=white/red, B=black)
- **W31,32,33**: White/red piece positions
- **B1,2,3**: Black piece positions  
- **K4,5**: King positions (optional)
- **F1**: Move number (optional)

### Field Numbering
Fields are numbered 1-50 for a 10×10 board (dark squares only):

```
   46  47  48  49  50
 41  42  43  44  45
   36  37  38  39  40
 31  32  33  34  35
   26  27  28  29  30
 21  22  23  24  25
   16  17  18  19  20
 11  12  13  14  15
    6   7   8   9  10
  1   2   3   4   5
```

## Constants

### Game Variants
```javascript
import { GAME_VARIANTS } from 'dawikk-draughts';

GAME_VARIANTS.INTERNATIONAL  // 10×10 International/Polish
GAME_VARIANTS.RUSSIAN        // 8×8 Russian
GAME_VARIANTS.AMERICAN       // 8×8 American/English  
GAME_VARIANTS.SPANISH        // 8×8 Spanish
GAME_VARIANTS.ITALIAN        // 8×8 Italian
GAME_VARIANTS.BRAZILIAN      // 12×12 Brazilian/Canadian
GAME_VARIANTS.TURKISH        // 8×8 Turkish (orthogonal)
```

### Board Themes
```javascript
import { BOARD_THEMES } from 'dawikk-draughts';

BOARD_THEMES.CLASSIC     // Traditional black/white
BOARD_THEMES.FOREST      // Green/brown wooden theme
BOARD_THEMES.MIDNIGHT    // Dark blue theme
BOARD_THEMES.SUNSET      // Orange/yellow theme
BOARD_THEMES.MONOCHROME  // Pure black/white
```

### Other Constants
```javascript
import { 
  PLAYERS,      // { PLAYER1: 'r', PLAYER2: 'b' }
  MOVE_TYPES,   // { NORMAL, CAPTURE, MULTIPLE_CAPTURE, PROMOTION }
  GAME_STATUS,  // { ONGOING, CHECKMATE, STALEMATE, DRAW }
  BOARD_SIZES   // { SMALL: 6, STANDARD: 8, POLISH: 10, CANADIAN: 12 }
} from 'dawikk-draughts';
```

## React Native Example

```jsx
import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Draughts, { GAME_VARIANTS, PLAYERS } from 'dawikk-draughts';

const DraughtsGame = () => {
  const gameRef = useRef(new Draughts({
    variant: GAME_VARIANTS.INTERNATIONAL,
    boardSize: 10
  }));
  
  const [gameState, setGameState] = useState({
    board: gameRef.current.board(),
    turn: gameRef.current.turn(),
    gameOver: gameRef.current.isGameOver()
  });

  const handleMove = (from, to) => {
    const result = gameRef.current.move(`${from}-${to}`);
    if (result) {
      setGameState({
        board: gameRef.current.board(),
        turn: gameRef.current.turn(),
        gameOver: gameRef.current.isGameOver()
      });
    }
  };

  const resetGame = () => {
    gameRef.current.reset();
    setGameState({
      board: gameRef.current.board(),
      turn: gameRef.current.turn(),
      gameOver: gameRef.current.isGameOver()
    });
  };

  return (
    <View>
      <Text>Current Player: {gameState.turn === PLAYERS.PLAYER1 ? 'Red' : 'Black'}</Text>
      {/* Render board UI */}
      <TouchableOpacity onPress={resetGame}>
        <Text>New Game</Text>
      </TouchableOpacity>
    </View>
  );
};
```

## Browser Example

```html
<!DOCTYPE html>
<html>
<head>
    <title>Draughts Game</title>
</head>
<body>
    <div id="board"></div>
    <button onclick="newGame()">New Game</button>
    
    <script type="module">
        import Draughts, { GAME_VARIANTS } from './node_modules/dawikk-draughts/index.js';
        
        const game = new Draughts({
            variant: GAME_VARIANTS.INTERNATIONAL
        });
        
        window.game = game; // For debugging
        
        function newGame() {
            game.reset();
            updateDisplay();
        }
        
        function updateDisplay() {
            document.getElementById('board').textContent = game.ascii();
        }
        
        updateDisplay();
        window.newGame = newGame;
    </script>
</body>
</html>
```

## Advanced Usage

### Custom Game Rules
```javascript
const customVariant = {
  id: 'custom',
  name: 'Custom Rules',
  boardSize: 8,
  rules: {
    flyingKings: true,
    mandatoryCapture: false,  // Optional captures
    captureBackwards: true,
    longestCapture: false,
    piecesSetup: 'standard',
    promotionRank: 'opposite'
  }
};

const game = new Draughts({ variant: customVariant });
```

### Position Analysis
```javascript
// Check all possible moves
const moves = game.moves();
const captureMoves = moves.filter(m => m.captures && m.captures.length > 0);

// Evaluate position
const stats = game.stats();
const materialBalance = stats.captures.r - stats.captures.b;

// Check if square is under attack
const isAttacked = game.isAttacked('d4', 'b');
```

### Game State Management
```javascript
// Save game state
const gameState = {
  fen: game.fen(),
  history: game.history(),
  stats: game.stats()
};

// Restore game state
game.load(gameState.fen);
// Note: history and stats are reset when loading FEN
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by the excellent [chess.js](https://github.com/jhlywa/chess.js) library
- Draughts rules and variants based on international standards
- FEN notation adapted for draughts/checkers

## Changelog

### v1.0.0
- Initial release
- Support for 7 game variants
- Complete FEN import/export
- Multiple board sizes and themes
- Full rule validation and move generation
- Undo/redo functionality
- Game statistics and history