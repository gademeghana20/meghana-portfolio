/** Stagger delay in ms: 0, 80, 160 ... capped so long lists don't feel slow. */
export const stagger = (index: number) => Math.min(index, 4) * 80;
