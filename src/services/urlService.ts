import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid";
import validator from "validator";

const prisma = new PrismaClient();

export class UrlService {
  async shortenUrl(originalUrl: string): Promise<string> {
    if (!validator.isURL(originalUrl)) {
      throw new Error("Invalid URL");
    }

    const normalizedUrl = this.normalizeUrl(originalUrl);

    const existingUrl = await prisma.url.findFirst({
      where: { originalUrl: normalizedUrl },
    });

    if (existingUrl) {
      return existingUrl.slug;
    }

    const slug = await this.generateUniqueSlug();

    await prisma.url.create({
      data: {
        originalUrl: normalizedUrl,
        slug,
      },
    });

    return slug;
  }

  async getOriginalUrl(slug: string): Promise<string | null> {
    const url = await prisma.url.findUnique({ where: { slug } });

    if (!url) {
      return null;
    }

    if (url.expiresAt && url.expiresAt < new Date()) {
      await prisma.url.delete({ where: { slug } });
      return null;
    }

    await prisma.url.update({
      where: { id: url.id },
      data: { clicks: { increment: 1 } },
    });

    return url.originalUrl;
  }

  private normalizeUrl(url: string): string {
    url = url.replace(/\/$/, "");
    if (!/^https?:\/\//i.test(url)) {
      url = `http://${url}`;
    }
    return url;
  }

  private async generateUniqueSlug(): Promise<string> {
    while (true) {
      const slug = nanoid(6);
      const existingSlug = await prisma.url.findUnique({ where: { slug } });
      if (!existingSlug) {
        return slug;
      }
    }
  }
}
