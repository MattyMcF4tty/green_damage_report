export const handleGetRenter = async (numberplate: string, date: Date) => {
    const data = {
      numberplate: numberplate.toUpperCase(),
      date: date,
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
  
    return responseData.data as {
      customerId: string | null;
      reservationId: string | null;
      firstName: string | null;
      lastName: string | null;
      birthDate: string | null;
      email: string | null;
      phoneNumber: string | null;
      gender: string | null;
      age: string | null;
      insurance: boolean | null;
    };
  };