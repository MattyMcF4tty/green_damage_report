import { NextApiRequest, NextApiResponse } from 'next';
import jsPDF from 'jspdf';
import axios from 'axios';
import { ref, uploadBytes } from "firebase/storage";
import { getData, getImages, storage } from '@/firebase/clientApp';
import generatePDF from '@/utils/pdfGenerator';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.body
    console.log(id);

    const data = await getData(id);
    const images = await getImages(id);

    // Generate PDF as Buffer
    const pdfBuffer = await generatePDF(data, images)

    // Create a storage reference
    const storageRef = ref(storage, `hejmeddig/${id}.pdf`);

    // Upload the PDF to Firebase Storage
    const snapshot = await uploadBytes(storageRef, pdfBuffer);

    res.status(200).json({ message: 'PDF generated and uploaded successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong.' });
  }
}
