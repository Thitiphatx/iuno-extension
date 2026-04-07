export function cleanImageUrlSize(url: string): string {
  return url.replace(/-\d+x\d+\.(jpg|jpeg|png|webp)/i, '.$1');
}