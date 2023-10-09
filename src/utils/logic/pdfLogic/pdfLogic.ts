import { downloadToPc } from "../misc";
import { getAdminDamageReport, getReportFile, getReportFolder } from "../damageReportLogic.ts/damageReportHandling";
import { handleGetBase64FileFromStorage } from "../firebaseLogic/apiRoutes";
import { CustomerDamageReport } from "@/utils/schemas/damageReportSchemas/customerReportSchema";
import createReportPDF from "./templates/reportPdfTemplate";
import { fetchDamageReport } from "../damageReportLogic.ts/apiRoutes";
import { AdminDamageReport } from "@/utils/schemas/damageReportSchemas/adminReportSchema";

export const handleGeneratePdf = async (id: string) => {
    let Images: Record<string, string[]> = {
      GreenMobility: [],
      OtherParty: [],
    };

    let map: string = ""; // Assuming handleDownloadImages returns an array of strings for maps

    try {
      const otherPartyImageData = await getReportFolder(
        id,
        "/OtherPartyDamages/"
      );
      const otherPartyBase64 = await Promise.all(
        otherPartyImageData.map(async (imageData) => {
          const image = await handleGetBase64FileFromStorage(imageData.url);
          return image;
        })
      );

      console.log(otherPartyBase64);

      Images = {
        GreenMobility: [],
        OtherParty: otherPartyBase64,
      };
      const mapUrl = await getReportFile(id, "/Admin/map");
      map = await handleGetBase64FileFromStorage(mapUrl);
    } catch (error) {
      console.error(error);
    }
    
  const data = new AdminDamageReport();
  data.updateFields(await getAdminDamageReport(id));

  const pdfBlob = await createReportPDF(data, Images, map);

  await downloadToPc(pdfBlob, `DamageReport_${id}`);;
};