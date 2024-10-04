// const puppeteer = require('puppeteer');

// let addr = "https://www.naver.com/"

// const d = async () => {
//     //1. 크로미움으로 브라우저를 연다. 
// const browser = await puppeteer.launch(); // -> 여기서 여러가지 옵션을 설정할 수 있다.
        
// //2. 페이지 열기
// const page = await browser.newPage();
        
// //3. 링크 이동
// await page.goto(`${addr}`);

// //4. HTML 정보 가지고 온다.
// const content = await page.content();


// console.log(content)
// await page.close();
// await browser.close();


// }

// d();


const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const axios = require('axios');


const crawler = async (crawl_object) => {
    try { 
        const browser = await puppeteer.launch(); 
        const page = await browser.newPage();
        await page.goto(crawl_object.href);
        
        const content = await page.content();
        await page.close();
        await browser.close();

        const $ = cheerio.load(content);
        const result = [];
        $(crawl_object.select_path).each(function (idx, element) {
            const $data = cheerio.load(element);
            const return_data = {};
            crawl_object.items.forEach((item) => {
                if (item.text === true) {
                    return_data[item.name] = $data(item.path).text();
                }

                if (item.href === true) {
                    return_data[item.name] = $data(item.path).attr('href');
                }
            });

			// -> 여기부터는 내부 로직
        });
        //console.log(result);
        return Promise.resolve(result);
    } catch (err) {
        return Promise.reject([]);
    }
};


const post_list_object = {
    href: `https://tlqckd0.tistory.com/48`,
    select_path: '#content-wrap > div > div.board-list > ul > li',
    items: [
        { name: 'counter', path: 'span.count', text: true, href: false },
        { name: 'href', path: 'span.title > a', text: false, href: true },
        { name: 'title', path: 'span.title > a', text: true, href: false },
        { name: 'nick', path: 'span.global-nick', text: true, href: false },
        { name: 'date', path: 'span.date', text: true, href: false },
    ],
    type: 'post',
};

crawler(post_list_object)

module.exports = {
    crawler,
};
