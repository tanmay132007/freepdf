# freepdf

## Railway API deployment

The API reads its configuration from environment variables at runtime. Railway does
not use your local `.env` file unless you add those values in the Railway service
Variables tab.

Set these variables for the Node API service:

```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
FRONTEND_URL=
REDIS_URL=
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=pdf-files
GEMINI_API_KEY=
```

`PORT` is provided by Railway automatically, so you usually do not need to set it.
Use the Supabase service role key only on the backend service. Do not expose it in
frontend variables.
