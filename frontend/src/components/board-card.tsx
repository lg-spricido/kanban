"use client";

import { useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";

import type { Card } from "@/lib/types";

type BoardCardProps = {
  card: Card;
  columnId: string;
  onDelete: (columnId: string, cardId: string) => void;
};

export function BoardCard({ card, columnId, onDelete }: BoardCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: card.id,
      data: {
        type: "card",
        cardId: card.id,
        columnId,
      },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition ${
        isDragging ? "rotate-1 shadow-xl opacity-90" : "hover:-translate-y-0.5 hover:shadow-md"
      }`}
      data-testid={`card-${card.id}`}
    >
      <div className="flex items-start justify-between gap-3">
        <button
          type="button"
          className="flex-1 cursor-grab text-left active:cursor-grabbing"
          aria-label={`Mover card ${card.title}`}
          data-testid={`drag-handle-${card.id}`}
          {...attributes}
          {...listeners}
        >
          <p className="line-clamp-1 text-sm font-semibold text-slate-900">{card.title}</p>
          <p className="line-clamp-2 mt-2 text-sm leading-6 text-slate-500">{card.details}</p>
        </button>

        <button
          type="button"
          onClick={() => onDelete(columnId, card.id)}
          className="rounded-full border border-slate-200 p-2 text-slate-400 transition hover:border-rose-200 hover:text-rose-500"
          aria-label={`Excluir card ${card.title}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setIsExpanded((current) => !current)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#209dd7] transition hover:brightness-90"
        >
          {isExpanded ? (
            <>
              Ocultar detalhes
              <ChevronUp className="h-3.5 w-3.5" />
            </>
          ) : (
            <>
              Ver detalhes
              <ChevronDown className="h-3.5 w-3.5" />
            </>
          )}
        </button>

        <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-300">
          Passe o mouse
        </span>
      </div>

      {isExpanded ? (
        <div className="mt-3 rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-600">
          {card.details}
        </div>
      ) : null}

      <div className="pointer-events-none absolute left-4 right-4 top-full z-20 mt-2 translate-y-2 rounded-2xl border border-slate-200 bg-[#032147] p-4 text-sm leading-6 text-slate-100 opacity-0 shadow-xl transition duration-150 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ecad0a]">
          Detalhes completos
        </p>
        <p className="mt-2">{card.details}</p>
      </div>
    </article>
  );
}
