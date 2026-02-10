import { E as EventClient } from "./devtools-event-client.mjs";
import { a as Store } from "./store.mjs";
function isFunction(value) {
  return typeof value === "function";
}
function parseFunctionOrValue(value, ...args) {
  return isFunction(value) ? value(...args) : value;
}
var PacerEventClient = class extends EventClient {
  constructor(props) {
    super({
      pluginId: "pacer",
      debug: props?.debug
    });
  }
};
const emitChange = (event, payload) => {
  if (payload.key) pacerEventClient.emit(event, payload);
};
const pacerEventClient = new PacerEventClient();
function getDefaultDebouncerState() {
  return {
    canLeadingExecute: true,
    executionCount: 0,
    isPending: false,
    lastArgs: void 0,
    status: "idle",
    maybeExecuteCount: 0
  };
}
const defaultOptions = {
  enabled: true,
  leading: false,
  trailing: true,
  wait: 0
};
var Debouncer = class {
  #timeoutId;
  constructor(fn, initialOptions) {
    this.fn = fn;
    this.store = new Store(getDefaultDebouncerState());
    this.setOptions = (newOptions) => {
      this.options = {
        ...this.options,
        ...newOptions
      };
      if (!this.#getEnabled()) this.cancel();
    };
    this.maybeExecute = (...args) => {
      if (!this.#getEnabled()) return void 0;
      this.#setState({ maybeExecuteCount: this.store.state.maybeExecuteCount + 1 });
      let _didLeadingExecute = false;
      if (this.options.leading && this.store.state.canLeadingExecute) {
        this.#setState({ canLeadingExecute: false });
        _didLeadingExecute = true;
        this.#execute(...args);
      }
      if (this.options.trailing) this.#setState({
        isPending: true,
        lastArgs: args
      });
      if (this.#timeoutId) clearTimeout(this.#timeoutId);
      this.#timeoutId = setTimeout(() => {
        this.#setState({ canLeadingExecute: true });
        if (this.options.trailing && !_didLeadingExecute) this.#execute(...args);
      }, this.#getWait());
    };
    this.flush = () => {
      if (this.store.state.isPending && this.store.state.lastArgs) {
        this.#clearTimeout();
        this.#execute(...this.store.state.lastArgs);
      }
    };
    this.cancel = () => {
      this.#clearTimeout();
      this.#setState({
        canLeadingExecute: true,
        isPending: false
      });
    };
    this.reset = () => {
      this.#setState(getDefaultDebouncerState());
    };
    this.key = initialOptions.key;
    this.options = {
      ...defaultOptions,
      ...initialOptions
    };
    this.#setState(this.options.initialState ?? {});
    if (this.key) pacerEventClient.on("d-Debouncer", (event) => {
      if (event.payload.key !== this.key) return;
      this.#setState(event.payload.store.state);
      this.setOptions(event.payload.options);
    });
  }
  #setState = (newState) => {
    this.store.setState((state) => {
      const combinedState = {
        ...state,
        ...newState
      };
      const { isPending } = combinedState;
      return {
        ...combinedState,
        status: !this.#getEnabled() ? "disabled" : isPending ? "pending" : "idle"
      };
    });
    emitChange("Debouncer", this);
  };
  /**
  * Returns the current enabled state of the debouncer
  */
  #getEnabled = () => {
    return !!parseFunctionOrValue(this.options.enabled, this);
  };
  /**
  * Returns the current wait time in milliseconds
  */
  #getWait = () => {
    return parseFunctionOrValue(this.options.wait, this);
  };
  #execute = (...args) => {
    if (!this.#getEnabled()) return void 0;
    this.fn(...args);
    this.#setState({
      executionCount: this.store.state.executionCount + 1,
      isPending: false,
      lastArgs: void 0
    });
    this.options.onExecute?.(args, this);
  };
  #clearTimeout = () => {
    if (this.#timeoutId) {
      clearTimeout(this.#timeoutId);
      this.#timeoutId = void 0;
    }
  };
};
export {
  Debouncer as D
};
