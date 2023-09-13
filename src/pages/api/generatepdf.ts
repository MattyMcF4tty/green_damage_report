import { NextApiRequest, NextApiResponse } from 'next';
import { deleteObject, ref, uploadBytes } from "firebase/storage";
import { getData } from '@/firebase/clientApp';
import createReportPDF from '@/utils/reportPdfTemplate';
import fs from 'fs';
import path from 'path';
import { handleDownloadImages } from '@/utils/utils';
import { FireStorage } from '@/firebase/firebaseConfig';


export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.body;

    if (!id) {
      res.status(400).json({ message: 'Missing id' })
    }
    // Try deleting the PDF (if it exists)
    try {
      const pdfRef = ref(FireStorage, `${id}/admin/DamageReport.pdf`);
      await deleteObject(pdfRef);
    } catch (error:any) {

      // Firebase throws error if file does not exist.
      // Therefor we just proceeds with no action if thats the error code.
      // If its another error code we throw an error
      if (error.code !== 'storage/object-not-found') {
        throw error;
      }
    }

    const data = await getData(id);
    const images: Record<string, string[]> = {
      GreenMobility: await handleDownloadImages(`${id}/GreenMobility`, 'url'),
      OtherParty: await handleDownloadImages(`${id}/OtherParty`, 'url')
    }

    // Read the image file from the public folder
    const logoPath = path.join(process.cwd(), 'public/GreenLogos', 'GreenMobilityTextLogo.png');
    const logoBuffer = fs.readFileSync(logoPath);
    const logoBase64 = Buffer.from(logoBuffer).toString('base64')

    const pdfBuffer = await createReportPDF(data, images, logoBase64);

    const storageRef = ref(FireStorage, `${ id }/admin/DamageReport.pdf`);

    await uploadBytes(storageRef, pdfBuffer);

    res.status(200).json({ message: 'PDF generated and uploaded successfully.' });
  } catch (error:any) {
    res.status(500).json({ message: error.message });
  }
}

