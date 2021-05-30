
const puppy = require("puppeteer");
const  id = "xivos84354@ddwfzp.com";
//name-random nan
const password = "passnan123";

async function main()
{
    let browser = await puppy.launch(
        {
            headless: false  , //chrome browser will be visible
            defaultViewport : false
        });
    let tabs = await browser.pages();
    //console.log(tabs.length);
    let tab = tabs[0];
    
    //await tab.goto("https://www.youtube.com")
    //await tab.goto("https://www.hackerrank.com")
    await tab.goto("https://www.hackerrank.com/auth/login") // await makes async func waits for first method to execute completely
    //console.log(tabs.length);
    //browser.close();
    await tab.type('#input-1',id);
    await tab.type('#input-2',password);
    await tab.click(".ui-btn.ui-btn-large.ui-btn-primary.auth-button.ui-btn-styled");
    await tab.waitForSelector("#base-card-1-link",{visible:true});
    await tab.click("#base-card-1-link");
    await tab.waitForSelector('a[data-attr1="warmup"]',{visible:true});
    await tab.click('a[data-attr1="warmup"]');
    await tab.waitForSelector('.js-track-click.challenge-list-item',{visible:true});
    let problems = await tab.$$(".js-track-click.challenge-list-item");
    //console.log(problems.length);
    let problemsUrls = [];
    for(let i=0;i<problems.length;i++)
        {
            let url = await tab.evaluate(function(ele)
            {
               return ele.getAttribute("href");
            },problems[i]);
           // console.log("https://www.hackerrank.com" + url);
           problemsUrls.push(url);
        }
        for(let i=0;i<problemsUrls.length;i++)
            await solveChallenges("https://www.hackerrank.com" + problemsUrls[i],tab);
}

async function solveChallenges(url,tab)
{
    let problemUrl = url.replace("?","/problem?");
    let editorialUrl = url.replace("?","/editorial?");
    await tab.goto(editorialUrl);
    let languages = await tab.$$('.hackdown-content h3');
    for(let i = 0; i < languages.length; i++)
    {
        let languageName = await tab.evaluate(function (ele){
            return ele.textContent; //return ele.innerText; works similarly
        }, languages[i]);
       //console.log(languageName);
       if(languageName == "C++"){
        let codes = await tab.$$('.hackdown-content .highlight');
           let code = await tab.evaluate(function (ele){
               return ele.innerText;
           },codes[i]);
           //console.log(code);
           await tab.goto(problemUrl);
           await tab.waitForSelector('.checkbox-input',{visible:true});
           await tab.click('.checkbox-input');
           await tab.type('#input-1',code);
           await tab.keyboard.down('Control');
           await tab.keyboard.press('A');
           await tab.keyboard.press('X');
           await tab.click('.monaco-scrollable-element.editor-scrollable.vs');
           await tab.keyboard.press('A');
           await tab.keyboard.press('V');
           await tab.keyboard.up('Control');          
           await tab.click('.ui-btn.ui-btn-normal.ui-btn-primary.pull-right.hr-monaco-submit.ui-btn-styled');
           await tab.waitForSelector('.congrats-heading',{visible: true});
            return;
       }
}
}
    

main();


