import { VercelRequest, VercelResponse } from '@vercel/node';
import { app } from './../../config/firebase/server';
import { timeBlocksList } from './_utils';

const agenda = app.firestore().collection('agenda');

const handler = async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'GET') {
    res.status(405).end();
    return;
  }

  const [, token] = req.headers.authorization.split(' ');

  if (!token) {
    res.status(401).end();
    return;
  }

  try {
    const { user_id } = await app.auth().verifyIdToken(token);

    const snapshot = await agenda
      .where('userId', '==', user_id)
      .where('date', '==', req.query.date)
      .get();

    const docs = snapshot.docs.map(doc => doc.data());

    const timeBlocks = timeBlocksList.map(time => ({
      time,
      ...(docs.find(doc => doc.time === time) || {}),
    }));

    return res.status(200).json({ timeBlocks });
  } catch (error) {
    console.log('FB ERROR:', error);
    res.status(500).end();
  }
};

export default handler;
