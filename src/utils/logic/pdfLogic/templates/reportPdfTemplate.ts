import jsPDF from "jspdf";
import EXIF from "exif-js";
import { AdminDamageReport } from "@/utils/schemas/damageReportSchemas/adminReportSchema";
import { requestAdminDamageReportDownload } from "../../damageReportLogic.ts/apiRoutes";

const addImageToPDF = (pdfDoc: jsPDF) => {
  const imageWidth = 80;
  const imageHeight = 20;
  const imageX = 65;
  const imageY = 10;
  const imageUrl = "../../GreenLogos/GreenMobilityTextLogo.png";

  pdfDoc.addImage(imageUrl, "JPEG", imageX, imageY, imageWidth, imageHeight);

  return pdfDoc;
};

const createReportPDF = async (
  data: AdminDamageReport,
  reportId:string
) => {
  const doc = new jsPDF();

  // Start adding data to the PDF
  doc.setFontSize(12);

  // Call function to add image to the PDF
  addImageToPDF(doc);

  // Additional text above driver information
  doc.setTextColor(0);
  doc.setFont("bold");
  doc.text("Police nummer: 622 903.400", 10, 40);
  doc.setFont("bold");
  doc.text("Forsikringstager", 10, 52);
  doc.setFont("normal");
  doc.text("Navn: Greenmobility A/S", 10, 59);
  doc.text("Adresse: Landgreven 3, 4 sal", 10, 66);
  doc.text("Postnr. og by: 1300, København K", 10, 73);
  doc.text("Cvr. Nr.: 35521585", 10, 80);
  doc.text("Telefonnr.: +45 70778888", 10, 87);
  doc.text("E-mail: damage@greenmobility.com", 10, 94);

  // Draw a rectangle for the box with rounded corners around driver information
  doc.setFillColor("#E6EEE5");
  doc.roundedRect(10, 115, 190, 38, 5, 5, "F");

  // Driver information header
  doc.setTextColor(0);
  doc.setFont("bold");
  doc.text("Renter information", 15, 123);
  doc.setLineWidth(0.5);
  doc.line(15, 125, 80, 125);

  doc.setFont("normal");
  // Driver information data
  doc.setTextColor(0); // Black color for text
  const driverInfoY = 140; // Y-coordinate for driver information

  const name =
    data.driverInfo.firstName && data.driverInfo.lastName
      ? `${data.driverInfo.firstName} ${data.driverInfo.lastName}`
      : `${data.renterInfo.firstName} ${data.renterInfo.lastName}`;

  const phoneNumber = data.driverInfo.phoneNumber
    ? data.driverInfo.phoneNumber
    : "-";

  const email = data.driverInfo.email
    ? data.driverInfo.email
    : "No email has been provided";

  const socialSecurityNumber = data.driverInfo.socialSecurityNumber
    ? data.driverInfo.socialSecurityNumber
    : "-";

  const address = data.driverInfo.address ? data.driverInfo.address : "-";

  const drivingLicenseNumber = data.driverInfo.drivingLicenseNumber
    ? data.driverInfo.drivingLicenseNumber
    : "-";

  const driverRenter = data.driverRenter;

  const validLicense = data.driverInfo.validDriversLicense;

  const renterFullName =
    data.renterInfo.firstName && data.renterInfo.lastName
      ? `${data.renterInfo.firstName} ${data.renterInfo.lastName}`
      : "-";

  const renterMail = data.renterInfo.email ? `${data.renterInfo.email}` : "-";
  const renterBirthday = data.renterInfo.birthDate
    ? `${data.renterInfo.birthDate}`
    : "-";
  doc.text(`Name: ${renterFullName}`, 15, driverInfoY);
  if (driverRenter !== true) {
    doc.text("Driver and renter is not the same", 15, driverInfoY - 8);
  } else {
    doc.text("Driver and renter is  the same", 15, driverInfoY - 8);
  }
  doc.text(`Email: ${renterMail}`, 105, driverInfoY - 8);
  doc.text(`Birthday: ${renterBirthday}`, 105, driverInfoY);

  /*   doc.text(`Phone number: ${data.renterInfo.phoneNumber}`, 15, driverInfoY + 8);
   */ /* doc.text(`Email: ${data.renterInfo.email}`, 15, driverInfoY + 16); */
  const addDriverInfoToPDF = (
    doc: jsPDF,
    startY: number,
    data: AdminDamageReport
  ) => {
    const lineDriverHeight = 8;
    const staticContentHeight = 40;
    const padding = 10;

    const address = data.driverInfo.address ? data.driverInfo.address : "-";
    const maxLocationWidth = 140;

    const addressLines = doc.splitTextToSize(
      `Address: ${address}`,
      maxLocationWidth
    );
    const dynamicContentHeight = addressLines.length * lineDriverHeight;
    const totalBoxHeight = staticContentHeight + dynamicContentHeight + padding;

    const renterInfoY = startY;
    // Draw a rectangle for the box with rounded corners around Renter information
    doc.setFillColor("#E6EEE5");
    doc.roundedRect(10, driverInfoY, 190, totalBoxHeight, 5, 5, "F");

    // driver information header
    doc.setFont("bold");
    doc.text("Driver information", 15, driverInfoY + 16);
    doc.setLineWidth(0.5);
    doc.line(15, driverInfoY + 18, 80, driverInfoY + 18);

    doc.setFont("normal");

    doc.text(`Name: ${name}`, 15, driverInfoY + 24);
    doc.text(`Phone number: ${phoneNumber}`, 15, driverInfoY + 32);
    doc.text(`Email: ${email}`, 15, driverInfoY + 40);
    let yOffset = driverInfoY + 48; // Starting y-coordinate for the address
    for (let line of addressLines) {
      doc.text(line, 15, yOffset);
      yOffset += lineDriverHeight; // Adjust by the height of one line
    }

    doc.text(
      `Social security number: ${socialSecurityNumber}`,
      105,
      driverInfoY + 24
    );
    doc.text(
      `Driving License Number: ${drivingLicenseNumber}`,
      105,
      driverInfoY + 32
    );

    if (validLicense === null) {
      doc.text("Valid drivers license? -", 105, driverInfoY + 40);
    } else if (validLicense === true) {
      doc.text("Valid drivers license? Yes", 105, driverInfoY + 40);
    } else {
      doc.text("Valid drivers license? No", 105, driverInfoY + 40);
    }

    return driverInfoY + 60 + 10; // Return the Y-coordinate after drawing the Renter info + some gap for the next section
  };

  let nextSectionStartY = driverInfoY + 34; // Use the Y-coordinate after the Driver information

  if (driverRenter === false) {
    // If driver and renter are not the same, add the Renter section
    nextSectionStartY = addDriverInfoToPDF(doc, nextSectionStartY, data);
  }

  // Add space between driver information and accident information
  const spaceBetweenSections = 10;
  const accidentInfoY = driverInfoY + 70 + spaceBetweenSections;

  const lineHeight = 6; // Adjust as needed

  // Calculate the height of the accident description text
  const accidentDescriptionMaxWidth = 85; // Adjust as needed
  const accidentDescriptionMaxLines = 15; // Adjust as needed
  const accidentDescriptionLines = doc.splitTextToSize(
    data.accidentDescription || "No accident description has been provided",
    accidentDescriptionMaxWidth
  );
  const numAccidentDescriptionLines = Math.max(
    accidentDescriptionLines.length, // Use the actual number of lines
    1 // Ensure at least one line for the "No description provided" message
  );
  const accidentDescriptionHeight = numAccidentDescriptionLines * lineHeight;

  // Calculate the height of the green box based on the description length
  const accidentInfoBoxTopY = driverInfoY + 70 + spaceBetweenSections - 8; // Adjust Y-coordinate as needed
  const accidentInfoBoxHeight = accidentDescriptionHeight + 64; // Adjust as needed

  doc.setFillColor("#E6EEE5"); // Light gray color for the background
  doc.roundedRect(
    10,
    accidentInfoBoxTopY,
    190,
    accidentInfoBoxHeight,
    5, // Corner radius
    5, // Corner radius
    "F" // "F" fills the rectangle
  );

  // Accident information header
  doc.setFont("bold");
  doc.text("Accident information", 15, accidentInfoY);
  doc.setLineWidth(0.5);
  doc.line(15, accidentInfoY + 2, 80, accidentInfoY + 2);

  // Accident information data
  const accidentInfoLeftX = 15;
  const accidentInfoRightX = 100;

  doc.setFont("normal");
  doc.setTextColor(0);
  // Date of accident
  doc.text("Date of accident:", accidentInfoLeftX, accidentInfoY + 18);
  doc.text(data.date || "-", accidentInfoRightX, accidentInfoY + 18);

  // Location
  doc.text("Location:", accidentInfoLeftX, accidentInfoY + 26);
  doc.text(
    `${data.accidentAddress || "-"}`,
    accidentInfoRightX,
    accidentInfoY + 26
  );

  // Police journal number
  let policeReportText = "No police report filed";
  console.log("IUH  IUHIUHIUHIUHIUHIUHIUHIUHIUHIUHIUHIUHIUHUI", data);
  // Check if police report is filed
  if (data.policeReportExist) {
    // If yes, check whether a report number has been provided
    if (data.policeReportNumber && data.policeReportNumber.trim() !== "") {
      policeReportText = data.policeReportNumber;
    } else {
      policeReportText = "Police report filed, but number is unavailable";
    }
  }

  // Then, you can use `policeReportText` to display the text in your PDF as desired
  doc.text("Police journal number:", accidentInfoLeftX, accidentInfoY + 34);
  doc.text(policeReportText, accidentInfoRightX, accidentInfoY + 34);

  // Time of accident
  doc.text("Time of accident:", accidentInfoLeftX, accidentInfoY + 42);
  doc.text(data.time || "-", accidentInfoRightX, accidentInfoY + 42);

  // Accident description
  doc.text("Accident description:", accidentInfoLeftX, accidentInfoY + 49);
  if (accidentDescriptionLines.length > 0) {
    for (let i = 0; i < numAccidentDescriptionLines; i++) {
      doc.text(
        accidentDescriptionLines[i],
        accidentInfoRightX,
        accidentInfoY + 49 + i * lineHeight
      );
    }
  } else {
    doc.text(
      "No accident description has been provided",
      accidentInfoRightX,
      accidentInfoY + 49
    );
  }
  // Damage information

  // Page break before the damage information section
  doc.addPage();

  const damageLineHeight = 6; // Adjust as needed
  const maxDamageDescriptionLines = 15; // Maximum lines for the damage description

  // Calculate the height of the damage description text
  const damageDescriptionMaxWidth = 90; // Adjust as needed
  const damageDescriptionMaxLines = 15; // Adjust as needed
  const damageDescriptionLines = doc.splitTextToSize(
    data.damageDescription || "",
    damageDescriptionMaxWidth
  );
  const numDamageDescriptionLines = Math.min(
    maxDamageDescriptionLines,
    damageDescriptionLines.length
  );
  const damageDescriptionHeight = numDamageDescriptionLines * damageLineHeight;

  // Calculate the height of the green box based on the description length
  const damageInfoBoxTopY = 12; // Adjust Y-coordinate as needed
  const damageInfoBoxHeight = damageDescriptionHeight + 50; // Adjust as needed

  doc.setFillColor("#E6EEE5"); // Light gray color for the background
  doc.roundedRect(
    10,
    damageInfoBoxTopY,
    190,
    45,
    5, // Corner radius
    5, // Corner radius
    "F" // "F" fills the rectangle
  );

  // Damage information header on the new page
  doc.setFont("bold");
  doc.text("Damage information", 15, 20); // Adjust Y-coordinate as needed
  doc.setLineWidth(0.5);
  doc.line(15, 22, 80, 22); // Adjust Y-coordinate as needed

  doc.setFont("normal");
  doc.setTextColor(0);

  // Green car numberplate
  doc.text("GreenMobility car:", accidentInfoLeftX, 37); // Adjust Y-coordinate as needed
  doc.text(data.greenCarNumberPlate || "-", accidentInfoRightX, 37); // Adjust Y-coordinate as needed

  // Speed
  doc.text("Speed:", accidentInfoLeftX, 45); // Adjust Y-coordinate as needed
  doc.text(`${data.speed || "-"} km/h`, accidentInfoRightX, 45); // Adjust Y-coordinate as needed

  //Others involved

  // Others involved section
  const sectionSpacing = 10; // Adjust this value for the desired spacing

  // Calculate the height of the biker information section
  const bikerInfoHeight =
    data.bikerInfo.length > 0 ? data.bikerInfo.length * 3 + 20 : 0;

  // Calculate the Y-coordinate for the start of the "Biker information" section
  let currentY = damageInfoBoxTopY + damageInfoBoxHeight;

  // Move down for the "Biker information" section
  currentY += sectionSpacing;

  // Check if there's enough space on the current page for biker information
  const spaceForBikerInfo =
    currentY + bikerInfoHeight < doc.internal.pageSize.height;

  // Adjust starting position for the first biker information section
  if (!spaceForBikerInfo) {
    currentY = 10; // Reset Y-coordinate to the top of the page
  }

  // Render biker information
  if (data.bikerInfo && data.bikerInfo.length > 0) {
    // Biker information header
    doc.setFont("bold");
    doc.text("Biker Information", 15, currentY + 10);
    doc.setLineWidth(0.5);
    doc.line(15, currentY + 12, 200, currentY + 12);

    // Render biker details
    data.bikerInfo.forEach((currentBiker, index) => {
      // Calculate the height required for the current biker's information
      const bikerInfoHeight = 30; // Adjust this value as needed

      // Calculate the remaining space on the current page
      const remainingSpace = doc.internal.pageSize.height - currentY;

      // Injuries description
      const maxInjuryDescriptionWidth = 90; // Adjust as needed
      const injuryDescriptionMaxLines = 3; // Maximum lines for the injury description

      // Split the injury description text into lines that fit within the available width
      const injuryDescriptionLines = doc.splitTextToSize(
        currentBiker.personDamage || "No injury description provided",
        maxInjuryDescriptionWidth
      );

      // Calculate the height of the injury description text
      const numInjuryDescriptionLines = Math.min(
        injuryDescriptionMaxLines,
        injuryDescriptionLines.length
      );
      const injuryDescriptionHeight =
        numInjuryDescriptionLines * damageLineHeight;

      // Calculate the total biker section height with additional spacing
      const currentBikerSectionHeight =
        bikerInfoHeight + sectionSpacing + injuryDescriptionHeight + 10;

      // Check if there's enough space for the next biker's information
      if (remainingSpace < currentBikerSectionHeight) {
        doc.addPage(); // Create a new page
        currentY = 10; // Reset Y-coordinate to the top of the new page
      }
      // Draw a green box around the biker information
      doc.setFillColor("#E6EEE5");
      doc.roundedRect(
        10,
        currentY,
        190,
        bikerInfoHeight + sectionSpacing + injuryDescriptionHeight + 10,
        5,
        5,
        "F"
      );

      // Biker information header
      doc.setFont("bold");
      doc.text(
        "Biker Information on other party involved in incident",
        15,
        currentY + 10
      );
      doc.setLineWidth(0.5);
      doc.line(15, currentY + 12, 106, currentY + 12);

      // Render biker details (name, bike type, etc.)
      doc.setFont("normal");
      doc.text(`Name: ${currentBiker.name || "-"}`, 20, currentY + 28);
      doc.text(`Phonenumber: ${currentBiker.phone || "-"}`, 20, currentY + 36);
      doc.text(
        `Email: ${currentBiker.email || "No email has been provided"}`,
        20,
        currentY + 44
      );
      doc.text(
        `Electric bike: ${
          currentBiker.ebike !== null
            ? currentBiker.ebike === true
              ? "Yes"
              : "No"
            : "-"
        }`,
        100,
        currentY + 28
      );
      // Render injury description
      doc.text("Injury description:", 100, currentY + 36);
      for (let i = 0; i < numInjuryDescriptionLines; i++) {
        doc.text(
          injuryDescriptionLines[i],
          100,
          currentY + 44 + i * damageLineHeight
        );
      }

      // Update currentY for the next biker
      currentY +=
        bikerInfoHeight + sectionSpacing + injuryDescriptionHeight + 2;
    });

    // Move down for the next section (vehicle information)
    currentY += sectionSpacing;
  } else {
    // If no biker information
    const bikerInfoHeight = 30 + sectionSpacing + 10; // Adjust the height accordingly
    const remainingSpace = doc.internal.pageSize.height - currentY;

    // Check if there's enough space for the "No biker was hit" message
    if (remainingSpace < bikerInfoHeight) {
      doc.addPage(); // Create a new page
      currentY = 10; // Reset Y-coordinate to the top of the new page
    }

    doc.setFillColor("#E6EEE5");
    doc.roundedRect(10, currentY, 190, bikerInfoHeight, 5, 5, "F");
    doc.setFont("bold");
    doc.text(
      "Biker Information on other party involved in incident",
      15,
      currentY + 10
    );
    doc.setLineWidth(0.5);
    doc.line(15, currentY + 12, 106, currentY + 12);
    doc.setFont("normal");
    doc.text("No biker was hit.", 20, currentY + 28);
    currentY += bikerInfoHeight + 2;
  }

  currentY += sectionSpacing;

  // Render vehicle information
  if (data.vehicleInfo && data.vehicleInfo.length > 0) {
    const vehicleInfoHeight = data.vehicleInfo.length * 3 + 20;

    // Calculate the remaining space on the current page
    const remainingSpace = doc.internal.pageSize.height - currentY;

    // Calculate the total vehicle section height with additional spacing
    const currentVehicleSectionHeight = vehicleInfoHeight + sectionSpacing;

    // Check if there's enough space for the vehicle information section
    if (remainingSpace < currentVehicleSectionHeight) {
      doc.addPage(); // Create a new page
      currentY = 10; // Reset Y-coordinate to the top of the new page
    }

    // Vehicle information header
    doc.setFont("bold");
    doc.text("Vehicle Information", 15, currentY + 10);
    doc.setLineWidth(0.5);
    doc.line(15, currentY + 12, 80, currentY + 12);

    // Render vehicle details
    data.vehicleInfo.forEach((currentVehicle, index) => {
      // Calculate the height required for the current vehicle's information
      const vehicleInfoHeight = 45; // Adjust this value as needed

      // Calculate the remaining space on the current page
      const remainingSpace = doc.internal.pageSize.height - currentY;

      // Check if there's enough space for the next vehicle's information
      if (remainingSpace < vehicleInfoHeight + sectionSpacing) {
        doc.addPage(); // Create a new page
        currentY = 10; // Reset Y-coordinate to the top of the new page
      }

      // Draw a green box around the vehicle information
      doc.setFillColor("#E6EEE5");
      doc.roundedRect(
        10,
        currentY,
        190,
        vehicleInfoHeight + sectionSpacing + 10,
        5,
        5,
        "F"
      );

      // Vehicle information header
      doc.setFont("bold");
      doc.text(
        "Vehicle Information on other party involved in incident",
        15,
        currentY + 10
      );
      doc.setLineWidth(0.5);
      doc.line(15, currentY + 12, 110, currentY + 12);

      // Render vehicle details (name, license number, etc.)
      doc.setFont("normal");
      doc.text(`Name: ${currentVehicle.name || "-"}`, 20, currentY + 28);
      doc.text(
        `Phonenumber: ${currentVehicle.phone || "-"}`,
        20,
        currentY + 36
      );
      doc.text(
        `Email: ${currentVehicle.email || "No email has been provided"}`,
        20,
        currentY + 44
      );
      doc.text(
        `Numberplate: ${currentVehicle.numberplate || "-"}`,
        20,
        currentY + 52
      );
      doc.text(
        `License Number: ${currentVehicle.driversLicenseNumber || "-"}`,
        100,
        currentY + 28
      );
      doc.text(
        `Vehicle model: ${currentVehicle.model || "-"}`,
        100,
        currentY + 36
      );
      doc.text(
        `Insurance: ${currentVehicle.insurance || "-"}`,
        100,
        currentY + 44
      );

      // Update currentY for the next vehicle
      currentY += vehicleInfoHeight + sectionSpacing + 2;
    });
    currentY += sectionSpacing; // Add space after the pedestrian information section
  } else {
    // If no vehicle information
    const vehicleInfoHeight = 30 + sectionSpacing + 10; // Adjust the height accordingly
    const remainingSpace = doc.internal.pageSize.height - currentY;

    // Check if there's enough space for the "No other vehicles involved" message
    if (remainingSpace < vehicleInfoHeight) {
      doc.addPage(); // Create a new page
      currentY = 10; // Reset Y-coordinate to the top of the new page
    }

    doc.setFillColor("#E6EEE5");
    doc.roundedRect(10, currentY, 190, vehicleInfoHeight, 5, 5, "F");
    doc.setFont("bold");
    doc.text(
      "Vehicle Information on other party involved in incident",
      15,
      currentY + 10
    );
    doc.setLineWidth(0.5);
    doc.line(15, currentY + 12, 110, currentY + 12);
    doc.setFont("normal");
    doc.text("No other vehicles involved.", 20, currentY + 28);
    currentY += vehicleInfoHeight + 2;
  }

  // Move down for the next section (pedestrian information)
  currentY += sectionSpacing;

  // Render pedestrian information
  if (data.pedestrianInfo && data.pedestrianInfo.length > 0) {
    const pedestrianInfoHeight = data.pedestrianInfo.length * 3 + 20;

    // Calculate the remaining space on the current page
    const remainingSpace = doc.internal.pageSize.height - currentY;

    // Calculate the total pedestrian section height with additional spacing
    const currentPedestrianSectionHeight =
      pedestrianInfoHeight + sectionSpacing;

    // Check if there's enough space for the pedestrian information section
    if (remainingSpace < currentPedestrianSectionHeight) {
      doc.addPage(); // Create a new page
      currentY = 10; // Reset Y-coordinate to the top of the new page
    }

    // Render pedestrian details
    data.pedestrianInfo.forEach((currentPedestrian, index) => {
      // Calculate the height required for the current pedestrian's information
      const pedestrianInfoHeight = 45; // Adjust this value as needed

      // Calculate the remaining space on the current page
      const remainingSpace = doc.internal.pageSize.height - currentY;

      // Injuries description
      const maxInjuryDescriptionWidth = 90; // Adjust as needed
      const injuryDescriptionMaxLines = 3; // Maximum lines for the injury description

      // Split the injury description text into lines that fit within the available width
      const injuryDescriptionLines = doc.splitTextToSize(
        currentPedestrian.personDamage || "No injury description provided",
        maxInjuryDescriptionWidth
      );

      // Calculate the height of the injury description text
      const numInjuryDescriptionLines = Math.min(
        injuryDescriptionMaxLines,
        injuryDescriptionLines.length
      );
      const injuryDescriptionHeight =
        numInjuryDescriptionLines * damageLineHeight;

      // Calculate the total pedestrian section height with additional spacing
      const currentPedestrianSectionHeight =
        pedestrianInfoHeight + sectionSpacing + injuryDescriptionHeight + 10;

      // Check if there's enough space for the next pedestrian's information
      if (remainingSpace < currentPedestrianSectionHeight) {
        doc.addPage(); // Create a new page
        currentY = 10; // Reset Y-coordinate to the top of the new page
      }

      // Draw a green box around the pedestrian information
      doc.setFillColor("#E6EEE5");
      doc.roundedRect(
        10,
        currentY,
        190,
        pedestrianInfoHeight + injuryDescriptionHeight + 10,
        5,
        5,
        "F"
      );

      // Pedestrian information header
      doc.setFont("bold");
      doc.text(
        "Pedestrian Information on other party involved in incident",
        15,
        currentY + 10
      );
      doc.setLineWidth(0.5);
      doc.line(15, currentY + 12, 114, currentY + 12);

      // Render pedestrian details (name, age, etc.)
      doc.setFont("normal");
      doc.text(`Name: ${currentPedestrian.name || "-"}`, 20, currentY + 28);
      doc.text(
        `Email: ${currentPedestrian.email || "No email has been provided"}`,
        20,
        currentY + 36
      );
      doc.text(
        `Phonenumber: ${currentPedestrian.phone || "-"}`,
        100,
        currentY + 28
      );
      // Render injury description
      doc.text("Injury description:", 100, currentY + 36);
      for (let i = 0; i < numInjuryDescriptionLines; i++) {
        doc.text(
          injuryDescriptionLines[i],
          100,
          currentY + 44 + i * damageLineHeight
        );
      }
      // Update currentY for the next pedestrian
      currentY += pedestrianInfoHeight + injuryDescriptionHeight;
    });
  } else {
    // If no pedestrian information
    const pedestrianInfoHeight = 30 + sectionSpacing + 10; // Adjust the height accordingly
    const remainingSpace = doc.internal.pageSize.height - currentY;

    // Check if there's enough space for the "No pedestrians were harmed" message
    if (remainingSpace < pedestrianInfoHeight) {
      doc.addPage(); // Create a new page
      currentY = 10; // Reset Y-coordinate to the top of the new page
    }

    doc.setFillColor("#E6EEE5");
    doc.roundedRect(10, currentY, 190, pedestrianInfoHeight, 5, 5, "F");
    doc.setFont("bold");
    doc.text(
      "Pedestrian Information on other party involved in incident",
      15,
      currentY + 10
    );
    doc.setLineWidth(0.5);
    doc.line(15, currentY + 12, 114, currentY + 12);
    doc.setFont("normal");
    doc.text("No pedestrians were harmed.", 20, currentY + 28);
    currentY += pedestrianInfoHeight;
  }

  //other object info
  currentY += sectionSpacing + 10;

  // Render other information
  if (data.otherObjectInfo && data.otherObjectInfo.length > 0) {
    const otherInfoHeight = data.otherObjectInfo.length * 30 + 20;

    // Calculate the remaining space on the current page
    const remainingSpace = doc.internal.pageSize.height - currentY;

    // Calculate the total other section height with additional spacing
    const currentOtherSectionHeight = otherInfoHeight + sectionSpacing;

    // Check if there's enough space for the other information section
    if (remainingSpace < currentOtherSectionHeight) {
      doc.addPage(); // Create a new page
      currentY = 10; // Reset Y-coordinate to the top of the new page
    }

    data.otherObjectInfo.forEach((currentOther, index) => {
      // Calculate the height required for the current other's information
      const otherInfoHeight = 30; // Adjust this value as needed

      // Calculate the remaining space on the current page
      const remainingSpace = doc.internal.pageSize.height - currentY;

      // Check if there's enough space for the next other's information
      if (remainingSpace < otherInfoHeight + sectionSpacing) {
        doc.addPage(); // Create a new page
        currentY = 10; // Reset Y-coordinate to the top of the new page
      }

      // Split the description text into lines that fit within the available width
      const maxDescriptionWidth = 80; // Adjust as needed
      const descriptionLines = doc.splitTextToSize(
        currentOther.description || "-",
        maxDescriptionWidth
      );

      // Calculate the height of the description text
      const descriptionMaxLines = 15; // Maximum lines for the description
      const numDescriptionLines = Math.min(
        descriptionMaxLines,
        descriptionLines.length
      );
      const descriptionHeight = numDescriptionLines * damageLineHeight;

      // Split the information text into lines that fit within the available width
      const maxInformationWidth = 80; // Adjust as needed
      const informationLines = doc.splitTextToSize(
        currentOther.information || "-",
        maxInformationWidth
      );

      // Calculate the height of the information text
      const informationMaxLines = 15; // Maximum lines for the information
      const numInformationLines = Math.min(
        informationMaxLines,
        informationLines.length
      );
      const informationHeight = numInformationLines * damageLineHeight;

      // Calculate the total other section height with additional spacing
      const currentOtherSectionHeight =
        otherInfoHeight + sectionSpacing + descriptionHeight;

      // Check if there's enough space for the next other's information
      if (remainingSpace < currentOtherSectionHeight) {
        doc.addPage(); // Create a new page
        currentY = 10; // Reset Y-coordinate to the top of the new page
      }

      // Draw a green box around the other information
      doc.setFillColor("#E6EEE5");
      doc.roundedRect(
        10,
        currentY,
        190,
        currentOtherSectionHeight + 5,
        5,
        5,
        "F"
      );

      // Other information header
      doc.setFont("bold");
      doc.text(
        "Other Information on other party involved in incident",
        15,
        currentY + 10
      );
      doc.setLineWidth(0.5);
      doc.line(15, currentY + 12, 107, currentY + 12);

      // Render description
      doc.setFont("normal");
      doc.text("Description:", 15, currentY + 28);
      for (let i = 0; i < numDescriptionLines; i++) {
        doc.text(descriptionLines[i], 15, currentY + 36 + i * damageLineHeight);
      }

      // Render information
      doc.text("Information:", 100, currentY + 28);
      for (let i = 0; i < numInformationLines; i++) {
        doc.text(
          informationLines[i],
          100,
          currentY + 36 + i * damageLineHeight
        );
      }

      // Update currentY for the next other
      currentY += currentOtherSectionHeight + 2;
    });

    currentY += sectionSpacing; // Add space after the other information section
  } else {
    // If no collision with other objects
    const otherInfoHeight = 30 + sectionSpacing + 10; // Adjust the height accordingly
    const remainingSpace = doc.internal.pageSize.height - currentY;

    // Check if there's enough space for the "No collision with other object" message
    if (remainingSpace < otherInfoHeight) {
      doc.addPage(); // Create a new page
      currentY = 10; // Reset Y-coordinate to the top of the new page
    }

    doc.setFillColor("#E6EEE5");
    doc.roundedRect(10, currentY, 190, otherInfoHeight, 5, 5, "F");
    doc.setFont("bold");
    doc.text(
      "Other Information on other party involved in incident",
      15,
      currentY + 10
    );
    doc.setLineWidth(0.5);
    doc.line(15, currentY + 12, 107, currentY + 12);
    doc.setFont("normal");
    doc.text("No collision with other object.", 20, currentY + 28);
    currentY += otherInfoHeight + 2;
  }

  currentY += sectionSpacing; // Add space after the other information section
  const maxWitnessesPerRow = 2;
  const numRows = Math.ceil(data.witnesses.length / maxWitnessesPerRow);
  const witnessInfoHeight = numRows * 45;
  const currentWitnessSectionHeight = witnessInfoHeight + sectionSpacing;

  // Witnesses information
  if (data.witnesses.length > 0) {
    // Calculate the remaining space on the current page
    const remainingSpace = doc.internal.pageSize.height - currentY;

    // Calculate the total witness section height with additional spacing

    // Check if there's enough space for the witness information section
    if (remainingSpace < currentWitnessSectionHeight) {
      doc.addPage(); // Create a new page
      currentY = 10; // Reset Y-coordinate to the top of the new page
    }

    // Draw a green box around the witness information
    doc.setFillColor("#E6EEE5");
    doc.roundedRect(
      10,
      currentY,
      190,
      currentWitnessSectionHeight, // No adjustment needed here
      5,
      5,
      "F"
    );

    // Witnesses information header
    doc.setFont("bold");
    doc.text("Witnesses Information", 15, currentY + 10);
    doc.setLineWidth(0.5);
    doc.line(15, currentY + 12, 80, currentY + 12);

    let currentColumn = 0;
    let currentRow = 0;

    data.witnesses.forEach((witness, index) => {
      const startX = 20 + currentColumn * 95;
      const startY = currentY + 28 + currentRow * 45; // Adjusted to 45

      // Render witness details (name, phone, email)
      doc.setFont("normal");
      doc.text(`Name: ${witness.name || "-"}`, startX, startY);
      doc.text(`Phone: ${witness.phone || "-"}`, startX, startY + 8);
      doc.text(
        `Email: ${witness.email || "No email has been provided"}`,
        startX,
        startY + 16
      );

      currentColumn++;
      if (currentColumn >= maxWitnessesPerRow) {
        currentColumn = 0;
        currentRow++;
      }
    });

    // Update currentY for the next section
    currentY += currentWitnessSectionHeight + sectionSpacing;
  } else {
    // If no witnesses information
    const noWitnessesHeight = 30 + sectionSpacing + 10;
    const remainingSpace = doc.internal.pageSize.height - currentY;

    // Check if there's enough space for the "No witnesses information" message
    if (remainingSpace < noWitnessesHeight) {
      doc.addPage(); // Create a new page
      currentY = 10; // Reset Y-coordinate to the top of the new page
    }

    // Draw a green box around the "No witnesses information" message
    doc.setFillColor("#E6EEE5");
    doc.roundedRect(10, currentY, 190, noWitnessesHeight, 5, 5, "F");

    doc.setFont("bold");
    doc.text("Witnesses Information", 15, currentY + 10);
    doc.setLineWidth(0.5);
    doc.line(15, currentY + 12, 80, currentY + 12);
    doc.setFont("normal");
    doc.text("No witnesses information.", 20, currentY + 28);
    currentY += noWitnessesHeight + 2;
  }
  currentY += sectionSpacing;

  //images section
  doc.addPage();

  const rotateImage = (imgBase64: string, angle: number): Promise<string> => {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        if (angle === 90 || angle === 270) {
          canvas.width = image.height;
          canvas.height = image.width;
        } else {
          canvas.width = image.width;
          canvas.height = image.height;
        }

        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((angle * Math.PI) / 180);
        ctx.drawImage(image, -image.width / 2, -image.height / 2);

        resolve(canvas.toDataURL("image/jpeg"));
      };
      image.src = imgBase64;
    });
  };

  const getRotationAngle = async (imgBase64: string): Promise<number> => {
    return new Promise((resolve, reject) => {
      const byteString = atob(imgBase64.split(",")[1]);
      const mimeString = imgBase64.split(",")[0].split(":")[1].split(";")[0];
      const buffer = new ArrayBuffer(byteString.length);
      const data = new Uint8Array(buffer);
      for (let i = 0; i < byteString.length; i++) {
        data[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([buffer], { type: mimeString });
      const objectURL = URL.createObjectURL(blob);
      const img = new Image();
      img.src = objectURL;
      img.onerror = reject;
      img.onload = () => {
        (EXIF.getData as any)(img, function (this: any) {
          const orientation = EXIF.getTag(this, "Orientation");
          let angle = 0;
          switch (orientation) {
            case 1:
              angle = 0;
              break;
            case 3:
              angle = 180;
              break;
            case 6:
              angle = 0;
              break;
            case 8:
              angle = 270;
              break;
            default:
              angle = 0;
          }
          resolve(angle);
        });
      };
    });
  };

  const getCorrectlyOrientedImage = async (
    imgBase64: string
  ): Promise<string> => {
    const angle = await getRotationAngle(imgBase64);
    return rotateImage(imgBase64, angle);
  };

  // Function to add header for image sections
  const addImageSectionHeader = (text: string) => {
    doc.setFont("bold");
    doc.text(text, 15, currentY + 10);
    doc.setLineWidth(0.5);
    doc.line(15, currentY + 12, 80, currentY + 12); // Add underline
    doc.setFont("normal");
    currentY += headerHeight; // Add space for header
  };
  const addImageWithSpacingCheck = async (
    imageBase64: string,
    format: string,
    x: number,
    currentY: number,
    width: number,
    height: number
  ): Promise<number> => {
    // Check if there's enough space on the page
    const margin = 10;
    const requiredSpace = height + margin;
    const remainingSpace = doc.internal.pageSize.height - currentY;

    // If the image doesn't fit vertically, add a new page
    if (remainingSpace < requiredSpace) {
      doc.addPage();
      currentY = 10; // Reset y-coordinate to the top of the new page
    }

    // Add the image with the adjusted x-coordinate and the angle
    doc.addImage(
      imageBase64,
      format,
      x,
      currentY,
      width,
      height,
      undefined,
      undefined
    );

    currentY += height; // Adjust currentY for the height of the image
    currentY += margin; // Add some margin after the image for spacing

    return currentY; // Return updated currentY after adding image
  };

  // Images of damages to GreenMobility section
  const maxImageHeight = 200; // max height you're willing to allow an image to be
  const headerHeight = 20;
  currentY = 10;

  //get otherPartyImages
  const otherPartyImages = await 

  // For OtherParty images
  if (images["OtherParty"]) {
    addImageSectionHeader("OtherParty Damage Images");

    if (Array.isArray(images["OtherParty"])) {
      for (const imageBase64 of images["OtherParty"]) {
        const correctedImageBase64 = await getCorrectlyOrientedImage(
          imageBase64
        );

        currentY = await addImageWithSpacingCheck(
          correctedImageBase64,
          "JPEG",
          15,
          currentY,
          100,
          100
        );
      }
    }
  }

  doc.addPage();
  currentY = 10;

  //get map
  const map = await requestAdminDamageReportDownload(reportId, 'Admin/map')

  if (map) {
    addImageSectionHeader("Map Images");

    doc.addImage(
      map.fileBase64,
      "png",
      15,
      currentY,
      100, // FIX
      100 // FIX
    );
    currentY += 105; // FIX;
    doc.text(`lat: ${data.accidentLocation.lat || "-"}`, 15, currentY);
    currentY += 4;
    doc.text(`lng: ${data.accidentLocation.lng || "-"}`, 15, currentY);
    currentY += 4; // Adjust as needed.
  } else {
    addImageSectionHeader("Map Images");
    doc.text("No map images available.", 15, currentY);
    currentY += headerHeight;
  }
  currentY += 20; // Damage information for each damage in the array

  const damagePositionLineHeight = 6; // Adjust as needed
  const maxDamagePositionDescriptionLines = 15; // Maximum lines for the damage description
  const damagePositionDescriptionMaxWidth = 90; // Adjust as needed
  const pageHeight = 297; // A4 page height in mm
  const bottomMargin = 20; // Minimum space you want to leave at the bottom of each page

  // Calculate required space for a damage entry
  function calculateDamageSpaceRequired(
    damageDescriptionHeight: number
  ): number {
    return 70 + damageDescriptionHeight; // Include headers, footers, and some buffer
  }
  if (data.damages) {
    for (const damage of data.damages) {
      const damagePositionDescriptionLines = doc.splitTextToSize(
        damage.description || "No damage description has been provided",
        damagePositionDescriptionMaxWidth
      );
      const numDamagePositionDescriptionLines = Math.min(
        maxDamagePositionDescriptionLines,
        damagePositionDescriptionLines.length
      );
      const damagePositionDescriptionHeight =
        numDamagePositionDescriptionLines * damagePositionLineHeight;

      if (
        currentY +
          calculateDamageSpaceRequired(damagePositionDescriptionHeight) >
        pageHeight - bottomMargin
      ) {
        doc.addPage();
        currentY = 10;
      }
      // Calculate the height of the green box based on the description length
      const damagePositionInfoBoxHeight = damagePositionDescriptionHeight + 50; // Additional space for other data
      // Green box for the damage entry
      doc.setFillColor("#E6EEE5");
      doc.roundedRect(
        10,
        currentY - damagePositionDescriptionHeight, // Adjusted to start above
        190,
        damagePositionInfoBoxHeight + 55,
        5, // Corner radius
        5, // Corner radius
        "F"
      );
      const position = damage.position;
      // Damage information header
      doc.setFont("bold");
      doc.text(
        `Damage to ${position?.toLowerCase()} of GreenMobility car`,
        15,
        currentY + 10
      ); // Use currentY
      doc.setLineWidth(0.5);
      doc.line(15, currentY + 12, 105, currentY + 12); // Use currentY

      doc.setFont("normal");

      // Damage description
      doc.text("Damage description:", 15, currentY + 22); // Use currentY
      for (let i = 0; i < numDamagePositionDescriptionLines; i++) {
        doc.text(
          damagePositionDescriptionLines[i],
          85, // Starting at the left edge
          currentY + 22 + i * damagePositionLineHeight // Use currentY
        );
      }

      // Images
      doc.text("Images:", 15, currentY + 30);

      const imageUrl = damage.images[0];
      const imagesBase64 = await requestDamageReportFolderDownload(reportId, `/GreenDamage/${position}/`);
      currentY += 40; // Update as per actual space needed
      const imageHeight = 55; // Example height

      //TODO: FIIIIIIIXXXXX ----------------------------------------------
/*       const correctedImageBase64 = await getCorrectlyOrientedImage(imagesBase64);
      doc.addImage(
        correctedImageBase64,
        "png",
        15,
        currentY,
        55, // FIX
        imageHeight
      ); */
      currentY += imageHeight + 20; // Add some padding
    }
  }
  const pdfBlob = doc.output("blob");
  return pdfBlob;
};

export default createReportPDF;
