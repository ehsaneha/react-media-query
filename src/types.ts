export type BreakPointNames = "xs" | "sm" | "md" | "lg" | "xl";

export type MediaQueryIndex = 0 | 1 | 2 | 3 | 4 | 5;
export type InputableRuleNum = Exclude<MediaQueryIndex, 5>;
export type RuleString =
  | "xs"
  | "exs"
  | "sm"
  | "esm"
  | "md"
  | "emd"
  | "lg"
  | "elg"
  | "xl"
  | "exl";
export type RuleObj = {
  [K in BreakPointNames]?: true;
};

export type MediaQueryRule = InputableRuleNum | RuleString | RuleObj;

export type MediaQueryContextProps = {
  sizes?: Partial<Record<BreakPointNames, number>>;
};

export type TRuleBoolean =
  | RuleString
  | MediaQueryIndex
  | { xs: true; sm?: undefined; md?: undefined; lg?: undefined; xl?: undefined }
  | { xs?: undefined; sm: true; md?: undefined; lg?: undefined; xl?: undefined }
  | { xs?: undefined; sm?: undefined; md: true; lg?: undefined; xl?: undefined }
  | { xs?: undefined; sm?: undefined; md?: undefined; lg: true; xl?: undefined }
  | {
    xs?: undefined;
    sm?: undefined;
    md?: undefined;
    lg?: undefined;
    xl: true;
  };