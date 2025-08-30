import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";


interface QueryResult {
  insertId: number;
  affectedRows: number;
}

interface School {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  contact: string;
  email_id: string;
  image: string | null;
}
type MySQLResult = [QueryResult, unknown[]];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const address = formData.get("address") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;
    const contact = formData.get("contact") as string;
    const email_id = formData.get("email_id") as string;

    let imageUrl: string | null = null;
    const imageFile = formData.get("image") as File | null;

    if (imageFile && imageFile.size > 0) {
      const uploadsDir = path.join(process.cwd(), "public/uploads");
      try {
        await mkdir(uploadsDir, { recursive: true });
      } catch (error) {
        console.log(error)
      }
      const timestamp = Date.now();
      const originalName = imageFile.name;
      const extension = path.extname(originalName);
      const fileName = `${timestamp}-${path.basename(originalName, extension)}${extension}`;
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const filePath = path.join(uploadsDir, fileName);
      await writeFile(filePath, buffer);
      
      imageUrl = `/uploads/${fileName}`;
    }
    const [result] = await db.query(
      `INSERT INTO schools (name, address, city, state, contact, email_id, image) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, address, city, state, contact, email_id, imageUrl]
    ) as MySQLResult;

    return NextResponse.json({ 
      success: true, 
      id: result.insertId,
      imageUrl: imageUrl 
    });
  } catch (error) {
    console.error("Error adding school:", error);
    return NextResponse.json(
      { error: "Failed to add school" }, 
      { status: 500 }
    );
  }
}
type MySQLSelectResult = [School[], unknown[]];

export async function GET() {
  try {
    const [schools] = await db.query(
      `SELECT id, name, address, city, state, contact, email_id, image FROM schools ORDER BY name ASC`
    ) as MySQLSelectResult;

    return NextResponse.json({ 
      success: true, 
      schools: schools,
      count: schools.length 
    });
  } catch (error) {
    console.error("Error fetching schools:", error);
    return NextResponse.json(
      { error: "Failed to fetch schools" }, 
      { status: 500 }
    );
  }
}