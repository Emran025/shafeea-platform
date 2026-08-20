export function decodeSvg(dataUri: string, svgClass?: string): string {
  const base64 = dataUri.replace(/^data:image\/svg\+xml;base64,/, "");
  let svg = atob(base64);

  if (!svgClass) return svg;

  if (/class="[^"]*"/.test(svg)) {
    return svg.replace(
      /class="([^"]*)"/,
      `class="$1 ${svgClass}"`
    );
  }

  return svg.replace(
    /<svg\b/,
    `<svg class="${svgClass}"`
  );
}