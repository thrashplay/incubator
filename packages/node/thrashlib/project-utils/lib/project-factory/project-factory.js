"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProjectFactory = void 0;

var _lodash = require("lodash");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ProjectFactory {
  constructor(suppportedProjectStructures) {
    this.suppportedProjectStructures = suppportedProjectStructures;

    _defineProperty(this, "createProject", async initialDirectory => {
      for (let structure of this.suppportedProjectStructures) {
        const project = await structure.createProject(initialDirectory);

        if (!(0, _lodash.isNil)(project)) {
          return project;
        }
      }

      const knownStructures = (0, _lodash.join)((0, _lodash.map)(this.suppportedProjectStructures, structure => structure.name), ', ');
      throw new Error(`Unable to determine project structure from among known types: [${knownStructures}]`);
    });

    if ((0, _lodash.isEmpty)(this.suppportedProjectStructures)) {
      throw new Error('Cannot create ProjectFactory without any project structures.');
    }
  }

}

exports.ProjectFactory = ProjectFactory;