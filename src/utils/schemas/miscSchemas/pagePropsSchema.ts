import { CustomerDamageReport } from "../damageReportSchemas/customerReportSchema";


export interface DamageReportPageProps {
    data: CustomerDamageReport;
    otherPartyImageUrls: string[];
    id: string;
}