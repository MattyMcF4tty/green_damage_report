export const handleGetRenter = async (reportId:string, numberplate: string, date: Date) => {

    const data = {
      numberplate: numberplate.toUpperCase(),
      date: date,
      reportId: reportId
    };
  
    const response = await fetch(
      process.env.NEXT_PUBLIC_URL + "/api/wunderfleet/getRenter",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
  
    const responseData = await response.json();
  
    if (!response.ok) {
      throw new Error(responseData.errors[0]);
    }
  
    return true;
  };