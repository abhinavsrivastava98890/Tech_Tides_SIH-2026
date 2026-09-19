// PDF Export Helper with Branding
export const addBrandHeaderToPDF = (doc, t = (s) => s) => {
  // Add Logo Graphic (Simple blue water drop / circle placeholder for now)
  doc.setFillColor(14, 165, 233); // sky-500
  doc.circle(18, 19, 4, 'F'); // Top curve of drop
  
  // Header - Left Side (Brand)
  doc.setTextColor(13, 148, 136); // teal-600
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("JalRakshak", 26, 22);
  
  // Header - Right Side (Client/Government)
  doc.setTextColor(71, 85, 105); // slate-600
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Government of Jharkhand", 196, 17, null, null, "right");
  doc.setFont("helvetica", "normal");
  doc.text("Dept. of Drinking Water & Sanitation", 196, 23, null, null, "right");
  
  // Horizontal Line
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.5);
  doc.line(14, 30, 196, 30);
};
