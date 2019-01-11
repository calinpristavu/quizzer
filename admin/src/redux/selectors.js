export const noGraphEntries = 29;

export function selectStatAvgResult(state) {
  return findStatFrom(state.stats.avgResult, state.stats.from);
}

export function selectStatBestResult(state) {
  return findStatFrom(state.stats.bestResult, state.stats.from);
}

function findStatFrom(data, from) {
  const values = [];

  for (let i = 0; i < noGraphEntries; i++) {
    const date = from.clone().add(i, 'days');
    if (data[date.format('Y-M-D')] === undefined) {
      values.push(0);

      continue;
    }

    values.push(data[date.format('Y-M-D')]);
  }

  return values
}
