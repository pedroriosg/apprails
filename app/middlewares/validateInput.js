/**
 * Validates the input data in the request body against the specified Zod schema.
 *
 * @param {import('zod').ZodType<T>} schema - The Zod schema to use for validation.
 * @returns {import('express').RequestHandler} - An Express middleware function that validates the input data.
 */
function validateInput(schema) {
  /**
   * An Express middleware function that validates the input data in the request body.
   *
   * @param {import('express').Request} req - The Express request object.
   * @param {import('express').Response} res - The Express response object.
   * @param {import('express').NextFunction} next - The Express next function.
   */
  return (req, res, next) => {
    try {
      console.log('req.body', req.body);
      const validatedInput = schema.parse(req.body);
      req.body = validatedInput;
      return next();
    } catch (error) {
      return res.status(422).json({ errors: JSON.parse(error.message) });
    }
  };
}

module.exports = { validateInput };
