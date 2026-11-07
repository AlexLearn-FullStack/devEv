# Clerk user sync

The `/api/webhooks/clerk` endpoint creates a MongoDB user when Clerk sends a
`user.created` event. In the Clerk Dashboard, add this endpoint as a webhook,
subscribe to `user.created`, and set the endpoint's signing secret as
`CLERK_WEBHOOK_SIGNING_SECRET` in the application environment.
