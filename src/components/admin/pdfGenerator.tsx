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
  doc.text(
    `Name: ${data.driverInfo.firstName} ${data.driverInfo.lastName}`,
    15,
    driverInfoY
  );
  doc.text(`Phone number: ${data.driverInfo.phoneNumber}`, 15, driverInfoY + 8);
  doc.text(`Email: ${data.driverInfo.email}`, 15, driverInfoY + 16);
  doc.text(
    `Social Security Number: ${data.driverInfo.socialSecurityNumber}`,
    15,
    driverInfoY + 24
  );
  doc.text(`Address: ${data.driverInfo.address}`, 105, driverInfoY);
  doc.text(
    `Driving License Number: ${data.driverInfo.drivingLicenseNumber}`,
    105,
    driverInfoY + 8
  );

  // Add space between driver information and accident information
  const spaceBetweenSections = 10;
  const accidentInfoY = driverInfoY + 40 + spaceBetweenSections;

  // Calculate the height of the accident description text
  const lineHeight = 6; // Adjust as needed
  const maxDescriptionWidth = 85; // Adjust as needed
  const maxDescriptionLength = 200; // Maximum characters in description
  const actualDescription =
    data.accidentDescription.length > maxDescriptionLength
      ? data.accidentDescription.substring(0, maxDescriptionLength) + "..." // Truncate if longer than max
      : data.accidentDescription;

  const accidentDescriptionLines = doc.splitTextToSize(
    actualDescription,
    maxDescriptionWidth
  );
  const accidentDescriptionHeight =
    accidentDescriptionLines.length * lineHeight;

  // Calculate the maximum height for the accident information box
  const maxAccidentInfoBoxHeight = 83; // Adjust as needed

  // Calculate the actual height of the accident information box
  const accidentInfoBoxHeight = Math.min(
    accidentDescriptionHeight + 60,
    maxAccidentInfoBoxHeight
  );

  // Draw a rectangle for the box with rounded corners around accident information
  doc.setFillColor("#E6EEE5");
  doc.roundedRect(
    10,
    accidentInfoY - 10,
    190,
    accidentInfoBoxHeight,
    5,
    5,
    "F"
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
  doc.text("Date of accident:", accidentInfoLeftX, accidentInfoY + 10);
  doc.text(data.date, accidentInfoRightX, accidentInfoY + 10);

  // Location
  doc.text("Location:", accidentInfoLeftX, accidentInfoY + 18);
  doc.text(data.accidentLocation, accidentInfoRightX, accidentInfoY + 18);

  // Police journal number
  doc.text("Police journal number:", accidentInfoLeftX, accidentInfoY + 26);
  doc.text(
    data.policeReportNumber || "No police report filed",
    accidentInfoRightX,
    accidentInfoY + 26
  );

  // Time of accident
  doc.text("Time of accident:", accidentInfoLeftX, accidentInfoY + 34);
  doc.text(data.time, accidentInfoRightX, accidentInfoY + 34);

  // Accident description
  doc.text("Accident description:", accidentInfoLeftX, accidentInfoY + 42);
  doc.text(accidentDescriptionLines, accidentInfoRightX, accidentInfoY + 42);

  // Damage information

  // Save the PDF
  return doc.output("blob");
};

export default generatePDF;
