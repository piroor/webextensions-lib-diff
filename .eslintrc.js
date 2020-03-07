/*
 license: The MIT License, Copyright (c) 2020 YUKI "Piro" Hiroshi
*/

/*eslint-env commonjs*/
/*eslint quote-props: ['error', "always"] */

module.exports = {
  'root': true,

  'parserOptions': {
    'ecmaVersion': 2018,
  },

  'env': {
    'browser': true,
    'es6': true,
    'webextensions': true,
  },

  'rules': {
    'no-const-assign': 'error',
    'prefer-const': ['warn', {
      'destructuring': 'any',
      'ignoreReadBeforeAssign': false
    }],
    // stylisitc problem
    'indent': ['warn', 2, {
      'SwitchCase': 1,
      'MemberExpression': 1,
      'CallExpression': {
        'arguments': 'first',
      },
      'VariableDeclarator': {
        'var': 2,
        'let': 2,
        'const': 3,
      }
    }],
    'no-underscore-dangle': ['warn', { // Ban the name which starts with `_`.
      'allowAfterThis': true, // allow after this to create a private member.
    }],
    'quotes': ['warn', 'single', {
      'avoidEscape': true,
      'allowTemplateLiterals': true,
    }],

    'no-unused-expressions': 'error',
    'no-unused-labels': 'error',
    'no-undef': ['error', {
      'typeof': true,
    }],
    'no-unused-vars': ['warn', { // Not make an error for debugging.
      'vars': 'all',
      'args': 'after-used',
      'argsIgnorePattern': '^_',
      'caughtErrors': 'all',
      'caughtErrorsIgnorePattern': '^_', // Allow `catch (_e) {...}`
    }],
    'no-use-before-define': ['error', { // the measure for Temporary Dead Zone
      'functions': false, //  Function declarations are hoisted.
      'classes': true, // Class declarations are not hoisted. We should warn it.
    }],
  }
};
