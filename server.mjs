import { createReadStream, existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)));
const port = Number(process.env.PORT || process.argv[2] || 4173);

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

const send = (response, status, body, type = "text/plain; charset=utf-8") => {
  response.writeHead(status, { "Content-Type": type });
  response.end(body);
};

createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? "/", `http://${request.headers.host}`);
    const decodedPath = decodeURIComponent(url.pathname);
    const safePath = normalize(decodedPath).replace(/^(\.\.[/\\])+/, "");
    let filePath = resolve(join(root, safePath === "/" ? "index.html" : safePath));

    if (!filePath.startsWith(root)) {
      send(response, 403, "Forbidden");
      return;
    }

    if (!existsSync(filePath)) {
      send(response, 404, "Not found");
      return;
    }

    const fileStats = await stat(filePath);
    if (fileStats.isDirectory()) {
      filePath = join(filePath, "index.html");
    }

    response.writeHead(200, {
      "Content-Type": mimeTypes[extname(filePath)] ?? "application/octet-stream",
    });
    createReadStream(filePath).pipe(response);
  } catch (error) {
    send(response, 500, "Server error");
  }
}).listen(port);
