import { fecthAdminDamageReport, requestDamageReportFileDownload, requestDamageReportFolderDownload } from "../damageReportLogic.ts/apiRoutes";
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
      const otherPartyImages = (await requestDamageReportFolderDownload(id, '/OtherPartyDamages/')).map((image) => {
        return image.base64
      })

      Images = {
        GreenMobility: [],
        OtherParty: otherPartyImages,
      };
      map = bufferToBase64((await requestDamageReportFileDownload(id, "/Admin/map")).buffer);
    } catch (error) {
      console.error(error);
    }
    
  const data = new AdminDamageReport();
  data.updateFields(await fecthAdminDamageReport(id));

  const pdfBlob = await createReportPDF(data, Images, map, id);

  await downloadToPc(pdfBlob, `DamageReport_${id}`);;
};