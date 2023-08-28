const z = require('zod');

const answerSchema = z.object({
  answer: z.string().max(80),
  assessmentId: z.number(),
  userId: z.number(),
});

module.exports = {
  answerSchema,
};
