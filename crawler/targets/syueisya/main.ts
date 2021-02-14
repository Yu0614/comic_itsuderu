import puppeteer from 'puppeteer';
const FileSystem = require('fs');

(async () => {
    let title = '';
    let comicData = [];
    const result = [];
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // gain selector lists of categories
    const selectors = JSON.parse(
        FileSystem.readFileSync('targets/syueisya/target-categories.json')
    );

    // gain targetSites for visit
    const target: { targetSites: [] } = JSON.parse(
        FileSystem.readFileSync('targets/syueisya/target-sites.json')
    );

    // crawl target site and gain img,title,link
    for await (const site of target.targetSites) {
        await page.goto(site);

        // gain data title
        const dataTitleSelector = '#article-kami > h2';
        title = await getTitle(page, dataTitleSelector);

        for await (const selector of selectors) {
            const comics = await getTextWithSelector(page, selector);
            const target = {
                category: selector,
                comics
            };
            if (comics.length > 1) {
                comicData.push(target);
            }
        }

        const data = {
            title,
            data: comicData
        };

        result.push(data);

        comicData = []; // reset the loop result
    }

    // output as json
    FileSystem.writeFile(
        'targets/syueisya/data/paper-comics-releases.json',
        JSON.stringify(result),
        () => {}
    );

    await browser.close();
    console.log('SUCCESSFULLY PROGRAM EXECUTED');
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
        const dateSelector = `#article-kami > section.card-outer.${selector} > div > section:nth-child(${i}) > div > p:nth-child(${3})`;

        const titleHandler = await page?.$(titleSelector);
        const urlHandler = await page?.$(urlSelector);
        const imgHandler = await page?.$(imgSelector);
        const dateHandler = await page?.$(dateSelector);

        const title = await getContent(titleHandler, 'textContent');
        const url = await getContent(urlHandler, 'href');
        const img = await getContent(imgHandler, 'src');

        let date = await getContent(dateHandler, 'textContent');
        if (date !== undefined) {
            date = date.replace('発売', '');
            date = date.replace('日', '');
            date = date.replace('年', '/');
            date = date.replace('月', '/');
        }

        if (title === undefined || title === null) {
            return comics;
        }

        const comic = {
            title: title as string,
            url: url as string,
            img: img as string,
            date: date as string
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
