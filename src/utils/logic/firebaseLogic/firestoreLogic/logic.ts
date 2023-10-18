import { doc } from "firebase/firestore";
import { getAdminFirestore } from "../initFirebaseAdmin"
import AppError from "@/utils/schemas/miscSchemas/errorSchema";


export const createFirestoreCollectionRef = (collectionName:string) => {
    const Firestore = getAdminFirestore();
    return Firestore.collection(collectionName)
}


export const createFirestoreDocRef = (collection:string, docName:string) => {
    return createFirestoreCollectionRef(collection).doc(docName);
}


export const createFirestoreCollectionQuery = (collection:string, fieldName:string, filterOperation:FirebaseFirestore.WhereFilterOp, fieldValue:string | number | boolean | null) => {
    return createFirestoreCollectionRef(collection).where(fieldName, filterOperation, fieldValue);
}


export const createFirestoreDocument = async (docName:string, collection:string, data:object) => {
    const docRef = createFirestoreDocRef(collection, docName);

    try {
        // Set the data for the document (will create if it doesn't exist, overwrite if it does)
        await docRef.set(data);

        console.log(`Document ${docName} set in collection ${collection}.`);
    } catch (error:any) {
        console.error(`Error setting Firestore document ${docName} in collection ${collection}:`, error.message)

        throw new AppError(error.code, error.message);
    }
}


export const updateFirestoreDocument = async (docName:string, collection:string, data:object) => {
    const docRef = createFirestoreDocRef(collection, docName);

    try {
        await docRef.update(data);

        console.log(`Document ${collection}/${docName} updated with:`, data);
    } catch (error:any) {
        console.error(`Error updating Firestore document ${docName} in collection ${collection}:`, error.message)

        throw new AppError(error.code, error.message);
    }
}


export const getFirestoreDocument = async (docName:string, collection:string) => {
    const docRef = createFirestoreDocRef(collection, docName);

    try {
        const document = await docRef.get();

        if (!document.exists) {
            throw new AppError('NOT_FOUND', `Document ${docName} does not exist.`)
        }

        console.log(`Fetched document ${collection}/${docName}`);
        return document;
    } catch (error:any) {
        console.error(`Error getting Firestore document ${docName} in collection ${collection}:`, error.message)

        throw new AppError(error.code || error.name, error.message);
    }
}


export const deleteFirestoreDocument = async (docName:string, collection:string) => {
    const docRef = createFirestoreDocRef(collection, docName);

    try {
        await docRef.delete();
    } catch (error:any) {
        console.error(`Error deleting Firestore document ${docName} in collection ${collection}:`, error.message)

        throw new AppError(error.code, error.message);
    }
}


export const queryFirestoreCollection = async (collection:string, fieldName:string, filterOperation:FirebaseFirestore.WhereFilterOp, fieldValue:string | number | boolean | null, limit?:number) => {
    let query = createFirestoreCollectionQuery(collection, fieldName, filterOperation, fieldValue);

    // We limit the query document ammount.
    if (limit) {
        query = query.limit(limit);
    }

    // We try to query the collection for specified query
    try {
        const querySnapshot = await query.get();

        console.log(`Found ${querySnapshot.size} documents in collection ${collection} matching query: <${fieldName} ${filterOperation} ${fieldValue}>.`);
        return querySnapshot;
    } catch (error:any) {
        console.error(`Error querying Firestore collection ${collection}:`, error.message);
        throw new AppError(error.code, error.message);
    }
}


export const getFirestoreCollection = async (collection:string, limit?:number) => {
    let collectionRef = createFirestoreCollectionRef(collection);

    if (limit) {
        collectionRef.limit(limit);
    }

    try {
        const documents = await collectionRef.get();

        console.log(`Retrieved ${documents.size} document${documents.size !== 1 && 's'} from the ${collection} collection.`);
        return documents;
    } catch (error:any) {
        console.error(`Error retrieving documents from Firestore collection ${collection}:`, error.message);
        throw new AppError(error.code, error.message);
    }
}


export const getFirestoreCollectionDocIds = async (collectionName: string): Promise<string[]> => {
    const collectionRef = createFirestoreCollectionRef(collectionName);

    try {
        const snapshot = await collectionRef.get();
        const docIds = snapshot.docs.map(doc => doc.id);

        console.log(`Fetched ${docIds.length} document ID${docIds.length !== 0 && 's'} from the ${collectionName} collection.`);
        return docIds;
    } catch (error: any) {
        console.error(`Error retrieving document IDs from Firestore collection ${collectionName}:`, error.message);
        throw new AppError(error.code, error.message);
    }
}
