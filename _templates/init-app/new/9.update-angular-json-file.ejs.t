---
to: <%=name%>angular.json
---
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "<%=name%>": {
      "root": "",
      "sourceRoot": "src",
      "projectType": "application",
      "prefix": "",
      "schematics": {
        "@schematics/angular:component": {
          "style": "scss"
        }
      },
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "aot": true,
            "outputPath": "dist",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": "src/polyfills.ts",
            "tsConfig": "src/tsconfig.app.json",
            "assets": [
              "src/favicon.ico",
              "src/version.json",
              "src/appsettings.json",
              "src/logo.png"
              "src/assets"
            ],
            "styles": [
              "node_modules/devextreme/dist/css/dx.common.css",
              "src/styles.scss"

            ],
            "scripts": [],
            "es5BrowserSupport": true
          },
          "configurations": {
            "production": {
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.prod.ts"
                }
              ],
              "optimization": true,
              "outputHashing": "all",
              "sourceMap": false,
              "extractCss": true,
              "namedChunks": true,
              "aot": true,
              "resourcesOutputPath": "./assets",
              "extractLicenses": true,
              "vendorChunk": true,
              "buildOptimizer": true
            }
          }
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "options": {
            "browserTarget": "<%=name%>:build"
          },
          "configurations": {
            "production": {
              "browserTarget": "<%=name%>:build:production"
            }
          }
        },
        "extract-i18n": {
          "builder": "@angular-devkit/build-angular:extract-i18n",
          "options": {
            "browserTarget": "<%=name%>:build"
          }
        },
        "test": {
          "builder": "@angular-devkit/build-angular:karma",
          "options": {
            "main": "src/test.ts",
            "polyfills": "src/polyfills.ts",
            "tsConfig": "src/tsconfig.spec.json",
            "karmaConfig": "src/karma.conf.js",
            "styles": [
              "src/styles.scss"
            ],
            "scripts": [],
            "assets": [
              "src/favicon.ico",
              "src/assets"
            ]
          }
        },
        "lint": {
          "builder": "@angular-devkit/build-angular:tslint",
          "options": {
            "tsConfig": [
              "src/tsconfig.app.json",
              "src/tsconfig.spec.json",
              "e2e/tsconfig.json"
            ],
            "exclude": [
              "**/node_modules/**"
            ]
          }
        }
      }
    },
    "<%=name%>-e2e": {
      "root": "e2e/",
      "projectType": "application",
      "prefix": "",
      "architect": {
        "e2e": {
          "builder": "@angular-devkit/build-angular:protractor",
          "options": {
            "protractorConfig": "e2e/protractor.conf.js",
            "devServerTarget": "<%=name%>:serve"
          },
          "configurations": {
            "production": {
              "devServerTarget": "<%=name%>:serve:production"
            }
          }
        },
        "lint": {
          "builder": "@angular-devkit/build-angular:tslint",
          "options": {
            "tsConfig": "e2e/tsconfig.e2e.json",
            "exclude": [
              "**/node_modules/**"
            ]
          }
        }
      }
    }
  },
  "defaultProject": "<%=name%>",
  "cli": {
    "defaultCollection": "@ngrx/schematics"
  },
  "schematics": {
    "@nrwl/schematics:component": {
      "styleext": "scss"
    },
    "@schematics/angular:component": {
      "styleext": "scss"
    }
  }
}