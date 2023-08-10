import { initializeApp } from "firebase/app"
import { collection, doc, getDoc, getDocs, getFirestore, setDoc, updateDoc } from "firebase/firestore";
import { StorageReference, deleteObject, getDownloadURL, getStorage, listAll, ref, uploadBytes } from "firebase/storage"
import { reportDataType } from "@/utils/utils";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);



export const getData = async (id: string) => {
    console.log("fetchind docID: " + id)
    const docRef = doc(db, `unfinished/${id}`);

    try {
        const docSnapshot = await getDoc(docRef)

        if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            console.log("Data received from server:", data)

            return {
                userEmail: data.userEmail,
                finished: data.finished,
                
                driverInfo: {
                    firstName: data.driverInfo.firstName,
                    lastName: data.driverInfo.lastName,
                    address: data.driverInfo.address,
                    socialSecurityNumber: data.driverInfo.socialSecurityNumber,
                    drivingLicenseNumber: data.driverInfo.drivingLicenseNumber,
                    phoneNumber: data.driverInfo.phoneNumber,
                    email: data.driverInfo.email
                },
            
                accidentLocation: data.accidentLocation,
                time: data.time,
                date: data.date,
                accidentDescription: data.accidentDescription,
            
                greenCarNumberPlate: data.greenCarNumberPlate,
                speed: data.speed,
                damageDescription: data.damageDescription,
                policeReportNumber: data.policeReportNumber,
            
                bikerInfo: data.bikerInfo,
                vehicleInfo: data.vehicleInfo,
                pedestrianInfo: data.pedestrianInfo,
                otherObjectInfo : data.otherObjectInfo,
            
                witnesses: data.witnesses,

                /* SITE LOGIC */
                /* What */
                driverRenter: data.driverRenter,

                /* How */
                policePresent: data.policePresent,
                policeReportExist: data.policeReportExist,
                witnessesPresent: data.witnessesPresent,

                /* Where */
                collisionPersonVehicle: data.collisionPersonVehicle,
                singleVehicleAccident: data.singleVehicleAccident,
                collisionOther: data.collisionOther,
                collisionCar: data.collisionCar,
                collisionBike: data.collisionBike,
                collisionPedestrian: data.collisionPedestrian,
            }
        } 
        else {
            throw new Error("Document does not exist");
        }
    } catch (error) {
        console.log("error fetching document" + error)
    }
}

export const getDocIds = async () => {
    const colRef = collection(db, "unfinished")

    try {
        const docListSnapshot = await getDocs(colRef)

        const docIds = docListSnapshot.docs.map((doc) => doc.id);

        return (docIds)
    } catch (error) {
        console.log("Something went wrong fetching document ids: \n" + error)
    }
}

export const createDoc = async (id: string, email: string) => {
    console.log("Creating doc")
    const data = {
        userEmail: email,
        finished: false,

        driverInfo: {
            firstName: "",
            lastName: "",
            address: "",
            socialSecurityNumber: "",
            drivingLicenseNumber: "",
            phoneNumber: "",
            email: ""
        },
    
        accidentLocation: "",
        time: "",
        date: "",
        accidentDescription: "",
    
        greenCarNumberPlate: "",
        speed: "",
        damageDescription: "",
        policeReportNumber: "",
    
        bikerInfo: {name: "", phone: "", email: "", ebike: null, personDamage: ""},
        vehicleInfo: {name: "", phone: "", email: "", driversLicenseNumber: "", insurance: "", numberplate: "", color: "", model: ""},
        pedestrianInfo: {name: "", phone: "", email: "", personDamage: ""},
        otherObjectInfo : {description: "", information: ""},
    
        witnesses: [],

        /* SITE LOGIC */
        /* What */
        driverRenter: null,

        /* How */
        policePresent: null,
        policeReportExist: null,
        witnessesPresent: null,

        /* Where */
        collisionPersonVehicle: null,
        singleVehicleAccident: null,
        collisionOther: null,
        collisionCar: false,
        collisionBike: false,
        collisionPedestrian: false,
    }

    const dataRef = doc(db, `unfinished/${id}`);

    try {
        await setDoc(dataRef, data);
        console.log("Data writing successful")
    } catch (error) {
        console.log("An error occurred while writing data");
    }
}

export const updateData = async (id:string, data:object) => {

    const dataRef = doc(db, `unfinished/${id}`)

    try {
        await updateDoc(dataRef, data);
        console.log("Data updated")
    } catch (error) {
        console.log(`Something went wrong updating data:\n${error}`)
    }
}

export const uploadImage = async (id:string, image:FileList | null, perspective:'FRONT' | 'RIGHT' | 'BACK' | 'LEFT') => {

    /* Checks if there already is a image from that perspectiv */
    const imageList = await listAll(ref(storage, id));
    for (const item of imageList.items) {
        if (item.name.startsWith(perspective)) {
            /* Delete image if it exist */
            await deleteObject(ref(storage, item.fullPath));
        };
    };

    if (image) {
        const imageName = `${perspective}_${image[0].name}`;
        const imageRef = ref(storage, `${id}/${imageName}`);
        const imgBlob = new Blob([image[0], image[0].type]);
    
        try {
            await uploadBytes(imageRef, imgBlob)
            console.log("Image uploaded")
        }
        catch(error) {
            console.error(`Error uploading image:\n${error}`)
        }
    }
    else {
        console.log("No image selected")
    }
}

export const getImages = async (id:string) => {
    const imageFolderRef = ref(storage, id);
    var imageURLs: Record<string, string> = {};


    try {
        const imageList = await listAll(imageFolderRef);

        /* Makes sure that the images is in the right order */
        for (const item of imageList.items) {
            const imageRef: StorageReference = ref(storage, item.fullPath)
            if (item.name.startsWith('FRONT')) {
                imageURLs['FRONT'] = await getDownloadURL(imageRef);
            } else if (item.name.startsWith('RIGHT')) {
                imageURLs['RIGHT'] = await getDownloadURL(imageRef);
            } else if (item.name.startsWith('BACK')) {
                imageURLs['BACK'] = await getDownloadURL(imageRef);
            } else if (item.name.startsWith('LEFT')) {
                imageURLs['LEFT'] = await getDownloadURL(imageRef);
            }
        }

        console.log("Image url fetching done")
    } catch(error) {
        console.error(`Something went wrong downloading the image urls:\n${error}\n`)
    }

    return(imageURLs)
}

const getReportIds = async () => {
    const reportColRef = collection(db, "unfinished/")
    const querySnapshot = await getDocs(reportColRef);
    const idList = querySnapshot.docs.map((doc) => doc.id);

    return idList;
}

export const getReports = async () => {
    const idList = await getReportIds();
    
    const reportList: { id: string; data: reportDataType }[] = [];
  
    await Promise.all(
      idList.map(async (id) => {
        const docData = await getData(id);
        if (docData !== undefined) {
            reportList.push({ id: id, data: docData });
        }
      })
    );
    
    return reportList;
  };
  