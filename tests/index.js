import { BadRequest } from '@feathersjs/errors';
import { required, max, min } from 'data-validations';
import hook from '../dist';

const createContext = overrides => ({
  type: 'before',
  method: 'create',
  data: {
    name: 'Rogan',
    age: 24,
    birth: '1994-03-02T21:59:39.884Z'
  },
  ...overrides
});
const validationError = (errors, data, message) => new BadRequest({
  type: 'FeathersError',
  name: 'BadRequest',
  message: message || 'Validation error.',
  code: 400,
  className: 'bad-request',
  data,
  errors
});

describe('feathers-validation hook', () => {
  it('should return the context if model is undefined.', () => {
    const context = createContext();
    expect(hook()(context)).toEqual(context);
  });

  it('should throw error if use on after type.', () => {
    const contextWithTypeAfter = createContext({ type: 'after' });
    const error = new Error('This Hook can only be used on type before.');

    expect(() => hook({})(contextWithTypeAfter)).toThrowError(error);
  });

  it('should throw error if use on invalid method.', () => {
    const error = new Error('This Hook can only be used on create, update or patch methods.');
    const contextWithMethodFind = createContext({ method: 'find' });
    const contextWithMethodGet = createContext({ method: 'get' });
    const contextWithMethodRemove = createContext({ method: 'remove' });

    expect(() => hook({})(contextWithMethodFind)).toThrowError(error);
    expect(() => hook({})(contextWithMethodGet)).toThrowError(error);
    expect(() => hook({})(contextWithMethodRemove)).toThrowError(error);
  });

  it('should throw error if pass invalid model.', () => {
    const context = createContext();
    const error = new Error('You have to provide a valid model. It can be an object or a function(context).');

    expect(() => hook(1)(context)).toThrowError(error);
    expect(() => hook('obj')(context)).toThrowError(error);
    expect(() => hook(true)(context)).toThrowError(error);
  });

  it('should return context when validation is ok.', () => {
    const context = createContext();
    const nameValidationMessage = 'Name is required.';
    const model = { name: [required(nameValidationMessage)] };

    expect(hook(model)(context)).toEqual(context);
  });

  it('should throw bad request error when validation is fail.', () => {
    const data = { age: 24 };
    const context = createContext({ data });
    const nameValidationMessage = 'Name is required.';
    const model = { name: [required(nameValidationMessage)] };
    const error = validationError({ name: nameValidationMessage }, data);

    expect(() => hook(model)(context)).toThrowError(error);
  });

  it('should throw bad request error when validation is fail with custom message.', () => {
    const data = { age: 24 };
    const context = createContext({ data });
    const customMessage = 'Custom message.';
    const nameValidationMessage = 'Name is required.';
    const model = { name: [required(nameValidationMessage)] };
    const error = validationError({ name: nameValidationMessage }, data, customMessage);

    expect(() => hook(model, customMessage)(context)).toThrowError(error);
  });

  it('should throw bad request error when validation is fail in more than one field.', () => {
    const data = { birth: '1994-03-02T21:59:39.884Z' };
    const context = createContext({ data });
    const nameValidationMessage = 'Name is required.';
    const ageValidationMessage = 'Age is required.';
    const model = {
      name: [required(nameValidationMessage)],
      age: [required(ageValidationMessage)]
    };
    const error = validationError({
      name: nameValidationMessage,
      age: ageValidationMessage
    }, data);

    expect(() => hook(model)(context)).toThrowError(error);
  });

  it('should throw bad request error when validation is fail more than one time on one field.', () => {
    const data = { name: 'Rogan' };
    const context = createContext({ data });
    const nameMaxValidationMessage = 'Name must be at most 4.';
    const nameMinValidationMessage = 'Name must be at least 6.';
    const model = {
      name: [max(4, nameMaxValidationMessage), min(6, nameMinValidationMessage)]
    };
    const error = validationError({
      name: [nameMaxValidationMessage, nameMinValidationMessage]
    }, data);

    expect(() => hook(model)(context)).toThrowError(error);
  });
});
