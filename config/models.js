/**
 * Default model settings
 * (sails.config.models)
 *
 * Your default, project-wide model settings. Can also be overridden on a
 * per-model basis by setting a top-level properties in the model definition.
 *
 * For details about all available model settings, see:
 * https://sailsjs.com/config/models
 *
 * For more general background on Sails model settings, and how to configure
 * them on a project-wide or per-model basis, see:
 * https://sailsjs.com/docs/concepts/models-and-orm/model-settings
 */

module.exports.models = {


    /***************************************************************************
     *                                                                          *
     * Whether model methods like `.create()` and `.update()` should ignore     *
     * (and refuse to persist) unrecognized data-- i.e. properties other than   *
     * those explicitly defined by attributes in the model definition.          *
     *                                                                          *
     * To ease future maintenance of your code base, it is usually a good idea  *
     * to set this to `true`.                                                   *
     *                                                                          *
     * > Note that `schema: false` is not supported by every database.          *
     * > For example, if you are using a SQL database, then relevant models     *
     * > are always effectively `schema: true`.  And if no `schema` setting is  *
     * > provided whatsoever, the behavior is left up to the database adapter.  *
     * >                                                                        *
     * > For more info, see:                                                    *
     * > https://sailsjs.com/docs/concepts/orm/model-settings#?schema           *
     *                                                                          *
     ***************************************************************************/

    schema: true,


    /***************************************************************************
     *                                                                          *
     * How and whether Sails will attempt to automatically rebuild the          *
     * tables/collections/etc. in your schema.                                  *
     *                                                                          *
     * > Note that, when running in a production environment, this will be      *
     * > automatically set to `migrate: 'safe'`, no matter what you configure   *
     * > here.  This is a failsafe to prevent Sails from accidentally running   *
     * > auto-migrations on your production database.                           *
     * >                                                                        *
     * > For more info, see:                                                    *
     * > https://sailsjs.com/docs/concepts/orm/model-settings#?migrate          *
     *                                                                          *
     ***************************************************************************/

    // migrate: 'alter',

    /***************************************************************************
     *                                                                          *
     * Base attributes that are included in all of your models by default.      *
     * By convention, this is your primary key attribute (`id`), as well as two *
     * other timestamp attributes for tracking when records were last created   *
     * or updated.                                                              *
     *                                                                          *
     * > For more info, see:                                                    *
     * > https://sailsjs.com/docs/concepts/orm/model-settings#?attributes       *
     *                                                                          *
     ***************************************************************************/

    attributes: {
        // id: {type: 'number', autoIncrement: true},
        // createdAt: {type: 'ref', columnType: 'datetime', autoCreatedAt: true},
        // updatedAt: {type: 'ref', columnType: 'datetime', autoUpdatedAt: true}
    },

    /********************************************************************************
     *                                                                              *
     * The set of DEKs (data encryption keys) for at-rest encryption.               *
     * i.e. when encrypting/decrypting data for attributes with `encrypt: true`.    *
     *                                                                              *
     * > The `default` DEK is used for all new encryptions, but multiple DEKs       *
     * > can be configured to allow for key rotation.  In production, be sure to    *
     * > manage these keys like you would any other sensitive credential.           *
     *                                                                              *
     * > For more info, see:                                                        *
     * > https://sailsjs.com/docs/concepts/orm/model-settings#?dataEncryptionKeys   *
     *                                                                              *
     * NOTE: These keys should NEVER be stored in Git-controlled files, such as     *
     * this one, for PRODUCTION servers! They are security credentials, and should  *
     * NEVER be shared, or stored in files!                                         *
     *                                                                              *
     ******************************************************************************/

    dataEncryptionKeys: {
        // Run this to generate a new key: `npm run generate:dek` OR `npm run setup`
        default: '{{DEK here}}' // NEVER STORE THIS FOR PRODUCTION PURPOSES!!!
    },

    /***************************************************************************
     *                                                                          *
     * Whether implicit records for associations should be cleaned up           *
     * automatically or not using the built-in polyfill.  This is especially    *
     * useful during development with sails-disk.                               *
     *                                                                          *
     * Depending on which databases you're using, you may want to disable this  *
     * polyfill in your production environment.                                 *
     *                                                                          *
     * (For production configuration, see `config/env/production.js`.)          *
     *                                                                          *
     ***************************************************************************/

    cascadeOnDestroy: true,


    /********************************************************************************
     *                                                                              *
     * This is a custom property, that is used inside of config/bootstrap.js.       *
     * If set to true AND sails.config.models.migrate === 'safe', then the          *
     * database schema validation and enforcement goes to work.                     *
     *                                                                              *
     * If the database is not configured according to the model specifications,     *
     * the problem areas will be console.error()'d, and Sails will fail to lift.    *
     *                                                                              *
     * This is intended for remote environments, to help prevent accidental         *
     * deployment of an incompatible version for the given datastore.               *
     *                                                                              *
     ********************************************************************************/

    validateOnBootstrap: true,

    /*********************************************************************************
     *                                                                               *
     * This is a secondary option for `validateOnBootstrap`.                         *
     * If both `validateOnBootstrap` and `enforceForeignKeyRelationships` are true,  *
     * then the connecting database will be required to have all the proper          *
     * foreign key relationships setup; otherwise the validation will fail.          *
     *                                                                               *
     * It can be useful to disable this when testing PRODUCTION setup on a           *
     * DEVELOPMENT-generated database.                                               *
     *                                                                               *
     * Likely only want to change this in local.js.                                  *
     *                                                                               *
     *********************************************************************************/

    enforceForeignKeys: true,

    /*********************************************************************************
     *                                                                               *
     * Disable Sails' built-in archive system by default. It tends to mess with      *
     * other things, like `sails-hook-autoreload`.                                   *
     *                                                                               *
     *********************************************************************************/

    archiveModelIdentity: false
};
