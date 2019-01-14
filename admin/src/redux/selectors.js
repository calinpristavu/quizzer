export const noGraphEntries = 29;

export function selectStatAvgResult(state) {
  return findStatFrom(state.stats.avgResult, state.stats.from);
}

export function selectStatBestResult(state) {
  return findStatFrom(state.stats.bestResult, state.stats.from);
}

export function selectQuestionTemplatesWithUsage (state) {
  return state.questionTemplate.list.map((qt) => {
    qt.usage = state.quiz.list.reduce((count, q) => {
      if (q.Questions.some(e => e.QuestionTemplateID === qt.ID)) {
        count ++;
      }

      return count;
    }, 0) * 100 / state.quiz.list.length;

    return qt;
  })
}

export function selectInProgressQuizzes (state) {
  return state.quiz.list.filter(
    quiz => !quiz.Questions.some(question => !question.isAnswered)
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
