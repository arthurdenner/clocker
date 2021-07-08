import { VercelRequest, VercelResponse } from '@vercel/node';
import { app } from './../../config/firebase/server';
import { timeBlocksList } from './_utils';

const agenda = app.firestore().collection('agenda');
const profiles = app.firestore().collection('profiles');

const getUserId = async (username: string) => {
  const snapshot = await profiles.where('username', '==', username).get();

  if (snapshot.empty) {
    return false;
  }

  const { userId } = snapshot.docs[0].data();

  return userId;
};

const getSchedule = async (req: VercelRequest, res: VercelResponse) => {
  try {
    const { date, username } = req.query;
    const userId = await getUserId(username as string);

    if (!userId) {
      res.status(404).json({ message: 'Invalid username' });
      return;
    }

    const snapshot = await agenda
      .where('userId', '==', userId)
      .where('date', '==', date)
      .get();

    const docs = snapshot.docs.map(doc => doc.data());

    const timeBlocks = timeBlocksList.map(time => ({
      time,
      isBlocked: Boolean(docs.find(doc => doc.time === time)),
    }));

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
