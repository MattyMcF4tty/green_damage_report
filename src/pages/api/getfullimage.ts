import { storage } from "@/firebase/clientApp";
import axios from "axios";
import { ListResult, StorageReference, getDownloadURL, listAll, ref } from "firebase/storage";
import { NextApiRequest, NextApiResponse } from "next";


export async function handler(req:NextApiRequest, res:NextApiResponse) {
    try {
        const { id } = req.body;

        const greenStorageRef = ref(storage, `${id}/GreenMobility`);
        const otherPartyStorageRef = ref(storage, `${id}/OtherParty`);

        const images: Record<string, string[]> = {
            GreenMobility: [],
            OtherParty: [],
        };

            const greenImageList: ListResult = await listAll(greenStorageRef);
            const otherPartyImageList: ListResult = await listAll(otherPartyStorageRef);
    
        /* Get images of GreenMobility car */
        for (const image of greenImageList.items) {
            const imageRef: StorageReference = ref(greenStorageRef, image.name);
            const imageURL: string = await getDownloadURL(imageRef);

/*             const response = await axios.get(imageURL, { responseType: 'arraybuffer' });
            const imageBase64 = Buffer.from(response.data, 'binary').toString('base64'); */
            
            images["GreenMobility"].push(imageURL);
        }
    
        /* Get images of OtherPartys */
        for (const image of otherPartyImageList.items) {
          const imageRef: StorageReference = ref(otherPartyStorageRef, image.name);
          const imageURL: string = await getDownloadURL(imageRef);
    
/*           const response = await axios.get(imageURL, { responseType: 'arraybuffer' });
          const imageBase64 = Buffer.from(response.data, 'binary').toString('base64'); */
          
          images["OtherParty"].push(imageURL);
        }

        res.status(200).send(images)
    } catch (error:any) {
        res.status(500).json({message: "Something went wrong"})
    }
}