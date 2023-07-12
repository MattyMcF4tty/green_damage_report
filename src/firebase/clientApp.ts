import { reportDataType } from "@/utils/utils";
import { initializeApp } from "firebase/app"
import { collection, doc, getDocs, getFirestore, setDoc, updateDoc } from "firebase/firestore";

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

export const getData = async () => {
    const dataCol = collection(db, "unfinished");
    const dataSnapshot = await getDocs(dataCol);
    const dataList = dataSnapshot.docs.map(doc => {
        const data = doc.data();
        const id = doc.id;
        return {
            id: id,
            firstName: data.driverFirstName,
            lastName: data.driverLastName
        }
    });

    return dataList;
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
    
        bikerInfo: [{name: "", phone: "", mail: "", ebike: "", personDamage: ""}],
        vehicleInfo: [{name: "", phone: "", mail: "", driversLicenseNumber: "", insurance: "", numberplate: "", color: "", model: ""}],
        pedestrianInfo: [{name: "", phone: "", mail: "", personDamage: ""}],
        otherObjectInfo : [{description: "", information: ""}],
    
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