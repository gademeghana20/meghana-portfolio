import Link from "next/link";
import { Plus } from "lucide-react";
import { RowActions } from "./RowActions";

export interface ListItem {
  id: string;
  title: string;
  subtitle?: string;
  /** undefined = no draft/publish state (e.g. skill categories). */
  published?: boolean;
}

/** Shared admin list: status badge, reorder, publish toggle, edit, delete. */
export function ItemList({
  table,
  basePath,
  items,
  addLabel,
  emptyText,
}: {
  table: string;
  basePath: string;
  items: ListItem[];
  addLabel: string;
  emptyText: string;
}) {
  return (
    <div>
      <Link
        href={`${basePath}/new`}
        className="inline-flex items-center gap-2 rounded-lg bg-accent-fill px-4 py-2.5 text-sm font-medium text-on-accent hover:bg-accent-fill-hover"
      >
        <Plus size={16} aria-hidden="true" /> {addLabel}
      </Link>

      {items.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-border p-6 text-muted">
          {emptyText}
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {items.map((item, i) => (
            <li key={item.id} className="rounded-2xl border border-border bg-surface shadow-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium">{item.title}</p>
                  {item.subtitle && (
                    <p className="mt-0.5 text-sm text-muted">{item.subtitle}</p>
                  )}
                </div>
                {item.published !== undefined && (
                  <span
                    className={
                      item.published
                        ? "rounded-full border border-success/40 px-2.5 py-0.5 text-xs text-success"
                        : "rounded-full border border-warning/40 px-2.5 py-0.5 text-xs text-warning"
                    }
                  >
                    {item.published ? "Published" : "Draft"}
                  </span>
                )}
              </div>
              <div className="mt-4">
                <RowActions
                  table={table}
                  id={item.id}
                  title={item.title}
                  published={item.published}
                  editHref={`${basePath}/${item.id}`}
                  isFirst={i === 0}
                  isLast={i === items.length - 1}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
