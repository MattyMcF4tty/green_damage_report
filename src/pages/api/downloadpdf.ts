import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from '@/firebase/clientApp';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.body;

    // Get the download URL
    const storageRef = ref(storage, `${id}/admin/DamageReport.pdf`);
    let pdfDownloadURL: string;
    
    try {
      pdfDownloadURL = await getDownloadURL(storageRef);
    } catch (error) {
      // PDF doesn't exist
      res.status(404).json({ error: "PDF does not exist" });
      return;
    }

    // Fetch the PDF as an ArrayBuffer
    const response = await axios.get(pdfDownloadURL, {
      responseType: 'arraybuffer',
    });

    const pdfArrayBuffer: ArrayBuffer = response.data;

    res.status(200).send(pdfArrayBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
}
