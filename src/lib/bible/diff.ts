/**
 * Compute per-token diff between two strings of scripture text using LCS.
 * Returns aligned arrays of segments where each segment is tagged "equal" / "diff".
 *
 * Tokenization keeps words and punctuation as separate tokens; whitespace is
 * collapsed on output so the result reads naturally.
 */

export type DiffSegment = { kind: "equal" | "diff"; text: string };

const WORD_OR_PUNCT = /[\w'’-]+|[^\s]/g;

function tokenize(s: string): string[] {
  return s.match(WORD_OR_PUNCT) ?? [];
}

function lcs(a: string[], b: string[]): number[][] {
  const n = a.length;
  const m = b.length;
  const dp: number[][] = Array(n + 1)
    .fill(null)
    .map(() => Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] =
        a[i].toLowerCase() === b[j].toLowerCase()
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  return dp;
}

export function diffTexts(left: string, right: string): {
  left: DiffSegment[];
  right: DiffSegment[];
} {
  const a = tokenize(left);
  const b = tokenize(right);
  const dp = lcs(a, b);

  const leftOut: DiffSegment[] = [];
  const rightOut: DiffSegment[] = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i].toLowerCase() === b[j].toLowerCase()) {
      pushEqual(leftOut, a[i]);
      pushEqual(rightOut, b[j]);
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      pushDiff(leftOut, a[i]);
      i++;
    } else {
      pushDiff(rightOut, b[j]);
      j++;
    }
  }
  while (i < a.length) {
    pushDiff(leftOut, a[i++]);
  }
  while (j < b.length) {
    pushDiff(rightOut, b[j++]);
  }
  return { left: leftOut, right: rightOut };
}

function joinable(prev: string, next: string): boolean {
  // Don't put a space before punctuation
  return !/^[.,;:!?'’"”)\]]/.test(next);
}

function pushEqual(out: DiffSegment[], token: string) {
  push(out, "equal", token);
}
function pushDiff(out: DiffSegment[], token: string) {
  push(out, "diff", token);
}
function push(out: DiffSegment[], kind: "equal" | "diff", token: string) {
  const last = out[out.length - 1];
  const sep = last && joinable(last.text, token) ? " " : "";
  if (last && last.kind === kind) {
    last.text += sep + token;
  } else {
    out.push({ kind, text: (last ? sep : "") + token });
  }
}
