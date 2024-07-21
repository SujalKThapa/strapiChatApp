'use strict';

/**
 * message-list service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::message-list.message-list');
