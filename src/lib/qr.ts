import QRCode from "qrcode";

// Server-side QR generation. Returns a data URL (PNG) that can be dropped
// into an <img src>. Used by the medical card page for the provider-scan QR.

export async function memberCodeQrDataUrl(memberCode: string): Promise<string> {
  return QRCode.toDataURL(`vsc:${memberCode}`, {
    margin: 1,
    width: 240,
    color: { dark: "#00346f", light: "#ffffff" },
  });
}
