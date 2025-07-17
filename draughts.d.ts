// TypeScript definitions for draughts-engine

export interface Piece {
    type: 'p' | 'k'; // pawn or king
    color: 'r' | 'b'; // red/white or black
  }
  
  export interface Square {
    row: number;
    col: number;
  }
  
  export interface Move {
    to: Square;
    captures: CapturedPiece[];
    chain?: Square[];
  }
  
  export interface CapturedPiece {
    row: number;
    col: number;
    piece: Piece;
  }
  
  export interface MoveResult {
    color: 'r' | 'b';
    from: Square;
    to: Square;
    piece: Piece;
    captured: CapturedPiece[];
    san: string;
    flags: {
      capture: boolean;
      promotion: boolean;
    };
    drawInfo?: DrawInfo;
  }
  
  export interface DrawInfo {
    isDraw: boolean;
    byRepetition: boolean;
    byFiftyMoveRule: boolean;
    byInsufficientMaterial: boolean;
  }
  
  export interface FENValidation {
    valid: boolean;
    errors: string[];
    stats?: {
      whitePieces: number;
      blackPieces: number;
      kings: number;
      totalPieces: number;
    };
  }
  
  export interface LoadResult {
    success: boolean;
    errors?: string[];
    stats?: {
      whitePieces: number;
      blackPieces: number;
      kings: number;
      totalPieces: number;
    };
  }
  
  export interface VariantRules {
    flyingKings: boolean;
    mandatoryCapture: boolean;
    captureBackwards: boolean;
    longestCapture: boolean;
    promotionRank: string;
    orthogonalMovement?: boolean;
    kingCaptureLimit?: number;
  }
  
  export interface Variant {
    id: string;
    name: string;
    boardSize: number;
    rules: VariantRules;
  }
  
  export interface MovesOptions {
    capturesOnly?: boolean;
  }
  
  export type GameStatus = 
    | 'playing'
    | 'draw'
    | 'draw_repetition'
    | 'draw_fifty_moves'
    | 'draw_insufficient_material'
    | 'stalemate'
    | 'checkmate';
  
  export type Color = 'r' | 'b';
  export type PieceType = 'p' | 'k';
  export type SquareInput = string | number | Square;
  export type MoveInput = string | { from: SquareInput; to: SquareInput };
  
  export declare class Draughts {
    static readonly VARIANTS: Record<string, Variant>;
  
    constructor();
  
    // Game control
    reset(): boolean;
    clear(): void;
    move(move: MoveInput): MoveResult | null;
    undo(): MoveResult | null;
    variant(): string;
    variant(variantName: string): boolean;
  
    // Board state
    board(): (Piece | null)[][];
    turn(): Color;
    moves(options?: MovesOptions): string[];
    getMovesForPiece(square: SquareInput): Move[];
    game_over(): boolean;
    in_stalemate(): boolean;
    getGameStatus(): GameStatus;
  
    // Position management
    get(square: SquareInput): Piece | null;
    put(piece: Piece, square: SquareInput): boolean;
    remove(square: SquareInput): Piece | null;
    orientation(): Color;
    orientation(color: Color): Color;
  
    // FEN operations
    fen(): string;
    load(fen: string): boolean;
    validateFEN(fen: string): FENValidation;
    loadValidated(fen: string): LoadResult;
    fenWithDrawInfo(): string;
    loadFenWithDrawInfo(fen: string): LoadResult;
  
    // Draw detection
    isDraw(): boolean;
    isDrawByRepetition(threshold?: number): boolean;
    isDrawByFiftyMoveRule(moveLimit?: number): boolean;
    isDrawByInsufficientMaterial(): boolean;
    getPositionKey(): string;
  
    // Game analysis
    isCheckmate(): boolean;
    isStalemate(): boolean;
  
    // PGN operations
    pgn(): string;
    load_pgn(pgn: string): boolean;
    history(): string[];
  
    // Utility
    ascii(): string;
  
    // Internal properties (readonly in TypeScript)
    readonly _board: (Piece | null)[][];
    readonly _turn: Color;
    readonly _variant: string;
    readonly _boardSize: number;
    readonly _history: MoveResult[];
    readonly _moveNumber: number;
    readonly _positionHistory: string[];
    readonly _halfmoveClock: number;
    readonly _fullmoveNumber: number;
  
    // Internal methods (for advanced usage)
    _coordsToSquare(row: number, col: number): number | null;
    _squareToCoords(square: number): Square | null;
    _parseSquare(square: SquareInput): Square | null;
    _generatePieceMoves(row: number, col: number): Move[];
    _getCurrentRules(): VariantRules;
    _isValidSquare(row: number, col: number): boolean;
    _getMaxSquareNumber(): number;
    _isDarkSquare(row: number, col: number): boolean;
  }
  
  // Default export
  export default Draughts;