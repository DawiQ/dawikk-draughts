// === CONSTANTS ===

/**
 * Different checkers board sizes
 */
const BOARD_SIZES = {
  SMALL: { size: 6, label: "6×6 (Mini)" },
  STANDARD: { size: 8, label: "8×8 (Standard)" },
  POLISH: { size: 10, label: "10×10 (International/Polish)" },
  CANADIAN: { size: 12, label: "12×12 (Canadian/Brazilian)" }
};

/**
 * Predefined color themes for board and pieces
 */
const BOARD_THEMES = {
  CLASSIC: {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional black and white board with blue and red pieces.',
    colors: {
      lightSquare: '#EFEFEF',      // Light gray
      darkSquare: '#5D5D5D',       // Dark gray
      player1Piece: '#5895B1',     // Blue
      player2Piece: '#ff6b6b',     // Red
      player1King: '#FFD700',      // Gold border for player 1 kings
      player2King: '#FFD700',      // Gold border for player 2 kings
      highlightedSquare: '#7BB274', // Highlight for possible moves
      activeSquare: '#FFF178'      // Border for active piece
    }
  },
  FOREST: {
    id: 'forest',
    name: 'Forest',
    description: 'Earthy green tones with wooden pieces.',
    colors: {
      lightSquare: '#D8E1CD',
      darkSquare: '#4C6444',
      player1Piece: '#8A5A3C',
      player2Piece: '#D2B48C',
      player1King: '#FFD700',
      player2King: '#FFD700',
      highlightedSquare: '#95B866',
      activeSquare: '#FFF178'
    }
  },
  MIDNIGHT: {
    id: 'midnight',
    name: 'Midnight',
    description: 'Deep blue tones with silver and gold pieces.',
    colors: {
      lightSquare: '#4A6D8C',
      darkSquare: '#1E3B5A',
      player1Piece: '#E6E6FA',     // Lavender
      player2Piece: '#FFD700',     // Gold
      player1King: '#C0C0C0',      // Silver border
      player2King: '#FFFFFF',      // White border
      highlightedSquare: '#5C87AD',
      activeSquare: '#FFCC00'
    }
  },
  SUNSET: {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm sunset colors with contrasting pieces.',
    colors: {
      lightSquare: '#FFCC99',
      darkSquare: '#CC6600',
      player1Piece: '#990000',
      player2Piece: '#FFFF66',
      player1King: '#FFFFFF',
      player2King: '#FFFFFF',
      highlightedSquare: '#FF9966',
      activeSquare: '#FFFF00'
    }
  },
  MONOCHROME: {
    id: 'monochrome',
    name: 'Monochrome',
    description: 'Elegant black and white theme.',
    colors: {
      lightSquare: '#FFFFFF',
      darkSquare: '#000000',
      player1Piece: '#303030',
      player2Piece: '#CCCCCC',
      player1King: '#808080',
      player2King: '#808080',
      highlightedSquare: '#AAAAAA',
      activeSquare: '#DDDDDD'
    }
  }
};

/**
 * Draughts game variants with their rules
 */
const GAME_VARIANTS = {
  INTERNATIONAL: {
    id: 'international',
    name: 'International/Polish',
    description: 'Classic 10×10 board with flying kings and mandatory captures.',
    boardSize: 10,
    rules: {
      flyingKings: true,         // Kings can move any distance
      mandatoryCapture: true,    // Captures are mandatory
      captureBackwards: true,    // Pieces can capture backwards
      longestCapture: true,      // Must make the longest capture sequence
      piecesSetup: 'standard',   // Standard 4 rows of pieces at start
      promotionRank: 'opposite', // Promotion to king at opposite end
    }
  },
  AMERICAN: {
    id: 'american',
    name: 'American/English',
    description: '8×8 board with non-flying kings (in American variant kings can fly).',
    boardSize: 8,
    rules: {
      flyingKings: false,        // Kings move one square (English variant)
      mandatoryCapture: true,    // Captures are mandatory
      captureBackwards: false,   // Pieces can only capture forward
      longestCapture: false,     // Any capture allowed (not necessarily longest)
      piecesSetup: 'standard',   // 3 rows of pieces at start
      promotionRank: 'opposite', // Promotion to king at opposite end
    }
  },
  RUSSIAN: {
    id: 'russian',
    name: 'Russian',
    description: '8×8 board with flying kings and backward captures for regular pieces.',
    boardSize: 8,
    rules: {
      flyingKings: true,         // Kings can move any distance
      mandatoryCapture: true,    // Captures are mandatory
      captureBackwards: true,    // Pieces can capture backwards
      longestCapture: true,      // Must make the longest capture sequence
      piecesSetup: 'standard',   // 3 rows of pieces at start
      promotionRank: 'opposite', // Promotion to king at opposite end
    }
  },
  SPANISH: {
    id: 'spanish',
    name: 'Spanish',
    description: '8×8 board with flying kings but forward-only captures for regular pieces.',
    boardSize: 8,
    rules: {
      flyingKings: true,         // Kings can move any distance
      mandatoryCapture: true,    // Captures are mandatory
      captureBackwards: false,   // Pieces can only capture forward
      longestCapture: true,      // Must make the longest capture sequence
      piecesSetup: 'standard',   // 3 rows of pieces at start
      promotionRank: 'opposite', // Promotion to king at opposite end
    }
  },
  ITALIAN: {
    id: 'italian',
    name: 'Italian',
    description: '8×8 board with flying kings but limited capture range.',
    boardSize: 8,
    rules: {
      flyingKings: true,         // Kings can move any distance
      mandatoryCapture: true,    // Captures are mandatory
      captureBackwards: false,   // Pieces can only capture forward
      longestCapture: true,      // Must make the longest capture sequence
      piecesSetup: 'standard',   // 3 rows of pieces at start
      promotionRank: 'opposite', // Promotion to king at opposite end
      kingCaptureLimit: 1,       // Kings can only capture within 1 square distance
    }
  },
  BRAZILIAN: {
    id: 'brazilian',
    name: 'Brazilian/Canadian',
    description: 'Large 12×12 board with flying kings and mandatory captures.',
    boardSize: 12,
    rules: {
      flyingKings: true,         // Kings can move any distance
      mandatoryCapture: true,    // Captures are mandatory
      captureBackwards: true,    // Pieces can capture backwards
      longestCapture: true,      // Must make the longest capture sequence
      piecesSetup: 'standard',   // 5 rows of pieces at start
      promotionRank: 'opposite', // Promotion to king at opposite end
    }
  },
  TURKISH: {
    id: 'turkish',
    name: 'Turkish',
    description: 'Unique 8×8 board where pieces move orthogonally, not diagonally.',
    boardSize: 8,
    rules: {
      flyingKings: true,         // Kings can move any distance
      mandatoryCapture: true,    // Captures are mandatory
      captureBackwards: true,    // Pieces can capture backwards
      longestCapture: false,     // No requirement for longest capture
      piecesSetup: 'turkish',    // Special starting setup
      promotionRank: 'opposite', // Promotion to king at opposite end
      orthogonalMovement: true,  // Move along straight lines instead of diagonals
    }
  }
};

/**
 * Default values
 */
const DEFAULT_THEME = BOARD_THEMES.CLASSIC;
const DEFAULT_VARIANT = GAME_VARIANTS.INTERNATIONAL;

/**
 * Game status constants
 */
const GAME_STATUS = {
  ONGOING: 'ongoing',
  CHECKMATE: 'checkmate', // In draughts: no moves available
  STALEMATE: 'stalemate', // In draughts: draw
  DRAW: 'draw'
};

/**
 * Move type constants
 */
const MOVE_TYPES = {
  NORMAL: 'normal',
  CAPTURE: 'capture',
  MULTIPLE_CAPTURE: 'multiple_capture',
  PROMOTION: 'promotion'
};

/**
 * Player constants
 */
const PLAYERS = {
  PLAYER1: 'r', // red/blue (first player)
  PLAYER2: 'b'  // black (second player)
};

// === DRAUGHTS CLASS ===

/**
 * Main Draughts class for managing game state and logic
 */
class Draughts {
  /**
   * Constructor - Initialize a new draughts game
   * @param {Object} config - Configuration object
   * @param {number} config.boardSize - Size of the board (default: 8)
   * @param {Object} config.variant - Game variant (default: INTERNATIONAL)
   * @param {Object} config.theme - Color theme (default: CLASSIC)
   */
  constructor(config = {}) {
    // Initial configuration
    this._boardSize = config.boardSize || BOARD_SIZES.STANDARD.size;
    this._variant = config.variant || DEFAULT_VARIANT;
    this._theme = config.theme || DEFAULT_THEME;
    
    // Game state
    this._board = [];
    this._turn = PLAYERS.PLAYER1; // First player starts
    this._gameStatus = GAME_STATUS.ONGOING;
    this._winner = null;
    this._moveHistory = [];
    this._boardHistory = [];
    this._moveCount = 0;
    
    // Mandatory capture data
    this._availableCaptures = [];
    this._captureLength = 0;
    
    // Statistics
    this._stats = {
      captures: { [PLAYERS.PLAYER1]: 0, [PLAYERS.PLAYER2]: 0 },
      kings: { [PLAYERS.PLAYER1]: 0, [PLAYERS.PLAYER2]: 0 }
    };
    
    // Initialize board
    this.reset();
  }

  // === PUBLIC API METHODS ===
  
  /**
   * Get a copy of the current board
   * @returns {Array<Array<string>>} 2D array representing the board
   */
  board() {
    return this._board.map(row => [...row]);
  }

  /**
   * Get the current player on move
   * @returns {string} 'r' or 'b'
   */
  turn() {
    return this._turn;
  }

  /**
   * Check if the game is over
   * @returns {boolean} True if game is finished
   */
  isGameOver() {
    return this._gameStatus !== GAME_STATUS.ONGOING;
  }

  /**
   * Get current game status
   * @returns {string} Game status constant
   */
  gameStatus() {
    return this._gameStatus;
  }

  /**
   * Get the winner of the game
   * @returns {string|null} Winner ('r', 'b') or null if no winner
   */
  winner() {
    return this._winner;
  }

  /**
   * Get the current move number
   * @returns {number} Move number (increments every 2 moves)
   */
  moveNumber() {
    return Math.floor(this._moveCount / 2) + 1;
  }

  /**
   * Get the move history
   * @returns {Array} Array of move objects
   */
  history() {
    return [...this._moveHistory];
  }

  /**
   * Get game statistics
   * @returns {Object} Statistics object with captures and kings counts
   */
  stats() {
    return JSON.parse(JSON.stringify(this._stats));
  }

  /**
   * Reset the game to initial state
   * @returns {Draughts} This instance for chaining
   */
  reset() {
    this._board = this._generateBoard(this._boardSize, this._variant);
    this._turn = PLAYERS.PLAYER1;
    this._gameStatus = GAME_STATUS.ONGOING;
    this._winner = null;
    this._moveHistory = [];
    this._boardHistory = [];
    this._moveCount = 0;
    this._stats = {
      captures: { [PLAYERS.PLAYER1]: 0, [PLAYERS.PLAYER2]: 0 },
      kings: { [PLAYERS.PLAYER1]: 0, [PLAYERS.PLAYER2]: 0 }
    };
    this._updateAvailableCaptures();
    return this;
  }

  /**
   * Get all possible moves for the current position
   * @param {string} [square] - Specific square (e.g., 'a3') to get moves for
   * @returns {Array} Array of move objects
   */
  moves(square = null) {
    if (this.isGameOver()) return [];
    
    if (square) {
      // Moves for specific square
      const [row, col] = this._parseSquare(square);
      if (row === null || col === null) return [];
      
      const moves = this._findAllPossibleMoves(row, col, this._board, this._turn, this._variant);
      return moves.map(move => this._formatMove(row, col, move));
    }
    
    // All possible moves
    const allMoves = [];
    
    for (let row = 0; row < this._boardSize; row++) {
      for (let col = 0; col < this._boardSize; col++) {
        if (this._board[row][col].includes && this._board[row][col].includes(this._turn)) {
          const moves = this._findAllPossibleMoves(row, col, this._board, this._turn, this._variant);
          moves.forEach(move => {
            allMoves.push(this._formatMove(row, col, move));
          });
        }
      }
    }
    
    return allMoves;
  }

  /**
   * Make a move
   * @param {string|Object} moveNotation - Move notation or move object
   * @returns {boolean|Object} False if invalid, move result object if successful
   */
  move(moveNotation) {
    if (this.isGameOver()) return false;
    
    let move;
    
    if (typeof moveNotation === 'string') {
      move = this._parseMove(moveNotation);
    } else if (typeof moveNotation === 'object') {
      move = moveNotation;
    }
    
    if (!move || !this._isValidMove(move)) {
      return false;
    }
    
    // Save state before move
    this._boardHistory.push(this._cloneBoard(this._board));
    
    // Execute move
    const moveResult = this._executeMove(move);
    
    // Save move to history
    this._moveHistory.push(moveResult);
    this._moveCount++;
    
    // Switch player
    this._turn = this._turn === PLAYERS.PLAYER1 ? PLAYERS.PLAYER2 : PLAYERS.PLAYER1;
    
    // Check game over
    this._checkGameOver();
    
    // Update available captures
    this._updateAvailableCaptures();
    
    return moveResult;
  }

  /**
   * Undo the last move
   * @returns {boolean} True if successful, false if no moves to undo
   */
  undo() {
    if (this._moveHistory.length === 0) return false;
    
    const lastMove = this._moveHistory.pop();
    this._board = this._boardHistory.pop();
    this._turn = this._turn === PLAYERS.PLAYER1 ? PLAYERS.PLAYER2 : PLAYERS.PLAYER1;
    this._gameStatus = GAME_STATUS.ONGOING;
    this._winner = null;
    this._moveCount--;
    
    // Update statistics (reverse)
    if (lastMove.captures && lastMove.captures.length > 0) {
      this._stats.captures[this._turn] -= lastMove.captures.length;
    }
    if (lastMove.promotion) {
      this._stats.kings[this._turn]--;
    }
    
    this._updateAvailableCaptures();
    return true;
  }

  /**
   * Get position in FEN notation for draughts
   * @returns {string} FEN string
   */
  fen() {
    return this._convertBoardToScanFormat(this._board);
  }

  /**
   * Load position from FEN notation
   * @param {string} fen - FEN string to load
   * @returns {boolean} True if successful, false otherwise
   */
  load(fen) {
    try {
      if (!fen || typeof fen !== 'string') {
        return false;
      }
      
      const fenData = this._parseFEN(fen);
      if (!fenData) {
        return false;
      }
      
      // Reset and set new position
      this._board = this._createEmptyBoard();
      this._turn = fenData.turn;
      this._gameStatus = GAME_STATUS.ONGOING;
      this._winner = null;
      this._moveHistory = [];
      this._boardHistory = [];
      this._moveCount = 0;
      this._stats = {
        captures: { [PLAYERS.PLAYER1]: 0, [PLAYERS.PLAYER2]: 0 },
        kings: { [PLAYERS.PLAYER1]: 0, [PLAYERS.PLAYER2]: 0 }
      };
      
      // Set pieces on board
      this._setBoardFromFEN(fenData);
      this._updateAvailableCaptures();
      
      return true;
    } catch (error) {
      console.error('FEN load error:', error);
      return false;
    }
  }

  /**
   * Get ASCII representation of the board
   * @returns {string} ASCII board representation
   */
  ascii() {
    let result = '\n   ';
    
    // Column headers
    for (let i = 0; i < this._boardSize; i++) {
      result += String.fromCharCode(97 + i) + ' ';
    }
    result += '\n';
    
    // Rows
    for (let row = 0; row < this._boardSize; row++) {
      result += `${this._boardSize - row}  `;
      
      for (let col = 0; col < this._boardSize; col++) {
        const piece = this._board[row][col];
        let symbol = '.';
        
        if (piece !== '-') {
          if (piece.includes('r')) {
            symbol = piece.includes('k') ? 'R' : 'r';
          } else if (piece.includes('b')) {
            symbol = piece.includes('k') ? 'B' : 'b';
          }
        }
        
        result += symbol + ' ';
      }
      
      result += ` ${this._boardSize - row}\n`;
    }
    
    // Column footer
    result += '   ';
    for (let i = 0; i < this._boardSize; i++) {
      result += String.fromCharCode(97 + i) + ' ';
    }
    result += '\n';
    
    return result;
  }

  // === CONFIGURATION METHODS ===
  
  /**
   * Set game variant
   * @param {Object} variant - Game variant object
   * @returns {Draughts} This instance for chaining
   */
  setVariant(variant) {
    this._variant = variant;
    this.reset();
    return this;
  }

  /**
   * Set board size
   * @param {number} size - Board size
   * @returns {Draughts} This instance for chaining
   */
  setBoardSize(size) {
    this._boardSize = size;
    this.reset();
    return this;
  }

  /**
   * Set color theme
   * @param {Object} theme - Theme object
   * @returns {Draughts} This instance for chaining
   */
  setTheme(theme) {
    this._theme = theme;
    return this;
  }

  /**
   * Get current configuration
   * @returns {Object} Configuration object
   */
  getConfig() {
    return {
      boardSize: this._boardSize,
      variant: this._variant,
      theme: this._theme
    };
  }

  /**
   * Get information about mandatory captures
   * @returns {Object} Captures info with mandatory flag and max length
   */
  getCaptures() {
    return {
      captures: this._availableCaptures,
      maxLength: this._captureLength,
      mandatory: this._variant.rules.mandatoryCapture && this._captureLength > 0
    };
  }

  /**
   * Check if a move is legal
   * @param {string|Object} moveNotation - Move notation or object
   * @returns {boolean} True if move is legal
   */
  isLegalMove(moveNotation) {
    if (this.isGameOver()) return false;
    
    let move;
    if (typeof moveNotation === 'string') {
      move = this._parseMove(moveNotation);
    } else {
      move = moveNotation;
    }
    
    return move && this._isValidMove(move);
  }

  /**
   * Check if a square is attacked by the opponent
   * @param {string} square - Square in algebraic notation
   * @param {string} [byPlayer] - Which player attacks (default: opponent)
   * @returns {boolean} True if square is attacked
   */
  isAttacked(square, byPlayer = null) {
    const [row, col] = this._parseSquare(square);
    if (row === null) return false;
    
    const attacker = byPlayer || (this._turn === PLAYERS.PLAYER1 ? PLAYERS.PLAYER2 : PLAYERS.PLAYER1);
    
    // Check if any opponent piece can capture this square
    for (let r = 0; r < this._boardSize; r++) {
      for (let c = 0; c < this._boardSize; c++) {
        if (this._board[r][c].includes && this._board[r][c].includes(attacker)) {
          const moves = this._findAllPossibleMoves(r, c, this._board, attacker, this._variant);
          const captures = moves.filter(move => move.wouldDelete && move.wouldDelete.length > 0);
          
          for (const capture of captures) {
            if (capture.wouldDelete.some(del => del.targetRow === row && del.targetCell === col)) {
              return true;
            }
          }
        }
      }
    }
    
    return false;
  }

  // === PRIVATE METHODS ===
  
  /**
   * Format move to standard format
   * @private
   */
  _formatMove(fromRow, fromCol, move) {
    const moveObj = {
      from: this._squareToAlgebraic(fromRow, fromCol),
      to: this._squareToAlgebraic(move.targetRow, move.targetCell),
      piece: this._board[fromRow][fromCol],
      type: MOVE_TYPES.NORMAL
    };
    
    if (move.wouldDelete && move.wouldDelete.length > 0) {
      moveObj.captures = move.wouldDelete.map(cap => 
        this._squareToAlgebraic(cap.targetRow, cap.targetCell)
      );
      moveObj.type = move.wouldDelete.length > 1 ? MOVE_TYPES.MULTIPLE_CAPTURE : MOVE_TYPES.CAPTURE;
    }
    
    // Check for promotion
    const piece = this._board[fromRow][fromCol];
    if (!piece.includes('k')) {
      if ((this._turn === PLAYERS.PLAYER2 && move.targetRow === this._boardSize - 1) ||
          (this._turn === PLAYERS.PLAYER1 && move.targetRow === 0)) {
        moveObj.promotion = true;
        moveObj.type = MOVE_TYPES.PROMOTION;
      }
    }
    
    return moveObj;
  }

  /**
   * Generate initial board for given size and variant
   * @private
   */
  _generateBoard(size, variant) {
    if (variant.rules.orthogonalMovement) {
      return this._generateTurkishBoard(size);
    }

    let piecesRows;
    if (variant.id === 'international' || variant.id === 'polish') {
      piecesRows = Math.floor(size / 2) - 1;
    } else if (variant.id === 'brazilian' || variant.id === 'canadian') {
      piecesRows = Math.ceil(size / 3);
    } else if (size === 8) {
      piecesRows = 3;
    } else {
      piecesRows = Math.ceil(size / 4);
    }

    const board = [];
    for (let i = 0; i < size; i++) {
      const row = Array(size).fill('-');
      board.push(row);
    }

    // Place pieces on top (black)
    for (let row = 0; row < piecesRows; row++) {
      for (let col = 0; col < size; col++) {
        if ((row + col) % 2 === 1) {
          board[row][col] = PLAYERS.PLAYER2;
        }
      }
    }

    // Place pieces on bottom (red/blue)
    for (let row = size - piecesRows; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if ((row + col) % 2 === 1) {
          board[row][col] = PLAYERS.PLAYER1;
        }
      }
    }

    return board;
  }

  /**
   * Generate board for Turkish variant
   * @private
   */
  _generateTurkishBoard(size) {
    const board = [];
    
    for (let i = 0; i < size; i++) {
      const row = Array(size).fill('-');
      board.push(row);
    }
    
    // Top rows (black) - offset by one row from edge
    for (let row = 1; row < 3; row++) {
      for (let col = 0; col < size; col++) {
        board[row][col] = PLAYERS.PLAYER2;
      }
    }
    
    // Bottom rows (red/blue) - offset by one row from edge
    for (let row = size - 3; row < size - 1; row++) {
      for (let col = 0; col < size; col++) {
        board[row][col] = PLAYERS.PLAYER1;
      }
    }
    
    return board;
  }

  /**
   * Create empty board
   * @private
   */
  _createEmptyBoard() {
    const board = [];
    for (let i = 0; i < this._boardSize; i++) {
      board.push(Array(this._boardSize).fill('-'));
    }
    return board;
  }

  /**
   * Clone board
   * @private
   */
  _cloneBoard(board) {
    return board.map(row => [...row]);
  }

  /**
   * Parse FEN string
   * @private
   */
  _parseFEN(fen) {
    try {
      // Format: W:W31,32,33:B1,2,3:K4,5:F1
      const parts = fen.split(':');
      if (parts.length < 3) return null;
      
      const result = {
        turn: parts[0] === 'W' ? PLAYERS.PLAYER1 : PLAYERS.PLAYER2,
        whitePieces: [],
        blackPieces: [],
        kings: []
      };
      
      // Parse white pieces
      if (parts[1].startsWith('W') && parts[1].length > 1) {
        const positions = parts[1].substring(1).split(',');
        result.whitePieces = positions.map(p => parseInt(p.trim(), 10)).filter(n => !isNaN(n));
      }
      
      // Parse black pieces
      if (parts[2].startsWith('B') && parts[2].length > 1) {
        const positions = parts[2].substring(1).split(',');
        result.blackPieces = positions.map(p => parseInt(p.trim(), 10)).filter(n => !isNaN(n));
      }
      
      // Parse kings (optional)
      for (let i = 3; i < parts.length; i++) {
        if (parts[i].startsWith('K') && parts[i].length > 1) {
          const positions = parts[i].substring(1).split(',');
          result.kings = positions.map(p => parseInt(p.trim(), 10)).filter(n => !isNaN(n));
        }
      }
      
      return result;
    } catch (error) {
      return null;
    }
  }

  /**
   * Set board from FEN data
   * @private
   */
  _setBoardFromFEN(fenData) {
    // Convert field number to position (row, col)
    const fieldToPosition = (fieldNumber) => {
      let currentField = 0;
      for (let row = 0; row < this._boardSize; row++) {
        for (let col = 0; col < this._boardSize; col++) {
          if ((row + col) % 2 === 1) {
            currentField++;
            if (currentField === fieldNumber) {
              return [row, col];
            }
          }
        }
      }
      return null;
    };
    
    // Set white/red pieces
    fenData.whitePieces.forEach(fieldNum => {
      const pos = fieldToPosition(fieldNum);
      if (pos) {
        const [row, col] = pos;
        const isKing = fenData.kings.includes(fieldNum);
        this._board[row][col] = isKing ? PLAYERS.PLAYER1 + ' k' : PLAYERS.PLAYER1;
      }
    });
    
    // Set black pieces
    fenData.blackPieces.forEach(fieldNum => {
      const pos = fieldToPosition(fieldNum);
      if (pos) {
        const [row, col] = pos;
        const isKing = fenData.kings.includes(fieldNum);
        this._board[row][col] = isKing ? PLAYERS.PLAYER2 + ' k' : PLAYERS.PLAYER2;
      }
    });
  }

  /**
   * Find all possible moves for a piece
   * @private
   */
  _findAllPossibleMoves(rowIndex, cellIndex, board, activePlayer, gameVariant) {
    const rules = gameVariant.rules;
    
    if (rowIndex < 0 || rowIndex >= this._boardSize || cellIndex < 0 || cellIndex >= this._boardSize) {
      return [];
    }
    
    if (!board[rowIndex][cellIndex] || board[rowIndex][cellIndex] === '-') {
      return [];
    }
    
    const isKing = board[rowIndex][cellIndex].includes('k');
    
    if (rules.orthogonalMovement) {
      return this._findTurkishMoves(rowIndex, cellIndex, board, activePlayer, isKing, rules);
    }
    
    if (isKing) {
      return this._findQueenMoves(rowIndex, cellIndex, board, activePlayer, rules);
    }
    
    // For regular piece
    const moveDirections = activePlayer === PLAYERS.PLAYER2 ? [1] : [-1];
    let captureDirections = [1, -1];
    if (!rules.captureBackwards) {
      captureDirections = activePlayer === PLAYERS.PLAYER2 ? [1] : [-1];
    }

    const jumpMoves = this._findAllJumps(
      rowIndex,
      cellIndex,
      board,
      captureDirections,
      [],
      [],
      isKing,
      activePlayer,
      rules
    );

    if (jumpMoves.length > 0 && rules.mandatoryCapture) {
      if (rules.longestCapture) {
        const maxCaptures = Math.max(...jumpMoves.map(move => move.wouldDelete.length));
        return jumpMoves.filter(move => move.wouldDelete.length === maxCaptures);
      }
      return jumpMoves;
    } else if (jumpMoves.length > 0) {
      return jumpMoves;
    }

    // Regular moves
    const possibleMoves = [];
    const leftOrRight = [1, -1];
    
    moveDirections.forEach(direction => {
      leftOrRight.forEach(lr => {
        const nextRow = rowIndex + direction;
        const nextCell = cellIndex + lr;
        
        if (
          nextRow >= 0 && nextRow < this._boardSize && 
          nextCell >= 0 && nextCell < this._boardSize &&
          board[nextRow][nextCell] === '-'
        ) {
          possibleMoves.push({
            targetRow: nextRow,
            targetCell: nextCell,
            wouldDelete: []
          });
        }
      });
    });

    return possibleMoves;
  }

  /**
   * Find moves for king/queen pieces
   * @private
   */
  _findQueenMoves(rowIndex, cellIndex, board, activePlayer, rules) {
    const captures = this._findQueenCaptures(board, rowIndex, cellIndex, activePlayer, [], new Set(), rules);
    
    if (captures.length > 0) {
      const maxJumpLength = Math.max(...captures.map(move => move.jumpLength));
      return captures.filter(move => move.jumpLength === maxJumpLength);
    }

    const moves = [];
    const directions = [
      { row: 1, col: 1 },
      { row: 1, col: -1 },
      { row: -1, col: 1 },
      { row: -1, col: -1 }
    ];

    const isFlying = !rules || rules.flyingKings !== false;
    
    for (const direction of directions) {
      let currentRow = rowIndex;
      let currentCol = cellIndex;
      let steps = 0;
      const maxSteps = isFlying ? this._boardSize : 1;

      while (steps < maxSteps) {
        currentRow += direction.row;
        currentCol += direction.col;
        steps++;

        if (currentRow < 0 || currentRow >= this._boardSize || currentCol < 0 || currentCol >= this._boardSize) {
          break;
        }

        if (board[currentRow][currentCol] !== '-') {
          break;
        }

        moves.push({
          targetRow: currentRow,
          targetCell: currentCol,
          wouldDelete: []
        });
        
        if (!isFlying) {
          break;
        }
      }
    }

    return moves;
  }

  /**
   * Find captures for king pieces
   * @private
   */
  _findQueenCaptures(board, startRow, startCol, activePlayer, capturedPieces = [], visited = new Set(), rules = null) {
    const moves = [];
    const directions = [
      { row: 1, col: 1 },
      { row: 1, col: -1 },
      { row: -1, col: 1 },
      { row: -1, col: -1 }
    ];

    const posKey = `${startRow},${startCol}`;
    if (visited.has(posKey)) {
      return moves;
    }
    visited.add(posKey);

    for (const direction of directions) {
      let currentRow = startRow;
      let currentCol = startCol;
      let enemyFound = false;
      let enemyPos = null;

      while (true) {
        currentRow += direction.row;
        currentCol += direction.col;

        if (currentRow < 0 || currentRow >= this._boardSize || currentCol < 0 || currentCol >= this._boardSize) {
          break;
        }

        if (board[currentRow][currentCol] !== '-') {
          if (board[currentRow][currentCol].includes(activePlayer === PLAYERS.PLAYER1 ? PLAYERS.PLAYER2 : PLAYERS.PLAYER1)) {
            if (!capturedPieces.some(piece => piece.row === currentRow && piece.col === currentCol)) {
              enemyFound = true;
              enemyPos = { row: currentRow, col: currentCol };
            }
          }
          break;
        }
      }

      if (enemyFound) {
        currentRow = enemyPos.row;
        currentCol = enemyPos.col;

        let maxLandingDistance = this._boardSize;
        if (rules && rules.kingCaptureLimit) {
          maxLandingDistance = rules.kingCaptureLimit;
        }

        let landingDistance = 0;
        while (landingDistance < maxLandingDistance) {
          currentRow += direction.row;
          currentCol += direction.col;
          landingDistance++;

          if (currentRow < 0 || currentRow >= this._boardSize || currentCol < 0 || currentCol >= this._boardSize) {
            break;
          }

          if (board[currentRow][currentCol] !== '-') {
            break;
          }

          const newCapturedPieces = [...capturedPieces, enemyPos];
          
          const tempBoard = board.map(row => [...row]);
          tempBoard[startRow][startCol] = '-';
          tempBoard[enemyPos.row][enemyPos.col] = '-';
          tempBoard[currentRow][currentCol] = activePlayer + ' k';

          const nextCaptures = this._findQueenCaptures(
            tempBoard,
            currentRow,
            currentCol,
            activePlayer,
            newCapturedPieces,
            new Set(visited),
            rules
          );

          if (nextCaptures.length > 0) {
            nextCaptures.forEach(nextCapture => {
              moves.push({
                targetRow: nextCapture.targetRow,
                targetCell: nextCapture.targetCell,
                wouldDelete: [...newCapturedPieces, ...nextCapture.wouldDelete],
                jumpLength: newCapturedPieces.length + nextCapture.wouldDelete.length
              });
            });
          } else {
            moves.push({
              targetRow: currentRow,
              targetCell: currentCol,
              wouldDelete: newCapturedPieces,
              jumpLength: newCapturedPieces.length
            });
          }
        }
      }
    }

    return moves;
  }

  /**
   * Find jumps for regular pieces
   * @private
   */
  _findAllJumps(sourceRowIndex, sourceCellIndex, board, directions, possibleJumps = [], wouldDelete = [], isKing, activePlayer, rules = null, currentJumpLength = 0) {
    if (isKing) {
      const queenMoves = this._findQueenMoves(sourceRowIndex, sourceCellIndex, board, activePlayer, rules);
      return queenMoves.filter(move => move.wouldDelete.length > 0);
    }

    if (!rules || rules.captureBackwards) {
      directions = [1, -1];
    } else {
      directions = activePlayer === PLAYERS.PLAYER2 ? [1] : [-1];
    }

    let thisIterationDidSomething = false;
    const leftOrRight = [1, -1];

    directions.forEach(direction => {
      leftOrRight.forEach(lr => {
        const nextRow = sourceRowIndex + direction;
        const nextCell = sourceCellIndex + lr;
        const jumpRow = sourceRowIndex + (direction * 2);
        const jumpCell = sourceCellIndex + (lr * 2);

        if (
          nextRow >= 0 && nextRow < this._boardSize && 
          nextCell >= 0 && nextCell < this._boardSize &&
          jumpRow >= 0 && jumpRow < this._boardSize && 
          jumpCell >= 0 && jumpCell < this._boardSize &&
          board[nextRow][nextCell] &&
          board[nextRow][nextCell].includes(activePlayer === PLAYERS.PLAYER1 ? PLAYERS.PLAYER2 : PLAYERS.PLAYER1) &&
          board[jumpRow][jumpCell] === '-' &&
          !wouldDelete.some(del => 
            del.targetRow === nextRow && del.targetCell === nextCell
          )
        ) {
          const moveKey = `${jumpRow}${jumpCell}`;
          if (!possibleJumps.some(move => `${move.targetRow}${move.targetCell}` === moveKey)) {
            const newWouldDelete = [
              ...wouldDelete,
              {
                targetRow: nextRow,
                targetCell: nextCell
              }
            ];

            const tempJumpObject = {
              targetRow: jumpRow,
              targetCell: jumpCell,
              wouldDelete: newWouldDelete,
              jumpLength: currentJumpLength + 1
            };

            possibleJumps.push(tempJumpObject);
            thisIterationDidSomething = true;

            this._findAllJumps(
              jumpRow,
              jumpCell,
              board,
              directions,
              possibleJumps,
              newWouldDelete,
              isKing,
              activePlayer,
              rules,
              currentJumpLength + 1
            );
          }
        }
      });
    });

    return possibleJumps;
  }

  /**
   * Find moves for Turkish variant (orthogonal movement)
   * @private
   */
  _findTurkishMoves(rowIndex, cellIndex, board, activePlayer, isKing, rules) {
    const possibleMoves = [];
    
    const directions = [
      { row: -1, col: 0 }, // up
      { row: 0, col: 1 },  // right
      { row: 1, col: 0 },  // down
      { row: 0, col: -1 }  // left
    ];
    
    let allowedDirections = directions;
    if (!isKing && !rules.captureBackwards) {
      allowedDirections = activePlayer === PLAYERS.PLAYER2 
        ? [directions[2]] // black: only down
        : [directions[0]]; // red: only up
    }
    
    allowedDirections.forEach(dir => {
      let row = rowIndex;
      let col = cellIndex;
      
      const maxSteps = isKing && rules.flyingKings ? this._boardSize : 1;
      
      for (let step = 1; step <= maxSteps; step++) {
        row += dir.row;
        col += dir.col;
        
        if (row < 0 || row >= this._boardSize || col < 0 || col >= this._boardSize) {
          break;
        }
        
        if (board[row][col] === '-') {
          possibleMoves.push({
            targetRow: row,
            targetCell: col,
            wouldDelete: []
          });
        } else {
          if (board[row][col].includes(activePlayer === PLAYERS.PLAYER1 ? PLAYERS.PLAYER2 : PLAYERS.PLAYER1)) {
            const jumpRow = row + dir.row;
            const jumpCol = col + dir.col;
            
            if (
              jumpRow >= 0 && jumpRow < this._boardSize &&
              jumpCol >= 0 && jumpCol < this._boardSize &&
              board[jumpRow][jumpCol] === '-'
            ) {
              possibleMoves.push({
                targetRow: jumpRow,
                targetCell: jumpCol,
                wouldDelete: [{
                  targetRow: row,
                  targetCell: col
                }]
              });
            }
          }
          break;
        }
      }
    });
    
    return possibleMoves;
  }

  /**
   * Update available captures
   * @private
   */
  _updateAvailableCaptures() {
    if (!this._variant.rules.mandatoryCapture) {
      this._availableCaptures = [];
      this._captureLength = 0;
      return;
    }
    
    const { captures, maxLength } = this._findAllCaptures(this._board, this._turn, this._variant);
    this._availableCaptures = captures;
    this._captureLength = maxLength;
  }

  /**
   * Find all available captures
   * @private
   */
  _findAllCaptures(board, activePlayer, gameVariant) {
    let allCaptures = [];
    let maxCaptureLength = 0;
    
    if (!gameVariant.rules.mandatoryCapture) {
      return { captures: [], maxLength: 0 };
    }

    for (let i = 0; i < this._boardSize; i++) {
      for (let j = 0; j < this._boardSize; j++) {
        if (board[i][j].includes && board[i][j].includes(activePlayer)) {
          const moves = this._findAllPossibleMoves(i, j, board, activePlayer, gameVariant);
          const captures = moves.filter(move => move.wouldDelete.length > 0);
          
          if (captures.length > 0) {
            const captureLength = captures[0].wouldDelete.length;
            
            if (gameVariant.rules.longestCapture) {
              if (captureLength > maxCaptureLength) {
                maxCaptureLength = captureLength;
                allCaptures = [{
                  piece: { row: i, cell: j },
                  moves: captures
                }];
              } else if (captureLength === maxCaptureLength) {
                allCaptures.push({
                  piece: { row: i, cell: j },
                  moves: captures
                });
              }
            } else {
              allCaptures.push({
                piece: { row: i, cell: j },
                moves: captures
              });
              if (captureLength > maxCaptureLength) {
                maxCaptureLength = captureLength;
              }
            }
          }
        }
      }
    }

    return { captures: allCaptures, maxLength: maxCaptureLength };
  }

  /**
   * Execute move on board
   * @private
   */
  _executeMove(move) {
    const fromRow = this._parseSquare(move.from)[0];
    const fromCol = this._parseSquare(move.from)[1];
    const toRow = this._parseSquare(move.to)[0];
    const toCol = this._parseSquare(move.to)[1];
    
    if (fromRow === null || toRow === null) return false;
    
    const piece = this._board[fromRow][fromCol];
    this._board[fromRow][fromCol] = '-';
    
    // Prepare move result object
    const moveResult = {
      from: move.from,
      to: move.to,
      piece: piece,
      type: MOVE_TYPES.NORMAL,
      captured: []
    };
    
    // Remove captured pieces
    if (move.captures && move.captures.length > 0) {
      move.captures.forEach(captureSquare => {
        const [captureRow, captureCol] = this._parseSquare(captureSquare);
        if (captureRow !== null) {
          const capturedPiece = this._board[captureRow][captureCol];
          this._board[captureRow][captureCol] = '-';
          moveResult.captured.push({
            piece: capturedPiece,
            square: captureSquare
          });
          
          // Update statistics
          this._stats.captures[this._turn]++;
        }
      });
      
      moveResult.type = move.captures.length > 1 ? MOVE_TYPES.MULTIPLE_CAPTURE : MOVE_TYPES.CAPTURE;
    }
    
    // Check for king promotion
    let newPiece = piece;
    if (!piece.includes('k')) {
      if ((this._turn === PLAYERS.PLAYER2 && toRow === this._boardSize - 1) ||
          (this._turn === PLAYERS.PLAYER1 && toRow === 0)) {
        newPiece += ' k';
        moveResult.promotion = true;
        moveResult.type = MOVE_TYPES.PROMOTION;
        this._stats.kings[this._turn]++;
      }
    }
    
    this._board[toRow][toCol] = newPiece;
    
    return moveResult;
  }

  /**
   * Check if move is valid
   * @private
   */
  _isValidMove(move) {
    const allMoves = this.moves();
    return allMoves.some(m => 
      m.from === move.from && 
      m.to === move.to &&
      JSON.stringify(m.captures || []) === JSON.stringify(move.captures || [])
    );
  }

  /**
   * Check for game over
   * @private
   */
  _checkGameOver() {
    // Check if opponent has any moves
    const opponentMoves = this.moves();
    
    if (opponentMoves.length === 0) {
      this._gameStatus = GAME_STATUS.CHECKMATE;
      this._winner = this._turn === PLAYERS.PLAYER1 ? PLAYERS.PLAYER2 : PLAYERS.PLAYER1; // Winner is who made the last move
      return;
    }
    
    // Check if opponent has any pieces left
    let hasOpponentPieces = false;
    for (let i = 0; i < this._boardSize; i++) {
      for (let j = 0; j < this._boardSize; j++) {
        if (this._board[i][j].includes && this._board[i][j].includes(this._turn)) {
          hasOpponentPieces = true;
          break;
        }
      }
      if (hasOpponentPieces) break;
    }
    
    if (!hasOpponentPieces) {
      this._gameStatus = GAME_STATUS.CHECKMATE;
      this._winner = this._turn === PLAYERS.PLAYER1 ? PLAYERS.PLAYER2 : PLAYERS.PLAYER1;
    }
  }

  /**
   * Convert position to algebraic notation
   * @private
   */
  _squareToAlgebraic(row, col) {
    const file = String.fromCharCode(97 + col); // 97 = 'a'
    const rank = this._boardSize - row;
    return file + rank;
  }

  /**
   * Parse algebraic notation to position
   * @private
   */
  _parseSquare(square) {
    if (!square || square.length !== 2) return [null, null];
    
    const file = square.charCodeAt(0) - 97; // 'a' = 97
    const rank = parseInt(square[1], 10);
    
    if (file < 0 || file >= this._boardSize || rank < 1 || rank > this._boardSize) {
      return [null, null];
    }
    
    return [this._boardSize - rank, file];
  }

  /**
   * Parse move notation
   * @private
   */
  _parseMove(notation) {
    // Handle notations like "a3-b4", "a3xb4", "a3:c5"
    const moveRegex = /^([a-h]\d+)[-x:]([a-h]\d+)$/;
    const match = notation.match(moveRegex);
    
    if (!match) return null;
    
    return {
      from: match[1],
      to: match[2],
      captures: notation.includes('x') || notation.includes(':') ? [] : []
    };
  }

  /**
   * Convert board to FEN format
   * @private
   */
  _convertBoardToScanFormat(board) {
    const whitePieces = [];
    const blackPieces = [];
    const whiteKings = [];
    const blackKings = [];
    
    let fieldNumber = 1;
    
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if ((row + col) % 2 === 1) {
          const piece = board[row][col];
          
          if (piece.includes && piece.includes(PLAYERS.PLAYER1)) {
            if (piece.includes('k')) {
              whiteKings.push(fieldNumber);
            } else {
              whitePieces.push(fieldNumber);
            }
          } else if (piece.includes && piece.includes(PLAYERS.PLAYER2)) {
            if (piece.includes('k')) {
              blackKings.push(fieldNumber);
            } else {
              blackPieces.push(fieldNumber);
            }
          }
          
          fieldNumber++;
        }
      }
    }
    
    let fen = 'W:';
    const parts = [];
    
    if (whitePieces.length > 0) {
      parts.push(`W${whitePieces.join(',')}`);
    }
    
    if (blackPieces.length > 0) {
      parts.push(`B${blackPieces.join(',')}`);
    }
    
    if (whiteKings.length > 0 || blackKings.length > 0) {
      const allKings = [...whiteKings, ...blackKings];
      if (allKings.length > 0) {
        parts.push(`K${allKings.join(',')}`);
      }
    }
    
    fen += parts.join(':');
    return fen;
  }
}

// === EXPORTS ===

export default Draughts;

// Export all useful constants
export {
  Draughts,
  BOARD_SIZES,
  BOARD_THEMES,
  GAME_VARIANTS,
  DEFAULT_THEME,
  DEFAULT_VARIANT,
  GAME_STATUS,
  MOVE_TYPES,
  PLAYERS
};