// ISO 8601 date to plain text date
exports.plainText = function plainText(date) {
  let newDate = new Date(date);
  let options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };

  return newDate.toLocaleDateString("fr-FR", options);
}
