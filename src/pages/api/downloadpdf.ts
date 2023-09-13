import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { getDownloadURL, ref } from "firebase/storage";
import { FireStorage } from '@/firebase/firebaseConfig';
import { handleGeneratePdf } from '@/utils/utils';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.body;

    // Get the download URL
    const storageRef = ref(FireStorage, `${id}/admin/DamageReport.pdf`);
    
    const pdfDownloadURL = await getDownloadURL(storageRef);

    // Fetch the PDF as an ArrayBuffer
    const response = await axios.get(pdfDownloadURL, {
      responseType: 'arraybuffer',
    });

    const pdfArrayBuffer: ArrayBuffer = response.data;

    res.status(200).send(pdfArrayBuffer);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
}
