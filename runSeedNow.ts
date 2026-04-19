import { seedPhases } from "./src/lib/seed";
import { config } from "dotenv";

config({ path: ".env.local" });

async function run() {
    console.log("Starting seed...");
    try {
        await seedPhases();
        console.log("Seeded phases!");
    } catch (err: any) {
        console.error("Error seeding:", err.message || err);
    }
    process.exit(0);
}

run();
