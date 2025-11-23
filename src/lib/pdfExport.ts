import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Routine {
  name: string;
  sets?: number;
  reps?: number;
  duration?: string;
  description?: string;
  exercises?: string[];
}

interface ExerciseDay {
  day: string;
  routines: Routine[];
}

interface Meal {
  name: string;
  foods: string[];
}

interface WorkoutPlan {
  schedule: string[];
  exercises: ExerciseDay[];
}

interface DietPlan {
  dailyCalories: number;
  meals: Meal[];
}

interface FitnessPlan {
  name: string;
  workoutPlan: WorkoutPlan;
  dietPlan: DietPlan;
  isActive: boolean;
}

export const exportToPDF = (plan: FitnessPlan, userName?: string) => {
  const doc = new jsPDF();
  
  // Colors - Professional, readable theme
  const primaryColor: [number, number, number] = [41, 98, 255]; // Professional Blue
  const secondaryColor: [number, number, number] = [16, 185, 129]; // Green
  const darkText: [number, number, number] = [31, 41, 55]; // Dark Gray
  const lightText: [number, number, number] = [75, 85, 99]; // Medium Gray
  const accentGray: [number, number, number] = [229, 231, 235]; // Light Gray

  let yPos = 20;

  // Title Section with professional styling
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 35, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("FITNESS PLAN", 105, 15, { align: "center" });
  
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text(plan.name, 105, 25, { align: "center" });

  yPos = 45;

  // User info and status
  doc.setTextColor(...darkText);
  doc.setFontSize(10);
  if (userName) {
    doc.text(`Generated for: ${userName}`, 20, yPos);
  }
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 150, yPos);
  
  if (plan.isActive) {
    doc.setFillColor(...secondaryColor);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.rect(20, yPos + 3, 22, 5, 'F');
    doc.text("ACTIVE", 31, yPos + 6.5, { align: "center" });
  }

  yPos += 15;

  // Decorative line
  doc.setDrawColor(...accentGray);
  doc.setLineWidth(0.5);
  doc.line(20, yPos, 190, yPos);
  yPos += 10;

  // ============= WORKOUT PLAN SECTION =============
  doc.setFillColor(...primaryColor);
  doc.rect(20, yPos - 5, 170, 10, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("WORKOUT PLAN", 25, yPos + 2);
  
  yPos += 12;

  // Schedule
  doc.setTextColor(...darkText);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Weekly Schedule:", 20, yPos);
  yPos += 5;
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...lightText);
  doc.text(plan.workoutPlan.schedule.join(" • "), 20, yPos);
  yPos += 10;

  // Exercise Days
  plan.workoutPlan.exercises.forEach((exerciseDay) => {
    // Check if we need a new page
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    // Day header
    doc.setFillColor(...accentGray);
    doc.rect(20, yPos - 5, 170, 8, 'F');
    
    doc.setTextColor(...darkText);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`${exerciseDay.day} (${exerciseDay.routines.length} exercises)`, 25, yPos);
    
    yPos += 8;

    // Exercise table
    const exerciseData = exerciseDay.routines.map((routine) => [
      routine.name,
      routine.sets?.toString() || "-",
      routine.reps?.toString() || "-",
      routine.description || "-"
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [["Exercise", "Sets", "Reps", "Description"]],
      body: exerciseData,
      theme: "striped",
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9,
      },
      bodyStyles: {
        textColor: darkText,
        fontSize: 8,
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      columnStyles: {
        0: { cellWidth: 45 },
        1: { cellWidth: 20, halign: "center" },
        2: { cellWidth: 20, halign: "center" },
        3: { cellWidth: 85 },
      },
      margin: { left: 20, right: 20 },
    });

    yPos = (doc as any).lastAutoTable.finalY + 8;
  });

  // ============= DIET PLAN SECTION =============
  // Check if we need a new page
  if (yPos > 220) {
    doc.addPage();
    yPos = 20;
  }

  yPos += 5;

  doc.setFillColor(...primaryColor);
  doc.rect(20, yPos - 5, 170, 10, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("DIET PLAN", 25, yPos + 2);
  
  yPos += 12;

  // Daily Calories - Featured box
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(1);
  doc.setFillColor(239, 246, 255);
  doc.rect(20, yPos, 170, 12, 'FD');
  
  doc.setTextColor(...darkText);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Daily Calorie Target:", 25, yPos + 5);
  
  doc.setTextColor(...primaryColor);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(`${plan.dietPlan.dailyCalories} KCAL`, 160, yPos + 8, { align: "right" });
  
  yPos += 18;

  // Meals
  plan.dietPlan.meals.forEach((meal) => {
    // Check if we need a new page
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }

    // Meal header
    doc.setFillColor(...accentGray);
    doc.rect(20, yPos - 5, 170, 8, 'F');
    
    doc.setTextColor(...darkText);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`${meal.name} (${meal.foods.length} items)`, 25, yPos);
    
    yPos += 8;

    // Food items with bullets
    doc.setTextColor(...lightText);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    
    meal.foods.forEach((food) => {
      if (yPos > 280) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setTextColor(...primaryColor);
      doc.text("•", 25, yPos);
      doc.setTextColor(...lightText);
      
      // Wrap long text
      const splitFood = doc.splitTextToSize(food, 160);
      doc.text(splitFood, 32, yPos);
      yPos += splitFood.length * 5;
    });

    yPos += 5;
  });

  // Footer with branding
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    
    // Bottom decorative line
    doc.setDrawColor(...accentGray);
    doc.setLineWidth(0.5);
    doc.line(20, 285, 190, 285);
    
    doc.setTextColor(...lightText);
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text("Generated by PulseMind AI", 105, 290, { align: "center" });
    doc.text(`Page ${i} of ${totalPages}`, 190, 290, { align: "right" });
  }

  // Save the PDF
  const fileName = `${plan.name.replace(/\s+/g, "_")}_Fitness_Plan.pdf`;
  doc.save(fileName);
};
