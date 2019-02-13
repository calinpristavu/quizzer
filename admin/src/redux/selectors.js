export const noGraphEntries = 29;

export function selectStatAvgResult(state) {
  return findStatFrom(state.stats.avgResult, state.stats.from);
}

export function selectStatBestResult(state) {
  return findStatFrom(state.stats.bestResult, state.stats.from);
}

export function selectQuestionTemplatesWithUsage (state) {
  return state.questionTemplate.list.map(qt => {
    qt.usage = qt.Usages.length * 100 / state.quiz.list.size;

    return qt;
  })
}

export function selectInProgressQuizzes (state) {
  return state.quiz.list.filter(q => q.Active)
}

export function viewedQuestionTemplate(state) {
  if (null === state.questionTemplate.viewedItem) {
    return null;
  }

  return state.questionTemplate.list.get(state.questionTemplate.viewedItem)
}

export function viewedQuizResult(state) {
  if (null === state.quiz.viewedItem) {
    return null;
  }

  return state.quiz.list.get(state.quiz.viewedItem)
}

export function viewedUser(state) {
  if (null === state.user.viewUser) {
    return null;
  }

  return state.user.all.get(state.user.viewUser)
}

export function newCandidates(state) {
  return state.user.candidates.map(
    c => ({
      ...c,
      User: state.user.all.find(u => u.Username === c.username)
    })
  )
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
