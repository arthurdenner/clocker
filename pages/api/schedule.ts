import { VercelRequest, VercelResponse } from '@vercel/node';
import { app } from './../../config/firebase/server';

const agenda = app.firestore().collection('agenda');
const profiles = app.firestore().collection('profiles');

const startAt = 8;
const endAt = 17;
const timeBlocks = Array.from(
  { length: endAt - startAt + 1 },
  (_, key) => `${(key + startAt).toString().padStart(2, '0')}:00`
);

const getUserId = async (username: string) => {
  const profileDoc = await profiles.where('username', '==', username).get();

  if (profileDoc.empty) {
    return false;
  }

  const { userId } = profileDoc.docs[0].data();

  return userId;
};

const getSchedule = async (req: VercelRequest, res: VercelResponse) => {
  try {
    return res.status(200).json({ timeBlocks });
  } catch (error) {
    console.log('FB ERROR:', error);
    return res.status(401);
  }
};

const setSchedule = async (req: VercelRequest, res: VercelResponse) => {
  try {
    const { date, name, phone, time, username } = req.body;
    const userId = await getUserId(username);

    if (!userId) {
      res.status(400).json({ message: 'Invalid username' });
      return;
    }

    const docId = `${userId}#${date}#${time}`;

    const doc = await agenda.doc(docId).get();

    if (doc.exists) {
      res.status(409).json({ message: 'Time blocked!' });
      return;
    }

    await agenda.doc(docId).set({
      date,
      name,
      phone,
      time,
      userId,
    });

    return res.status(201).end();
  } catch (error) {
    console.log('FB ERROR:', error);
    return res.status(401);
  }
};

const methods = {
  GET: getSchedule,
  POST: setSchedule,
};

const handler = (req: VercelRequest, res: VercelResponse) =>
  methods[req.method] ? methods[req.method](req, res) : res.status(405);

export default handler;
