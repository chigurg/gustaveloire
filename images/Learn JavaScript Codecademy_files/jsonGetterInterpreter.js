/* eslint-disable */
(() => {
  class Logger {
    constructor(logSource, infoEnabled) {
      this.logSource = logSource;
      this.infoEnabled = infoEnabled;
    }

    log(msg) {
      if (!this.infoEnabled) {
        return;
      }
      this.logMessage(console.log, 'INFO', typeof msg === 'object' ? JSON.stringify(msg) : msg);
    }

    warn(err) {
      let errMsg = err;

      if (typeof err === 'object' && (err.stack || err.message)) {
        errMsg = 'Error occured with message ' + err.message + ' and stack ' + err.stack;
      }

      this.logMessage(console.warn, 'ERROR', errMsg);
    }

    error(err) {
      let errMsg = err;

      if (typeof err === 'object' && (err.stack || err.message)) {
        errMsg = 'Error occured with message ' + err.message + ' and stack ' + err.stack;
      }

      this.logMessage(console.error, 'ERROR', errMsg);
    }

    logMessage(method, logLevel, message) {
      method(new Date().toISOString() + ' | ' + logLevel + ' | ' + this.logSource + ' | ' + message);
    }
  }

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis
  const checkIsGlobal = it => {
    return it && it.Math === Math && it;
  };

  const getGlobalObject = () => {
    if (typeof globalThis !== undefined) {
      return globalThis;
    }

    try {
      return (
        checkIsGlobal(typeof window === 'object' && window) ||
        checkIsGlobal(typeof self === 'object' && self) ||
        checkIsGlobal(typeof global === 'object' && global) ||
        (function () {
          return this;
        })() ||
        Function('return this')()
      );
    } catch {
      return window;
    }
  };

  const global = getGlobalObject();

  const logger = new Logger('estree-execuror', false);

  const MAX_LOOP_ITERATIONS = 1000;

  const DEFAULT_RETURN_VALUE = false;
  const RETURN_VALUE_KEY = '___retVal';
  const FORCE_RETURN_KEY = '___forceReturn';
  const CHAIN_CONTEXT_KEY = '___chainContext';
  const CHAIN_CONTEXT_DEFAULT_RETURN_VALUE = undefined;
  const THIS_KEY = '___this';
  const EXCEPTION_KEY = '___exception';
  const MEMBER_DONT_ASSIGN = '___memberDontAssign';

  const MANDATORY_THIS_WINDOW = ['setTimeout'];

  const ALLOWED_STANDARD_TYPES = [
    'Number',
    'BigInt',
    'Math',
    'Date',
    'RegExp',
    'Array',
    'Int8Array',
    'Uint8Array',
    'Uint8ClampedArray',
    'Int16Array',
    'Uint16Array',
    'Int32Array',
    'Uint32Array',
    'Float32Array',
    'Float64Array',
    'BigInt64Array',
    'BigUint64Array',
    'String',
    'Error',
    'Object',
    'Function',
    'Boolean',
    'Symbol',
    'Infinity',
    'ArrayBuffer',
    'Window',
    'JSON',
    'Promise',
    'NaN',
    'globalThis',
    'undefined',
  ];

  const ALLOWED_STANDARD_FUNCTIONS = [
    ...MANDATORY_THIS_WINDOW,
    'getComputedStyle',
    'clearTimeout',
    'parseFloat',
    'parseInt',
    'isFinite',
    'isNaN',
    'parseInt',
    'encodeURI',
    'encodeURIComponent',
    'decodeURI',
    'decodeURIComponent',
  ];

  const ALLOWED_GLOBALS = [
    'jQuery',
    '$',
    'dataLayerV2Json',
    '__BODY_MODEL__',
    'ysApp',
    'Inditex',
    'inditex',
    'FL',
    '$d',
    '$sarg',
    'document',
    'window',
    'location',
    'console',
    'scroll',
    'scrollX',
    'scrollY',
    ...ALLOWED_STANDARD_TYPES,
    ...ALLOWED_STANDARD_FUNCTIONS,
  ];

  const NodeType = {
    IF: 'if',
    BLOCK: 'bl',
    EMPTY: 'em',
    MEMBER: 'mm',
    LOGICAL: 'lg',
    BINARY: 'bn',
    CALL: 'ce',
    ARRAY: 'ar',
    UNARY: 'un',
    UPDATE: 'up',
    ASSIGNMENT: 'as',
    CHAIN: 'ch',
    TERNARY: 'co',
    VAR: 'vr',
    VARDEC: 'vd',
    LITERAL: 'li',
    IDENTIFIER: 'id',
    EXPRESSION: 'ex',
    RETURN: 'rt',
    FUNCTION: 'fu',
    FUNCTIONDEC: 'FunctionDeclaration',
    NEW: 'nw',
    FOR: 'fr',
    THIS: 'th',
    ARROW: 'aw',
    TRY: 'TryStatement',
    CATCH: 'CatchClause',
    OBJECT: 'ObjectExpression',
    PROPERTY: 'Property',
    SPREAD: 'SpreadElement',
  };

  const assignValueToExpression = (leftIdentifier, right, context) => {
    if (leftIdentifier.tp === NodeType.IDENTIFIER) {
      const leftName = leftIdentifier.nm;

      let strValue = 'unparsable';
      try {
        strValue = JSON.stringify(right);
      } catch (err) {
        logger.log('Error parsing value for logging for variable ' + leftName + '! ' + err.stack);
      }

      if (isMemberExists(context, leftName)) {
        logger.log(
          'Assigning value to existing variable in the context. Varname = ' +
            leftName +
            '. Current value = ' +
            context[leftName] +
            '. New value = ' +
            strValue,
        );
        context[leftName] = right;
      } else if (isMemberExists(global, leftName)) {
        logger.log('Assigning global variable is not allowed! Variable name - ' + leftName + '. Value - ' + strValue);
        logger.log('Creating variable ' + leftName + ' within context. Value - ' + strValue);
        context[leftName] = right;
      } else {
        logger.log('Creating variable ' + leftName + ' within context. Value - ' + strValue);
        context[leftName] = right;
      }
    } else if (leftIdentifier.tp === NodeType.MEMBER) {
      processMemberExpression(leftIdentifier, context, right);
    }
  };

  const processChainExpression = (expression, context) => {
    const internalExpression = expression.ex;
    context[CHAIN_CONTEXT_KEY] = true;
    const internalResult = processNode(internalExpression, context);
    delete context[CHAIN_CONTEXT_KEY];
    return internalResult;
  };

  const processUpdateExpression = (expression, context) => {
    const argument = expression.ag;

    if (argument.tp !== NodeType.IDENTIFIER) {
      throw new Error('Argument of update expression must be Identifier! Exp - ' + JSON.stringify(expression));
    }

    const argName = argument.nm;

    if (context[argName] === undefined && global[argName] === undefined) {
      throw new Error(
        'Argument of update expression is ' +
          ' undefined both in window and expression context! Exp - ' +
          JSON.stringify(expression),
      );
    }

    const operator = expression.op;
    if (!operator) {
      throw new Error('Undefined operator for update expression - ' + JSON.stringify(expression));
    }

    switch (operator) {
      case '++':
        if (isMemberExists(context, argName)) {
          context[argName]++;
          return context[argName];
        } else if (isMemberExists(global, argName)) {
          global[argName]++;
          return global[argName];
        } else {
          throw new Error('We did not do anything in update exprssion! Plz check. Exp - ' + JSON.stringify(expression));
        }
      case '--':
        if (isMemberExists(context, argName)) {
          context[argName]--;
          return context[argName];
        } else if (isMemberExists(global, argName)) {
          global[argName]--;
          return global[argName];
        } else {
          throw new Error('We did not do anything in update exprssion! Plz check. Exp - ' + JSON.stringify(expression));
        }
      default:
        throw new Error('Unsupported operator in update expression! Exp - ' + JSON.stringify(expression));
    }
  };

  const processUnaryExpression = (expression, context) => {
    const argument = expression.ag;
    const argValue = processNode(argument, context); // resolve value

    const operator = expression.op;
    if (!operator) {
      throw new Error('Undefined operator for unary expression - ' + JSON.stringify(expression));
    }

    switch (operator) {
      case '+':
        return +argValue;
      case '-':
        return -argValue;
      case '!':
        return !argValue;
      case '~':
        return ~argValue;
      case 'typeof':
        if (argument.tp === NodeType.IDENTIFIER) {
          return typeof resolveIdentifierMaybeUndefined(argument, context);
        }
        return typeof argValue;
      case 'delete':
        if (global[argument.nm] !== undefined) {
          throw new Error(
            'Removing elements from window is not supported! Attempted to remove var by name - ' +
              argument.nm +
              '. Expression - ' +
              expression,
          );
        } else if (isMemberExists(context, argument.nm)) {
          logger.log('Removing var ' + argument.nm + ' from context within unary expression.');
          delete context[argument.nm];
        }
        return null;
      default:
        throw new Error('Unsupported operator in unary expression! Exp - ' + JSON.stringify(expression));
    }
  };

  const processAssignmentExpression = (expression, context) => {
    const value = processNode(expression.ri, context);

    const operator = expression.op;
    if (!operator) {
      throw new Error('Undefined operator for assignment expression - ' + JSON.stringify(expression));
    }

    const leftExpression = expression.lt;
    if (leftExpression.tp !== NodeType.IDENTIFIER && leftExpression.tp !== NodeType.MEMBER) {
      throw new Error(
        'Assignment expression only supports identifier on left side! Exp - ' + JSON.stringify(expression),
      );
    }

    switch (operator) {
      case '=':
        assignValueToExpression(leftExpression, value, context);
        return value;
      default:
        throw new Error('Only = operator supported for assignment expression! Exp - ' + JSON.stringify(expression));
    }
  };

  const processLogicalOrBinaryExpression = (expression, context) => {
    const { lt: left, ri: right } = expression;

    const operator = expression.op;

    if (!operator) {
      throw new Error('Undefined operator in expression ' + JSON.stringify(expression));
    }

    // don't put processNode before expression,
    // because it executes statement
    // but for && operator, for example, we should not
    // execute right if left is false
    switch (operator) {
      case '&&':
        return processNode(left, context) && processNode(right, context);
      case '||':
        return processNode(left, context) || processNode(right, context);
      case '??':
        return processNode(left, context) ?? processNode(right, context);
      case '==':
        return processNode(left, context) == processNode(right, context);
      case '!=':
        return processNode(left, context) != processNode(right, context);
      case '===':
        return processNode(left, context) === processNode(right, context);
      case '!==':
        return processNode(left, context) !== processNode(right, context);
      case '&':
        return processNode(left, context) & processNode(right, context);
      case '|':
        return processNode(left, context) | processNode(right, context);
      case '>':
        return processNode(left, context) > processNode(right, context);
      case '>=':
        return processNode(left, context) >= processNode(right, context);
      case '<':
        return processNode(left, context) < processNode(right, context);
      case '<=':
        return processNode(left, context) <= processNode(right, context);
      case '>>':
        return processNode(left, context) >> processNode(right, context);
      case '<<':
        return processNode(left, context) << processNode(right, context);
      case '-':
        return processNode(left, context) - processNode(right, context);
      case '+':
        return processNode(left, context) + processNode(right, context);
      case '*':
        return processNode(left, context) * processNode(right, context);
      case '/':
        return processNode(left, context) / processNode(right, context);
      default:
        throw new Error(
          'Unsupported operator ' + operator + ' for binary or logical expression - ' + JSON.stringify(expression),
        );
    }
  };

  const isMemberExists = (obj, name) => {
    return !!obj && (obj[name] || Object.keys(obj).indexOf(name) !== -1);
  };

  const resolveIdentifierMaybeUndefined = (expression, context) => {
    const _name = expression.nm;
    const name = ['$', 'jQuery', '$d'].indexOf(_name) !== -1 ? '$d' : _name;

    logger.log('Resolving identifier that might be undefined');
    if (isMemberExists(context, name)) {
      logger.log('Identifier ' + name + ' was resolved from expression context');
      return context[name];
    } else if (isMemberExists(global, name)) {
      logger.log('Identifier ' + name + ' was resolved from global context');
      return global[name];
    } else {
      logger.log('Identifier ' + name + ' is not defined anywhere, returning undefined');
      return undefined;
    }
  };

  const resolveIdentifier = (expression, context) => {
    const _name = expression.nm;
    const name = ['$', 'jQuery', '$d'].indexOf(_name) !== -1 ? '$d' : _name;

    if (isMemberExists(context, name)) {
      logger.log('Identifier ' + name + ' was resolved from expression context');
      return context[name];
    } else if (isMemberExists(global, name)) {
      if (ALLOWED_GLOBALS.indexOf(name) === -1) {
        throw new Error('Resolving global variable ' + name + ' is not allowed!');
      } else {
        logger.log('Identifier ' + name + ' was resolved from global context');
        return global[name];
      }
    } else if (name === 'this') {
      logger.log('Identifier was resolved as this');
      return getThis(context);
    } else if (name === 'undefined') {
      logger.log('Identifier was resolved as undefined keyword');
      return undefined;
    } else if (name === 'NaN') {
      logger.log('Identifier was resolved as NaN');
      return NaN;
    } else {
      logger.log('Identifier ' + name + ' was not resolved! Returning just its name');
      return name;
    }
  };

  const getThis = (context, fnToCall = null) => {
    if (fnToCall) {
      for (let i = 0; i < MANDATORY_THIS_WINDOW.length; i++) {
        const fnName = MANDATORY_THIS_WINDOW[i];
        const fnFromWindow = global[fnName];
        if (typeof fnFromWindow === 'function' && fnToCall == fnFromWindow) {
          logger.log('Function ' + fnName + ' is being called. This will be global object');
          return global;
        }
      }
    }

    if (context[THIS_KEY] !== undefined) {
      return context[THIS_KEY];
    } else {
      return this; // default this is this
    }
  };

  const processCallExpression = (expression, context) => {
    const prevThis = context[THIS_KEY];
    const callee = processNode(expression.ca, context);
    if (!!context[CHAIN_CONTEXT_KEY] && !callee) {
      logger.log(
        'Will not throw anything in call expression because of null object. Context contains chain context key',
      );
      return CHAIN_CONTEXT_DEFAULT_RETURN_VALUE;
    }

    if (typeof callee !== 'function') {
      throw new Error('Callee type is not a function. Callee - ' + JSON.stringify(callee));
    }

    const thisForCall = getThis(context, callee);
    const arguments = expression.as ? expression.as.map(arg => processNode(arg, context)) : [];

    const callResult = callee.apply(thisForCall, arguments);
    delete context[THIS_KEY];
    context[THIS_KEY] = prevThis; // rollback this
    return callResult;
  };

  const isArray = obj => {
    if (!obj) {
      return false;
    }

    if (typeof obj !== 'object') {
      return false;
    }

    const keys = Object.keys(obj);
    if (!keys.length) {
      return obj.length === 0;
    }

    for (let i = 0; i < keys.length; i++) {
      if (i === 0) {
        const key = parseInt(keys[i]);
        if (isNaN(key) || key !== 0) {
          return false;
        }
      } else {
        const key = parseInt(keys[i]);
        const prevKey = parseInt(keys[i - 1]);
        if (isNaN(key) && isNaN(prevKey) && key !== prevKey + 1) {
          return false;
        }
      }
    }

    return true;
  };

  const processMemberExpression = (expression, context, valueToAssign = MEMBER_DONT_ASSIGN) => {
    const object = processNode(expression.ob, context);
    if (!!context[CHAIN_CONTEXT_KEY] && !object) {
      logger.log(
        'Will not throw anything in member expression because of null object. Context contains chain context key',
      );
      return CHAIN_CONTEXT_DEFAULT_RETURN_VALUE;
    }

    let property = null;
    let resolvedAsIdName = false;
    if (expression.pr.tp === NodeType.IDENTIFIER) {
      property = expression.pr.nm;
      if (
        object == global &&
        global[property] !== undefined &&
        typeof global[property] === 'function' &&
        ALLOWED_GLOBALS.indexOf(property) === -1
      ) {
        throw new Error('Window method ' + property + ' is not allowed to be called!');
      }
      logger.log('Member property was resolved as ' + property + ' from identifier name');
      resolvedAsIdName = true;
    } else {
      property = processNode(expression.pr, context);
      logger.log('Member property was resolved from processNode - ' + property);
    }

    if (valueToAssign === MEMBER_DONT_ASSIGN) {
      context[THIS_KEY] = object; // for call expressions
      let memberValue = object[property];
      if (memberValue === undefined && resolvedAsIdName) {
        property = processNode(expression.pr, context);
        memberValue = object[property];
      }
      return memberValue;
    } else {
      if (isArray(object) && resolvedAsIdName) {
        const index = processNode(expression.pr, context);
        object[index] = valueToAssign;
      } else {
        object[property] = valueToAssign;
      }
    }
  };

  const processReturnStatement = (expression, context) => {
    const argument = expression.ag;
    const resolvedValue = processNode(argument, context);
    context[RETURN_VALUE_KEY] = resolvedValue;
    context[FORCE_RETURN_KEY] = true;
  };

  const processFunctionDeclaration = (expression, context) => {
    if (expression.id.tp !== NodeType.IDENTIFIER) {
      throw new Error(
        'Only identifier supported as function declaration id. Expression - ' + JSON.stringify(expression),
      );
    }

    const funcName = expression.id.nm;
    logger.log('Creating function in context ' + funcName);
    context[funcName] = processFunctionExpression(expression, context);
  };

  const processFunctionExpression = (expression, context) => {
    if (!!expression.ac) {
      throw new Error('Async functions are not allowed! Expression - ' + JSON.stringify(expression));
    }

    if (!!expression.gr) {
      throw new Error('Generator funtions are not allowed! Expression - ' + JSON.stringify(expression));
    }

    const params = expression.pa && expression.pa.length ? expression.pa : [];

    function func(...args) {
      const prevThis = context[THIS_KEY];
      context[THIS_KEY] = this; // populated by function caller

      for (let i = 0; i < params.length; i++) {
        const param = params[i];
        if (param.tp !== NodeType.IDENTIFIER) {
          throw new Error('Non-identifier function param is not supported! Expression - ' + JSON.stringify(expression));
        }
        context[param.nm] = args[i];
      }

      const returnValue = processNode(expression.bd, context);

      for (let i = 0; i < params.length; i++) {
        const param = params[i];
        delete context[param.nm];
      }

      let executionResult = returnValue;
      if (!context[FORCE_RETURN_KEY] && returnValue === DEFAULT_RETURN_VALUE) {
        executionResult = undefined;
        // for internal calls we should not return false
        // in case function returned default value and FORCE_RETURN_KEY is not true,
        // then function was void and it should return undefined instread of false.
        // otherwise some callback handlers like jquery.each might consider this
        // a condition for loop break, for example
      }

      delete context[FORCE_RETURN_KEY];
      delete context[RETURN_VALUE_KEY];
      context[THIS_KEY] = prevThis;
      return executionResult;
    }

    return func;
  };

  const processArrowExpression = (expression, context) => {
    if (!!expression.ac) {
      throw new Error('Async arrows are not allowed! Expression - ' + JSON.stringify(expression));
    }

    if (!!expression.gr) {
      throw new Error('Generator arrows are not allowed! Expression - ' + JSON.stringify(expression));
    }

    const params = expression.pa && expression.pa.length ? expression.pa : [];

    const func = (...args) => {
      for (let i = 0; i < params.length; i++) {
        const param = params[i];
        if (param.tp !== NodeType.IDENTIFIER) {
          throw new Error('Non-identifier function param is not supported! Expression - ' + JSON.stringify(expression));
        }
        context[param.nm] = args[i];
      }

      const returnValue = processNode(expression.bd, context);

      for (let i = 0; i < params.length; i++) {
        const param = params[i];
        delete context[param.nm];
      }

      let executionResult = returnValue;
      if (!context[FORCE_RETURN_KEY] && returnValue === DEFAULT_RETURN_VALUE) {
        executionResult = undefined;
        // for internal calls we should not return false
        // in case function returned default value and FORCE_RETURN_KEY is not true,
        // then function was void and it should return undefined instread of false.
        // otherwise some callback handlers like jquery.each might consider this
        // a condition for loop break, for example
      }

      delete context[FORCE_RETURN_KEY];
      delete context[RETURN_VALUE_KEY];
      return executionResult;
    };

    return func;
  };

  const processSpreadElement = (expression, context) => {
    const argument = expression.ag;
    if (!argument) {
      throw new Error('Spread element has no argument. Expression - ' + JSON.stringify(expression));
    }
    return processNode(argument, context);
  };

  const processArray = (expression, context) => {
    if (!expression.el || !expression.el.length) {
      logger.log('No elements! Returning empty array');
      return [];
    }

    let result = [];

    expression.el.forEach(el => {
      const value = processNode(el, context);
      if (el.tp === NodeType.SPREAD) {
        result = [...result, ...value];
      } else {
        result.push(value);
      }
    });

    return result;
  };

  const declareVariable = (node, context) => {
    if (!node.dc || !node.dc.length) {
      return;
    }

    node.dc.forEach(d => {
      if (d.tp === NodeType.VARDEC) {
        const varName = d.id.tp === 'id' ? d.id.nm : processNode(d.id, context);
        logger.log('Initializing var ' + varName);
        context[varName] = d.it === null ? null : processNode(d.it, context);
      } else {
        logger.log('Not supported variable declaration - ' + JSON.stringify(node));
      }
    });
  };

  const processCatchClause = (statement, context) => {
    const param = statement.param;
    if (param && param.tp === NodeType.IDENTIFIER) {
      context[param.nm] = context[EXCEPTION_KEY];
      delete context[EXCEPTION_KEY];
    }
    processBlockStatement(statement, context);
    if (param && param.tp === NodeType.IDENTIFIER) {
      delete context[param.nm];
    }
  };

  const processTryCatchStatement = (statement, context) => {
    const block = statement.block;
    const handler = statement.handler;
    const finalizer = statement.finalizer;

    try {
      processNode(block, context);
    } catch (err) {
      logger.warn('Error in try-catch statement! ' + JSON.stringify(statement));
      logger.warn(err);
      context[EXCEPTION_KEY] = err;
      if (handler) {
        processNode(handler, context);
      }
    } finally {
      if (finalizer) {
        processNode(finalizer, context);
      }
    }
  };

  const processIfStatement = (statement, context) => {
    const test = statement.ts;
    const doIf = statement.cs;
    if (!test || !doIf) {
      throw new Error('If statement must contain test and doIf!');
    }

    const doElse = statement.al;

    if (processNode(test, context)) {
      processNode(doIf, context);
    } else {
      if (doElse) {
        processNode(doElse, context);
      }
    }
  };

  const processTernaryOperator = (expression, context) => {
    const test = expression.ts;
    const doIf = expression.cs;
    const doElse = expression.al;

    if (!test || !doIf || !doElse) {
      throw new Error('Ternary operator must contain test and doIf and doElse!');
    }

    return processNode(test, context) ? processNode(doIf, context) : processNode(doElse, context);
  };

  const processBlockStatement = (statement, context) => {
    const topLevelNodes = statement.bd;
    if (!topLevelNodes || !topLevelNodes.length) {
      logger.warn('No top-level statements found for block - ' + JSON.stringify(statement));
    } else {
      for (let i = 0; i < statement.bd.length; i++) {
        const s = statement.bd[i];
        processNode(s, context);
        if (context[FORCE_RETURN_KEY]) {
          logger.log('Force return key detected, breaking block execution');
          break;
        }
      }
    }

    if (context[RETURN_VALUE_KEY]) {
      return context[RETURN_VALUE_KEY];
    } else {
      return DEFAULT_RETURN_VALUE;
    }
  };

  const processExpressionStatement = (statement, context) => {
    const expression = processNode(statement.ex, context);
    context[RETURN_VALUE_KEY] = expression;
  };

  const processForStatement = (expression, context) => {
    const init = expression.it;
    const test = expression.ts;
    const update = expression.ud;
    const body = expression.bd;

    processNode(init, context);

    let i = 0;

    while (processNode(test, context)) {
      processNode(body, context);
      processNode(update, context);
      i++;
      if (i >= MAX_LOOP_ITERATIONS) {
        throw new Error(
          'Maximum loop iterations reached for loop. Iterations - ' + i + '. Statement - ' + JSON.stringify(expression),
        );
      }
    }
  };

  const processObjectExpression = (expression, context) => {
    const properties = expression.properties;
    if (properties && properties.length) {
      let result = {};
      for (let i = 0; i++; i < properties.length) {
        const property = properties[i];
        if (property.tp === NodeType.PROPERTY) {
          const key = processNode(property.key, context);
          const value = processNode(property.vl, context);
          result[key] = value;
        } else if (property.tp === NodeType.SPREAD) {
          const value = processNode(property, context);
          result = {
            ...result,
            ...value,
          };
        } else {
          throw new Error(
            'Unknown type of object property ' + property.tp + '. Expression - ' + JSON.stringify(expression),
          );
        }
      }
      try {
        logger.log('Constructed object ' + JSON.stringify(result));
      } catch {
        // ignore
      }
      return result;
    } else {
      logger.log('Returning empty object {} because no properties');
      return {};
    }
  };

  const processNewExpression = (expression, context) => {
    const callee = processNode(expression.ca, context);

    const arguments = expression.as ? expression.as.map(arg => processNode(arg, context)) : [];

    return new callee(arguments);
  };

  const processLiteral = (literal, context) => {
    if (literal.rx) {
      const regex = literal.rx;
      return new RegExp(regex.pn, regex.fl);
    }

    return literal.vl;
  };

  const processNode = (node, context) => {
    if (!node.tp) {
      throw new Error('Node ' + JSON.stringify(node) + ' has no type');
    }

    logger.log('Execute node of type - ' + node.tp);

    switch (node.tp) {
      case NodeType.IF:
        return processIfStatement(node, context);
      case NodeType.TERNARY:
        return processTernaryOperator(node, context);
      case NodeType.VAR:
        return declareVariable(node, context);
      case NodeType.BLOCK:
        return processBlockStatement(node, context);
      case NodeType.EXPRESSION:
        return processExpressionStatement(node, context);
      case NodeType.ARRAY:
        return processArray(node, context);
      case NodeType.EMPTY:
        logger.log('Empty statement. Doing nothing');
        break;
      case NodeType.LITERAL:
        return processLiteral(node, context); // this should always work 🤞
      case NodeType.IDENTIFIER:
        return resolveIdentifier(node, context);
      case NodeType.MEMBER:
        return processMemberExpression(node, context);
      case NodeType.CALL:
        return processCallExpression(node, context);
      case NodeType.LOGICAL:
      case NodeType.BINARY:
        return processLogicalOrBinaryExpression(node, context);
      case NodeType.ASSIGNMENT:
        return processAssignmentExpression(node, context);
      case NodeType.UNARY:
        return processUnaryExpression(node, context);
      case NodeType.UPDATE:
        return processUpdateExpression(node, context);
      case NodeType.CHAIN:
        return processChainExpression(node, context);
      case NodeType.RETURN:
        return processReturnStatement(node, context);
      case NodeType.ARROW:
        return processArrowExpression(node, context);
      case NodeType.FUNCTIONDEC:
        return processFunctionDeclaration(node, context);
      case NodeType.FUNCTION:
        return processFunctionExpression(node, context);
      case NodeType.NEW:
        return processNewExpression(node, context);
      case NodeType.FOR:
        return processForStatement(node, context);
      case NodeType.THIS:
        return getThis(context);
      case NodeType.TRY:
        return processTryCatchStatement(node, context);
      case NodeType.CATCH:
        return processCatchClause(node, context);
      case NodeType.OBJECT:
        return processObjectExpression(node, context);
      case NodeType.SPREAD:
        return processSpreadElement(node, context);
      default:
        throw new Error('Unknown node type - ' + node.tp + '. Node - ' + JSON.stringify(node));
    }
  };

  window.jsonGetterInterpreter = (esTree, variables) => {
    const context = {};
    if (variables) {
      Object.keys(variables).forEach(v => {
        context[v] = variables[v];
      });
    }
    return processBlockStatement(esTree, context);
  };
})();
/* eslint-enable */
