import { PrismaClient } from "@prisma/client";
import { UrlService } from "./urlService";

const prisma = new PrismaClient();

describe("UrlService", () => {
  let urlService: UrlService;

  beforeAll(() => {
    urlService = new UrlService();
  });

  afterEach(async () => {
    await prisma.url.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should shorten a valid URL", async () => {
    const originalUrl = "https://www.youtube.com/watch?v=AQ69kBP7uok";
    const slug = await urlService.shortenUrl(originalUrl);

    expect(slug).toBeDefined();
    expect(typeof slug).toBe("string");
    expect(slug.length).toBe(6);

    const savedUrl = await prisma.url.findUnique({ where: { slug } });
    expect(savedUrl).toBeDefined();
    expect(savedUrl?.originalUrl).toBe(originalUrl);
  });

  it("should throw an error when shortening an invalid URL", async () => {
    const invalidUrl = "pas mal le lien";

    await expect(urlService.shortenUrl(invalidUrl)).rejects.toThrow(
      "Invalid URL"
    );
  });

  it("should return the same slug for the same URL", async () => {
    const originalUrl = "https://www.youtube.com/watch?v=XQtilPmhgUs";
    const slug1 = await urlService.shortenUrl(originalUrl);
    const slug2 = await urlService.shortenUrl(originalUrl);

    expect(slug1).toBe(slug2);
  });

  it("should return the original URL by slug", async () => {
    const originalUrl = "https://www.youtube.com/watch?v=1NacndW3hpM";
    const slug = await urlService.shortenUrl(originalUrl);

    const retrievedUrl = await urlService.getOriginalUrl(slug);
    expect(retrievedUrl).toBe(originalUrl);
  });

  it("should return null when the slug does not exist", async () => {
    const nonExistentSlug = "alphabet";
    const retrievedUrl = await urlService.getOriginalUrl(nonExistentSlug);
    expect(retrievedUrl).toBeNull();
  });
});
