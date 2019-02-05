# feathers-validations

⚓️ A Feathers Hook to validate data based on model.

<a href="https://nodei.co/npm/feathers-validations/">
  <img src="https://nodei.co/npm/feathers-validations.png?downloads=true">
</a>

[![NPM version](https://badge.fury.io/js/feathers-validations.png)](http://badge.fury.io/js/feathers-validations)
[![Build Status](https://travis-ci.org/roganmelo/feathers-validations.svg?branch=master)](https://travis-ci.org/roganmelo/feathers-validations)![Code Coverage 100%](https://img.shields.io/badge/code%20coverage-100%25-green.svg?style=flat-square)[![ISC License](https://img.shields.io/badge/license-ISC-blue.svg?style=flat-square)](https://github.com/roganmelo/feathers-validations/blob/master/LICENSE)[![NodeJS](https://img.shields.io/badge/node-10.15.x-brightgreen.svg?style=flat-square)](https://github.com/roganmelo/fn-spy/blob/master/package.json#L50)

### API
`import validate from 'feathers-validations';`

`validate(model, 'Custom general error message.');`


### Usage

```js
  import validate from 'feathers-validations';
  import { required } from 'data-validations';

  const validations = { name: [required('Name is required.')] };

  export default {
    before: {
      create: [validate(validations)]
    }
  };

  // Error
  // {
  //   type: 'FeathersError',
  //   name: 'BadRequest',
  //   message: 'Validation error.',
  //   code: 400,
  //   className: 'bad-request',
  //   data: {},
  //   errors: {
  //     name: 'Name is required.'
  //   }
  // }
```
