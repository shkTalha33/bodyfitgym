const { z } = require("zod");

const authSignupSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

const authLoginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

const mealSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    eatenAt: z.string().datetime(),
    protein: z.number().min(0).default(0),
    carbs: z.number().min(0).default(0),
    fats: z.number().min(0).default(0),
    calories: z.number().min(0).default(0),
    notes: z.string().optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

module.exports = { authSignupSchema, authLoginSchema, mealSchema };
