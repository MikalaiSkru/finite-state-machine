class FSM {
  /**
   * Creates new FSM instance.
   * @param config
   */
  constructor(config) {
    this.config = config;
    this.state = config.initial;
    this.history = {
      main: [config.initial],
      redo: []
    }
  }

  /**
   * Returns active state.
   * @returns {String}
   */
  getState() {
    return this.state;
  }

  /**
   * Goes to specified state.
   * @param state
   */
  changeState(state) {
    if (!this.config.states.hasOwnProperty(state)) {
      throw new Error;
    }
      this.state = state;
      this.history.main.push(this.state);
      this.history.redo.length = 0;
  }

  /**
   * Changes state according to event transition rules.
   * @param event
   */
  trigger(event) {
    if (!this.config.states[this.state].transitions.hasOwnProperty(event)) {
      throw new Error;
    }
    this.state = this.config.states[this.state].transitions[event];
    this.history.main.push(this.state);
    this.history.redo.length = 0;
  }

  /**
   * Resets FSM state to initial.
   */
  reset() {
    this.state = this.config.initial;
  }

  /**
   * Returns an array of states for which there are specified event transition rules.
   * Returns all states if argument is undefined.
   * @param event
   * @returns {Array}
   */
  getStates(event) {
    const keys = Object.keys(this.config.states);
    return event === undefined
      ? keys
      : keys.filter(state => this.config.states[state].transitions.hasOwnProperty(event));
  }

  /**
   * Goes back to previous state.
   * Returns false if undo is not available.
   * @returns {Boolean}
   */
  undo() {
    if (this.history.main.length > 1) {
      this.history.redo.push(this.history.main.pop());
      this.state = this.history.main[this.history.main.length - 1];
      return true;
    }

    return false;
  }

  /**
   * Goes redo to state.
   * Returns false if redo is not available.
   * @returns {Boolean}
   */
  redo() {
    let lastTrashedState;

    if (this.history.redo.length > 0) {
      lastTrashedState  = this.history.redo.pop();
      this.history.main.push(lastTrashedState);
      this.state = lastTrashedState;
      return true;
    }

    return false;
  }

  /**
   * Clears transition history
   */
  clearHistory() {
    this.history.main.length = 0;
    this.history.redo.length = 0;
  }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
