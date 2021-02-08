import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();
    await page.goto('https://www.s-manga.net/newcomics/index.html');

    // gain data title
    const dataTitleSelector = '#article-kami > h2';
    const title = await getTitle(page, dataTitleSelector);

    // gain comic title
    const selectors = [
        'ジャンプコミックス',
        'ヤングジャンプコミックス',
        'マーガレットコミックス'
    ] as string[];

    for await (const selector of selectors) {
        const comics = await getTextWithSelector(page, selector);
        console.log('selector: ', selector);
        console.log('comics: ', comics);
    }

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
        const comicTitleSelector = `#article-kami > section.card-outer.${selector} > div > section:nth-child(${i}) > div > h4 > a > b`;
        const comicUrlSelector = `#article-kami > section.card-outer.${selector} > div > section:nth-child(${i}) > figure > a`;
        const comicImgSelector = `#article-kami > section.card-outer.${selector} > div > section:nth-child(${i}) > figure > a > img`;

        const titleHandler = await page?.$(comicTitleSelector);
        const urlHandler = await page?.$(comicUrlSelector);
        const imgHandler = await page?.$(comicImgSelector);

        const comicTitle = await getContent(titleHandler, 'textContent');
        const comicUrl = await getContent(urlHandler, 'href');
        const comicImg = await getContent(imgHandler, 'href');

        if (comicTitle === undefined || comicTitle === null) {
            return comics;
        }

        const comic = {
            title: comicTitle as string,
            url: comicUrl as string,
            img: comicImg as string ?? null
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
