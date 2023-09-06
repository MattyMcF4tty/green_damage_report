import { initializeApp } from "firebase/app"
import { collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, setDoc, updateDoc, where } from "firebase/firestore";
import { ListResult, StorageReference, deleteObject, getDownloadURL, getStorage, listAll, ref, uploadBytes } from "firebase/storage"
import { decryptData, downloadToPc, encryptData, reportDataType } from "@/utils/utils";
import axios from "axios";
import app from "./firebaseConfig";

const db = getFirestore(app);
const storage = getStorage(app);

const collectionName = "DamageReports"

export const getData = async (id: string) => {
    console.log("fetchind docID: " + id)
    const docRef = doc(db, `${collectionName}/${id}`);
    const data = new reportDataType()

    try {
        const docSnapshot = await getDoc(docRef)
        if (docSnapshot.exists()) {
            const fetchedData = docSnapshot.data();
            data.updateFields(fetchedData)
        } 
        else {
            throw new Error("Document does not exist");
        }
    } catch (error) {
        console.error(`Something went wrong fetching data:\n${error}\n`)
    }
    
    const decryptedData = decryptData(data)
    return decryptedData;
}

export const createDoc = async (id: string, email: string) => {
    try {
        const data = new reportDataType()
        data.updateFields({userEmail: email.toLowerCase()})
        console.log("Report created:\n" + "id: " + id + "\n" + "Email: " + email.toLowerCase());

        const dataRef = doc(db, `${collectionName}/${id}`);
        await setDoc(dataRef, data.toPlainObject());
    } catch (error) {
        console.error(`An error occurred while writing data:\n${error}`);
    }
}

export const updateData = async (id:string, data:reportDataType) => {
    const dataRef = doc(db, `${collectionName}/${id}`);
    const currentDate = new Date();


    try {
        const encryptedData = encryptData(data);
        await updateDoc(dataRef, encryptedData.toPlainObject());
        await updateDoc(dataRef, {lastChange: `${currentDate.getHours()}:${currentDate.getMinutes()} - ${currentDate.getDay()}/${currentDate.getMonth()}/${currentDate.getFullYear()}`})
    } catch (error) {
        console.error(`Something went wrong updating data:\n${error}`)
    }
}

export const updateImages = async (
  id: string,
  images: FileList | null,
  imageType: "GreenMobility" | "OtherParty"
) => {
  const storageRef = ref(storage, `${id}/${imageType}`);

  try {
    if (images) {
      deleteAllImages(storageRef);
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const imageRef = ref(storageRef, image.name);
        const imageBlob = new Blob([image], { type: image.type });

        await uploadBytes(imageRef, imageBlob);
      }
    } else {
      deleteAllImages(storageRef);
    }
  } catch (error) {
    console.error(
      `Something went wrong updating images at ${id}/${imageType}:\n${error}\n`
    );
  }
};

const deleteAllImages = async (StorageRef: StorageReference) => {
  try {
    const storedImages: ListResult = await listAll(StorageRef);

        const deletedImages:Promise<void>[] = storedImages.items.map(async (image) => {
            await deleteObject(image);
        })

        await Promise.all(deletedImages)
    }
    catch ( error ) {
        console.error(`Something went wrong deleting all images in ${StorageRef.name}:\n${error}\n`)
    }
}

export const getImages = async (id: string) => {
  const greenStorageRef = ref(storage, `${id}/GreenMobility`);
  const otherPartyStorageRef = ref(storage, `${id}/OtherParty`);
  const imageURLs: Record<string, string[]> = {
    GreenMobility: [],
    OtherParty: [],
  };

    try {
        const greenImageList: ListResult = await listAll(greenStorageRef);
        const otherPartyImageList: ListResult = await listAll(otherPartyStorageRef);

    /* Get images of GreenMobility car */
    const greenImageURLs: string[] = [];
    for (const image of greenImageList.items) {
      const imageRef: StorageReference = ref(greenStorageRef, image.name);
      const imageURL: string = await getDownloadURL(imageRef);

      greenImageURLs.push(imageURL);
    }
    imageURLs["GreenMobility"] = greenImageURLs;

    /* Get images of OtherPartys */
    const otherPartyImageURLs: string[] = [];
    for (const image of otherPartyImageList.items) {
      const imageRef: StorageReference = ref(otherPartyStorageRef, image.name);
      const imageURL: string = await getDownloadURL(imageRef);

      otherPartyImageURLs.push(imageURL);
    }
    imageURLs["OtherParty"] = otherPartyImageURLs;
  } catch (error) {
    console.error(`Something went wrong fetching images:\n${error}\n`);
  }
  return imageURLs;
};

export const getReportIds = async () => {
  const reportColRef = collection(db, `${collectionName}/`);
  const idList: string[] = [];

  try {
    const querySnapshot = await getDocs(reportColRef);

    if (querySnapshot.docs.length > 0) {
      for (const doc of querySnapshot.docs) {
        const id = doc.id;
        idList.push(id);
      }
    } else {
      throw Error(`No documents exist in path ${reportColRef.path}`);
    }
  } catch (error) {
    console.error(`Something went wrong fetching document ids:\n${error}\n`);
  }

  return idList;
};

export const getReports = async () => {
    const idList = await getReportIds();
    const reportList: { id: string; data: reportDataType }[] = [];

    if (idList.length > 0) {  
        try {
            await Promise.all(
                idList.map(async (id) => {
                  const docData = await getData(id);
                  if (docData !== undefined) {
                      reportList.push({ id: id, data: docData });
                  }
                })
            );
        } catch(error) {
            console.error(`Something went wrong fecthing reports:\n${error}\n`)
        }
    }

  return reportList;
};

export const deleteReports = async (reportsToDelete: string[]) => {
  reportsToDelete.map(async (report) => {
    const reportRef = doc(db, `${collectionName}/${report}`);

    try {
      if (reportsToDelete.length === 0) {
        throw Error("No reports to delete");
      }

            for (const report of reportsToDelete) {
                const reportRef = doc(db, `${collectionName}/${report}`);
                await deleteDoc(reportRef);
            }
        } catch (error) {
            console.error(`Error deleting ${reportRef.path}: ${error}`);
        }
    })
}

export const checkEmailExists = async (email: string) => {
    const collectionRef = collection(db, collectionName)
    const q = query(collectionRef, where("userEmail", "==", email.toLowerCase()));
    
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(doc => (console.log(doc.id)))

      if (querySnapshot) {
        const reportIDs = querySnapshot.docs.map((doc) => doc.id)
        return reportIDs;
      } else {

        return [];
      }
    } catch (error) {
      console.error(`An error occurred while checking email:\n${error}`);
      return [];
    }
}

export const handleGeneratePdf = async (id: string)  => {
  try {
    const response = await axios.post('/api/generatepdf', { id });
    if (response.status === 200) {
      console.log(`PDF of ${id} generated and uploaded successfully.`);
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

export const handleDownloadPdf = async (id: string) => {
  try {
    const response = await axios.post('/api/downloadpdf', { id }, { responseType: 'arraybuffer' });

    if (response.status === 200) {
      console.log(`PDF of ${id} downloaded from server successfully.`);
      
      const pdfBlob: Blob = new Blob([response.data], { type: 'application/pdf' });
      
      await downloadToPc(pdfBlob, `DamageReport_${id}`);
    } else {
      throw new Error("Something went wrong downloading pdf to pc");
    }
  } catch (error:any) {
    if (error.response && error.response.status === 404) {
      console.log('PDF does not exist, creating a new one.');
      await handleGeneratePdf(id);
      await handleDownloadPdf(id);
    } else {
      console.error('An error occurred:', error);
    }
  }
}

