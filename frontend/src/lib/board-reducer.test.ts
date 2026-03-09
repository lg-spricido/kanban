import { beforeEach, describe, expect, it, vi } from "vitest";

import { initialBoardState } from "./board-data";
import { boardReducer } from "./board-reducer";

describe("boardReducer", () => {
  beforeEach(() => {
    vi.spyOn(globalThis.crypto, "randomUUID").mockReturnValue("novo-card-id");
  });

  it("renames a column while trimming whitespace", () => {
    const state = boardReducer(initialBoardState, {
      type: "renameColumn",
      payload: {
        columnId: "captacao",
        title: "  Novos Negócios  ",
      },
    });

    expect(state.columns[0]?.title).toBe("Novos Negócios");
  });

  it("adds a card to the target column", () => {
    const state = boardReducer(initialBoardState, {
      type: "addCard",
      payload: {
        columnId: "triagem",
        title: "Apólice Condomínio Premium",
        details: "Revisar questionário patrimonial e limite solicitado.",
      },
    });

    expect(state.columns[1]?.cards).toHaveLength(2);
    expect(state.columns[1]?.cards.at(-1)).toMatchObject({
      id: "card-novo-card-id",
      title: "Apólice Condomínio Premium",
    });
  });

  it("deletes the requested card", () => {
    const state = boardReducer(initialBoardState, {
      type: "deleteCard",
      payload: {
        columnId: "analise",
        cardId: "card-analise-1",
      },
    });

    expect(state.columns[2]?.cards.map((card) => card.id)).not.toContain("card-analise-1");
  });

  it("moves a card to another column before the target card", () => {
    const state = boardReducer(initialBoardState, {
      type: "moveCard",
      payload: {
        activeCardId: "card-captacao-1",
        fromColumnId: "captacao",
        toColumnId: "analise",
        overCardId: "card-analise-2",
      },
    });

    expect(state.columns[0]?.cards.map((card) => card.id)).not.toContain("card-captacao-1");
    expect(state.columns[2]?.cards.map((card) => card.id)).toEqual([
      "card-analise-1",
      "card-captacao-1",
      "card-analise-2",
    ]);
  });

  it("reorders cards inside the same column using the destination index", () => {
    const state = boardReducer(initialBoardState, {
      type: "moveCard",
      payload: {
        activeCardId: "card-analise-2",
        fromColumnId: "analise",
        toColumnId: "analise",
        destinationIndex: 0,
      },
    });

    expect(state.columns[2]?.cards.map((card) => card.id)).toEqual([
      "card-analise-2",
      "card-analise-1",
    ]);
  });
});
