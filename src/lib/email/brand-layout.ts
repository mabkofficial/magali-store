/** Inline styles for Magali transactional email (matches storefront tokens). */
const colors = {
  ink: "#1a1a18",
  muted: "#6b6860",
  border: "#e3e0da",
  surface: "#fafaf8",
  surfaceMuted: "#f3f2ef",
  botanical: "#3d5a45",
  gold: "#a67c3a",
};

export type BrandEmailOptions = {
  preheader?: string;
  eyebrow?: string;
  headline: string;
  bodyHtml: string;
  footerNote?: string;
  cta?: { label: string; href: string };
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function wrapBrandEmail(options: BrandEmailOptions): string {
  const preheader = options.preheader
    ? `<span style="display:none;max-height:0;overflow:hidden;color:transparent">${escapeHtml(options.preheader)}</span>`
    : "";
  const eyebrow = options.eyebrow ?? "Magali";
  const footer =
    options.footerNote ??
    "Questions? Reply to this email or write to hello@shop.magali.store.";
  const ctaBlock = options.cta
    ? `<p style="margin:28px 0 0"><a href="${escapeHtml(options.cta.href)}" style="display:inline-block;background:${colors.botanical};color:#ffffff;text-decoration:none;padding:12px 24px;font-size:13px;letter-spacing:0.08em;text-transform:uppercase">${escapeHtml(options.cta.label)}</a></p>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="color-scheme" content="light"/>
<title>${escapeHtml(options.headline)}</title>
</head>
<body style="margin:0;padding:0;background:${colors.surfaceMuted};font-family:Georgia,'Times New Roman',serif;color:${colors.ink};line-height:1.55">
${preheader}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${colors.surfaceMuted};padding:32px 16px">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${colors.surface};border:1px solid ${colors.border}">
<tr><td style="padding:28px 32px 8px;border-bottom:3px solid ${colors.botanical}">
<p style="margin:0;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${colors.botanical};font-family:Helvetica,Arial,sans-serif">${escapeHtml(eyebrow)}</p>
<h1 style="margin:12px 0 0;font-size:24px;font-weight:400;color:${colors.ink}">${escapeHtml(options.headline)}</h1>
</td></tr>
<tr><td style="padding:28px 32px;font-size:15px;color:${colors.ink}">
${options.bodyHtml}
${ctaBlock}
</td></tr>
<tr><td style="padding:20px 32px 28px;border-top:1px solid ${colors.border};font-size:12px;color:${colors.muted};font-family:Helvetica,Arial,sans-serif">
<p style="margin:0">${escapeHtml(footer)}</p>
<p style="margin:12px 0 0"><a href="https://www.magali.store" style="color:${colors.gold};text-decoration:none">www.magali.store</a></p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}
