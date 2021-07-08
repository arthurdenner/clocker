const startAt = 8;
const endAt = 17;

export const timeBlocksList = Array.from(
  { length: endAt - startAt + 1 },
  (_, key) => `${(key + startAt).toString().padStart(2, '0')}:00`
);
