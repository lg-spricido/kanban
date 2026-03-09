export type Card = {
  id: string;
  title: string;
  details: string;
};

export type Column = {
  id: string;
  title: string;
  cards: Card[];
};

export type BoardState = {
  columns: Column[];
};

export type AddCardPayload = {
  columnId: string;
  title: string;
  details: string;
};

export type DeleteCardPayload = {
  columnId: string;
  cardId: string;
};

export type RenameColumnPayload = {
  columnId: string;
  title: string;
};

export type MoveCardPayload = {
  activeCardId: string;
  fromColumnId: string;
  toColumnId: string;
  overCardId?: string;
  destinationIndex?: number;
};
