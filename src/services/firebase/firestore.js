import { db } from './config';
import { 
    collection, 
    doc, 
    getDoc, 
    getDocs, 
    setDoc, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    query, 
    where, 
    orderBy 
} from 'firebase/firestore';

export const getDocument = async (collectionName, id) => {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data(), _exists: true, _ref: docSnap.ref };
    }
    return { _exists: false };
};

export const getCollection = async (collectionName, queryConstraints = []) => {
    const colRef = collection(db, collectionName);
    const q = queryConstraints.length > 0 ? query(colRef, ...queryConstraints) : colRef;
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        _ref: doc.ref
    }));
};

export const createDocument = async (collectionName, data, id = null) => {
    if (id) {
        const docRef = doc(db, collectionName, id);
        await setDoc(docRef, data);
        return { id, ...data };
    } else {
        const colRef = collection(db, collectionName);
        const docRef = await addDoc(colRef, data);
        return { id: docRef.id, ...data };
    }
};

export const updateDocument = async (collectionName, id, data) => {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, data);
    return true;
};

export const deleteDocument = async (collectionName, id) => {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
    return true;
};

export const createQueryConstraint = {
    where: (field, opStr, value) => where(field, opStr, value),
    orderBy: (field, directionStr) => orderBy(field, directionStr)
};
