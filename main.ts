import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import data from "./data.json" assert { type: "json" };

const router = new Router();
router
    .get("/", ({ response }) => {
        response.status = 200
        response.body = "Hello world!"
    })
    .get("/dinos/all", ({ response }) => {
        response.body = data;
    })
    .get("/dinos/:name", ({ response, params }) => {
        const dino = data.find((dino) => dino.name === params.name);

        if (!dino) {
            response.status = 404
            response.body = { message: "Dino not found!" }
        }

        response.body = dino;
    })
    .post("/dinos/create", async ({ request, response }) => {
        const reqData = await request.body().value

        if (!reqData.name || !reqData.description) {
            response.status = 400;
            response.body = { message: "Invalid dino data" };
            return;
        }

        response.status = 201
        response.body = { message: "Dino created successfully!" };
    })

const app = new Application();
app.use(oakCors()); // Enable CORS for All Routes
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
