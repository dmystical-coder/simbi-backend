import { PrismaClient } from "../prisma/generated/prisma";
import Config from "../config/settings";

const prisma = new PrismaClient({
	datasources: {
		db: {
			url:
				Config.ENVIRONMENT === "production"
					? Config.DATABASE_URL
					: Config.DATABASE_URL_TEST,
		},
	},
});


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