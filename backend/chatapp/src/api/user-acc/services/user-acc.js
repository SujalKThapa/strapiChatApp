'use strict';

/**
 * user-acc service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::user-acc.user-acc');
