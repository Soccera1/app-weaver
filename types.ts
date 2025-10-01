export enum AppState {
  INITIAL,
  MOCKUP_GENERATING,
  MOCKUP_REFINING,
  MOCKUP_DISPLAYED,
  CODE_GENERATING,
  CODE_DISPLAYED,
}

export type GeneratedCode = Record<string, string>;

export type ImplementationFormat = 'html' | 'react';
