import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { NextResponse } from "next/server";

import { getCourseDetails } from "@/queries/courses";
import { getAReport } from "@/queries/reports";
import { formatMyDate } from "@/lib/date";
import { getLoggedInUser } from "@/lib/getLoggedInUser";

export async function GET(request) {
  try {
    /* -----------------
     *
     * Configurations
     *
     *-------------------*/
    const searchParams = request.nextUrl.searchParams;
    const courseId = searchParams.get("courseId");

    const course = await getCourseDetails(courseId);
    const loggedInUser = await getLoggedInUser();
    const report = await getAReport({ course: courseId, student: loggedInUser.id });

    const completionDate = report?.completion_date ? formatMyDate(report?.completion_date) : formatMyDate(Date.now());

    const completionInfo = {
      name: `${loggedInUser?.firstName} ${loggedInUser?.lastName}`,
      completionDate: completionDate,
      courseName: course.title,
      instructor: `${course?.instructor?.firstName} ${course?.instructor?.lastName}`,
      instructorDesignation: `${course?.instructor?.designation}`,
      sign: "/sign.png",
    };

    console.log(completionInfo);

    /* -----------------
     *
     * Load Custom Fonts
     *
     *-------------------*/
    // const fontUrls = {
    //   kalam: `${process.env.NEXT_PUBLIC_BASE_URL}/fonts/kalam/Kalam-Regular.ttf`,
    //   montserratItalic: `${process.env.NEXT_PUBLIC_BASE_URL}/fonts/montserrat/Montserrat-Italic.ttf`,
    //   montserrat: `${process.env.NEXT_PUBLIC_BASE_URL}/fonts/montserrat/Montserrat-Medium.ttf`,
    // };

    // const fontResponses = await Promise.all([
    //   fetch(fontUrls.kalam),
    //   fetch(fontUrls.montserratItalic),
    //   fetch(fontUrls.montserrat),
    // ]);

    // const fontBytes = await Promise.all(fontResponses.map((res) => res.arrayBuffer()));

    /* -----------------
     *
     * Generate PDF
     *
     *-------------------*/
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    // const [kalamFont, montserratItalicFont, montserratFont] = await Promise.all([
    //   pdfDoc.embedFont(fontBytes[0]),
    //   pdfDoc.embedFont(fontBytes[1]),
    //   pdfDoc.embedFont(fontBytes[2]),
    // ]);

    const page = pdfDoc.addPage([841.89, 595.28]);
    const { width, height } = page.getSize();
    // const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

    /* -----------------
     *
     * Draw Title
     *
     *-------------------*/
    const titleText = "Certificate Of Completion";
    const titleFontSize = 30;
    // const titleTextWidth = montserratFont.widthOfTextAtSize(titleText, titleFontSize);

    page.drawText(titleText, {
      x: width / 2 ,
      y: height - 100,
      size: titleFontSize,
      // font: montserratFont,
      color: rgb(0, 0.53, 0.71),
    });

    /* -----------------
     *
     * Draw Name
     *
     *-------------------*/
    const nameText = completionInfo.name;
    const nameFontSize = 40;
    // const nameTextWidth = kalamFont.widthOfTextAtSize(nameText, nameFontSize);

    page.drawText(nameText, {
      x: width / 2,
      y: height - 180,
      size: nameFontSize,
      // font: kalamFont,
      color: rgb(0, 0, 0),
    });

    /* -----------------
     *
     * Save PDF and Return Response
     *
     *-------------------*/
    const pdfBytes = await pdfDoc.save();
    return new NextResponse(pdfBytes, {
      headers: { "Content-Type": "application/pdf" },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return new NextResponse("Failed to generate PDF", { status: 500 });
  }
}
