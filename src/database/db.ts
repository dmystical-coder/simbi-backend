import { PrismaClient } from "../prisma/generated/prisma";
import Config from "../config/settings";

// Determine which database URL to use based on environment
const databaseUrl = Config.ENVIRONMENT === "production" 
	? Config.DATABASE_URL 
	: Config.DATABASE_URL_TEST;

// Set the DATABASE_URL environment variable for Prisma
if (databaseUrl) {
	process.env.DATABASE_URL = databaseUrl;
}

const prisma = new PrismaClient();


//function to connect
export async function connectToDB(){
    try{
        const connection = await prisma.$connect();
        console.log("Database Successfully connected");
    }catch(err){
        console.error("Failed to connect to database");
        process.exit(1);
    }
}

export default prisma;