import { siteConfig } from "@/config/site";
import { brandLogoUrl } from "@/lib/email/brand-blocks";
import { emailColors, emailFonts } from "@/lib/email/brand-tokens";

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
    ? `<p style="margin:28px 0 0"><a href="${escapeHtml(options.cta.href)}" style="display:inline-block;background:${emailColors.botanical};color:#ffffff;text-decoration:none;padding:12px 28px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;font-family:${emailFonts.sans}">${escapeHtml(options.cta.label)}</a></p>`
    : "";
  const storeUrl = siteConfig.url.replace(/\/$/, "");
  const logoUrl = brandLogoUrl();

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="color-scheme" content="light"/>
<title>${escapeHtml(options.headline)}</title>
</head>
<body style="margin:0;padding:0;background:${emailColors.surfaceMuted};font-family:${emailFonts.sans};color:${emailColors.ink};line-height:1.55">
${preheader}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${emailColors.surfaceMuted};padding:32px 16px">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${emailColors.surface};border:1px solid ${emailColors.border}">
<tr><td style="padding:28px 32px 20px;border-bottom:1px solid ${emailColors.border}">
<a href="${escapeHtml(storeUrl)}" style="text-decoration:none;display:inline-block">
<img src="${escapeHtml(logoUrl)}" width="140" height="82" alt="Magali" style="display:block;height:auto;max-width:140px;border:0"/>
</a>
</td></tr>
<tr><td style="padding:8px 32px 0">
<p style="margin:0;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${emailColors.botanical};font-family:${emailFonts.sans}">${escapeHtml(eyebrow)}</p>
<h1 style="margin:10px 0 0;font-size:26px;font-weight:400;color:${emailColors.ink};font-family:${emailFonts.display};line-height:1.25">${escapeHtml(options.headline)}</h1>
</td></tr>
<tr><td style="padding:24px 32px 28px;font-size:15px;color:${emailColors.ink};font-family:${emailFonts.sans}">
${options.bodyHtml}
${ctaBlock}
</td></tr>
<tr><td style="padding:20px 32px 28px;border-top:1px solid ${emailColors.border};font-size:12px;color:${emailColors.muted};font-family:${emailFonts.sans};line-height:1.5">
<p style="margin:0">${escapeHtml(footer)}</p>
<p style="margin:12px 0 0"><a href="${escapeHtml(storeUrl)}" style="color:${emailColors.gold};text-decoration:none;font-size:12px">www.magali.store</a></p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}
