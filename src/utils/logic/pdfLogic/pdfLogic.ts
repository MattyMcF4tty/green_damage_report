import { downloadToPc } from "../misc";
import createReportPDF from "./templates/reportPdfTemplate";

export const handleGeneratePdf = async (id: string) => {
  const pdfBlob = await createReportPDF(id);

  await downloadToPc(pdfBlob, `DamageReport_${id}`);;
};