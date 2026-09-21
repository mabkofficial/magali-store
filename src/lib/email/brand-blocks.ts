import { siteConfig } from "@/config/site";
import { emailColors, emailFonts } from "@/lib/email/brand-tokens";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function emailParagraph(text: string, muted = false): string {
  return `<p style="margin:0 0 16px;font-size:15px;line-height:1.55;color:${muted ? emailColors.muted : emailColors.ink};font-family:${emailFonts.sans}">${text}</p>`;
}

export function emailLabel(text: string): string {
  return `<p style="margin:0 0 8px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:${emailColors.botanical};font-family:${emailFonts.sans}">${escapeHtml(text)}</p>`;
}

export function emailKeyValueTable(
  rows: { label: string; value: string }[],
): string {
  const tr = rows
    .map(
      (row) =>
        `<tr><td style="padding:6px 0;color:${emailColors.muted};font-size:14px;font-family:${emailFonts.sans}">${escapeHtml(row.label)}</td><td align="right" style="padding:6px 0;font-size:14px;color:${emailColors.ink};font-family:${emailFonts.sans}">${escapeHtml(row.value)}</td></tr>`,
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px">${tr}</table>`;
}

export function emailPanel(innerHtml: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${emailColors.surfaceMuted};border:1px solid ${emailColors.border};padding:16px"><tr><td>${innerHtml}</td></tr></table>`;
}

export function emailOrderLinesTable(
  rows: { name: string; quantity: number; unitPriceLabel: string }[],
): string {
  const body = rows
    .map(
      (row) =>
        `<tr>
          <td style="padding:12px 0;border-bottom:1px solid ${emailColors.border};font-size:14px;color:${emailColors.ink};font-family:${emailFonts.sans}">${escapeHtml(row.name)}</td>
          <td style="padding:12px 8px;border-bottom:1px solid ${emailColors.border};text-align:center;font-size:14px;color:${emailColors.muted};font-family:${emailFonts.sans}">${row.quantity}</td>
          <td style="padding:12px 0;border-bottom:1px solid ${emailColors.border};text-align:right;font-size:14px;color:${emailColors.ink};font-family:${emailFonts.sans}">${escapeHtml(row.unitPriceLabel)}</td>
        </tr>`,
    )
    .join("");

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
  <thead>
    <tr>
      <th align="left" style="padding:0 0 8px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:${emailColors.muted};font-weight:400;font-family:${emailFonts.sans}">Item</th>
      <th style="padding:0 8px 8px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:${emailColors.muted};font-weight:400;font-family:${emailFonts.sans}">Qty</th>
      <th align="right" style="padding:0 0 8px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:${emailColors.muted};font-weight:400;font-family:${emailFonts.sans}">Price</th>
    </tr>
  </thead>
  <tbody>${body}</tbody>
</table>`;
}

export function emailTotalsTable(rows: {
  label: string;
  value: string;
  strong?: boolean;
}[]): string {
  const tr = rows
    .map((row) => {
      const weight = row.strong ? "font-weight:600;font-size:16px" : "font-size:14px";
      const pad = row.strong ? "padding:12px 0 0" : "padding:4px 0";
      return `<tr><td style="${pad};color:${row.strong ? emailColors.ink : emailColors.muted};${weight};font-family:${emailFonts.sans}">${escapeHtml(row.label)}</td><td align="right" style="${pad};${weight};font-family:${emailFonts.sans}">${escapeHtml(row.value)}</td></tr>`;
    })
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px">${tr}</table>`;
}

export function brandLogoUrl(): string {
  const base = siteConfig.url.replace(/\/$/, "");
  return `${base}/brand/magali-wordmark.png`;
}
