const dateFormat = require('../../api/lib/dateFormat');
const assert = require('assert');

describe("Lib : dateFormat", () => {

  describe("Plain Text", () => {

    it("should transform ISO 8601 date to plain text date", () => {
      let newDate = "2020-07-21T09:43:59.489Z";

      assert.equal(dateFormat.plainText(newDate), "mardi 21 juillet 2020");
    })

    it("should not transform date to plain text date", () => {
      let newDate = "07/10/2020";

      assert.notEqual(dateFormat.plainText(newDate), "mercredi 07 octobre 2020");
    })

    it("should not transform text to plain text date", () => {
      let newDate = "Bonjour";

      assert.notEqual(dateFormat.plainText(newDate), "mercredi 07 octobre 2020");
    })

  })

});
