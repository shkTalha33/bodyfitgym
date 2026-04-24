"use client";

import { useMemo, useState, type ReactNode } from "react";

type Block =
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "list"; items: string[]; ordered: boolean }
  | { type: "paragraph"; text: string };

function splitTableRow(line: string): string[] {
  const parts = line.split("|").map((c) => c.trim());
  while (parts.length && parts[0] === "") parts.shift();
  while (parts.length && parts[parts.length - 1] === "") parts.pop();
  return parts;
}

function isSeparatorRow(cells: string[]): boolean {
  return cells.length > 0 && cells.every((c) => /^[\s:-]+$/.test(c));
}

function parseTableLines(tableLines: string[]): Block | null {
  if (tableLines.length < 2) return null;
  const rows = tableLines.map(splitTableRow).filter((r) => r.length > 0);
  const withoutSep = rows.filter((r) => !isSeparatorRow(r));
  if (withoutSep.length < 2) return null;
  const headers = withoutSep[0];
  const body = withoutSep.slice(1);
  if (body.some((r) => r.length !== headers.length)) {
    const width = Math.max(headers.length, ...body.map((r) => r.length));
    const pad = (r: string[]) => [...r, ...Array(width - r.length).fill("—")];
    return {
      type: "table",
      headers: pad(headers),
      rows: body.map(pad),
    };
  }
  return { type: "table", headers, rows: body };
}

function parseBlocks(text: string): Block[] {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    while (i < lines.length && lines[i].trim() === "") i++;
    if (i >= lines.length) break;

    if (lines[i].includes("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].includes("|") && lines[i].trim() !== "") {
        tableLines.push(lines[i]);
        i++;
      }
      const table = parseTableLines(tableLines);
      if (table) blocks.push(table);
      else {
        blocks.push({ type: "paragraph", text: tableLines.join(" ") });
      }
      continue;
    }

    const lineTrim = lines[i].trim();
    if (/^[-*•]\s+/.test(lineTrim) || /^\d+\.\s+/.test(lineTrim)) {
      const ordered = /^\d+\.\s+/.test(lineTrim);
      const items: string[] = [];
      while (i < lines.length) {
        const raw = lines[i];
        const bullet = raw.match(/^\s*[-*•]\s+(.*)$/) || raw.match(/^\s*\d+\.\s+(.*)$/);
        if (!bullet) break;
        items.push(bullet[1].trim());
        i++;
      }
      if (items.length) blocks.push({ type: "list", items, ordered });
      continue;
    }

    const para: string[] = [];
    while (i < lines.length && lines[i].trim() !== "") {
      para.push(lines[i].trim());
      i++;
    }
    blocks.push({ type: "paragraph", text: para.join(" ") });
  }

  return blocks;
}

function stripMarkdownBold(s: string): ReactNode {
  const parts = s.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    const m = part.match(/^\*\*([^*]+)\*\*$/);
    if (m) return <strong key={idx}>{m[1]}</strong>;
    return part;
  });
}

type Props = {
  content: string;
  /** Smaller typography for chat bubbles */
  variant?: "card" | "chat";
};

const PARA_COLLAPSE = 450;

export default function AiStructuredResponse({ content, variant = "card" }: Props) {
  const [expanded, setExpanded] = useState(false);

  const blocks = useMemo(() => parseBlocks(content.trim() || ""), [content]);

  const summary = useMemo(() => {
    const t = content.trim();
    if (!t) return "";
    const firstBlock = t.split(/\n\s*\n/)[0] ?? t;
    const oneLine = firstBlock.replace(/\n/g, " ").trim();
    if (oneLine.length <= 140) return oneLine;
    const cut = oneLine.slice(0, 137).trim();
    const lastSpace = cut.lastIndexOf(" ");
    return (lastSpace > 80 ? cut.slice(0, lastSpace) : cut) + "…";
  }, [content]);

  const textSize = variant === "chat" ? "text-xs" : "text-sm";
  const tableSize = variant === "chat" ? "text-[11px]" : "text-xs";

  if (!content.trim()) return null;

  const blockNodes =
    blocks.length > 0
      ? blocks.map((block, bi) => {
          if (block.type === "table") {
            return (
              <div key={bi} className="overflow-x-auto rounded-lg border border-[var(--border)]">
                <table className={`w-full min-w-[280px] border-collapse ${tableSize}`}>
                  <thead>
                    <tr className="border-b border-[var(--border)] bg-[var(--surface-strong)]">
                      {block.headers.map((h, hi) => (
                        <th key={hi} className="px-3 py-2 text-left font-semibold text-neutral-100">
                          {stripMarkdownBold(h)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, ri) => (
                      <tr key={ri} className="border-b border-[var(--border)]/80 bg-[var(--surface)] last:border-0">
                        {row.map((cell, ci) => (
                          <td key={ci} className="px-3 py-2 align-top text-neutral-300">
                            {stripMarkdownBold(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }

          if (block.type === "list") {
            const ListTag = block.ordered ? "ol" : "ul";
            return (
              <ListTag
                key={bi}
                className={`list-inside space-y-1 ${block.ordered ? "list-decimal" : "list-disc"} text-neutral-300`}
              >
                {block.items.map((item, li) => (
                  <li key={li} className="leading-snug">
                    {stripMarkdownBold(item)}
                  </li>
                ))}
              </ListTag>
            );
          }

          const long = block.text.length > PARA_COLLAPSE;
          const showText =
            !long || expanded ? block.text : block.text.slice(0, PARA_COLLAPSE).trim() + "…";

          return (
            <p key={bi} className="whitespace-pre-wrap text-neutral-300">
              {stripMarkdownBold(showText)}
              {long && !expanded && (
                <button
                  type="button"
                  onClick={() => setExpanded(true)}
                  className="ml-2 font-semibold text-[#F41E1E] underline-offset-2 hover:underline"
                >
                  Show full text
                </button>
              )}
            </p>
          );
        })
      : [
          <p key="fallback" className="whitespace-pre-wrap text-neutral-300">
            {content.trim()}
          </p>,
        ];

  return (
    <div className={`space-y-3 ${textSize} leading-relaxed text-neutral-200`}>
      {variant === "card" && summary && (
        <div className="rounded-lg border border-[#F41E1E]/30 bg-[#F41E1E]/10 px-3 py-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#f87171]">At a glance</p>
          <p className="mt-1 text-sm font-medium text-neutral-100">{summary}</p>
        </div>
      )}

      <div className="space-y-4">{blockNodes}</div>
    </div>
  );
}
