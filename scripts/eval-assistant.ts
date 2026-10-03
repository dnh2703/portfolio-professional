/**
 * Asks real Jev the assistant's topic question for sample visitor messages and reports accuracy at
 * several confidence thresholds, to pick `CONFIDENCE_THRESHOLD`. Needs `TYPESAFE_API_KEY` (e.g. in
 * `.env.local`) and spends tokens, so it never runs in CI:
 *
 *   bun run eval:assistant
 */
import { createChoiceClassifier } from "../src/shared/api/jev";
import {
  CONFIDENCE_THRESHOLD,
  NO_TOPIC,
  topicQuestion,
} from "../src/features/ask-assistant/api/answer-question";

/** A visitor message and the topic id it should get (`NO_TOPIC` for the fallback). */
const SAMPLES: readonly [question: string, expected: string][] = [
  ["What kind of stuff do you make?", "build"],
  ["What do you work on day to day?", "build"],
  ["Can I see your portfolio?", "projects"],
  ["Which projects have you shipped?", "projects"],
  ["Are you looking for a new job?", "availability"],
  ["Can we hire you for a freelance gig?", "availability"],
  ["Which frontend framework do you use?", "frontend"],
  ["Do you know Tailwind and React Query?", "frontend"],
  ["Can you do backend too?", "backend"],
  ["What database do you use?", "backend"],
  ["Where do you work now?", "experience"],
  ["How many years of experience do you have?", "experience"],
  ["Where did you study?", "education"],
  ["Do you have any certificates?", "education"],
  ["Where are you based?", "location"],
  ["What's your time zone?", "location"],
  ["How do you use AI when coding?", "ai_workflow"],
  ["How do you structure a large frontend codebase?", "architecture"],
  ["How do you test your code?", "testing"],
  ["What do you do for fun?", "hobbies"],
  ["hi", "greeting"],
  ["Thanks, that's helpful!", "greeting"],
  ["Tell me about the admin app with SSO", "p01"],
  ["Did you build anything with Arabic RTL support?", "p02"],
  ["What's the appointment booking project?", "p03"],
  ["What did you do on the micro-frontend project?", "p04"],
  ["Have you worked with maps or Mapbox?", "p05"],
  ["What's your hourly rate?", NO_TOPIC],
  ["Would you relocate to Singapore?", NO_TOPIC],
  ["Can you work fully remote?", NO_TOPIC],
  ["Do you speak Japanese?", NO_TOPIC],
  ["What's your phone number?", NO_TOPIC],
  ["How was this website built?", NO_TOPIC],
  ["Write me a poem about cats", NO_TOPIC],
];

const THRESHOLDS = [0.3, 0.4, 0.5, 0.6, 0.7, 0.8];

type Row = { question: string; expected: string; choice: string; confidence: number };

/** Correct at `threshold`: the expected topic above it, or the fallback for a `NO_TOPIC` sample. */
function correct(row: Row, threshold: number): boolean {
  const answered = row.choice !== NO_TOPIC && row.confidence >= threshold;
  return row.expected === NO_TOPIC ? !answered : answered && row.choice === row.expected;
}

function write(line = "") {
  process.stdout.write(`${line}\n`);
}

async function main() {
  const classify = createChoiceClassifier();
  if (!classify) {
    process.stderr.write("Set TYPESAFE_API_KEY (e.g. in .env.local) to run the evaluation.\n");
    process.exit(1);
  }

  const rows: Row[] = await Promise.all(
    SAMPLES.map(async ([question, expected]) => {
      const { choice, confidence } = await classify(topicQuestion(question));
      return { question, expected, choice, confidence };
    }),
  );

  write("expected      picked        conf  question");
  for (const row of rows) {
    const mark = row.choice === row.expected ? " " : "✗";
    write(
      `${mark} ${row.expected.padEnd(12)}${row.choice.padEnd(14)}${row.confidence.toFixed(2)}  ${row.question}`,
    );
  }
  write();
  write("threshold  correct");
  for (const threshold of THRESHOLDS) {
    const hits = rows.filter((row) => correct(row, threshold)).length;
    const current = threshold === CONFIDENCE_THRESHOLD ? "  (current)" : "";
    write(`${threshold.toFixed(2)}       ${hits}/${rows.length}${current}`);
  }
}

await main();
