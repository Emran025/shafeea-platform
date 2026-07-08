export function decodeSvg(dataUri: string): string {
    const base64 = dataUri.replace(/^data:image\/svg\+xml;base64,/, '');
    return atob(base64);
}