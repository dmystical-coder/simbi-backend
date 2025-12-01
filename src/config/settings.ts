import dotenv from "dotenv";

dotenv.config();

class Config {
	static PORT: string | undefined = process.env.PORT;
	static DATABASE_URL: string | undefined = process.env.DATABASE_URL;
	static DATABASE_URL_TEST: string | undefined = process.env.DATABASE_URL_TEST;
	static ENVIRONMENT: string = process.env.ENVIRONMENT || "development";
	static ACCESS_JWT_SECRET: string = process.env.ACCESS_JWT_SECRET ?? "your-secret-key";
	static REFRESH_JWT_SECRET: string = process.env.REFRESH_JWT_SECRET ?? "your-secret-key";
	static JWT_EXPIRATION_MINUTES: number = process.env.JWT_EXPIRATION_MINUTES
		? parseInt(process.env.JWT_EXPIRATION_MINUTES)
		: 5;
	static JWT_EXPIRATION_HOURS: number = process.env.JWT_EXPIRATION_HOURS
		? parseInt(process.env.JWT_EXPIRATION_HOURS) * 60
		: 24;
	static ALLOWED_ORIGINS: string[] | "*" =
		process.env.ALLOWED_ORIGINS == "*" ? "*" : process.env.ALLOWED_ORIGINS?.split(",") || [];
	static SALT_ROUNDS: number = process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS) : 10;
	static API_VERSION: string = process.env.API_VERSION || "1";
	static SIMBI_AI_KEY: string = process.env.SIMBI_AI_KEY ?? "default-simbi-ai-key";
	static GROQ_API_KEY: string = process.env.GROQ_API_KEY ?? "default-groq-api-key";
}

export default Config;
