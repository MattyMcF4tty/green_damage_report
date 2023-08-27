import jsPDF from "jspdf";
import { reportDataType } from "@/utils/utils";
import { getImages } from "@/firebase/clientApp";

const addImageToPDF = async (pdfDoc: jsPDF) => {
  // Add image at the top
  const imageWidth = 80; // Adjust the width of the image as needed
  const imageHeight = 20; // Adjust the height of the image as needed
  const imageX = 65; // X-coordinate of the image (centered)
  const imageY = 10; // Y-coordinate of the image
  const imageUrl = "../GreenLogos/GreenMobilityTextLogo.png"; // Replace with the actual image URL

  pdfDoc.addImage(imageUrl, "JPEG", imageX, imageY, imageWidth, imageHeight);

  return pdfDoc;
};

const generatePDF = async (data: reportDataType) => {
  const doc = new jsPDF();

  // Start adding data to the PDF
  doc.setFontSize(12);

  // Call function to add image to the PDF
  await addImageToPDF(doc);

  // Additional text above driver information
  doc.setTextColor(0);
  doc.setFont("normal");
  doc.text("Police nummer: 622 903.400", 10, 40);
  doc.text("Forsikringstager:", 10, 47);
  doc.text("Navn: Greenmobility A/S", 10, 54);
  doc.text("Adresse: Landgreven 3, 4 sal", 10, 61);
  doc.text("Postnr. og by: 1300, København K", 10, 68);
  doc.text("Cvr. Nr.: 35521585", 10, 75);
  doc.text("Telefonnr.: +45 70778888", 10, 82);
  doc.text("E-mail: damage@greenmobility.com", 10, 89);

  // Draw a rectangle for the box with rounded corners around driver information
  doc.setFillColor("#E6EEE5");
  doc.roundedRect(10, 115, 190, 60, 5, 5, "F");

  // Driver information header
  doc.setTextColor(0);
  doc.setFont("bold");
  doc.text("Driver information", 15, 123);
  doc.setLineWidth(0.5);
  doc.line(15, 125, 75, 125);

  doc.setFont("normal");
  // Driver information data
  doc.setTextColor(0); // Black color for text
  const driverInfoY = 140; // Y-coordinate for driver information

  const name =
    data.driverInfo.firstName && data.driverInfo.lastName
      ? `${data.driverInfo.firstName} ${data.driverInfo.lastName}`
      : "-";

  const phoneNumber = data.driverInfo.phoneNumber
    ? data.driverInfo.phoneNumber
    : "-";

  const email = data.driverInfo.email
    ? data.driverInfo.email
    : "No email provided";

  const socialSecurityNumber = data.driverInfo.socialSecurityNumber
    ? data.driverInfo.socialSecurityNumber
    : "-";

  const address = data.driverInfo.address ? data.driverInfo.address : "-";

  const drivingLicenseNumber = data.driverInfo.drivingLicenseNumber
    ? data.driverInfo.drivingLicenseNumber
    : "-";

  doc.text(`Name: ${name}`, 15, driverInfoY);
  doc.text(`Phone number: ${phoneNumber}`, 15, driverInfoY + 8);
  doc.text(`Email: ${email}`, 15, driverInfoY + 16);
  doc.text(
    `Social Security Number: ${socialSecurityNumber}`,
    15,
    driverInfoY + 24
  );
  doc.text(`Address: ${address}`, 105, driverInfoY);
  doc.text(
    `Driving License Number: ${drivingLicenseNumber}`,
    105,
    driverInfoY + 8
  );
  // Add space between driver information and accident information
  const spaceBetweenSections = 10;
  const accidentInfoY = driverInfoY + 40 + spaceBetweenSections;

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
  const accidentInfoBoxTopY = driverInfoY + 40 + spaceBetweenSections - 8; // Adjust Y-coordinate as needed
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
  doc.line(15, accidentInfoY + 2, 90, accidentInfoY + 2);

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
    data.accidentLocation || "-",
    accidentInfoRightX,
    accidentInfoY + 26
  );

  // Police journal number
  doc.text("Police journal number:", accidentInfoLeftX, accidentInfoY + 34);
  doc.text(
    data.policeReportNumber || "No police report filed",
    accidentInfoRightX,
    accidentInfoY + 34
  );

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
    data.damageDescription || "No damage description has been provided",
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
    damageInfoBoxHeight,
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
  doc.text("Green car numberplate:", accidentInfoLeftX, 37); // Adjust Y-coordinate as needed
  doc.text(data.greenCarNumberPlate || "-", accidentInfoRightX, 37); // Adjust Y-coordinate as needed

  // Speed
  doc.text("Speed:", accidentInfoLeftX, 45); // Adjust Y-coordinate as needed
  doc.text(`${data.speed || "-"} km/h`, accidentInfoRightX, 45); // Adjust Y-coordinate as needed

  // Damage description
  const damageDescriptionTopY = 32; // Adjust Y-coordinate as needed
  doc.text(
    "Damage description:",
    accidentInfoLeftX,
    damageDescriptionTopY + 21
  );
  for (let i = 0; i < numDamageDescriptionLines; i++) {
    doc.text(
      damageDescriptionLines[i],
      accidentInfoLeftX + 85,
      damageDescriptionTopY + 21 + i * damageLineHeight
    );
  }

  //Other involved

  // Other involved information header
  doc.setFont("bold");
  doc.text("Other involved in crash", 15, 137); // Adjust Y-coordinate as needed
  doc.setLineWidth(0.5);
  doc.line(15, 139, 80, 139); // Adjust Y-coordinate and width as needed

  // Calculate the height of the "Others involved in crash" section
  let othersInvolvedSectionHeight = 115; // Default height
  const hasDamageDescription =
    data.damageDescription && data.damageDescription.length > 0;
  if (hasDamageDescription) {
    // Adjust section height if damage description is present
    othersInvolvedSectionHeight = 160;
  }

  // Calculate the Y-coordinate of the "Others involved" section
  const othersInvolvedBoxTopY = damageInfoBoxTopY + damageInfoBoxHeight + 10;

  // Others involved information box
  doc.setFillColor("#E6EEE5"); // Light gray color for the background
  doc.roundedRect(
    10,
    othersInvolvedBoxTopY,
    190,
    othersInvolvedSectionHeight,
    5, // Corner radius
    5, // Corner radius
    "F" // "F" fills the rectangle
  );

  // Others involved information header
  doc.setFont("bold");
  doc.text("Others involved in crash", 15, othersInvolvedBoxTopY + 8); // Adjust Y-coordinate as needed
  doc.setLineWidth(0.5);
  doc.line(15, othersInvolvedBoxTopY + 10, 80, othersInvolvedBoxTopY + 10); // Adjust Y-coordinate and width as needed

  // Bike information
  doc.setFont("normal");
  doc.setTextColor(0);
  doc.text("Biker information:", 15, othersInvolvedBoxTopY + 25);
  if (data.bikerInfo.name !== "") {
    doc.text(`Name: ${data.bikerInfo.name}`, 20, othersInvolvedBoxTopY + 33);
    doc.text(
      `Electric bike: ${data.bikerInfo.ebike ? "Yes" : "No"}`,
      20,
      othersInvolvedBoxTopY + 41
    );
    doc.text(`Phone: ${data.bikerInfo.phone}`, 20, othersInvolvedBoxTopY + 49);
    doc.text(`Email: ${data.bikerInfo.email}`, 20, othersInvolvedBoxTopY + 57);
    // Split injuries text into multiple lines
    doc.text("Injurie description:", 100, othersInvolvedBoxTopY + 33);
    const maxInjuriesLineLength = 80; // Adjust as needed
    const injuriesLines = doc.splitTextToSize(
      data.bikerInfo.personDamage || "No injuries",
      maxInjuriesLineLength
    );
    const injuriesTextY = othersInvolvedBoxTopY + 40;
    for (let i = 0; i < injuriesLines.length; i++) {
      doc.text(injuriesLines[i], 100, injuriesTextY + i * 8); // Adjust the Y-coordinate as needed
    }
  } else {
    doc.text("No biker was hit", 20, othersInvolvedBoxTopY + 33);
  }
  // Other vehicle information
  doc.setFont("normal");
  doc.setTextColor(0);
  doc.text("Other vehicle information:", 15, othersInvolvedBoxTopY + 90);
  if (data.vehicleInfo.name !== "") {
    doc.text(`Name: ${data.vehicleInfo.name}`, 20, othersInvolvedBoxTopY + 98);

    // Driver license number
    doc.text(
      `Driver license number: ${data.vehicleInfo.driversLicenseNumber}`,
      20,
      othersInvolvedBoxTopY + 106
    );

    // Phone number
    doc.text(
      `Phone number: ${data.vehicleInfo.phone}`,
      20,
      othersInvolvedBoxTopY + 114
    );

    // Email
    doc.text(
      `Email: ${data.vehicleInfo.email}`,
      20,
      othersInvolvedBoxTopY + 122
    );

    // Numberplate
    doc.text(
      `Numberplate: ${data.vehicleInfo.numberplate}`,
      20,
      othersInvolvedBoxTopY + 130
    );

    // Insurance
    doc.text(
      `Insurance: ${data.vehicleInfo.insurance}`,
      20,
      othersInvolvedBoxTopY + 138
    );

    // Vehicle model
    doc.text(
      `Vehicle model: ${data.vehicleInfo.model}`,
      20,
      othersInvolvedBoxTopY + 146
    );
  } else {
    doc.text("No other vehicles involved", 20, othersInvolvedBoxTopY + 98);
  }

  doc.addPage();

  // Pedestrian information
  doc.text("Pedestrian information:", 15, othersInvolvedBoxTopY + 160);
  if (data.pedestrianInfo.name !== "") {
    doc.text(
      `Name: ${data.pedestrianInfo.name}`,
      20,
      othersInvolvedBoxTopY + 168
    );
    // ... (pedestrian information)
  } else {
    doc.text("No pedestrian was harmed", 20, othersInvolvedBoxTopY + 168);
  }

  // Other object information
  doc.text("Other object information:", 15, othersInvolvedBoxTopY + 220);
  if (data.otherObjectInfo.description !== "") {
    doc.text(
      `Description: ${data.otherObjectInfo.description}`,
      20,
      othersInvolvedBoxTopY + 228
    );
    // ... (other object information)
  } else {
    doc.text("No collision with other object", 20, othersInvolvedBoxTopY + 228);
  }

  // Save the PDF
  return doc.output("blob");
};

export default generatePDF;
