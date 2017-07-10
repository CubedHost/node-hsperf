const Prologue = require('./prologue');
const Entry = require('./entry');

module.exports = function parsePerfData(data) {
  const prologue = Prologue.from(data);
  const entries = Entry.from(data, prologue);

  return { prologue, entries };
};
