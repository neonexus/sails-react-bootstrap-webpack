/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {
    // Default to "allow" if not defined below.
    '*': true,

    // ALl the functions found in /controllers/admin/*
    AdminController: {
        '*': ['isLoggedIn', 'isAdmin']
    },

    // The functions in /controllers/common/*
    CommonController: {
        '*': 'isLoggedIn', // Default require the user is authenticated
        'login': true, // Allow non-authenticated users access.
    }
};
