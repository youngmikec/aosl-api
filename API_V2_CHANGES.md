# API changes for the v2 front-ends

Branch: `v2-endpoints`. All changes are additive or bug fixes; no existing route was removed.

## New endpoints
| Method & path | Auth | Purpose |
|---|---|---|
| `POST /users/resend-code` `{ email }` | public | Re-sends the verification email. Same response whether or not the email exists. |
| `PUT /users/me/password` `{ currentPassword, newPassword }` | user | Change password; requires the current one. |
| `PUT /invoice/:recordId` | admin | Edit an invoice (client details, services, tax, discount, dates, total, status). |
| `PUT /blog-posts/:recordId/publish` `{ status }` | admin | Publish / unpublish (the old duplicate route was unreachable). |
| `GET /faqs/public` | public | Published FAQs, ordered by category then `order`. |
| `GET/POST /faqs`, `PUT/DELETE /faqs/:recordId` | admin | Manage FAQs (`question`, `answer`, `category`, `order`, `isPublished`). |

## Behaviour changes
- **`GET /applications` and `GET /orders` are now scoped.** Non-admins only receive records they created or that carry their email (`email` for applications, `userDetails.email` for orders); a `createdBy` filter from the client is ignored for them. Admins are unchanged.
- **Jobs:** create/update now accept `workMode`, `status` (OPEN/CLOSED), `location`, `level` (ENTRY/INTERMEDIATE/SENIOR), `startDate`, `accredited`, `responsibilities`. `GET /jobs-posts` hides CLOSED jobs unless `?status=` is given. Updating `jobImage` now uploads it (previously stored the raw data URL because the code looked for a `networkImage` field).
- **Users:** `country` accepts any name (no longer limited to the 197 in `countries.js`). New `isSuspended` flag: settable through `PUT /user/admin/:id`, blocks login and all authenticated calls.
- **Contact mail (`POST /mails`):** `phone` is optional and may be up to 20 characters.
- **Uploads:** Cloudinary `resource_type: 'auto'`, so PDF/Word CVs upload as well as images.
- **`GET /reports/`** also returns `recentOrders`.
- **Search (`?q=`)** no longer crashes on jobs, applications and orders (it referenced an undefined variable); it searches title/company/location, name/email/role, and order code/customer respectively.
- Fixed: error handlers in those services referenced `error` instead of `err`; blog publish rejected admins who were not the author and always failed validation on `updatedBy`; job `type` default pointed at a non-existent constant.

## Not added (no endpoint yet)
Notifications, user activity log, product-service content for the public service pages, chat unread counts / "start conversation" for admins.


## Real-time chat (Socket.IO) — branch `v2-endpoints`
**New dependency:** `npm install socket.io` in `aosl-api` (the server imports it, so the API will not start without it).
Optional `CORS_ORIGINS` env var (comma-separated) adds allowed socket origins beyond `FRONTEND_URL` and localhost.

**Model.** Two room types: `SUPPORT` (one per customer; the customer and every admin can read it — admins by role, so admins added later see old chats) and `GROUP` (admin-only; only its members). Customers can never see another customer's chat, a group, or anyone else's support room. Messages have an optional `recipient`, a `readBy` list and an index on `room + createdAt`. Rooms keep `lastMessage` / `lastMessageAt`.

**Socket protocol** (`io(origin, { auth: { token } })`, same JWT as REST; suspended accounts and expired tokens are refused):
| Direction | Event | Payload |
|---|---|---|
| client → server | `message:send` | `{ room, message }` → ack `{ ok, message }` (sender is taken from the token; max 2000 chars; 15 msgs / 10 s) |
| client → server | `message:read` | `{ room }` → ack `{ ok, read }` |
| client → server | `typing` | `{ room, isTyping }` |
| server → client | `ready`, `message:new`, `message:read`, `typing`, `room:new`, `room:updated`, `room:removed`, `auth:expired` | see `src/api/chat/socket.js` |

**REST (still available, and used as a fallback while the socket is down).** All scoped to rooms the caller may access:
- `GET /chat-rooms` (with `unread` per room), `GET /chat-rooms/support` (the caller's own room, created on first use)
- `GET /chat-messages?room=<id>&limit=30&before=<messageId>` — newest page, oldest-first; `metadata.total > count` means older history exists
- `POST /send-message { room, message }`, `POST /chat-messages/read { room }`
- Admin groups: `POST /create-room { name, members }`, `PUT /chat-room/:id { name?, members? }`, `DELETE /chat-room/:id` (also deletes the room's messages)

**Other changes:** customer token lifetime is now 1 hour (was 1 minute); the server is created with `http.createServer` so sockets can attach; registration always creates the customer's support room; existing rooms are upgraded once at startup (`migrateChatRooms`: type `SUPPORT`, customer derived from members, last message copied). Old messages count as read (no `readBy`).

**Fixed:** anyone signed in could read every message and post as any sender; `uploadImage` was never imported for rooms; room `createdAt` default was evaluated once at startup.

## Public blogs
- `GET /blog-posts/public` now returns **published posts only** (drafts and unpublished posts were visible), populates the author with name and photo only, supports `?q=` and `fields=`, and returns `createdAt`.
- `GET /comments/public/byBlogId/:id` returns approved comments with display fields only (no emails). Posting a comment requires a published post with comments enabled; content is 2–1000 characters.

## Repository hygiene
`example.env` no longer contains values (property names only). The real values were moved to `~/Downloads/aosl-api-credentials`. **They remain in git history, so rotate them** (database, Cloudinary, Google, SMTP, PayPal, JWT secret).
