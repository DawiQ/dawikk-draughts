
# Draughts Engine

A comprehensive JavaScript library for draughts/checkers game logic with support for multiple variants, FEN validation, and advanced draw detection.

## Features

✅ **Multiple Variants**: International, American, Russian, Spanish, Italian, Brazilian, Turkish  
✅ **Complete Game Logic**: Move validation, capture sequences, king promotion  
✅ **FEN Support**: Load/save positions with comprehensive validation  
✅ **Draw Detection**: Repetition, 50-move rule, insufficient material  
✅ **PGN Support**: Import/export game notation  
✅ **React Native Ready**: Works seamlessly in mobile apps  
✅ **TypeScript Definitions**: Full type support included  
✅ **lidraughts.org Compatible**: Import/export positions directly  

## Installation

```bash
npm install draughts-engine
```

## Quick Start

```javascript
import { Draughts } from 'dawikk-draughts';

const game = new Draughts();

// Make moves
const move = game.move('32-28');
if (move) {
  console.log('Move successful:', move.san);
} else {
  console.log('Invalid move');
}

// Check game state
console.log('Current player:', game.turn()); // 'r' or 'b'
console.log('Game over:', game.game_over());
console.log('Draw:', game.isDraw());
```

## Supported Variants

| Variant | Board Size | Flying Kings | Mandatory Capture | Backwards Capture |
|---------|------------|--------------|-------------------|-------------------|
| International (Polish) | 10×10 | ✅ | ✅ | ✅ |
| American (English) | 8×8 | ❌ | ✅ | ❌ |
| Russian | 8×8 | ✅ | ✅ | ✅ |
| Spanish | 8×8 | ✅ | ✅ | ❌ |
| Italian | 8×8 | ✅ | ✅ | ❌ |
| Brazilian | 12×12 | ✅ | ✅ | ✅ |
| Turkish | 8×8 | ✅ | ✅ | ✅* |

*Turkish draughts uses orthogonal movement instead of diagonal

## Basic Usage

### Setting up a game

```javascript
const game = new Draughts();

// Use different variant
game.variant('american'); // 8x8 American checkers
game.variant('russian');  // 8x8 Russian draughts
game.reset(); // Reset to starting position

// Get available variants
console.log(Object.keys(Draughts.VARIANTS));
```

### Making moves

```javascript
// Standard notation (square numbers)
game.move('32-28');  // Regular move
game.move('32x28');  // Capture
game.move('32x28x19'); // Multi-capture

// Object notation
game.move({
  from: 'f6',
  to: 'g5'
});

// Get all legal moves
const moves = game.moves();
console.log('Legal moves:', moves);

// Get moves for specific piece
const pieceMoves = game.getMovesForPiece(32);
```

### Game state

```javascript
// Current position
console.log('Board:', game.board());
console.log('Turn:', game.turn()); // 'r' (red/white) or 'b' (black)
console.log('Move history:', game.history());

// Game status
console.log('Status:', game.getGameStatus());
// Returns: 'playing', 'draw', 'draw_repetition', 
//          'draw_fifty_moves', 'draw_insufficient_material',
//          'stalemate', 'checkmate'

// Undo moves
const undoneMove = game.undo();
```

## FEN Support

### Loading positions

```javascript
// Basic FEN loading
const fen = "W:W31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50:B1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20";

// Validate before loading
const validation = game.validateFEN(fen);
if (validation.valid) {
  console.log('FEN is valid:', validation.stats);
} else {
  console.log('FEN errors:', validation.errors);
}

// Safe loading with error handling
const result = game.loadValidated(fen);
if (result.success) {
  console.log('Position loaded successfully');
} else {
  console.log('Loading failed:', result.errors);
}

// Basic loading (less safe)
game.load(fen);
```

### Exporting positions

```javascript
// Basic FEN
const fen = game.fen();

// FEN with draw information
const fenWithDraw = game.fenWithDrawInfo();

// Load FEN with draw info
game.loadFenWithDrawInfo(fenWithDraw);
```

## Draw Detection

```javascript
// Check different types of draws
console.log('Draw by repetition:', game.isDrawByRepetition());
console.log('Draw by 50-move rule:', game.isDrawByFiftyMoveRule());
console.log('Draw by insufficient material:', game.isDrawByInsufficientMaterial());
console.log('Any draw:', game.isDraw());

// Move with draw detection
const moveResult = game.move('32-28');
if (moveResult && moveResult.drawInfo.isDraw) {
  console.log('Game ended in draw!');
}
```

## React Native Integration

```jsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Draughts } from 'draughts-engine';

const DraughtsBoard = () => {
  const [game] = useState(() => new Draughts());
  const [board, setBoard] = useState(game.board());
  const [currentPlayer, setCurrentPlayer] = useState(game.turn());

  const makeMove = (from, to) => {
    const fromSquare = game._coordsToSquare(from.row, from.col);
    const toSquare = game._coordsToSquare(to.row, to.col);
    
    if (fromSquare && toSquare) {
      const result = game.move(`${fromSquare}-${toSquare}`);
      if (result) {
        setBoard(game.board());
        setCurrentPlayer(game.turn());
        
        // Check for game end
        if (result.drawInfo?.isDraw) {
          alert('Game ended in draw!');
        } else if (game.game_over()) {
          alert('Game over!');
        }
      }
    }
  };

  const renderSquare = (row, col) => {
    const piece = board[row][col];
    // Render your square component
  };

  return (
    <View>
      <Text>Current player: {currentPlayer === 'r' ? 'Red' : 'Black'}</Text>
      {/* Render board */}
    </View>
  );
};
```

## API Reference

### Constructor

```javascript
const game = new Draughts();
```

### Game Control

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `reset()` | none | `boolean` | Reset to starting position |
| `clear()` | none | `void` | Clear the board |
| `move(move)` | `string \| object` | `object \| null` | Make a move |
| `undo()` | none | `object \| null` | Undo last move |
| `variant(name?)` | `string?` | `string \| boolean` | Get/set variant |

### Position & State

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `board()` | none | `array` | Get board state |
| `turn()` | none | `string` | Get current player |
| `moves(options?)` | `object?` | `array` | Get legal moves |
| `getMovesForPiece(square)` | `number \| string` | `array` | Get moves for piece |
| `game_over()` | none | `boolean` | Check if game ended |
| `getGameStatus()` | none | `string` | Get detailed game status |

### FEN Operations

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `fen()` | none | `string` | Export FEN |
| `load(fen)` | `string` | `boolean` | Load FEN |
| `validateFEN(fen)` | `string` | `object` | Validate FEN |
| `loadValidated(fen)` | `string` | `object` | Safe FEN loading |
| `fenWithDrawInfo()` | none | `string` | FEN with draw counters |

### Draw Detection

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `isDraw()` | none | `boolean` | Check any draw |
| `isDrawByRepetition(threshold?)` | `number?` | `boolean` | Check repetition |
| `isDrawByFiftyMoveRule(limit?)` | `number?` | `boolean` | Check 50-move rule |
| `isDrawByInsufficientMaterial()` | none | `boolean` | Check material |

### Piece Operations

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `get(square)` | `string \| number` | `object \| null` | Get piece at square |
| `put(piece, square)` | `object, string` | `boolean` | Place piece |
| `remove(square)` | `string \| number` | `object \| null` | Remove piece |

### Import/Export

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `pgn()` | none | `string` | Export PGN |
| `load_pgn(pgn)` | `string` | `boolean` | Load PGN |
| `history()` | none | `array` | Get move history |
| `ascii()` | none | `string` | ASCII board |

## Move Object Format

```javascript
const moveResult = {
  color: 'r',              // Player who moved
  from: { row: 5, col: 1 }, // Source square
  to: { row: 4, col: 2 },   // Destination square
  piece: { type: 'p', color: 'r' }, // Piece moved
  captured: [],             // Captured pieces
  san: '32-28',            // Standard notation
  flags: {
    capture: false,        // Was it a capture?
    promotion: false       // Did piece promote?
  },
  drawInfo: {              // Draw information
    isDraw: false,
    byRepetition: false,
    byFiftyMoveRule: false,
    byInsufficientMaterial: false
  }
};
```

## FEN Format

The library uses standard draughts FEN notation:

```
W:W31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50:B1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20
```

- `W` or `B`: Current player (White/Red or Black)
- `W31,32...`: White/Red pieces on squares 31, 32, etc.
- `B1,2...`: Black pieces on squares 1, 2, etc.
- `K31,45`: Kings on squares 31 and 45 (optional section)

Extended FEN with draw information:
```
W:W31,32:B1,2:K31 0 1
```
- Last two numbers: halfmove clock and fullmove number

## lidraughts.org Compatibility

The library is fully compatible with [lidraughts.org](https://lidraughts.org):

```javascript
// Copy FEN from lidraughts
const lidraughtsFEN = "W:W31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50:B1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20";

// Load into engine
game.loadValidated(lidraughtsFEN);

// Make moves and export back
game.move('32-28');
const newFEN = game.fen();
// Paste newFEN back into lidraughts
```

## Testing

```bash
npm test
```

## TypeScript Support

The library includes TypeScript definitions:

```typescript
import { Draughts } from 'draughts-engine';

const game: Draughts = new Draughts();
const moves: string[] = game.moves();
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

### v1.0.0
- Initial release
- Support for 7 draughts variants
- FEN validation and import/export
- Draw detection (repetition, 50-move rule, insufficient material)
- React Native compatibility
- lidraughts.org compatibility
- Comprehensive test coverage

## Support

- 🐛 **Bug reports**: [GitHub Issues](https://github.com/yourusername/draughts-engine/issues)
- 💡 **Feature requests**: [GitHub Issues](https://github.com/yourusername/draughts-engine/issues)
- 📖 **Documentation**: [GitHub Wiki](https://github.com/yourusername/draughts-engine/wiki)

## Credits

Inspired by the excellent [chess.js](https://github.com/jhlywa/chess.js) library.
Compatible with [lidraughts.org](https://lidraughts.org) - the premier online draughts platform.