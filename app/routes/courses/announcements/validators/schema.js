const { z } = require('zod');

const createAnnouncementSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1).max(255),
  CourseId: z.number().int().positive(),
});

module.exports = {
  createAnnouncementSchema,
};
