# Missing / incomplete backend endpoints

Checked against the live API (`https://crm-omuz-bekend.onrender.com/api`), its Swagger
(`/api-docs`, spec at `/api-docs/swagger-ui-init.js`) and the backend source in
`../CRM-Omuz-Bekend`. Everything the API **does** provide is now wired into the frontend;
the list below is what the design still needs and the API does not have.

Legend: **[blocks design]** = a visible element had to be dropped or degraded.

---

## Employees

1. **[blocks design] `status` on `Employee`** (Active / Inactive) — the mockup has a Status
   column *and* a Status filter. The prisma model has no such field, so both were removed.
   Needs a column + `?status=` filter on `GET /employees`.
2. **[blocks design] Employee profile fields** — the "Add new employee" form has `birth_date`,
   `address`, `telegram_username`, `description`, `photo`; `POST/PUT /employees` accepts only
   `first_name, last_name, position, experience, branch_id, phone, email` and silently drops the
   rest. Photo also needs multipart (`upload.single("photo")`) like `POST /students` already has.
3. **[blocks design] `POST /employees/mentor-levels`** — only `PUT /employees/mentor-levels/:id`
   exists, so a mentor with no `MentorLevel` row can never get one from the UI.
4. **[blocks design] Mentor level *history*** — the mockup is a 12-month × mentor matrix.
   `MentorLevel` stores one current level per employee (`employee_id` is `@unique`). Needs e.g.
   `MentorLevelHistory { employee_id, year, month, level }` + `GET /employees/mentor-levels?year=`.
5. `GET /positions` (or a fixed enum) — `position` is free text, so the Position filter/select is
   currently built from values already present in the data.
6. *(nice to have)* include the `branch` relation in `GET /employees` — today only `branch_id`
   comes back, so the list makes a second call to `/branches` to show branch names.

## Courses

7. **`_count: { groups }` in `GET /courses`** — the cards show "Groups: N". The frontend now
   derives it by fetching `/groups?limit=200` and counting client-side.
8. **[blocks design] Syllabus / lessons resource** — there is no `Lesson` model and no route.
   `endpoints.md` promises `GET /courses/resources`, but that URL hits `GET /courses/:id` with
   `id="resources"` and returns **500**. Needed:
   - `GET /courses/:id/syllabus` → `[{ id, title, description, types: ["Lecture"|"Practice"|"Exam"] }]`
   - `POST /courses/:id/syllabus`, `PUT|DELETE /courses/:id/syllabus/:lessonId`

   Until then `/courses/:id/syllabus` shows the real course record + its real groups and says the
   lesson list is unavailable.

## Leads

9. **[blocks design] `phone`, `from_date`, `to_date` filters on `GET /leads`** — the mockup has
   those three inputs; `leadsWhere()` only understands `search`, `course_id`, `type`,
   `utm_source`, so the unsupported inputs were removed.
10. Include the `course` relation in `GET /leads` — only `course_id` is returned, so the table
    maps ids to names client-side from `/courses`.
11. `POST /leads/transfer` accepts `target_course_id` only; `endpoints.md` also promises
    `target_group_id`.

## Coupons

12. **[blocks design] `PUT /leads/coupons/:id` and `DELETE /leads/coupons/:id`** — the coupon
    cards have Edit / Delete buttons with nothing behind them.
13. **[blocks design] Coupon fields** — the design shows course, a validity range and an
    on/off switch. `Coupon` is `{ code, discount, lead_id, created_at }` only. Needs
    `course_id`, `valid_from`, `valid_to`, `active`.

## Timetable

14. Include `mentor` (and `group`) in `GET /timetable` — the response has `mentor_id` only, so the
    calendar fetches `/employees` just to resolve names.
15. Week range starts on **Sunday** (`date-fns` `startOfWeek` default). The design is Monday-first.
    Either pass `{ weekStartsOn: 1 }` or accept a `week_start` query param. The week view currently
    renders Sun→Sat to stay consistent with what the API returns.
16. *(nice to have)* `view=month` returns only that calendar month, so the leading/trailing days of
    the month grid are always empty.

## Profile

17. **`GET /me/birthdays`** — 404. The "Upcoming birthdays" card was removed.
18. **`GET /me/performance`** — 404. The Performance screens are now computed client-side from
    `GET /students/me/scores` (journal entries), which only works for the **student** role.
19. **[blocks design] No `User` ↔ `Employee` link** — `User` has `student_id` but nothing pointing
    at `Employee`, and the role enum is `student | admin | superadmin | director` (there is no
    `mentor` role). A mentor therefore cannot see their own level, hourly rate or groups, so the
    Mentor variant of the profile page is unreachable. Needs `employee_id` on `User` (exposed via
    `GET /auth/me`) or a `GET /me/employee`.
20. **`PUT /auth/me`** + avatar upload — the design has "Edit" and a change-avatar button.
21. **Notification channel (`sms|telegram`) and language preference** — no fields, no endpoint;
    the Notification card was removed rather than faking local-only state.
22. **`hourly_rate`** — the mentor card shows an hourly rate; `MentorLevel` stores only `level`.
23. **`late` on `JournalEntry`** — the performance design has a "Late (minutes)" metric that cannot
    be computed from `{ attendance, score, bonus, exam }`.

---

## Also worth fixing

- `GET /api/docs` / `/api-json` return 401; the real Swagger UI is at **`/api-docs`** (outside the
  auth middleware). Worth documenting so nobody hunts for it again.
- `src/store/services/student-self.ts` (the student slice, not touched here) types
  `/students/me/groups`, `/students/me/scores` and `/students/me/coins` as `{ data: [...] }`, but
  the backend returns bare arrays for the first two and `{ balance, transactions }` for coins.
