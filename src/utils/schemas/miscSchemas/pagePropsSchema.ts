import { CustomerDamageReport } from "../damageReportSchemas/customerReportSchema";


export interface DamageReportPageProps {
    data: CustomerDamageReport;
    id: string;
}