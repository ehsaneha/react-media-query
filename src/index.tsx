import React from "react";

import type {
  BreakPointNames,
  MediaQueryIndex,
  InputableRuleNum,
  RuleString,
  MediaQueryRule,
  MediaQueryContextProps,
  TRuleBoolean,
} from "./types";
export { MediaQueryIndex, MediaQueryRule } from "./types";

//
//
//
//
// --- Constants ---
const MEDIA_QUERY_DEFAULT_SIZES = {
  xs: 576,
  sm: 768,
  md: 992,
  lg: 1200,
  xl: 1700,
} as const;

export const BREAKPOINTS: Record<
  Uppercase<BreakPointNames>,
  InputableRuleNum
> = {
  XS: 0,
  SM: 1,
  MD: 2,
  LG: 3,
  XL: 4,
};

export const MEDIA_QUERRY_RULES: Record<Uppercase<RuleString>, RuleString> = {
  XS: "xs",
  EXS: "exs",
  SM: "sm",
  ESM: "esm",
  MD: "md",
  EMD: "emd",
  LG: "lg",
  ELG: "elg",
  XL: "xl",
  EXL: "exl",
};

const ruleToIndexMap: Record<RuleString, InputableRuleNum> = {
  xs: 0,
  exs: 0,
  sm: 1,
  esm: 1,
  md: 2,
  emd: 2,
  lg: 3,
  elg: 3,
  xl: 4,
  exl: 4,
};

//
//
//
//
// --- Context ---
const MediaQueryContext = React.createContext({} as MediaQueryContextProps);
MediaQueryContext.displayName = "MediaQueryContext";

export function MediaQueryProvider({
  children,
  ...props
}: MediaQueryContextProps & { children?: React.ReactNode }) {
  return (
    <MediaQueryContext.Provider value={props}>
      {children}
    </MediaQueryContext.Provider>
  );
}

function useMediaQueryContext() {
  const _context = React.useContext(MediaQueryContext);

  return {
    sizes: {
      ...MEDIA_QUERY_DEFAULT_SIZES,
      ..._context.sizes,
    },
  };
}

//
//
//
//
// --- Utility ---
function getCurrentBreakPointIndex(
  sizes: Record<BreakPointNames, number>
): MediaQueryIndex {
  const index = (["xs", "sm", "md", "lg", "xl"] as BreakPointNames[]).findIndex(
    (bp) => window.innerWidth < sizes[bp]
  );

  return index < 0 ? 5 : (index as MediaQueryIndex);
}

function evaluateRule(size: number, rule?: MediaQueryRule) {
  if (typeof rule === "number") {
    return size <= rule;
  }
  //
  else if (typeof rule === "string") {
    const index = ruleToIndexMap[rule];
    return rule.startsWith("e") ? size === index : size <= index;
  }
  //
  else if (typeof rule === "object") {
    const entries = Object.entries(rule) as [BreakPointNames, true][];

    const enabledKeys = entries.filter(([_, v]) => v);
    const hasOnlyOneEnabledKey = enabledKeys.length === 1;

    for (const [key] of enabledKeys) {
      if (size <= ruleToIndexMap[key]) {
        return hasOnlyOneEnabledKey ? true : ruleToIndexMap[key];
      }
    }

    return hasOnlyOneEnabledKey ? false : 5;
  }
}

function getResult<
  TRule extends MediaQueryRule,
  TResult = TRule extends TRuleBoolean ? boolean : MediaQueryIndex
>(sizes: Record<BreakPointNames, number>, rule?: TRule) {
  const size = getCurrentBreakPointIndex(sizes);
  const result = rule === undefined ? size : evaluateRule(size, rule);

  return result as TResult;
}

//
//
//
// --- Hook ---
export function useMediaQueryOnChange<
  TRule extends MediaQueryRule,
  TResult = TRule extends TRuleBoolean ? boolean : MediaQueryIndex
>(onChange: (result: TResult) => void, rule?: TRule) {
  const { sizes } = useMediaQueryContext();

  React.useEffect(() => {
    const handleResize = () => {
      onChange(getResult(sizes, rule));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
}

export default function useMediaQuery<
  TRule extends MediaQueryRule,
  TResult = TRule extends TRuleBoolean ? boolean : MediaQueryIndex
>(rule?: TRule): TResult {
  const { sizes } = useMediaQueryContext();
  const [state, setState] = React.useState<TResult>(getResult(sizes, rule));

  useMediaQueryOnChange(setState, rule);

  return state;
}
