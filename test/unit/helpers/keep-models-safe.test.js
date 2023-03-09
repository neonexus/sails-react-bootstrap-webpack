const moment = require('moment-timezone');

describe('keepModelsSafe Helper', function() {
    let rightNow, rightNowMoment, formattedNow;

    before(function() {
        rightNow = new Date();
        rightNowMoment = moment(rightNow);
        formattedNow = rightNowMoment.clone().tz(sails.config.http.dateOutput.tz).format(sails.config.http.dateOutput.format);
    });

    it('should use Moment.js to format JS date objects', async function() {
        const testData = {
            letsAddIn: {
                aFewLevels: {
                    toTestRecursion: rightNow
                }
            }
        };

        const testOut = sails.helpers.keepModelsSafe(testData);

        testOut.letsAddIn.aFewLevels.toTestRecursion.should.eq(formattedNow);
    });

    it('should call .format() if the given object is a Moment.js object', async function() {
        const testData = {
            letsAddIn: {
                aFewLevels: {
                    toTestRecursion: rightNowMoment
                }
            }
        };

        const testOut = sails.helpers.keepModelsSafe(testData);

        testOut.letsAddIn.aFewLevels.toTestRecursion.should.eq(formattedNow);
    });

    it('should call .customToJSON() on models, to help keep them safe in the wild', async function() {
        // First, get our user
        const foundUser = await sails.models.user.findOne(testUtils.fixtures.user[0].id);

        should.exist(foundUser.password);
        should.exist(foundUser.verificationKey);

        // Next, run it through the helper, and make it these sensitive data-points aren't exposed.
        const scrubbedUser = sails.helpers.keepModelsSafe(foundUser);

        should.not.exist(scrubbedUser.password);
        should.not.exist(scrubbedUser.verificationKey);
    });
});
