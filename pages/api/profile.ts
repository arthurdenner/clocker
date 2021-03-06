import { VercelRequest, VercelResponse } from '@vercel/node';
import { app } from './../../config/firebase/server';

const profiles = app.firestore().collection('profiles');

const handler = async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  try {
    const { username } = req.body;
    const [, token] = req.headers.authorization.split(' ');
    const { user_id } = await app.auth().verifyIdToken(token);

    await profiles.doc(username).set({
      userId: user_id,
      username,
    });

    res.status(201).end();
  } catch (error) {
    console.log('FB ERROR:', error);
    res.status(500);
  }
};

export default handler;
