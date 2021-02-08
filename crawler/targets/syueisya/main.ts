import puppeteer from 'puppeteer';
const FileSystem = require('fs');

(async () => {
    const comicData = [];
    const browser = await puppeteer.launch();

    const page = await browser.newPage();
    await page.goto('https://www.s-manga.net/newcomics/index.html');

    // gain data title
    const dataTitleSelector = '#article-kami > h2';
    const title = await getTitle(page, dataTitleSelector);

    // gain comic title and url and img
    const selectors = JSON.parse(
        FileSystem.readFileSync('targets/syueisya/target-categories.json')
    );

    for await (const selector of selectors) {
        const comics = await getTextWithSelector(page, selector);
        const target = {
            category: selector,
            comics: comics
        };
        comicData.push(target);
    }

    const data = {
        title: title,
        data: comicData
    };

    // output as json
    FileSystem.writeFile(
        'targets/syueisya/data/paper-comics-releases.json',
        JSON.stringify(data),
        () => {}
    );

    await browser.close();
})();

/**
 * Returns title gained from HTML selected by given selector.
 * @param {*} page puppeteer.Page
 * @param {*} selector string
 */
async function getTitle(
    page: puppeteer.Page,
    selector: string
): Promise<string> {
    const elementHandler = await page?.$(selector);
    const value = await getContent(elementHandler, 'textContent');

    return value as string;
}

/**
 * Returns textContents and its url gained from HTML selected by given selector.
 * @param {*} page puppeteer.Page
 * @param {*} selector string
 */
async function getTextWithSelector(
    page: puppeteer.Page,
    selector: string
): Promise<{ title: string; url: string; img: string }[]> {
    const comics: { title: string; url: string; img: string }[] = [];

    for (let i = 2; i < 1000; i++) {
        const titleSelector = `#article-kami > section.card-outer.${selector} > div > section:nth-child(${i}) > div > h4 > a > b`;
        const urlSelector = `#article-kami > section.card-outer.${selector} > div > section:nth-child(${i}) > figure > a`;
        const imgSelector = `#article-kami > section.card-outer.${selector} > div > section:nth-child(${i}) > figure > a > img`;

        const titleHandler = await page?.$(titleSelector);
        const urlHandler = await page?.$(urlSelector);
        const imgHandler = await page?.$(imgSelector);

        const title = await getContent(titleHandler, 'textContent');
        const url = await getContent(urlHandler, 'href');
        const img = await getContent(imgHandler, 'src');

        if (title === undefined || title === null) {
            return comics;
        }

        const comic = {
            title: title as string,
            url: url as string,
            img: img as string
        };

        comics.push(comic);
    }

    return comics;
}

/**
 * Returns Promise wrapped object getting Text element from html.
 * @param handler puppeteer.ElementHandle<Element>
 */
async function getContent(
    handler: puppeteer.ElementHandle<Element> | null,
    element: string
): Promise<string> {
    return (await (await handler?.getProperty(element))?.jsonValue()) as string;
}
