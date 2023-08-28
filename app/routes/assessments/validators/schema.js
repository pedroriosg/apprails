const z = require('zod');

const assessmentSchema = z.object({
  dateIn: z.string().datetime(),
  dateOut: z.string().datetime(),
  correctAnswer: z.string().min(80).max(80),
});

module.exports = {
  assessmentSchema,
};