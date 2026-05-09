export const colors = {
  cream: '#FFF8D3',
  navy: '#1D0F5A',
  purple: '#403285',
  orange: '#FE7A15',
  yellow: '#FFD25B',
  lime: '#D4DD18',
  cyan: '#01C3FF',
  blue: '#2772F1',
  pink: '#FF3D7F',
  white: '#FFFFFF',
  black: '#000000',
  muted: '#6C629E',
  overlay: 'rgba(29, 15, 90, 0.72)'
};

export const palette = [
  { bg: colors.orange, ink: colors.white, meta: colors.navy },
  { bg: colors.yellow, ink: colors.navy, meta: colors.purple },
  { bg: colors.lime, ink: colors.navy, meta: colors.purple },
  { bg: colors.cyan, ink: colors.navy, meta: colors.navy },
  { bg: colors.purple, ink: colors.white, meta: colors.yellow },
  { bg: colors.blue, ink: colors.white, meta: colors.yellow }
] as const;

export function pickPalette(id: string) {
  let hash = 0;
  for (let index = 0; index < id.length; index += 1) {
    hash = (hash * 31 + id.charCodeAt(index)) >>> 0;
  }

  return palette[hash % palette.length];
}
