import admin from 'firebase-admin'
import { config } from './index'

if (!admin.apps.length) {
  if (config.firebase.projectId && config.firebase.clientEmail && config.firebase.privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId:   config.firebase.projectId,
        clientEmail: config.firebase.clientEmail,
        privateKey:  config.firebase.privateKey,
      }),
    })
  } else {
    // Dev fallback — uses GOOGLE_APPLICATION_CREDENTIALS env var if set
    admin.initializeApp()
  }
}

export { admin }
