export const swaggerDocument = 
{
  "swagger": "2.0",
  "info": {
    "description": "This is a simple API which inserts, retrieves and updates info from and to a .JSON file.",
    "version": "1.0.0",
    "title": "Grades API",
    "license": {
      "name": "Apache 2.0",
      "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
    }
  },
  "host": "localhost:3000",
  "basePath": "/",
  "tags": [
    {
      "name": "grade",
      "description": "Everything about your grades"
    }
  ],
  "schemes": [
    "http"
  ],
  "paths": {
    "/grade": {
      "post": {
        "tags": [
          "grade"
        ],
        "summary": "Add a new grade to the grades.json",
        "description": "Add a new grade to the grades.json",
        "operationId": "addGrade",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "in": "body",
            "name": "body",
            "description": "Grade object that needs to be added to grades.json",
            "required": true,
            "schema": {
              "$ref": "#/definitions/Grade"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Grade added"
          },
          "400": {
            "description": "Invalid input"
          }
        }
      }
    }
  },
  // "securityDefinitions": {
  //   "petstore_auth": {
  //     "type": "oauth2",
  //     "authorizationUrl": "http://petstore.swagger.io/oauth/dialog",
  //     "flow": "implicit",
  //     "scopes": {
  //       "write:pets": "modify pets in your account",
  //       "read:pets": "read your pets"
  //     }
  //   },
  //   "api_key": {
  //     "type": "apiKey",
  //     "name": "api_key",
  //     "in": "header"
  //   }
  // },
  "definitions": {
    "Grade": {
      "type": "object",
      "required": [
        "name",
        "photoUrls"
      ],
      "properties": {
        // "id": {
        //   "type": "integer",
        //   "format": "int64"
        // },
        "student": {
          "type": "string"
        },
        "subject": {
          "type": "string"
        },
        "type": {
          "type": "string"
        },
        "value": {
          "type": "integer",
          "format": "decimal"
        }
        // ,
        // "timestamp": {
        //   "type": "string",
        //   "format": "timestamp"
        // }
      }
    }
  },
  "externalDocs": {
    "description": "Find out more about Swagger",
    "url": "http://swagger.io"
  }
};