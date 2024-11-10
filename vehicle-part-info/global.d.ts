// global.d.ts
interface Window {
  pipwerks: {
    SCORM: {
      init(): boolean;
      set(param: string, value: string): boolean;
      get(param: string): string;
      save(): boolean;
      quit(): boolean;
      connection: {
        isActive: boolean;
      };
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
    connection: {
      isActive: boolean;
    };
  };
};
