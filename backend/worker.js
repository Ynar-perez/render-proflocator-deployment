import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import cron from 'node-cron';

// Load env
dotenv.config();

const uri = process.env.DATABASE_URL;
if (!uri) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

const client = new MongoClient(uri);

// Derive database name: prefer explicit env var DATABASE_NAME, otherwise parse from URI
const databaseName = process.env.DATABASE_NAME || (() => {
  try {
    const tail = uri.split('/').pop();
    return tail ? tail.split('?')[0] : 'profLocatorDB';
  } catch (e) {
    return 'profLocatorDB';
  }
})();

function parseTimeToMinutes(t) {
  if (!t) return null;
  t = t.toString().trim();
  const ampmMatch = t.match(/(AM|PM)$/i);
  if (ampmMatch) {
    const parts = t.replace(/\s?(AM|PM)$/i, '').split(':');
    let h = parseInt(parts[0], 10);
    const m = parseInt(parts[1] || '0', 10);
    const ampm = ampmMatch[1].toUpperCase();
    if (ampm === 'PM' && h !== 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    return h * 60 + m;
  }
  const parts = t.split(':');
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1] || '0', 10);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
}

async function startWorker() {
  try {
    await client.connect();
  console.log('Worker: connected to DB');
  const db = client.db(databaseName);
    const usersCollection = db.collection('users');

    // Daily reset at 21:01 Manila time
    cron.schedule('1 21 * * *', async () => {
      console.log('Worker: Running daily reset at 21:01');
      try {
        const result = await usersCollection.updateMany(
          { role: 'PROFESSOR' },
          { $set: { status: 'Not Set', location: { Building: 'Rizal Building', Room: 'Faculty Room' }, locationLastModified: new Date().toISOString() } }
        );
        console.log(`Worker: daily reset updated ${result.modifiedCount} docs`);
      } catch (err) {
        console.error('Worker: daily reset error', err);
      }
    }, { scheduled: true, timezone: 'Asia/Manila' });

    // Per-minute consolidated status job
    cron.schedule('* * * * *', async () => {
      const debug = process.env.STATUS_DEBUG === 'true';
      if (debug) console.log('Worker: running per-minute status job');
      try {
        const now = new Date();
        const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        const currentDay = days[now.getDay()];
        const nowMinutes = now.getHours() * 60 + now.getMinutes();

        const professors = await usersCollection.find({ role: 'PROFESSOR' }).toArray();
        for (const prof of professors) {
          const statusUntilMinutes = prof.statusUntil ? parseTimeToMinutes(prof.statusUntil) : null;

          // check classes
          const activeClass = (prof.classSchedules || []).find(cs => {
            if (cs.day !== currentDay) return false;
            const fromM = parseTimeToMinutes(cs.from);
            const toM = parseTimeToMinutes(cs.to);
            return fromM != null && toM != null && fromM <= nowMinutes && nowMinutes < toM;
          });

          if (activeClass && prof.status !== 'In Class') {
            await usersCollection.updateOne({ _id: prof._id }, { $set: { status: 'In Class' }, $unset: { statusUntil: "" } });
            continue;
          }

          if (prof.status === 'In Class' && !activeClass) {
            await usersCollection.updateOne({ _id: prof._id }, { $set: { status: 'Not Set' }, $unset: { statusUntil: "" } });
            continue;
          }

          if (statusUntilMinutes != null && nowMinutes >= statusUntilMinutes && !activeClass) {
            await usersCollection.updateOne({ _id: prof._id }, { $set: { status: 'Not Set' }, $unset: { statusUntil: "" } });
            continue;
          }

          const hasManualStatus = prof.status && !['Available','In Class','Not Set'].includes(prof.status);
          if (hasManualStatus && !activeClass) continue;

          const inConsultation = (prof.consultationHours || []).some(ch => {
            if (ch.day !== currentDay) return false;
            const fromM = parseTimeToMinutes(ch.from);
            const toM = parseTimeToMinutes(ch.to);
            return fromM != null && toM != null && fromM <= nowMinutes && nowMinutes < toM;
          });

          if (inConsultation) {
            if (prof.status !== 'Available') await usersCollection.updateOne({ _id: prof._id }, { $set: { status: 'Available' } });
          } else {
            if (prof.status === 'Available') await usersCollection.updateOne({ _id: prof._id }, { $set: { status: 'Not Set' } });
          }
        }
      } catch (err) {
        console.error('Worker: per-minute job error', err);
      }
    }, { scheduled: true, timezone: 'Asia/Manila' });

    console.log('Worker: scheduled jobs registered');
  } catch (err) {
    console.error('Worker failed to start', err);
    process.exit(1);
  }
}

startWorker();
