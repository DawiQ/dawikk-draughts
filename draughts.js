/**
 * draughts.js
 * A JavaScript library for draughts/checkers game logic
 * Enhanced with FEN validation and draw detection
 */

class Draughts {
    constructor() {
      this._board = [];
      this._turn = 'r'; // 'r' for red/blue, 'b' for black
      this._variant = 'international';
      this._boardSize = 10;
      this._history = [];
      this._moveNumber = 1;
      this._selectedPiece = null;
      this._possibleMoves = [];
      this._captureChain = [];
      this._boardFlipped = false;
      
      // Enhanced properties for draw detection
      this._positionHistory = []; // História pozycji dla wykrywania remisu
      this._halfmoveClock = 0;    // Licznik ruchów bez bicia/ruchu pionkiem
      this._fullmoveNumber = 1;   // Numer pełnego ruchu (po ruchu czarnych)
      
      // Initialize with default variant
      this._loadVariant('international');
    }
  
    // Variants definition
    static VARIANTS = {
      international: {
        id: 'international',
        name: 'International/Polish',
        boardSize: 10,
        rules: {
          flyingKings: true,
          mandatoryCapture: true,
          captureBackwards: true,
          longestCapture: true,
          promotionRank: 'opposite'
        }
      },
      american: {
        id: 'american',
        name: 'American/English',
        boardSize: 8,
        rules: {
          flyingKings: false,
          mandatoryCapture: true,
          captureBackwards: false,
          longestCapture: false,
          promotionRank: 'opposite'
        }
      },
      russian: {
        id: 'russian',
        name: 'Russian',
        boardSize: 8,
        rules: {
          flyingKings: true,
          mandatoryCapture: true,
          captureBackwards: true,
          longestCapture: true,
          promotionRank: 'opposite'
        }
      },
      spanish: {
        id: 'spanish',
        name: 'Spanish',
        boardSize: 8,
        rules: {
          flyingKings: true,
          mandatoryCapture: true,
          captureBackwards: false,
          longestCapture: true,
          promotionRank: 'opposite'
        }
      },
      italian: {
        id: 'italian',
        name: 'Italian',
        boardSize: 8,
        rules: {
          flyingKings: true,
          mandatoryCapture: true,
          captureBackwards: false,
          longestCapture: true,
          promotionRank: 'opposite',
          kingCaptureLimit: 1
        }
      },
      brazilian: {
        id: 'brazilian',
        name: 'Brazilian/Canadian',
        boardSize: 12,
        rules: {
          flyingKings: true,
          mandatoryCapture: true,
          captureBackwards: true,
          longestCapture: true,
          promotionRank: 'opposite'
        }
      },
      turkish: {
        id: 'turkish',
        name: 'Turkish',
        boardSize: 8,
        rules: {
          flyingKings: true,
          mandatoryCapture: true,
          captureBackwards: true,
          longestCapture: false,
          promotionRank: 'opposite',
          orthogonalMovement: true
        }
      }
    };
  
    /**
     * Reset the board to initial position
     */
    reset() {
      this._history = [];
      this._moveNumber = 1;
      this._turn = 'r';
      this._selectedPiece = null;
      this._possibleMoves = [];
      this._captureChain = [];
      this._positionHistory = [];
      this._halfmoveClock = 0;
      this._fullmoveNumber = 1;
      
      this._generateBoard();
      this._positionHistory = [this.getPositionKey()];
      return true;
    }
  
    /**
     * Clear the board
     */
    clear() {
      this._board = [];
      for (let i = 0; i < this._boardSize; i++) {
        this._board.push(Array(this._boardSize).fill(null));
      }
      this._turn = 'r';
      this._history = [];
      this._moveNumber = 1;
      this._selectedPiece = null;
      this._possibleMoves = [];
      this._captureChain = [];
      this._positionHistory = [];
      this._halfmoveClock = 0;
      this._fullmoveNumber = 1;
    }
  
    /**
     * Load a specific variant
     */
    variant(variantName) {
      if (variantName === undefined) {
        return this._variant;
      }
      
      if (this._loadVariant(variantName)) {
        this.reset();
        return true;
      }
      return false;
    }
  
    /**
     * Get/set the board orientation
     */
    orientation(color) {
      if (color === undefined) {
        return this._boardFlipped ? 'b' : 'r';
      }
      
      this._boardFlipped = (color === 'b');
      return this._boardFlipped ? 'b' : 'r';
    }
  
    /**
     * Walidacja FEN - sprawdza czy FEN jest poprawny
     */
    validateFEN(fen) {
      const errors = [];
      
      if (!fen || typeof fen !== 'string') {
        errors.push('FEN musi być niepustym stringiem');
        return { valid: false, errors };
      }
  
      const tokens = fen.split(':');
      
      // Sprawdź podstawową strukturę
      if (tokens.length < 2) {
        errors.push('FEN musi zawierać co najmniej informację o ruchu i pozycji');
        return { valid: false, errors };
      }
  
      // Waliduj turn
      const turn = tokens[0];
      if (turn !== 'W' && turn !== 'B') {
        errors.push('Ruch musi być "W" (białe/czerwone) lub "B" (czarne)');
      }
  
      // Waliduj pozycje pionków
      const maxSquare = this._getMaxSquareNumber();
      const occupiedSquares = new Set();
      const whiteSquares = [];
      const blackSquares = [];
      const kingSquares = [];
  
      for (let i = 1; i < tokens.length; i++) {
        const part = tokens[i];
        const type = part[0];
        
        if (!['W', 'B', 'K'].includes(type)) {
          errors.push(`Nieznany typ pionka: ${type}`);
          continue;
        }
  
        if (part.length === 1) {
          continue; // Pusty segment (np. "K" bez numerów)
        }
  
        const squareStr = part.substring(1);
        const squares = squareStr.split(',').filter(s => s.length > 0);
        
        for (const sq of squares) {
          const square = parseInt(sq);
          
          // Sprawdź czy to liczba
          if (isNaN(square)) {
            errors.push(`Nieprawidłowy numer pola: ${sq}`);
            continue;
          }
          
          // Sprawdź zakres
          if (square < 1 || square > maxSquare) {
            errors.push(`Pole ${square} poza zakresem (1-${maxSquare})`);
            continue;
          }
          
          // Sprawdź czy pole nie jest już zajęte
          if (occupiedSquares.has(square)) {
            errors.push(`Pole ${square} jest zajęte przez więcej niż jeden pionek`);
            continue;
          }
          
          occupiedSquares.add(square);
          
          // Sprawdź czy to właściwe pole (ciemne)
          const coords = this._squareToCoords(square);
          if (!coords || !this._isDarkSquare(coords.row, coords.col)) {
            errors.push(`Pole ${square} nie jest ciemnym polem`);
          }
          
          // Kategoryzuj pionki
          if (type === 'W') whiteSquares.push(square);
          if (type === 'B') blackSquares.push(square);
          if (type === 'K') kingSquares.push(square);
        }
      }
  
      // Sprawdź czy damki są na polach zajętych przez pionki
      for (const kingSquare of kingSquares) {
        if (!whiteSquares.includes(kingSquare) && !blackSquares.includes(kingSquare)) {
          errors.push(`Damka na polu ${kingSquare} musi być również zdefiniowana jako biały lub czarny pionek`);
        }
      }
  
      // Sprawdź rozsądną liczbę pionków
      const maxPieces = Math.floor((this._boardSize * this._boardSize) / 4);
      if (whiteSquares.length > maxPieces) {
        errors.push(`Zbyt wiele białych pionków: ${whiteSquares.length} (max: ${maxPieces})`);
      }
      if (blackSquares.length > maxPieces) {
        errors.push(`Zbyt wiele czarnych pionków: ${blackSquares.length} (max: ${maxPieces})`);
      }
  
      return {
        valid: errors.length === 0,
        errors,
        stats: {
          whitePieces: whiteSquares.length,
          blackPieces: blackSquares.length,
          kings: kingSquares.length,
          totalPieces: whiteSquares.length + blackSquares.length
        }
      };
    }
  
    /**
     * Ulepszona metoda load z walidacją
     */
    loadValidated(fen) {
      const validation = this.validateFEN(fen);
      
      if (!validation.valid) {
        return {
          success: false,
          errors: validation.errors
        };
      }
  
      // Zapisz obecny stan na wypadek rollback
      const backup = {
        board: JSON.parse(JSON.stringify(this._board)),
        turn: this._turn,
        history: [...this._history],
        positionHistory: [...this._positionHistory],
        halfmoveClock: this._halfmoveClock
      };
  
      try {
        const success = this.load(fen);
        if (success) {
          // Dodaj pozycję do historii
          this._positionHistory = [this.getPositionKey()];
          this._halfmoveClock = 0;
          
          return {
            success: true,
            stats: validation.stats
          };
        } else {
          // Przywróć stan
          this._board = backup.board;
          this._turn = backup.turn;
          this._history = backup.history;
          this._positionHistory = backup.positionHistory;
          this._halfmoveClock = backup.halfmoveClock;
          
          return {
            success: false,
            errors: ['Nie udało się wczytać pozycji']
          };
        }
      } catch (error) {
        // Przywróć stan w przypadku błędu
        this._board = backup.board;
        this._turn = backup.turn;
        this._history = backup.history;
        this._positionHistory = backup.positionHistory;
        this._halfmoveClock = backup.halfmoveClock;
        
        return {
          success: false,
          errors: [`Błąd podczas wczytywania: ${error.message}`]
        };
      }
    }
  
    /**
     * Load a position from FEN notation
     */
    load(fen) {
      const tokens = fen.split(':');
      if (tokens.length < 2) return false;
      
      const turn = tokens[0];
      this._turn = turn === 'W' ? 'r' : 'b';
      
      this.clear();
      
      // Parse pieces
      for (let i = 1; i < tokens.length; i++) {
        const part = tokens[i];
        const type = part[0];
        const squares = part.substring(1).split(',');
        
        squares.forEach(sq => {
          const square = parseInt(sq);
          const pos = this._squareToCoords(square);
          if (pos) {
            if (type === 'W') {
              this._board[pos.row][pos.col] = { type: 'p', color: 'r' };
            } else if (type === 'B') {
              this._board[pos.row][pos.col] = { type: 'p', color: 'b' };
            } else if (type === 'K') {
              // Determine king color based on position in standard draughts
              const piece = this._board[pos.row][pos.col];
              if (piece) {
                piece.type = 'k';
              }
            }
          }
        });
      }
      
      // Inicjalizuj śledzenie remisu
      this._positionHistory = [this.getPositionKey()];
      this._halfmoveClock = 0;
      this._fullmoveNumber = 1;
      
      return true;
    }
  
    /**
     * Get FEN notation of current position
     */
    fen() {
      const white = [];
      const black = [];
      const kings = [];
      
      let square = 1;
      for (let row = 0; row < this._boardSize; row++) {
        for (let col = 0; col < this._boardSize; col++) {
          if ((row + col) % 2 === 1) {
            const piece = this._board[row][col];
            if (piece) {
              if (piece.type === 'k') {
                kings.push(square);
              } else if (piece.color === 'r') {
                white.push(square);
              } else {
                black.push(square);
              }
            }
            square++;
          }
        }
      }
      
      let fen = (this._turn === 'r' ? 'W' : 'B') + ':';
      const parts = [];
      
      if (white.length > 0) parts.push('W' + white.join(','));
      if (black.length > 0) parts.push('B' + black.join(','));
      if (kings.length > 0) parts.push('K' + kings.join(','));
      
      return fen + parts.join(':');
    }
  
    /**
     * Rozszerzone FEN z informacją o remisie
     */
    fenWithDrawInfo() {
      const basicFen = this.fen();
      return `${basicFen} ${this._halfmoveClock} ${this._fullmoveNumber}`;
    }
  
    /**
     * Wczytaj FEN z informacją o remisie
     */
    loadFenWithDrawInfo(fen) {
      const parts = fen.split(' ');
      const basicFen = parts.slice(0, -2).join(' ') || parts[0];
      
      const result = this.loadValidated(basicFen);
      if (result.success && parts.length >= 3) {
        this._halfmoveClock = parseInt(parts[parts.length - 2]) || 0;
        this._fullmoveNumber = parseInt(parts[parts.length - 1]) || 1;
      }
      
      return result;
    }
  
    /**
     * Get the current turn
     */
    turn() {
      return this._turn;
    }
  
    /**
     * Get all possible moves for the current position
     */
    moves(options = {}) {
      const moves = [];
      const capturesOnly = options.capturesOnly || false;
      
      // First check for mandatory captures
      const { captures, maxLength } = this._findAllCaptures();
      
      if (this._getCurrentRules().mandatoryCapture && maxLength > 0) {
        // Only capture moves are legal
        captures.forEach(capture => {
          capture.moves.forEach(move => {
            if (!this._getCurrentRules().longestCapture || move.captures.length === maxLength) {
              moves.push(this._moveToSan(capture.from, move));
            }
          });
        });
      } else if (!capturesOnly) {
        // All moves are legal
        for (let row = 0; row < this._boardSize; row++) {
          for (let col = 0; col < this._boardSize; col++) {
            const piece = this._board[row][col];
            if (piece && piece.color === this._turn) {
              const pieceMoves = this._generatePieceMoves(row, col);
              pieceMoves.forEach(move => {
                if (move.captures.length === 0 || !capturesOnly) {
                  moves.push(this._moveToSan({ row, col }, move));
                }
              });
            }
          }
        }
      }
      
      return moves;
    }
  
    /**
     * Make a move
     */
    move(move) {
      let from, to;
      
      // Parse move notation
      if (typeof move === 'string') {
        const parsed = this._parseMove(move);
        if (!parsed) return null;
        from = parsed.from;
        to = parsed.to;
      } else if (move.from && move.to) {
        from = this._parseSquare(move.from);
        to = this._parseSquare(move.to);
      } else {
        return null;
      }
      
      if (!from || !to) return null;
      
      // Validate move
      const piece = this._board[from.row][from.col];
      if (!piece || piece.color !== this._turn) return null;
      
      // Sprawdź typ pionka dla licznika półruchów
      const isPawnMove = piece.type === 'p';
      
      // Find the legal move
      const possibleMoves = this._generatePieceMoves(from.row, from.col);
      const legalMove = possibleMoves.find(m => 
        m.to.row === to.row && m.to.col === to.col
      );
      
      if (!legalMove) return null;
      
      // Check mandatory capture rule
      const { captures, maxLength } = this._findAllCaptures();
      if (this._getCurrentRules().mandatoryCapture && maxLength > 0) {
        if (legalMove.captures.length === 0) return null;
        if (this._getCurrentRules().longestCapture && legalMove.captures.length < maxLength) {
          return null;
        }
      }
      
      // Sprawdź czy to bicie
      const isCapture = legalMove.captures && legalMove.captures.length > 0;
      
      // Execute move
      const moveData = this._makeMove(from, legalMove);
      
      if (moveData) {
        this._history.push(moveData);
        if (this._turn === 'b') this._moveNumber++;
        this._turn = this._turn === 'r' ? 'b' : 'r';
        
        // Aktualizuj licznik półruchów
        if (isCapture || isPawnMove) {
          this._halfmoveClock = 0;
        } else {
          this._halfmoveClock++;
        }
        
        // Aktualizuj licznik pełnych ruchów
        if (this._turn === 'r') {
          this._fullmoveNumber++;
        }
        
        // Dodaj pozycję do historii
        this._positionHistory.push(this.getPositionKey());
        
        // Ogranicz historię do rozumnej wielkości
        if (this._positionHistory.length > 200) {
          this._positionHistory = this._positionHistory.slice(-200);
        }
        
        // Dodaj informację o remisie do wyniku
        moveData.drawInfo = {
          byRepetition: this.isDrawByRepetition(),
          byFiftyMoveRule: this.isDrawByFiftyMoveRule(),
          byInsufficientMaterial: this.isDrawByInsufficientMaterial(),
          isDraw: this.isDraw()
        };
        
        return moveData;
      }
      
      return null;
    }
  
    /**
     * Undo the last move
     */
    undo() {
      const move = this._history.pop();
      if (!move) return null;
      
      // Restore piece to original position
      this._board[move.from.row][move.from.col] = move.piece;
      this._board[move.to.row][move.to.col] = null;
      
      // Restore captured pieces
      move.captured.forEach(cap => {
        this._board[cap.row][cap.col] = cap.piece;
      });
      
      // Restore turn
      this._turn = move.color;
      if (move.color === 'b') this._moveNumber--;
      
      // Przywróć stan remisu
      if (this._positionHistory.length > 0) {
        this._positionHistory.pop();
      }
      
      // Zmniejsz licznik półruchów (przybliżenie)
      if (this._halfmoveClock > 0) {
        this._halfmoveClock--;
      }
      
      // Przywróć licznik pełnych ruchów
      if (this._turn === 'b') {
        this._fullmoveNumber--;
      }
      
      return move;
    }
  
    /**
     * Get board representation
     */
    board() {
      const board = [];
      for (let row = 0; row < this._boardSize; row++) {
        const boardRow = [];
        for (let col = 0; col < this._boardSize; col++) {
          const piece = this._board[row][col];
          boardRow.push(piece ? { ...piece } : null);
        }
        board.push(boardRow);
      }
      return board;
    }
  
    /**
     * Get piece at square
     */
    get(square) {
      const coords = this._parseSquare(square);
      if (!coords) return null;
      return this._board[coords.row][coords.col];
    }
  
    /**
     * Put piece on square
     */
    put(piece, square) {
      const coords = this._parseSquare(square);
      if (!coords) return false;
      
      if (!piece.type || !piece.color) return false;
      if (piece.type !== 'p' && piece.type !== 'k') return false;
      if (piece.color !== 'r' && piece.color !== 'b') return false;
      
      this._board[coords.row][coords.col] = { ...piece };
      return true;
    }
  
    /**
     * Remove piece from square
     */
    remove(square) {
      const coords = this._parseSquare(square);
      if (!coords) return null;
      
      const piece = this._board[coords.row][coords.col];
      this._board[coords.row][coords.col] = null;
      return piece;
    }
  
    /**
     * Check if game is over
     */
    game_over() {
      return !this._hasLegalMoves() || this.isDraw();
    }
  
    /**
     * Check if current side is in stalemate (no legal moves)
     */
    in_stalemate() {
      return !this._hasLegalMoves();
    }
  
    /**
     * Generuje klucz pozycji (bez informacji o ruchu)
     */
    getPositionKey() {
      const pieces = [];
      
      for (let row = 0; row < this._boardSize; row++) {
        for (let col = 0; col < this._boardSize; col++) {
          if ((row + col) % 2 === 1) { // Tylko ciemne pola
            const piece = this._board[row][col];
            if (piece) {
              pieces.push(`${row},${col}:${piece.color}${piece.type}`);
            }
          }
        }
      }
      
      return pieces.join('|');
    }
  
    /**
     * Sprawdza czy pozycja powtarza się
     */
    isDrawByRepetition(threshold = 3) {
      if (this._positionHistory.length < threshold) {
        return false;
      }
      
      const currentPosition = this.getPositionKey();
      let count = 0;
      
      for (const position of this._positionHistory) {
        if (position === currentPosition) {
          count++;
          if (count >= threshold) {
            return true;
          }
        }
      }
      
      return false;
    }
  
    /**
     * Sprawdza remis przez brak postępu (50 ruchów bez bicia/ruchu pionkiem)
     */
    isDrawByFiftyMoveRule(moveLimit = 50) {
      return this._halfmoveClock >= moveLimit;
    }
  
    /**
     * Sprawdza remis przez niewystarczający materiał
     */
    isDrawByInsufficientMaterial() {
      const pieces = { r: { p: 0, k: 0 }, b: { p: 0, k: 0 } };
      
      for (let row = 0; row < this._boardSize; row++) {
        for (let col = 0; col < this._boardSize; col++) {
          const piece = this._board[row][col];
          if (piece) {
            pieces[piece.color][piece.type]++;
          }
        }
      }
      
      const totalPieces = pieces.r.p + pieces.r.k + pieces.b.p + pieces.b.k;
      
      // Tylko jedna damka vs jedna damka
      if (totalPieces === 2 && pieces.r.k === 1 && pieces.b.k === 1) {
        return true;
      }
      
      // Jedna strona ma tylko damkę, druga nic
      if ((pieces.r.k === 1 && pieces.b.p === 0 && pieces.b.k === 0) ||
          (pieces.b.k === 1 && pieces.r.p === 0 && pieces.r.k === 0)) {
        return true;
      }
      
      return false;
    }
  
    /**
     * Główna metoda sprawdzająca remis
     */
    isDraw() {
      return this.isDrawByRepetition() || 
             this.isDrawByFiftyMoveRule() || 
             this.isDrawByInsufficientMaterial();
    }
  
    /**
     * Pobierz dostępne ruchy dla konkretnego pionka
     */
    getMovesForPiece(square) {
      const coords = this._parseSquare(square);
      if (!coords) return [];
      
      const piece = this._board[coords.row][coords.col];
      if (!piece || piece.color !== this._turn) return [];
      
      return this._generatePieceMoves(coords.row, coords.col);
    }
  
    /**
     * Sprawdź czy pozycja to mat/pat
     */
    isCheckmate() {
      return this.game_over() && this._hasCapturesAvailable();
    }
  
    isStalemate() {
      return this.game_over() && !this._hasCapturesAvailable();
    }
  
    _hasCapturesAvailable() {
      const { maxLength } = this._findAllCaptures();
      return maxLength > 0;
    }
  
    /**
     * Informacje o stanie gry
     */
    getGameStatus() {
      if (this.isDraw()) {
        if (this.isDrawByRepetition()) return 'draw_repetition';
        if (this.isDrawByFiftyMoveRule()) return 'draw_fifty_moves';
        if (this.isDrawByInsufficientMaterial()) return 'draw_insufficient_material';
        return 'draw';
      }
      
      if (this.game_over()) {
        return this.in_stalemate() ? 'stalemate' : 'checkmate';
      }
      
      return 'playing';
    }
  
    /**
     * Get PGN representation
     */
    pgn() {
      let pgn = '';
      let moveNumber = 1;
      
      this._history.forEach((move, index) => {
        if (index % 2 === 0) {
          pgn += moveNumber + '. ';
        }
        
        pgn += move.san + ' ';
        
        if (index % 2 === 1) {
          moveNumber++;
        }
      });
      
      return pgn.trim();
    }
  
    /**
     * Load from PGN
     */
    load_pgn(pgn) {
      this.reset();
      
      // Remove comments and variations
      pgn = pgn.replace(/\{[^}]*\}/g, '');
      pgn = pgn.replace(/\([^)]*\)/g, '');
      
      // Extract moves
      const moves = pgn.match(/\d+\.\s*(\S+)\s+(\S+)?/g);
      if (!moves) return false;
      
      for (const movePair of moves) {
        const parts = movePair.match(/\d+\.\s*(\S+)\s*(\S+)?/);
        if (!parts) continue;
        
        // White move
        if (parts[1] && parts[1] !== '...') {
          if (!this.move(parts[1])) return false;
        }
        
        // Black move
        if (parts[2]) {
          if (!this.move(parts[2])) return false;
        }
      }
      
      return true;
    }
  
    /**
     * Get move history
     */
    history() {
      return this._history.map(move => move.san);
    }
  
    /**
     * Get current position as ASCII diagram
     */
    ascii() {
      let s = '   +------------------------+\n';
      
      for (let row = 0; row < this._boardSize; row++) {
        s += ' ' + (this._boardSize - row).toString().padStart(2) + ' |';
        
        for (let col = 0; col < this._boardSize; col++) {
          const piece = this._board[row][col];
          let symbol = ' ';
          
          if ((row + col) % 2 === 0) {
            symbol = '.';
          } else if (piece) {
            if (piece.color === 'r') {
              symbol = piece.type === 'k' ? 'K' : 'O';
            } else {
              symbol = piece.type === 'k' ? 'k' : 'o';
            }
          }
          
          s += ' ' + symbol;
        }
        
        s += ' |\n';
      }
      
      s += '   +------------------------+\n';
      s += '     a b c d e f g h';
      if (this._boardSize > 8) s += ' i j';
      if (this._boardSize > 10) s += ' k l';
      
      return s;
    }
  
    // Private methods
  
    _loadVariant(variantName) {
      const variant = Draughts.VARIANTS[variantName];
      if (!variant) return false;
      
      this._variant = variantName;
      this._boardSize = variant.boardSize;
      this._rules = variant.rules;
      
      return true;
    }
  
    _getCurrentRules() {
      return Draughts.VARIANTS[this._variant].rules;
    }
  
    _generateBoard() {
      this._board = [];
      const variant = Draughts.VARIANTS[this._variant];
      const size = this._boardSize;
      
      // Special case for Turkish draughts
      if (variant.rules.orthogonalMovement) {
        for (let i = 0; i < size; i++) {
          this._board.push(Array(size).fill(null));
        }
        
        // Place pieces (rows 1-2 and size-3 to size-2)
        for (let row = 1; row < 3; row++) {
          for (let col = 0; col < size; col++) {
            this._board[row][col] = { type: 'p', color: 'b' };
          }
        }
        
        for (let row = size - 3; row < size - 1; row++) {
          for (let col = 0; col < size; col++) {
            this._board[row][col] = { type: 'p', color: 'r' };
          }
        }
        
        return;
      }
      
      // Standard diagonal placement
      let piecesRows;
      if (size === 8) {
        piecesRows = 3;
      } else if (size === 10) {
        piecesRows = 4;
      } else if (size === 12) {
        piecesRows = 4;
      } else {
        piecesRows = Math.floor(size / 2) - 1;
      }
      
      for (let i = 0; i < size; i++) {
        this._board.push(Array(size).fill(null));
      }
      
      // Place black pieces
      for (let row = 0; row < piecesRows; row++) {
        for (let col = 0; col < size; col++) {
          if ((row + col) % 2 === 1) {
            this._board[row][col] = { type: 'p', color: 'b' };
          }
        }
      }
      
      // Place red pieces
      for (let row = size - piecesRows; row < size; row++) {
        for (let col = 0; col < size; col++) {
          if ((row + col) % 2 === 1) {
            this._board[row][col] = { type: 'p', color: 'r' };
          }
        }
      }
    }
  
    _squareToCoords(square) {
      const size = this._boardSize;
      let count = 1;
      
      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          if ((row + col) % 2 === 1) {
            if (count === square) {
              return { row, col };
            }
            count++;
          }
        }
      }
      
      return null;
    }
  
    _coordsToSquare(row, col) {
      const size = this._boardSize;
      let count = 1;
      
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if ((r + c) % 2 === 1) {
            if (r === row && c === col) {
              return count;
            }
            count++;
          }
        }
      }
      
      return null;
    }
  
    _parseSquare(square) {
      if (typeof square === 'object' && square.row !== undefined && square.col !== undefined) {
        return square;
      }
      
      if (typeof square === 'string' && square.length === 2) {
        const col = square.charCodeAt(0) - 'a'.charCodeAt(0);
        const row = this._boardSize - parseInt(square[1]);
        
        if (row >= 0 && row < this._boardSize && col >= 0 && col < this._boardSize) {
          return { row, col };
        }
      }
      
      if (typeof square === 'number') {
        return this._squareToCoords(square);
      }
      
      return null;
    }
  
    _squareToAlgebraic(row, col) {
      const file = String.fromCharCode('a'.charCodeAt(0) + col);
      const rank = (this._boardSize - row).toString();
      return file + rank;
    }
  
    _generatePieceMoves(row, col) {
      const piece = this._board[row][col];
      if (!piece || piece.color !== this._turn) return [];
      
      const rules = this._getCurrentRules();
      
      if (piece.type === 'k') {
        return this._generateKingMoves(row, col);
      } else {
        return this._generatePawnMoves(row, col);
      }
    }
  
    _generatePawnMoves(row, col) {
      const moves = [];
      const rules = this._getCurrentRules();
      
      // First check for captures
      const captures = this._generatePawnCaptures(row, col);
      if (captures.length > 0) {
        // If mandatory capture, only return captures
        if (rules.mandatoryCapture) {
          const { maxLength } = this._findAllCaptures();
          if (rules.longestCapture) {
            return captures.filter(move => move.captures.length === maxLength);
          }
          return captures;
        }
        moves.push(...captures);
      }
      
      // Regular moves (if no mandatory captures)
      if (!rules.mandatoryCapture || captures.length === 0) {
        const direction = this._turn === 'b' ? 1 : -1;
        const deltas = rules.orthogonalMovement 
          ? [[direction, 0], [0, 1], [0, -1]] 
          : [[direction, 1], [direction, -1]];
        
        for (const [dr, dc] of deltas) {
          const newRow = row + dr;
          const newCol = col + dc;
          
          if (this._isValidSquare(newRow, newCol) && !this._board[newRow][newCol]) {
            moves.push({
              to: { row: newRow, col: newCol },
              captures: []
            });
          }
        }
      }
      
      return moves;
    }
  
    _generatePawnCaptures(row, col, captured = [], chain = []) {
      const captures = [];
      const rules = this._getCurrentRules();
      
      // Determine capture directions
      let directions;
      if (rules.orthogonalMovement) {
        directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      } else {
        directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
        
        if (!rules.captureBackwards) {
          // Only forward captures
          const forward = this._turn === 'b' ? 1 : -1;
          directions = directions.filter(([dr]) => dr === forward);
        }
      }
      
      for (const [dr, dc] of directions) {
        const midRow = row + dr;
        const midCol = col + dc;
        const endRow = row + dr * 2;
        const endCol = col + dc * 2;
        
        if (!this._isValidSquare(endRow, endCol)) continue;
        
        const midPiece = this._board[midRow][midCol];
        const endPiece = this._board[endRow][endCol];
        
        // Check if we can capture
        if (midPiece && midPiece.color !== this._turn && !endPiece) {
          // Check if already captured in this chain
          const alreadyCaptured = captured.some(cap => 
            cap.row === midRow && cap.col === midCol
          );
          
          if (!alreadyCaptured) {
            const newCaptured = [...captured, { row: midRow, col: midCol, piece: midPiece }];
            const newChain = [...chain, { row: endRow, col: endCol }];
            
            // Check for further captures
            const furtherCaptures = this._generatePawnCaptures(endRow, endCol, newCaptured, newChain);
            
            if (furtherCaptures.length > 0) {
              captures.push(...furtherCaptures);
            } else {
              // No further captures, this is the end
              captures.push({
                to: { row: endRow, col: endCol },
                captures: newCaptured,
                chain: newChain
              });
            }
          }
        }
      }
      
      return captures;
    }
  
    _generateKingMoves(row, col) {
      const moves = [];
      const rules = this._getCurrentRules();
      const flyingKing = rules.flyingKings;
      
      // First check for captures
      const captures = this._generateKingCaptures(row, col);
      if (captures.length > 0) {
        if (rules.mandatoryCapture) {
          const { maxLength } = this._findAllCaptures();
          if (rules.longestCapture) {
            return captures.filter(move => move.captures.length === maxLength);
          }
          return captures;
        }
        moves.push(...captures);
      }
      
      // Regular moves (if no mandatory captures)
      if (!rules.mandatoryCapture || captures.length === 0) {
        const directions = rules.orthogonalMovement
          ? [[1, 0], [-1, 0], [0, 1], [0, -1]]
          : [[1, 1], [1, -1], [-1, 1], [-1, -1]];
        
        for (const [dr, dc] of directions) {
          let steps = 1;
          const maxSteps = flyingKing ? this._boardSize : 1;
          
          while (steps <= maxSteps) {
            const newRow = row + dr * steps;
            const newCol = col + dc * steps;
            
            if (!this._isValidSquare(newRow, newCol)) break;
            if (this._board[newRow][newCol]) break;
            
            moves.push({
              to: { row: newRow, col: newCol },
              captures: []
            });
            
            steps++;
          }
        }
      }
      
      return moves;
    }
  
    _generateKingCaptures(row, col, captured = [], visited = new Set()) {
      const captures = [];
      const rules = this._getCurrentRules();
      const posKey = `${row},${col}`;
      
      if (visited.has(posKey)) return captures;
      visited.add(posKey);
      
      const directions = rules.orthogonalMovement
        ? [[1, 0], [-1, 0], [0, 1], [0, -1]]
        : [[1, 1], [1, -1], [-1, 1], [-1, -1]];
      
      for (const [dr, dc] of directions) {
        let steps = 1;
        let enemyFound = false;
        let enemyPos = null;
        
        // Find enemy piece
        while (true) {
          const checkRow = row + dr * steps;
          const checkCol = col + dc * steps;
          
          if (!this._isValidSquare(checkRow, checkCol)) break;
          
          const piece = this._board[checkRow][checkCol];
          if (piece) {
            if (piece.color !== this._turn) {
              // Check if already captured
              const alreadyCaptured = captured.some(cap =>
                cap.row === checkRow && cap.col === checkCol
              );
              
              if (!alreadyCaptured) {
                enemyFound = true;
                enemyPos = { row: checkRow, col: checkCol, piece };
              }
            }
            break;
          }
          steps++;
        }
        
        // If enemy found, look for landing squares
        if (enemyFound) {
          steps++;
          let landingSteps = 0;
          const maxLanding = rules.kingCaptureLimit || this._boardSize;
          
          while (landingSteps < maxLanding) {
            const landRow = row + dr * steps;
            const landCol = col + dc * steps;
            
            if (!this._isValidSquare(landRow, landCol)) break;
            if (this._board[landRow][landCol]) break;
            
            const newCaptured = [...captured, enemyPos];
            
            // Check for further captures from this position
            const furtherCaptures = this._generateKingCaptures(
              landRow, landCol, newCaptured, new Set(visited)
            );
            
            if (furtherCaptures.length > 0) {
              captures.push(...furtherCaptures);
            } else {
              captures.push({
                to: { row: landRow, col: landCol },
                captures: newCaptured
              });
            }
            
            steps++;
            landingSteps++;
            
            if (!rules.flyingKings) break;
          }
        }
      }
      
      return captures;
    }
  
    _findAllCaptures() {
      const captures = [];
      let maxLength = 0;
      
      for (let row = 0; row < this._boardSize; row++) {
        for (let col = 0; col < this._boardSize; col++) {
          const piece = this._board[row][col];
          if (piece && piece.color === this._turn) {
            const pieceMoves = this._generatePieceMoves(row, col);
            const pieceCaptures = pieceMoves.filter(m => m.captures.length > 0);
            
            if (pieceCaptures.length > 0) {
              const pieceMaxLength = Math.max(...pieceCaptures.map(m => m.captures.length));
              
              if (pieceMaxLength > maxLength) {
                maxLength = pieceMaxLength;
                captures.length = 0;
              }
              
              if (pieceMaxLength === maxLength) {
                captures.push({
                  from: { row, col },
                  moves: pieceCaptures.filter(m => m.captures.length === maxLength)
                });
              }
            }
          }
        }
      }
      
      return { captures, maxLength };
    }
  
    _isValidSquare(row, col) {
      return row >= 0 && row < this._boardSize && col >= 0 && col < this._boardSize;
    }
  
    _hasLegalMoves() {
      for (let row = 0; row < this._boardSize; row++) {
        for (let col = 0; col < this._boardSize; col++) {
          const piece = this._board[row][col];
          if (piece && piece.color === this._turn) {
            const moves = this._generatePieceMoves(row, col);
            if (moves.length > 0) return true;
          }
        }
      }
      return false;
    }
  
    _makeMove(from, move) {
      const piece = this._board[from.row][from.col];
      const captured = [];
      
      // Remove captured pieces
      move.captures.forEach(cap => {
        captured.push({
          row: cap.row,
          col: cap.col,
          piece: this._board[cap.row][cap.col]
        });
        this._board[cap.row][cap.col] = null;
      });
      
      // Move piece
      this._board[from.row][from.col] = null;
      this._board[move.to.row][move.to.col] = { ...piece };
      
      // Check for promotion
      if (piece.type === 'p') {
        const promotionRow = piece.color === 'b' ? this._boardSize - 1 : 0;
        if (move.to.row === promotionRow) {
          this._board[move.to.row][move.to.col].type = 'k';
        }
      }
      
      // Create move record
      const moveData = {
        color: this._turn,
        from: { ...from },
        to: { ...move.to },
        piece: { ...piece },
        captured,
        san: this._moveToSan(from, move),
        flags: {
          capture: captured.length > 0,
          promotion: piece.type === 'p' && this._board[move.to.row][move.to.col].type === 'k'
        }
      };
      
      return moveData;
    }
  
    _moveToSan(from, move) {
      const fromSquare = this._coordsToSquare(from.row, from.col);
      const toSquare = this._coordsToSquare(move.to.row, move.to.col);
      
      if (move.captures.length > 0) {
        if (move.captures.length > 1) {
          // Multi-capture: 32x28x19
          let san = fromSquare.toString();
          move.captures.forEach((cap, index) => {
            if (index === move.captures.length - 1) {
              san += 'x' + toSquare;
            } else {
              // Find intermediate square
              const chain = move.chain || [];
              if (chain[index]) {
                const intSquare = this._coordsToSquare(chain[index].row, chain[index].col);
                san += 'x' + intSquare;
              }
            }
          });
          return san;
        } else {
          // Single capture: 32x28
          return fromSquare + 'x' + toSquare;
        }
      } else {
        // Regular move: 32-28
        return fromSquare + '-' + toSquare;
      }
    }
  
    _parseMove(san) {
      // Handle simple notation: 32-28 or 32x28
      const match = san.match(/^(\d+)([-x])(\d+)$/);
      if (match) {
        const from = this._squareToCoords(parseInt(match[1]));
        const to = this._squareToCoords(parseInt(match[3]));
        return { from, to };
      }
      
      // Handle multi-capture: 32x28x19
      const multiMatch = san.match(/^(\d+)((?:x\d+)+)$/);
      if (multiMatch) {
        const from = this._squareToCoords(parseInt(multiMatch[1]));
        const captures = multiMatch[2].split('x').filter(s => s).map(s => parseInt(s));
        const to = this._squareToCoords(captures[captures.length - 1]);
        return { from, to };
      }
      
      return null;
    }
  
    /**
     * Pomocnicze metody
     */
    _getMaxSquareNumber() {
      return Math.floor((this._boardSize * this._boardSize) / 2);
    }
  
    _isDarkSquare(row, col) {
      return (row + col) % 2 === 1;
    }
  }
  
  // Export for different environments
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Draughts;
  } else {
    window.Draughts = Draughts;
  }