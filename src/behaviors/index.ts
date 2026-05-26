/**
 * Behaviors.
 * @module behaviors
 */

// Type imports
import type { Express } from 'express';

/**
 * A behavior registry.
 * @class Behaviors
 */
class Behaviors {
  public behaviors: any;
  static instance: Behaviors;

  /**
   * Construct a Behavior.
   * @constructs Behaviors
   */
  constructor() {
    this.behaviors = {};

    if (!Behaviors.instance) {
      Behaviors.instance = this;
    }

    return Behaviors.instance;
  }

  /**
   * Register a behavior.
   * @param {string} name The name of the behavior to register.
   * @param {any} behavior The behavior to register.
   */
  register(name: string, behavior: any): void {
    this.behaviors[name] = behavior;
  }
}

// Create an instance of the Behavior registry
const behaviors = new Behaviors();

// Export the instance and all behaviors
export default behaviors;
