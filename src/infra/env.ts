import z from 'zod'

export const envSchema = z.object({
  DATABASE_URL: z.url(),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  JWT_ACCESS_TOKEN_EXPIRES_IN: z.string().default('3h'),
  JWT_REFRESH_TOKEN_EXPIRES_IN: z.string().default('30d'),
  ACCOUNT_VERIFICATION_CODE_EXPIRES_IN_MINUTES: z.coerce.number().default(10),
  ACCOUNT_VERIFICATION_RESEND_COOLDOWN_SECONDS: z.coerce.number().default(60),
  ACCOUNT_VERIFICATION_MAX_ATTEMPTS: z.coerce.number().default(5),
  AWS_REGION: z.string().default('sa-east-1'),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_S3_BUCKET: z.string().default('sonoriza-media'),
  CLOUDFRONT_DOMAIN: z.string(),
  UPLOAD_LAMBDA_SIGN_FUNCTION_NAME: z.string(),
  TRANSACTIONAL_EMAIL_LAMBDA_FUNCTION_NAME: z
    .string()
    .default('send-transactional-email'),
  UPLOAD_MAX_FILE_SIZE_MB: z.coerce.number().default(12),
  PORT: z.coerce.number().optional().default(3333),
})

export type Env = z.infer<typeof envSchema>
