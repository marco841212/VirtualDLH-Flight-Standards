export class PluginValidator {

  validate() {

    return {
      pluginLoaded: true,
      cockpitReady: true,
      scoringReady: true,
      reportsReady: true,
      timestamp:
        new Date().toISOString()
    };

  }

}