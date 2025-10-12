import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function main() {
    await prisma.probe_type.createMany({
        data: [
            { probe_type_id: 1, probe_type_name: "hydrostatic"},
            { probe_type_id: 2, probe_type_name: "magnetostrictive"},
            { probe_type_id: 3, probe_type_name: "ultrasonic"}
        ],
        skipDuplicates: true,
    })
}


main()
    .then(() => {
        console.log("Seed data completed!")
        process.exit(0)
    })
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally( async () => {
        await prisma.$disconnect();
    })

// คำสั่งรัน seed : 'npx prisma db seed'