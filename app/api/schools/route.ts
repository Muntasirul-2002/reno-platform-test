
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { put } from '@vercel/blob';

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
type MySQLSelectResult = [School[], unknown[]];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const address = formData.get("address") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;
    const contact = formData.get("contact") as string;
    const email_id = formData.get("email_id") as string;

  
    if (!name || !city || !state) {
      return NextResponse.json(
        { error: "Name, city, and state are required" },
        { status: 400 }
      );
    }

    let imageUrl: string | null = null;
    const imageFile = formData.get("image") as File | null;

    if (imageFile && imageFile.size > 0) {
      try {
        const timestamp = Date.now();
        const extension = imageFile.name.split('.').pop();
        const fileName = `schools/${timestamp}-${name.replace(/\s+/g, '-').toLowerCase()}.${extension}`;
        
        const blob = await put(fileName, imageFile, {
          access: 'public',
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });
        
        imageUrl = blob.url;
      } catch (uploadError) {
        console.error("Image upload failed:", uploadError);
        return NextResponse.json(
          { error: "Failed to upload image" },
          { status: 500 }
        );
      }
    }


    const [result] = await db.query(
      `INSERT INTO schools (name, address, city, state, contact, email_id, image) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, address, city, state, contact, email_id, imageUrl]
    ) as MySQLResult;

    return NextResponse.json({ 
      success: true, 
      id: result.insertId,
      imageUrl: imageUrl,
      message: "School added successfully"
    });

  } catch (error) {
    console.error("Error adding school:", error);
    return NextResponse.json(
      { error: "Failed to add school. Please try again." }, 
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const [schools] = await db.query(
      `SELECT id, name, address, city, state, contact, email_id, image 
       FROM schools 
       ORDER BY name ASC`
    ) as MySQLSelectResult;

    console.log('Fetched schools:', schools.length);
    schools.forEach(school => {
      if (school.image) {
        console.log(`School ${school.name} has image: ${school.image}`);
      }
    });

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