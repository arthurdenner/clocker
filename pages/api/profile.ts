import { VercelRequest, VercelResponse } from '@vercel/node';
import { app } from './../../config/firebase/server';

const profile = app.firestore().collection('profiles');

const handler = async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  const { username } = req.body;
  const [, token] = req.headers.authorization.split(' ');
  const { user_id } = await app.auth().verifyIdToken(token);

  profile.doc(username).set({
    userId: user_id,
    username,
  });

  res.status(201).end();
};

export default handler;
