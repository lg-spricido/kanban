"use client";

import { useMemo, useReducer, useState, useSyncExternalStore } from "react";
import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { BoardColumn } from "@/components/board-column";
import { initialBoardState } from "@/lib/board-data";
import { boardReducer } from "@/lib/board-reducer";
import type { Card } from "@/lib/types";

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#888888]">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-[#032147]">{value}</p>
    </div>
  );
}

export function BoardApp() {
  const [board, dispatch] = useReducer(boardReducer, initialBoardState);
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const isMounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const totalCards = useMemo(
    () => board.columns.reduce((accumulator, column) => accumulator + column.cards.length, 0),
    [board.columns],
  );

  const implementationReady = useMemo(
    () => (board.columns.at(-1)?.cards.length ?? 0).toString().padStart(2, "0"),
    [board.columns],
  );

  const criticalPendencies = useMemo(
    () =>
      (board.columns.find((column) => column.id === "pendencias")?.cards.length ?? 0)
        .toString()
        .padStart(2, "0"),
    [board.columns],
  );

  function handleDragStart(event: DragStartEvent) {
    const activeId = String(event.active.id);

    const card = board.columns.flatMap((column) => column.cards).find((item) => item.id === activeId);
    setActiveCard(card ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveCard(null);

    const { active, over } = event;

    if (!over) {
      return;
    }

    const activeCardId = String(active.id);
    const activeData = active.data.current;
    const overData = over.data.current;

    if (!activeData || activeData.type !== "card") {
      return;
    }

    const fromColumnId = String(activeData.columnId);

    if (overData?.type === "card") {
      const toColumnId = String(overData.columnId);
      const overCardId = String(overData.cardId);

      if (fromColumnId === toColumnId) {
        const sourceColumn = board.columns.find((column) => column.id === fromColumnId);

        if (!sourceColumn) {
          return;
        }

        const oldIndex = sourceColumn.cards.findIndex((card) => card.id === activeCardId);
        const newIndex = sourceColumn.cards.findIndex((card) => card.id === overCardId);

        if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
          return;
        }

        dispatch({
          type: "moveCard",
          payload: {
            activeCardId,
            fromColumnId,
            toColumnId,
            destinationIndex: newIndex,
          },
        });

        return;
      }

      dispatch({
        type: "moveCard",
        payload: {
          activeCardId,
          fromColumnId,
          toColumnId,
          overCardId,
        },
      });

      return;
    }

    if (overData?.type === "column") {
      dispatch({
        type: "moveCard",
        payload: {
          activeCardId,
          fromColumnId,
          toColumnId: String(overData.columnId),
        },
      });
    }
  }

  if (!isMounted) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,#dbeafe_0%,#f8fafc_40%,#eef2ff_100%)] px-5 py-8 text-slate-900 md:px-8 lg:px-10">
        <div className="mx-auto max-w-[1600px]">
          <section className="rounded-[32px] border border-white/70 bg-white/70 p-6 shadow-xl shadow-slate-200/50 backdrop-blur md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#209dd7]">
              Comercial de Seguro de Vida
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#032147] md:text-5xl">
              Implementação de Propostas
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500 md:text-lg">
              Carregando o painel comercial.
            </p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#dbeafe_0%,#f8fafc_40%,#eef2ff_100%)] px-5 py-8 text-slate-900 md:px-8 lg:px-10">
      <div className="mx-auto max-w-[1600px]">
        <section className="rounded-[32px] border border-white/70 bg-white/70 p-6 shadow-xl shadow-slate-200/50 backdrop-blur md:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#209dd7]">
                Comercial de Seguro de Vida
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#032147] md:text-5xl">
                Implementação de Propostas
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500 md:text-lg">
                Organize a jornada comercial da proposta de vida, desde a prospecção
                corporativa até o momento de implantação, mantendo o time alinhado nas
                próximas ações, pendências e contas prioritárias.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <StatCard label="Etapas do fluxo" value="05" />
              <StatCard label="Propostas ativas" value={totalCards.toString().padStart(2, "0")} />
              <StatCard label="Prontas para implantação" value={implementationReady} />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <div className="rounded-full border border-[#ecad0a]/30 bg-[#ecad0a]/10 px-4 py-2 text-sm font-medium text-[#032147]">
              Foco: vida em grupo, prestamista e AP coletivo
            </div>
            <div className="rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm font-medium text-slate-500">
              Pendências críticas: {criticalPendencies}
            </div>
          </div>
        </section>

        <DndContext
          sensors={sensors}
          collisionDetection={(args) => {
            const pointerCollisions = pointerWithin(args);
            return pointerCollisions.length > 0 ? pointerCollisions : closestCorners(args);
          }}
          onDragStart={handleDragStart}
          onDragCancel={() => setActiveCard(null)}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={board.columns.flatMap((column) => column.cards.map((card) => card.id))}
            strategy={verticalListSortingStrategy}
          >
            <section className="mt-8 grid gap-5 xl:grid-cols-5">
              {board.columns.map((column) => (
                <BoardColumn
                  key={column.id}
                  column={column}
                  onRenameColumn={(columnId, title) =>
                    dispatch({ type: "renameColumn", payload: { columnId, title } })
                  }
                  onAddCard={(columnId, title, details) =>
                    dispatch({ type: "addCard", payload: { columnId, title, details } })
                  }
                  onDeleteCard={(columnId, cardId) =>
                    dispatch({ type: "deleteCard", payload: { columnId, cardId } })
                  }
                />
              ))}
            </section>
          </SortableContext>

          <DragOverlay>
            {activeCard ? (
              <article className="w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl">
                <p className="text-sm font-semibold text-slate-900">{activeCard.title}</p>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                  {activeCard.details}
                </p>
              </article>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </main>
  );
}
