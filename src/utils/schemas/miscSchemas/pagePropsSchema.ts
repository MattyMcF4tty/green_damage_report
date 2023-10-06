import { CustomerDamageReport } from "../damageReportSchemas/customerReportSchema";


export interface PageProps {
    data: CustomerDamageReport;
    images: Record<string, string[]>;
    id: string;
}