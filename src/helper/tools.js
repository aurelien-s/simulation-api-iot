export function round(value, precision = 2) {
  const nb = 10 ** precision;
  return Math.round(value * nb) / nb;
}