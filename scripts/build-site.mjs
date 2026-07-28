import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  brandCatalog,
  cityCatalog,
  homeContent,
  referenceImages,
  serviceCatalog,
  siteConfig,
} from "../src/site-config.mjs";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = path.join(rootDir, "references", "content");
const manifestPath = path.join(rootDir, ".generated-pages.json");

const contentFiles = [
  "vasiautokulcs_tier1_bevezeto_szovegek.txt",
  "vasiautokulcs_tier2_markaoldal_bevezetok.txt",
  "vasiautokulcs_tier3_marka_varos_bevezetok.txt",
  "vasiautokulcs_tier4_varosi_bevezetok.txt",
  "vasiautokulcs_tier5_vas_varmegye_marka_varos_bevezetok.txt",
];

const disabledBrandSlugs = new Set(["bmw", "mercedes"]);
const activeBrandCatalog = brandCatalog.filter((brand) => !disabledBrandSlugs.has(brand.slug));
const serviceKeys = Object.keys(serviceCatalog);
const citySlugs = cityCatalog.map((city) => city.slug).sort((left, right) => right.length - left.length);
const brandSlugs = activeBrandCatalog.map((brand) => brand.slug);
const brandProfiles = {
  renault:
    "A Renault modelleknél gyakori, hogy a kulcskártya vagy az immobilizeres autókulcs használhatóságát a meglévő kulcs állapota és a jármű felismerési folyamata együtt határozza meg.",
  dacia:
    "Dacia típusoknál sokszor a meglévő kulcs darabszáma, a távirányítós funkció állapota és az autó pontos évjárata dönti el, milyen munkamenet javasolható.",
  peugeot:
    "Peugeot autóknál a távirányítós és keyless (szabadkezes) autókulcsok esetében is külön felmérést igényel, hogy másolás, kulcs tanítás, programozás vagy javítás jelenti a célravezető megoldást.",
  citroen:
    "Citroën járműveknél a kulcs működése és a jármű oldali felismerés összehangolt vizsgálata segít eldönteni, hogy pótlásra, kulcs tanításra, programozásra vagy javításra van szükség.",
  opel:
    "Opel modelleknél gyakran az utolsó működő kulcs megőrzése a legfontosabb kiindulópont, mert ez jelentősen befolyásolja a további pótlási, kulcs tanítási és programozási lehetőségeket.",
  ford:
    "Ford autók esetében is csak a pontos típus, évjárat és kulcshelyzet ismeretében lehet felelősen megmondani, hogy műhelymunka, kulcs tanítás, programozás vagy helyszíni egyeztetés szükséges-e.",
  volkswagen:
    "Volkswagen típusoknál a kulcsház, a távirányító és az immobilizeres autókulcs viselkedése együtt ad képet arról, hogy másolás, javítás vagy újratanítás a jobb irány.",
  audi:
    "Audi autóknál a kulcsfelismerés bizonytalansága, a meglévő kulcs állapota és a távirányító működése egyszerre befolyásolhatja a lehetséges megoldásokat.",
  skoda:
    "Škoda modelleknél is fontos kérdés, hogy maradt-e működő kulcs, mert ez nemcsak a pótkulcs készítés menetét, hanem a kulcs tanítási és programozási lehetőségeket is meghatározza.",
  seat:
    "SEAT autóknál a kulcs állapota mellett azt is fel kell mérni, hogy a távirányítós és immobilizeres funkciók milyen mértékben működnek együtt a járművel.",
  bmw:
    "BMW modelleknél az autókulccsal kapcsolatos munka mindig egyedi egyeztetést igényel, mert a pontos eljárást a jármű és a rendelkezésre álló kulcsok helyzete határozza meg.",
  mercedes:
    "Mercedes autóknál is fontos tisztázni, hogy a probléma a kulcs fizikai részéhez, a távirányítóhoz vagy a jármű oldali felismeréshez kapcsolódik-e elsődlegesen.",
  toyota:
    "Toyota típusoknál a másolás, a kulcs tanítás, a programozás és a pótlás lehetőségeit minden esetben az autó pontos adatai és a meglévő kulcsok száma alapján lehet meghatározni.",
  suzuki:
    "Suzuki autóknál sok ügyfél akkor jelentkezik, amikor már csak egy működő kulcs maradt, ezért a felmérés célja ilyenkor a biztonságos és tervezhető pótlás feltérképezése.",
  hyundai:
    "Hyundai modelleknél a kulcsprobléma hátterében lehet egyszerű távirányítós hiba is, de szükség lehet kulcs tanítási, programozási vagy felismerési vizsgálatra is a pontos döntéshez.",
  kia:
    "Kia autóknál a kulcs másolhatóságát és programozhatóságát a típusadatok, a felszereltség és a jelenlegi kulcshelyzet együttese alapján lehet felmérni.",
  nissan:
    "Nissan modelleknél a kulcshiba elbírálásához gyakran arra is szükség van, hogy a jármű miként reagál a meglévő kulcsokra és azok távirányítós funkcióira.",
  mazda:
    "Mazda autóknál az elveszett vagy bizonytalanul működő kulcs esetében a felmérés segít eldönteni, hogy javítás, pótlás, kulcs tanítás vagy programozás a reális következő lépés.",
  honda:
    "Honda típusoknál is a jármű típusa, évjárata és a rendelkezésre álló kulcsok határozzák meg, hogy milyen megoldás vállalható biztonságosan és átláthatóan.",
  fiat:
    "Fiat modelleknél a kulcs kialakítása, az immobilizeres rendszer és a meglévő kulcsok állapota együtt határozza meg, milyen pótlási vagy javítási lehetőség jöhet szóba.",
  mitsubishi:
    "Mitsubishi autóknál is a pontos típus, évjárat és kulcshelyzet alapján mérhető fel, hogy másolás, kulcs tanítás, programozás vagy javítás lehet-e a megfelelő irány.",
};

const sharedServiceLinks = [
  "autokulcs-masolas",
  "kulcsprogramozas",
  "potkulcs",
  "keyless-kulcs",
  "taviranyitos-autokulcs-javitas",
  "immobiliser-javitas",
  "hibakod-kiolvasas",
  "hibakod-jegyzokonyv",
  "klimatisztitas",
];

const supportBlocks = [
  "A pontos megoldást minden esetben az autó típusa, évjárata és a rendelkezésre álló kulcsok alapján mérjük fel, ezért a kapcsolatfelvételnél érdemes megadni a jármű alapadatait és a jelenlegi kulcshelyzetet is.",
  "Műhelyben és előzetes egyeztetéssel kiszállással is dolgozunk, különösen akkor, ha a jármű nem indítható, nem mozgatható, vagy a kulcs hibája miatt a használat bizonytalan.",
  "Ha még van működő autókulcs, általában egyszerűbb és tervezhetőbb a folyamat, ezért pótkulcs készítését nem érdemes az utolsó pillanatra halasztani.",
];

main();

function main() {
  const oldManifest = readManifest();
  cleanupGeneratedOutputs(oldManifest);

  const pages = parseAllPages();
  const pageMap = new Map(pages.map((page) => [page.slug, page]));

  const internalLinkErrors = new Set();
  const similarityWarnings = [];

  const renderedPages = pages.map((page) => {
    const paragraphs = buildParagraphs(page);
    const related = buildRelatedLinks(page, pageMap);
    const faqs = buildFaqs(page);
    const featureBullets = buildFeatureBullets(page);
    const title = buildPageTitle(page);
    const description = buildPageDescription(page);
    const breadcrumb = buildBreadcrumb(page);
    const slugText = normalizeText([page.h1, page.intro, ...paragraphs, ...faqs.map((faq) => `${faq.question} ${faq.answer}`)].join(" "));

    return {
      ...page,
      paragraphs,
      related,
      faqs,
      featureBullets,
      title,
      description,
      breadcrumb,
      similarityText: slugText,
      noindex: false,
      internalLinkErrors: validateRelatedLinks(related, pageMap, internalLinkErrors),
    };
  });

  for (let index = 0; index < renderedPages.length; index += 1) {
    for (let second = index + 1; second < renderedPages.length; second += 1) {
      const similarity = calculateSimilarity(
        renderedPages[index].similarityText,
        renderedPages[second].similarityText,
      );

      if (similarity > 0.8) {
        renderedPages[second].noindex = true;
        similarityWarnings.push(
          `${renderedPages[index].slug} ~ ${renderedPages[second].slug}: ${similarity.toFixed(2)}`,
        );
      }
    }
  }

  writeStaticSupportFiles();
  writeHomePage();
  write404Page();

  const generatedEntries = [];
  const sitemapUrls = [siteConfig.primaryDomain + "/"];

  renderedPages.forEach((page) => {
    writeLandingPage(page);
    generatedEntries.push(`/${page.slug}/`);
    if (!page.noindex) {
      sitemapUrls.push(`${siteConfig.primaryDomain}/${page.slug}/`);
    }
  });

  writeSitemap(sitemapUrls);
  writeManifest(generatedEntries);

  const summary = [
    `Landing oldalak: ${renderedPages.length}`,
    `Indexelhető oldalak: ${renderedPages.filter((page) => !page.noindex).length}`,
    `Noindex figyelmeztetések: ${similarityWarnings.length}`,
    `Hibás belső linkek: ${internalLinkErrors.size}`,
  ];

  console.log(summary.join(" | "));

  if (similarityWarnings.length) {
    console.log("Similarity warnings:");
    similarityWarnings.forEach((warning) => console.log(` - ${warning}`));
  }

  if (internalLinkErrors.size) {
    console.log("Internal link warnings:");
    Array.from(internalLinkErrors).forEach((warning) => console.log(` - ${warning}`));
  }
}

function readManifest() {
  if (!fs.existsSync(manifestPath)) {
    return [];
  }

  try {
    const raw = fs.readFileSync(manifestPath, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function cleanupGeneratedOutputs(entries) {
  entries.forEach((entry) => {
    const slug = entry.replaceAll("/", "");
    if (!slug) {
      return;
    }

    const target = path.join(rootDir, slug);
    if (fs.existsSync(target)) {
      fs.rmSync(target, { recursive: true, force: true });
    }
  });
}

function parseAllPages() {
  const pages = contentFiles.flatMap((fileName) => {
    const tierMatch = fileName.match(/tier(\d+)/i);
    const tier = tierMatch ? Number(tierMatch[1]) : 0;
    const filePath = path.join(contentDir, fileName);
    const raw = fs.readFileSync(filePath, "utf8");
    return parseEntries(raw).map((entry) => buildPageRecord(entry, tier));
  });

  const filteredPages = pages.filter((page) => !isDisabledBrandPage(page.slug));
  return [...filteredPages, ...buildSupplementalBrandPages(filteredPages)];
}

function buildSupplementalBrandPages(existingPages) {
  const existingSlugs = new Set(existingPages.map((page) => page.slug));
  return activeBrandCatalog
    .filter((brand) => !existingSlugs.has(`${brand.slug}-kulcs`))
    .map((brand) =>
      buildPageRecord(
        {
          slug: `${brand.slug}-kulcs`,
          h1: `${brand.name} autókulcs másolás, tanítás, programozás és javítás`,
          intro: `${brand.name} autókulcsokkal kapcsolatban előzetes felmérést vállalunk immobilizeres, távirányítós és keyless (szabadkezes) kivitelek esetén. A pontos lehetőség az autó típusától, évjáratától, a kulcs kivitelétől és a meglévő kulcsok állapotától függ. Ha pótkulcsra, kulcs tanításra, programozásra vagy távirányítós autókulcs javítására van szükség, telefonon egyeztetjük a részleteket, és megmondjuk, milyen irányban érdemes elindulni.`,
        },
        2,
      ),
    );
}

function parseEntries(raw) {
  const entries = [];
  const regex =
    /^\d+\.\s+(\/[^\r\n]+)\r?\nH1:\s*(.+)\r?\n\r?\nBEVEZETŐ:\r?\n([\s\S]*?)(?=\r?\n[-]{10,}\r?\n|\s*$)/gm;

  for (const match of raw.matchAll(regex)) {
    entries.push({
      slug: match[1].slice(1).trim(),
      h1: normalizeCityAreaPhrases(normalizeTeachingTerms(match[2].trim())),
      intro: normalizeCityAreaPhrases(normalizeTeachingTerms(match[3].replace(/\s+/g, " ").trim())),
    });
  }

  return entries;
}

function normalizeTeachingTerms(value) {
  return value
    .replaceAll("autókulcs másolás, programozás és javítás", "autókulcs másolás, tanítás, programozás és javítás")
    .replaceAll("Autókulcs másolás, programozás és javítás", "Autókulcs másolás, tanítás, programozás és javítás")
    .replaceAll("autókulcs másolás, programozás", "autókulcs másolás, tanítás, programozás")
    .replaceAll("Autókulcs másolás, programozás", "Autókulcs másolás, tanítás, programozás")
    .replaceAll("autókulcs másolás és programozás", "autókulcs másolás, tanítás és programozás")
    .replaceAll("Autókulcs másolás és programozás", "Autókulcs másolás, tanítás és programozás")
    .replaceAll("autókulcs-másolást, programozást", "autókulcs-másolást, kulcs tanítást, programozást")
    .replaceAll("autókulcsok másolásával, programozásával", "autókulcsok másolásával, tanításával, programozásával")
    .replaceAll("másolását, programozását", "másolását, tanítását, programozását")
    .replaceAll("másolási, programozási", "másolási, tanítási, programozási")
    .replaceAll("másolással, programozással", "másolással, kulcs tanítással, programozással")
    .replaceAll("Autókulcs programozás és immobiliseres kulcstanítás", "Autókulcs tanítás és programozás")
    .replaceAll("Autókulcs programozást", "Autókulcs tanítást és programozást")
    .replaceAll("Autókulcs-programozást", "Autókulcs tanítást és programozást")
    .replaceAll("autókulcs programozást", "autókulcs tanítást és programozást")
    .replaceAll("autókulcs-programozást", "autókulcs tanítást és programozást")
    .replaceAll("Autókulcs-programozás", "Autókulcs tanítás és programozás")
    .replaceAll("autókulcs-programozásban", "autókulcs tanításban és programozásban")
    .replaceAll("Autókulcs programozás", "Autókulcs tanítás és programozás")
    .replaceAll("kulcsprogramozásban", "kulcs tanításban és programozásban")
    .replaceAll("kulcsprogramozást", "kulcs tanítást és programozást")
    .replaceAll("kulcsprogramozás", "kulcs tanítás és programozás")
    .replaceAll("Autókulcs tanítás és programozást", "Autókulcs tanítást és programozást")
    .replaceAll("autókulcs tanítás és programozást", "autókulcs tanítást és programozást");
}

function normalizeCityAreaPhrases(value) {
  return cityCatalog.reduce(
    (text, city) => text.replaceAll(`${city.name} és környékén`, `${city.inessive} és környékén`),
    value,
  );
}

function buildPageRecord(entry, tier) {
  const { slug } = entry;
  const citySlug = citySlugs.find((candidate) => slug === candidate || slug.endsWith(`-${candidate}`)) || null;
  const prefix = citySlug && slug !== citySlug ? slug.slice(0, -(citySlug.length + 1)) : slug;
  const brandSlug = brandSlugs.find((candidate) => prefix === `${candidate}-kulcs`) || null;
  const serviceKey = serviceKeys.find((candidate) => prefix === candidate || slug === candidate) || "autokulcs";

  let kind = "service";
  if (brandSlug && citySlug) {
    kind = "brand-city";
  } else if (brandSlug) {
    kind = "brand";
  } else if (citySlug && prefix !== citySlug) {
    kind = "city-service";
  }

  return {
    ...entry,
    tier,
    kind,
    brandSlug,
    citySlug,
    serviceKey,
  };
}

function buildPageTitle(page) {
  if (page.kind === "brand") {
    return `${getBrandName(page.brandSlug)} autókulcs másolás, tanítás, programozás és javítás | ${siteConfig.brandName}`;
  }

  return `${page.h1} | ${siteConfig.brandName}`;
}

function buildPageDescription(page) {
  const city = getCity(page.citySlug);
  const brand = getBrandName(page.brandSlug);
  const service = serviceCatalog[page.serviceKey];
  let description = `${service?.name || "Autókulcs szolgáltatás"} ${city ? city.regional : "Szombathelyen és Vas vármegyében"}.`;

  if (brand) {
    description += ` ${brand} modellekhez is.`;
  }

  description += " A pontos lehetőség az autó típusától, évjáratától és a rendelkezésre álló kulcsoktól függ.";
  description += " Időpont-egyeztetéssel, szükség esetén kiszállással.";
  return truncate(description, 160);
}

function buildParagraphs(page) {
  const city = getCity(page.citySlug);
  const brand = getBrandName(page.brandSlug);
  const brandProfile = page.brandSlug ? brandProfiles[page.brandSlug] : "";
  const service = serviceCatalog[page.serviceKey];
  const serviceShortName = service?.shortName || "autókulccsal kapcsolatos munka";
  const serviceMention = brand
    ? `${brand} autókhoz kapcsolódóan ${serviceShortName}`
    : sentenceStart(serviceShortName);
  const nearbyText = city ? city.nearby.join(", ") : "Szombathely, Sárvár, Körmend, Kőszeg és Celldömölk";
  const appointmentAreaText = city ? nearbyText : "Sárvár, Körmend, Kőszeg és Celldömölk";
  const appointmentIntro = city ? `${city.name} mellett ${appointmentAreaText}` : `Szombathelyről, valamint ${appointmentAreaText}`;
  const surroundingAreaText = city ? `${city.regional.toLowerCase()} és a környező` : "a környező";
  const rotation = hashString(page.slug) % 3;

  const firstParagraphs = [
    `${serviceMention} során nemcsak a kulcs fizikai állapota számít, hanem az elektronika, a transzponder, a távirányító és a jármű oldali felismerés is. Emiatt minden megkeresésnél az autó típusa, évjárata és a meglévő kulcsok alapján egyeztetjük a tényleges lehetőségeket.`,
    `${city ? `${city.name} és környéke` : "Vas vármegye"} ügyfeleinél is gyakori, hogy a kulcs időszakosan működik, a távirányító bizonytalan, vagy csak egyetlen példány maradt. Ilyenkor érdemes még működő kulcs mellett lépni, mert a pótkulcs készítés, a kulcs tanítás és a programozás általában átláthatóbb folyamat.`,
    `${brand ? `${brand} márkánál is ` : ""}előfordulhat, hogy a kulcsprobléma hátterében nem egyetlen hiba áll, hanem több tényező együttese. Ezért a felmérés során a kulcs állapota mellett azt is megnézzük, hogyan reagál a jármű a tanításra, felismerésre vagy a távirányító jeleire.`,
  ];

  const secondParagraphs = [
    `A megkereséseket ${surroundingAreaText} településekről is fogadjuk, különösen ${nearbyText} térségéből. Ez nem helyi telephelyet jelent, hanem azt, hogy előzetes egyeztetéssel ezekből a városokból és környékükről is lehet időpontot kérni.`,
    `Az ügyfelek ${city ? `${city.name} felől` : "a térségből"} gyakran teljes kulcsvesztés, kulcsfelismerési bizonytalanság vagy meghibásodott távirányító miatt keresnek meg minket. Ilyen esetben a munka menete a helyszíni körülményektől és attól is függ, hogy a jármű mozgatható-e, illetve rendelkezésre áll-e bármilyen működő kulcs.`,
    `Időpont-egyeztetés alapján ${appointmentIntro} térségéből is fogadunk ügyfeleket. Ha a jármű nem indítható, előzetes egyeztetéssel kiszállás is kérhető, de ennek módját mindig az adott helyzethez igazítjuk.`,
  ];

  return [
    firstParagraphs[rotation],
    brandProfile || supportBlocks[rotation],
    secondParagraphs[(rotation + 1) % secondParagraphs.length],
    supportBlocks[(rotation + 2) % supportBlocks.length],
  ];
}

function buildFeatureBullets(page) {
  const city = getCity(page.citySlug);
  const brand = getBrandName(page.brandSlug);
  const service = serviceCatalog[page.serviceKey];
  return [
    `${service?.name || "Autókulcs szolgáltatás"} ${city ? city.regional : "Szombathelyen és Vas vármegyében"}`,
    `${brand ? `${brand} modellekhez igazított` : "Márkától függő"} felmérés és egyeztetés`,
    "Ügyfélfogadás előzetes időpont-egyeztetéssel",
    city?.slug === "szombathely"
      ? "Szombathelyen belül a kiszállás nem feláras"
      : "Kiszállás előzetes egyeztetéssel kérhető",
  ];
}

function buildFaqs(page) {
  const city = getCity(page.citySlug);
  const brand = getBrandName(page.brandSlug);
  const service = serviceCatalog[page.serviceKey];
  const locationText = city ? city.regional : "Szombathelyen és Vas vármegyében";
  return [
    {
      question: `${service?.name || "Az adott szolgáltatás"} esetén mitől függ a pontos lehetőség?`,
      answer: `Elsősorban az autó típusától, évjáratától, felszereltségétől és a rendelkezésre álló kulcsoktól. ${brand ? `${brand} autóknál is ` : ""}ezek az adatok határozzák meg, hogy ${locationText} milyen megoldás javasolható.`,
    },
    {
      question: brand
        ? `${brand} esetén miért szükséges előzetes egyeztetés?`
        : "Kérhető kiszállás, ha az autó nem indítható?",
      answer: brand
        ? `${brand} autóknál sem adható felelős ígéret pusztán egy általános leírás alapján, mert a lehetőségeket az autó típusa, évjárata, a meglévő kulcsok száma és a helyszíni körülmények együtt határozzák meg. Előzetes egyeztetéssel ezért pontosabban felmérhető, milyen megoldás javasolható.`
        : `Igen, előzetes egyeztetéssel több esetben kérhető kiszállás is. A pontos szervezés attól függ, hol áll a jármű, van-e működő kulcs, illetve milyen hibajelenség miatt van szükség helyszíni segítségre.`,
    },
  ];
}

function buildBreadcrumb(page) {
  const items = [{ name: "Főoldal", url: siteConfig.primaryDomain + "/" }];

  if (page.kind === "brand") {
    items.push({ name: getBrandName(page.brandSlug), url: `${siteConfig.primaryDomain}/${page.slug}/` });
    return items;
  }

  if (page.kind === "brand-city") {
    items.push({
      name: `${getBrandName(page.brandSlug)} autókulcs`,
      url: `${siteConfig.primaryDomain}/${page.brandSlug}-kulcs/`,
    });
    items.push({ name: getCity(page.citySlug)?.name || page.h1, url: `${siteConfig.primaryDomain}/${page.slug}/` });
    return items;
  }

  if (page.kind === "city-service") {
    if (page.serviceKey !== "autokulcs") {
      items.push({
        name: serviceCatalog[page.serviceKey]?.name || page.h1,
        url: page.citySlug ? `${siteConfig.primaryDomain}/${page.serviceKey}/` : `${siteConfig.primaryDomain}/${page.slug}/`,
      });
    }
    items.push({ name: getCity(page.citySlug)?.name || page.h1, url: `${siteConfig.primaryDomain}/${page.slug}/` });
    return items;
  }

  items.push({ name: serviceCatalog[page.serviceKey]?.name || page.h1, url: `${siteConfig.primaryDomain}/${page.slug}/` });
  return items;
}

function buildRelatedLinks(page, pageMap) {
  const hash = hashString(page.slug);
  const city = getCity(page.citySlug);
  const cityChoices = cityCatalog
    .filter((candidate) => candidate.slug !== page.citySlug)
    .sort((left, right) => hashString(`${page.slug}-${left.slug}`) - hashString(`${page.slug}-${right.slug}`));
  const brandChoices = brandCatalog
    .filter((candidate) => !disabledBrandSlugs.has(candidate.slug))
    .filter((candidate) => candidate.slug !== page.brandSlug)
    .sort((left, right) => hashString(`${page.slug}-${left.slug}`) - hashString(`${page.slug}-${right.slug}`));
  const serviceChoices = sharedServiceLinks
    .filter((candidate) => candidate !== page.serviceKey)
    .sort((left, right) => hashString(`${page.slug}-${left}`) - hashString(`${page.slug}-${right}`));

  const links = [];

  if (page.kind === "brand") {
    [
      ["szombathely", "Szombathely"],
      ["sarvar", "Sárvár"],
    ].forEach(([citySlug, cityName]) => {
      const slug = `${page.brandSlug}-kulcs-${citySlug}`;
      if (pageMap.has(slug)) {
        links.push(linkRecord(slug, `${getBrandName(page.brandSlug)} kulcs ${cityName}`));
      }
    });
    serviceChoices.slice(0, 4).forEach((serviceKey) => {
      links.push(linkRecord(serviceKey, serviceCatalog[serviceKey].name));
    });
  } else if (page.kind === "brand-city") {
    links.push(linkRecord(`${page.brandSlug}-kulcs`, `${getBrandName(page.brandSlug)} márkaoldal`));
    if (page.citySlug) {
      links.push(linkRecord(`autokulcs-${page.citySlug}`, `${getCity(page.citySlug).name} autókulcs szolgáltatások`));
      links.push(linkRecord(`kulcsprogramozas-${page.citySlug}`, `${getCity(page.citySlug).name} kulcs tanítás`));
    }
    cityChoices.slice(0, 2).forEach((candidate) => {
      const slug = `${page.brandSlug}-kulcs-${candidate.slug}`;
      if (pageMap.has(slug)) {
        links.push(linkRecord(slug, `${getBrandName(page.brandSlug)} kulcs ${candidate.name}`));
      }
    });
  } else if (page.kind === "city-service") {
    serviceChoices.slice(0, 3).forEach((serviceKey) => {
      const slug = page.citySlug ? `${serviceKey}-${page.citySlug}` : serviceKey;
      if (pageMap.has(slug)) {
        links.push(linkRecord(slug, `${serviceCatalog[serviceKey].name} ${getCity(page.citySlug)?.name || ""}`.trim()));
      }
    });
    brandChoices.slice(0, 4).forEach((candidate) => {
      const slug = page.citySlug ? `${candidate.slug}-kulcs-${page.citySlug}` : `${candidate.slug}-kulcs`;
      if (pageMap.has(slug)) {
        links.push(linkRecord(slug, `${candidate.name} kulcs ${getCity(page.citySlug)?.name || ""}`.trim()));
      }
    });
    cityChoices.slice(0, 2).forEach((candidate) => {
      const slug = `${page.serviceKey}-${candidate.slug}`;
      if (pageMap.has(slug)) {
        links.push(linkRecord(slug, `${serviceCatalog[page.serviceKey].name} ${candidate.name}`));
      }
    });
  } else {
    cityCatalog
      .filter((candidate) => ["szombathely", "sarvar", "kormend", "koszeg", "celldomolk"].includes(candidate.slug))
      .slice(0, 4)
      .forEach((candidate) => {
        const slug = `${page.serviceKey}-${candidate.slug}`;
        if (pageMap.has(slug)) {
          links.push(linkRecord(slug, `${serviceCatalog[page.serviceKey].name} ${candidate.name}`));
        }
      });
    brandChoices.slice(hash % 3, hash % 3 + 4).forEach((candidate) => {
      const slug = `${candidate.slug}-kulcs`;
      if (pageMap.has(slug)) {
        links.push(linkRecord(slug, `${candidate.name} autókulcs`));
      }
    });
  }

  const deduped = [];
  const seen = new Set();
  links.forEach((link) => {
    if (!seen.has(link.slug)) {
      seen.add(link.slug);
      deduped.push(link);
    }
  });

  return deduped.slice(0, 8);
}

function validateRelatedLinks(relatedLinks, pageMap, warnings) {
  relatedLinks.forEach((link) => {
    if (!pageMap.has(link.slug) && link.slug !== "") {
      warnings.add(`${link.slug} hiányzik a generált oldalak közül`);
    }
  });
  return warnings;
}

function linkRecord(slug, label) {
  return { slug, label, href: `/${slug}/` };
}

function writeStaticSupportFiles() {
  copyReferenceImages();
  writeFile(
    path.join(rootDir, "favicon.svg"),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="Vasi Autókulcs"><rect width="100" height="100" rx="18" fill="#06080d"/><text x="14" y="72" font-size="58" font-family="Orbitron, Arial, sans-serif" font-weight="700" fill="#ffffff">V</text><text x="50" y="72" font-size="58" font-family="Orbitron, Arial, sans-serif" font-weight="700" fill="#60a5fa">K</text></svg>`,
  );

  writeFile(
    path.join(rootDir, "site.webmanifest"),
    JSON.stringify(
      {
        name: siteConfig.siteName,
        short_name: "Vasi Autókulcs",
        start_url: "/",
        display: "standalone",
        background_color: "#0a0a0a",
        theme_color: "#111827",
        icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
      },
      null,
      2,
    ),
  );

  writeFile(
    path.join(rootDir, "robots.txt"),
    `User-agent: *\nAllow: /\nDisallow: /backup/\n\nSitemap: ${siteConfig.primaryDomain}/sitemap.xml\n`,
  );

  const legacyBrandRedirects = activeBrandCatalog.flatMap((brand) => [
    `/${brand.slug} /${brand.slug}-kulcs/ 301`,
    `/${brand.slug}/ /${brand.slug}-kulcs/ 301`,
    `/${brand.slug}/index.html /${brand.slug}-kulcs/ 301`,
  ]);

  writeFile(
    path.join(rootDir, "_redirects"),
    [
      "https://vasiautokulcs.eu/* https://vasiautokulcs.hu/:splat 301",
      "https://www.vasiautokulcs.hu/* https://vasiautokulcs.hu/:splat 301",
      "https://www.vasiautokulcs.eu/* https://vasiautokulcs.hu/:splat 301",
      ...legacyBrandRedirects,
      "/szabadkezes-kulcs /keyless-kulcs/ 301",
      "/keyless-kartya /keyless-kulcs/ 301",
      "/szabadkezes-kulcs-szombathely /keyless-kulcs-szombathely/ 301",
      "/keyless-kartya-szombathely /keyless-kulcs-szombathely/ 301",
      "/szabadkezes-kulcs-sarvar /keyless-kulcs-sarvar/ 301",
      "/keyless-kartya-sarvar /keyless-kulcs-sarvar/ 301",
      "/szabadkezes-kulcs-kormend /keyless-kulcs-kormend/ 301",
      "/szabadkezes-kulcs-koszeg /keyless-kulcs-koszeg/ 301",
      "/szabadkezes-kulcs-celldomolk /keyless-kulcs-celldomolk/ 301",
      "/szabadkezes-kulcs-szentgotthard /keyless-kulcs-szentgotthard/ 301",
      "/szabadkezes-kulcs-repcelak /keyless-kulcs-repcelak/ 301",
    ].join("\n") + "\n",
  );

  writeFile(
    path.join(rootDir, "_headers"),
    [
      "/*",
      "  Referrer-Policy: strict-origin-when-cross-origin",
      "  X-Content-Type-Options: nosniff",
      "  X-Frame-Options: SAMEORIGIN",
      "  Permissions-Policy: geolocation=(), camera=(), microphone=()",
      "  Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.tailwindcss.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' https: data:; frame-src https://www.facebook.com; connect-src 'self' https:; base-uri 'self'; form-action 'self';",
      "",
      "/backup/*",
      "  X-Robots-Tag: noindex, nofollow",
      "",
    ].join("\n"),
  );
}

function copyReferenceImages() {
  const targetDir = path.join(rootDir, "assets", "images");
  fs.mkdirSync(targetDir, { recursive: true });

  const images = [referenceImages.hero, ...referenceImages.gallery];
  images.forEach((image) => {
    const sourcePath = path.join(rootDir, "references", "photos", image.source);
    const targetPath = path.join(targetDir, image.target);
    fs.copyFileSync(sourcePath, targetPath);
  });
}

function writeHomePage() {
  const depth = 0;
  const serviceIcons = {
    "autokulcs-masolas": "immobilizer",
    kulcsprogramozas: "programming",
    "keyless-kulcs": "keyless",
    "taviranyitos-autokulcs-javitas": "remote-repair",
    "hibakod-jegyzokonyv": "notes",
    klimatisztitas: "klimacleaning",
  };
  const galleryCards = referenceImages.gallery
    .map(
      (image) => `
        <article class="panel-dark card-glow-border overflow-hidden rounded-2xl">
          <img src="${assetPath(depth, `images/${image.target}`)}" alt="${escapeHtml(image.alt)}" width="${image.width}" height="${image.height}" loading="lazy" class="reference-image">
          <div class="p-6">
            <h3 class="text-xl font-bold text-white">${escapeHtml(image.title)}</h3>
            <p class="mt-3 text-sm leading-7 text-gray-400">${escapeHtml(image.text)}</p>
          </div>
        </article>`,
    )
    .join("\n");

  const brands = activeBrandCatalog
    .map(
      (brand) => `<a href="${pageHref(depth, `${brand.slug}-kulcs`)}" class="brand-link rounded-xl px-4 py-3 text-base font-semibold text-white">
        ${escapeHtml(brand.name)}
      </a>`,
    )
    .join("\n");

  const cityLinks = cityCatalog
    .filter((city) => ["szombathely", "sarvar", "kormend", "koszeg", "celldomolk", "szentgotthard", "repcelak"].includes(city.slug))
    .map(
      (city) =>
        `<a href="${pageHref(depth, `autokulcs-${city.slug}`)}" class="card-glow-border rounded-2xl bg-gray-900/60 px-5 py-4 text-left"><span class="block text-lg font-semibold text-white">${escapeHtml(
          city.name,
        )}</span><span class="mt-2 block text-sm text-gray-400">Autókulcs szolgáltatások ${escapeHtml(city.inessive)} és környékén</span></a>`,
    )
    .join("\n");

  const whyCards = homeContent.whyCards
    .map(
      (card) => `
        <article class="panel-dark card-glow-border rounded-2xl p-6 text-center">
          <div class="icon-badge mx-auto mb-5">${icon(card.icon)}</div>
          <h3 class="text-xl font-bold text-white">${escapeHtml(card.title.hu)}</h3>
          <p class="mt-3 text-sm text-gray-400">${escapeHtml(card.body.hu)}</p>
        </article>`,
    )
    .join("\n");

  const serviceCards = homeContent.services
    .map((serviceKey) => {
      const service = serviceCatalog[serviceKey];
      return `
        <article class="panel-dark card-glow-border rounded-2xl p-6">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h3 class="text-xl font-bold text-white">${escapeHtml(service.name)}</h3>
              <p class="mt-3 text-sm text-gray-400">${escapeHtml(buildHomeServiceSummary(serviceKey))}</p>
            </div>
            <div class="icon-badge flex-shrink-0">${icon(serviceIcons[serviceKey])}</div>
          </div>
          <a href="${pageHref(depth, serviceKey)}" class="mt-5 inline-flex items-center text-sm font-medium text-blue-300 hover:text-white">Részletek megnyitása</a>
        </article>`;
    })
    .join("\n");

  const priceCards = homeContent.prices
    .map(
      (price) => `
        <article class="panel-dark card-glow-border rounded-2xl p-6 text-center">
          <h3 class="text-lg font-bold text-blue-300">${escapeHtml(price.title)}</h3>
          <p class="mt-4 text-4xl font-bold text-white">${escapeHtml(price.price)}</p>
          <p class="mt-4 text-sm text-gray-400">${escapeHtml(price.note)}</p>
        </article>`,
    )
    .join("\n");

  const faqItems = homeContent.faqs
    .map(
      (faq) => `
        <details class="panel-dark card-glow-border rounded-2xl p-6 group">
          <summary class="flex cursor-pointer items-center justify-between gap-4 text-left font-semibold text-white">
            <span>${escapeHtml(faq.question)}</span>
            <span class="text-blue-300 transition group-open:rotate-45">${plusIcon()}</span>
          </summary>
          <p class="mt-4 text-sm leading-7 text-gray-400">${escapeHtml(faq.answer)}</p>
        </details>`,
    )
    .join("\n");

  const html = `<!DOCTYPE html>
<html lang="hu" class="scroll-smooth">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(siteConfig.home.title)}</title>
    <meta name="description" content="${escapeHtml(siteConfig.home.description)}">
    <meta name="robots" content="index,follow">
    <link rel="canonical" href="${siteConfig.primaryDomain}/">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${escapeHtml(siteConfig.home.title)}">
    <meta property="og:description" content="${escapeHtml(siteConfig.home.description)}">
    <meta property="og:url" content="${siteConfig.primaryDomain}/">
    <meta property="og:image" content="${siteConfig.ogImage}">
    <meta name="twitter:card" content="summary_large_image">
    <link rel="icon" href="${rootPath(depth, "favicon.svg")}" type="image/svg+xml">
    <link rel="manifest" href="${rootPath(depth, "site.webmanifest")}">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="${assetPath(depth, "site.css")}">
    <script type="application/ld+json">${jsonLdForHome()}</script>
  </head>
  <body class="bg-black text-gray-300 page-shell">
    <header class="sticky top-0 z-50 border-b border-gray-800 bg-black/75 backdrop-blur-lg">
      <nav class="container mx-auto flex items-center justify-between px-6 py-4">
        <a href="${rootPath(depth, "index.html")}" class="text-2xl font-bold text-white font-orbitron">Vasi<span class="text-blue-400">Autókulcs</span></a>
        <div class="hidden items-center gap-7 text-sm font-medium md:flex">
          <a href="#szolgaltatasok" class="hover:text-blue-300">Szolgáltatások</a>
          <a href="#arak" class="hover:text-blue-300">Árak</a>
          <a href="#tippek" class="hover:text-blue-300">Tippek</a>
          <a href="#kapcsolat" class="hover:text-blue-300">Kapcsolat</a>
        </div>
        <div class="hidden md:block">
          <a href="#kapcsolat" class="btn-glow rounded-md px-5 py-2.5 font-semibold text-white">Ajánlatkérés</a>
        </div>
        <button id="mobile-menu-button" class="md:hidden" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Mobil menü megnyitása">
          ${menuIcon()}
        </button>
      </nav>
      <div id="mobile-menu" class="hidden border-t border-gray-800 px-6 py-4 md:hidden">
        <div class="flex flex-col gap-3 text-sm">
          <a href="#szolgaltatasok" class="hover:text-blue-300">Szolgáltatások</a>
          <a href="#arak" class="hover:text-blue-300">Árak</a>
          <a href="#tippek" class="hover:text-blue-300">Tippek</a>
          <a href="#kapcsolat" class="hover:text-blue-300">Kapcsolat</a>
        </div>
      </div>
    </header>

    <main>
      <section class="hero-bg relative overflow-hidden text-white">
        <canvas id="particle-canvas" class="absolute inset-0 h-full w-full"></canvas>
        <div class="container relative z-10 mx-auto px-6 py-24 md:py-36">
          <div class="mx-auto max-w-4xl text-center">
            <p class="eyebrow mb-4 text-xs font-semibold">Szombathelyen | Vas vármegyei kiszállással</p>
            <h1 class="text-glow text-4xl font-bold leading-tight md:text-6xl">${siteConfig.home.heroTitle.hu}</h1>
            <p class="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-200">${escapeHtml(siteConfig.home.heroLead.hu)}</p>
            <div class="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <a href="#kapcsolat" class="btn-glow rounded-md px-8 py-3.5 text-base font-semibold text-white">Kapcsolatfelvétel</a>
              <a href="#szolgaltatasok" class="btn-secondary rounded-md px-8 py-3.5 text-base font-semibold text-white">Szolgáltatásaink</a>
            </div>
          </div>
        </div>
      </section>

      <section class="border-y border-gray-800 bg-gray-900/80 py-4">
        <div class="container mx-auto px-6">
          <div class="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-base md:text-lg">
            <span class="font-bold text-white">${escapeHtml(siteConfig.home.quickContactLabel.hu)}</span>
            <a href="${siteConfig.business.phonePrimary.href}" class="font-medium hover:text-blue-300">${escapeHtml(siteConfig.business.phonePrimary.name)}: ${escapeHtml(siteConfig.business.phonePrimary.display)}</a>
            <a href="${siteConfig.business.phoneSecondary.href}" class="font-medium hover:text-blue-300">${escapeHtml(siteConfig.business.phoneSecondary.name)}: ${escapeHtml(siteConfig.business.phoneSecondary.display)}</a>
          </div>
        </div>
      </section>

      <div class="space-y-20 py-20 md:space-y-28 md:py-28">
        <section class="container mx-auto px-6 fade-in-section">
          <div class="mx-auto max-w-3xl text-center">
            <p class="eyebrow text-xs font-semibold">Miért minket</p>
            <h2 class="mt-3 text-3xl font-bold text-white md:text-4xl">Gyors segítség, minőségi munka, akár kiszállással</h2>
          </div>
          <div class="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">${whyCards}</div>
        </section>

        <section id="szolgaltatasok" class="container mx-auto px-6 fade-in-section">
          <div class="mx-auto max-w-3xl text-center">
              <p class="eyebrow text-xs font-semibold">Szolgáltatások</p>
            <h2 class="mt-3 text-3xl font-bold text-white md:text-4xl">Miben segíthetünk?</h2>
            <p class="mt-4 text-base leading-7 text-gray-400">Immobilizeres autókulcs másolás, kulcs tanítás, programozás, keyless (szabadkezes) kulcsok, távirányítós autókulcs javítása, diagnosztika és autóklíma-tisztítás egy helyen.</p>
          </div>
          <div class="mt-12 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">${serviceCards}</div>
          <div class="mt-8 flex flex-wrap justify-center gap-3">
            ${homeContent.serviceExtras.map((item) => `<span class="service-chip rounded-full px-4 py-2 text-sm">${escapeHtml(item)}</span>`).join("\n")}
          </div>
        </section>

        <section class="container mx-auto px-6 fade-in-section">
          <div class="mx-auto max-w-3xl text-center">
            <p class="eyebrow text-xs font-semibold">Munkáinkból</p>
            <h2 class="mt-3 text-3xl font-bold text-white md:text-4xl">Autókulcs készítés, tanítás, programozás és javítás</h2>
            <p class="mt-4 text-base leading-7 text-gray-400">Néhány példa azokra a kulcsokra és munkafolyamatokra, amelyekkel ügyfeleink megkeresnek minket.</p>
          </div>
          <div class="mt-12 grid gap-6 lg:grid-cols-3">${galleryCards}</div>
        </section>

        <section id="teruletek" class="container mx-auto px-6 fade-in-section">
          <div class="mx-auto max-w-3xl text-center">
            <p class="eyebrow text-xs font-semibold">Területek</p>
            <h2 class="mt-3 text-3xl font-bold text-white md:text-4xl">Szombathelytől Sárvárig, Körmendtől Répcelakig</h2>
            <p class="mt-4 text-base leading-7 text-gray-400">A felsorolt települések a teljesség igénye nélkül mutatják, hol vehető igénybe szolgáltatásunk.</p>
          </div>
          <div class="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">${cityLinks}</div>
        </section>

        <section id="markak" class="container mx-auto px-6 fade-in-section">
          <div class="panel-dark rounded-3xl p-6 md:p-8 lg:p-10">
            <div class="grid gap-8 lg:grid-cols-[0.9fr_1.6fr] lg:items-center">
              <div class="max-w-xl">
                <p class="eyebrow text-xs font-semibold">Márkák</p>
                <h2 class="mt-3 text-3xl font-bold text-white md:text-4xl">Támogatott autómárkák a teljesség igénye nélkül</h2>
                <p class="mt-4 text-base leading-7 text-gray-400">${escapeHtml(homeContent.brandsIntro.hu)}</p>
              </div>
              <div class="brand-list grid gap-2 sm:grid-cols-2 xl:grid-cols-3">${brands}</div>
            </div>
          </div>
        </section>

        <section id="arak" class="container mx-auto px-6 fade-in-section">
          <div class="mx-auto max-w-3xl text-center">
            <p class="eyebrow text-xs font-semibold">Árak</p>
            <h2 class="mt-3 text-3xl font-bold text-white md:text-4xl">Áraink</h2>
            <p class="mt-4 text-base leading-7 text-gray-400">Az árak tájékoztató jellegűek. A pontos összeg az autó típusától, évjáratától, a kulcs kivitelétől és az elvégzendő munkától függ.</p>
          </div>
          <div class="mt-12 grid gap-6 lg:grid-cols-3">${priceCards}</div>
        </section>

        <section class="container mx-auto px-4 sm:px-6 fade-in-section">
          <div class="mx-auto max-w-3xl text-center">
            <p class="eyebrow text-xs font-semibold">Facebook</p>
            <h2 class="mt-3 text-3xl font-bold text-white md:text-4xl">Aktuális bejegyzésünk</h2>
            <p class="mt-4 text-base leading-7 text-gray-400">A Facebook-tartalom megjelenítéséhez külső tartalom engedélyezése szükséges.</p>
          </div>
          <div class="facebook-placeholder mx-auto mt-6 max-w-xl rounded-2xl border border-gray-800 bg-gray-950/70 p-2 text-center md:p-3">
            <p class="mx-auto max-w-2xl text-sm leading-7 text-gray-400">A Facebook-bejegyzés megjelenítéséhez engedélyezze a külső tartalmakat.</p>
            <button type="button" data-facebook-placeholder-btn class="btn-glow mt-5 rounded-md px-5 py-3 text-sm font-semibold text-white">Külső tartalom engedélyezése</button>
            <div class="mt-5" data-facebook-embed data-facebook-src="${siteConfig.facebookEmbed}"></div>
          </div>
        </section>

        <section id="tippek" class="container mx-auto px-6 fade-in-section">
          <div class="mx-auto max-w-3xl text-center">
            <p class="eyebrow text-xs font-semibold">Gyakori kérdések</p>
            <h2 class="mt-3 text-3xl font-bold text-white md:text-4xl">Gyakori kérdések és hasznos tanácsok</h2>
          </div>
          <div class="mx-auto mt-12 max-w-3xl space-y-4">${faqItems}</div>
        </section>

        <section id="kapcsolat" class="container mx-auto px-6 fade-in-section">
          <div class="panel-dark rounded-3xl p-8 md:p-10">
            <div class="mx-auto max-w-3xl text-center">
              <p class="eyebrow text-xs font-semibold">Kapcsolat</p>
              <h2 class="mt-3 text-3xl font-bold text-white md:text-4xl">Ügyfélfogadás előzetes időpont-egyeztetéssel</h2>
              <p class="mt-4 text-base leading-7 text-gray-400">Kérjük, érkezés előtt egyeztessenek telefonon. Szombathelyen belül a kiszállás nem feláras.</p>
            </div>
            <div class="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div class="panel-dark rounded-2xl p-6 md:p-8">
                <h3 class="text-2xl font-bold text-white">Elérhetőségek</h3>
                <div class="info-list mt-6 space-y-5 text-sm md:text-base">
                  <p class="flex items-start gap-3">${inlineIcon("phone")}<span><a href="${siteConfig.business.phonePrimary.href}">${escapeHtml(siteConfig.business.phonePrimary.name)}: ${escapeHtml(siteConfig.business.phonePrimary.display)}</a></span></p>
                  <p class="flex items-start gap-3">${inlineIcon("phone")}<span><a href="${siteConfig.business.phoneSecondary.href}">${escapeHtml(siteConfig.business.phoneSecondary.name)}: ${escapeHtml(siteConfig.business.phoneSecondary.display)}</a></span></p>
                  <p class="flex items-start gap-3">${inlineIcon("mail")}<span><a href="mailto:${siteConfig.business.email}">${escapeHtml(siteConfig.business.email)}</a></span></p>
                  <p class="flex items-start gap-3">${inlineIcon("facebook")}<span><a href="${siteConfig.business.facebook}" target="_blank" rel="noreferrer">Facebook oldal megnyitása</a></span></p>
                </div>
              </div>
              <div class="panel-dark rounded-2xl p-6 md:p-8">
                <h3 class="text-2xl font-bold text-white">Telephely és működés</h3>
                <div class="mt-6 space-y-5 text-sm leading-7 text-gray-400 md:text-base">
                  <p><strong class="text-white">Telephely:</strong><br>${escapeHtml(siteConfig.business.workshopAddress)}</p>
                  <p><strong class="text-white">Szolgáltatási terület:</strong><br>${escapeHtml(siteConfig.business.serviceArea)}</p>
                  <p><strong class="text-white">Időpont:</strong><br>Ügyfélfogadás előzetes időpont-egyeztetéssel.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>

    ${footerHtml(depth)}
    ${imprintHtml()}
    ${cookieBannerHtml()}
    ${mobileCallBar(depth)}
    <script src="${assetPath(depth, "site.js")}" defer></script>
  </body>
</html>`;

  writeFile(path.join(rootDir, "index.html"), html);
}

function writeLandingPage(page) {
  const depth = 1;
  const pageDir = path.join(rootDir, page.slug);
  fs.mkdirSync(pageDir, { recursive: true });

  const city = getCity(page.citySlug);
  const service = serviceCatalog[page.serviceKey];
  const canonical = `${siteConfig.primaryDomain}/${page.slug}/`;
  const robots = page.noindex ? "noindex,follow" : "index,follow";
  const visibleBreadcrumb = page.breadcrumb
    .map((item, index) =>
      index === page.breadcrumb.length - 1
        ? `<span class="text-gray-300">${escapeHtml(item.name)}</span>`
        : `<a href="${relativeHrefFromAbsolute(item.url, depth)}" class="breadcrumb-link hover:text-white">${escapeHtml(item.name)}</a>`,
    )
    .join(`<span class="mx-2 text-gray-600">/</span>`);

  const relatedLinks = page.related
    .map(
      (link) => `
        <a href="${pageHref(depth, link.slug)}" class="card-glow-border rounded-2xl bg-gray-900/55 px-5 py-4 text-left">
          <span class="block text-base font-semibold text-white">${escapeHtml(link.label)}</span>
          <span class="mt-2 block text-sm text-gray-400">Kapcsolódó oldal megnyitása</span>
        </a>`,
    )
    .join("\n");

  const featureBullets = page.featureBullets
    .map((item) => `<li class="flex items-start gap-3">${inlineIcon("check")}<span>${escapeHtml(item)}</span></li>`)
    .join("\n");

  const faqItems = page.faqs
    .map(
      (faq) => `
        <details class="panel-dark card-glow-border rounded-2xl p-6 group">
          <summary class="flex cursor-pointer items-center justify-between gap-4 text-left font-semibold text-white">
            <span>${escapeHtml(faq.question)}</span>
            <span class="text-blue-300 transition group-open:rotate-45">${plusIcon()}</span>
          </summary>
          <p class="mt-4 text-sm leading-7 text-gray-400">${escapeHtml(faq.answer)}</p>
        </details>`,
    )
    .join("\n");

  const html = `<!DOCTYPE html>
<html lang="hu" class="scroll-smooth">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(page.title)}</title>
    <meta name="description" content="${escapeHtml(page.description)}">
    <meta name="robots" content="${robots}">
    <link rel="canonical" href="${canonical}">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${escapeHtml(page.title)}">
    <meta property="og:description" content="${escapeHtml(page.description)}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="${siteConfig.ogImage}">
    <meta name="twitter:card" content="summary_large_image">
    <link rel="icon" href="${rootPath(depth, "favicon.svg")}" type="image/svg+xml">
    <link rel="manifest" href="${rootPath(depth, "site.webmanifest")}">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="${assetPath(depth, "site.css")}">
    <script type="application/ld+json">${jsonLdForPage(page)}</script>
  </head>
  <body class="bg-black text-gray-300 page-shell">
    <header class="sticky top-0 z-50 border-b border-gray-800 bg-black/75 backdrop-blur-lg">
      <nav class="container mx-auto flex items-center justify-between px-6 py-4">
        <a href="${rootPath(depth, "index.html")}" class="text-2xl font-bold text-white font-orbitron">Vasi<span class="text-blue-400">Autókulcs</span></a>
        <div class="hidden items-center gap-7 text-sm font-medium md:flex">
          <a href="${rootPath(depth, "index.html")}#szolgaltatasok" class="hover:text-blue-300">Szolgáltatások</a>
          <a href="${rootPath(depth, "index.html")}#arak" class="hover:text-blue-300">Árak</a>
          <a href="${rootPath(depth, "index.html")}#tippek" class="hover:text-blue-300">Tippek</a>
          <a href="${rootPath(depth, "index.html")}#kapcsolat" class="hover:text-blue-300">Kapcsolat</a>
        </div>
        <div class="hidden md:block">
          <a href="${rootPath(depth, "index.html")}#kapcsolat" class="btn-glow rounded-md px-5 py-2.5 font-semibold text-white">Ajánlatkérés</a>
        </div>
        <button id="mobile-menu-button" class="md:hidden" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Mobil menü megnyitása">
          ${menuIcon()}
        </button>
      </nav>
      <div id="mobile-menu" class="hidden border-t border-gray-800 px-6 py-4 md:hidden">
        <div class="flex flex-col gap-3 text-sm">
          <a href="${rootPath(depth, "index.html")}#szolgaltatasok" class="hover:text-blue-300">Szolgáltatások</a>
          <a href="${rootPath(depth, "index.html")}#arak" class="hover:text-blue-300">Árak</a>
          <a href="${rootPath(depth, "index.html")}#tippek" class="hover:text-blue-300">Tippek</a>
          <a href="${rootPath(depth, "index.html")}#kapcsolat" class="hover:text-blue-300">Kapcsolat</a>
        </div>
      </div>
    </header>

    <main>
      <section class="hero-bg relative overflow-hidden text-white">
        <canvas id="particle-canvas" class="absolute inset-0 h-full w-full"></canvas>
        <div class="container relative z-10 mx-auto px-6 py-20 md:py-28">
          <nav class="mb-8 text-sm text-gray-300">${visibleBreadcrumb}</nav>
          <div class="max-w-4xl">
            <p class="eyebrow text-xs font-semibold">${escapeHtml(service?.navLabel || "Autókulcs szolgáltatás")}</p>
            <h1 class="mt-4 text-4xl font-bold leading-tight md:text-5xl">${escapeHtml(page.h1)}</h1>
            <p class="mt-6 max-w-3xl text-lg leading-8 text-gray-200">${escapeHtml(page.intro)}</p>
            <div class="mt-8 flex flex-col gap-4 sm:flex-row">
              <a href="${rootPath(depth, "index.html")}#kapcsolat" class="btn-glow rounded-md px-8 py-3.5 text-base font-semibold text-white">Kapcsolatfelvétel</a>
              <a href="${siteConfig.business.phonePrimary.href}" class="btn-secondary rounded-md px-8 py-3.5 text-base font-semibold text-white">Telefonálok</a>
            </div>
          </div>
        </div>
      </section>

      <div class="space-y-16 py-16 md:space-y-20 md:py-20">
        <section class="container mx-auto px-6 fade-in-section">
          <div class="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <article class="content-prose panel-dark rounded-3xl p-8 md:p-10">
              <p class="eyebrow text-xs font-semibold">Részletek</p>
              <h2 class="mt-3 text-3xl font-bold text-white">Mire figyelünk ${city ? escapeHtml(city.regional) : "a szolgáltatás során"}?</h2>
              ${page.paragraphs.map((paragraph) => `<p class="mt-5">${escapeHtml(paragraph)}</p>`).join("\n")}
            </article>
            <aside class="panel-dark rounded-3xl p-8 md:p-10">
              <p class="eyebrow text-xs font-semibold">Fő szempontok</p>
              <h2 class="mt-3 text-3xl font-bold text-white">${escapeHtml(service?.name || "Autókulcs szolgáltatás")}</h2>
              <ul class="mt-6 space-y-4 text-sm leading-7 text-gray-300">${featureBullets}</ul>
            </aside>
          </div>
        </section>

        <section class="container mx-auto px-6 fade-in-section">
          <div class="mx-auto max-w-3xl text-center">
            <p class="eyebrow text-xs font-semibold">Kapcsolódó oldalak</p>
            <h2 class="mt-3 text-3xl font-bold text-white md:text-4xl">Kapcsolódó szolgáltatások és városi oldalak</h2>
          </div>
          <div class="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">${relatedLinks}</div>
        </section>

        <section class="container mx-auto px-6 fade-in-section">
          <div class="mx-auto max-w-3xl text-center">
            <p class="eyebrow text-xs font-semibold">Gyakori kérdések</p>
            <h2 class="mt-3 text-3xl font-bold text-white md:text-4xl">A konkrét lehetőség mindig felméréshez kötött</h2>
          </div>
          <div class="mx-auto mt-10 max-w-3xl space-y-4">${faqItems}</div>
        </section>

        <section class="container mx-auto px-6 fade-in-section">
          <div class="panel-dark rounded-3xl p-8 md:p-10">
            <div class="mx-auto max-w-3xl text-center">
              <p class="eyebrow text-xs font-semibold">Kapcsolat és időpont</p>
              <h2 class="mt-3 text-3xl font-bold text-white md:text-4xl">Ügyfélfogadás előzetes időpont-egyeztetéssel</h2>
              <p class="mt-4 text-base leading-7 text-gray-400">Kérjük, érkezés előtt egyeztessenek telefonon. ${city?.slug === "szombathely" ? "Szombathelyen belül a kiszállás nem feláras." : "Kiszállás előzetes egyeztetéssel kérhető."}</p>
            </div>
            <div class="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
              <div class="panel-dark rounded-2xl p-6">
                <p class="text-lg font-bold text-white">Telefon és e-mail</p>
                <div class="info-list mt-5 space-y-4 text-sm leading-7 text-gray-300">
                  <p class="flex items-start gap-3">${inlineIcon("phone")}<span><a href="${siteConfig.business.phonePrimary.href}">${escapeHtml(siteConfig.business.phonePrimary.name)}: ${escapeHtml(siteConfig.business.phonePrimary.display)}</a></span></p>
                  <p class="flex items-start gap-3">${inlineIcon("phone")}<span><a href="${siteConfig.business.phoneSecondary.href}">${escapeHtml(siteConfig.business.phoneSecondary.name)}: ${escapeHtml(siteConfig.business.phoneSecondary.display)}</a></span></p>
                  <p class="flex items-start gap-3">${inlineIcon("mail")}<span><a href="mailto:${siteConfig.business.email}">${escapeHtml(siteConfig.business.email)}</a></span></p>
                </div>
              </div>
              <div class="panel-dark rounded-2xl p-6">
                <p class="text-lg font-bold text-white">Telephely</p>
                <div class="mt-5 space-y-4 text-sm leading-7 text-gray-300">
                  <p>${escapeHtml(siteConfig.business.workshopAddress)}</p>
                  <p>Szolgáltatási terület: ${escapeHtml(siteConfig.business.serviceArea)}</p>
                  <p><a href="${siteConfig.business.facebook}" target="_blank" rel="noreferrer" class="text-blue-300 hover:text-white">Facebook oldal megnyitása</a></p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>

    ${footerHtml(depth)}
    ${imprintHtml()}
    ${cookieBannerHtml()}
    ${mobileCallBar(depth)}
    <script src="${assetPath(depth, "site.js")}" defer></script>
  </body>
</html>`;

  writeFile(path.join(pageDir, "index.html"), html);
}

function write404Page() {
  const html = `<!DOCTYPE html>
<html lang="hu">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 | ${siteConfig.brandName}</title>
    <meta name="robots" content="noindex,follow">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/assets/site.css">
  </head>
  <body class="bg-black text-gray-300 page-shell">
    <main class="hero-bg min-h-screen">
      <div class="container mx-auto flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p class="eyebrow text-xs font-semibold">404</p>
        <h1 class="mt-4 text-5xl font-bold text-white md:text-6xl">Ez az oldal nem található</h1>
        <p class="mt-6 max-w-2xl text-lg leading-8 text-gray-200">Lehet, hogy az URL megváltozott, vagy átirányítás történt a keresett oldalra. A főoldalról újra el tud indulni.</p>
        <div class="mt-8 flex flex-col gap-4 sm:flex-row">
          <a href="/" class="btn-glow rounded-md px-8 py-3.5 text-base font-semibold text-white">Vissza a főoldalra</a>
          <a href="/#kapcsolat" class="btn-secondary rounded-md px-8 py-3.5 text-base font-semibold text-white">Kapcsolat</a>
        </div>
      </div>
    </main>
    <script src="/assets/site.js" defer></script>
  </body>
</html>`;

  writeFile(path.join(rootDir, "404.html"), html);
}

function writeSitemap(urls) {
  const now = new Date().toISOString();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map(
      (url) => `  <url>\n    <loc>${url}</loc>\n    <lastmod>${now}</lastmod>\n  </url>`,
    )
    .join("\n")}\n</urlset>\n`;

  writeFile(path.join(rootDir, "sitemap.xml"), xml);
}

function writeManifest(entries) {
  writeFile(manifestPath, JSON.stringify(entries, null, 2));
}

function footerHtml(depth = 0) {
  return `<footer class="border-t border-gray-800 bg-black/95">
    <div class="container mx-auto px-6 py-10">
      <div class="footer-grid text-sm text-gray-400">
        <div>
          <p class="text-lg font-bold text-white font-orbitron">Vasi<span class="text-blue-400">Autókulcs</span></p>
          <p class="mt-3 max-w-md leading-7">Immobilizeres autókulcsokkal, keyless (szabadkezes) megoldásokkal, diagnosztikával és autóklíma-tisztítással kapcsolatos szolgáltatások Szombathelyen és Vas vármegyében.</p>
        </div>
        <div>
          <p class="font-semibold text-white">Gyors linkek</p>
          <div class="mt-3 flex flex-col gap-2">
            <a href="${pageHref(depth, "autokulcs-masolas")}" class="footer-link">Autókulcs másolás</a>
            <a href="${pageHref(depth, "kulcsprogramozas")}" class="footer-link">Kulcs tanítás</a>
            <a href="${pageHref(depth, "keyless-kulcs")}" class="footer-link">Keyless kulcs</a>
            <a href="${depth === 0 ? "#kapcsolat" : `${rootPath(depth, "index.html")}#kapcsolat`}" class="footer-link">Kapcsolat</a>
          </div>
        </div>
        <div>
          <p class="font-semibold text-white">Kapcsolat</p>
          <div class="mt-3 flex flex-col gap-2">
            <a href="mailto:${siteConfig.business.email}" class="footer-link">${escapeHtml(siteConfig.business.email)}</a>
            <a href="${siteConfig.business.facebook}" target="_blank" rel="noreferrer" class="footer-link">Facebook</a>
            <button type="button" data-open-imprint class="text-left footer-link">Impresszum</button>
            <button type="button" data-cookie-settings class="text-left footer-link">Cookie-beállítások</button>
            <span class="text-gray-500">${escapeHtml(siteConfig.business.workshopAddress)}</span>
          </div>
        </div>
      </div>
      <p class="mt-8 border-t border-gray-800 pt-6 text-xs text-gray-500">© <span data-current-year></span> ${escapeHtml(siteConfig.brandName)}. Minden jog fenntartva.</p>
    </div>
  </footer>`;
}

function imprintHtml() {
  return `<div id="imprint-modal" class="fixed inset-0 z-50 hidden items-center justify-center bg-black/80 p-4" role="dialog" aria-modal="true" aria-labelledby="imprint-title" tabindex="-1">
    <div class="modal-surface w-full max-w-2xl overflow-y-auto rounded-3xl border border-gray-700 bg-gray-900 p-8 shadow-2xl">
      <div class="flex items-start justify-between gap-4">
        <h2 id="imprint-title" class="text-2xl font-bold text-white">Impresszum</h2>
        <button type="button" data-close-imprint aria-label="Impresszum bezárása" class="rounded-full p-2 text-gray-400 hover:text-white">${closeIcon()}</button>
      </div>
      <div class="content-prose mt-6 space-y-4 text-sm leading-7">
        <p><strong>Szolgáltató neve:</strong> ${escapeHtml(siteConfig.business.legalName)}</p>
        <p><strong>Képviselők:</strong> ${escapeHtml(siteConfig.business.representatives.join(", "))}</p>
        <p><strong>Székhely:</strong> ${escapeHtml(siteConfig.business.registeredOffice)}</p>
        <p><strong>Telephely:</strong> ${escapeHtml(siteConfig.business.workshopAddress)}</p>
        <p><strong>Nyilvántartási szám:</strong> ${escapeHtml(siteConfig.business.registryNumber)}</p>
        <p><strong>Adószám:</strong> ${escapeHtml(siteConfig.business.taxNumber)}</p>
        <p><strong>E-mail:</strong> <a href="mailto:${siteConfig.business.email}">${escapeHtml(siteConfig.business.email)}</a></p>
        <p><strong>Facebook:</strong> <a href="${siteConfig.business.facebook}" target="_blank" rel="noreferrer">Vasi Autókulcs oldal</a></p>
        <p><strong>Cookie-beállítások:</strong> <button type="button" data-cookie-settings class="footer-link">Beállítások megnyitása</button></p>
        <p><strong>Tárhelyszolgáltatás:</strong><br>${escapeHtml(siteConfig.business.hosting.name)}<br>${escapeHtml(siteConfig.business.hosting.address)}</p>
      </div>
    </div>
  </div>`;
}

function cookieBannerHtml() {
  return `<div id="cookie-consent-banner" class="cookie-panel fixed bottom-4 left-4 right-4 z-50 hidden rounded-2xl border border-gray-700 bg-gray-900/95 p-4 md:left-auto md:max-w-xl">
    <div class="flex flex-col items-start justify-between gap-4">
      <p class="text-sm leading-7 text-gray-300">Az oldal a működéshez szükséges technológiákat, valamint engedély esetén külső Facebook-tartalmat használ.</p>
      <div class="flex w-full flex-col gap-3 sm:flex-row">
        <button id="accept-cookies" type="button" class="btn-glow rounded-md px-5 py-3 text-sm font-semibold text-white">Elfogadom</button>
        <button id="decline-cookies" type="button" class="btn-secondary rounded-md px-5 py-3 text-sm font-semibold text-white">Elutasítom</button>
      </div>
    </div>
  </div>`;
}

function mobileCallBar(depth) {
  return `<div class="floating-cta fixed inset-x-0 bottom-0 z-40 border-t border-gray-800 bg-black/90 md:hidden">
    <div class="mx-auto grid max-w-3xl grid-cols-2 gap-3 px-4 pt-3">
      <a href="${depth === 0 ? "#kapcsolat" : `${rootPath(depth, "index.html")}#kapcsolat`}" class="btn-secondary flex min-h-[48px] items-center justify-center rounded-md px-4 py-3 text-sm font-semibold text-white">Kapcsolatfelvétel</a>
      <a href="${siteConfig.business.phonePrimary.href}" class="btn-glow flex min-h-[48px] items-center justify-center rounded-md px-4 py-3 text-sm font-semibold text-white">Hívás most</a>
    </div>
  </div>`;
}

function assetPath(depth, fileName) {
  return depth === 0 ? `assets/${fileName}` : `../assets/${fileName}`;
}

function rootPath(depth, fileName) {
  return depth === 0 ? fileName : `../${fileName}`;
}

function pageHref(depth, slug) {
  return depth === 0 ? `${slug}/index.html` : `../${slug}/index.html`;
}

function relativeHrefFromAbsolute(url, depth) {
  const normalized = url.replace(`${siteConfig.primaryDomain}/`, "");
  if (!normalized) {
    return rootPath(depth, "index.html");
  }
  return pageHref(depth, normalized.replace(/\/$/, ""));
}

function jsonLdForHome() {
  return JSON.stringify(
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "LocalBusiness",
          name: siteConfig.brandName,
          url: `${siteConfig.primaryDomain}/`,
          telephone: [siteConfig.business.phonePrimary.display, siteConfig.business.phoneSecondary.display],
          email: siteConfig.business.email,
          address: {
            "@type": "PostalAddress",
            streetAddress: siteConfig.business.workshopAddress,
            addressCountry: "HU",
          },
          sameAs: [siteConfig.business.facebook],
        },
        {
          "@type": "WebSite",
          name: siteConfig.brandName,
          url: `${siteConfig.primaryDomain}/`,
        },
      ],
    },
    null,
    0,
  );
}

function jsonLdForPage(page) {
  return JSON.stringify(
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "LocalBusiness",
          name: siteConfig.brandName,
          url: `${siteConfig.primaryDomain}/`,
          telephone: [siteConfig.business.phonePrimary.display, siteConfig.business.phoneSecondary.display],
          email: siteConfig.business.email,
          address: {
            "@type": "PostalAddress",
            streetAddress: siteConfig.business.workshopAddress,
            addressCountry: "HU",
          },
          sameAs: [siteConfig.business.facebook],
        },
        {
          "@type": "Service",
          name: page.h1,
          serviceType: serviceCatalog[page.serviceKey]?.name || page.h1,
          provider: {
            "@type": "LocalBusiness",
            name: siteConfig.brandName,
            url: `${siteConfig.primaryDomain}/`,
          },
          areaServed: page.citySlug ? getCity(page.citySlug)?.name : "Vas vármegye",
          url: `${siteConfig.primaryDomain}/${page.slug}/`,
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: page.breadcrumb.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url,
          })),
        },
      ],
    },
    null,
    0,
  );
}

function buildHomeServiceSummary(serviceKey) {
  const summaries = {
    "autokulcs-masolas":
      "Immobilizeres autókulcsok másolása, pótkulcs készítés és a szükséges kulcs tanítási, programozási lépések egy helyen.",
    kulcsprogramozas:
      "Új kulcs tanítása, kulcs programozása, elveszett kulcs pótlása és kulcsfelismerési hibák vizsgálata.",
    "keyless-kulcs":
      "Keyless (szabadkezes) autókulcsok javítása, pótlása és illesztése előzetes egyeztetéssel.",
    "taviranyitos-autokulcs-javitas":
      "Távirányítós autókulcsok gomb-, ház- és működési problémáinak felmérése és javítása.",
    "hibakod-jegyzokonyv":
      "Hibakód-kiolvasás és jegyzőkönyv, ha a kulcshiba vagy az elektronikai probléma pontosítása szükséges.",
    klimatisztitas:
      "Autóklíma-tisztítás és ózonos sterilizálása időpont-egyeztetéssel, vegyszermentes eljárással.",
  };

  return summaries[serviceKey] || "Részletek megtekintése az adott szolgáltatásról.";
}

function getBrandName(brandSlug) {
  return activeBrandCatalog.find((brand) => brand.slug === brandSlug)?.name || "";
}

function isDisabledBrandPage(slug) {
  return Array.from(disabledBrandSlugs).some(
    (brandSlug) => slug === `${brandSlug}-kulcs` || slug.startsWith(`${brandSlug}-kulcs-`),
  );
}

function getCity(citySlug) {
  return cityCatalog.find((city) => city.slug === citySlug) || null;
}

function calculateSimilarity(leftText, rightText) {
  const left = shingleSet(leftText);
  const right = shingleSet(rightText);
  const intersection = new Set([...left].filter((item) => right.has(item)));
  const unionSize = new Set([...left, ...right]).size || 1;
  return intersection.size / unionSize;
}

function shingleSet(text) {
  const tokens = text.split(" ").filter(Boolean);
  const shingles = new Set();
  if (tokens.length < 5) {
    shingles.add(tokens.join(" "));
    return shingles;
  }
  for (let index = 0; index <= tokens.length - 5; index += 1) {
    shingles.add(tokens.slice(index, index + 5).join(" "));
  }
  return shingles;
}

function normalizeText(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9áéíóöőúüű\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(value, length) {
  if (value.length <= length) {
    return value;
  }
  return `${value.slice(0, length - 1).trim()}…`;
}

function sentenceStart(value) {
  return value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : value;
}

function hashString(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

function writeFile(targetPath, contents) {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, contents, "utf8");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function plusIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v12M6 12h12"/></svg>`;
}

function menuIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"/></svg>`;
}

function closeIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`;
}

function inlineIcon(name) {
  return `<span class="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 text-blue-400">${icon(name)}</span>`;
}

function icon(name) {
  const imageIcons = {
    immobilizer: "assets/icons/immobilizer.png",
    keyless: "assets/icons/keyless.png",
    kiszallas: "assets/icons/kiszallas.png",
    programming: "assets/icons/programming.png",
    "remote-repair": "assets/icons/remote-repair.png",
    klimacleaning: "assets/icons/klimacleaning.png",
    notes: "assets/icons/notes.png",
  };

  if (imageIcons[name]) {
    return `<img src="${imageIcons[name]}" alt="" loading="lazy" aria-hidden="true">`;
  }

  const icons = {
    key: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 7a5 5 0 11-9.6 2H3v2h2v2h2v2h2.4A5 5 0 0115 7z"/></svg>`,
    wave: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M5 12a7 7 0 0114 0M8 12a4 4 0 018 0M12 12h.01"/></svg>`,
    location: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 21s-6-4.35-6-10a6 6 0 1112 0c0 5.65-6 10-6 10z"/><circle cx="12" cy="11" r="2.5" stroke-width="1.8"/></svg>`,
    shield: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6l7-3z"/></svg>`,
    phone: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 5a2 2 0 012-2h2.6a1 1 0 01.96.73l1.2 4a1 1 0 01-.48 1.17l-1.75.87a13.3 13.3 0 006.08 6.08l.87-1.75a1 1 0 011.17-.48l4 1.2A1 1 0 0121 16.4V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z"/></svg>`,
    mail: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 6h16v12H4z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 7l8 6 8-6"/></svg>`,
    facebook: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.6 1.7-1.6h1.6V4.8c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.4V11H8v3h2.2v8h3.3z"/></svg>`,
    check: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M5 13l4 4L19 7"/></svg>`,
  };

  return icons[name] || icons.check;
}
