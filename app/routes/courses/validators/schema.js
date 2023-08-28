const z = require('zod');

const courseSchema = z.object({
  schoolId: z.number(),
  subjectId: z.number(),
  driveUrl: z.string().nullable(),
  calendarUrl: z.string().nullable(),
  name: z.string().min(3).max(255),
});

module.exports = {
  courseSchema,
};
