/**
 * Models.
 * @module models
 */

type Handler = () => any;

/**
 * A model registry.
 * @class Models
 */
class Models {
  public models: { [key: string]: Handler };
  static instance: Models;

  /**
   * Construct a Models.
   * @constructs Models
   */
  constructor() {
    this.models = {};

    if (!Models.instance) {
      Models.instance = this;
    }

    return Models.instance;
  }

  /**
   * Register a model.
   * @param {string} name The name of the model.
   * @param {Handler} model The model to register.
   */
  register(name: string, model: Handler) {
    this.models[name] = model;
  }

  /**
   * Get a model.
   * @param {string} name The name of the model.
   * @returns {ModelClass} The model.
   */
  get(name: string): any {
    return this.models[name]();
  }
}

// Create an instance of the Models registry and register all models
const models = new Models();

// Export the instance and all models
export default models;
