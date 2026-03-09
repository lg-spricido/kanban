"use client";

import { CSS } from "@dnd-kit/utilities";
import { Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";

import type { Card } from "@/lib/types";

type BoardCardProps = {
  card: Card;
  columnId: string;
  onDelete: (columnId: string, cardId: string) => void;
};

export function BoardCard({ card, columnId, onDelete }: BoardCardProps) {
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
      className={`rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition ${
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
          <p className="text-sm font-semibold text-slate-900">{card.title}</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">{card.details}</p>
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
    </article>
  );
}
