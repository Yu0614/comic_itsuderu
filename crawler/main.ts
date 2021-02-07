import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();
    await page.goto('https://www.s-manga.net/newcomics/index.html');

    const selectors = [
        '#article-kami > h2',
        '#article-kami > section.card-outer.ジャンプコミックス.ssboy.ssgirl > div > section:nth-child(2) > div > h4 > a > b',
        '#article-kami > section.card-outer.ジャンプコミックス.ssboy.ssgirl > div > section:nth-child(3) > div > h4 > a > b'
    ] as string[];

    for await (const selector of selectors) {
        await getTextWithSelector(page, selector);
    }

    await browser.close();
})();

/**
 * Returns textContents gained from HTML selected by given selector.
 * @param {*} page // puppeteer.Page
 * @param {*} selector // string
 */
async function getTextWithSelector(
    page: puppeteer.Page,
    selector: string
): Promise<string> {
    const elementHandle = await page?.$(selector);
    const value = await (
        await elementHandle?.getProperty('textContent')
    )?.jsonValue();

    console.log('value: ', value);
    return value as string;
}
