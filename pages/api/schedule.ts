import { VercelRequest, VercelResponse } from '@vercel/node';

const startAt = 8;
const endAt = 17;
const timeBlocks = Array.from(
  { length: endAt - startAt + 1 },
  (_, key) => `${(key + startAt).toString().padStart(2, '0')}:00`
);

const getSchedule = async (req: VercelRequest, res: VercelResponse) => {
  try {
    return res.status(200).json({ timeBlocks });
  } catch (error) {
    console.log('FB ERROR:', error);
    return res.status(401);
  }
};

const setSchedule = async (req: VercelRequest, res: VercelResponse) => {
  return res.status(201).end();
};

const methods = {
  GET: getSchedule,
  POST: setSchedule,
};

const handler = (req: VercelRequest, res: VercelResponse) =>
  methods[req.method] ? methods[req.method](req, res) : res.status(405);

export default handler;
