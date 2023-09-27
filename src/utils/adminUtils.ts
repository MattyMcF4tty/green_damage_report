import Cookies from "js-cookie";

export const handleAdminCreateNewReport = async (email: string, phoneNumber: string, reservationId:string) => {
    const data = {
      email: email,
      phoneNumber: phoneNumber,
      reservationId: reservationId
    }
  
    const url = process.env.NEXT_PUBLIC_URL;
    if (!url) {
      throw new Error("NEXT_PUBLIC_URL is not defined in enviroment")
    } 
  
    const authToken = Cookies.get("AuthToken");
    if (!authToken) {
      throw new Error("UNAUTHORIZED")
    }
  
    const response = await fetch(process.env.NEXT_PUBLIC_URL + "/api/admin/damagereport/createNew", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authorization": authToken
      },
      body: JSON.stringify(data)
    })

    const responseJson = await response.json()
    if (!response.ok) {
        const newError = new Error(responseJson.errors[0])
        newError.name = responseJson.status

        throw newError;
    }

    const reportId: string = responseJson.data.reportId;

    return reportId;
}