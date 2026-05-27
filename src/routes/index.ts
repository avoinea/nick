/**
 * Routes.
 * @module routes
 */

/**
 * A route registry.
 * @class Routes
 */
class Routes {
  public routes: any[];
  static instance: Routes;

  /**
   * Construct a Routes.
   * @constructs Routes
   */
  constructor() {
    this.routes = [];

    if (!Routes.instance) {
      Routes.instance = this;
    }

    return Routes.instance;
  }

  /**
   * Register routes.
   * @param {Route[]} routes The routes to register.
   */
  register(routes: any[]) {
    this.routes = [...routes, ...this.routes];
  }
}

// Create an instance of the Routes registry
const routes = new Routes();

// Export the instance and all routes
export default routes;
