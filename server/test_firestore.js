const { admin, db } = require('./firebase');

async function run() {
  try {
    console.log('Initialized apps:', admin.apps && admin.apps.length);
    console.log('ProjectId from admin:', admin.instanceId?.projectId || admin?.app?.().options?.projectId || admin?.app?.().options?.credential?.projectId || 'unknown');
  } catch (e) {
    // ignore
  }

  try {
    const ref = db.collection('diagnostic_tests').doc('node_write_test');
    await ref.set({ ts: Date.now(), note: 'diagnostic write' });
    console.log('Write succeeded');
  } catch (err) {
    console.error('Write failed:', err);
    if (err && err.code) console.error('Error code:', err.code);
    if (err && err.details) console.error('Details:', err.details);
    if (err && err.metadata) console.error('Metadata keys:', err.metadata.internalRepr && Array.from(err.metadata.internalRepr.keys()));
  }
  process.exit(0);
}

run();
