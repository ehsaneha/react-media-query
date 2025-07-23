import React from "react";
import { render, act } from "@testing-library/react";
import useMediaQuery, { MediaQueryProvider } from "./index";

// Helper component to test hook output
const TestComponent = ({ rule, onChange }: any) => {
  const result = useMediaQuery(rule);

  React.useEffect(() => {
    onChange?.(result);
  }, [result]);

  return <div data-testid="output">{JSON.stringify(result)}</div>;
};

// Mock window.innerWidth
const resizeWindow = (width: number) => {
  // @ts-ignore
  window.innerWidth = width;
  window.dispatchEvent(new Event("resize"));
};

describe("useMediaQuery", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("returns correct MediaQueryIndex with no rule", () => {
    const onChange = jest.fn();
    resizeWindow(800); // should fall in 'md' range (index 2)

    render(
      <MediaQueryProvider>
        <TestComponent onChange={onChange} />
      </MediaQueryProvider>
    );

    act(() => {
      jest.advanceTimersByTime(1100);
    });

    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("returns boolean result with rule string", () => {
    const onChange = jest.fn();
    resizeWindow(500); // 'xs' range

    render(
      <MediaQueryProvider>
        <TestComponent onChange={onChange} rule="sm" />
      </MediaQueryProvider>
    );

    act(() => {
      jest.advanceTimersByTime(1100);
    });

    expect(onChange).toHaveBeenCalledWith(true); // 0 <= sm (index 1)
  });

  it("returns boolean with exact match rule", () => {
    const onChange = jest.fn();
    resizeWindow(500); // index 0

    render(
      <MediaQueryProvider>
        <TestComponent onChange={onChange} rule="exs" />
      </MediaQueryProvider>
    );

    act(() => {
      jest.advanceTimersByTime(1100);
    });

    expect(onChange).toHaveBeenCalledWith(true); // exs => index must equal 0
  });

  it("evaluates object rule correctly", () => {
    const onChange = jest.fn();
    resizeWindow(800); // index 2

    render(
      <MediaQueryProvider>
        <TestComponent
          onChange={onChange}
          rule={{ xs: true, md: true, xl: true }}
        />
      </MediaQueryProvider>
    );

    act(() => {
      jest.advanceTimersByTime(1100);
    });

    expect(onChange).toHaveBeenCalledWith(2); // closest matching index in rule object
  });

  it("updates value on resize", () => {
    const onChange = jest.fn();
    resizeWindow(1100); // lg

    render(
      <MediaQueryProvider>
        <TestComponent onChange={onChange} />
      </MediaQueryProvider>
    );

    act(() => {
      jest.advanceTimersByTime(1100);
    });

    expect(onChange).toHaveBeenCalledWith(3);

    act(() => {
      resizeWindow(700); // sm
      jest.advanceTimersByTime(1100);
    });

    expect(onChange).toHaveBeenCalledWith(1);
  });
});
