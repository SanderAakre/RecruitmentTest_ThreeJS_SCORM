// global.d.ts
interface Window {
  pipwerks: {
    SCORM: {
      init(): boolean;
      set(param: string, value: string): boolean;
      get(param: string): string;
      save(): boolean;
      quit(): boolean;
    };
  };
}

declare const pipwerks: {
  SCORM: {
    init(): boolean;
    set(param: string, value: string): boolean;
    get(param: string): string;
    save(): boolean;
    quit(): boolean;
  };
};
