import { reportDataType } from "@/utils/utils";
import { error } from "console";
import { initializeApp } from "firebase/app"
import { collection, doc, getDoc, getDocs, getFirestore, setDoc, updateDoc } from "firebase/firestore";

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

export const getData = async (id: string) => {
    console.log("ID: " + id)
    const docRef = doc(db, `unfinished/${id}`);

    try {
        const docSnapshot = await getDoc(docRef)

        if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            console.log("returning data")

            return {
                userEmail: data.userEmail,
                finished: data.finished,
        
                driverName: data.driverName,
                driverAddress: data.driverAddress,
                driverSocialSecurityNumber: data.driverSocialSecurityNumber,
                driverDrivingLicenseNumber: data.driverDrivingLicenseNumber,
                driverPhoneNumber: data.driverPhoneNumber,
                driverEmail: data.driverEmail,
            
                accidentLocation: data.accidentLocation,
                time: data.time,
                date: data.date,
                crashDescription: data.crashDescription,
            
                greenCarNumberPlate: data.greenCarNumberPlate,
                speed: data.speed,
                damageDescription: data.damageDescription,
                policeReport: data.policeReport,
            
                bikerInfo: data.bikerInfo,
                vehicleInfo: data.vehicleInfo,
                pedestrianInfo: data.pedestrianInfo,
                otherObjectInfo : data.otherObjectInfo,
            
                witnesses: data.witnesses
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

    const data = {
        userEmail: email,
        finished: false,

        driverName: "",
        driverAddress: "",
        driverSocialSecurityNumber: "",
        driverDrivingLicenseNumber: "",
        driverPhoneNumber: "",
        driverEmail: "",
    
        accidentLocation: {address: "", position: {lat: "", lng: ""}},
        time: "",
        date: "",
        crashDescription: "",
    
        greenCarNumberPlate: "",
        speed: "",
        damageDescription: "",
        policeReport: "",
    
        bikerInfo: {name: "", phone: "", email: "", ebike: false, personDamage: ""},
        vehicleInfo: {name: "", phone: "", email: "", driversLicenseNumber: "", insurance: "", numberplate: "", color: "", model: ""},
        pedestrianInfo: {name: "", phone: "", email: "", personDamage: ""},
        otherObjectInfo : {description: "", information: ""},
    
        witnesses: [{name: "", phone: "", email: ""}],
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
        console.log("Something went wrong updating data")
    }
}