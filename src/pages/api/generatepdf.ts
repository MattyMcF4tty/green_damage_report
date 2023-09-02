import { NextApiRequest, NextApiResponse } from 'next';
import { ref, uploadBytes } from "firebase/storage";
import { getData, getImages, storage } from '@/firebase/clientApp';
import createReportPDF from '@/utils/reportPdfTemplate';
import fs from 'fs';
import path from 'path';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.body;

    const data = await getData(id);
    const images = await getImages(id);

    // Read the image file from the public folder
    const imagePath = path.join(process.cwd(), 'public/GreenLogos', 'GreenMobilityTextLogo.png');
    const imageBuffer = fs.readFileSync(imagePath);
    const imageBase64 = Buffer.from(imageBuffer).toString('base64')

    // Now imageBuffer contains the image data that can be passed to createReportPDF
    const pdfBuffer = await createReportPDF(data, images, imageBase64); // Updated this line to pass imageBuffer

    const storageRef = ref(storage, `${ id }/admin/DamageReport.pdf`);

    const snapshot = await uploadBytes(storageRef, pdfBuffer);

    res.status(200).json({ message: 'PDF generated and uploaded successfully.' });
  } catch (error) {
    console.error('Something went wrong:', error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
}

