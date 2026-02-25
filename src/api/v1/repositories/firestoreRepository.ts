import { db } from "../../../config/firebaseConfig";
 
interface FieldValuePair {
    fieldName: string;
    fieldValue: string | number | boolean;
}
 
export const runTransaction = async <T>(
    operations: (transaction: FirebaseFirestore.Transaction) => Promise<T>
): Promise<T> => {
    try {
        return await db.runTransaction(operations);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Transaction failed: ${errorMessage}`);
    }
};
 
export const createDocument = async <T>(
    collectionName: string,
    data: T
): Promise<T & { id: string }> => {
    try {
        const docRef = await db.collection(collectionName).add(data as object);
        return { ...data, id: docRef.id };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to create document in ${collectionName}: ${errorMessage}`);
    }
};
 
export const getAllDocuments = async <T>(
    collectionName: string
): Promise<T[]> => {
    try {
        const snapshot = await db.collection(collectionName).get();
        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as T[];
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to fetch documents from ${collectionName}: ${errorMessage}`);
    }
};
 
export const getDocumentById = async <T>(
    collectionName: string,
    id: string
): Promise<T | null> => {
    try {
        const doc = await db.collection(collectionName).doc(id).get();
        if (!doc.exists) return null;
        return { id: doc.id, ...doc.data() } as T;
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to fetch document ${id} from ${collectionName}: ${errorMessage}`);
    }
};
 
export const updateDocument = async <T>(
    collectionName: string,
    id: string,
    data: Partial<T>
): Promise<T> => {
    try {
        await db.collection(collectionName).doc(id).update(data as object);
        const updated = await db.collection(collectionName).doc(id).get();
        return { id: updated.id, ...updated.data() } as T;
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to update document ${id} in ${collectionName}: ${errorMessage}`);
    }
};
 
export const deleteDocument = async (
    collectionName: string,
    id: string,
    transaction?: FirebaseFirestore.Transaction
): Promise<void> => {
    try {
        const docRef: FirebaseFirestore.DocumentReference = db
            .collection(collectionName)
            .doc(id);
        if (transaction) {
            transaction.delete(docRef);
        } else {
            await docRef.delete();
        }
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to delete document ${id} from ${collectionName}: ${errorMessage}`);
    }
};
 
export const deleteDocumentsByFieldValues = async (
    collectionName: string,
    fieldValuePairs: FieldValuePair[],
    transaction?: FirebaseFirestore.Transaction
): Promise<void> => {
    try {
        let query: FirebaseFirestore.Query = db.collection(collectionName);
        fieldValuePairs.forEach(({ fieldName, fieldValue }) => {
            query = query.where(fieldName, "==", fieldValue);
        });
        let snapshot: FirebaseFirestore.QuerySnapshot;
        if (transaction) {
            snapshot = await transaction.get(query);
            snapshot.docs.forEach((doc) => {
                transaction.delete(doc.ref);
            });
        } else {
            snapshot = await query.get();
            const batch: FirebaseFirestore.WriteBatch = db.batch();
            snapshot.docs.forEach((doc) => {
                batch.delete(doc.ref);
            });
            await batch.commit();
        }
    } catch (error: unknown) {
        const fieldValueString: string = fieldValuePairs
            .map(({ fieldName, fieldValue }) => `${fieldName} == ${fieldValue}`)
            .join(" AND ");
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to delete documents from ${collectionName} where ${fieldValueString}: ${errorMessage}`);
    }
};