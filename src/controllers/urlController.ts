import { Request, Response } from "express";
import { UrlService } from "../services/urlService";

const urlService = new UrlService();

export class UrlController {
  async shortenUrl(req: Request, res: Response) {
    try {
      const { url } = req.body;

      if (!url) {
        res.status(400).json({ error: "URL is required" });
        return;
      }

      const slug = await urlService.shortenUrl(url);
      const shortUrl = `http://localhost:3000/${slug}`;

      res.status(201).json({ shortUrl });
    } catch (error) {
      console.error("Error shortening URL:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async redirectToOriginalUrl(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const originalUrl = await urlService.getOriginalUrl(slug);

      if (!originalUrl) {
        res.status(404).json({ error: "URL not found" });
        return;
      }

      res.redirect(originalUrl);
    } catch (error) {
      console.error("Error redirecting to original URL:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
