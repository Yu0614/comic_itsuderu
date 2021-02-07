import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();
    await page.goto('https://www.s-manga.net/newcomics/index.html');

    const comicsTitleSelector = '#article-kami > h2';
    await getTextWithSelector(page, comicsTitleSelector);

    const selector =
        '#article-kami > section.card-outer.ジャンプコミックス.ssboy.ssgirl > div > section:nth-child(2) > div > h4 > a > b';
    await getTextWithSelector(page, selector);

    const selector2 =
        '#article-kami > section.card-outer.ジャンプコミックス.ssboy.ssgirl > div > section:nth-child(3) > div > h4 > a > b';

    await getTextWithSelector(page, selector2);

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
