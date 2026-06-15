const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const dataFile = path.join(root, "data", "site.json");
const uploadsDir = path.join(root, "assets", "uploads");
const port = Number(process.env.PORT || 8080);
const maxUploadFileSize = 500 * 1024 * 1024;
const maxUploadBodySize = maxUploadFileSize + 8 * 1024 * 1024;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".mov": "video/quicktime",
  ".webm": "video/webm",
  ".ogv": "video/ogg",
  ".ogg": "video/ogg"
};

fs.mkdirSync(path.dirname(dataFile), { recursive: true });
fs.mkdirSync(uploadsDir, { recursive: true });

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload, null, 2));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > maxUploadBodySize) {
        reject(new Error("请求太大，请上传 200MB 以内的视频或图片。"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function readBodyBuffer(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", chunk => {
      size += chunk.length;
      if (size > maxUploadBodySize) {
        reject(new Error("文件太大，请上传 500MB 以内的视频或图片。"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function safeFileName(name) {
  const ext = path.extname(name).toLowerCase() || ".png";
  const base = path.basename(name, ext).replace(/[^\w.-]+/g, "-").replace(/^-+|-+$/g, "") || "image";
  return `${Date.now()}-${base}${ext}`;
}

function extensionForMime(mime, fallbackName) {
  const fromName = path.extname(fallbackName || "").toLowerCase();
  const extByMime = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "video/mp4": ".mp4",
    "video/webm": ".webm",
    "video/ogg": ".ogg",
    "video/quicktime": ".mov"
  };
  return extByMime[mime] || fromName || ".bin";
}

function isAllowedAssetMime(mime) {
  return /^(image\/(?:png|jpeg|jpg|webp|gif)|video\/(?:mp4|webm|ogg|quicktime))$/.test(mime || "");
}

function parseMultipartUpload(req, body) {
  const contentType = req.headers["content-type"] || "";
  const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
  if (!boundaryMatch) throw new Error("上传请求格式不正确，请重新选择文件上传。");

  const boundary = Buffer.from(`--${boundaryMatch[1] || boundaryMatch[2]}`);
  const headerSeparator = Buffer.from("\r\n\r\n");
  let cursor = 0;

  while (cursor < body.length) {
    const partStart = body.indexOf(boundary, cursor);
    if (partStart === -1) break;
    let headerStart = partStart + boundary.length;
    if (body[headerStart] === 45 && body[headerStart + 1] === 45) break;
    if (body[headerStart] === 13 && body[headerStart + 1] === 10) headerStart += 2;

    const headerEnd = body.indexOf(headerSeparator, headerStart);
    if (headerEnd === -1) break;
    const headers = body.slice(headerStart, headerEnd).toString("latin1");
    const nextPart = body.indexOf(boundary, headerEnd + headerSeparator.length);
    if (nextPart === -1) break;

    let dataEnd = nextPart;
    if (body[dataEnd - 2] === 13 && body[dataEnd - 1] === 10) dataEnd -= 2;

    const disposition = headers.match(/content-disposition:[^\r\n]+/i)?.[0] || "";
    const filename = disposition.match(/filename="([^"]*)"/i)?.[1];
    if (filename) {
      const mime = headers.match(/content-type:\s*([^\r\n]+)/i)?.[1]?.trim() || "application/octet-stream";
      return {
        fileName: filename,
        mime,
        data: body.slice(headerEnd + headerSeparator.length, dataEnd)
      };
    }

    cursor = nextPart;
  }

  throw new Error("没有收到文件，请重新选择后再上传。");
}

function saveUploadedAsset(fileName, mime, data) {
  if (!isAllowedAssetMime(mime)) {
    throw new Error("只支持 png、jpg、webp、gif 图片，以及 mp4、webm、ogg、mov 视频。");
  }
  if (data.length > maxUploadFileSize) {
    throw new Error("文件太大，请上传 500MB 以内的视频或图片。");
  }
  const ext = extensionForMime(mime, fileName);
  const safeName = safeFileName(fileName || `upload${ext}`);
  const finalName = safeName.endsWith(ext) ? safeName : `${safeName}${ext}`;
  const filePath = path.join(uploadsDir, finalName);
  fs.writeFileSync(filePath, data);
  return `/assets/uploads/${finalName}`;
}

function serveStatic(req, res) {
  const url = new URL(req.url, `http://localhost:${port}`);
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === "/") pathname = "/index.html";
  const filePath = path.normalize(path.join(root, pathname));
  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }
    res.writeHead(200, {
      "Content-Type": mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    res.end(data);
  });
}

async function handleAssetUpload(req, res) {
  try {
    const contentType = req.headers["content-type"] || "";
    if (contentType.startsWith("multipart/form-data")) {
      const upload = parseMultipartUpload(req, await readBodyBuffer(req));
      const url = saveUploadedAsset(upload.fileName, upload.mime, upload.data);
      sendJson(res, 200, { url });
      return;
    }

    const payload = JSON.parse(await readBody(req));
    const match = String(payload.dataUrl || "").match(/^data:((?:image\/(?:png|jpeg|jpg|webp|gif))|(?:video\/(?:mp4|webm|ogg|quicktime)));base64,(.+)$/);
    if (!match) {
      sendJson(res, 400, { error: "只支持 png、jpg、webp、gif 图片，以及 mp4、webm、ogg、mov 视频。" });
      return;
    }
    const url = saveUploadedAsset(payload.fileName || "image.png", match[1], Buffer.from(match[2], "base64"));
    sendJson(res, 200, { url });
  } catch (error) {
    sendJson(res, 400, { error: error.message });
  }
}

async function handleApi(req, res) {
  if (req.method === "GET" && req.url.startsWith("/api/site")) {
    const data = fs.readFileSync(dataFile, "utf8");
    sendJson(res, 200, JSON.parse(data));
    return;
  }

  if (req.method === "PUT" && req.url.startsWith("/api/site")) {
    try {
      const payload = JSON.parse(await readBody(req));
      if (!payload.profile || !Array.isArray(payload.projects)) {
        sendJson(res, 400, { error: "数据格式不正确。" });
        return;
      }
      fs.writeFileSync(dataFile, JSON.stringify(payload, null, 2), "utf8");
      sendJson(res, 200, { ok: true });
    } catch (error) {
      sendJson(res, 400, { error: error.message });
    }
    return;
  }

  if (req.method === "POST" && req.url.startsWith("/api/assets")) {
    await handleAssetUpload(req, res);
    return;
    try {
      const payload = JSON.parse(await readBody(req));
      const match = String(payload.dataUrl || "").match(/^data:((?:image\/(?:png|jpeg|jpg|webp|gif))|(?:video\/(?:mp4|webm|ogg)));base64,(.+)$/);
      if (!match) {
        sendJson(res, 400, { error: "只支持 png、jpg、webp、gif 图片，以及 mp4、webm、ogg 视频。" });
        return;
      }
      const fileName = safeFileName(payload.fileName || "image.png");
      const filePath = path.join(uploadsDir, fileName);
      fs.writeFileSync(filePath, Buffer.from(match[2], "base64"));
      sendJson(res, 200, { url: `/assets/uploads/${fileName}` });
    } catch (error) {
      sendJson(res, 400, { error: error.message });
    }
    return;
  }

  sendJson(res, 404, { error: "API not found" });
}

http.createServer((req, res) => {
  if (req.url.startsWith("/api/")) {
    handleApi(req, res);
    return;
  }
  serveStatic(req, res);
}).listen(port, "127.0.0.1", () => {
  console.log(`Portfolio CMS running at http://127.0.0.1:${port}`);
  console.log(`Admin: http://127.0.0.1:${port}/admin.html`);
});
