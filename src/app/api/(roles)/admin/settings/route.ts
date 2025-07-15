import { NextRequest, NextResponse } from "next/server";
import Settings from "@/models/Settings";

// POST: Create new settings
// export async function GET(req: NextRequest) {
//   try {
//     // const data = await req.json();
//     const settings = await Settings.create({ siteName: "Kuponna" });
//     return NextResponse.json(settings, { status: 201 });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 400 });
//   }
// }

// PUT: Update settings (by id in body or query)
export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const { ...payableData } = data;

    const settings = await Settings.findAll();
    const setting = settings[0];
    if (!setting) {
      return NextResponse.json(
        { error: "Settings not found" },
        { status: 404 }
      );
    }

    // Merge all JSON fields (options, socialLinks, etc.)
    const jsonFields = ["options", "socialLinks"];
    for (const field of jsonFields) {
      if (payableData[field]) {
        const prev = (setting as any)[field] || {};
        payableData[field] = {
          ...prev,
          ...payableData[field],
        };
      }
    }

    const [updated] = await Settings.update(payableData, {
      where: { id: setting?.id },
    });
    if (!updated) {
      return NextResponse.json(
        { error: "Settings not found" },
        { status: 404 }
      );
    }

    const updatedSettings = await Settings.findByPk(setting?.id);
    return NextResponse.json(updatedSettings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
