import validate from 'data-validations';
import { BadRequest } from '@feathersjs/errors';

const validateHook = (createModel, message = 'Validation error.') => context => {
  if(!createModel) return context;

  const modelTypes = ['object', 'function'];
  const methods = ['create', 'update', 'patch'];

  if(context.type !== 'before') throw new Error('This Hook can only be used on type before.');

  if(!methods.includes(context.method)) {
    throw new Error('This Hook can only be used on create, update or patch methods.');
  }

  if(!modelTypes.includes(typeof createModel)) {
    throw new Error('You have to provide a valid model. It can be an object or a function(context).');
  }

  const model = typeof createModel === 'function' ? createModel(context) : createModel;
  const { data } = context;
  const { error, errors } = validate(data, model);

  if(error) throw new BadRequest(message, { ...data, errors });

  return context;
};

export default validateHook;
