# DIVE Recreational Mode v2.5.2 — Single HH:MM duration input

UX correction requested after field review with Wili.

Changes:
- One duration input per concept using `HH:MM`.
- Example: `01:30 = 1 h 30 min`.
- Quick buttons remain explicit (`1 h 30 min`, `2 h 00 min`, etc.).
- The same component is used for first bottom time, surface interval, and second bottom time.
- Internally the planner still converts durations to total minutes. Calculation rules are unchanged.

After copying the patch, run:

```bash
npm install --include=optional
npm run test
npm run build
npm run dev
```
