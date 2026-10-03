/** A calendar month; `month` is 1–12. */
export type YearMonth = {
  year: number;
  month: number;
};

/** Leave `end` out for a current role ("Now"). */
export type Period = {
  start: YearMonth;
  end?: YearMonth;
};

export type Experience = {
  id: string;
  company: string;
  role: string;
  period: Period;
};

export type Education = {
  id: string;
  institution: string;
  program: string;
};
