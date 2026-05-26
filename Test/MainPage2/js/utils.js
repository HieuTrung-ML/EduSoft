/**
 * Utility Helper Functions
 */

// Shorthand for querySelector
export const $ = (selector, context = document) => context.querySelector(selector);

// Shorthand for querySelectorAll
export const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));
