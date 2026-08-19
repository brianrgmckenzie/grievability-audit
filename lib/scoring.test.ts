import { describe, it, expect } from 'vitest';
import { dimScore, allScores, finalScore, band, lowestTwoIndices, type Answers } from './scoring';

// Answering all 3 statements in a dimension with the same value v gives a
// clean dimScore of (v-1)*25 -- i.e. 1->0, 2->25, 3->50, 4->75, 5->100.
function makeAnswers(dimValues: [number, number, number, number, number]): Answers {
  const answers: Answers = {};
  dimValues.forEach((v, d) => {
    for (let s = 0; s < 3; s++) answers[`${d}-${s}`] = v;
  });
  return answers;
}

describe('dimScore', () => {
  it('maps a uniform answer value to (v-1)*25', () => {
    expect(dimScore(makeAnswers([1, 1, 1, 1, 1]), 0)).toBe(0);
    expect(dimScore(makeAnswers([3, 3, 3, 3, 3]), 0)).toBe(50);
    expect(dimScore(makeAnswers([5, 5, 5, 5, 5]), 0)).toBe(100);
  });

  it('returns 0 when any statement in the dimension is unanswered', () => {
    expect(dimScore({}, 0)).toBe(0);
    expect(dimScore({ '0-0': 5, '0-1': 5 }, 0)).toBe(0);
  });
});

describe('allScores', () => {
  it('returns one score per dimension, in order', () => {
    const answers = makeAnswers([1, 2, 3, 4, 5]);
    expect(allScores(answers)).toEqual([0, 25, 50, 75, 100]);
  });
});

describe('finalScore', () => {
  it('weights dimension index 2 (Indispensability) double', () => {
    // scores [0, 0, 100, 0, 0] -> (0+0+200+0+0)/6 = 33.33 -> 33
    expect(finalScore(makeAnswers([1, 1, 5, 1, 1]))).toBe(33);
    // scores [100, 100, 0, 100, 100] -> (100+100+0+100+100)/6 = 66.67 -> 67
    expect(finalScore(makeAnswers([5, 5, 1, 5, 5]))).toBe(67);
  });

  it('is 0 for all-minimum and 100 for all-maximum answers', () => {
    expect(finalScore(makeAnswers([1, 1, 1, 1, 1]))).toBe(0);
    expect(finalScore(makeAnswers([5, 5, 5, 5, 5]))).toBe(100);
  });
});

describe('band', () => {
  it('picks the right band at each boundary', () => {
    expect(band(100).name).toBe('Load bearing');
    expect(band(82).name).toBe('Load bearing');
    expect(band(81).name).toBe('Held in affection');
    expect(band(60).name).toBe('Held in affection');
    expect(band(59).name).toBe('Quietly at risk');
    expect(band(38).name).toBe('Quietly at risk');
    expect(band(37).name).toBe('Disappearing in plain sight');
    expect(band(0).name).toBe('Disappearing in plain sight');
  });
});

describe('lowestTwoIndices', () => {
  it('returns the indices of the two lowest scores, ascending', () => {
    // idx: 0=80, 1=20, 2=50, 3=10, 4=90 -> lowest two are 3 (10) then 1 (20)
    expect(lowestTwoIndices([80, 20, 50, 10, 90])).toEqual([3, 1]);
  });
});
