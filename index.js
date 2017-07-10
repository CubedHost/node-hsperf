const fs = require('fs');
const parser = require('./lib/parser');

module.exports = {
  parse: parser,
  Prologue: require('./lib/prologue'),
  Entry: require('./lib/entry')
};
