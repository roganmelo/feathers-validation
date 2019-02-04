import { BadRequest } from '@feathersjs/errors';
import getByDot from 'get-by-dot';
import setByDot from 'set-by-dot';
import objectDotKeys from 'object-dot-keys';

const validate = (createModel, message = 'Validation error.') => context => {
  if(!createModel) return context;

  const validTypes = ['object', 'function'];
  const validMethods = ['create', 'update', 'patch'];

  if(context.type !== 'before') throw new Error('This Hook can only be used on type before.');

  if(!validMethods.includes(context.method)) {
    throw new Error('This Hook can only be used on create, update or patch methods.');
  }

  if(!validTypes.includes(typeof createModel)) {
    throw new Error('You have to provide a valid model. It can be an object or a function(context).');
  }

  const model = typeof createModel === 'function' ? createModel(context) : createModel;
  const dotKeys = objectDotKeys(model, { array: false });
  const { data } = context;
  const defaultResult = { hasError: false, errors: {} };
  const result = dotKeys.reduce((prev, key) => {
    const validators = getByDot(model, key);
    const value = getByDot(data, key);
    const validatorsResult = validators
      .map(validator => validator(value))
      .filter(error => error);
    const hasMoreThanOneError = validatorsResult.length > 1;
    const hasErrorOnField = hasMoreThanOneError || validatorsResult.length > 0;
    const hasError = hasErrorOnField || prev.hasError;
    const fieldErrors = hasMoreThanOneError ? validatorsResult : validatorsResult[0];
    const errors = hasErrorOnField
      ? setByDot(prev.errors, key, fieldErrors)
      : prev.errors;

    return { hasError, errors };
  }, defaultResult);

  if(result.hasError) throw new BadRequest(message, { errors: result.errors });

  return context;
};

export default validate;
