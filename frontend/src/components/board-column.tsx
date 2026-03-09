"use client";

import { useMemo, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";

import { BoardCard } from "@/components/board-card";
import type { Column } from "@/lib/types";

type BoardColumnProps = {
  column: Column;
  onRenameColumn: (columnId: string, title: string) => void;
  onAddCard: (columnId: string, title: string, details: string) => void;
  onDeleteCard: (columnId: string, cardId: string) => void;
};

export function BoardColumn({
  column,
  onRenameColumn,
  onAddCard,
  onDeleteCard,
}: BoardColumnProps) {
  const [draftTitle, setDraftTitle] = useState(column.title);
  const [cardTitle, setCardTitle] = useState("");
  const [cardDetails, setCardDetails] = useState("");

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: "column",
      columnId: column.id,
    },
  });

  const cardIds = useMemo(() => column.cards.map((card) => card.id), [column.cards]);

  return (
    <section
      ref={setNodeRef}
      className={`flex min-h-[32rem] flex-col rounded-[28px] border p-5 transition ${
        isOver
          ? "border-[#209dd7] bg-white shadow-lg shadow-sky-100"
          : "border-white/70 bg-white/85 shadow-sm backdrop-blur"
      }`}
      data-testid={`column-${column.id}`}
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <label className="sr-only" htmlFor={`column-title-${column.id}`}>
            Nome da coluna
          </label>
          <input
            id={`column-title-${column.id}`}
            value={draftTitle}
            onChange={(event) => setDraftTitle(event.target.value)}
            onBlur={() => {
              const normalized = draftTitle.trim() || column.title;
              setDraftTitle(normalized);
              onRenameColumn(column.id, normalized);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.currentTarget.blur();
              }
            }}
            className="w-full rounded-xl border border-transparent bg-slate-50 px-3 py-2 text-base font-semibold text-[#032147] outline-none ring-0 transition focus:border-[#ecad0a]"
            data-testid={`column-title-${column.id}`}
          />
        </div>

        <div className="rounded-full bg-[#032147] px-3 py-1 text-xs font-semibold text-white">
          {column.cards.length} propostas
        </div>
      </div>

      <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
        <div className="flex flex-1 flex-col gap-3">
          {column.cards.map((card) => (
            <BoardCard key={card.id} card={card} columnId={column.id} onDelete={onDeleteCard} />
          ))}

          {column.cards.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-8 text-center text-sm text-slate-400">
              Arraste uma proposta para esta etapa.
            </div>
          ) : null}
        </div>
      </SortableContext>

      <form
        className="mt-5 space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (!cardTitle.trim() || !cardDetails.trim()) {
            return;
          }
          onAddCard(column.id, cardTitle, cardDetails);
          setCardTitle("");
          setCardDetails("");
        }}
      >
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Nova proposta
          </label>
          <input
            value={cardTitle}
            onChange={(event) => setCardTitle(event.target.value)}
            placeholder="Conta ou proposta"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#209dd7]"
            data-testid={`add-card-title-${column.id}`}
          />
        </div>

        <textarea
          value={cardDetails}
          onChange={(event) => setCardDetails(event.target.value)}
          placeholder="Resumo comercial"
          rows={3}
          className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#209dd7]"
          data-testid={`add-card-details-${column.id}`}
        />

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#753991] px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110"
          data-testid={`add-card-submit-${column.id}`}
        >
          <Plus className="h-4 w-4" />
          Adicionar proposta
        </button>
      </form>
    </section>
  );
}
