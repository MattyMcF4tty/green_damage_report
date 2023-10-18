import { fecthAdminDamageReport } from "../damageReportLogic.ts/apiRoutes";
import { downloadDamageReportFile, downloadDamageReportFolder, getDamageReportFolderDownloadUrls } from "../damageReportLogic.ts/logic";
import { bufferToBase64, downloadToPc } from "../misc";
import createReportPDF from "./templates/reportPdfTemplate";
import { AdminDamageReport } from "@/utils/schemas/damageReportSchemas/adminReportSchema";

export const handleGeneratePdf = async (id: string) => {
    let Images: Record<string, string[]> = {
      GreenMobility: [],
      OtherParty: [],
    };

    let map: string = ""; // Assuming handleDownloadImages returns an array of strings for maps

    try {
      const otherPartyImages = (await downloadDamageReportFolder(id, '/OtherPartyDamages/')).map((image) => {
        return bufferToBase64(image.buffer)
      })

      Images = {
        GreenMobility: [],
        OtherParty: otherPartyImages,
      };
      map = bufferToBase64((await downloadDamageReportFile(id, "/Admin/map")).buffer);
    } catch (error) {
      console.error(error);
    }
    
  const data = new AdminDamageReport();
  data.updateFields(await fecthAdminDamageReport(id));

  const pdfBlob = await createReportPDF(data, Images, map, id);

  await downloadToPc(pdfBlob, `DamageReport_${id}`);;
};