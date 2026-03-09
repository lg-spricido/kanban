import type {
  AddCardPayload,
  BoardState,
  Card,
  DeleteCardPayload,
  MoveCardPayload,
  RenameColumnPayload,
} from "./types";

type BoardAction =
  | { type: "renameColumn"; payload: RenameColumnPayload }
  | { type: "addCard"; payload: AddCardPayload }
  | { type: "deleteCard"; payload: DeleteCardPayload }
  | { type: "moveCard"; payload: MoveCardPayload };

function normalizeTitle(title: string) {
  return title.trim();
}

function createCardId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `card-${crypto.randomUUID()}`;
  }

  return `card-${Math.random().toString(36).slice(2, 10)}`;
}

function removeCard(
  columns: BoardState["columns"],
  cardId: string,
): { card: Card | null; columns: BoardState["columns"] } {
  let removedCard: Card | null = null;

  const nextColumns = columns.map((column) => {
    const cardIndex = column.cards.findIndex((card) => card.id === cardId);

    if (cardIndex === -1) {
      return column;
    }

    removedCard = column.cards[cardIndex];

    return {
      ...column,
      cards: column.cards.filter((card) => card.id !== cardId),
    };
  });

  return { card: removedCard, columns: nextColumns };
}

export function boardReducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case "renameColumn": {
      const title = normalizeTitle(action.payload.title);

      if (!title) {
        return state;
      }

      return {
        columns: state.columns.map((column) =>
          column.id === action.payload.columnId ? { ...column, title } : column,
        ),
      };
    }

    case "addCard": {
      const title = normalizeTitle(action.payload.title);
      const details = action.payload.details.trim();

      if (!title || !details) {
        return state;
      }

      return {
        columns: state.columns.map((column) =>
          column.id === action.payload.columnId
            ? {
                ...column,
                cards: [
                  ...column.cards,
                  {
                    id: createCardId(),
                    title,
                    details,
                  },
                ],
              }
            : column,
        ),
      };
    }

    case "deleteCard": {
      return {
        columns: state.columns.map((column) =>
          column.id === action.payload.columnId
            ? {
                ...column,
                cards: column.cards.filter((card) => card.id !== action.payload.cardId),
              }
            : column,
        ),
      };
    }

    case "moveCard": {
      if (
        action.payload.fromColumnId === action.payload.toColumnId &&
        action.payload.destinationIndex === undefined &&
        !action.payload.overCardId
      ) {
        return state;
      }

      const { card, columns } = removeCard(state.columns, action.payload.activeCardId);

      if (!card) {
        return state;
      }

      return {
        columns: columns.map((column) => {
          if (column.id !== action.payload.toColumnId) {
            return column;
          }

          if (typeof action.payload.destinationIndex === "number") {
            const cards = [...column.cards];
            cards.splice(action.payload.destinationIndex, 0, card);

            return {
              ...column,
              cards,
            };
          }

          const targetIndex = action.payload.overCardId
            ? column.cards.findIndex((item) => item.id === action.payload.overCardId)
            : -1;

          if (targetIndex === -1) {
            return {
              ...column,
              cards: [...column.cards, card],
            };
          }

          const cards = [...column.cards];
          cards.splice(targetIndex, 0, card);

          return {
            ...column,
            cards,
          };
        }),
      };
    }

    default:
      return state;
  }
}
