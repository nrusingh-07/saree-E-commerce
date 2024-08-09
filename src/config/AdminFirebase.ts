import 'server-only'
import admin from 'firebase-admin'

// admin.initializeApp({
//   credential: admin.credential.cert({
//     projectId: process.env.FIREBASE_PROJECT_ID,
//     clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//     privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
//   }),
// })

interface FirebaseAdminAppParams {
  projectId: string
  clientEmail: string
  privateKey: string
}

export const createFirebaseAdminApp = (params: FirebaseAdminAppParams) => {
  if (admin.apps.length > 0) {
    return admin.apps[0]!
  }

  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId: params.projectId,
      clientEmail: params.clientEmail,
      privateKey: params.privateKey?.replace(/\\n/g, '\n'),
    }),
    projectId: params.projectId,
    storageBucket: `${params.projectId}.appspot.com`,
  })
}

export const initAdmin = () => {
  const params = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
    privateKey: process.env.FIREBASE_PRIVATE_KEY!,
  }

  return createFirebaseAdminApp(params)
}
